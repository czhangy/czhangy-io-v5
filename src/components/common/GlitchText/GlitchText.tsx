'use client';

import { useEffect, useReducer } from 'react';
import styles from './GlitchText.module.scss';

type GlitchTextProps = {
    text: string;
    className?: string;
};

const GlitchText: React.FC<GlitchTextProps> = ({ text, className }) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    type GlitchTextState = {
        displayText: string;
        isResolved: boolean;
        letterDelays: number[];
    };

    type GlitchTextAction =
        | { type: 'TICK'; text: string }
        | { type: 'RESOLVE'; text: string }
        | { type: 'RESET'; text: string };

    const CHARS: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?@#$%&*<>|';
    const SCRAMBLE_DURATION: number = 400;
    const STAGGER: number = 100;

    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const [{ displayText, isResolved, letterDelays }, dispatch] = useReducer(
        (state: GlitchTextState, action: GlitchTextAction): GlitchTextState => {
            switch (action.type) {
                case 'TICK':
                    return { ...state, displayText: action.text };
                case 'RESOLVE':
                    return {
                        ...state,
                        displayText: action.text,
                        isResolved: true,
                    };
                case 'RESET':
                    return {
                        displayText: action.text,
                        isResolved: false,
                        letterDelays: action.text
                            .split('')
                            .map(() => -(Math.random() * 5)),
                    };
            }
        },
        {
            displayText: text,
            isResolved: false,
            letterDelays: text.split('').map(() => 0),
        }
    );

    // -------------------------------------------------------------------------
    // EFFECTS
    // -------------------------------------------------------------------------

    useEffect(() => {
        dispatch({ type: 'RESET', text });

        let animFrame: number;
        const startTime = performance.now();
        const resolveAt = text
            .split('')
            .map((_, i) => i * STAGGER + SCRAMBLE_DURATION);

        const animate = (now: number) => {
            const elapsed = now - startTime;
            let allResolved = true;

            const next = text
                .split('')
                .map((char, i) => {
                    if (elapsed >= resolveAt[i]) return char;
                    allResolved = false;
                    return CHARS[Math.floor(Math.random() * CHARS.length)];
                })
                .join('');

            if (allResolved) {
                dispatch({ type: 'RESOLVE', text });
            } else {
                dispatch({ type: 'TICK', text: next });
                animFrame = requestAnimationFrame(animate);
            }
        };

        animFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animFrame);
    }, [text]);

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <h1 className={`${styles['glitch-text']} ${className ?? ''}`}>
            {displayText.split('').map((char, i) =>
                char === ' ' ? (
                    <span key={i} className={styles.space}>
                        {' '}
                    </span>
                ) : (
                    <span
                        key={i}
                        data-text={char}
                        className={`${styles.letter} ${isResolved ? styles['letter--active'] : ''}`}
                        style={
                            {
                                '--glitch-delay': `${(letterDelays[i] ?? 0).toString()}s`,
                            } as React.CSSProperties
                        }
                    >
                        {char}
                    </span>
                )
            )}
        </h1>
    );
};

export default GlitchText;
