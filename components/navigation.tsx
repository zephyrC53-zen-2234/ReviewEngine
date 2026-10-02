'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, Sun, Moon, X, Search, Activity, Sparkles } from 'lucide-react';

const links = [
  ['/', 'Discover'],
  ['/categories', 'Categories'],
  ['/rankings', 'Rankings'],
  ['/compare', 'Compare'],
  ['/trending', 'Trending']
];

export function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header className={`sticky top-0 z-50 transition-all duration-300 border-b ${scrolled ? 'bg-white/85 dark:bg-zinc-950/85 backdrop-blur-xl border-zinc-200/80 dark:border-zinc-800/80 shadow-sm' : 'bg-transparent border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5 group outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_8px_20px_rgba(99,102,241,0.3)] group-active:scale-95">
            <Activity size={22} strokeWidth={2.5} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-extrabold text-xl tracking-tight text-zinc-900 dark:text-zinc-50 transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">ReviewEngine</span>
            <span className="text-[10px] font-black tracking-widest px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 uppercase">BETA</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1.5" aria-label="Main navigation">
          {links.map(([href, name]) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
            return (
              <Link key={href} href={href} aria-current={isActive ? 'page' : undefined} className={`relative px-4 py-2 text-sm font-bold transition-all duration-200 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${isActive ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}>
                {name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 lg:gap-3">
          <Link href="/search" className="p-2.5 text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-500/10 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" aria-label="Search">
            <Search size={20} strokeWidth={2.5} />
          </Link>
          <button onClick={theme} className="p-2.5 text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hidden sm:block outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" aria-label="Toggle color theme" aria-pressed={dark}>
            {dark ? <Sun size={20} strokeWidth={2.5} /> : <Moon size={20} strokeWidth={2.5} />}
          </button>

          <div className="hidden sm:flex items-center gap-3 pl-2 sm:pl-4 border-l border-zinc-200 dark:border-zinc-800">
            {session?.user?.id ? (
              <>
                {session.user.role === 'ADMIN' && (
                  <Link className="text-sm font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md px-2 py-1" href="/admin">Admin</Link>
                )}
                <button className="text-sm font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md px-2 py-1" onClick={() => signOut()}>Log out</button>
                <Link className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 border border-zinc-300 dark:border-zinc-600 text-sm font-black text-zinc-700 dark:text-zinc-200 hover:ring-4 hover:ring-indigo-500/20 dark:hover:ring-indigo-500/30 transition-all ml-1 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 shadow-sm" aria-label="Your profile" href={`/profile/${session.user.name}`}>
                  {session.user.name?.slice(0, 2).toUpperCase()}
                </Link>
              </>
            ) : (
              <Link href="/login" className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-sm rounded-full hover:bg-zinc-800 dark:hover:bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 ml-1">
                Get started <ArrowUpRight size={16} strokeWidth={2.5} />
              </Link>
            )}
          </div>

          <button className="md:hidden p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" aria-label="Toggle menu" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>
            {open ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div id="mobile-navigation" className="md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 shadow-2xl py-4 px-6 flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200">
          {links.map(([href, name]) => (
            <Link key={href} className={`px-4 py-3 rounded-xl text-base font-bold outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${pathname === href ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors'}`} href={href} onClick={() => setOpen(false)}>{name}</Link>
          ))}
          <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2" />
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-sm font-bold text-zinc-500">Theme</span>
            <button onClick={theme} aria-label="Toggle color theme" aria-pressed={dark} className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
              {dark ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
            </button>
          </div>
          {session?.user?.id ? (
            <>
              <Link className="px-4 py-3 rounded-xl text-base font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" href={`/profile/${session.user.name}`} onClick={() => setOpen(false)}>Your profile</Link>
              {session.user.role === 'ADMIN' && <Link className="px-4 py-3 rounded-xl text-base font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" href="/admin" onClick={() => setOpen(false)}>Admin</Link>}
              <button className="px-4 py-3 rounded-xl text-base font-bold text-left text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" onClick={() => { setOpen(false); void signOut(); }}>Log out</button>
            </>
          ) : (
            <Link href="/login" className="mt-4 flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950">
              Get started <ArrowUpRight size={18} strokeWidth={2.5} />
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
