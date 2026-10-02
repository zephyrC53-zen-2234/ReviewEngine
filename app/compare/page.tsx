import {getProducts} from '@/lib/data';
import {Catalog} from '@/components/catalog';
export const metadata={title:'Compare Products',description:'Compare up to four competing apps side by side using community ratings.'};
export default async function Compare(){return <main className="container page"><header className="page-heading"><span className="eyebrow">YOUR FAVORITES. SIDE BY SIDE.</span><h1>Find your perfect fit.</h1><p>Select two to four products from the same category. Compare community ratings across the features that matter to you.</p></header><Catalog products={await getProducts()} rows={false}/></main>}
