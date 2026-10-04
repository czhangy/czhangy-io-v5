import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/static/constants';
import { prisma } from '@/lib/static/prisma';
import { Content } from '@/lib/static/types';
import AuthHelpers from '@/lib/utils/AuthHelpers';

export const POST = async (request: NextRequest) => {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const role = token ? await AuthHelpers.verifyToken(token) : null;

    if (role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, mediaType, poster, genres, isOldEntry, preventDuplicate } =
        (await request.json()) as {
            name: string;
            mediaType: 'movie' | 'tv';
            poster: string | null;
            genres: string[];
            isOldEntry?: boolean;
            preventDuplicate?: boolean;
        };

    if (!poster || !genres?.length) {
        return NextResponse.json(
            { error: 'Content details incomplete' },
            { status: 422 }
        );
    }

    const existing = await prisma.content.findUnique({
        where: { name_poster: { name, poster } },
    });

    if (existing && preventDuplicate) {
        return NextResponse.json(
            { error: 'That entry has already been recorded.' },
            { status: 409 }
        );
    }

    const addedAt = isOldEntry ? new Date(0) : new Date();

    const record = await prisma.content.upsert({
        where: { name_poster: { name, poster } },
        create: {
            name,
            mediaType,
            poster,
            genres,
            addedAt,
        },
        update: { addedAt },
    });

    const entry: Content = {
        ...record,
        mediaType: record.mediaType as 'movie' | 'tv',
        addedAt: record.addedAt.toISOString(),
    };

    return NextResponse.json(entry);
};
