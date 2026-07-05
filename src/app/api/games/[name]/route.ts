import { NextRequest, NextResponse } from 'next/server';
import { GAME_MILESTONES, SESSION_COOKIE } from '@/lib/static/constants';
import { prisma } from '@/lib/static/prisma';
import { Game } from '@/lib/static/types';
import AuthHelpers from '@/lib/utils/AuthHelpers';

const authorize = async (request: NextRequest): Promise<boolean> => {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const role = token ? await AuthHelpers.verifyToken(token) : null;
    return role === 'ADMIN';
};

export const PUT = async (
    request: NextRequest,
    { params }: { params: Promise<{ name: string }> }
) => {
    if (!(await authorize(request))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await params;
    const decodedName = decodeURIComponent(name);

    const {
        name: newName,
        genre,
        icon,
        rating,
    } = (await request.json()) as {
        name: string;
        genre: string;
        icon: string;
        rating: number;
    };

    if (!newName?.trim()) {
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

    const current = await prisma.games.findUnique({
        where: { name: decodedName },
    });
    if (!current) {
        return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    const conflict = await prisma.games.findUnique({
        where: { name: newName.trim() },
    });
    if (conflict && conflict.name !== decodedName) {
        return NextResponse.json(
            { error: 'Game already exists' },
            { status: 409 }
        );
    }

    const game = await prisma.games.update({
        where: { name: decodedName },
        data: {
            name: newName.trim(),
            genre: genre.trim(),
            icon: icon.trim(),
            rating,
        },
    });

    return NextResponse.json({
        name: game.name,
        genre: game.genre,
        icon: game.icon,
        rating: game.rating,
    } as Game);
};

export const DELETE = async (
    request: NextRequest,
    { params }: { params: Promise<{ name: string }> }
) => {
    if (!(await authorize(request))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await params;
    const decodedName = decodeURIComponent(name);

    const countBefore = await prisma.games.count();
    await prisma.games.delete({ where: { name: decodedName } });

    const milestone = GAME_MILESTONES.find((m) => m.count === countBefore);
    if (milestone) {
        await prisma.achievements.deleteMany({
            where: { name: milestone.name },
        });
    }

    return NextResponse.json({ success: true });
};
