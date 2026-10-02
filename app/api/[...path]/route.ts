import {NextResponse} from 'next/server';
import {z} from 'zod';
import {hash} from 'bcryptjs';
import {randomUUID} from 'node:crypto';
import {mkdir,writeFile} from 'node:fs/promises';
import {db} from '@/lib/db';
import {currentUser} from '@/lib/auth';
import {clientKey,consumeLimit,sameOrigin} from '@/lib/security';
import {categorySchema,productSchema,ratingSchema,signupSchema} from '@/lib/validation';
import {getCategories,getProducts,getReviews} from '@/lib/data';
type Context={params:Promise<{path:string[]}>};
const json=NextResponse.json;
async function handle(request:Request,context:Context) {
 try {
  const {path}=await context.params;const [resource,id]=path;const method=request.method;const url=new URL(request.url);
  if(method==='GET') {
   if(resource==='categories')return json(await getCategories());
   if(resource==='products'||resource==='rankings'||resource==='comparisons')return json(await getProducts(url.searchParams.get('category')||undefined));
   if(resource==='search'){const q=(url.searchParams.get('q')||'').slice(0,80);if(q.length<1)return json({products:[],categories:[]});const [products,categories]=await Promise.all([db.product.findMany({where:{OR:[{name:{contains:q,mode:'insensitive'}},{category:{name:{contains:q,mode:'insensitive'}}}]},include:{category:{select:{name:true}}},take:8}),db.category.findMany({where:{name:{contains:q,mode:'insensitive'}},take:4})]);return json({products,categories});}
   if(resource==='reviews')return json(await getReviews(url.searchParams.get('productId')||undefined,url.searchParams.get('sort')||'recent',Math.max(1,Math.min(10000,Number(url.searchParams.get('page'))||1))));
  }
  if(!sameOrigin(request))return json({error:'Invalid request origin.'},{status:403});
  if(!await consumeLimit(`ip:${clientKey(request)}`,90))return json({error:'Too many requests. Please try again shortly.'},{status:429});
  if(resource==='signup'&&method==='POST') {if(!await consumeLimit(`signup:${clientKey(request)}`,5,3600))return json({error:'Please try again later.'},{status:429});const data=signupSchema.parse(await request.json());await db.user.create({data:{username:data.username,email:data.email,passwordHash:await hash(data.password,12)}});return json({ok:true},{status:201});}
  if(resource==='visits'&&method==='POST'){const {productId}=z.object({productId:z.string()}).parse(await request.json());const visitorHash=clientKey(request),day=new Date().toISOString().slice(0,10);await db.visit.upsert({where:{productId_visitorHash_day:{productId,visitorHash,day}},create:{productId,visitorHash,day},update:{}});return json({ok:true});}
  const user=await currentUser();if(!user)return json({error:'Please log in to continue.'},{status:401});
  if(resource==='upload'&&method==='POST'){
   const form=await request.formData();const file=form.get('file');if(!(file instanceof File)||file.size>2*1024*1024) return json({error:'Choose an image smaller than 2 MB.'},{status:400});
   const bytes=Buffer.from(await file.arrayBuffer());const ext=bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))?'png':bytes[0]===255&&bytes[1]===216&&bytes[2]===255?'jpg':bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP'?'webp':null;
   if(!ext)return json({error:'Only PNG, JPEG, and WebP images are supported.'},{status:400});const name=`${randomUUID()}.${ext}`;await mkdir('public/uploads',{recursive:true});await writeFile(`public/uploads/${name}`,bytes);return json({url:`/uploads/${name}`});
  }
  if(resource==='profile'&&method==='PATCH'){const data=z.object({username:signupSchema.shape.username,avatar:z.string().regex(/^\/uploads\/[a-f0-9-]+\.(png|jpg|webp)$/).optional()}).parse(await request.json());await db.user.update({where:{id:user.id},data});return json({ok:true});}
  if(resource==='ratings'){
   if(method==='DELETE'){await db.$transaction([db.rating.deleteMany({where:{userId:user.id,productId:id}}),db.review.deleteMany({where:{userId:user.id,productId:id}})]);return json({ok:true});}
   if(method==='POST'||method==='PUT') {const {productId,title,content,...scores}=ratingSchema.parse(await request.json());const key={userId:user.id,productId};await db.$transaction(async tx=>{await tx.rating.upsert({where:{userId_productId:key},create:{...key,...scores},update:scores});if(content)await tx.review.upsert({where:{userId_productId:key},create:{...key,title,content,rating:scores.overall},update:{title,content,rating:scores.overall}});else await tx.review.deleteMany({where:key});});return json({ok:true});}
  }
  if(resource==='reviews'&&method==='DELETE'){await db.review.deleteMany({where:{id,userId:user.id}});return json({ok:true});}
  if(resource==='votes'&&method==='POST'){const {helpful}=z.object({helpful:z.boolean()}).parse(await request.json());const review=await db.review.findFirst({where:{id,approved:true}});if(!review)return json({error:'Review not found.'},{status:404});if(review.userId===user.id)return json({error:'You cannot vote on your own review.'},{status:400});const key={userId:user.id,reviewId:id};await db.reviewVote.upsert({where:{userId_reviewId:key},create:{...key,helpful},update:{helpful}});return json({ok:true});}
  if(resource==='reports'&&method==='POST'){const {reason}=z.object({reason:z.string().trim().min(5).max(500)}).parse(await request.json());await db.report.upsert({where:{userId_reviewId:{userId:user.id,reviewId:id}},create:{userId:user.id,reviewId:id,reason},update:{reason,status:'OPEN'}});return json({ok:true});}
  if(resource==='admin') {
   if(user.role!=='ADMIN')return json({error:'Administrator access required.'},{status:403});const entity=id,entityId=path[2];
   if(entity==='categories'){if(method==='DELETE')await db.category.delete({where:{id:entityId}});else {const data=categorySchema.parse(await request.json());if(method==='PATCH')await db.category.update({where:{id:entityId},data});else if(method==='POST')await db.category.create({data});else return json({error:'Method not allowed'},{status:405});}}
   else if(entity==='products'){if(method==='DELETE')await db.product.delete({where:{id:entityId}});else{const data=productSchema.parse(await request.json());if(method==='PATCH')await db.product.update({where:{id:entityId},data});else if(method==='POST')await db.product.create({data});else return json({error:'Method not allowed'},{status:405});}}
   else if(entity==='reviews'&&method==='PATCH'){await db.review.update({where:{id:entityId},data:z.object({approved:z.boolean()}).parse(await request.json())});}
   else if(entity==='users'&&method==='PATCH'){if(entityId===user.id)return json({error:'You cannot change your own access.'},{status:400});await db.user.update({where:{id:entityId},data:z.object({disabled:z.boolean()}).parse(await request.json())});}
   else if(entity==='reports'&&method==='PATCH'){await db.report.update({where:{id:entityId},data:{status:'RESOLVED'}});}
   else return json({error:'Not found'},{status:404});return json({ok:true});
  }
  return json({error:'Not found'},{status:404});
 }catch(error){if(error instanceof z.ZodError)return json({error:error.issues[0]?.message||'Invalid input.'},{status:400});const code=(error as {code?:string}).code;if(code==='P2002')return json({error:'That username, email, or URL slug is already in use.'},{status:409});if(code==='P2003')return json({error:'This item has related records. Remove its products first, or check the selected item.'},{status:409});if(code==='P2025')return json({error:'Item not found.'},{status:404});console.error(error);return json({error:'Something went wrong. Please try again.'},{status:500});}
}
export {handle as GET,handle as POST,handle as PUT,handle as PATCH,handle as DELETE};
