// Primsa Client 
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../../../generated/prisma';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

//Database Connection Check
export async function checkDatabaseConnection(): Promise<boolean> {
    try {
        await prisma.$queryRaw`Select 1`
        return true;
    } catch (error) {
        console.error(`Database connection failed: ${error}`)
        return false;
    }
}