'use client';

import { createContext, useContext } from 'react';
import { UserRole } from '@/lib/utils/shared/types';

type SessionContextValue = {
    isLoggedIn: boolean;
    role: UserRole | null;
};

const SessionContext = createContext<SessionContextValue>({
    isLoggedIn: false,
    role: null,
});

export const useSession = () => useContext(SessionContext);

type SessionProviderProps = {
    children: React.ReactNode;
    isLoggedIn: boolean;
    role: UserRole | null;
};

const SessionProvider: React.FC<SessionProviderProps> = ({
    children,
    isLoggedIn,
    role,
}) => (
    <SessionContext.Provider value={{ isLoggedIn, role }}>
        {children}
    </SessionContext.Provider>
);

export default SessionProvider;
