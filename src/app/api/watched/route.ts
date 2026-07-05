import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, WATCHED_MILESTONES } from '@/lib/static/constants';
import { prisma } from '@/lib/static/prisma';
import { WatchedMediaEntry } from '@/lib/static/types';
import AuthHelpers from '@/lib/utils/AuthHelpers';
import DateHelpers from '@/lib/utils/DateHelpers';
import TMDBHelpers from '@/lib/utils/TMDBHelpers';

export const POST = async (request: NextRequest) => {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const role = token ? await AuthHelpers.verifyToken(token) : null;

    if (role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, tmdbId, mediaType } = (await request.json()) as {
        name: string;
        tmdbId: number;
        mediaType: 'movie' | 'tv';
    };

    const existing = await prisma.watchedMedia.findUnique({
        where: { tmdbId },
    });

    const tmdbData = await TMDBHelpers.getMediaById(tmdbId, mediaType);
    const poster = tmdbData?.poster;
    if (!poster) {
        return NextResponse.json(
            { error: 'Poster not available' },
            { status: 422 }
        );
    }

    const record = await prisma.watchedMedia.upsert({
        where: { tmdbId },
        create: {
            name,
            tmdbId,
            mediaType,
            poster,
            genres: tmdbData?.genres ?? [],
        },
        update: { addedAt: new Date() },
    });

    if (!existing) {
        const count = await prisma.watchedMedia.count();
        const milestone = WATCHED_MILESTONES.find((m) => m.count === count);
        if (milestone) {
            await prisma.achievement
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

    const entry: WatchedMediaEntry = {
        ...record,
        mediaType: record.mediaType as 'movie' | 'tv',
        addedAt: record.addedAt.toISOString(),
    };

    return NextResponse.json(entry);
};
