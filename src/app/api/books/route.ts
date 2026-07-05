import { NextRequest, NextResponse } from 'next/server';
import { READ_MILESTONES, SESSION_COOKIE } from '@/lib/static/constants';
import { prisma } from '@/lib/static/prisma';
import { Book } from '@/lib/static/types';
import AuthHelpers from '@/lib/utils/AuthHelpers';
import DateHelpers from '@/lib/utils/DateHelpers';

export const POST = async (request: NextRequest) => {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const role = token ? await AuthHelpers.verifyToken(token) : null;

    if (role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, author, cover, genres } = (await request.json()) as {
        name: string;
        author: string | null;
        cover: string | null;
        genres: string[];
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

    const record = await prisma.books.upsert({
        where: { name_author: { name, author } },
        create: {
            name,
            author,
            cover,
            genres,
        },
        update: { addedAt: new Date() },
    });

    if (!existing) {
        const count = await prisma.books.count();
        const milestone = READ_MILESTONES.find((m) => m.count === count);
        if (milestone) {
            await prisma.achievements
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
        id: record.id,
        name: record.name,
        author: record.author,
        cover: record.cover,
        genres: record.genres,
        addedAt: record.addedAt.toISOString(),
    };

    return NextResponse.json(entry);
};
