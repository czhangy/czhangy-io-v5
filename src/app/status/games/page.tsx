import type { Metadata } from 'next';
import GamesPage from '@/components/status/GamesPage/GamesPage';

export const metadata: Metadata = { title: 'Games' };

export default function Games() {
    return <GamesPage />;
}
