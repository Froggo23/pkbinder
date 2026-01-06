'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Filter, Inbox, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockCards } from '@/data/mockCards';

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

const TypeButton = ({ type, color }) => (
    <button
        className="relative flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200 outline-none border border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 focus:ring-2 focus:ring-indigo-500"
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

export default function AddCardModal({ isOpen, onClose, onAddCard }) {
    const [activeTab, setActiveTab] = useState('Single Cards');
    const [selectedCards, setSelectedCards] = useState([]);

    // Generate more dummy cards for the grid
    const gridCards = [...mockCards, ...mockCards, ...mockCards].map((c, i) => ({ ...c, uniqueId: `${c.id}-${i}` }));

    const toggleSelectCard = (card) => {
        if (selectedCards.find(c => c.uniqueId === card.uniqueId)) {
            setSelectedCards(selectedCards.filter(c => c.uniqueId !== card.uniqueId));
        } else {
            setSelectedCards([...selectedCards, card]);
        }
    };

    const handleAddCards = () => {
        onAddCard(selectedCards);
        setSelectedCards([]);
        onClose();
    };

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
                                    <button className="text-[10px] font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">Reset</button>
                                </div>

                                <div className="space-y-4">
                                    <FilterSection label="Sort by">
                                        <FilterButton label="Relevance" />
                                    </FilterSection>

                                    <FilterSection label="Type">
                                        <div className="flex flex-wrap gap-2">
                                            {['#FF6B6B', '#4ECDC4', '#FFE66D', '#A18CD1', '#F79F1F', '#2C3A47'].map((color, i) => (
                                                <TypeButton key={i} type="Type" color={color} />
                                            ))}
                                        </div>
                                    </FilterSection>

                                    <FilterSection label="Rarity">
                                        <FilterButton label="All Rarities" />
                                    </FilterSection>

                                    <FilterSection label="Set">
                                        <FilterButton label="All Sets" />
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
                                        placeholder="Search Pokemon cards or artists"
                                        className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent py-2 sm:py-3 pl-9 pr-3 text-[13px] text-zinc-800 dark:text-zinc-200 focus:border-indigo-500 focus:outline-none placeholder:text-zinc-500"
                                    />
                                </div>
                            </div>

                            {/* Grid Content */}
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0">
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {gridCards.map((card) => {
                                        const isSelected = selectedCards.find(c => c.uniqueId === card.uniqueId);
                                        return (
                                            <div key={card.uniqueId} className="relative group w-full flex justify-center">
                                                <div
                                                    className="group relative aspect-[5/7] cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
                                                    onClick={() => toggleSelectCard(card)}
                                                >
                                                    <img
                                                        src={card.image}
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
                                            <div key={card.uniqueId} className="relative aspect-[5/7]">
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
