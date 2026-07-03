import { NextRequest, NextResponse } from 'next/server';
import TMDBHelpers from '@/lib/utils/TMDBHelpers';

export const GET = async (request: NextRequest) => {
    const q = request.nextUrl.searchParams.get('q');
    if (!q?.trim()) return NextResponse.json([]);

    const results = await TMDBHelpers.searchMedia(q);
    return NextResponse.json(results);
};
