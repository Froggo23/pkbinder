'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const router = useRouter();

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push('/');
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                    },
                });
                if (error) throw error;
                alert('Check your email for the confirmation link!');
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 50, 0],
                        y: [0, 30, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        x: [0, -40, 0],
                        y: [0, -50, 0]
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[120px]"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10"
            >
                <div className="bg-zinc-900/50 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center p-3 bg-primary/20 rounded-2xl mb-4">
                            <Sparkles className="text-primary w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">
                            {isLogin ? 'Welcome Back' : 'Join pkbinder'}
                        </h1>
                        <p className="text-zinc-400 mt-2">
                            {isLogin
                                ? 'Your card collection awaits.'
                                : 'Start building your professional binder today.'}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="relative"
                                >
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        required
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group transition-all"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-zinc-500 text-sm">
                        {isLogin ? (
                            <p>
                                Don&apos;t have an account?{' '}
                                <button
                                    onClick={() => setIsLogin(false)}
                                    className="text-primary font-medium hover:underline"
                                >
                                    Sign Up
                                </button>
                            </p>
                        ) : (
                            <p>
                                Already have an account?{' '}
                                <button
                                    onClick={() => setIsLogin(true)}
                                    className="text-primary font-medium hover:underline"
                                >
                                    Sign In
                                </button>
                            </p>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
