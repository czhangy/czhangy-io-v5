import type { Metadata } from 'next';
import ArchivesPage from '@/components/status/ArchivesPage/ArchivesPage';

export const metadata: Metadata = { title: 'Archives' };

export default function Archives() {
    return <ArchivesPage />;
}
