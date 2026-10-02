'use client';
import {SessionProvider} from 'next-auth/react';
import {createContext,useContext,useEffect,useState,ReactNode} from 'react';
import Link from 'next/link';
import {X,ArrowRight,GitCompareArrows} from 'lucide-react';
type Item={slug:string;name:string;category:string};
const Context=createContext<{items:Item[];toggle:(item:Item)=>void}>({items:[],toggle:()=>{}});
export const useComparison=()=>useContext(Context);
export function Providers({children}:{children:ReactNode}){
 const [items,setItems]=useState<Item[]>([]),[message,setMessage]=useState('');
 useEffect(()=>{try{const stored=JSON.parse(sessionStorage.getItem('comparison')||'[]');if(Array.isArray(stored))setItems(stored.slice(0,4));}catch{}},[]);
 function toggle(item:Item){if(items.some(i=>i.slug===item.slug)){setItems(items.filter(i=>i.slug!==item.slug));return;}if(items.length>=4){setMessage('You can compare up to four products.');return;}if(items[0]&&items[0].category!==item.category){setMessage('Choose products from the same category.');return;}setMessage('');setItems([...items,item]);}
 useEffect(()=>{sessionStorage.setItem('comparison',JSON.stringify(items));},[items]);
 return <SessionProvider><Context.Provider value={{items,toggle}}>{children}{message&&<div className="toast" role="alert">{message}<button onClick={()=>setMessage('')} aria-label="Dismiss"><X size={16}/></button></div>}{items.length>0&&<aside className="compare-tray"><GitCompareArrows size={22}/><div><strong>Your comparison</strong><small>{items.length}/4 products · {items[0].category}</small></div><div className="tray-items">{items.map(i=><button key={i.slug} onClick={()=>toggle(i)}>{i.name}<X size={13}/></button>)}</div>{items.length>=2?<Link className="button primary" href={`/compare/${items.map(i=>i.slug).join('-vs-')}`}>Compare <ArrowRight size={16}/></Link>:<span className="muted">Add one more</span>}<button className="icon-button" aria-label="Clear comparison" onClick={()=>setItems([])}><X size={18}/></button></aside>}</Context.Provider></SessionProvider>;
}
