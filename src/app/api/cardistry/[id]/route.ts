import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/static/constants';
import { prisma } from '@/lib/static/prisma';
import { CardistryMoveEntry } from '@/lib/static/types';
import AuthHelpers from '@/lib/utils/AuthHelpers';

export const PATCH = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await AuthHelpers.verifyToken(token) : null;

    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
        return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    const existingItem = await prisma.statusItem.findUnique({
        where: { key: 'cardistryMove' },
    });

    if (existingItem) {
        await prisma.statusItem.update({
            where: { key: 'cardistryMove' },
            data: { value: String(numericId) },
        });
    } else {
        await prisma.statusItem.create({
            data: { key: 'cardistryMove', value: String(numericId) },
        });
    }

    const move = await prisma.cardistryMove.findUnique({
        where: { id: numericId },
    });

    if (!move) {
        return NextResponse.json({ error: 'Move not found' }, { status: 404 });
    }

    return NextResponse.json({
        ...move,
        createdAt: move.createdAt.toISOString(),
    } as CardistryMoveEntry);
};
