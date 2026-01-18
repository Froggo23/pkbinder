'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useSpring, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Helper for clamping values
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
const round = (num) => Math.round(num * 100) / 100;

export default function HoloCard({
    img,
    name,
    number,
    rarity = "rare holo", // Default to holo for effect demonstration
    className,
    ...props
}) {
    const cardRef = useRef(null);
    const [isActive, setIsActive] = useState(false);

    // Springs for smooth animation
    const springRotateX = useSpring(0, { stiffness: 150, damping: 30 });
    const springRotateY = useSpring(0, { stiffness: 150, damping: 30 });
    const springGlareX = useSpring(50, { stiffness: 150, damping: 30 });
    const springGlareY = useSpring(50, { stiffness: 150, damping: 30 });
    const springBackgroundX = useSpring(50, { stiffness: 150, damping: 30 });
    const springBackgroundY = useSpring(50, { stiffness: 150, damping: 30 });

    // CSS Custom Properties State
    const [dynamicStyles, setDynamicStyles] = useState({});

    useEffect(() => {
        // Sync springs to CSS variables
        const unsubscribeRotateX = springRotateX.on("change", v => {
            setDynamicStyles(prev => ({ ...prev, '--rotate-x': `${v}deg` }));
        });
        const unsubscribeRotateY = springRotateY.on("change", v => {
            setDynamicStyles(prev => ({ ...prev, '--rotate-y': `${v}deg` }));
        });
        const unsubscribeGlareX = springGlareX.on("change", v => {
            setDynamicStyles(prev => ({ ...prev, '--pointer-x': `${v}%` }));
        });
        const unsubscribeGlareY = springGlareY.on("change", v => {
            setDynamicStyles(prev => ({ ...prev, '--pointer-y': `${v}%` }));
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
    }, [springRotateX, springRotateY, springGlareX, springGlareY, springBackgroundX, springBackgroundY]);

    const handlePointerMove = (e) => {
        if (!cardRef.current) return;

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

        // Update springs
        springRotateX.set(round(-(center.y / 3.5)));
        springRotateY.set(round(center.x / 3.5));

        springGlareX.set(percent.x);
        springGlareY.set(percent.y);

        springBackgroundX.set(50 + (center.x * 2.5)); // Adjusted for more noticeable effect
        springBackgroundY.set(50 + (center.y * 2.5));

        setDynamicStyles(prev => ({ ...prev, '--card-opacity': '1' }));
    };

    const handlePointerLeave = () => {
        // Reset to center
        springRotateX.set(0);
        springRotateY.set(0);
        springGlareX.set(50);
        springGlareY.set(50);
        springBackgroundX.set(50);
        springBackgroundY.set(50);
        setDynamicStyles(prev => ({ ...prev, '--card-opacity': '0' }));
    };

    return (
        <div
            className={cn("holo-card relative w-full h-full", className)}
            ref={cardRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            data-rarity={rarity}
            style={dynamicStyles}
            {...props}
        >
            <div className="holo-card__translater">
                <div className="holo-card__rotator">
                    <div className="holo-card__front">
                        <img
                            src={img}
                            alt={name || "Pokemon Card"}
                            className="w-full h-full object-contain"
                            loading="lazy"
                        />
                        <div className="holo-card__shine" />
                        <div className="holo-card__glare" />
                    </div>
                </div>
            </div>
        </div>
    );
}
