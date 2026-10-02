'use client';
export default function ErrorPage({ reset }: {
    reset: () => void;
}) { return <main className="not-found"><span className="eyebrow">SOMETHING WENT WRONG</span><h1>Let’s give that another try.</h1><p>We couldn’t load this page. Please check your connection and try again.</p><button className="button primary" onClick={reset}>Try again</button></main>; }
