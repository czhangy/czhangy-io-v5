'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSession } from '@/lib/context/SessionContext';
import HomeIcon from '@/lib/icons/HomeIcon';
import { AUTH_ROUTES, NAV_ITEMS } from '@/lib/utils/shared/constants';
import { NavItem } from '@/lib/utils/shared/types';
import styles from './Navbar.module.scss';

const Navbar: React.FC = () => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const LOGIN_ITEM: NavItem = { href: '/login', label: 'Log In' };
    const REGISTER_ITEM: NavItem = { href: '/register', label: 'Register' };

    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const containerRef = useRef<HTMLDivElement>(null);
    const { isLoggedIn, role } = useSession();

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
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const isProtected = (href: string): boolean =>
        !isLoggedIn && AUTH_ROUTES.some((route) => href.startsWith(route));

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const allItems: NavItem[] = isLoggedIn
        ? role === 'ADMIN'
            ? [...NAV_ITEMS, REGISTER_ITEM]
            : NAV_ITEMS
        : [...NAV_ITEMS, LOGIN_ITEM];

    const badgeLabel: string | null = isLoggedIn
        ? `Logged in as: ${role === 'ADMIN' ? 'ADMIN' : 'USER'}`
        : null;

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
        <div className={styles.navbar}>
            {badgeLabel ? (
                <span className={styles['session-badge']}>{badgeLabel}</span>
            ) : null}
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
                                className={`${styles['menu-item']} ${isProtected(item.href) ? styles['menu-item--disabled'] : ''}`}
                                onClick={handleLinkClick}
                            >
                                {item.label.toUpperCase()}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
