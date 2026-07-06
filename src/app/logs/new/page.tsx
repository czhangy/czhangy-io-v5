import type { Metadata } from 'next';
import NewLogPage from '@/components/new-log/NewLogPage';

export const metadata: Metadata = { title: 'New Log' };

export default function NewLog() {
    return <NewLogPage />;
}
