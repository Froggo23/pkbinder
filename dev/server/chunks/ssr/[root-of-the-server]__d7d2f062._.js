module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/lib/api.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCardPrice",
    ()=>getCardPrice,
    "searchCards",
    ()=>searchCards
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tcgdex$2f$sdk$2f$dist$2f$tcgdex$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tcgdex/sdk/dist/tcgdex.mjs [app-ssr] (ecmascript)");
;
const tcgdex = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tcgdex$2f$sdk$2f$dist$2f$tcgdex$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]('en');
async function searchCards(query = '', page = 1, pageSize = 20, filters = {}) {
    try {
        console.log(`[TCGDex] Searching: "${query}" Page: ${page} Filters:`, filters);
        const q = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tcgdex$2f$sdk$2f$dist$2f$tcgdex$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Query"].create();
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
            switch(filters.orderBy){
                case 'name':
                    q.sort('name', 'ASC');
                    break;
                case '-name':
                    q.sort('name', 'DESC');
                    break;
                case 'number':
                    q.sort('localId', 'ASC');
                    break;
                case 'set.releaseDate':
                    q.sort('releaseDate', 'DESC');
                    break;
                case '-set.releaseDate':
                    q.sort('releaseDate', 'ASC');
                    break;
                default:
                    break;
            }
        }
        // 4. Pagination & Image Buffer
        // Fetch more cards than required to ensure we can filter out those without images
        const fetchLimit = pageSize * 2;
        q.paginate(page, fetchLimit);
        // Fetch List
        const listResults = await tcgdex.card.list(q);
        if (!listResults || listResults.length === 0) {
            return {
                data: [],
                page,
                pageSize,
                count: 0,
                totalCount: 0,
                hasMore: false
            };
        }
        // Filter out cards without images from the resume items
        const resumesWithImages = listResults.filter((resume)=>resume.image);
        const targetResumes = resumesWithImages.slice(0, pageSize);
        // Parallel fetch of full details
        const detailsPromises = targetResumes.map(async (resume)=>{
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
        const fullCards = (await Promise.all(detailsPromises)).filter((c)=>c !== null);
        // Normalize
        const normalizedData = fullCards.map((card)=>{
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
        return {
            data: [],
            error: error.message
        };
    }
}
async function getCardPrice(cardId) {
    return null;
}
}),
"[project]/src/app/test/page.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TestPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.js [app-ssr] (ecmascript)");
'use client';
;
;
;
function TestPage() {
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Inputs
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('Pikachu');
    const [setNameInput, setSetNameInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [pageSize, setPageSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(10);
    const handleFetch = async ()=>{
        setLoading(true);
        setError(null);
        setData(null);
        try {
            console.log('Test Page: Starting fetch...');
            // Construct a query string for the API utility
            // If we want to support sets, we might need to update api.js or just pass a raw query if it supported it.
            // For now, let's assume api.js takes a "name" query. 
            // If we want to filter by set, we need to handle that.
            // Let's combine them into a single string for our 'query' arg if api.js supports simple string concat or update api.js.
            // Currently api.js does: `name:"*${query}*"` which forces name search.
            // We should pass a special object or raw string.
            // actually, let's pass the raw parts and let api.js handle it or bypass the name enforcement.
            // HACK: For this test, I will pass a string that I expect api.js to handle, 
            // but api.js wraps it in name:"...".
            // I will update api.js to handle structured filters in the next step.
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["searchCards"])(name, 1, pageSize, {
                setName: setNameInput
            });
            console.log('Test Page: Fetch result:', res);
            if (res.error) throw new Error(res.error);
            setData(res);
        } catch (err) {
            console.error('Test Page: Fetch error:', err);
            setError(err.message);
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-8 bg-zinc-950 text-white min-h-screen font-mono",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-2xl font-bold mb-6",
                children: "API Test Console (v2)"
            }, void 0, false, {
                fileName: "[project]/src/app/test/page.js",
                lineNumber: 51,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 border border-zinc-800 rounded-lg bg-zinc-900/50",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-xs text-zinc-400 mb-1",
                                children: "Card Name"
                            }, void 0, false, {
                                fileName: "[project]/src/app/test/page.js",
                                lineNumber: 55,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: name,
                                onChange: (e)=>setName(e.target.value),
                                className: "w-full bg-black border border-zinc-700 rounded px-2 py-1 text-sm"
                            }, void 0, false, {
                                fileName: "[project]/src/app/test/page.js",
                                lineNumber: 56,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/test/page.js",
                        lineNumber: 54,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-xs text-zinc-400 mb-1",
                                children: "Set Name (Optional)"
                            }, void 0, false, {
                                fileName: "[project]/src/app/test/page.js",
                                lineNumber: 63,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: setNameInput,
                                onChange: (e)=>setSetNameInput(e.target.value),
                                placeholder: "e.g. Base, Evolving Skies",
                                className: "w-full bg-black border border-zinc-700 rounded px-2 py-1 text-sm"
                            }, void 0, false, {
                                fileName: "[project]/src/app/test/page.js",
                                lineNumber: 64,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/test/page.js",
                        lineNumber: 62,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-xs text-zinc-400 mb-1",
                                children: "Page Size"
                            }, void 0, false, {
                                fileName: "[project]/src/app/test/page.js",
                                lineNumber: 72,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "number",
                                value: pageSize,
                                onChange: (e)=>setPageSize(Number(e.target.value)),
                                className: "w-full bg-black border border-zinc-700 rounded px-2 py-1 text-sm"
                            }, void 0, false, {
                                fileName: "[project]/src/app/test/page.js",
                                lineNumber: 73,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/test/page.js",
                        lineNumber: 71,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/test/page.js",
                lineNumber: 53,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: handleFetch,
                    disabled: loading,
                    className: "px-6 py-2 bg-indigo-600 rounded hover:bg-indigo-500 disabled:opacity-50 font-semibold",
                    children: loading ? 'Fetching...' : 'Run Search'
                }, void 0, false, {
                    fileName: "[project]/src/app/test/page.js",
                    lineNumber: 83,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/test/page.js",
                lineNumber: 82,
                columnNumber: 13
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 bg-red-900/50 border border-red-700 rounded mb-4 text-red-200",
                children: [
                    "Error: ",
                    error
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/test/page.js",
                lineNumber: 93,
                columnNumber: 17
            }, this),
            data && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-4 text-sm text-zinc-400 border-b border-zinc-800 pb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Count: ",
                                    data.count
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/test/page.js",
                                lineNumber: 101,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Total: ",
                                    data.totalCount
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/test/page.js",
                                lineNumber: 102,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Page: ",
                                    data.page
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/test/page.js",
                                lineNumber: 103,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/test/page.js",
                        lineNumber: 100,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 md:grid-cols-4 gap-4",
                        children: data.data?.map((card)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-3 border border-zinc-800 rounded bg-zinc-900 flex flex-col gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "aspect-[2.5/3.5] bg-black rounded overflow-hidden relative",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: card.images.small,
                                            className: "w-full h-full object-contain"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/test/page.js",
                                            lineNumber: 110,
                                            columnNumber: 37
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/test/page.js",
                                        lineNumber: 109,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-bold text-sm truncate",
                                                title: card.name,
                                                children: card.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/test/page.js",
                                                lineNumber: 113,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-zinc-500",
                                                children: card.set.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/test/page.js",
                                                lineNumber: 114,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] text-zinc-600 font-mono",
                                                children: card.id
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/test/page.js",
                                                lineNumber: 115,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/test/page.js",
                                        lineNumber: 112,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, card.id, true, {
                                fileName: "[project]/src/app/test/page.js",
                                lineNumber: 108,
                                columnNumber: 29
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/test/page.js",
                        lineNumber: 106,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                        className: "mt-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                className: "cursor-pointer text-zinc-500 hover:text-white",
                                children: "Raw Response JSON"
                            }, void 0, false, {
                                fileName: "[project]/src/app/test/page.js",
                                lineNumber: 122,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                className: "mt-2 p-4 bg-black rounded overflow-auto text-xs text-green-400 max-h-96",
                                children: JSON.stringify(data, null, 2)
                            }, void 0, false, {
                                fileName: "[project]/src/app/test/page.js",
                                lineNumber: 123,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/test/page.js",
                        lineNumber: 121,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/test/page.js",
                lineNumber: 99,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/test/page.js",
        lineNumber: 50,
        columnNumber: 9
    }, this);
}
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else //TURBOPACK unreachable
            ;
        } else //TURBOPACK unreachable
        ;
    }
} //# sourceMappingURL=module.compiled.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}),
"[project]/node_modules/@dzeio/object-util/dist/ObjectUtil.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cloneObject",
    ()=>cloneObject,
    "default",
    ()=>ObjectUtil_default,
    "isObject",
    ()=>isObject,
    "mustBeObject",
    ()=>mustBeObject,
    "objectClean",
    ()=>objectClean,
    "objectClone",
    ()=>objectClone,
    "objectEqual",
    ()=>objectEqual,
    "objectFilter",
    ()=>objectFilter,
    "objectFind",
    ()=>objectFind,
    "objectGet",
    ()=>objectGet,
    "objectKeys",
    ()=>objectKeys,
    "objectLoop",
    ()=>objectLoop,
    "objectMap",
    ()=>objectMap,
    "objectOmit",
    ()=>objectOmit,
    "objectPick",
    ()=>objectPick,
    "objectRemap",
    ()=>objectRemap,
    "objectSet",
    ()=>objectSet,
    "objectSize",
    ()=>objectSize,
    "objectSort",
    ()=>objectSort,
    "objectToArray",
    ()=>objectToArray,
    "objectValues",
    ()=>objectValues
]);
// src/ObjectUtil.ts
function objectMap(obj, fn) {
    mustBeObject(obj);
    const list = [];
    objectLoop(obj, (item, key, index)=>{
        list.push(fn(item, key, index));
    });
    return list;
}
function objectRemap(obj, fn, options) {
    mustBeObject(obj);
    const clone = {};
    objectLoop(obj, (item, oldKey, index)=>{
        const { key, value } = fn(item, oldKey, index);
        if ((options == null ? void 0 : options.strict) && key in clone) {
            throw new Error("objectRemap strict mode active, you can't remap the same key twice");
        }
        clone[key] = value;
    });
    return clone;
}
function objectLoop(obj, fn) {
    mustBeObject(obj);
    const keys = objectKeys(obj);
    for(let index = 0; index < keys.length; index++){
        const key = keys[index];
        const stop = fn(obj[key], key, index);
        if (stop === false) {
            return false;
        }
    }
    return true;
}
function objectValues(obj) {
    mustBeObject(obj);
    return Object.values(obj);
}
function objectToArray(obj) {
    mustBeObject(obj);
    return objectValues(obj);
}
function objectKeys(obj) {
    mustBeObject(obj);
    if (Array.isArray(obj)) {
        return Array.from(obj.keys());
    }
    return Object.keys(obj);
}
function objectSize(obj) {
    return objectKeys(obj).length;
}
function objectSort(obj, fn) {
    mustBeObject(obj);
    const ordered = {};
    let sortedKeys = [];
    if (Array.isArray(fn)) {
        sortedKeys = fn.concat(objectKeys(obj).filter((key)=>!fn.includes(key)));
    } else {
        sortedKeys = objectKeys(obj).sort(fn);
    }
    for (const key of sortedKeys){
        ordered[key] = obj[key];
    }
    return ordered;
}
function cloneObject(obj) {
    return objectClone(obj);
}
function objectClone(obj, options) {
    mustBeObject(obj);
    if (Array.isArray(obj)) {
        const arr = [];
        for (const item of obj){
            arr.push(isObject(item) ? objectClone(item) : item);
        }
        return arr;
    }
    const clone = {};
    objectLoop(obj, (value, key)=>{
        if (typeof value === "object" && value != null && (typeof (options == null ? void 0 : options.deep) === "undefined" || options.deep) && !(value instanceof Date)) {
            clone[key] = objectClone(value);
            return;
        }
        if (value instanceof Date) {
            clone[key] = new Date(value.getTime());
            return;
        }
        clone[key] = value;
    });
    return clone;
}
function objectSet(obj, path, value) {
    mustBeObject(obj);
    let pointer = obj;
    for(let index = 0; index < path.length; index++){
        const key = path[index];
        const nextIndex = index + 1;
        if (!Object.prototype.hasOwnProperty.call(pointer, key) && nextIndex < path.length) {
            const key1 = path[nextIndex];
            if (typeof key1 === "number") {
                pointer[key] = [];
            } else {
                pointer[key] = {};
            }
        }
        if (nextIndex === path.length) {
            pointer[key] = value;
            if (value === void 0) {
                delete pointer[key];
            }
            break;
        }
        pointer = pointer[key];
    }
}
function objectEqual(first, second) {
    mustBeObject(first);
    mustBeObject(second);
    if (objectSize(first) !== objectSize(second)) {
        return false;
    }
    const res = objectLoop(first, (item, key)=>{
        if (!(key in second) && key in first) {
            return false;
        }
        const item2 = second[key];
        if (item === null && item2 === null) {
            return true;
        }
        if (typeof item === "object" && typeof item2 === "object") {
            return objectEqual(item, item2);
        }
        return item === item2;
    });
    return res;
}
function objectClean(obj, options) {
    mustBeObject(obj);
    objectLoop(obj, (item, key)=>{
        if ((typeof (options == null ? void 0 : options.cleanUndefined) === "undefined" || options.cleanUndefined) && item === void 0) {
            delete obj[key];
        } else if ((options == null ? void 0 : options.cleanFalsy) && !obj[key]) {
            delete obj[key];
        } else if ((options == null ? void 0 : options.cleanNull) && item === null) {
            delete obj[key];
        }
        if ((typeof (options == null ? void 0 : options.deep) === "undefined" || options.deep) && isObject(item)) {
            objectClean(item, options);
        }
    });
}
function objectOmit(obj, ...keys) {
    const cloned = objectClone(obj, {
        deep: false
    });
    for (const key of keys){
        if (key in cloned) {
            delete cloned[key];
        }
    }
    return cloned;
}
function objectFind(obj, fn) {
    mustBeObject(obj);
    let res = void 0;
    objectLoop(obj, (value, key, index)=>{
        const tmp = fn(value, key, index);
        if (tmp) {
            res = {
                key,
                value,
                index
            };
        }
        return !tmp;
    });
    return res;
}
function objectGet(obj, path) {
    if (!path || path === "" || Array.isArray(path) && path.length === 0) {
        return obj;
    }
    mustBeObject(obj);
    if (typeof path === "string") {
        path = path.split(".").map((it)=>/^\d+$/g.test(it) ? Number.parseInt(it) : it);
    }
    let pointer = obj;
    for(let index = 0; index < path.length; index++){
        const key = path[index];
        const nextIndex = index + 1;
        if (typeof key === "undefined" || !Object.prototype.hasOwnProperty.call(pointer, key) && nextIndex < path.length) {
            return void 0;
        }
        if (nextIndex === path.length) {
            return pointer[key];
        }
        pointer = pointer[key];
    }
    throw new Error(`it should never get there ! (${JSON.stringify(obj)}, ${path}, ${JSON.stringify(pointer)})`);
}
function objectPick(obj, ...keys) {
    mustBeObject(obj);
    return objectFilter(obj, (_, k)=>keys.includes(k));
}
function objectFilter(obj, fn) {
    mustBeObject(obj);
    const clone = {};
    objectLoop(obj, (v, k, idx)=>{
        const res = fn(v, k, idx);
        if (res) {
            clone[k] = v;
        }
    });
    return clone;
}
function isObject(item) {
    return typeof item === "object" && item !== null;
}
function mustBeObject(item) {
    if (!isObject(item)) {
        throw new Error("Input is not an object!");
    }
    return true;
}
var ObjectUtil_default = {
    objectClean,
    objectClone,
    objectEqual,
    objectFilter,
    objectFind,
    objectGet,
    objectKeys,
    objectLoop,
    objectMap,
    objectOmit,
    objectPick,
    objectRemap,
    objectSet,
    objectSize,
    objectSort,
    // helpers
    isObject,
    mustBeObject,
    // deprecated
    objectToArray,
    cloneObject
};
;
}),
"[project]/node_modules/@cachex/core/dist/index.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AsyncCacheAbsract",
    ()=>AsyncCacheAsbract,
    "CacheAsbract",
    ()=>CacheAsbract
]);
// src/CacheAbstract.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dzeio$2f$object$2d$util$2f$dist$2f$ObjectUtil$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@dzeio/object-util/dist/ObjectUtil.mjs [app-ssr] (ecmascript)");
;
var CacheAsbract = class {
    getMultiple(keys, defaultValues) {
        const res = {};
        for(let idx = 0; idx < keys.length; idx++){
            const key = keys[idx];
            const value = this.get(key, defaultValues == null ? void 0 : defaultValues[idx]);
            if (typeof value === "undefined") {
                continue;
            }
            res[key] = value;
        }
        return res;
    }
    setMultiple(values, ttl) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dzeio$2f$object$2d$util$2f$dist$2f$ObjectUtil$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["objectLoop"])(values, (v, k)=>{
            this.set(k, v, ttl);
        });
        return true;
    }
    deleteMultiple(keys) {
        for (const key of keys){
            this.delete(key);
        }
        return true;
    }
};
;
var AsyncCacheAsbract = class {
    async getMultiple(keys, defaultValues) {
        const res = {};
        for(let idx = 0; idx < keys.length; idx++){
            const key = keys[idx];
            const value = await this.get(key, defaultValues == null ? void 0 : defaultValues[idx]);
            if (typeof value === "undefined") {
                continue;
            }
            res[key] = value;
        }
        return res;
    }
    async setMultiple(values, ttl) {
        await Promise.all((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dzeio$2f$object$2d$util$2f$dist$2f$ObjectUtil$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["objectMap"])(values, (v, k)=>{
            return this.set(k, v, ttl);
        }));
        return true;
    }
    async deleteMultiple(keys) {
        for await (const key of keys){
            await this.delete(key);
        }
        return true;
    }
};
;
 /*!
 * Library based on the awesome PHP Psr 16 SimpleCache
 *
 * CacheX is a simple, easy to use and meant to be replaceable Cache library for most usage
 */ }),
