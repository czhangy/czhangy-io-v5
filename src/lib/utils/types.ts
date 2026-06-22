export type NavItem = {
    href: string;
    label: string;
};

export type GameEntry = {
    name: string;
    rawgId: number;
};

export type ShowEntry = {
    name: string;
    tvmazeId: number;
};

export type UserRole = 'ADMIN' | 'USER';

export type Session = {
    id: string;
    role: UserRole;
};
