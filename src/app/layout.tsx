import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import Background from '@/components/layout/Background/Background';
import GlobalNav from '@/components/layout/GlobalNav/GlobalNav';
import SessionProvider from '@/lib/context/SessionContext';
import '@/lib/styles/globals.scss';
import { verifyToken } from '@/lib/utils/auth';
import { SESSION_COOKIE } from '@/lib/utils/constants';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'czhangy.io',
    description: "Charles Zhang's personal site",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    const session = token ? await verifyToken(token) : null;

    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable}`}
        >
            <body>
                <SessionProvider isLoggedIn={!!session}>
                    <Background />
                    <GlobalNav />
                    {children}
                </SessionProvider>
            </body>
        </html>
    );
}
