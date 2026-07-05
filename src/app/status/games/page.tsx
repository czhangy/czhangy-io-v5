import type { Metadata } from 'next';
import GamesPage from '@/components/games/GamesPage';

export const metadata: Metadata = { title: 'Games' };

export default function Games() {
    return <GamesPage />;
}
