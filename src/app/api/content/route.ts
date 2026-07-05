import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, WATCHED_MILESTONES } from '@/lib/static/constants';
import { prisma } from '@/lib/static/prisma';
import { Content } from '@/lib/static/types';
import AuthHelpers from '@/lib/utils/AuthHelpers';
import DateHelpers from '@/lib/utils/DateHelpers';

export const POST = async (request: NextRequest) => {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const role = token ? await AuthHelpers.verifyToken(token) : null;

    if (role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, tmdbId, mediaType, poster, genres } =
        (await request.json()) as {
            name: string;
            tmdbId: number;
            mediaType: 'movie' | 'tv';
            poster: string | null;
            genres: string[];
        };

    const existing = await prisma.content.findUnique({
        where: { tmdbId },
    });

    if (!poster || !genres?.length) {
        return NextResponse.json(
            { error: 'Content details incomplete' },
            { status: 422 }
        );
    }

    const record = await prisma.content.upsert({
        where: { tmdbId },
        create: {
            name,
            tmdbId,
            mediaType,
            poster,
            genres,
        },
        update: { addedAt: new Date() },
    });

    if (!existing) {
        const count = await prisma.content.count();
        const milestone = WATCHED_MILESTONES.find((m) => m.count === count);
        if (milestone) {
            await prisma.achievements
                .create({
                    data: {
                        tier: milestone.tier,
                        name: milestone.name,
                        category: 'hobbies',
                        description: `Recorded ${milestone.count} watched TV shows/movies.`,
                        date: DateHelpers.getTodayString(),
                    },
                })
                .catch(() => {});
        }
    }

    const entry: Content = {
        ...record,
        mediaType: record.mediaType as 'movie' | 'tv',
        addedAt: record.addedAt.toISOString(),
    };

    return NextResponse.json(entry);
};
