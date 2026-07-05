import { NextRequest, NextResponse } from 'next/server';
import { GAME_MILESTONES, SESSION_COOKIE } from '@/lib/static/constants';
import { prisma } from '@/lib/static/prisma';
import { Game } from '@/lib/static/types';
import AuthHelpers from '@/lib/utils/AuthHelpers';
import DateHelpers from '@/lib/utils/DateHelpers';

export const GET = async () => {
    const games = await prisma.game.findMany({
        orderBy: { name: 'asc' },
    });
    return NextResponse.json(games as Game[]);
};

export const POST = async (request: NextRequest) => {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const role = token ? await AuthHelpers.verifyToken(token) : null;

    if (role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    const existing = await prisma.game.findUnique({
        where: { name: name.trim() },
    });

    if (existing) {
        return NextResponse.json(
            { error: 'Game already exists' },
            { status: 409 }
        );
    }

    const game = await prisma.game.create({
        data: {
            name: name.trim(),
            genre: genre.trim(),
            icon: icon.trim(),
            rating,
        },
    });

    const count = await prisma.game.count();
    const milestone = GAME_MILESTONES.find((m) => m.count === count);
    if (milestone) {
        await prisma.achievement
            .create({
                data: {
                    tier: milestone.tier,
                    name: milestone.name,
                    category: 'Gaming',
                    description: `Recorded ${milestone.count} played games.`,
                    date: DateHelpers.getTodayString(),
                },
            })
            .catch(() => {});
    }

    return NextResponse.json(game as Game);
};
