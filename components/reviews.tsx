'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ThumbsUp, ThumbsDown, Flag } from 'lucide-react';
import type { getReviews } from '@/lib/data';
import { Stars } from './product-card';
type Reviews = Awaited<ReturnType<typeof getReviews>>;
export function ReviewList({ initial, productId }: {
    initial: Reviews;
    productId: string;
}) {
    const [data, setData] = useState(initial), [sort, setSort] = useState('recent'), [page, setPage] = useState(1), [error, setError] = useState(''), [loading, setLoading] = useState(false);
    const { data: session } = useSession(), router = useRouter();
    async function load(nextSort = sort, nextPage = page) { setLoading(true); try {
        const r = await fetch(`/api/reviews?productId=${productId}&sort=${nextSort}&page=${nextPage}`);
        if (!r.ok)
            throw Error('Unable to load reviews.');
        setData(await r.json());
        setSort(nextSort);
        setPage(nextPage);
        setError('');
    }
    catch (e) {
        setError((e as Error).message);
    }
    finally {
        setLoading(false);
    } }
    async function action(id: string, type: string, body: object) { if (!session?.user?.id) {
        router.push('/login');
        return;
    } try {
        const r = await fetch(`/api/${type}/${id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        const result = await r.json();
        if (!r.ok)
            throw Error(result.error);
        if (type === 'reports')
            alert('Report submitted for moderator review.');
        else
            await load();
    }
    catch (e) {
        setError((e as Error).message);
    } }
    return <section className="panel"><div className="flex-heading"><h2>Community reviews <span className="badge">{data.total}</span></h2><select aria-label="Sort reviews" value={sort} onChange={e => load(e.target.value, 1)} disabled={loading}><option value="recent">Most recent</option><option value="helpful">Most helpful</option><option value="highest">Highest rating</option><option value="lowest">Lowest rating</option></select></div>{error && <p className="form-error" role="alert">{error}</p>}{!data.reviews.length && <div className="empty"><h3>Be the first to share your take.</h3><p>Every experience helps someone choose.</p></div>}{data.reviews.map(r => <article className="review-item" key={r.id}><div className="review-meta"><Link className="avatar" href={`/profile/${r.user.username}`}>{r.user.avatar ? <img alt="" src={r.user.avatar}/> : r.user.username.slice(0, 2).toUpperCase()}</Link><Link href={`/profile/${r.user.username}`}><strong>{r.user.username}</strong></Link>{r.user.isSample && <span className="badge">Sample</span>}<time dateTime={r.createdAt}>{new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time></div><div style={{ marginTop: 10 }}><Stars value={r.rating}/></div><h3>{r.title || 'My experience'}</h3><p>{r.content}</p><div className="review-actions"><button className={r.votes.some(v => v.userId === session?.user?.id && v.helpful) ? 'active' : ''} onClick={() => action(r.id, 'votes', { helpful: true })}><ThumbsUp size={13}/> Helpful ({r.votes.filter(v => v.helpful).length})</button><button onClick={() => action(r.id, 'votes', { helpful: false })}><ThumbsDown size={13}/> Not helpful</button><button onClick={() => { if (!session?.user?.id) {
        router.push('/login');
        return;
    } const reason = prompt('Why are you reporting this review? (At least 5 characters)'); if (reason)
        action(r.id, 'reports', { reason }); }}><Flag size={13}/> Report</button></div></article>)}{data.total > 6 && <div className="pagination"><button className="button secondary small" disabled={page === 1 || loading} onClick={() => load(sort, page - 1)}>Previous</button><span>{page} / {Math.ceil(data.total / 6)}</span><button className="button secondary small" disabled={page * 6 >= data.total || loading} onClick={() => load(sort, page + 1)}>Next</button></div>}</section>;
}
