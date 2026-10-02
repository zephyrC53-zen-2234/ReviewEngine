'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { localRedirect } from '@/lib/redirect';
export function AuthForm({ signup = false, callbackUrl = '/' }: {
    signup?: boolean;
    callbackUrl?: string;
}) {
    const [error, setError] = useState(''), [busy, setBusy] = useState(false);
    async function submit(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); setBusy(true); setError(''); const form = new FormData(e.currentTarget), email = String(form.get('email')), password = String(form.get('password')); try {
        if (signup) {
            const r = await fetch('/api/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, username: form.get('username') }) });
            const result = await r.json();
            if (!r.ok)
                throw Error(result.error);
        }
        const result = await signIn('credentials', { email, password, redirect: false });
        if (result?.error)
            throw Error('Unable to sign in. Check your email and password, or try again later.');
        window.location.assign(localRedirect(callbackUrl, window.location.origin));
    }
    catch (e) {
        setError((e as Error).message);
        setBusy(false);
    } }
    return <><form className="form-stack" onSubmit={submit}>{signup && <label>Username<input name="username" required minLength={3} maxLength={30} pattern="[a-zA-Z0-9_]+" autoComplete="username" placeholder="Your community name"/></label>}<label>Email<input name="email" type="email" required autoComplete="email" placeholder="you@example.com" maxLength={254}/></label><label>Password<input name="password" type="password" required minLength={signup ? 10 : 1} maxLength={128} autoComplete={signup ? 'new-password' : 'current-password'} placeholder={signup ? 'At least 10 characters' : 'Your password'}/></label>{error && <p className="form-error" role="alert">{error}</p>}<button disabled={busy} className="button primary">{busy ? 'One moment…' : signup ? 'Create your account' : 'Log in'}</button></form><p className="auth-switch">{signup ? 'Already part of the community?' : 'New around here?'} <Link href={`${signup ? '/login' : '/signup'}?callbackUrl=${encodeURIComponent(callbackUrl)}`}>{signup ? 'Log in' : 'Create an account'}</Link></p></>;
}
