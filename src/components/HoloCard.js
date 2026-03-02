'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useSpring, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getCardEffects } from '@/lib/card-effects';

// Helper for clamping values
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
const round = (num) => Math.round(num * 100) / 100;
const adjust = (value, fromMin, fromMax, toMin, toMax) => {
    return round(toMin + (toMax - toMin) * (value - fromMin) / (fromMax - fromMin));
};

export default function HoloCard({
    card, // Pass the full card object here
    img, // Fallback or direct override
    name,
    number,
    rarity,
    className,
    interactive = false, // Default to static (binder view)
    ...props
}) {
    const cardRef = useRef(null);
    const [isActive, setIsActive] = useState(false);

    // Combine props into a card-like object for the helper if full card not passed
    const cardObj = card || { name, number, rarity, images: { large: img } };
    const effects = getCardEffects(cardObj);

    // Use the passed img or fallback to card object image
    const imageSrc = img || cardObj.images?.large || cardObj.images?.small || "";

    // Springs for smooth animation
    const springConfig = { stiffness: 66, damping: 25 };
    const springRotateX = useSpring(0, springConfig);
    const springRotateY = useSpring(0, springConfig);
    const springGlareX = useSpring(50, springConfig);
    const springGlareY = useSpring(50, springConfig);
    const springBackgroundX = useSpring(50, springConfig);
    const springBackgroundY = useSpring(50, springConfig);

    // CSS Custom Properties State
    const [dynamicStyles, setDynamicStyles] = useState({});

    // Reset function
    const resetSprings = () => {
        springRotateX.set(0);
        springRotateY.set(0);
        springGlareX.set(50);
        springGlareY.set(50);
        springBackgroundX.set(50);
        springBackgroundY.set(50);
        setDynamicStyles(prev => ({ ...prev, '--card-opacity': '0' }));
    };

    useEffect(() => {
        if (!interactive) return;

        // Sync springs to CSS variables
        const unsubscribeRotateX = springRotateX.on("change", v => {
            setDynamicStyles(prev => ({ ...prev, '--rotate-x': `${v}deg` }));
        });
        const unsubscribeRotateY = springRotateY.on("change", v => {
            setDynamicStyles(prev => ({ ...prev, '--rotate-y': `${v}deg` }));
        });
        const unsubscribeGlareX = springGlareX.on("change", v => {
            setDynamicStyles(prev => ({ ...prev, '--pointer-x': `${v}%`, '--pointer-from-left': v / 100 }));
        });
        const unsubscribeGlareY = springGlareY.on("change", v => {
            setDynamicStyles(prev => ({ ...prev, '--pointer-y': `${v}%`, '--pointer-from-top': v / 100 }));
        });
        const unsubscribeBgX = springBackgroundX.on("change", v => {
            setDynamicStyles(prev => ({ ...prev, '--background-x': `${v}%` }));
        });
        const unsubscribeBgY = springBackgroundY.on("change", v => {
            setDynamicStyles(prev => ({ ...prev, '--background-y': `${v}%` }));
        });

        return () => {
            unsubscribeRotateX();
            unsubscribeRotateY();
            unsubscribeGlareX();
            unsubscribeGlareY();
            unsubscribeBgX();
            unsubscribeBgY();
        };
    }, [interactive, springRotateX, springRotateY, springGlareX, springGlareY, springBackgroundX, springBackgroundY]);

    const handlePointerMove = (e) => {
        if (!interactive || !cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const absolute = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };

        const percent = {
            x: clamp(round((100 / rect.width) * absolute.x), 0, 100),
            y: clamp(round((100 / rect.height) * absolute.y), 0, 100),
        };

        const center = {
            x: percent.x - 50,
            y: percent.y - 50,
        };

        // Update springs based on logic from pokemon-cards-css
        springRotateX.set(round(-(center.y / 3.5)));
        springRotateY.set(round(center.x / 3.5));

        springGlareX.set(percent.x);
        springGlareY.set(percent.y);

        // Background movement
        springBackgroundX.set(adjust(percent.x, 0, 100, 37, 63));
        springBackgroundY.set(adjust(percent.y, 0, 100, 33, 67));

        setDynamicStyles(prev => ({
            ...prev,
            '--card-opacity': '1',
            '--pointer-from-center': clamp(Math.sqrt((percent.y - 50) ** 2 + (percent.x - 50) ** 2) / 50, 0, 1)
        }));
    };

    const handlePointerLeave = () => {
        if (!interactive) return;
        resetSprings();
    };

    // If static, render a simpler version to save perf and ensure no effects
    if (!interactive) {
        return (
            <div className={cn("relative w-full h-full rounded-xl overflow-hidden", className)} {...props}>
                <img
                    src={imageSrc}
                    alt={cardObj.name || "Pokemon Card"}
                    className="w-full h-full object-contain"
                    loading="lazy"
                />
            </div>
        );
    }

    return (
        <div
            className={cn("card relative select-none", className)}
            ref={cardRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            style={dynamicStyles}
            {...effects.attrs}
            {...props}
        >
            <div className="card__translater">
                <div className="card__rotator">
                    <div className="card__front">
                        <img
                            src={imageSrc}
                            alt={cardObj.name || "Pokemon Card"}
                            className="w-full h-full object-contain"
                            loading="lazy"
                            onDragStart={(e) => e.preventDefault()}
                        />
                        <div className="card__shine" />
                        <div className="card__glare" />
                    </div>
                </div>
            </div>
        </div>
    );
}
