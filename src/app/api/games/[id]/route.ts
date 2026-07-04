import { NextRequest, NextResponse } from 'next/server';
import { GAME_MILESTONES, SESSION_COOKIE } from '@/lib/static/constants';
import { prisma } from '@/lib/static/prisma';
import { Game } from '@/lib/static/types';
import AuthHelpers from '@/lib/utils/AuthHelpers';

const authorize = async (request: NextRequest) => {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await AuthHelpers.verifyToken(token) : null;
    return session?.role === 'ADMIN' ? session : null;
};

const parseId = (id: string) => {
    const n = parseInt(id, 10);
    return isNaN(n) ? null : n;
};

export const PUT = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    if (!(await authorize(request))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const numericId = parseId(id);
    if (numericId === null) {
        return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    const { name, genre, icon, rating } = (await request.json()) as {
        name: string;
        genre: string;
        icon: string;
        rating: number;
    };

    if (!name?.trim()) {
        return NextResponse.json(
            { error: 'Name is required' },
            { status: 400 }
        );
    }
    if (!genre?.trim()) {
        return NextResponse.json(
            { error: 'Genre is required' },
            { status: 400 }
        );
    }
    if (!icon?.trim()) {
        return NextResponse.json(
            { error: 'Icon is required' },
            { status: 400 }
        );
    }

    const current = await prisma.game.findUnique({ where: { id: numericId } });
    if (!current) {
        return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    const conflict = await prisma.game.findUnique({
        where: { name: name.trim() },
    });
    if (conflict && conflict.id !== numericId) {
        return NextResponse.json(
            { error: 'Game already exists' },
            { status: 409 }
        );
    }

    const game = await prisma.game.update({
        where: { id: numericId },
        data: {
            name: name.trim(),
            genre: genre.trim(),
            icon: icon.trim(),
            rating,
        },
    });

    return NextResponse.json(game as Game);
};

export const DELETE = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    if (!(await authorize(request))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const numericId = parseId(id);
    if (numericId === null) {
        return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    const countBefore = await prisma.game.count();
    await prisma.game.delete({ where: { id: numericId } });

    const milestone = GAME_MILESTONES.find((m) => m.count === countBefore);
    if (milestone) {
        await prisma.achievement.deleteMany({
            where: { name: milestone.name },
        });
    }

    return NextResponse.json({ success: true });
};
