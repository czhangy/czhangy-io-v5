import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';
import { SESSION_COOKIE } from '@/lib/utils/constants';
import { prisma } from '@/lib/utils/prisma';

export const POST = async (request: NextRequest) => {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifyToken(token) : null;

    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tier, name, category, description, date } =
        (await request.json()) as {
            tier: number;
            name: string;
            category: string;
            description: string;
            date: string;
        };

    if (
        !name ||
        !category ||
        !description ||
        !date ||
        ![1, 2, 3].includes(tier)
    ) {
        return NextResponse.json(
            { error: 'All fields are required' },
            { status: 400 }
        );
    }

    try {
        await prisma.achievement.create({
            data: { tier, name, category, description, date },
        });
    } catch (e) {
        if (
            (e as { code?: string }).code === 'P2002' ||
            (e as { code?: string }).code === '23505'
        ) {
            return NextResponse.json(
                { error: 'An achievement with that name already exists.' },
                { status: 409 }
            );
        }
        throw e;
    }

    return NextResponse.json({ success: true });
};
