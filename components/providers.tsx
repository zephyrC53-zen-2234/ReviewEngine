'use client';
import { SessionProvider } from 'next-auth/react';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Link from 'next/link';
import { X, ArrowRight, GitCompareArrows } from 'lucide-react';
import { toggleComparison, restoreComparison, type ComparisonItem as Item } from '@/lib/comparison';
const Context = createContext<{
    items: Item[];
    toggle: (item: Item) => void;
}>({ items: [], toggle: () => { } });
export const useComparison = () => useContext(Context);
export function Providers({ children }: {
    children: ReactNode;
}) {
    const [items, setItems] = useState<Item[]>([]), [message, setMessage] = useState(''), [restored, setRestored] = useState(false);
    useEffect(() => { try {
        setItems(restoreComparison(JSON.parse(sessionStorage.getItem('comparison') || '[]')));
    }
    catch { } setRestored(true); }, []);
    function toggle(item: Item) { const result = toggleComparison(items, item); setMessage(result.error || ''); setItems(result.items); }
    useEffect(() => { if (restored)
        try {
            sessionStorage.setItem('comparison', JSON.stringify(items));
        }
        catch { } }, [items, restored]);
    return <SessionProvider><Context.Provider value={{ items, toggle }}>{children}{message && <div className="toast" role="alert">{message}<button onClick={() => setMessage('')} aria-label="Dismiss"><X size={16}/></button></div>}{items.length > 0 && <aside className="compare-tray"><GitCompareArrows size={22}/><div><strong>Your comparison</strong><small>{items.length}/4 products · {items[0].category}</small></div><div className="tray-items">{items.map(i => <button key={i.slug} onClick={() => toggle(i)}>{i.name}<X size={13}/></button>)}</div>{items.length >= 2 ? <Link className="button primary" href={`/compare/${items.map(i => i.slug).join('-vs-')}`}>Compare <ArrowRight size={16}/></Link> : <span className="muted">Add one more</span>}<button className="icon-button" aria-label="Clear comparison" onClick={() => setItems([])}><X size={18}/></button></aside>}</Context.Provider></SessionProvider>;
}
