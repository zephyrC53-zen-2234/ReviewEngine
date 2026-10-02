import 'dotenv/config';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
const base = process.env.NEXTAUTH_URL || 'http://localhost:3000';
if (!['localhost', '127.0.0.1'].includes(new URL(base).hostname)) {
    throw new Error('Smoke tests create temporary accounts and are limited to a local development server.');
}
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
const suffix = randomBytes(6).toString('hex');
const password = randomBytes(24).toString('base64url');
const usernames = [`test_${suffix}_a`, `test_${suffix}_b`, `test_${suffix}_admin`];
const createdIds: string[] = [];
let categoryId: string | undefined;
let productId: string | undefined;
let competitorId: string | undefined;
class Client {
    cookies = new Map<string, string>();
    async request(path: string, method = 'GET', body?: object | URLSearchParams, origin = base) {
        const form = body instanceof URLSearchParams;
        const response = await fetch(`${base}${path}`, {
            method, redirect: 'manual', signal: AbortSignal.timeout(30000),
            headers: { origin, cookie: [...this.cookies].map(([k, v]) => `${k}=${v}`).join('; '), ...(body ? { 'Content-Type': form ? 'application/x-www-form-urlencoded' : 'application/json' } : {}) },
            body: body ? (form ? body.toString() : JSON.stringify(body)) : undefined,
        });
        for (const cookie of response.headers.getSetCookie()) {
            const pair = cookie.split(';')[0], equals = pair.indexOf('=');
            this.cookies.set(pair.slice(0, equals), pair.slice(equals + 1));
        }
        return response;
    }
    async login(email: string) {
        const csrf = await (await this.request('/api/auth/csrf')).json();
        const response = await this.request('/api/auth/callback/credentials', 'POST', new URLSearchParams({ email, password, csrfToken: csrf.csrfToken, callbackUrl: base, json: 'true' }));
        assert.equal(response.status, 200, await response.text());
        const session = await (await this.request('/api/auth/session')).json();
        assert.ok(session.user?.id, 'Authenticated session must identify its user');
        return session;
    }
}
async function expectOK(response: Response, expected = 200) {
    const text = await response.text();
    assert.equal(response.status, expected, text);
    return text ? JSON.parse(text) : null;
}
async function main() {
    const guest = new Client(), author = new Client(), voter = new Client(), admin = new Client();
    for (const path of ['/', '/categories', '/rankings', '/trending', '/compare', '/login', '/signup', '/robots.txt', '/sitemap.xml']) {
        const response = await guest.request(path);
        assert.equal(response.status, 200, `${path}: ${await response.text()}`);
    }
    console.log('PASS public pages and SEO endpoints');
    for (const username of usernames) {
        await expectOK(await guest.request('/api/signup', 'POST', { username, email: `${username}@test.invalid`, password, role: 'ADMIN' }), 201);
        const user = await db.user.findUniqueOrThrow({ where: { username } });
        createdIds.push(user.id);
        assert.equal(user.role, 'USER', 'Signup cannot assign an admin role');
    }
    await db.user.update({ where: { id: createdIds[2] }, data: { role: 'ADMIN' } });
    await author.login(`${usernames[0]}@test.invalid`);
    await voter.login(`${usernames[1]}@test.invalid`);
    await admin.login(`${usernames[2]}@test.invalid`);
    console.log('PASS registration, login, and safe role assignment');
    const categorySlug = `test-${suffix}`;
    const category = { name: `Test category ${suffix}`, slug: categorySlug, description: 'Temporary integration test category' };
    assert.equal((await guest.request('/api/admin/categories', 'POST', category)).status, 401);
    assert.equal((await author.request('/api/admin/categories', 'POST', category)).status, 403);
    assert.equal((await admin.request('/api/admin/categories', 'POST', category, 'https://untrusted.invalid')).status, 403);
    await expectOK(await admin.request('/api/admin/categories', 'POST', category));
    categoryId = (await db.category.findUniqueOrThrow({ where: { slug: categorySlug } })).id;
    const productSlug = `test-product-${suffix}`;
    const product = { name: `Test product ${suffix}`, slug: productSlug, categoryId, description: 'Temporary product used for integration tests.', websiteUrl: 'https://example.com' };
    await expectOK(await admin.request('/api/admin/products', 'POST', product));
    productId = (await db.product.findUniqueOrThrow({ where: { slug: productSlug } })).id;
    await expectOK(await admin.request('/api/admin/products', 'POST', { ...product, name: 'Competitor', slug: `competitor-${suffix}` }));
    competitorId = (await db.product.findUniqueOrThrow({ where: { slug: `competitor-${suffix}` } })).id;
    assert.equal((await author.request('/api/ratings', 'PUT', { productId, overall: 6 })).status, 400);
    assert.equal((await guest.request('/api/ratings', 'PUT', { productId, overall: 5 })).status, 401);
    await expectOK(await author.request('/api/ratings', 'PUT', { productId, overall: 5, easeOfUse: 4, title: 'First review', content: 'A detailed temporary review for testing.' }));
    await expectOK(await author.request('/api/ratings', 'PUT', { productId, overall: 4, easeOfUse: 3, title: 'Updated review', content: 'An updated temporary review for testing.' }));
    assert.equal(await db.rating.count({ where: { productId, userId: createdIds[0] } }), 1);
    assert.equal(await db.review.count({ where: { productId, userId: createdIds[0] } }), 1);
    await expectOK(await voter.request('/api/ratings', 'PUT', { productId, overall: 2 }));
    const summaries = await expectOK(await guest.request(`/api/products?category=${categorySlug}`));
    const summary = summaries.find((p: {
        id: string;
    }) => p.id === productId);
    assert.equal(summary.average, 3);
    assert.equal(summary.count, 2);
    assert.deepEqual(summary.distribution, [0, 1, 0, 1, 0]);
    await assert.rejects(db.rating.create({ data: { productId, userId: createdIds[2], overall: 6 } }));
    console.log('PASS rating creation, update, uniqueness, dynamic aggregates, and database constraints');
    const review = await db.review.findUniqueOrThrow({ where: { userId_productId: { userId: createdIds[0], productId } } });
    await expectOK(await voter.request(`/api/reviews/${review.id}`, 'DELETE'));
    assert.ok(await db.review.findUnique({ where: { id: review.id } }), 'Another user cannot delete a review');
    assert.equal((await author.request(`/api/votes/${review.id}`, 'POST', { helpful: true })).status, 400);
    await expectOK(await voter.request(`/api/votes/${review.id}`, 'POST', { helpful: true }));
    await expectOK(await voter.request(`/api/votes/${review.id}`, 'POST', { helpful: false }));
    assert.equal(await db.reviewVote.count({ where: { reviewId: review.id } }), 1);
    assert.equal((await db.reviewVote.findFirstOrThrow({ where: { reviewId: review.id } })).helpful, false);
    await expectOK(await voter.request(`/api/reports/${review.id}`, 'POST', { reason: 'Temporary test report for moderation.' }));
    const report = await db.report.findFirstOrThrow({ where: { reviewId: review.id } });
    await expectOK(await admin.request(`/api/admin/reviews/${review.id}`, 'PATCH', { approved: false }));
    assert.equal((await expectOK(await guest.request(`/api/reviews?productId=${productId}`))).total, 0);
    await expectOK(await author.request('/api/ratings', 'PUT', { productId, overall: 4, content: 'Edited while hidden; must remain hidden.' }));
    assert.equal((await db.review.findUniqueOrThrow({ where: { id: review.id } })).approved, false);
    await expectOK(await admin.request(`/api/admin/reviews/${review.id}`, 'PATCH', { approved: true }));
    await expectOK(await admin.request(`/api/admin/reports/${report.id}`, 'PATCH'));
    assert.equal((await db.report.findUniqueOrThrow({ where: { id: report.id } })).status, 'RESOLVED');
    console.log('PASS review ownership, vote uniqueness, reporting, and moderation');
    for (const sort of ['recent', 'helpful', 'highest', 'lowest']) {
        assert.equal((await expectOK(await guest.request(`/api/reviews?productId=${productId}&sort=${sort}`))).total, 1);
    }
    const search = await expectOK(await guest.request(`/api/search?q=${suffix}`));
    assert.ok(search.products.some((p: {
        slug: string;
    }) => p.slug === productSlug));
    assert.equal((await guest.request(`/category/${categorySlug}`)).status, 200);
    assert.equal((await guest.request(`/product/${productSlug}`)).status, 200);
    assert.equal((await guest.request(`/compare/${productSlug}-vs-competitor-${suffix}`)).status, 200);
    // Server-streamed not-found pages may retain a 200 status; their UI must show 404.
    const invalid = await guest.request(`/compare/${productSlug}-vs-${productSlug}`);
    assert.ok((await invalid.text()).includes('This page is off the map'));
    assert.equal((await admin.request('/admin')).status, 200);
    assert.ok((await (await author.request('/admin')).text()).includes('Administrator access required'));
    assert.equal((await author.request(`/profile/${usernames[0]}`)).status, 200);
    console.log('PASS search, sorting, category/product pages, comparison, profiles, and admin access');
    await expectOK(await author.request(`/api/ratings/${productId}`, 'DELETE'));
    assert.equal(await db.rating.count({ where: { productId, userId: createdIds[0] } }), 0);
    assert.equal(await db.review.count({ where: { productId, userId: createdIds[0] } }), 0);
    assert.equal(await db.reviewVote.count({ where: { reviewId: review.id } }), 0);
    const csrf = await (await author.request('/api/auth/csrf')).json();
    await author.request('/api/auth/signout', 'POST', new URLSearchParams({ csrfToken: csrf.csrfToken, json: 'true' }));
    assert.ok(!(await (await author.request('/api/auth/session')).json()).user?.id);
    console.log('PASS deletion cascades and logout');
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
    if (productId || competitorId)
        await db.product.deleteMany({ where: { id: { in: [productId, competitorId].filter((v): v is string => !!v) } } });
    if (categoryId)
        await db.category.deleteMany({ where: { id: categoryId } });
    if (createdIds.length)
        await db.user.deleteMany({ where: { id: { in: createdIds } } });
    await db.$disconnect();
});
