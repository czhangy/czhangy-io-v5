import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/static/constants';
import { prisma } from '@/lib/static/prisma';
import { ReadMediaEntry } from '@/lib/static/types';
import AuthHelpers from '@/lib/utils/AuthHelpers';
import GoogleBooksHelpers from '@/lib/utils/GoogleBooksHelpers';

export const POST = async (request: NextRequest) => {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await AuthHelpers.verifyToken(token) : null;

    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, bookId } = (await request.json()) as {
        name: string;
        bookId: string;
    };

    const bookData = await GoogleBooksHelpers.getBookById(bookId);
    const author = bookData?.author;
    const cover = bookData?.cover;
    if (!author || !cover) {
        return NextResponse.json(
            { error: 'Book details incomplete' },
            { status: 422 }
        );
    }

    const record = await prisma.readMedia.upsert({
        where: { bookId },
        create: {
            name,
            bookId,
            author,
            cover,
            genres: bookData?.genres ?? [],
        },
        update: { addedAt: new Date() },
    });

    const entry: ReadMediaEntry = {
        ...record,
        addedAt: record.addedAt.toISOString(),
    };

    return NextResponse.json(entry);
};
