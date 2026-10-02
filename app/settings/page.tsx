import {redirect} from 'next/navigation';
import {currentUser} from '@/lib/auth';
import {ProfileSettings} from '@/components/profile-settings';
export const metadata={title:'Profile Settings',robots:{index:false}};
export default async function Settings(){const user=await currentUser();if(!user)redirect('/login?callbackUrl=/settings');return <main className="auth-page panel"><h1>Your profile.</h1><p>A little more you.</p><ProfileSettings username={user.username}/></main>}
