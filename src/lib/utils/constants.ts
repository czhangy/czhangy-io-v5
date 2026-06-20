import { NavItem } from './types';

export const SESSION_COOKIE = 'session';

export const AUTH_ROUTES = ['/logs'];

export const ADMIN_ROUTES = ['/register'];

export const NAV_ITEMS: NavItem[] = [
    { href: '/activity', label: 'Activity' },
    { href: '/career', label: 'Career' },
    { href: '/achievements', label: 'Achievements' },
    { href: '/logs', label: 'Logs' },
];
