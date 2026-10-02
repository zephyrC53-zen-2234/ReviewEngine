'use client';
import Link from 'next/link';
import { Star, Plus, Check, ArrowUpRight, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import type { ProductSummary } from '@/lib/data';
import { useComparison } from './providers';
export function ProductLogo({ name, color, logo, size = '' }: {
    name: string;
    color: string;
    logo?: string | null;
    size?: string;
}) { const [failed, setFailed] = useState(false); return <span className={`product-logo ${size}`} style={{ background: color }}>{logo && !failed ? <img src={logo} alt={`${name} logo`} onError={() => setFailed(true)}/> : <span>{name === 'ChatGPT' ? '✳' : name === 'Claude' ? '✴' : name === 'Spotify' ? '≋' : name === 'Gemini' ? '✦' : name === 'Netflix' ? 'N' : name.slice(0, 2)}</span>}</span>; }
export function CompareButton({ product }: {
    product: ProductSummary;
}) { const { items, toggle } = useComparison(); const selected = items.some(i => i.slug === product.slug); return <button className={`compare-button ${selected ? 'selected' : ''}`} onClick={() => toggle({ slug: product.slug, name: product.name, category: product.category.name })}>{selected ? <Check size={15}/> : <Plus size={15}/>} {selected ? 'Added' : 'Compare'}</button>; }
export function Stars({ value }: {
    value: number;
}) { return <span className="stars" aria-label={`${value.toFixed(1)} out of 5 stars`}>{[1, 2, 3, 4, 5].map(i => <Star key={i} size={13} fill={i <= Math.round(value) ? 'currentColor' : 'none'}/>)}</span>; }
export function ProductCard({ product: p, rank }: {
    product: ProductSummary;
    rank?: number;
}) { return <article className="product-card"><div className="card-top"><ProductLogo name={p.name} color={p.color} logo={p.logo}/>{rank ? <span className="rank-badge">#{rank} in {p.category.name}</span> : <span className="category-tag">{p.category.name}</span>}</div><Link className="product-name" href={`/product/${p.slug}`}>{p.name}<ArrowUpRight size={17}/></Link><p>{p.description}</p><div className="rating-line"><strong>{p.count ? p.average.toFixed(1) : 'New'}</strong><Stars value={p.average}/><small>({p.count} ratings)</small></div><div className="card-bottom"><span className="trend"><TrendingUp size={14}/> {p.trending > 0 ? 'Trending' : 'Discover'}</span><CompareButton product={p}/></div></article>; }
export function ProductRow({ product: p, rank }: {
    product: ProductSummary;
    rank: number;
}) { return <article className="product-row"><span className="row-rank">{String(rank).padStart(2, '0')}</span><ProductLogo name={p.name} color={p.color} logo={p.logo}/><div className="row-info"><Link href={`/product/${p.slug}`}><h3>{p.name}</h3></Link><p>{p.description}</p><span className="category-tag">{p.category.name}</span></div><div className="row-score"><strong>{p.average.toFixed(1)}</strong><Stars value={p.average}/><small>{p.reviewCount} reviews · {p.count} ratings</small></div><div className="mini-distribution" aria-label="Rating distribution">{p.distribution.map((n, i) => <div key={i}><small>{5 - i}</small><span><i style={{ width: `${p.count ? n / p.count * 100 : 0}%` }}/></span></div>)}</div><div className="row-actions"><Link className="button secondary small" href={`/product/${p.slug}`}>View details <ArrowUpRight size={14}/></Link><CompareButton product={p}/></div></article>; }
