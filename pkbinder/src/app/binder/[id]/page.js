'use client';

import React, { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Grid, Layout, Settings, Share2, Plus, Filter, Menu, X, ChevronLeft, ChevronRight, Save, Loader2, LogOut, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import AddCardModal from '@/components/AddCardModal';
import HoloCard from '@/components/HoloCard';

// --- Main Page Component ---

export default function Binder({ params }) {
    const { id } = use(params);
    const binderId = id;

    // 1. STATE DEFINITIONS
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSpreadIndex, setCurrentSpreadIndex] = useState(0);
    const [currentAddingSlot, setCurrentAddingSlot] = useState(null);
    const [addingToLeftPage, setAddingToLeftPage] = useState(false);
    const [showPageCounter, setShowPageCounter] = useState(false);
    const [user, setUser] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Binder Data State
    const [titleData, setTitleData] = useState({ title: '', description: '' });
    const [cardPages, setCardPages] = useState([{ id: 0, slots: Array(9).fill(null) }]);

    // 2. HELPER FUNCTIONS

    function getLeftPage() {
        if (currentSpreadIndex === 0) return { type: 'title', data: titleData };
        const cardPageIndex = (currentSpreadIndex * 2) - 1;
        return {
            type: 'cards',
            data: cardPages[cardPageIndex] || { id: `empty-${cardPageIndex}`, slots: Array(9).fill(null) },
            index: cardPageIndex
        };
    }

    function getRightPage() {
        const cardPageIndex = currentSpreadIndex === 0 ? 0 : (currentSpreadIndex * 2);
        return {
            type: 'cards',
            data: cardPages[cardPageIndex] || { id: `empty-${cardPageIndex}`, slots: Array(9).fill(null) },
            index: cardPageIndex
        };
    }

    const leftPage = getLeftPage();
    const rightPage = getRightPage();

    function handleSlotClick(slotIndex, isLeftPage) {
        setCurrentAddingSlot(slotIndex);
        setAddingToLeftPage(isLeftPage);
        setIsModalOpen(true);
    }

    function handleAddCards(newCards) {
        if (currentAddingSlot === null) return;
        const targetPageIndex = addingToLeftPage ? leftPage.index : rightPage.index;

        setCardPages(prevPages => {
            let updatedPages = [...prevPages];
            while (updatedPages.length <= targetPageIndex) {
                updatedPages.push({ id: Date.now() + updatedPages.length, slots: Array(9).fill(null) });
            }
            const updatedSlots = [...updatedPages[targetPageIndex].slots];
            if (newCards.length > 0 && updatedSlots[currentAddingSlot] === null) {
                updatedSlots[currentAddingSlot] = newCards[0];
            }
            updatedPages[targetPageIndex] = { ...updatedPages[targetPageIndex], slots: updatedSlots };
            return updatedPages;
        });
        setCurrentAddingSlot(null);
        setAddingToLeftPage(false);
        setHasUnsavedChanges(true); // Explicitly set unsaved changes
    }

    function handleDeleteCard(slotIndex, isLeftPage) {
        const targetPageIndex = isLeftPage ? leftPage.index : rightPage.index;
        setCardPages(prevPages => {
            const updatedPages = [...prevPages];
            if (!updatedPages[targetPageIndex]) return prevPages;
            const updatedSlots = [...updatedPages[targetPageIndex].slots];
            updatedSlots[slotIndex] = null;
            updatedPages[targetPageIndex] = { ...updatedPages[targetPageIndex], slots: updatedSlots };
            return updatedPages;
        });
        setHasUnsavedChanges(true);
    }

    function handleAddPage() {
        const newPage = { id: Date.now(), slots: Array(9).fill(null) };
        setCardPages([...cardPages, newPage]);
        setHasUnsavedChanges(true);
    }

    function handleTitleChange(newTitle) {
        setTitleData(prev => ({ ...prev, title: newTitle }));
        setHasUnsavedChanges(true);
    }

    function handleDescriptionChange(newDescription) {
        setTitleData(prev => ({ ...prev, description: newDescription }));
        setHasUnsavedChanges(true);
    }

    function goToPreviousSpread() {
        if (currentSpreadIndex > 0) setCurrentSpreadIndex(currentSpreadIndex - 1);
    }

    function goToNextSpread() {
        setCurrentSpreadIndex(currentSpreadIndex + 1);
    }

    async function handleSave() {
        if (!user) {
            alert('Please sign in to save your binder.');
            return;
        }
        setIsSaving(true);
        setSaveStatus(null);
        try {
            const payload = {
                user_id: user.id,
                title: titleData.title,
                description: titleData.description,
                data: cardPages,
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase.from('binders').update(payload).eq('id', binderId);

            if (error) throw error;
            setSaveStatus('success');
            setHasUnsavedChanges(false);
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (error) {
            console.error('Error saving binder:', error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(null), 3000);
        } finally {
            setIsSaving(false);
        }
    }

    async function handleSignOut() {
        await supabase.auth.signOut();
        window.location.href = '/'; // Force redirect to dashboard
    }

    // 3. EFFECTS

    // Initial load - Fetch from Supabase directly
    useEffect(() => {
        const fetchBinder = async () => {
            setIsLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            const currentUser = session?.user || null;
            setUser(currentUser);

            if (currentUser) {
                const { data, error } = await supabase
                    .from('binders')
                    .select('*')
                    .eq('id', binderId)
                    .single();

                if (data && !error) {
                    setTitleData({ title: data.title, description: data.description });
                    setCardPages(data.data || [{ id: 0, slots: Array(9).fill(null) }]);
                } else if (error) {
                    console.error("Error fetching binder:", error);
                    // Handle error (e.g. redirect if 404?)
                }
            }
            setIsLoading(false);
        };
        fetchBinder();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, [binderId]);

    // Periodic cloud autosave
    useEffect(() => {
        const interval = setInterval(() => {
            if (user && hasUnsavedChanges && !isSaving) {
                handleSave();
            }
        }, 60000);
        return () => clearInterval(interval);
    }, [user, hasUnsavedChanges, isSaving, titleData, cardPages, binderId]);

    // Page counter popup
    useEffect(() => {
        setShowPageCounter(true);
        const timer = setTimeout(() => setShowPageCounter(false), 2000);
        return () => clearTimeout(timer);
    }, [currentSpreadIndex]);

    if (isLoading) {
        return <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
            <Loader2 size={32} className="animate-spin text-primary" />
        </div>
    }

    if (!user) {
        // Simple protection state if user logs out or isn't logged in
        return <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">Please Sign In</h1>
            <Link href="/auth">
                <button className="h-10 px-6 rounded-full bg-primary text-white font-medium">Sign In</button>
            </Link>
        </div>
    }

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

            <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-background/50 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-secondary rounded">
                        <Menu size={20} />
                    </button>
                    <Link href="/">
                        <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 cursor-pointer">
                            pkbinder
                        </span>
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={cn(
                            "flex items-center gap-2 h-9 px-4 rounded-full text-sm font-medium transition-all shadow-lg",
                            saveStatus === 'success' ? "bg-green-600 text-white" : saveStatus === 'error' ? "bg-red-600 text-white" : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                        )}
                    >
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : saveStatus === 'success' ? <Check size={16} /> : <Save size={16} />}
                        <span>{saveStatus === 'success' ? 'Saved' : isSaving ? 'Saving...' : hasUnsavedChanges ? 'Unsaved Changes' : 'Saved to Cloud'}</span>
                        {hasUnsavedChanges && !isSaving && !saveStatus && (
                            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse ml-1" title="Unsaved changes" />
                        )}
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary-foreground font-bold text-xs border border-primary/30">
                            {user.email?.[0].toUpperCase()}
                        </div>
                        <button onClick={handleSignOut} className="p-2 hover:bg-secondary rounded-full text-muted-foreground hover:text-foreground transition-colors" title="Sign Out">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
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

                <main className="flex-1 overflow-auto p-4 md:p-8 flex justify-center items-center bg-black/50">
                    <div className="w-full max-w-7xl flex gap-6 items-center h-[90vh] relative">
                        <button onClick={goToPreviousSpread} disabled={currentSpreadIndex === 0} className={cn("p-3 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors z-50", currentSpreadIndex === 0 && "opacity-50 cursor-default hover:bg-zinc-800")}>
                            <ChevronLeft size={24} />
                        </button>
                        <div className="flex-1 flex justify-center gap-4 h-full relative perspective-1000">
                            <div className="flex-none w-[600px] aspect-[100/136] relative z-10">
                                {leftPage.type === 'title' ? (
                                    <TitlePage title={leftPage.data.title} description={leftPage.data.description} onTitleChange={handleTitleChange} onDescriptionChange={handleDescriptionChange} />
                                ) : (
                                    <BinderPage slots={leftPage.data.slots} onSlotClick={(slotIndex) => handleSlotClick(slotIndex, true)} onDeleteCard={(slotIndex) => handleDeleteCard(slotIndex, true)} />
                                )}
                            </div>
                            <div className="flex-none w-[600px] aspect-[100/136] relative z-10">
                                <BinderPage slots={rightPage.data.slots} onSlotClick={(slotIndex) => handleSlotClick(slotIndex, false)} onDeleteCard={(slotIndex) => handleDeleteCard(slotIndex, false)} />
                            </div>
                        </div>
                        {(() => {
                            const nextSpreadLeftPageIndex = 2 * currentSpreadIndex + 1;
                            const hasNextSpread = nextSpreadLeftPageIndex < cardPages.length;
                            if (hasNextSpread) {
                                return <button onClick={goToNextSpread} className="p-3 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors z-50 text-white shadow-lg border border-zinc-700"><ChevronRight size={24} /></button>;
                            } else {
                                return <button onClick={handleAddPage} className="p-3 rounded-full bg-primary hover:bg-primary/90 transition-colors shadow-lg group z-50" title="Add New Page"><Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" /></button>;
                            }
                        })()}
                        <AnimatePresence mode="wait">
                            {showPageCounter && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-zinc-800/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white/50 shadow-sm border border-white/5 pointer-events-none z-50 select-none">
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

// --- Sub-components (Moved to bottom to ensure Home evaluates first) ---

function SidebarItem({ icon: Icon, label, active }) {
    return (
        <button className={cn("flex items-center gap-3 w-full px-3 py-2 rounded-md transition-colors text-sm font-medium", active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground")}>
            <Icon size={18} />
            {label && <span>{label}</span>}
        </button>
    );
}

function CardSlot({ card, onClick, onDelete }) {
    const [showDelete, setShowDelete] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div onMouseEnter={() => card ? setShowDelete(true) : setIsHovered(true)} onMouseLeave={() => { setShowDelete(false); setIsHovered(false); }} onClick={onClick} className={cn("h-full w-full rounded-xl overflow-hidden relative group transition-all duration-300", !card && "card-slot-empty cursor-pointer bg-zinc-800/30", !card && isHovered && "shadow-[0_0_12px_rgba(99,102,241,0.5)]")}>
            {card ? (
                <motion.div layoutId={`card-${card.id}`} className="w-full h-full relative" whileHover={{ scale: 1.05, zIndex: 10 }}>
                    <HoloCard
                        img={card.image}
                        name={card.name}
                        className="w-full h-full p-1" // Add padding directly to match previous style
                        rarity={card.rarity || "rare holo"} // Fallback or use data if available
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/0 transition-colors pointer-events-none" /> {/* Removed dark overlay on hover to not obscure holo effect */}
                    <AnimatePresence>
                        {showDelete && (
                            <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={(e) => { e.stopPropagation(); onDelete(); }} className="absolute top-2 right-2 bg-red-600 hover:bg-red-500 text-white rounded-full p-1.5 shadow-lg z-20 transition-colors">
                                <X size={16} />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </motion.div>
            ) : (
                <div className="flex items-center justify-center h-full relative">
                    <AnimatePresence>{isHovered && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="px-3 py-1.5 bg-zinc-700 text-zinc-200 text-sm font-medium rounded-md shadow-lg">Add Card</motion.div>}</AnimatePresence>
                </div>
            )}
        </div>
    );
}

function TitlePage({ title, description, onTitleChange, onDescriptionChange }) {
    return (
        <div className="binder-page bg-card rounded-xl p-6 md:p-8 h-full flex flex-col justify-center items-center text-center gap-6">
            <input type="text" value={title} onChange={(e) => onTitleChange(e.target.value)} className="text-6xl font-bold bg-transparent border-none outline-none text-center w-full text-white placeholder-gray-600 focus:text-primary transition-colors" placeholder="title" />
            <textarea value={description} onChange={(e) => onDescriptionChange(e.target.value)} className="text-lg text-gray-400 bg-transparent border-none outline-none text-center w-full resize-none placeholder-gray-700 focus:text-gray-300 transition-colors" placeholder="description" rows={3} />
        </div>
    );
}

function BinderPage({ slots, onSlotClick, onDeleteCard }) {
    return (
        <div className="binder-page bg-card rounded-xl p-1.5 grid grid-cols-3 grid-rows-3 gap-1.5 h-full">
            {slots.map((card, i) => (
                <CardSlot key={i} card={card} onClick={() => !card && onSlotClick(i)} onDelete={() => card && onDeleteCard(i)} />
            ))}
        </div>
    );
}
