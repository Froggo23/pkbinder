'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Layout, Loader2, LogOut, ChevronRight, Book } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// --- Dashboard Component ---

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [binders, setBinders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Create Modal State
    const [newBinderTitle, setNewBinderTitle] = useState('');
    const [newBinderDesc, setNewBinderDesc] = useState('');

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const currentUser = session?.user || null;
            setUser(currentUser);

            if (currentUser) {
                fetchBinders(currentUser.id);
            } else {
                setIsLoading(false);
            }
        };

        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
            if (session?.user) {
                fetchBinders(session.user.id);
            } else {
                setBinders([]);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchBinders = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('binders')
                .select('*')
                .eq('user_id', userId)
                .order('updated_at', { ascending: false });

            if (error) throw error;
            setBinders(data || []);
        } catch (error) {
            console.error('Error fetching binders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateBinder = async () => {
        if (!newBinderTitle.trim()) return;
        setIsCreating(true);

        try {
            const newBinder = {
                user_id: user.id,
                title: newBinderTitle,
                description: newBinderDesc,
                data: [{ id: 0, slots: Array(9).fill(null) }],
                updated_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('binders')
                .insert([newBinder])
                .select()
                .single();

            if (error) throw error;

            setShowCreateModal(false);
            setNewBinderTitle('');
            setNewBinderDesc('');
            router.push(`/binder/${data.id}`);
        } catch (error) {
            console.error('Error creating binder:', error);
            alert('Failed to create binder. Please try again.');
        } finally {
            setIsCreating(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setBinders([]);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Header */}
            <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-background/50 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 cursor-pointer">
                            pkbinder
                        </span>
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary-foreground font-bold text-xs border border-primary/30">
                                {user.email?.[0].toUpperCase()}
                            </div>
                            <button onClick={handleSignOut} className="p-2 hover:bg-secondary rounded-full text-muted-foreground hover:text-foreground transition-colors" title="Sign Out">
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <Link href="/auth">
                            <button className="h-9 px-4 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors shadow-[0_0_15px_-3px_var(--primary)]">
                                Sign In
                            </button>
                        </Link>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto p-4 md:p-8 max-w-5xl">
                {!user ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                            Organize Your Collection
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-lg">
                            Create beautiful virtual binders for your Pokémon cards. Track, organize, and share your collection.
                        </p>
                        <Link href="/auth">
                            <button className="h-12 px-8 rounded-full bg-primary text-white text-lg font-medium hover:bg-primary/90 transition-all hover:scale-105 shadow-[0_0_20px_-5px_var(--primary)]">
                                Get Started
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Layout className="text-primary" />
                                My Binders
                            </h2>
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium px-3 py-1 rounded-full bg-secondary text-secondary-foreground border border-white/5">
                                    {binders.length} / 2 Binders
                                </span>
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    disabled={binders.length >= 2}
                                    className={cn(
                                        "h-9 px-4 rounded-full flex items-center gap-2 text-sm font-medium transition-all",
                                        binders.length >= 2
                                            ? "bg-secondary text-muted-foreground cursor-not-allowed opacity-50"
                                            : "bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-primary/25"
                                    )}
                                >
                                    <Plus size={16} />
                                    New Binder
                                </button>
                            </div>
                        </div>

                        {binders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-xl bg-card/10">
                                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                                    <Book size={24} className="text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-medium mb-1">No binders yet</h3>
                                <p className="text-muted-foreground mb-6">Create your first binder to start collecting.</p>
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="h-9 px-4 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
                                >
                                    Create Binder
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {binders.map((binder) => (
                                    <Link key={binder.id} href={`/binder/${binder.id}`}>
                                        <motion.div
                                            whileHover={{ y: -4, scale: 1.01 }}
                                            className="group relative bg-card hover:bg-card/80 border border-border rounded-xl p-6 transition-all shadow-sm hover:shadow-md cursor-pointer overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                                <ChevronRight className="text-primary" />
                                            </div>
                                            <div className="space-y-4">
                                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                                    <Book className="text-primary" size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors line-clamp-1">{binder.title || 'Untitled Binder'}</h3>
                                                    <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                                                        {binder.description || 'No description'}
                                                    </p>
                                                </div>
                                                <div className="pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                                                    <span>Last updated</span>
                                                    <span>{new Date(binder.updated_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Create Binder Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 space-y-6">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Create New Binder</h3>
                                    <p className="text-sm text-muted-foreground">Give your binder a title and description to get started.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Title</label>
                                        <input
                                            type="text"
                                            value={newBinderTitle}
                                            onChange={(e) => setNewBinderTitle(e.target.value)}
                                            placeholder="e.g., Rare Holos"
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-primary/50 transition-colors"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Description</label>
                                        <textarea
                                            value={newBinderDesc}
                                            onChange={(e) => setNewBinderDesc(e.target.value)}
                                            placeholder="What's in this binder?"
                                            rows={3}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <button
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1 h-10 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCreateBinder}
                                        disabled={!newBinderTitle.trim() || isCreating}
                                        className="flex-1 h-10 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isCreating && <Loader2 size={16} className="animate-spin" />}
                                        Create Binder
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
