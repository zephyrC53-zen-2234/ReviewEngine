import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ratingSchema, signupSchema, productSchema } from '../lib/validation';
test('ratings reject zero, fractions, over-five, and string inputs', () => {
    for (const overall of [0, 6, 2.5, '5', NaN])
        assert.equal(ratingSchema.safeParse({ productId: 'p', overall }).success, false);
    assert.equal(ratingSchema.safeParse({ productId: 'p', overall: 5, easeOfUse: null }).success, true);
    assert.equal(ratingSchema.safeParse({ productId: 'p', overall: 5, features: 6 }).success, false);
});
test('registration normalizes identity and rejects invalid usernames', () => {
    const result = signupSchema.parse({ username: 'Alex_Dev', email: 'ALEX@example.com', password: 'a-long-password' });
    assert.equal(result.username, 'alex_dev');
    assert.equal(result.email, 'alex@example.com');
    assert.equal(signupSchema.safeParse({ ...result, username: '<script>' }).success, false);
    assert.equal(signupSchema.safeParse({ ...result, password: 'short' }).success, false);
    assert.equal(signupSchema.safeParse({ ...result, password: '🔒'.repeat(20) }).success, false);
});
test('catalog rejects executable URL schemes and path traversal', () => {
    const product = { name: 'Example', slug: 'example', description: 'Example product', categoryId: 'c', websiteUrl: 'https://example.com' };
    assert.equal(productSchema.safeParse(product).success, true);
    assert.equal(productSchema.safeParse({ ...product, websiteUrl: 'javascript:alert(1)' }).success, false);
    assert.equal(productSchema.safeParse({ ...product, logo: '/uploads/../../secret.png' }).success, false);
    assert.equal(productSchema.safeParse({ ...product, slug: '../admin' }).success, false);
});
