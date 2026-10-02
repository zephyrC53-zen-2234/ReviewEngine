'use client';
import Link from 'next/link';
import { Star, Plus, Check, ArrowUpRight, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import type { ProductSummary } from '@/lib/data';
import { useComparison } from './providers';

export function ProductLogo({ name, color, logo, size = 'md' }: {
    name: string;
    color: string;
    logo?: string | null;
    size?: 'sm' | 'md' | 'lg' | 'xl' | string;
}) {
  const [failed, setFailed] = useState(false);

  const sizeClasses = {
    'sm': 'w-8 h-8 rounded-lg text-sm',
    'md': 'w-12 h-12 rounded-xl text-xl',
    'lg': 'w-16 h-16 rounded-2xl text-3xl',
    'xl': 'w-24 h-24 rounded-[1.5rem] text-4xl'
  };

  const selectedSize = (sizeClasses as any)[size] || size;

  return (
    <span className={`inline-flex items-center justify-center shrink-0 overflow-hidden text-white font-black tracking-tighter shadow-md border border-black/5 dark:border-white/5 ${selectedSize}`} style={{ background: color }}>
      {logo && !failed ? (
        <img src={logo} alt={`${name} logo`} className="w-full h-full object-contain bg-white" onError={() => setFailed(true)}/>
      ) : (
        <span>{name === 'ChatGPT' ? '✳' : name === 'Claude' ? '✴' : name === 'Spotify' ? '≋' : name === 'Gemini' ? '✦' : name === 'Netflix' ? 'N' : name.slice(0, 2).toUpperCase()}</span>
      )}
    </span>
  );
}

export function CompareButton({ product }: { product: ProductSummary }) {
  const { items, toggle } = useComparison();
  const selected = items.some(i => i.slug === product.slug);

  return (
    <button
      className={`flex items-center gap-1.5 text-[11px] font-bold border rounded-lg px-3 py-1.5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
        selected
          ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-inner dark:bg-indigo-500/20 dark:border-indigo-500/30 dark:text-indigo-300'
          : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300 hover:bg-zinc-50 shadow-sm dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800'
      }`}
      onClick={() => toggle({ slug: product.slug, name: product.name, category: product.category.name })}
    >
      {selected ? <Check size={14} strokeWidth={3}/> : <Plus size={14} strokeWidth={3}/>}
      {selected ? 'Added' : 'Compare'}
    </button>
  );
}

export function Stars({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={14} className={i <= Math.round(value) ? 'fill-amber-400 text-amber-400 drop-shadow-sm' : 'fill-zinc-100 text-zinc-200 dark:fill-zinc-800 dark:text-zinc-700'} strokeWidth={1} />
      ))}
    </span>
  );
}

export function ProductCard({ product: p, rank }: { product: ProductSummary; rank?: number }) {
  return (
    <article className="group flex flex-col bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] hover:border-indigo-200 dark:hover:border-indigo-900/50 hover:-translate-y-1 transition-all duration-300 h-full">
      <div className="flex justify-between items-start mb-5">
        <ProductLogo name={p.name} color={p.color} logo={p.logo} size="md" />
        {rank ? (
          <span className="inline-flex items-center gap-1 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-500/20 dark:to-orange-500/20 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border border-amber-200/50 dark:border-amber-500/20 shadow-sm">
            #{rank} in {p.category.name}
          </span>
        ) : (
          <span className="inline-flex items-center bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border border-zinc-200/50 dark:border-zinc-700 shadow-sm">
            {p.category.name}
          </span>
        )}
      </div>

      <Link className="flex items-center justify-between text-xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md" href={`/product/${p.slug}`}>
        {p.name}
        <div className="w-8 h-8 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/20">
          <ArrowUpRight size={16} strokeWidth={2.5} className="text-indigo-600 dark:text-indigo-400" />
        </div>
      </Link>

      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mt-2 mb-6 line-clamp-2 min-h-[2.75rem]">
        {p.description}
      </p>

      <div className="mt-auto">
        <div className="flex items-center gap-3 mb-5 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800">
          <strong className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tabular-nums tracking-tighter leading-none">
            {p.count ? p.average.toFixed(1) : 'New'}
          </strong>
          <div className="flex flex-col gap-0.5">
            <Stars value={p.average} />
            <small className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
              {p.count} ratings
            </small>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider ${p.trending > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500'}`}>
            <TrendingUp size={14} strokeWidth={2.5} /> {p.trending > 0 ? 'Trending' : 'Discover'}
          </span>
          <CompareButton product={p} />
        </div>
      </div>
    </article>
  );
}

export function ProductRow({ product: p, rank }: { product: ProductSummary; rank: number }) {
  return (
    <article className="group flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 p-5 md:p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-black/50 hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all duration-300 mb-4">
      <span className="hidden md:flex text-3xl font-black text-zinc-200 dark:text-zinc-800 w-10 tabular-nums tracking-tighter group-hover:text-indigo-200 dark:group-hover:text-indigo-900/50 transition-colors">
        {String(rank).padStart(2, '0')}
      </span>

      <div className="flex gap-5 flex-1 w-full">
        <ProductLogo name={p.name} color={p.color} logo={p.logo} size="lg" />

        <div className="flex-1 pt-1">
          <div className="flex items-center gap-3 mb-1">
            <Link href={`/product/${p.slug}`} className="text-2xl font-black tracking-tight hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md">
              {p.name}
            </Link>
            <span className="inline-block bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-zinc-200/50 dark:border-zinc-700">
              {p.category.name}
            </span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1">{p.description}</p>
        </div>
      </div>

      <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-6 lg:gap-10 border-t md:border-0 pt-5 md:pt-0 border-zinc-100 dark:border-zinc-800">
        <div className="flex flex-col gap-1.5 min-w-[110px]">
          <div className="flex items-center gap-2.5">
            <strong className="text-2xl font-black tracking-tighter tabular-nums leading-none">{p.average.toFixed(1)}</strong>
            <Stars value={p.average} />
          </div>
          <small className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{p.reviewCount} reviews · {p.count} ratings</small>
        </div>

        <div className="hidden lg:flex gap-1.5" aria-label="Rating distribution">
          {p.distribution.map((n, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 group/dist">
              <div className="w-2 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex items-end">
                <div
                  className="w-full bg-indigo-400 dark:bg-indigo-500 rounded-full transition-all duration-500 group-hover/dist:bg-indigo-600 dark:group-hover/dist:bg-indigo-400"
                  style={{ height: `${p.count ? (n / p.count) * 100 : 0}%` }}
                />
              </div>
              <small className="text-[9px] font-black text-zinc-300 dark:text-zinc-600 group-hover/dist:text-zinc-500 transition-colors">{5 - i}</small>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <CompareButton product={p} />
          <Link href={`/product/${p.slug}`} className="p-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white dark:hover:text-white transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900">
            <ArrowUpRight size={18} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </article>
  );
}
