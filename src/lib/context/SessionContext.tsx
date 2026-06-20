'use client';

import { createContext, useContext } from 'react';

type SessionContextValue = {
    isLoggedIn: boolean;
};

const SessionContext = createContext<SessionContextValue>({
    isLoggedIn: false,
});

export const useSession = () => useContext(SessionContext);

type SessionProviderProps = {
    children: React.ReactNode;
    isLoggedIn: boolean;
};

const SessionProvider: React.FC<SessionProviderProps> = ({
    children,
    isLoggedIn,
}) => (
    <SessionContext.Provider value={{ isLoggedIn }}>
        {children}
    </SessionContext.Provider>
);

export default SessionProvider;
