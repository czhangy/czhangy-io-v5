import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/static/constants';
import { prisma } from '@/lib/static/prisma';
import { Book } from '@/lib/static/types';
import AuthHelpers from '@/lib/utils/AuthHelpers';

export const POST = async (request: NextRequest) => {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const role = token ? await AuthHelpers.verifyToken(token) : null;

    if (role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, author, cover, genres, isOldEntry, preventDuplicate } =
        (await request.json()) as {
            name: string;
            author: string | null;
            cover: string | null;
            genres: string[];
            isOldEntry?: boolean;
            preventDuplicate?: boolean;
        };

    if (!author || !cover || !genres?.length) {
        return NextResponse.json(
            { error: 'Book details incomplete' },
            { status: 422 }
        );
    }

    const existing = await prisma.books.findUnique({
        where: { name_author: { name, author } },
    });

    if (existing && preventDuplicate) {
        return NextResponse.json(
            { error: 'That entry has already been recorded.' },
            { status: 409 }
        );
    }

    const addedAt = isOldEntry ? new Date(0) : new Date();

    const record = await prisma.books.upsert({
        where: { name_author: { name, author } },
        create: {
            name,
            author,
            cover,
            genres,
            addedAt,
        },
        update: { addedAt },
    });

    const entry: Book = {
        id: record.id,
        name: record.name,
        author: record.author,
        cover: record.cover,
        genres: record.genres,
        addedAt: record.addedAt.toISOString(),
    };

    return NextResponse.json(entry);
};
