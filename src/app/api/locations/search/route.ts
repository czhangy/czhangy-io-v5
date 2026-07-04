import { NextRequest, NextResponse } from 'next/server';
import LocationHelpers from '@/lib/utils/LocationHelpers';

export const GET = async (request: NextRequest) => {
    const q = request.nextUrl.searchParams.get('q');
    if (!q?.trim()) return NextResponse.json([]);
    const results = await LocationHelpers.searchLocations(q);
    return NextResponse.json(results);
};
