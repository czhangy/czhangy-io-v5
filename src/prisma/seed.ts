import type { HTTPQueryOptions } from '@neondatabase/serverless';
import { PrismaNeonHttp } from '@prisma/adapter-neon';
import { hash } from 'bcryptjs';
import { config } from 'dotenv';
import { PrismaClient } from '@/prisma/generated/client';

config({ path: '.env.local' });

const adapter = new PrismaNeonHttp(
    process.env.DATABASE_URL!,
    {} as HTTPQueryOptions<boolean, boolean>
);
const prisma = new PrismaClient({ adapter });

const seed = async () => {
    const password = process.env.SEED_ADMIN_PASSWORD;

    if (!password) {
        throw new Error('SEED_ADMIN_PASSWORD is not set in .env.local');
    }

    const hashedPassword = await hash(password, 12);

    const admin = await prisma.users.upsert({
        where: { id: 'admin' },
        update: { hashedPassword },
        create: { id: 'admin', hashedPassword, role: 'ADMIN' },
    });

    console.log(`Admin user seeded: ${admin.id}`);
};

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
