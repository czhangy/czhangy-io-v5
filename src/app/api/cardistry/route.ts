import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/static/constants';
import { prisma } from '@/lib/static/prisma';
import { CardistryMoveEntry } from '@/lib/static/types';
import AuthHelpers from '@/lib/utils/AuthHelpers';

export const GET = async () => {
    const moves = await prisma.cardistryMove.findMany({
        orderBy: { name: 'asc' },
    });
    return NextResponse.json(
        moves.map((m) => ({
            ...m,
            createdAt: m.createdAt.toISOString(),
        })) as CardistryMoveEntry[]
    );
};

export const POST = async (request: NextRequest) => {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await AuthHelpers.verifyToken(token) : null;

    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, type } = (await request.json()) as {
        name: string;
        type: string;
    };

    if (!name?.trim()) {
        return NextResponse.json(
            { error: 'Name is required' },
            { status: 400 }
        );
    }

    if (!type?.trim()) {
        return NextResponse.json(
            { error: 'Type is required' },
            { status: 400 }
        );
    }

    const existing = await prisma.cardistryMove.findUnique({
        where: { name: name.trim() },
    });

    if (existing) {
        return NextResponse.json(
            { error: 'Move already exists' },
            { status: 409 }
        );
    }

    const move = await prisma.cardistryMove.create({
        data: { name: name.trim(), type: type.trim() },
    });

    const existingItem = await prisma.highlight.findUnique({
        where: { key: 'move' },
    });

    if (existingItem) {
        await prisma.highlight.update({
            where: { key: 'move' },
            data: { value: move.name },
        });
    } else {
        await prisma.highlight.create({
            data: { key: 'move', value: move.name },
        });
    }

    return NextResponse.json({
        ...move,
        createdAt: move.createdAt.toISOString(),
    } as CardistryMoveEntry);
};
