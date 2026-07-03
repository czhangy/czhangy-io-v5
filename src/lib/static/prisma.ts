import type { HTTPQueryOptions } from '@neondatabase/serverless';
import { PrismaNeonHttp } from '@prisma/adapter-neon';
import { PrismaClient } from '@/generated/prisma/client';

type GlobalWithPrisma = typeof globalThis & { prisma: PrismaClient };

const createClient = () => {
    const adapter = new PrismaNeonHttp(
        process.env.DATABASE_URL!,
        {} as HTTPQueryOptions<boolean, boolean>
    );
    return new PrismaClient({ adapter });
};

export const prisma = (globalThis as GlobalWithPrisma).prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') {
    (globalThis as GlobalWithPrisma).prisma = prisma;
}
