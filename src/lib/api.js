import TCGdex, { Query } from '@tcgdex/sdk';

const tcgdex = new TCGdex('en');

/**
 * Fetch cards from TCGDex API (no caching - pure API call)
 * This is used by both client and server
 */
export async function searchCardsFromAPI(query = '', page = 1, pageSize = 20, filters = {}) {
    try {
        console.log(`[TCGDex] Searching: "${query}" Page: ${page} Filters:`, filters);

        const q = Query.create();

        // 1. Text Search (Name)
        if (query) {
            q.contains('name', query);
        }

        // 2. Filters
        if (filters.types) {
            q.contains('types', filters.types);
        }

        if (filters.rarity) {
            q.contains('rarity', filters.rarity);
        }

        if (filters.setName) {
            q.contains('set.name', filters.setName);
        }

        // 3. Sorting
        if (filters.orderBy) {
            switch (filters.orderBy) {
                case 'name': q.sort('name', 'ASC'); break;
                case '-name': q.sort('name', 'DESC'); break;
                case 'number': q.sort('localId', 'ASC'); break;
                case 'set.releaseDate': q.sort('releaseDate', 'DESC'); break;
                case '-set.releaseDate': q.sort('releaseDate', 'ASC'); break;
                default: break;
            }
        }

        // 4. Pagination & Image Buffer
        const fetchLimit = pageSize * 2;
        q.paginate(page, fetchLimit);

        // Fetch List
        const listResults = await tcgdex.card.list(q);

        if (!listResults || listResults.length === 0) {
            return { data: [], page, pageSize, count: 0, totalCount: 0, hasMore: false };
        }

        // Filter out cards without images
        const resumesWithImages = listResults.filter(resume => resume.image);
        const targetResumes = resumesWithImages.slice(0, pageSize);

        // Parallel fetch of full details
        const detailsPromises = targetResumes.map(async (resume) => {
            try {
                if (typeof resume.getCard === 'function') {
                    return await resume.getCard();
                } else {
                    return await tcgdex.card.get(resume.id);
                }
            } catch (e) {
                console.warn(`[TCGDex] Details failed for ${resume.id}`, e);
                return null;
            }
        });

        const fullCards = (await Promise.all(detailsPromises)).filter(c => c !== null);

        // Normalize
        const normalizedData = fullCards.map(card => {
            const smallImg = card.image ? `${card.image}/low.webp` : null;
            const largeImg = card.image ? `${card.image}/high.webp` : null;

            return {
                id: card.id,
                name: card.name,
                images: {
                    small: smallImg,
                    large: largeImg
                },
                set: {
                    name: card.set?.name || 'Unknown'
                },
                number: card.localId,
                rarity: card.rarity || 'Unknown'
            };
        });

        return {
            data: normalizedData,
            page: page,
            pageSize: pageSize,
            count: normalizedData.length,
            totalCount: 1000,
            hasMore: listResults.length >= fetchLimit
        };

    } catch (error) {
        console.error("[TCGDex] Error:", error);
        return { data: [], error: error.message };
    }
}

/**
 * Client-side function that calls the cached API route
 */
export async function searchCards(query = '', page = 1, pageSize = 20, filters = {}) {
    // On client side, use our cached API endpoint
    if (typeof window !== 'undefined') {
        try {
            const params = new URLSearchParams({
                q: query,
                page: page.toString(),
                pageSize: pageSize.toString()
            });

            // Add filters if they exist
            if (filters.types) params.set('types', filters.types);
            if (filters.rarity) params.set('rarity', filters.rarity);
            if (filters.setName) params.set('setName', filters.setName);
            if (filters.orderBy) params.set('orderBy', filters.orderBy);

            const response = await fetch(`/api/cards/search?${params.toString()}`);
            if (!response.ok) throw new Error('API request failed');
            return await response.json();
        } catch (error) {
            console.error("[Search] API route failed:", error);
            // Fallback to direct SDK call
            return searchCardsFromAPI(query, page, pageSize, filters);
        }
    }

    // On server side, call directly (no caching here - caching is in the API route)
    return searchCardsFromAPI(query, page, pageSize, filters);
}

export async function getCardPrice(cardId) {
    return null;
}
