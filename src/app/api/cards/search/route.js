// Server-side API route with Redis caching
import { searchCardsFromAPI } from '@/lib/api';
import { getOrFetch } from '@/lib/redis';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page')) || 1;
    const pageSize = parseInt(searchParams.get('pageSize')) || 20;

    const filters = {
        types: searchParams.get('types') || undefined,
        rarity: searchParams.get('rarity') || undefined,
        setName: searchParams.get('setName') || undefined,
        orderBy: searchParams.get('orderBy') || undefined
    };

    // Clean up undefined values
    Object.keys(filters).forEach(key => {
        if (filters[key] === undefined) delete filters[key];
    });

    // Create cache key
    const cacheKey = `tcg:${query}:${page}:${pageSize}:${JSON.stringify(filters)}`;

    try {
        const results = await getOrFetch(cacheKey, async () => {
            return await searchCardsFromAPI(query, page, pageSize, filters);
        }, 3600); // 1 hour TTL

        return NextResponse.json(results);
    } catch (error) {
        console.error('[API] Search error:', error);
        return NextResponse.json({ error: error.message, data: [] }, { status: 500 });
    }
}
