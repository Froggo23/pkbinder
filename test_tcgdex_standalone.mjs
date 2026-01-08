import TCGdex, { Query } from '@tcgdex/sdk';

const tcgdex = new TCGdex('en');

async function run() {
    console.log("--- Testing TCGDex SDK ---");

    try {
        const q = Query.create();
        q.contains('name', 'Pikachu');
        q.paginate(1, 1);

        const cards = await tcgdex.card.list(q);
        console.log("Found:", cards.length);
        if (cards.length > 0) {
            const c = cards[0];
            console.log("Sample Card:", c);
            console.log("Image URL:", c.image);
        }

        console.log("\n--- Testing 'Fire' Type Filter ---");
        const q2 = Query.create();
        q2.contains('types', 'Fire');
        q2.paginate(1, 1);
        const fires = await tcgdex.card.list(q2);
        console.log("Found Fire:", fires.length);
        if (fires.length > 0) console.log("First Fire:", fires[0].name);

    } catch (e) {
        console.error("Error:", e);
    }
}

run();
