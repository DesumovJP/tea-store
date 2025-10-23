"use client";

import { useState } from 'react';

let globalCartAnimationTrigger: (() => void) | null = null;

export const useCartAnimation = () => {
    const [isAnimating, setIsAnimating] = useState(false);

    const triggerAnimation = () => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 600);
    };

    return { isAnimating, triggerAnimation };
};

export const setGlobalCartAnimationTrigger = (trigger: (() => void) | null) => {
    globalCartAnimationTrigger = trigger;
};

export const triggerGlobalCartAnimation = () => {
    if (globalCartAnimationTrigger) {
        globalCartAnimationTrigger();
    }
};
