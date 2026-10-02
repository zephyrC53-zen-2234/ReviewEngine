import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
try {
    const result = await db.rateLimit.deleteMany({ where: { expiresAt: { lt: new Date() } } });
    console.log(`Removed ${result.count} expired rate-limit windows.`);
}
finally {
    await db.$disconnect();
}
