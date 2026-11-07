import { NextRequest, NextResponse } from 'next/server';
import { ROUTINE_TYPE, SESSION_COOKIE } from '@/lib/static/constants';
import { prisma } from '@/lib/static/prisma';
import { Move } from '@/lib/static/types';
import AuthHelpers from '@/lib/utils/AuthHelpers';

export const GET = async () => {
    const moves = await prisma.moves.findMany({
        orderBy: { name: 'asc' },
    });
    return NextResponse.json(
        moves.map((m) => ({
            name: m.name,
            type: m.type,
            tutorial: m.tutorial,
            notes: m.notes,
            count: m.count,
            createdAt: m.createdAt.toISOString(),
        })) as Move[]
    );
};

export const POST = async (request: NextRequest) => {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const role = token ? await AuthHelpers.verifyToken(token) : null;

    if (role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, type, tutorial, notes } = (await request.json()) as {
        name: string;
        type: string;
        tutorial: string;
        notes?: string;
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

    const isRoutine = type.trim() === ROUTINE_TYPE;

    const existing = await prisma.moves.findUnique({
        where: { name: name.trim() },
    });

    if (existing) {
        return NextResponse.json(
            { error: 'Move already exists' },
            { status: 409 }
        );
    }

    const move = await prisma.moves.create({
        data: {
            name: name.trim(),
            type: type.trim(),
            tutorial: isRoutine ? '' : (tutorial ?? '').trim(),
            notes: isRoutine ? (notes ?? '').trim() : '',
        },
    });

    await prisma.highlights.upsert({
        where: { key: 'move' },
        update: { value: move.name },
        create: { key: 'move', value: move.name },
    });

    return NextResponse.json({
        name: move.name,
        type: move.type,
        tutorial: move.tutorial,
        notes: move.notes,
        count: move.count,
        createdAt: move.createdAt.toISOString(),
    } as Move);
};
