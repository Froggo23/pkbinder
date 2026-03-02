'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import HoloCard from '@/components/HoloCard';

export default function InspectModal({ card, isOpen, onClose }) {
    if (!isOpen || !card) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the card itself
                    className="relative w-full max-w-[400px] aspect-[0.718] flex items-center justify-center"
                >
                    <HoloCard
                        card={card}
                        img={card.image}
                        name={card.name}
                        interactive={true}
                        className="w-full h-full shadow-2xl"
                    />
                </motion.div>

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                    <X size={24} />
                </button>
            </motion.div>
        </AnimatePresence>
    );
}
