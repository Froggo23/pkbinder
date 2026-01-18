import TCGdex, { Query } from '@tcgdex/sdk';

const tcgdex = new TCGdex('en');

export async function searchCards(query = '', page = 1, pageSize = 20, filters = {}) {
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
        // Fetch more cards than required to ensure we can filter out those without images
        const fetchLimit = pageSize * 2;
        q.paginate(page, fetchLimit);

        // Fetch List
        const listResults = await tcgdex.card.list(q);

        if (!listResults || listResults.length === 0) {
            return { data: [], page, pageSize, count: 0, totalCount: 0, hasMore: false };
        }

        // Filter out cards without images from the resume items
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

export async function getCardPrice(cardId) {
    return null;
}
