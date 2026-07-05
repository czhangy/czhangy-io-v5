import { NextRequest, NextResponse } from 'next/server';
import GoogleBooksHelpers from '@/lib/utils/GoogleBooksHelpers';

export const GET = async (request: NextRequest) => {
    const q = request.nextUrl.searchParams.get('q');
    if (!q?.trim()) return NextResponse.json([]);
    const results = await GoogleBooksHelpers.searchBooks(q);
    return NextResponse.json(results);
};
