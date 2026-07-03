import { NavItem } from './types';

export const SESSION_COOKIE = 'session';

// Milestones
export const WATCHED_MILESTONES = [
    { count: 50, name: 'Amateur Critic', tier: 1 },
    { count: 250, name: 'Dedicated Critic', tier: 2 },
    { count: 500, name: 'Professional Critic', tier: 3 },
];

// Routes
export const AUTH_ROUTES = ['/logs'];
export const ADMIN_ROUTES = ['/register'];
export const NAV_ITEMS: NavItem[] = [
    { href: '/status', label: 'Status' },
    { href: '/career', label: 'Career' },
    { href: '/achievements', label: 'Achievements' },
    { href: '/logs', label: 'Logs' },
];
export const LOGGED_OUT_NAV_ITEMS: NavItem[] = [
    ...NAV_ITEMS,
    { href: '/login', label: 'Log In' },
];
export const ADMIN_NAV_ITEMS: NavItem[] = [
    ...NAV_ITEMS,
    { href: '/register', label: 'Register' },
];
