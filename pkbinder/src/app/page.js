'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Grid, Layout, Settings, Share2, Plus, Filter, Menu, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockCards } from '@/data/mockCards';
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

const CardSlot = ({ card, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "aspect-[2.5/3.5] rounded-lg overflow-hidden relative group transition-all duration-300",
        !card && "card-slot-empty hover:bg-secondary/30 cursor-pointer"
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
        </motion.div>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground/30 group-hover:text-muted-foreground/60">
          <Plus size={24} />
        </div>
      )}
    </div>
  );
};

const BinderPage = ({ cards = [], onSlotClick }) => {
  // Fill grid to 9 slots for demo
  const slots = [...cards, ...Array(9 - cards.length).fill(null)].slice(0, 9);

  return (
    <div className="binder-page bg-card rounded-xl p-4 md:p-6 grid grid-cols-3 gap-3 md:gap-4 h-full">
      {slots.map((card, i) => (
        <CardSlot key={i} card={card} onClick={() => !card && onSlotClick(i)} />
      ))}
    </div>
  );
};

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePageOneCards, setActivePageOneCards] = useState(mockCards.slice(0, 5));
  const [activePageTwoCards, setActivePageTwoCards] = useState(mockCards.slice(5, 9));
  const [currentAddingPage, setCurrentAddingPage] = useState(null); // 1 or 2

  const handleSlotClick = (pageNumber) => {
    setCurrentAddingPage(pageNumber);
    setIsModalOpen(true);
  };

  const handleAddCards = (newCards) => {
    if (currentAddingPage === 1) {
      setActivePageOneCards([...activePageOneCards, ...newCards]);
    } else {
      setActivePageTwoCards([...activePageTwoCards, ...newCards]);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AddCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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
          <div className="h-9 relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              placeholder="Search collection..."
              className="h-full w-64 bg-secondary/50 border-none rounded-full pl-9 pr-4 text-sm focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

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

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8 flex justify-center bg-black/50">

          <div className="max-w-6xl w-full flex flex-col md:flex-row gap-0 h-[85vh] shadow-2xl relative">
            {/* Left Page */}
            <div className="flex-1 rounded-l-2xl overflow-hidden bg-zinc-900 border-y border-l border-zinc-800 relative z-10">
              <div className="h-full p-2">
                <BinderPage
                  cards={activePageOneCards}
                  onSlotClick={() => handleSlotClick(1)}
                />
              </div>
            </div>

            {/* Spine */}
            <div className="w-12 md:w-16 binder-spine relative z-20 flex-shrink-0 flex flex-col items-center justify-center gap-12 border-y border-zinc-800">
              {/* Binder Rings */}
              {[1, 2, 3].map(i => (
                <div key={i} className="w-full h-4 bg-zinc-800 shadow-inner relative overflow-hidden">
                  <div className="absolute inset-x-0 top-1.5 h-1 bg-zinc-950/50 rounded-full" />
                </div>
              ))}
            </div>

            {/* Right Page */}
            <div className="flex-1 rounded-r-2xl overflow-hidden bg-zinc-900 border-y border-r border-zinc-800 relative z-10">
              <div className="h-full p-2">
                <BinderPage
                  cards={activePageTwoCards}
                  onSlotClick={() => handleSlotClick(2)}
                />
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
