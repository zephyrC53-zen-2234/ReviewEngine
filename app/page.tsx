import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Sparkles, Headphones, BrainCircuit, Play, Globe, Cloud, Briefcase, ShieldCheck, MessageSquare, GitCompareArrows, TrendingUp, Star } from 'lucide-react';
import { getProducts, getCategories, getReviews } from '@/lib/data';
import { db } from '@/lib/db';
import { ProductCard, ProductLogo, Stars } from '@/components/product-card';
import { SearchBox } from '@/components/search';

const icons: Record<string, typeof Sparkles> = {
  ai: BrainCircuit,
  music: Headphones,
  'video-streaming': Play,
  browsers: Globe,
  'cloud-storage': Cloud,
  productivity: Briefcase
};

export default async function Home() {
  const [products, categories, recent, ratings, users] = await Promise.all([
    getProducts(),
    getCategories(),
    getReviews(),
    db.rating.count(),
    db.user.count()
  ]);

  const trending = [...products].sort((a, b) => b.trending - a.trending).slice(0, 4);
  const popular = ['ai', 'music', 'video-streaming', 'browsers', 'cloud-storage', 'productivity']
    .map(s => categories.find(c => c.slug === s))
    .filter((c): c is NonNullable<typeof c> => !!c);

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans selection:bg-indigo-500/30">

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        {/* Background Gradients */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white dark:from-indigo-950/40 dark:via-zinc-950 dark:to-zinc-950"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[100px] -z-10"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-[1.1fr_1fr] gap-16 items-center">

          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-xs font-black tracking-widest uppercase mb-8 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Your next favorite is out there
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-[84px] font-black tracking-tight leading-[1.05] mb-8 drop-shadow-sm">
              Compare. Rate.<br />
              Discover <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 dark:from-indigo-400 dark:via-violet-400 dark:to-fuchsia-400 relative">
                the best.
                <svg className="absolute w-full h-4 -bottom-1 left-0 text-indigo-300 dark:text-indigo-700 opacity-50" viewBox="0 0 360 20" aria-hidden="true"><path d="M4 15Q150 -4 351 9" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg>
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-lg leading-relaxed font-medium">
              See what people really think about the apps and websites they use every day. Less guesswork. Better choices.
            </p>

            <div className="max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-xl shadow-indigo-900/5 dark:shadow-black/50 border border-zinc-200 dark:border-zinc-800 p-2.5 mb-8 relative z-20">
              <SearchBox large />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500 mb-12">
              <span className="font-bold tracking-wide">Popular searches:</span>
              {['ChatGPT', 'Spotify', 'Notion'].map(p => (
                <Link key={p} href={`/search?q=${p}`} className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 px-3.5 py-1.5 rounded-full text-zinc-700 dark:text-zinc-300 font-bold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm">
                  {p} <ArrowUpRight size={14} strokeWidth={2.5} className="text-zinc-400 group-hover:text-zinc-600" />
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-5">
              <div className="flex -space-x-3">
                {['JL', 'MK', 'AS', 'RD'].map((a, i) => (
                  <div key={a} className="w-12 h-12 rounded-full flex items-center justify-center text-[11px] font-black text-zinc-700 ring-4 ring-white dark:ring-zinc-950 z-10 shadow-sm" style={{ background: ['#ded1ee', '#c7ddd4', '#f1d9bc', '#cfdbed'][i], zIndex: 10 - i }}>
                    {a}
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-1">
                <Stars value={5}/>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Every opinion makes a difference.</p>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:flex justify-center items-center h-[500px]">
            {/* Visual elements */}
            <div className="absolute w-[450px] h-[450px] border border-dashed border-indigo-200 dark:border-indigo-500/30 rounded-full animate-[spin_60s_linear_infinite]"></div>
            <div className="absolute w-[350px] h-[350px] border border-dashed border-violet-200 dark:border-violet-500/30 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>

            <Sparkles className="absolute top-10 left-10 text-indigo-400 opacity-60 w-8 h-8 animate-pulse" />
            <Sparkles className="absolute bottom-20 right-10 text-fuchsia-400 opacity-60 w-6 h-6 animate-pulse delay-1000" />

            {/* Spotlight Card */}
            {products.find(p => p.slug === 'chatgpt') && (() => {
              const p = products.find(p => p.slug === 'chatgpt')!;
              return (
                <div className="relative z-10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-[2rem] p-8 border border-zinc-200/80 dark:border-zinc-800 shadow-[0_30px_60px_-15px_rgba(99,102,241,0.15)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] w-96 transform -rotate-3 hover:rotate-0 transition-all duration-500 hover:scale-105">
                  <div className="flex justify-between items-center mb-8">
                    <span className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-500/10 dark:to-violet-500/10 text-indigo-700 dark:text-indigo-400 px-3.5 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border border-indigo-100 dark:border-indigo-500/20">
                      <Sparkles size={14} className="text-indigo-500" /> COMMUNITY FAVORITE
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></span>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <ProductLogo name={p.name} color={p.color} logo={p.logo} size="xl"/>
                    <div className="flex-1">
                      <h2 className="text-3xl font-black tracking-tight leading-none mb-1">{p.name}</h2>
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">AI & intelligent assistants</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center">
                      <ArrowUpRight className="text-zinc-400" size={20} strokeWidth={2.5} />
                    </div>
                  </div>

                  <div className="flex items-end gap-4 mb-8 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800">
                    <strong className="text-6xl font-black tracking-tighter leading-none text-indigo-950 dark:text-indigo-50">
                      {p.average.toFixed(1)}
                    </strong>
                    <div className="pb-1">
                      <Stars value={p.average}/>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1.5">from {p.count} ratings</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {[['Ease of use', p.scores.easeOfUse], ['Features', p.scores.features], ['Performance', p.scores.performance]].map(([label, score]) => (
                      <div key={label} className="flex items-center gap-4">
                        <span className="w-24 text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">{label}</span>
                        <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full shadow-inner" style={{ width: `${Number(score) * 20}%` }}></div>
                        </div>
                        <span className="text-sm font-black w-8 text-right">{Number(score).toFixed(1)}</span>
                      </div>
                    ))}
                  </div>

                  <Link href="/product/chatgpt" className="flex justify-between items-center w-full pt-6 border-t border-zinc-100 dark:border-zinc-800 text-sm font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-2 -mx-2">
                    See what the community thinks
                    <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-colors">
                      <ArrowRight size={16} strokeWidth={3} />
                    </div>
                  </Link>
                </div>
              );
            })()}

            {/* Floating badges */}
            <div className="absolute top-8 -right-8 z-20 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-4 shadow-xl shadow-indigo-900/5 dark:shadow-black/20 flex items-center gap-3 transform rotate-6 hover:-translate-y-2 hover:rotate-3 transition-all duration-300 cursor-default">
              <span className="text-3xl drop-shadow-md">🏆</span>
              <div>
                <strong className="block text-sm font-black tracking-tight">Your voice. Their next choice.</strong>
                <small className="block text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Independent reviews</small>
              </div>
            </div>

            <div className="absolute bottom-8 -left-12 z-20 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-4 shadow-xl shadow-indigo-900/5 dark:shadow-black/20 flex items-center gap-3 transform -rotate-6 hover:-translate-y-2 hover:-rotate-3 transition-all duration-300 cursor-default">
              <div className="w-12 h-12 flex items-center justify-center bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
                <GitCompareArrows size={24} strokeWidth={2.5} />
              </div>
              <div>
                <strong className="block text-sm font-black tracking-tight">Good choices, side by side.</strong>
                <small className="block text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Compare in seconds</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="border-y border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 py-10 relative overflow-hidden">
        <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-wrap justify-center sm:justify-between items-center gap-8 lg:gap-10 relative z-10">
          {[
            { icon: ShieldCheck, text: "Community-powered opinions" },
            { icon: Star, text: `${ratings.toLocaleString()} ratings and counting` },
            { icon: MessageSquare, text: `${users} community members` },
            { icon: GitCompareArrows, text: "Find your perfect fit" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-sm font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">
              <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm border border-zinc-200 dark:border-zinc-700">
                <item.icon className="text-indigo-500" size={16} strokeWidth={2.5} />
              </div>
              {item.text}
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-black tracking-widest text-indigo-600 dark:text-indigo-400 uppercase mb-3 block">A world of possibilities</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">What are you into?</h2>
            <p className="text-zinc-500 text-lg mt-4 font-medium">Find the best tools for the things you love.</p>
          </div>
          <Link href="/categories" className="inline-flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 px-6 py-3 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950">
            Explore categories <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {popular.map((c, i) => {
            const Icon = icons[c.slug] || Sparkles;
            const colors = [
              'bg-pink-50 text-pink-600 border-pink-100 dark:bg-pink-500/10 dark:text-pink-400 dark:border-pink-500/20',
              'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20',
              'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
              'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
              'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20',
              'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
            ];
            const bgClass = colors[i % colors.length];

            return (
              <Link key={c.id} href={`/category/${c.slug}`} className="group flex flex-col p-6 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 border shadow-sm ${bgClass}`}>
                  <Icon size={26} strokeWidth={2.5} />
                </div>
                <h3 className="font-black text-lg tracking-tight mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{c.name}</h3>
                <span className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-zinc-500 mt-auto">
                  {c._count.products} products
                  <div className="w-6 h-6 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/20 transition-colors">
                    <ArrowUpRight size={14} className="text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" strokeWidth={2.5} />
                  </div>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-[3rem] border border-zinc-200/80 dark:border-zinc-800/80 my-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 relative z-10">
          <div>
            <span className="flex items-center gap-2 text-xs font-black tracking-widest text-emerald-600 dark:text-emerald-400 uppercase mb-3">
              <TrendingUp size={16} strokeWidth={3} /> THE COMMUNITY IS TALKING
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight flex items-baseline gap-2">
              Trending right now <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></span>
            </h2>
            <p className="text-zinc-500 text-lg mt-4 font-medium">The apps making moves. See what all the buzz is about.</p>
          </div>
          <Link href="/trending" className="inline-flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors bg-emerald-100 dark:bg-emerald-500/10 hover:bg-emerald-200 dark:hover:bg-emerald-500/20 px-6 py-3 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 shadow-sm">
            View all trending <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {trending.map(p => <ProductCard key={p.id} product={p}/>)}
        </div>
      </section>

      {/* Compare Banner */}
      <section className="py-12 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="bg-zinc-950 rounded-[3rem] p-10 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden relative border border-zinc-900 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-indigo-900/60 via-zinc-950 to-zinc-950"></div>
          <div className="absolute -top-[300px] -right-[300px] w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[100px]"></div>

          <div className="relative z-10 max-w-xl">
            <span className="inline-block text-[11px] font-black tracking-widest text-indigo-400 uppercase mb-5 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full">Less tab-hopping. More clarity.</span>
            <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-[1.1]">
              Tough choice?<br />Put them head to head.
            </h2>
            <p className="text-zinc-400 text-lg mb-10 leading-relaxed font-medium">
              Your favorites, compared side by side.<br />Find the one that checks your boxes.
            </p>
            <Link href="/compare" className="inline-flex items-center gap-3 font-bold text-zinc-950 bg-white hover:bg-indigo-50 px-8 py-4 rounded-full transition-all shadow-xl shadow-black/50 hover:shadow-2xl hover:-translate-y-1 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950">
              Start a comparison <ArrowRight size={20} strokeWidth={2.5} />
            </Link>
          </div>

          <div className="relative z-10 w-full max-w-md flex flex-col gap-5">
            {[['chatgpt', 'claude'], ['spotify', 'apple-music']].map((pair, i) => {
              const ps = pair.map(s => products.find(p => p.slug === s)).filter((p): p is NonNullable<typeof p> => !!p);
              return (
                <Link key={pair[0]} href={`/compare/${pair.join('-vs-')}`} className={`flex items-center justify-between bg-zinc-900/50 hover:bg-zinc-800/80 backdrop-blur-md border border-zinc-800/80 hover:border-indigo-500/50 rounded-[2rem] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.2)] outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${i === 1 ? 'ml-12' : 'mr-12'}`}>
                  <div className="flex items-center gap-6">
                    {ps.map((p, j) => (
                      <div key={p.id} className="flex items-center gap-4 relative">
                        {j === 1 && <span className="absolute -left-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center text-[9px] font-black text-indigo-400 uppercase italic z-10 shadow-lg">vs</span>}
                        <ProductLogo name={p.name} color={p.color} logo={p.logo} size="md"/>
                        <div>
                          <strong className="block text-white font-bold tracking-tight text-lg">{p.name}</strong>
                          <small className="flex items-center gap-1 text-zinc-400 font-bold tracking-wider uppercase text-[10px] mt-1"><Star size={10} className="fill-current text-amber-400 drop-shadow-sm" strokeWidth={0}/>{p.average.toFixed(1)}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                    <ArrowUpRight size={20} className="text-zinc-400 group-hover:text-white transition-colors" strokeWidth={2.5} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Rankings Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-black tracking-widest text-indigo-600 dark:text-indigo-400 uppercase mb-3 block">The people have spoken</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">A little obsessed. Highly rated.</h2>
            <p className="text-zinc-500 text-lg mt-4 font-medium">Standout experiences, backed by the community.</p>
          </div>
          <Link href="/rankings" className="inline-flex items-center gap-2 font-bold text-indigo-700 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 px-6 py-3 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 shadow-sm">
            See the rankings <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((p, i) => <ProductCard key={p.id} product={p} rank={i + 1}/>)}
        </div>
      </section>

      {/* Recent Reviews Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-[3rem] border border-zinc-200/80 dark:border-zinc-800/80 my-10 shadow-sm relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 relative z-10">
          <div>
            <span className="text-xs font-black tracking-widest text-indigo-600 dark:text-indigo-400 uppercase mb-3 block">Fresh from the community</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Real takes. Just dropped.</h2>
          </div>
          <Link href="/rankings" className="inline-flex items-center gap-2 font-bold text-indigo-700 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 px-6 py-3 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 shadow-sm">
            Find your next review <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {recent.reviews.slice(0, 3).map(r => (
            <article className="group flex flex-col p-8 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] hover:shadow-xl dark:hover:shadow-black/50 hover:border-indigo-200 dark:hover:border-indigo-900/50 hover:-translate-y-1 transition-all duration-300 h-full" key={r.id}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 border border-zinc-300 dark:border-zinc-600 flex items-center justify-center text-sm font-black text-zinc-700 dark:text-zinc-200 shadow-sm">
                    {r.user.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <Link href={`/profile/${r.user.username}`} className="font-black text-lg hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors block leading-tight outline-none focus-visible:underline">
                      {r.user.username}
                    </Link>
                    <small className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">
                      {r.user.isSample ? 'Sample reviewer' : 'Community'}
                    </small>
                  </div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 px-3 py-1.5 rounded-full shadow-sm">
                  <Stars value={r.rating}/>
                </div>
              </div>
              <h3 className="font-black text-xl mb-4 tracking-tight leading-tight">{r.title}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed line-clamp-4 font-medium">{r.content}</p>
              <Link className="mt-auto flex justify-between items-center pt-5 border-t border-zinc-100 dark:border-zinc-800 text-[11px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-2 -mx-2" href={`/product/${r.product.slug}`}>
                Review of {r.product.name}
                <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-colors">
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Community CTA */}
      <section className="py-32 max-w-4xl mx-auto px-6 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[600px] bg-gradient-to-tr from-indigo-500/10 to-violet-500/10 blur-[80px] -z-10 rounded-full"></div>
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-[2rem] flex items-center justify-center mb-10 transform -rotate-6 shadow-[0_20px_40px_-10px_rgba(99,102,241,0.4)] animate-pulse">
          <Sparkles size={48} strokeWidth={2.5} />
        </div>
        <h2 className="text-5xl sm:text-7xl font-black tracking-tight mb-8 leading-[1.05]">Your experience matters.</h2>
        <p className="text-xl sm:text-2xl text-zinc-500 dark:text-zinc-400 mb-12 max-w-2xl mx-auto font-medium">
          Help someone discover their next favorite. Share a little of what you know.
        </p>
        <Link className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-black rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-100 hover:-translate-y-1 transition-all shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.2)] text-lg outline-none focus-visible:ring-4 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950" href="/categories">
          Write your first review <ArrowRight size={24} strokeWidth={3} />
        </Link>
      </section>
    </main>
  );
}
