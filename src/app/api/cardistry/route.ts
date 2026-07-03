import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/static/constants';
import { prisma } from '@/lib/static/prisma';
import { CardistryMoveEntry } from '@/lib/static/types';
import AuthHelpers from '@/lib/utils/AuthHelpers';

export const GET = async () => {
    const moves = await prisma.cardistryMove.findMany({
        orderBy: { name: 'asc' },
    });
    return NextResponse.json(moves as CardistryMoveEntry[]);
};

export const POST = async (request: NextRequest) => {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await AuthHelpers.verifyToken(token) : null;

    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = (await request.json()) as { name: string };

    if (!name?.trim()) {
        return NextResponse.json(
            { error: 'Name is required' },
            { status: 400 }
        );
    }

    const [, move] = await prisma.$transaction([
        prisma.cardistryMove.updateMany({ data: { isActive: false } }),
        prisma.cardistryMove.upsert({
            where: { name: name.trim() },
            create: { name: name.trim(), isActive: true },
            update: { isActive: true },
        }),
    ]);

    return NextResponse.json(move as CardistryMoveEntry);
};
