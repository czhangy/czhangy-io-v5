import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Background from '@/components/layout/Background/Background';
import GlobalNav from '@/components/layout/GlobalNav/GlobalNav';
import '@/lib/styles/globals.scss';

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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable}`}
        >
            <body>
                <Background />
                <GlobalNav />
                {children}
            </body>
        </html>
    );
}
