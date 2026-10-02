import type {Metadata} from 'next';
import Link from 'next/link';
import {Activity,ArrowUpRight} from 'lucide-react';
import {Providers} from '@/components/providers';
import {Navigation} from '@/components/navigation';
import './globals.css';
export const metadata:Metadata={metadataBase:new URL(process.env.NEXTAUTH_URL||'http://localhost:3000'),title:{default:'ReviewEngine — Find your next favorite',template:'%s | ReviewEngine'},description:'Discover, compare, and review the apps you use every day. Find your next favorite with community-powered rankings.',openGraph:{siteName:'ReviewEngine',type:'website'}};
export const dynamic='force-dynamic';
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:`try{if(localStorage.getItem('theme')==='dark'||(!localStorage.getItem('theme')&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch{}`}}/></head><body><Providers><Navigation/>{children}<footer><div className="footer-top"><div><Link href="/" className="brand"><span className="brand-icon"><Activity size={21}/></span>ReviewEngine</Link><p>Better choices start with real opinions.</p></div><div><Link href="/categories">Explore categories</Link><Link href="/rankings">Community rankings</Link><Link href="/compare">Compare products <ArrowUpRight size={14}/></Link></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} ReviewEngine</span><span>Made for the curious. Powered by the community.</span></div>{process.env.SEED_DEMO==='true'&&<p className="sample-notice">Development preview · Sample community ratings and reviews are labeled on profiles and reviews.</p>}</footer></Providers></body></html>}
