'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSession } from '@/lib/context/SessionContext';
import HomeIcon from '@/lib/icons/HomeIcon';
import { NAV_ITEMS, NavItem } from '@/lib/utils';
import styles from './GlobalNav.module.scss';

const LOGIN_ITEM = { href: '/login', label: 'Login' };

const GlobalNav: React.FC = () => {
    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const containerRef = useRef<HTMLDivElement>(null);
    const { isLoggedIn } = useSession();

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
    // RENDERING
    // -------------------------------------------------------------------------

    const allItems: NavItem[] = isLoggedIn
        ? NAV_ITEMS
        : [...NAV_ITEMS, LOGIN_ITEM];

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
            <Link href="/" className={styles['home-link']}>
                <HomeIcon />
            </Link>
            <div className={styles['nav-wrapper']}>
                <button
                    type="button"
                    className={`${styles['nav-toggle']} ${isOpen ? styles['nav-toggle--open'] : ''}`}
                    onClick={handleToggle}
                >
                    <span className={styles.bar} />
                    <span className={styles.bar} />
                    <span className={styles.bar} />
                </button>
                <nav
                    className={`${styles.menu} ${isOpen ? styles['menu--open'] : ''}`}
                >
                    {allItems.map((item) => (
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
            </div>
        </div>
    );
};

export default GlobalNav;
