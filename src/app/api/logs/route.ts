import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/static/constants';
import { prisma } from '@/lib/static/prisma';
import AuthHelpers from '@/lib/utils/AuthHelpers';
import LogHelpers from '@/lib/utils/LogHelpers';

export const POST = async (request: NextRequest) => {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const role = token ? await AuthHelpers.verifyToken(token) : null;

    if (role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, tags, body } = (await request.json()) as {
        title: string;
        tags: string[];
        body: string;
    };

    if (!title?.trim() || !body?.trim()) {
        return NextResponse.json(
            { error: 'Title and body are required' },
            { status: 400 }
        );
    }

    const baseSlug = LogHelpers.slugify(title);
    let slug = baseSlug;
    let suffix = 2;
    while (await prisma.logs.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${suffix}`;
        suffix += 1;
    }

    const record = await prisma.logs.create({
        data: { slug, title, tags, body },
    });

    return NextResponse.json({ success: true, slug: record.slug });
};
