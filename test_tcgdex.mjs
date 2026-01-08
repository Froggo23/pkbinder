
const { searchCards } = require('./pkbinder/src/lib/api.js');

// Mock TCGDex import because we are running in a separate script context 
// and the main file uses ESM imports which might fail in pure node without .mjs
// Actually, let's just make this file a module.

async function test() {
    console.log("Testing TCGDex...");
    // 1. Basic Search
    const res = await searchCards('Pikachu', 1, 5);
    console.log("Result Count:", res.count);
    if (res.data.length > 0) {
        console.log("First Card:", JSON.stringify(res.data[0], null, 2));
    } else {
        console.log("No data found for Pikachu");
    }

    // 2. Filter Search
    console.log("\nTesting Filter: Fire...");
    const resFilter = await searchCards('', 1, 5, { types: 'Fire' });
    console.log("Fire Cards:", resFilter.count);
    if (resFilter.data.length > 0) {
        console.log("First Fire Card:", resFilter.data[0].name, resFilter.data[0].images.small);
    }
}

// We can't run this directly if api.js uses ES6 imports/exports and environment is not set up.
// Better to create a standalone script that imports TCGDex directly, mirroring api.js logic.
