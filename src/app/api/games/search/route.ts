import { NextRequest, NextResponse } from 'next/server';
import { RAWGSearchResult } from '@/lib/static/types';

type RAWGSearchResponse = {
    results: {
        id: number;
        name: string;
        released: string | null;
        background_image: string | null;
        genres: { name: string }[];
    }[];
};

export const GET = async (request: NextRequest) => {
    const q = request.nextUrl.searchParams.get('q');
    if (!q?.trim()) return NextResponse.json([]);

    const res = await fetch(
        `https://api.rawg.io/api/games?search=${encodeURIComponent(q)}&key=${process.env.RAWG_API_KEY}&page_size=5`,
        { cache: 'no-store' }
    );
    if (!res.ok) return NextResponse.json([]);

    const data = (await res.json()) as RAWGSearchResponse;
    const results: RAWGSearchResult[] = data.results.map((r) => ({
        id: r.id,
        name: r.name,
        year: r.released?.slice(0, 4) ?? null,
        cover: r.background_image ?? null,
        genres: r.genres?.map((g) => g.name) ?? [],
    }));

    return NextResponse.json(results);
};
