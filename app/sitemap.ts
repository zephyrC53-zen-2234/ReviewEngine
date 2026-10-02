import type { MetadataRoute } from 'next';
import { db } from '@/lib/db';
export const dynamic = 'force-dynamic';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> { const base = process.env.NEXTAUTH_URL || 'http://localhost:3000'; const [products, categories] = await Promise.all([db.product.findMany({ select: { slug: true } }), db.category.findMany({ select: { slug: true } })]); return ['', '/categories', '/rankings', '/trending', '/compare', ...products.map(p => `/product/${p.slug}`), ...categories.map(c => `/category/${c.slug}`)].map(path => ({ url: `${base}${path}`, changeFrequency: 'weekly', priority: path === '' ? 1 : .7 })); }
