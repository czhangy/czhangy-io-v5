'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { NAV_ITEMS } from '@/lib/utils';
import styles from './GlobalNav.module.scss';

const GlobalNav: React.FC = () => {
    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const containerRef = useRef<HTMLDivElement>(null);

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [isOpen, setIsOpen] = useState<boolean>(false);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleToggle = () => setIsOpen((prev) => !prev);

    const handleLinkClick = () => setIsOpen(false);

    // -------------------------------------------------------------------------
    // EFFECTS
    // -------------------------------------------------------------------------

    useEffect(() => {
        if (!isOpen) return;

        const handleOutsideClick = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };

        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div ref={containerRef} className={styles['global-nav']}>
            <button
                type="button"
                className={`${styles['nav-toggle']} ${isOpen ? styles['nav-toggle--open'] : ''}`}
                onClick={handleToggle}
            >
                <span className={styles.bar} />
                <span className={styles.bar} />
                <span className={styles.bar} />
            </button>
            {isOpen ? (
                <nav className={styles.menu}>
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={styles['menu-item']}
                            onClick={handleLinkClick}
                        >
                            {item.label.toUpperCase()}
                        </Link>
                    ))}
                </nav>
            ) : null}
        </div>
    );
};

export default GlobalNav;
