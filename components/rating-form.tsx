'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Star } from 'lucide-react';
type Scores = {
    overall: number;
    easeOfUse: number | null;
    features: number | null;
    performance: number | null;
    value: number | null;
    userExperience: number | null;
};
export function RatingForm({ productId, slug, existing, review }: {
    productId: string;
    slug: string;
    existing: Scores | null;
    review: {
        title: string;
        content: string;
    } | null;
}) {
    const { data: session, status } = useSession(), router = useRouter();
    const [overall, setOverall] = useState(existing?.overall || 0), [error, setError] = useState(''), [busy, setBusy] = useState(false), [success, setSuccess] = useState('');
    async function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); setBusy(true); setError(''); setSuccess(''); const form = new FormData(event.currentTarget); const details = Object.fromEntries(['easeOfUse', 'features', 'performance', 'value', 'userExperience'].map(d => [d, form.get(d) ? Number(form.get(d)) : null])); try {
        const r = await fetch('/api/ratings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId, overall, title: form.get('title'), content: form.get('content'), ...details }) });
        const data = await r.json();
        if (!r.ok)
            throw Error(data.error);
        setSuccess('Your review is saved. Thanks for sharing!');
        router.refresh();
    }
    catch (e) {
        setError(e instanceof Error ? e.message : 'Unable to save. Try again.');
    }
    finally {
        setBusy(false);
    } }
    async function remove() { if (!confirm('Delete your rating and review?'))
        return; setBusy(true); try {
        const r = await fetch(`/api/ratings/${productId}`, { method: 'DELETE' });
        if (!r.ok)
            throw Error('Unable to delete. Please retry.');
        setOverall(0);
        setSuccess('Rating and review deleted.');
        router.refresh();
    }
    catch (e) {
        setError((e as Error).message);
    }
    finally {
        setBusy(false);
    } }
    return <section className="panel rating-form" id="rate"><h3>{existing ? 'Your rating' : 'Your experience matters'}</h3><p>What’s it like to use this product?</p>{status === 'loading' ? <p>Loading your account…</p> : !session?.user?.id ? <Link className="button primary" href={`/login?callbackUrl=/product/${slug}%23rate`}>Log in to rate & review</Link> : <form className="form-stack" onSubmit={submit}><div className="star-input" role="group" aria-label="Overall rating">{[1, 2, 3, 4, 5].map(n => <button type="button" key={n} aria-label={`Rate ${n} stars`} aria-pressed={overall === n} onClick={() => setOverall(n)}><Star size={28} fill={n <= overall ? 'currentColor' : 'none'}/></button>)}</div><details><summary className="text-button">Add detailed ratings (optional)</summary>{[['easeOfUse', 'Ease of use'], ['features', 'Features'], ['performance', 'Performance'], ['value', 'Value for money'], ['userExperience', 'User experience']].map(([key, label]) => <label key={key} style={{ marginTop: 12 }}>{label}<select name={key} defaultValue={existing?.[key as keyof Scores] || ''}><option value="">Not rated</option>{[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} stars</option>)}</select></label>)}</details><label>Review title (optional)<input name="title" maxLength={120} defaultValue={review?.title || ''} placeholder="Sum up your experience"/></label><label>Your review (optional)<textarea name="content" maxLength={5000} defaultValue={review?.content || ''} placeholder="What worked well? What could be better?"/></label>{error && <p className="form-error" role="alert">{error}</p>}{success && <p className="form-success" role="status">{success}</p>}<button className="button primary" disabled={busy || !overall}>{busy ? 'Saving…' : existing ? 'Update rating & review' : 'Publish rating & review'}</button>{existing && <button type="button" className="text-button danger" disabled={busy} onClick={remove}>Delete my rating & review</button>}</form>}</section>;
}
