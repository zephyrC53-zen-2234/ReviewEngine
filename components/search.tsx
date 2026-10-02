'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, X } from 'lucide-react';

type Results = {
    products: {
        name: string;
        slug: string;
        category: {
            name: string;
        };
    }[];
    categories: {
        name: string;
        slug: string;
    }[];
};

export function SearchBox({ large = false }: { large?: boolean }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Results | null>(null);
  const [error, setError] = useState(false);
  const [focus, setFocus] = useState(false);
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setFocus(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!q.trim()) {
      setResults(null);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal })
        .then(r => { if (!r.ok) throw Error(); return r.json(); })
        .then(r => { setResults(r); setError(false); })
        .catch(e => { if (e.name !== 'AbortError') setError(true); });
    }, 200);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [q]);

  return (
    <div ref={wrapRef} className="relative w-full z-40" onKeyDown={event => { if (event.key === 'Escape') setFocus(false); }}>
      <form
        className={`flex items-center w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full focus-within:ring-4 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all shadow-sm ${large ? 'p-1.5' : 'p-1'}`}
        onSubmit={e => { e.preventDefault(); setFocus(false); if (q.trim()) router.push(`/search?q=${encodeURIComponent(q)}`); }}
      >
        <div className={`flex items-center justify-center text-zinc-400 ${large ? 'px-4' : 'px-3'}`}>
          <Search size={large ? 24 : 18} strokeWidth={3}/>
        </div>
        <input
          aria-label="Search products and categories"
          placeholder="Find your next favorite app…"
          value={q}
          onFocus={() => setFocus(true)}
          onChange={e => setQ(e.target.value)}
          maxLength={80}
          className={`flex-1 min-w-0 bg-transparent border-0 outline-none text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 font-bold w-full ${large ? 'text-lg py-3' : 'text-sm py-2'}`}
        />
        {q && (
          <button type="button" aria-label="Clear search" onClick={() => { setQ(''); setFocus(false); }} className="p-2 mr-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-full transition-colors bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700">
            <X size={16} strokeWidth={3} />
          </button>
        )}
        <button
          className={`flex items-center justify-center bg-zinc-950 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-950 font-bold rounded-full transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900 ${large ? 'px-8 py-3.5 gap-2 text-base shadow-[0_4px_15px_-5px_rgba(0,0,0,0.3)] dark:shadow-[0_4px_15px_-5px_rgba(255,255,255,0.2)]' : 'px-5 py-2 gap-1 text-sm hidden sm:flex'}`}
          aria-label="Submit search"
        >
          <span className={large ? '' : 'hidden md:inline'}>Search</span>
          <ArrowRight size={large ? 20 : 16} strokeWidth={3} />
        </button>
      </form>

      {focus && q && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden py-3 max-h-[60vh] overflow-y-auto z-50 animate-in slide-in-from-top-2 duration-200">
          {error ? (
            <p className="px-6 py-5 text-sm font-bold text-red-500">Search is unavailable. Try again.</p>
          ) : results ? (
            <>
              {results.categories.length > 0 && (
                <div className="mb-3">
                  <div className="px-6 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Categories</div>
                  {results.categories.map(c => (
                    <Link key={c.slug} href={`/category/${c.slug}`} onClick={() => setFocus(false)} className="flex justify-between items-center px-6 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group outline-none focus-visible:bg-zinc-50 dark:focus-visible:bg-zinc-800/50">
                      <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{c.name}</span>
                      <small className="text-[10px] font-black tracking-widest uppercase text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full">Category</small>
                    </Link>
                  ))}
                </div>
              )}
              {results.products.length > 0 && (
                <div>
                  <div className="px-6 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Products</div>
                  {results.products.map(p => (
                    <Link key={p.slug} href={`/product/${p.slug}`} onClick={() => setFocus(false)} className="flex justify-between items-center px-6 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group outline-none focus-visible:bg-zinc-50 dark:focus-visible:bg-zinc-800/50">
                      <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{p.name}</span>
                      <small className="text-[10px] font-black tracking-widest uppercase text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full">{p.category.name}</small>
                    </Link>
                  ))}
                </div>
              )}
              {!results.products.length && !results.categories.length && (
                <p className="px-6 py-6 text-sm font-bold text-zinc-500 text-center">No matches. Try another name.</p>
              )}
            </>
          ) : (
            <div className="px-6 py-8 flex items-center justify-center">
              <div className="w-6 h-6 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
