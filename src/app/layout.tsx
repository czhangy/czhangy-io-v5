import Footer from '@/components/layout/Footer/Footer';
import Navbar from '@/components/layout/Navbar/Navbar';
import SessionProvider from '@/lib/context/SessionContext';
import '@/lib/styles/globals.scss';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import AuthHelpers from '@/lib/utils/AuthHelpers';
import { SESSION_COOKIE } from '@/lib/utils/shared/constants';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: {
        template: '%s • czhangy.io',
        default: 'czhangy.io',
    },
    description: "Charles Zhang's personal site",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    const session = token ? await AuthHelpers.verifyToken(token) : null;

    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable}`}
        >
            <body>
                <SessionProvider
                    isLoggedIn={!!session}
                    role={session?.role ?? null}
                >
                    <div className="page-bg" />
                    <Navbar />
                    <main className="page-main">{children}</main>
                    <Footer />
                </SessionProvider>
            </body>
        </html>
    );
}
