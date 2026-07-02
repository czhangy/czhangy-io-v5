import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';
import { SESSION_COOKIE } from '@/lib/utils/constants';
import { prisma } from '@/lib/utils/prisma';

type Params = { params: Promise<{ id: string }> };

export const PATCH = async (request: NextRequest, { params }: Params) => {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifyToken(token) : null;

    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
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
        await prisma.achievement.update({
            where: { id: parseInt(id) },
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

export const DELETE = async (request: NextRequest, { params }: Params) => {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifyToken(token) : null;

    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.achievement.delete({
        where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
};
