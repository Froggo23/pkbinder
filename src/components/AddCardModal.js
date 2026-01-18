'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Filter, Inbox, ChevronDown, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { searchCards } from '@/lib/api';

// --- Sub-components for the Modal ---

const FilterSection = ({ label, children }) => (
    <div className="mb-4">
        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-2">{label}</label>
        {children}
    </div>
);

const FilterButton = ({ label, icon: Icon }) => (
    <button className="flex w-full items-center justify-between rounded-[6px] border border-slate-300 dark:border-zinc-700 bg-transparent py-2 px-3 text-[13px] font-[500] shadow-sm focus:border-indigo-400 dark:focus:border-indigo-500 focus:outline-none hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors text-zinc-700 dark:text-zinc-400 hover:text-zinc-500 dark:hover:text-white">
        <div className="flex items-center gap-2 flex-1 min-w-0">
            {Icon && <Icon className="w-4 h-4" />}
            <span className="truncate">{label}</span>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-400 flex-shrink-0 ml-2" />
    </button>
);

const TypeButton = ({ type, color, active, onClick }) => (
    <button
        onClick={onClick}
        className={cn(
            "relative flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200 outline-none border hover:border-zinc-400 dark:hover:border-zinc-600 focus:ring-2 focus:ring-indigo-500",
            active
                ? "border-indigo-500 ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-zinc-900"
                : "border-zinc-300 dark:border-zinc-700"
        )}
        title={type}
    >
        <div className="w-5 h-5 rounded-full opacity-80" style={{ backgroundColor: color }} />
    </button>
);

const TabButton = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={cn(
            "w-full rounded-md py-2.5 px-3 text-sm font-medium leading-5 transition-all duration-200 text-left outline-none",
            active
                ? "bg-zinc-800 text-white"
                : "text-zinc-500 hover:bg-zinc-800/50 hover:text-white"
        )}
    >
        {label}
    </button>
);

// Helper for debouncing search
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

