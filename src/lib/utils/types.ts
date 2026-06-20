export type NavItem = {
    href: string;
    label: string;
};

export type UserRole = 'ADMIN' | 'USER';

export type Session = {
    id: string;
    role: UserRole;
};
