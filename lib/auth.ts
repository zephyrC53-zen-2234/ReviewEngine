import type {NextAuthOptions} from 'next-auth';
import {getServerSession} from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import {compare} from 'bcryptjs';
import {db} from './db';
import {consumeLimit} from './security';
export const authOptions: NextAuthOptions = {
  session: {strategy: 'jwt',maxAge: 60 * 60 * 24 * 7},
  pages: {signIn: '/login'},
  providers: [Credentials({name:'Email and password',credentials:{email:{type:'email'},password:{type:'password'}},async authorize(credentials) {
    const email = credentials?.email?.toLowerCase().trim();
    if(!email || !credentials?.password || credentials.password.length > 128) return null;
    if(!await consumeLimit(`login:${email}`,10,900)) return null;
    const user = await db.user.findUnique({where:{email}});
    if(!user || user.disabled || !await compare(credentials.password,user.passwordHash)) return null;
    return {id:user.id,name:user.username,email:user.email,image:user.avatar};
  }})],
  callbacks: {async jwt({token,user}) {if(user) token.sub=user.id; return token;},async session({session,token}) {
    if(session.user && token.sub) { const user=await db.user.findUnique({where:{id:token.sub}}); if(user && !user.disabled) {session.user.id=user.id;session.user.name=user.username;session.user.image=user.avatar;session.user.role=user.role;} }
    return session;
  }}
};
export async function currentUser() {const session=await getServerSession(authOptions);if(!session?.user?.id) return null;return db.user.findFirst({where:{id:session.user.id,disabled:false},select:{id:true,username:true,avatar:true,role:true,createdAt:true}});}
