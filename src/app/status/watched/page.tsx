import type { Metadata } from 'next';
import WatchedPage from '@/components/status/WatchedPage/WatchedPage';

export const metadata: Metadata = { title: 'Watched' };

export default function Watched() {
    return <WatchedPage />;
}
