import { AuthForm } from '@/components/auth-form';
export const metadata = { title: 'Log In', robots: { index: false } };
export default async function Login({ searchParams }: {
    searchParams: Promise<{
        callbackUrl?: string;
    }>;
}) { const { callbackUrl } = await searchParams; return <main className="auth-page panel"><span className="eyebrow">GOOD TO HAVE YOU BACK</span><h1 style={{ marginTop: 15 }}>Welcome back.</h1><p>Your next favorite is waiting. Let’s find it.</p><AuthForm callbackUrl={callbackUrl}/></main>; }
