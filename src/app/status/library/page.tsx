import type { Metadata } from 'next';
import LibraryPage from '@/components/status/LibraryPage/LibraryPage';

export const metadata: Metadata = { title: 'Library' };

export default function Library() {
    return <LibraryPage />;
}
