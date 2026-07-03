'use client';

import Link from 'next/link';
import { useSession } from '@/lib/context/SessionContext';
import LockIcon from '@/lib/icons/LockIcon';
import { NavItem } from '@/lib/static/types';
import AuthHelpers from '@/lib/utils/AuthHelpers';
import styles from './NavMenu.module.scss';

const NavMenu: React.FC = () => {
    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const { isLoggedIn, role } = useSession();

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const allItems: NavItem[] = AuthHelpers.computeNavItems(isLoggedIn, role);

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <nav className={styles['nav-menu']}>
            {allItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles['nav-item']} ${!isLoggedIn && AuthHelpers.isProtectedRoute(item.href) ? styles['nav-item--disabled'] : ''}`}
                >
                    <span className={styles['nav-item__cursor']}>{'>'}</span>
                    <span>{item.label.toUpperCase()}</span>
                    {!isLoggedIn && AuthHelpers.isProtectedRoute(item.href) ? (
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
