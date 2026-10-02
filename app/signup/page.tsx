import {AuthForm} from '@/components/auth-form';
export const metadata={title:'Join the Community',robots:{index:false}};
export default async function Signup({searchParams}:{searchParams:Promise<{callbackUrl?:string}>}){const {callbackUrl}=await searchParams;return <main className="auth-page panel"><span className="eyebrow">BETTER CHOICES START HERE</span><h1 style={{marginTop:15}}>Join the conversation.</h1><p>Share your experiences. Discover something great.</p><AuthForm signup callbackUrl={callbackUrl}/></main>}
