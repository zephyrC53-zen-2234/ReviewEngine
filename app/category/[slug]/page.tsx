import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { getProducts } from '@/lib/data';
import { Catalog } from '@/components/catalog';
type Props = {
    params: Promise<{
        slug: string;
    }>;
};
export async function generateMetadata({ params }: Props) { const { slug } = await params; const c = await db.category.findUnique({ where: { slug } }); return { title: c ? `${c.name} Apps & Websites` : 'Category not found', description: c?.description }; }
export default async function Category({ params }: Props) { const { slug } = await params; const category = await db.category.findUnique({ where: { slug } }); if (!category)
    notFound(); const products = await getProducts(slug); return <main className="container page"><div className="breadcrumbs"><Link href="/categories">Categories</Link> / {category.name}</div><header className="page-heading"><span className="eyebrow">THE BEST IN {category.name.toUpperCase()}</span><h1>{category.name} Apps & Websites</h1><p>{category.description}</p></header><Catalog products={products}/><p className="hint">Default rankings use a Bayesian score with 20 prior ratings at 3.5 stars, so a handful of perfect scores won’t outweigh a well-established track record. Displayed stars remain the actual community average.</p></main>; }
