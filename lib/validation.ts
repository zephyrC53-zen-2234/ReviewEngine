import {z} from 'zod';
export const star=z.number().int().min(1).max(5);
export const signupSchema=z.object({username:z.string().trim().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/).transform(v=>v.toLowerCase()),email:z.email().max(254).transform(v=>v.toLowerCase()),password:z.string().min(10).max(128)});
export const ratingSchema=z.object({productId:z.string().min(1),overall:star,easeOfUse:star.nullish(),features:star.nullish(),performance:star.nullish(),value:star.nullish(),userExperience:star.nullish(),title:z.string().trim().max(120).default(''),content:z.string().trim().max(5000).default('')});
export const slug=z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80);
export const safeUrl=z.url().refine(v=>['https:','http:'].includes(new URL(v).protocol),'Use an HTTP or HTTPS URL');
export const categorySchema=z.object({name:z.string().trim().min(2).max(60),slug,description:z.string().trim().min(5).max(500),icon:z.string().max(40).default('Layers')});
export const productSchema=z.object({name:z.string().trim().min(1).max(80),slug,description:z.string().trim().min(5).max(2000),categoryId:z.string().min(1),websiteUrl:safeUrl,logo:z.union([safeUrl,z.string().regex(/^\/uploads\/[a-f0-9-]+\.(png|jpg|webp)$/),z.literal('')]).optional(),color:z.string().regex(/^#[a-fA-F0-9]{6}$/).default('#7756e8'),pros:z.array(z.string().max(150)).max(10).default([]),cons:z.array(z.string().max(150)).max(10).default([])});
