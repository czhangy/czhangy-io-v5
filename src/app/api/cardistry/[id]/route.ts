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

    const [, move] = await prisma.$transaction([
        prisma.cardistryMove.updateMany({ data: { isActive: false } }),
        prisma.cardistryMove.update({
            where: { id: numericId },
            data: { isActive: true },
        }),
    ]);

    return NextResponse.json(move as CardistryMoveEntry);
};
