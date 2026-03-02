/**
 * Logic ported from pokemon-cards-css/src/lib/components/CardProxy.svelte
 * Maps card data to specific rarity classes and image assets (foils/masks).
 */

const CDN_URL = "https://poke-holo.simey.me"; // Using the live demo CDN for now, or we can serve local assets if we downloaded foils

// We might want to host the foils ourselves later, but for now let's use the CDN for the specific foil images 
// as downloading all of them might be too much (they are dynamic assets, not in the repo's public folder easily?)
// Looking at the repo, foils seems to be hosted externally or in a 'foils' directory I didn't see?
// Wait, the repo `public/img` had some textures, but specific pokemon foils might be external.
// `CardProxy.svelte` uses `import.meta.env.VITE_CDN` which defaults to https://poke-holo.simey.me/
// Let's stick to that for the specific foil masks to avoid missing assets.

export function getCardEffects(card) {
    if (!card) return {};

    let { id, name, number, set, types, subtypes, supertype, rarity } = card;

    // Normalization
    rarity = (rarity || "").toLowerCase();
    supertype = (supertype || "").toLowerCase();
    number = (number || "").toString().toLowerCase();
    set = (set || "").toString().toLowerCase();

    // Ensure arrays are strings
    if (Array.isArray(types)) types = types.join(" ").toLowerCase();
    if (Array.isArray(subtypes)) subtypes = subtypes.join(" ").toLowerCase();
    else subtypes = (subtypes || "").toLowerCase();

    const isReverse = false; // We can add logic for this later if data supports it
    const isShiny = number.startsWith("sv");
    const isGallery = !!number.match(/^[tg]g/i);
    const isPromo = set === "swshp";

    // Logic from CardProxy.svelte

    if (isGallery) {
        if (rarity.startsWith("trainer gallery")) {
            rarity = rarity.replace(/trainer gallery\s*/, "");
        }
    }

    // Foil/Mask Logic
    const getFoilMask = (type = "masks") => {
        let etch = "holo";
        let style = "reverse";
        let ext = "webp"; // or jpg/png depending on source

        // This part constructs the URL for the specific foil mask.
        // Since we don't have the full foil database locally, we might need to rely on generic effects 
        // OR try to map to the CDN if it follows a predictable pattern.
        // The CDN url pattern is: `${ server }/foils/${ fSet }/${ type }/upscaled/${ fNumber }_foil_${ etch }_${ style }_2x.${ ext }`

        // HOWEVER, for this task, the user wants the *effects*. 
        // Many effects rely on generic textures (grain, glitter, cosmos) which we HAVE copied to public/img.
        // The specific "foil" and "mask" images are for the cutout of the pokemon art.
        // If we don't have those, the effect will cover the WHOLE card (or a generic mask?)
        // Let's try to return the generic style classes first.

        return ""; // For now return empty, meaning no specific mask (full generic effect)
    }

    // We mainly need the correct 'data-rarity', 'data-supertype', etc attributes for the CSS to trigger.

    // Refined Rarity Logic
    if (isShiny) {
        if (rarity === "rare shiny v" || (rarity === "rare holo v" && number.startsWith("sv"))) {
            rarity = "rare shiny v";
        }
        if (rarity === "rare shiny vmax" || (rarity === "rare holo vmax" && number.startsWith("sv"))) {
            rarity = "rare shiny vmax";
        }
    }

    return {
        attrs: {
            "data-rarity": rarity,
            "data-supertype": supertype,
            "data-subtypes": subtypes,
            "data-set": set,
            "data-number": number,
            "data-trainer-gallery": isGallery
        },
        // We can extend this to return specific foil URLs if we find a compatible source
        foil: "",
        mask: ""
    };
}
