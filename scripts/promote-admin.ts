import 'dotenv/config';
import {PrismaClient} from '../generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
const db=new PrismaClient({adapter:new PrismaPg({connectionString:process.env.DATABASE_URL})});
const email=process.argv[2]?.toLowerCase();
if(!email)throw Error('Usage: npx tsx scripts/promote-admin.ts your-email@example.com');
try{await db.user.update({where:{email},data:{role:'ADMIN'}});console.log('Admin role assigned.');}finally{await db.$disconnect();}
