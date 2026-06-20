'use client';

import { useEffect, useState } from 'react';

import styles from './Title.module.scss';

const TARGET = 'CZHANGY.IO';
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?@#$%&*<>|';
const SCRAMBLE_DURATION = 400;
const STAGGER = 100;

const Title: React.FC = () => {
    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [displayText, setDisplayText] = useState<string>(TARGET);
    const [isResolved, setIsResolved] = useState<boolean>(false);

    // -------------------------------------------------------------------------
    // EFFECTS
    // -------------------------------------------------------------------------

    useEffect(() => {
        let animFrame: number;
        const startTime = performance.now();
        const resolveAt = TARGET.split('').map((_, i) => i * STAGGER + SCRAMBLE_DURATION);

        const animate = (now: number) => {
            const elapsed = now - startTime;
            const resolved: boolean[] = [];

            const next = TARGET.split('')
                .map((char, i) => {
                    if (elapsed >= resolveAt[i]) {
                        resolved.push(true);
                        return char;
                    }
                    resolved.push(false);
                    return CHARS[Math.floor(Math.random() * CHARS.length)];
                })
                .join('');

            setDisplayText(next);

            if (resolved.every(Boolean)) {
                setIsResolved(true);
            } else {
                animFrame = requestAnimationFrame(animate);
            }
        };

        animFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animFrame);
    }, []);

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <h1
            className={`${styles.title} ${isResolved ? styles['title--glitch'] : ''}`}
            data-text={TARGET}
        >
            {displayText}
        </h1>
    );
};

export default Title;
