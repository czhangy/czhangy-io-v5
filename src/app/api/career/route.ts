import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/static/constants';
import { prisma } from '@/lib/static/prisma';
import { Job } from '@/lib/static/types';
import AuthHelpers from '@/lib/utils/AuthHelpers';

export const POST = async (request: NextRequest) => {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const role = token ? await AuthHelpers.verifyToken(token) : null;

    if (role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { company, title, startDate, endDate, logo } =
        (await request.json()) as {
            company: string;
            title: string;
            startDate: string;
            endDate: string | null;
            logo: string;
        };

    if (
        !company?.trim() ||
        !title?.trim() ||
        !startDate?.trim() ||
        !logo?.trim()
    ) {
        return NextResponse.json(
            { error: 'All fields are required' },
            { status: 400 }
        );
    }

    let job;
    try {
        job = await prisma.jobs.create({
            data: {
                company: company.trim(),
                title: title.trim(),
                startDate: startDate.trim(),
                endDate: endDate?.trim() || null,
                logo: logo.trim(),
            },
        });
    } catch (e) {
        if (
            (e as { code?: string }).code === 'P2002' ||
            (e as { code?: string }).code === '23505'
        ) {
            return NextResponse.json(
                {
                    error: 'A job with that company and start date already exists.',
                },
                { status: 409 }
            );
        }
        throw e;
    }

    return NextResponse.json({
        id: job.id,
        company: job.company,
        title: job.title,
        startDate: job.startDate,
        endDate: job.endDate,
        logo: job.logo,
    } as Job);
};
