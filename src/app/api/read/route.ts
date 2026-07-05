import { NextRequest, NextResponse } from 'next/server';
import { READ_MILESTONES, SESSION_COOKIE } from '@/lib/static/constants';
import { prisma } from '@/lib/static/prisma';
import { Book } from '@/lib/static/types';
import AuthHelpers from '@/lib/utils/AuthHelpers';
import DateHelpers from '@/lib/utils/DateHelpers';
import GoogleBooksHelpers from '@/lib/utils/GoogleBooksHelpers';

export const POST = async (request: NextRequest) => {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const role = token ? await AuthHelpers.verifyToken(token) : null;

    if (role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, bookId } = (await request.json()) as {
        name: string;
        bookId: string;
    };

    const existing = await prisma.books.findUnique({ where: { bookId } });

    const bookData = await GoogleBooksHelpers.getBookById(bookId);
    const author = bookData?.author;
    const cover = bookData?.cover;
    if (!author || !cover) {
        return NextResponse.json(
            { error: 'Book details incomplete' },
            { status: 422 }
        );
    }

    const record = await prisma.books.upsert({
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

    if (!existing) {
        const count = await prisma.books.count();
        const milestone = READ_MILESTONES.find((m) => m.count === count);
        if (milestone) {
            await prisma.achievement
                .create({
                    data: {
                        tier: milestone.tier,
                        name: milestone.name,
                        category: 'hobbies',
                        description: `Recorded ${milestone.count} read books.`,
                        date: DateHelpers.getTodayString(),
                    },
                })
                .catch(() => {});
        }
    }

    const entry: Book = {
        ...record,
        addedAt: record.addedAt.toISOString(),
    };

    return NextResponse.json(entry);
};
