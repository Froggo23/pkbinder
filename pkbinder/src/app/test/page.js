'use client';

import React, { useState } from 'react';
import { searchCards } from '@/lib/api';

export default function TestPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Inputs
    const [name, setName] = useState('Pikachu');
    const [setNameInput, setSetNameInput] = useState('');
    const [pageSize, setPageSize] = useState(10);

    const handleFetch = async () => {
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

            const res = await searchCards(name, 1, pageSize, { setName: setNameInput });

            console.log('Test Page: Fetch result:', res);
            if (res.error) throw new Error(res.error);
            setData(res);
        } catch (err) {
            console.error('Test Page: Fetch error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-zinc-950 text-white min-h-screen font-mono">
            <h1 className="text-2xl font-bold mb-6">API Test Console (v2)</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 border border-zinc-800 rounded-lg bg-zinc-900/50">
                <div>
                    <label className="block text-xs text-zinc-400 mb-1">Card Name</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-black border border-zinc-700 rounded px-2 py-1 text-sm"
                    />
                </div>
                <div>
                    <label className="block text-xs text-zinc-400 mb-1">Set Name (Optional)</label>
                    <input
                        value={setNameInput}
                        onChange={(e) => setSetNameInput(e.target.value)}
                        placeholder="e.g. Base, Evolving Skies"
                        className="w-full bg-black border border-zinc-700 rounded px-2 py-1 text-sm"
                    />
                </div>
                <div>
                    <label className="block text-xs text-zinc-400 mb-1">Page Size</label>
                    <input
                        type="number"
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="w-full bg-black border border-zinc-700 rounded px-2 py-1 text-sm"
                    />
                </div>
            </div>

            <div className="mb-6">
                <button
                    onClick={handleFetch}
                    disabled={loading}
                    className="px-6 py-2 bg-indigo-600 rounded hover:bg-indigo-500 disabled:opacity-50 font-semibold"
                >
                    {loading ? 'Fetching...' : 'Run Search'}
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-900/50 border border-red-700 rounded mb-4 text-red-200">
                    Error: {error}
                </div>
            )}

            {data && (
                <div className="space-y-4">
                    <div className="flex gap-4 text-sm text-zinc-400 border-b border-zinc-800 pb-2">
                        <span>Count: {data.count}</span>
                        <span>Total: {data.totalCount}</span>
                        <span>Page: {data.page}</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {data.data?.map(card => (
                            <div key={card.id} className="p-3 border border-zinc-800 rounded bg-zinc-900 flex flex-col gap-2">
                                <div className="aspect-[2.5/3.5] bg-black rounded overflow-hidden relative">
                                    <img src={card.images.small} className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm truncate" title={card.name}>{card.name}</p>
                                    <p className="text-xs text-zinc-500">{card.set.name}</p>
                                    <p className="text-[10px] text-zinc-600 font-mono">{card.id}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <details className="mt-4">
                        <summary className="cursor-pointer text-zinc-500 hover:text-white">Raw Response JSON</summary>
                        <pre className="mt-2 p-4 bg-black rounded overflow-auto text-xs text-green-400 max-h-96">
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    </details>
                </div>
            )}
        </div>
    );
}
