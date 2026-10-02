import { getProducts } from '@/lib/data';
import { Catalog } from '@/components/catalog';
export const metadata = { title: 'Trending Now', description: 'Discover apps gaining momentum based on this week’s community activity.' };
export default async function Trending() { return <main className="container page"><header className="page-heading"><span className="eyebrow">ON THE COMMUNITY’S RADAR</span><h1>Trending right now.</h1><p>Fresh momentum, new perspectives. See which products are gaining ratings, reviews, and attention this week.</p></header><Catalog products={await getProducts()} initial="trending" rows={false}/><p className="hint">Trending considers ratings and reviews from the last seven days, growth over the previous week, and unique daily product visits.</p></main>; }
