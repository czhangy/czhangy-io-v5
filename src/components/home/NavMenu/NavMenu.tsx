'use client';

import { useState } from 'react';
import Link from 'next/link';

import styles from './NavMenu.module.scss';

interface NavItem {
    href: string;
    label: string;
}

const NAV_ITEMS: NavItem[] = [
    { href: '/page-1', label: 'Page 1' },
    { href: '/page-2', label: 'Page 2' },
    { href: '/page-3', label: 'Page 3' },
];

const NavMenu: React.FC = () => {
    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [activeIndex, setActiveIndex] = useState<number>(0);

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <nav className={styles['nav-menu']}>
            {NAV_ITEMS.map((item, index) => (
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
