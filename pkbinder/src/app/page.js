'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Grid, Layout, Settings, Share2, Plus, Filter, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import AddCardModal from '@/components/AddCardModal';

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active }) => (
    <button className={cn(
        "flex items-center gap-3 w-full px-3 py-2 rounded-md transition-colors text-sm font-medium",
        active
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
    )}>
        <Icon size={18} />
        {label && <span>{label}</span>}
    </button>
);

const CardSlot = ({ card, onClick, onDelete }) => {
    const [showDelete, setShowDelete] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => {
                if (card) {
                    setShowDelete(true);
                } else {
                    setIsHovered(true);
                }
            }}
            onMouseLeave={() => {
                setShowDelete(false);
                setIsHovered(false);
            }}
            onClick={onClick}
            className={cn(
                "aspect-[2.5/3.5] rounded-xl overflow-hidden relative group transition-all duration-300",
                !card && "card-slot-empty cursor-pointer bg-zinc-800/30",
                !card && isHovered && "shadow-[0_0_12px_rgba(99,102,241,0.5)]"
            )}
        >
            {card ? (
                <motion.div
                    layoutId={`card-${card.id}`}
                    className="w-full h-full relative"
                    whileHover={{ scale: 1.05, zIndex: 10 }}
                >
                    <img
                        src={card.image}
                        alt={card.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                    {/* Delete button on hover */}
                    <AnimatePresence>
                        {showDelete && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete();
                                }}
                                className="absolute top-2 right-2 bg-red-600 hover:bg-red-500 text-white rounded-full p-1.5 shadow-lg z-20 transition-colors"
                            >
                                <X size={16} />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </motion.div>
            ) : (
                <div className="flex items-center justify-center h-full relative">
                    {/* Hover animation - add card button in grey box */}
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="px-3 py-1.5 bg-zinc-700 text-zinc-200 text-sm font-medium rounded-md shadow-lg"
                            >
                                Add Card
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

const TitlePage = ({ title, description, onTitleChange, onDescriptionChange }) => {
    return (
        <div className="binder-page bg-card rounded-xl p-6 md:p-8 h-full flex flex-col justify-center items-center text-center gap-6">
            <input
                type="text"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                className="text-6xl font-bold bg-transparent border-none outline-none text-center w-full text-white placeholder-gray-600 focus:text-primary transition-colors"
                placeholder="title"
            />
            <textarea
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                className="text-lg text-gray-400 bg-transparent border-none outline-none text-center w-full resize-none placeholder-gray-700 focus:text-gray-300 transition-colors"
                placeholder="description"
                rows={3}
            />
        </div>
    );
};

const BinderPage = ({ slots, onSlotClick, onDeleteCard }) => {
    return (
        <div className="binder-page bg-card rounded-xl p-6 md:p-8 grid grid-cols-3 gap-1.5 md:gap-2 h-full">
            {slots.map((card, i) => (
                <CardSlot
                    key={i}
                    card={card}
                    onClick={() => !card && onSlotClick(i)}
                    onDelete={() => card && onDeleteCard(i)}
                />
            ))}
        </div>
    );
};

export default function Home() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSpreadIndex, setCurrentSpreadIndex] = useState(0); // Which spread we're viewing
    const [currentAddingSlot, setCurrentAddingSlot] = useState(null);
    const [addingToLeftPage, setAddingToLeftPage] = useState(false); // Track which page is being added to
    const [showPageCounter, setShowPageCounter] = useState(false); // Transient page counter visibility

    // Show page counter transiently when spread changes
    React.useEffect(() => {
        setShowPageCounter(true);
        const timer = setTimeout(() => {
            setShowPageCounter(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, [currentSpreadIndex]);

    // Title page data
    const [titleData, setTitleData] = useState({
        title: 'My Collection',
        description: 'Start organizing your cards'
    });

    // Card pages - using sparse arrays to maintain slot positions
    const [cardPages, setCardPages] = useState([
        { id: 0, slots: Array(9).fill(null) }  // First card page
    ]);

    // Calculate what to show on left and right based on spread index
    // Spread 0: Title (left) + Card Page 0 (right)
    // Spread 1: Card Page 1 (left) + Card Page 2 (right)
    // Spread 2: Card Page 3 (left) + Card Page 4 (right)
    // etc.

    const getLeftPage = () => {
        if (currentSpreadIndex === 0) {
            return { type: 'title', data: titleData };
        }
        const cardPageIndex = (currentSpreadIndex * 2) - 1;
        return {
            type: 'cards',
            data: cardPages[cardPageIndex] || { id: `empty-${cardPageIndex}`, slots: Array(9).fill(null) },
            index: cardPageIndex
        };
    };

    const getRightPage = () => {
        const cardPageIndex = currentSpreadIndex === 0 ? 0 : (currentSpreadIndex * 2);
        return {
            type: 'cards',
            data: cardPages[cardPageIndex] || { id: `empty-${cardPageIndex}`, slots: Array(9).fill(null) },
            index: cardPageIndex
        };
    };

    const leftPage = getLeftPage();
    const rightPage = getRightPage();

    const handleSlotClick = (slotIndex, isLeftPage) => {
        setCurrentAddingSlot(slotIndex);
        setAddingToLeftPage(isLeftPage);
        setIsModalOpen(true);
    };

    const handleAddCards = (newCards) => {
        if (currentAddingSlot === null) return;

        const targetPageIndex = addingToLeftPage ? leftPage.index : rightPage.index;

        setCardPages(prevPages => {
            // Ensure the page exists
            while (prevPages.length <= targetPageIndex) {
                prevPages.push({ id: Date.now() + prevPages.length, slots: Array(9).fill(null) });
            }

            const updatedPages = [...prevPages];
            const updatedSlots = [...updatedPages[targetPageIndex].slots];

            // Add the first card to the clicked slot
            if (newCards.length > 0 && updatedSlots[currentAddingSlot] === null) {
                updatedSlots[currentAddingSlot] = newCards[0];
            }

            updatedPages[targetPageIndex] = {
                ...updatedPages[targetPageIndex],
                slots: updatedSlots
            };

            return updatedPages;
        });

        setCurrentAddingSlot(null);
        setAddingToLeftPage(false);
    };

    const handleDeleteCard = (slotIndex, isLeftPage) => {
        const targetPageIndex = isLeftPage ? leftPage.index : rightPage.index;

        setCardPages(prevPages => {
            const updatedPages = [...prevPages];
            const updatedSlots = [...updatedPages[targetPageIndex].slots];
            updatedSlots[slotIndex] = null;
            updatedPages[targetPageIndex] = {
                ...updatedPages[targetPageIndex],
                slots: updatedSlots
            };
            return updatedPages;
        });
    };

    const handleAddPage = () => {
        const newPage = {
            id: Date.now(),
            slots: Array(9).fill(null)
        };
        setCardPages([...cardPages, newPage]);
    };

    const handleTitleChange = (newTitle) => {
        setTitleData(prev => ({ ...prev, title: newTitle }));
    };

    const handleDescriptionChange = (newDescription) => {
        setTitleData(prev => ({ ...prev, description: newDescription }));
    };

    const goToPreviousSpread = () => {
        if (currentSpreadIndex > 0) {
            setCurrentSpreadIndex(currentSpreadIndex - 1);
        }
    };

    const goToNextSpread = () => {
        // Can always go to next spread
        setCurrentSpreadIndex(currentSpreadIndex + 1);
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden">
            <AddCardModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setCurrentAddingSlot(null);
                }}
                onAddCard={handleAddCards}
            />

            {/* Header */}
            <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-background/50 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-secondary rounded">
                        <Menu size={20} />
                    </button>
                    <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        pkbinder
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Search removed */}

                    <button className="h-9 px-4 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors shadow-[0_0_15px_-3px_var(--primary)]">
                        Sign In
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className={cn(
                    "w-64 border-r border-border bg-card/30 p-4 space-y-6 hidden md:block transition-all duration-300",
                    !sidebarOpen && "w-0 p-0 overflow-hidden border-none"
                )}>
                    <div className="space-y-1">
                        <SidebarItem icon={Layout} label="My Binders" active />
                        <SidebarItem icon={Grid} label="Collection" />
                        <SidebarItem icon={Search} label="Browse Database" />
                    </div>

                    <div>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">Binder Settings</h3>
                        <div className="space-y-1">
                            <SidebarItem icon={Settings} label="Customize" />
                            <SidebarItem icon={Share2} label="Share Binder" />
                            <SidebarItem icon={Filter} label="Sort & Filter" />
                        </div>
                    </div>
                </aside>

                {/* Main Content - Two Page Spread */}
                <main className="flex-1 overflow-auto p-4 md:p-8 flex justify-center items-center bg-black/50">
                    <div className="w-full max-w-7xl flex gap-6 items-center h-[90vh] relative">
                        {/* Navigation Arrow - Left (outside binder) */}
                        {currentSpreadIndex > 0 && (
                            <button
                                onClick={goToPreviousSpread}
                                className="p-3 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors z-50"
                            >
                                <ChevronLeft size={24} />
                            </button>
                        )}

                        <div className="flex-1 flex gap-4 h-full relative perspective-1000">
                            {/* Left Page */}
                            <div className="flex-1 relative z-10">
                                <div className="h-full">
                                    {leftPage.type === 'title' ? (
                                        <TitlePage
                                            title={leftPage.data.title}
                                            description={leftPage.data.description}
                                            onTitleChange={handleTitleChange}
                                            onDescriptionChange={handleDescriptionChange}
                                        />
                                    ) : (
                                        <BinderPage
                                            slots={leftPage.data.slots}
                                            onSlotClick={(slotIndex) => handleSlotClick(slotIndex, true)}
                                            onDeleteCard={(slotIndex) => handleDeleteCard(slotIndex, true)}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Right Page */}
                            <div className="flex-1 relative z-10">
                                <div className="h-full">
                                    <BinderPage
                                        slots={rightPage.data.slots}
                                        onSlotClick={(slotIndex) => handleSlotClick(slotIndex, false)}
                                        onDeleteCard={(slotIndex) => handleDeleteCard(slotIndex, false)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Navigation Arrow - Right (outside binder) */}
                        <button
                            onClick={goToNextSpread}
                            className="p-3 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors z-50 text-white shadow-lg border border-zinc-700"
                        >
                            <ChevronRight size={24} />
                        </button>

                        {/* Add Page Button - Far Right Edge */}
                        <div className="absolute -right-20 top-1/2 -translate-y-1/2 z-50">
                            <button
                                onClick={handleAddPage}
                                className="p-3 rounded-full bg-primary hover:bg-primary/90 transition-colors shadow-lg group"
                                title="Add New Page"
                            >
                                <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>

                        {/* Page Counter - Transient */}
                        <AnimatePresence mode="wait">
                            {showPageCounter && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-zinc-800/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white/50 shadow-sm border border-white/5 pointer-events-none z-50 select-none"
                                >
                                    {currentSpreadIndex + 1} / {Math.max(1, Math.ceil((cardPages.length + 1) / 2))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    );
}
