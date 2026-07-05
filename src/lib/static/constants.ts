import { NavItem } from './types';

export const SESSION_COOKIE = 'session';

// Milestones
export const WATCHED_MILESTONES = [
    { count: 50, name: 'Amateur Critic', tier: 3 },
    { count: 250, name: 'Dedicated Critic', tier: 2 },
    { count: 500, name: 'Professional Critic', tier: 1 },
];
export const READ_MILESTONES = [
    { count: 50, name: 'Amateur Reader', tier: 3 },
    { count: 250, name: 'Dedicated Reader', tier: 2 },
    { count: 500, name: 'Professional Reader', tier: 1 },
];
export const GAME_MILESTONES = [
    { count: 50, name: 'Amateur Gamer', tier: 3 },
    { count: 250, name: 'Dedicated Gamer', tier: 2 },
    { count: 500, name: 'Professional Gamer', tier: 1 },
];

// Games
export const GAME_GENRES: string[] = [
    'ARPG',
    'Action Adventure',
    'Adventure',
    'Adventure Platformer',
    'Battle Royale',
    "Beat 'Em Up",
    'Education',
    'FPS',
    'Graphic Adventure',
    'Hero Shooter',
    'Horror',
    'Idle',
    'Looter Shooter',
    'MMORPG',
    'Management Sim',
    'Metroidvania',
    'Narrative',
    'Party',
    'Platformer',
    'Point-and-Click',
    'Psychological Thriller',
    'Puzzle',
    'Puzzle Adventure',
    'Puzzle Platformer',
    'RPG',
    'Racing',
    'Roguelike',
    'Roguelike Deckbuilder',
    'Sandbox',
    'Simulator',
    'Soulslike',
    'Survival',
    'Tower Defense',
];

// Cardistry
export const CARDISTRY_MOVE_TYPES: string[] = [
    '1H Cut',
    '2H Cut',
    'Twirl',
    'Aerial',
    'Spread',
    'Isolation',
    'Display',
    'Shuffle',
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
