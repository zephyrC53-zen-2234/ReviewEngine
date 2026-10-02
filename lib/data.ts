import { cache } from 'react';
import { db } from './db';
import { Prisma } from '@/generated/prisma/client';
import { bayesian, trendScore } from './ranking';
export const dimensions = ['overall', 'easeOfUse', 'features', 'performance', 'value', 'userExperience'] as const;
export const dimensionLabels = {
    overall: 'Overall rating', easeOfUse: 'Ease of use', features: 'Features',
    performance: 'Performance', value: 'Value for money', userExperience: 'User experience',
};
// Aggregate in PostgreSQL instead of transferring every rating to the application.
export const getProducts = cache(async (category?: string) => {
    const week = new Date(Date.now() - 7 * 86400000);
    const previousWeek = new Date(Date.now() - 14 * 86400000);
    const filter = category ? { product: { category: { slug: category } } } : {};
    const [products, averages, distributions, recentRatings, previousRatings, recentReviews, visits] = await Promise.all([
        db.product.findMany({
            where: category ? { category: { slug: category } } : undefined,
            include: { category: true, _count: { select: { ratings: true, reviews: { where: { approved: true } } } } },
        }),
        db.rating.groupBy({ by: ['productId'], where: filter, _avg: { overall: true, easeOfUse: true, features: true, performance: true, value: true, userExperience: true } }),
        db.rating.groupBy({ by: ['productId', 'overall'], where: filter, _count: { _all: true } }),
        db.rating.groupBy({ by: ['productId'], where: { ...filter, createdAt: { gte: week } }, _count: { _all: true } }),
        db.rating.groupBy({ by: ['productId'], where: { ...filter, createdAt: { gte: previousWeek, lt: week } }, _count: { _all: true } }),
        db.review.groupBy({ by: ['productId'], where: { ...filter, approved: true, createdAt: { gte: week } }, _count: { _all: true } }),
        db.visit.groupBy({ by: ['productId'], where: { ...filter, createdAt: { gte: week } }, _count: { _all: true } }),
    ]);
    const averageMap = new Map(averages.map(r => [r.productId, r._avg]));
    const countMap = (rows: {
        productId: string;
        _count: {
            _all: number;
        };
    }[]) => new Map(rows.map(r => [r.productId, r._count._all]));
    const recentMap = countMap(recentRatings), previousMap = countMap(previousRatings);
    const reviewMap = countMap(recentReviews), visitMap = countMap(visits);
    const distributionMap = new Map(distributions.map(r => [`${r.productId}:${r.overall}`, r._count._all]));
    return products.map(p => {
        const scores = Object.fromEntries(dimensions.map(d => [d, averageMap.get(p.id)?.[d] ?? 0])) as Record<typeof dimensions[number], number>;
        return {
            id: p.id, name: p.name, slug: p.slug, description: p.description, logo: p.logo,
            color: p.color, websiteUrl: p.websiteUrl, pros: p.pros, cons: p.cons,
            category: p.category, createdAt: p.createdAt.toISOString(),
            count: p._count.ratings, reviewCount: p._count.reviews, scores, average: scores.overall,
            weighted: bayesian(scores.overall, p._count.ratings),
            distribution: [5, 4, 3, 2, 1].map(stars => distributionMap.get(`${p.id}:${stars}`) ?? 0),
            trending: trendScore(recentMap.get(p.id) ?? 0, previousMap.get(p.id) ?? 0, reviewMap.get(p.id) ?? 0, visitMap.get(p.id) ?? 0),
        };
    }).sort((a, b) => b.weighted - a.weighted || b.count - a.count || a.name.localeCompare(b.name));
});
export type ProductSummary = Awaited<ReturnType<typeof getProducts>>[number];
export const getCategories = cache(() => db.category.findMany({ include: { _count: { select: { products: true } } }, orderBy: { name: 'asc' } }));
export async function getReviews(productId?: string, sort = 'recent', page = 1, userId?: string) {
    const where = { approved: true, ...(productId ? { productId } : {}), ...(userId ? { userId } : {}) };
    const offset = (page - 1) * 6;
    let ids: string[] | undefined;
    if (sort === 'helpful') {
        const ranked = await db.$queryRaw<{
            id: string;
        }[]>(Prisma.sql `
      SELECT r.id FROM "Review" r
      LEFT JOIN "ReviewVote" v ON v."reviewId" = r.id AND v.helpful = true
      WHERE r.approved = true
      ${productId ? Prisma.sql `AND r."productId" = ${productId}` : Prisma.empty}
      ${userId ? Prisma.sql `AND r."userId" = ${userId}` : Prisma.empty}
      GROUP BY r.id ORDER BY COUNT(v.id) DESC, r."createdAt" DESC, r.id
      LIMIT 6 OFFSET ${offset}
    `);
        ids = ranked.map(r => r.id);
    }
    const [total, reviews] = await Promise.all([
        db.review.count({ where }),
        db.review.findMany({
            where: { ...where, ...(ids ? { id: { in: ids } } : {}) },
            include: { user: { select: { username: true, avatar: true, isSample: true } }, product: { select: { name: true, slug: true, color: true } }, votes: { select: { helpful: true, userId: true } } },
            orderBy: sort === 'highest' ? [{ rating: 'desc' }, { id: 'asc' }] : sort === 'lowest' ? [{ rating: 'asc' }, { id: 'asc' }] : [{ createdAt: 'desc' }, { id: 'asc' }],
            skip: ids ? undefined : offset, take: 6,
        }),
    ]);
    if (ids)
        reviews.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
    return { total, reviews: reviews.map(r => ({ ...r, createdAt: r.createdAt.toISOString(), updatedAt: r.updatedAt.toISOString() })) };
}
