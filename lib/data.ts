import {db} from './db';
import {bayesian,trendScore} from './ranking';
export const dimensions=['overall','easeOfUse','features','performance','value','userExperience'] as const;
export const dimensionLabels={overall:'Overall rating',easeOfUse:'Ease of use',features:'Features',performance:'Performance',value:'Value for money',userExperience:'User experience'};
export async function getProducts(category?:string) {
 const since=new Date(Date.now()-14*86400000), week=Date.now()-7*86400000;
 const products=await db.product.findMany({where:category?{category:{slug:category}}:undefined,include:{category:true,ratings:{select:{overall:true,easeOfUse:true,features:true,performance:true,value:true,userExperience:true,createdAt:true}},reviews:{where:{approved:true},select:{createdAt:true}},visits:{where:{createdAt:{gte:since}},select:{createdAt:true}}}});
 return products.map(p=>{const count=p.ratings.length;const scores=Object.fromEntries(dimensions.map(d=>{const values=p.ratings.map(r=>r[d]).filter((v):v is number=>v!==null);return [d,values.length?values.reduce((a,b)=>a+b,0)/values.length:0];})) as Record<typeof dimensions[number],number>;const recent=p.ratings.filter(r=>+r.createdAt>=week).length;return {id:p.id,name:p.name,slug:p.slug,description:p.description,logo:p.logo,color:p.color,websiteUrl:p.websiteUrl,pros:p.pros,cons:p.cons,category:p.category,createdAt:p.createdAt.toISOString(),count,reviewCount:p.reviews.length,scores,average:scores.overall,weighted:bayesian(scores.overall,count),distribution:[5,4,3,2,1].map(s=>p.ratings.filter(r=>r.overall===s).length),trending:trendScore(recent,p.ratings.filter(r=>+r.createdAt<week && r.createdAt>=since).length,p.reviews.filter(r=>+r.createdAt>=week).length,p.visits.filter(r=>+r.createdAt>=week).length)};}).sort((a,b)=>b.weighted-a.weighted);
}
export type ProductSummary=Awaited<ReturnType<typeof getProducts>>[number];
export async function getCategories(){return db.category.findMany({include:{_count:{select:{products:true}}},orderBy:{name:'asc'}});}
export async function getReviews(productId?:string,sort='recent',page=1,userId?:string) {
 const where={approved:true,...(productId?{productId}:{}),...(userId?{userId}:{})};
 const reviews=await db.review.findMany({where,include:{user:{select:{username:true,avatar:true,isSample:true}},product:{select:{name:true,slug:true,color:true}},votes:{select:{helpful:true,userId:true}}},orderBy:sort==='highest'?{rating:'desc'}:sort==='lowest'?{rating:'asc'}:{createdAt:'desc'}});
 if(sort==='helpful') reviews.sort((a,b)=>b.votes.filter(v=>v.helpful).length-a.votes.filter(v=>v.helpful).length);
 return {total:reviews.length,reviews:reviews.slice((page-1)*6,page*6).map(r=>({...r,createdAt:r.createdAt.toISOString(),updatedAt:r.updatedAt.toISOString()}))};
}
