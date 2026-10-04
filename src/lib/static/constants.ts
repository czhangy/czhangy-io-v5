import { NavItem } from './types';

export const SESSION_COOKIE = 'session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
export const SESSION_REFRESH_AFTER = 60 * 60 * 24;
export const LOG_DRAFT_ID = 'draft';

// Projects
export const PROJECT_STATUSES: string[] = [
    'Live',
    'In Development',
    'Archived',
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
    'Rhythm',
].sort();

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
    'Flourish',
    'Sleight',
];

// Routes
export const AUTH_ROUTES = ['/logs'];
export const ADMIN_ROUTES = ['/register', '/logs/new'];
export const ADMIN_ROUTE_PATTERNS = [/^\/logs\/[^/]+\/edit$/];
export const NAV_ITEMS: NavItem[] = [
    { href: '/status', label: 'Status' },
    { href: '/career', label: 'Career' },
    { href: '/projects', label: 'Projects' },
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
