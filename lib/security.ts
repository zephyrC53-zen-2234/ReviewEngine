import {createHash} from 'node:crypto';
import {db} from './db';
export async function consumeLimit(key:string,max=30,seconds=60) {
  const window=Math.floor(Date.now()/(seconds*1000));
  const item=await db.rateLimit.upsert({where:{key:`${key}:${window}`},create:{key:`${key}:${window}`,count:1,expiresAt:new Date((window+1)*seconds*1000)},update:{count:{increment:1}}});
  return item.count<=max;
}
export function clientKey(request:Request) {return createHash('sha256').update(request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local').digest('hex');}
export function sameOrigin(request:Request) {const origin=request.headers.get('origin');return !!origin && origin===new URL(process.env.NEXTAUTH_URL || request.url).origin;}