export default function AddCardModal({ isOpen, onClose, onAddCard }) {
    const [activeTab, setActiveTab] = useState('Single Cards');
    const [selectedCards, setSelectedCards] = useState([]);

    // API State
    const [query, setQuery] = useState('');
    const [selectedType, setSelectedType] = useState(null); // New state for type
    const [rarity, setRarity] = useState('');
    const [sortBy, setSortBy] = useState('relevance');
    const [setName, setSetName] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const debouncedQuery = useDebounce(query, 500);
    const debouncedSetName = useDebounce(setName, 500);
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);

    // Reset pagination when filters or tab change
    useEffect(() => {
        setPage(1);
        setHasMore(true);
        setCards([]);
    }, [debouncedQuery, debouncedSetName, selectedType, rarity, sortBy, activeTab]);

    // Fetch cards when page or filters change
    useEffect(() => {
        if (!isOpen) return;

        const fetch = async () => {
            setLoading(true);
            try {
                const res = await searchCards(debouncedQuery, page, 30, {
                    types: selectedType,
                    rarity: rarity,
                    orderBy: sortBy,
                    setName: debouncedSetName
                });

                if (page === 1) {
                    setCards(res.data || []);
                } else {
                    setCards(prev => [...prev, ...res.data]);
                }

                // Use the hasMore flag from the API
                setHasMore(res.hasMore ?? (res.data?.length === 30));
            } catch (error) {
                console.error("Error fetching cards:", error);
            }
            setLoading(false);
        };

        fetch();
    }, [isOpen, page, debouncedQuery, debouncedSetName, selectedType, rarity, sortBy, activeTab]);

    const handleScroll = (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.target;
        // Load more when user is 50px from bottom, not loading, and has more data
        if (scrollHeight - scrollTop <= clientHeight + 50 && !loading && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    const handleTypeClick = (typeLabel) => {
        // Toggle if already selected
        setSelectedType(prev => prev === typeLabel ? null : typeLabel);
    };

    const toggleSelectCard = (card) => {
        // We use the API ID directly for uniqueness
        if (selectedCards.find(c => c.id === card.id)) {
            setSelectedCards(selectedCards.filter(c => c.id !== card.id));
        } else {
            // Normalize card data for our app
            const normalizedCard = {
                id: card.id,
                name: card.name,
                // Fallback or specific size
                image: card.images.large || card.images.small,
                set: card.set.name,
                number: card.number,
                rarity: card.rarity
            };
            setSelectedCards([...selectedCards, normalizedCard]);
        }
    };

    const handleAddCards = () => {
        onAddCard(selectedCards);
        setSelectedCards([]);
        onClose();
    };

    // Mapping for colors to Type Names (simplified for Pokemon TCG)
    const typeMap = [
        { name: 'Fire', color: '#FF6B6B' },
        { name: 'Water', color: '#4ECDC4' },
        { name: 'Lightning', color: '#FFE66D' },
        { name: 'Psychic', color: '#A18CD1' },
        { name: 'Fighting', color: '#F79F1F' },
        { name: 'Darkness', color: '#2C3A47' },
        { name: 'Grass', color: '#48db48' },
        { name: 'Colorless', color: '#dfe6e9' },
        { name: 'Metal', color: '#b2bec3' },
        { name: 'Dragon', color: '#fa8231' }
    ];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal Panel */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full h-full sm:w-[1400px] sm:max-w-[95vw] sm:h-[90vh] sm:max-h-[900px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-md flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0 bg-white dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 text-[13px] font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors text-zinc-700 dark:text-zinc-400">
                                <span className="text-base">🇺🇸</span>
                                <span>Cards</span>
                            </button>
                            <h2 className="text-md font-semibold text-zinc-900 dark:text-zinc-50">Add Cards</h2>
                        </div>
                        <button onClick={onClose} className="rounded-md p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex flex-1 min-h-0 flex-col sm:flex-row">

                        {/* Left Sidebar - Filters */}
                        <div className="hidden sm:flex w-64 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex-col flex-shrink-0">
                            <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
                                <div className="flex flex-col space-y-1">
                                    {['Single Cards', 'Sets', 'Sleeves'].map(tab => (
                                        <TabButton
                                            key={tab}
                                            label={tab}
                                            active={activeTab === tab}
                                            onClick={() => setActiveTab(tab)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto px-3 py-4 [&::-webkit-scrollbar]:hidden">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-[13px] font-medium text-zinc-800 dark:text-white">Filters</h3>
                                    <button
                                        onClick={() => {
                                            setQuery('');
                                            setSetName('');
                                            setSelectedType(null);
                                            setRarity('');
                                            setSortBy('relevance');
                                        }}
                                        className="text-[10px] font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                                    >
                                        Reset
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <FilterSection label="Sort by">
                                        <div className="relative">
                                            <select
                                                value={sortBy}
                                                onChange={(e) => setSortBy(e.target.value)}
                                                className="w-full rounded-[6px] border border-slate-300 dark:border-zinc-700 bg-transparent py-2 px-3 text-[13px] font-[500] shadow-sm focus:border-indigo-400 focus:outline-none text-zinc-700 dark:text-zinc-400 appearance-none cursor-pointer"
                                            >
                                                <option value="relevance">Relevance</option>
                                                <option value="name">Name (A-Z)</option>
                                                <option value="-name">Name (Z-A)</option>
                                                <option value="set.releaseDate">Release Date (Newest)</option>
                                                <option value="-set.releaseDate">Release Date (Oldest)</option>
                                                <option value="number">Card Number</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                                        </div>
                                    </FilterSection>

                                    <FilterSection label="Type">
                                        <div className="flex flex-wrap gap-2">
                                            {typeMap.map((t) => (
                                                <TypeButton
                                                    key={t.name}
                                                    type={t.name}
                                                    color={t.color}
                                                    active={selectedType === t.name}
                                                    onClick={() => handleTypeClick(t.name)}
                                                />
                                            ))}
                                        </div>
                                    </FilterSection>

                                    <FilterSection label="Rarity">
                                        <div className="relative">
                                            <select
                                                value={rarity}
                                                onChange={(e) => setRarity(e.target.value)}
                                                className="w-full rounded-[6px] border border-slate-300 dark:border-zinc-700 bg-transparent py-2 px-3 text-[13px] font-[500] shadow-sm focus:border-indigo-400 focus:outline-none text-zinc-700 dark:text-zinc-400 appearance-none cursor-pointer"
                                            >
                                                <option value="">All Rarities</option>
                                                <option value="Common">Common</option>
                                                <option value="Uncommon">Uncommon</option>
                                                <option value="Rare">Rare</option>
                                                <option value="Rare Holo">Rare Holo</option>
                                                <option value="Ultra Rare">Ultra Rare</option>
                                                <option value="Secret Rare">Secret Rare</option>
                                                <option value="Promo">Promo</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                                        </div>
                                    </FilterSection>

                                    <FilterSection label="Set Name">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
                                            <input
                                                type="text"
                                                value={setName}
                                                onChange={(e) => setSetName(e.target.value)}
                                                placeholder="e.g. 'Silver Tempest'"
                                                className="w-full rounded-[6px] border border-slate-300 dark:border-zinc-700 bg-transparent py-2 pl-9 pr-3 text-[13px] font-[500] shadow-sm focus:border-indigo-400 focus:outline-none text-zinc-700 dark:text-zinc-400 placeholder:text-zinc-500"
                                            />
                                        </div>
                                    </FilterSection>
                                </div>
                            </div>
                        </div>

                        {/* Center - Grid & Search */}
                        <div className="flex-1 flex flex-col min-h-0 relative bg-white dark:bg-zinc-900">
                            {/* Search Bar */}
                            <div className="px-3 sm:px-5 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3 flex-shrink-0">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Search Pokemon cards (e.g. 'Pikachu', 'Charizard')"
                                        className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent py-2 sm:py-3 pl-9 pr-3 text-[13px] text-zinc-800 dark:text-zinc-200 focus:border-indigo-500 focus:outline-none placeholder:text-zinc-500 transition-all"
                                    />
                                    {loading && (
                                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500 w-4 h-4 animate-spin" />
                                    )}
                                </div>
                            </div>

                            {/* Grid Content */}
                            <div
                                className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0"
                                onScroll={handleScroll}
                            >
                                {cards.length === 0 && !loading ? (
                                    <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                                        <p>No cards found.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                            {cards.map((card, index) => {
                                                const isSelected = selectedCards.find(c => c.id === card.id);
                                                return (
                                                    <div key={`${card.id}-${index}`} className="relative group w-full flex justify-center">
                                                        <div
                                                            className="group relative aspect-[5/7] cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
                                                            onClick={() => toggleSelectCard(card)}
                                                        >
                                                            <img
                                                                src={card.images.small}
                                                                alt={card.name}
                                                                className={cn(
                                                                    "w-full h-full object-contain transition-all duration-200",
                                                                    isSelected ? "opacity-60 grayscale-[0.5]" : ""
                                                                )}
                                                                loading="lazy"
                                                            />
                                                            {isSelected && (
                                                                <div className="absolute inset-0 flex items-center justify-center bg-indigo-600/20 border-2 border-indigo-500 rounded-sm">
                                                                    <div className="bg-indigo-600 rounded-full p-1">
                                                                        <Check className="w-4 h-4 text-white" />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {loading && (
                                            <div className="w-full flex justify-center py-4">
                                                <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Footer Actions */}
                            <div className="px-3 sm:px-5 py-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300">Add to current page</span>
                                    <div className="w-9 h-5 bg-zinc-300 dark:bg-zinc-700 rounded-full relative cursor-pointer">
                                        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-semibold hover:shadow-md transition-all text-zinc-700 dark:text-zinc-200">
                                        <Inbox className="w-4 h-4" />
                                        Add to Tray
                                    </button>
                                    <button
                                        onClick={handleAddCards}
                                        disabled={selectedCards.length === 0}
                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        Add {selectedCards.length} cards
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar - Selected */}
                        <div className="hidden lg:flex w-80 border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex-col flex-shrink-0">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
                                <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Selected</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto px-4 py-3">
                                {selectedCards.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                                        <Inbox className="w-10 h-10 mb-3 opacity-20" />
                                        <p className="text-xs text-zinc-500">Selected cards will appear here</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2">
                                        {selectedCards.map(card => (
                                            <div key={card.id} className="relative aspect-[5/7]">
                                                <img src={card.image} className="w-full h-full object-contain" />
                                                <button
                                                    onClick={() => toggleSelectCard(card)}
                                                    className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white hover:bg-red-500/80 transition-colors"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
