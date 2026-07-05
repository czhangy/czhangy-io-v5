import type { Metadata } from 'next';
import ArchivesPage from '@/components/archives/ArchivesPage';

export const metadata: Metadata = { title: 'Archives' };

export default function Archives() {
    return <ArchivesPage />;
}
