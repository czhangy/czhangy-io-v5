import { NavItem } from './types';

export const SESSION_COOKIE = 'session';

export const AUTH_ROUTES = ['/logs'];

export const NAV_ITEMS: NavItem[] = [
    { href: '/logs', label: 'Logs' },
    { href: '/activity', label: 'Activity' },
    { href: '/career', label: 'Career' },
    { href: '/achievements', label: 'Achievements' },
];
