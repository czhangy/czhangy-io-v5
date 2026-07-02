'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/context/SessionContext';
import LockIcon from '@/lib/icons/LockIcon';
import { AUTH_ROUTES, NAV_ITEMS } from '@/lib/utils/shared/constants';
import { Key } from '@/lib/utils/shared/enums';
import { NavItem } from '@/lib/utils/shared/types';
import styles from './NavMenu.module.scss';

const NavMenu: React.FC = () => {
    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const router = useRouter();
    const { isLoggedIn, role } = useSession();

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [activeIndex, setActiveIndex] = useState<number>(0);

    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const allItems = useMemo<NavItem[]>(() => {
        if (!isLoggedIn)
            return [...NAV_ITEMS, { href: '/login', label: 'Log In' }];
        if (role === 'ADMIN')
            return [...NAV_ITEMS, { href: '/register', label: 'Register' }];
        return NAV_ITEMS;
    }, [isLoggedIn, role]);

    const isProtected = (href: string): boolean =>
        !isLoggedIn && AUTH_ROUTES.some((route) => href.startsWith(route));

    // -------------------------------------------------------------------------
    // EFFECTS
    // -------------------------------------------------------------------------

    useEffect(() => {
        const checkProtected = (href: string) =>
            !isLoggedIn && AUTH_ROUTES.some((r) => href.startsWith(r));

        const step = (dir: 1 | -1) => {
            setActiveIndex((prev) => {
                let next = (prev + dir + allItems.length) % allItems.length;
                while (checkProtected(allItems[next].href) && next !== prev) {
                    next = (next + dir + allItems.length) % allItems.length;
                }
                return next;
            });
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === Key.Enter) {
                const { href } = allItems[activeIndex];
                if (!checkProtected(href)) router.push(href);
            } else if (e.key === Key.Down || e.key === Key.S) {
                e.preventDefault();
                step(1);
            } else if (e.key === Key.Up || e.key === Key.W) {
                e.preventDefault();
                step(-1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeIndex, router, allItems, isLoggedIn]);

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <nav className={styles['nav-menu']}>
            {allItems.map((item, index) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles['nav-item']} ${index === activeIndex ? styles['nav-item--active'] : ''} ${isProtected(item.href) ? styles['nav-item--disabled'] : ''}`}
                    onMouseEnter={() => {
                        if (!isProtected(item.href)) setActiveIndex(index);
                    }}
                >
                    <span className={styles['nav-item__cursor']}>{'>'}</span>
                    <span>{item.label.toUpperCase()}</span>
                    {isProtected(item.href) ? (
                        <span className={styles['nav-item__lock']}>
                            <LockIcon />
                        </span>
                    ) : null}
                </Link>
            ))}
        </nav>
    );
};

export default NavMenu;
