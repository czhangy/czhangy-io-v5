'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/context/SessionContext';
import { NAV_ITEMS } from '@/lib/utils';
import styles from './NavMenu.module.scss';

const LOGIN_ITEM = { href: '/login', label: 'Login' };

const NavMenu: React.FC = () => {
    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const router = useRouter();
    const { isLoggedIn } = useSession();

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [activeIndex, setActiveIndex] = useState<number>(0);

    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const allItems = useMemo(
        () => (isLoggedIn ? NAV_ITEMS : [...NAV_ITEMS, LOGIN_ITEM]),
        [isLoggedIn]
    );

    // -------------------------------------------------------------------------
    // EFFECTS
    // -------------------------------------------------------------------------

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                router.push(allItems[activeIndex].href);
            } else if (e.key === 'ArrowDown' || e.key === 's') {
                e.preventDefault();
                setActiveIndex((prev) => (prev + 1) % allItems.length);
            } else if (e.key === 'ArrowUp' || e.key === 'w') {
                e.preventDefault();
                setActiveIndex(
                    (prev) => (prev - 1 + allItems.length) % allItems.length
                );
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeIndex, router, allItems]);

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <nav className={styles['nav-menu']}>
            {allItems.map((item, index) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles['nav-item']} ${index === activeIndex ? styles['nav-item--active'] : ''}`}
                    onMouseEnter={() => setActiveIndex(index)}
                >
                    <span className={styles['nav-item__cursor']}>{'>'}</span>
                    <span>{item.label.toUpperCase()}</span>
                </Link>
            ))}
        </nav>
    );
};

export default NavMenu;
