'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, Sun, Moon, X, Search, Activity } from 'lucide-react';

const links = [['/', 'Discover'], ['/categories', 'Categories'], ['/rankings', 'Rankings'], ['/compare', 'Compare'], ['/trending', 'Trending']];

export function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => { setDark(document.documentElement.classList.contains('dark')); }, []);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);

  function theme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch { /* The toggle also works when storage is disabled. */ }
  }

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand">
          <span className="brand-icon"><Activity size={23} /></span>
          Review<span>Engine</span><span className="beta">BETA</span>
        </Link>
        <nav id="main-navigation" className={open ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
          {links.map(([href, name]) => (
            <Link key={href} className={pathname === href ? 'active' : ''} aria-current={pathname === href ? 'page' : undefined} href={href} onClick={() => setOpen(false)}>{name}</Link>
          ))}
          <Link className="mobile" href="/search" onClick={() => setOpen(false)}>Search</Link>
          {session?.user?.id && <>
            {session.user.role === 'ADMIN' && <Link className="mobile" href="/admin" onClick={() => setOpen(false)}>Admin</Link>}
            <button className="text-button mobile" onClick={() => { setOpen(false); void signOut(); }}>Log out</button>
          </>}
        </nav>
        <div className="nav-actions">
          <Link href="/search" className="icon-button" aria-label="Search"><Search size={19} /></Link>
          <button className="icon-button" onClick={theme} aria-label="Toggle color theme" aria-pressed={dark}>{dark ? <Sun size={19} /> : <Moon size={19} />}</button>
          {session?.user?.id ? <>
            <Link className="avatar" aria-label="Your profile" href={`/profile/${session.user.name}`}>{session.user.name?.slice(0, 2).toUpperCase()}</Link>
            {session.user.role === 'ADMIN' && <Link className="desktop" href="/admin">Admin</Link>}
            <button className="text-button desktop" onClick={() => signOut()}>Log out</button>
          </> : <Link href="/login" className="button primary small">Get started <ArrowUpRight size={15} /></Link>}
          <button className="icon-button mobile" aria-label="Toggle menu" aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
      </div>
    </header>
  );
}