"[project]/node_modules/@cachex/memory/dist/index.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MemoryCache
]);
// src/index.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$cachex$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@cachex/core/dist/index.mjs [app-ssr] (ecmascript)");
;
var MemoryCache = class extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$cachex$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CacheAsbract"] {
    constructor(){
        super(...arguments);
        this.cache = /* @__PURE__ */ new Map();
    }
    get(key, defaultValue) {
        const item = this.cache.get(key);
        if (typeof item === "undefined") {
            return defaultValue != null ? defaultValue : void 0;
        }
        if (item.expire && item.expire < /* @__PURE__ */ new Date().getTime()) {
            this.delete(key);
            return defaultValue != null ? defaultValue : void 0;
        }
        return item.data;
    }
    set(key, value, ttl) {
        let expire;
        if (ttl) {
            expire = /* @__PURE__ */ new Date().getTime() + ttl * 1e3;
        }
        this.cache.set(key, {
            data: value,
            expire
        });
        return true;
    }
    delete(key) {
        this.cache.delete(key);
        return true;
    }
    clear() {
        this.cache.clear();
        return true;
    }
    has(key) {
        return this.cache.has(key);
    }
};
;
}),
"[project]/node_modules/@cachex/web-storage/dist/index.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BrowserStorageCache
]);
// src/index.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$cachex$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@cachex/core/dist/index.mjs [app-ssr] (ecmascript)");
;
var BrowserStorageCache = class extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$cachex$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CacheAsbract"] {
    constructor(prefix, session = false){
        super();
        this.prefix = prefix;
        try {
            window;
        } catch  {
            throw new Error('The current context is not in a browser or the variable "window" is not available.');
        }
        if (session) {
            this.storage = window.sessionStorage;
        } else {
            this.storage = window.localStorage;
        }
        if (!this.storage) {
            throw new Error("window.localStorage or window.sessionStorage are unavailable.");
        }
    }
    get(key, defaultValue) {
        const raw = this.storage.getItem(this.getFinalKey(key));
        if (!raw) {
            return defaultValue != null ? defaultValue : void 0;
        }
        const item = JSON.parse(raw);
        if (item.expire && item.expire < /* @__PURE__ */ new Date().getTime()) {
            this.delete(key);
            return defaultValue != null ? defaultValue : void 0;
        }
        return item.data;
    }
    set(key, value, ttl) {
        let expire = void 0;
        if (ttl) {
            expire = /* @__PURE__ */ new Date().getTime() + ttl * 1e3;
        }
        const data = {
            data: value,
            expire
        };
        this.storage.setItem(this.getFinalKey(key), JSON.stringify(data));
        return true;
    }
    delete(key) {
        this.storage.removeItem(this.getFinalKey(key));
        return true;
    }
    clear() {
        const keys = this.keys();
        return this.deleteMultiple(keys);
    }
    has(key) {
        return !!this.storage.getItem(this.getFinalKey(key));
    }
    /**
  * get the list of keys that are in the context of this cache component
  */ keys() {
        const list = [];
        for(let idx = 0; idx < this.storage.length; idx++){
            const key = this.storage.key(idx);
            if (typeof key !== "string" || this.prefix && !(key == null ? void 0 : key.startsWith(`@${this.prefix}/`))) {
                continue;
            }
            list.push(key);
        }
        return list;
    }
    /**
  * retrieve the prefixed key from the original
  * @param key the original key without prefix
  * @returns the new key with the prefix if set
  */ getFinalKey(key) {
        if (!this.prefix) {
            return key;
        }
        return `@${this.prefix}/${key}`;
    }
};
;
}),
"[project]/node_modules/@tcgdex/sdk/dist/tcgdex.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CardModel",
    ()=>Card,
    "CardResumeModel",
    ()=>CardResume,
    "Endpoint",
    ()=>Endpoint,
    "Model",
    ()=>Model,
    "Query",
    ()=>Query,
    "SerieModel",
    ()=>Serie,
    "SerieResumeModel",
    ()=>SerieResume,
    "SetModel",
    ()=>Set,
    "SetResumeModel",
    ()=>SetResume,
    "SimpleEndpoint",
    ()=>SimpleEndpoint,
    "default",
    ()=>TCGdex
]);
// src/tcgdex.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$cachex$2f$memory$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@cachex/memory/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$cachex$2f$web$2d$storage$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@cachex/web-storage/dist/index.mjs [app-ssr] (ecmascript)");
// src/models/Model.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dzeio$2f$object$2d$util$2f$dist$2f$ObjectUtil$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@dzeio/object-util/dist/ObjectUtil.mjs [app-ssr] (ecmascript)");
;
;
// src/Query.ts
var Query = class _Query {
    constructor(){
        this.params = [];
        this.not = {
            equal: (key, value)=>{
                this.params.push({
                    key,
                    value: `neq:${value}`
                });
                return this;
            },
            contains: (key, value)=>{
                this.params.push({
                    key,
                    value: `not:${value}`
                });
                return this;
            },
            includes: (key, value)=>this.not.contains(key, value),
            like: (key, value)=>this.not.contains(key, value),
            isNull: (key)=>{
                this.params.push({
                    key,
                    value: "notnull:"
                });
                return this;
            }
        };
    }
    static create() {
        return new _Query();
    }
    includes(key, value) {
        return this.contains(key, value);
    }
    like(key, value) {
        return this.contains(key, value);
    }
    contains(key, value) {
        this.params.push({
            key,
            value
        });
        return this;
    }
    equal(key, value) {
        this.params.push({
            key,
            value: `eq:${value}`
        });
        return this;
    }
    sort(key, order) {
        this.params.push({
            key: "sort:field",
            value: key
        });
        this.params.push({
            key: "sort:order",
            value: order
        });
        return this;
    }
    greaterOrEqualThan(key, value) {
        this.params.push({
            key,
            value: `gte:${value}`
        });
        return this;
    }
    lesserOrEqualThan(key, value) {
        this.params.push({
            key,
            value: `lte:${value}`
        });
        return this;
    }
    greaterThan(key, value) {
        this.params.push({
            key,
            value: `gt:${value}`
        });
        return this;
    }
    lesserThan(key, value) {
        this.params.push({
            key,
            value: `lt:${value}`
        });
        return this;
    }
    isNull(key) {
        this.params.push({
            key,
            value: "null:"
        });
        return this;
    }
    paginate(page, itemsPerPage) {
        this.params.push({
            key: "pagination:page",
            value: page
        });
        this.params.push({
            key: "pagination:itemsPerPage",
            value: itemsPerPage
        });
        return this;
    }
};
;
var Model = class {
    constructor(sdk){
        this.sdk = sdk;
    }
    /**
   * build a model depending on the data given
   * @param model the model to build
   * @param data the data to fill it with
   */ static build(model, data) {
        if (!data) {
            throw new Error("data is necessary.");
        }
        model.fill(data);
        return model;
    }
    fill(obj) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dzeio$2f$object$2d$util$2f$dist$2f$ObjectUtil$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["objectLoop"])(obj, (value, key)=>{
            this[key] = value;
        });
    }
};
// src/endpoints/Endpoint.ts
var Endpoint = class {
    constructor(tcgdex, itemModel, listModel, endpoint){
        this.tcgdex = tcgdex;
        this.itemModel = itemModel;
        this.listModel = listModel;
        this.endpoint = endpoint;
    }
    async get(id) {
        const res = await this.tcgdex.fetch(this.endpoint, id);
        if (!res) {
            return null;
        }
        return Model.build(new this.itemModel(this.tcgdex), res);
    }
    async list(query) {
        const res = await this.tcgdex.fetchWithQuery([
            this.endpoint
        ], query == null ? void 0 : query.params);
        return (res != null ? res : []).map((it)=>Model.build(new this.listModel(this.tcgdex), it));
    }
};
// src/endpoints/SimpleEndpoint.ts
var SimpleEndpoint = class {
    constructor(tcgdex, itemModel, endpoint){
        this.tcgdex = tcgdex;
        this.itemModel = itemModel;
        this.endpoint = endpoint;
    }
    async get(id) {
        const res = await this.tcgdex.fetch(this.endpoint, id);
        if (!res) {
            return null;
        }
        return Model.build(new this.itemModel(this.tcgdex), res);
    }
    async list(query) {
        var _a;
        return (_a = await this.tcgdex.fetchWithQuery([
            this.endpoint
        ], query == null ? void 0 : query.params)) != null ? _a : [];
    }
};
// src/models/CardResume.ts
var CardResume = class extends Model {
    /**
   * the the Card Image full URL
   *
   * @param {Quality} quality the quality you want your image to be in
   * @param {Extension} extension extension you want you image to be
   * @return the full card URL
   */ getImageURL(quality = "high", extension = "png") {
        return `${this.image}/${quality}.${extension}`;
    }
    /**
   * Get the full Card
   *
   * @return the full card if available
   */ async getCard() {
        return await this.sdk.card.get(this.id);
    }
};
// src/models/Card.ts
var Card = class extends CardResume {
    async getCard() {
        return this;
    }
    async getSet() {
        return await this.sdk.set.get(this.set.id);
    }
};
;
// src/models/SerieResume.ts
var SerieResume = class extends Model {
    /**
   * the the Card Image full URL
   *
   * @param {Quality} quality the quality you want your image to be in
   * @param {Extension} extension extension you want you image to be
   * @return the full card URL
   */ getImageURL(extension = "png") {
        return `${this.logo}.${extension}`;
    }
    async getSerie() {
        return await this.sdk.serie.get(this.id);
    }
};
// src/models/SetResume.ts
var SetResume = class extends Model {
    async getSet() {
        return await this.sdk.set.get(this.id);
    }
};
// src/models/Serie.ts
var Serie = class extends SerieResume {
    fill(obj) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dzeio$2f$object$2d$util$2f$dist$2f$ObjectUtil$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["objectLoop"])(obj, (value, key)=>{
            switch(key){
                case "sets":
                    this.sets = value.map((it)=>Model.build(new SetResume(this.sdk), it));
                    break;
                default:
                    this[key] = value;
                    break;
            }
        });
    }
};
;
var Set = class extends Model {
    async getSerie() {
        return this.sdk.serie.get(this.serie.id);
    }
    fill(obj) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dzeio$2f$object$2d$util$2f$dist$2f$ObjectUtil$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["objectLoop"])(obj, (value, key)=>{
            switch(key){
                case "cards":
                    this.cards = value.map((it)=>Model.build(new CardResume(this.sdk), it));
                    break;
                default:
                    this[key] = value;
                    break;
            }
        });
    }
};
;
var StringEndpoint = class extends Model {
    fill(obj) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dzeio$2f$object$2d$util$2f$dist$2f$ObjectUtil$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["objectLoop"])(obj, (value, key)=>{
            switch(key){
                case "cards":
                    this.cards = value.map((it)=>Model.build(new CardResume(this.sdk), it));
                    break;
                default:
                    this[key] = value;
                    break;
            }
        });
    }
};
// src/utils.ts
function detectContext() {
    try {
        const isBrowser = !!window;
        return isBrowser ? "browser" : "server";
    } catch  {
        return "server";
    }
}
var ENDPOINTS = [
    "cards",
    "categories",
    "dex-ids",
    "energy-types",
    "hp",
    "illustrators",
    "rarities",
    "regulation-marks",
    "retreats",
    "series",
    "sets",
    "stages",
    "suffixes",
    "trainer-types",
    "types",
    "variants",
    "random"
];
// src/version.js
var version = "2.7.1";
// src/tcgdex.ts
var _TCGdex = class _TCGdex {
    constructor(lang = "en"){
        /**
     * the previously hidden caching system used by TCGdex to not kill the API
     */ this.cache = detectContext() === "browser" ? new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$cachex$2f$web$2d$storage$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]("tcgdex-cache") : new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$cachex$2f$memory$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]();
        /**
     * the default cache TTL, only subsequent requests will have their ttl changed
     */ this.cacheTTL = 60 * 60;
        // random card/set/serie endpoints
        this.random = {
            card: async ()=>{
                const res = await this.fetch("random", "card");
                return Model.build(new Card(this), res);
            },
            set: async ()=>{
                const res = await this.fetch("random", "set");
                return Model.build(new Set(this), res);
            },
            serie: async ()=>{
                const res = await this.fetch("random", "serie");
                return Model.build(new Serie(this), res);
            }
        };
        this.card = new Endpoint(this, Card, CardResume, "cards");
        this.set = new Endpoint(this, Set, SetResume, "sets");
        this.serie = new Endpoint(this, Serie, SerieResume, "series");
        this.type = new SimpleEndpoint(this, StringEndpoint, "types");
        this.retreat = new SimpleEndpoint(this, StringEndpoint, "retreats");
        this.rarity = new SimpleEndpoint(this, StringEndpoint, "rarities");
        this.illustrator = new SimpleEndpoint(this, StringEndpoint, "illustrators");
        this.hp = new SimpleEndpoint(this, StringEndpoint, "hp");
        this.categorie = new SimpleEndpoint(this, StringEndpoint, "categories");
        this.dexID = new SimpleEndpoint(this, StringEndpoint, "dex-ids");
        this.energyType = new SimpleEndpoint(this, StringEndpoint, "energy-types");
        this.regulationMark = new SimpleEndpoint(this, StringEndpoint, "regulation-marks");
        this.stage = new SimpleEndpoint(this, StringEndpoint, "stages");
        this.suffixe = new SimpleEndpoint(this, StringEndpoint, "suffixes");
        this.trainerType = new SimpleEndpoint(this, StringEndpoint, "trainer-types");
        this.variant = new SimpleEndpoint(this, StringEndpoint, "variants");
        this.lang = "en";
        this.endpointURL = "https://api.tcgdex.net/v2";
        this.setLang(lang);
    }
    /**
   * @deprecated use the constructor parameter or {@link TCGdex.setLang} when in an instance
   */ static setDefaultLang(lang) {
        _TCGdex.defaultLang = lang;
    }
    /**
   * @deprecated use {@link TCGdex.setLang} when in an instance
   */ static getDefaultLang() {
        return _TCGdex.defaultLang;
    }
    /**
   * the endpoint URL
   * ex: `https://api.tcgdex.net/v2`
   * @param endpoint the url
   */ setEndpoint(endpoint) {
        this.endpointURL = endpoint;
    }
    getEndpoint() {
        return this.endpointURL;
    }
    /**
   * set the current cache methodology
   * @param cache the cache to use
   */ setCache(cache) {
        this.cache = cache;
    }
    /**
   * get the current cache methodology
   * @param cache the cache to use
   */ getCache() {
        return this.cache;
    }
    /**
   * the endpoint URL
   * ex: `https://api.tcgdex.net/v2`
   * @param endpoint the url
   */ setCacheTTL(seconds) {
        this.cacheTTL = seconds;
    }
    /**
   * get the current useed cache ttl in seconds
   * @returns the cache ttl in seconds
   */ getCacheTTL() {
        return this.cacheTTL;
    }
    getLang() {
        var _a, _b;
        return (_b = (_a = this.lang) != null ? _a : _TCGdex.defaultLang) != null ? _b : "en";
    }
    setLang(lang) {
        this.lang = lang;
    }
    /**
   * Shortcut to easily fetch a card using both it's global id and it's local ID
   * @param id the card global/local ID
   * @param set the card set name/ID (optionnal)
   * @returns the card object
   */ async fetchCard(id, set) {
        const path = set ? [
            "sets",
            set
        ] : [
            "cards"
        ];
        return this.fetch(...path, id);
    }
    /**
   * Shortcut to easily fetch cards using an optionnal set name/ID
   * @param set the card set name/ID (optionnal)
   * @returns a card list
   */ async fetchCards(set) {
        if (set) {
            const fSet = await this.fetch("sets", set);
            return fSet ? fSet.cards : void 0;
        }
        return this.fetch("cards");
    }
    /**
   * @deprecated use `this.fetch('sets', set)`
   */ async fetchSet(set) {
        return this.fetch("sets", set);
    }
    /**
   * @deprecated use `this.fetch('series', serie)`
   */ async fetchSerie(serie) {
        return this.fetch("series", serie);
    }
    /**
   * @deprecated use `this.fetch('series')`
   */ async fetchSeries() {
        return this.fetch("series");
    }
    /**
   * Shortcut to easily fetch sets using an optionnal serie name/ID
   * @param serie the card set name/ID (optionnal)
   * @returns a card list
   */ async fetchSets(serie) {
        if (serie) {
            const fSerie = await this.fetch("series", serie);
            return fSerie ? fSerie.sets : void 0;
        }
        return this.fetch("sets");
    }
    /**
   * Fetch The differents endpoints depending on the first argument
   * @param endpoint_0 {'hp' | 'retreats' | 'categories' | 'illustrators' | 'rarities' | 'types'}
   * Possible value 'cards' | 'categories' | 'hp' | 'illustrators' | 'rarities' | 'retreats' | 'series' | 'sets' | 'types'
   * @param endpoint_1 {string} (Optionnal) some details to go from the index file to the item file (mostly the ID/name)
   * @param endpoint_2 {string} (Optionnal) only for sets the card local ID to fetch the card through the set
   */ async fetch(...endpoint) {
        if (endpoint.length === 0) {
            throw new Error("endpoint to fetch is empty!");
        }
        const baseEndpoint = endpoint.shift().toLowerCase();
        if (!ENDPOINTS.includes(baseEndpoint)) {
            throw new Error(`unknown endpoint to fetch! (${baseEndpoint})`);
        }
        return this.actualFetch(this.getFullURL([
            baseEndpoint,
            ...endpoint
        ]));
    }
    /**
   * @param endpoint the endpoint to fetch
   * @param query the query
   */ async fetchWithQuery(endpoint, query) {
        if (endpoint.length === 0) {
            throw new Error("endpoint to fetch is empty!");
        }
        const baseEndpoint = endpoint[0].toLowerCase();
        if (!ENDPOINTS.includes(baseEndpoint)) {
            throw new Error(`unknown endpoint to fetch! (${baseEndpoint})`);
        }
        return this.actualFetch(this.getFullURL(endpoint, query));
    }
    /**
   * format the final URL
   */ getFullURL(path, searchParams) {
        const url = new URL(`${this.getEndpoint()}/${this.getLang()}`);
        url.pathname = `${url.pathname}/${path.join("/")}`;
        for (const param of searchParams != null ? searchParams : []){
            url.searchParams.append(param.key, param.value.toString());
        }
        return url.toString();
    }
    async actualFetch(path) {
        const cached = this.cache.get(path);
        if (cached) {
            return cached;
        }
        const resp = await _TCGdex.fetch(path, {
            headers: {
                "user-agent": `@tcgdex/javascript-sdk/${version}`
            }
        });
        if (resp.status >= 500) {
            try {
                const json2 = JSON.stringify(await resp.json());
                throw new Error(json2);
            } catch  {
                throw new Error("TCGdex Server responded with an invalid error :(");
            }
        }
        if (resp.status !== 200) {
            return void 0;
        }
        const json = await resp.json();
        this.cache.set(path, json, this.cacheTTL);
        return json;
    }
};
/**
 * How the remote data is going to be fetched
 */ _TCGdex.fetch = detectContext() === "browser" ? (...params)=>window.fetch(...params) : fetch;
/**
 * @deprecated to change the lang use {@link TCGdex.getLang} and {@link TCGdex.setLang}
 */ _TCGdex.defaultLang = "en";
var TCGdex = _TCGdex;
;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d7d2f062._.js.map