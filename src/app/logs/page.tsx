import type { Metadata } from 'next';
import LogsPage from '@/components/logs/LogsPage';

export const metadata: Metadata = { title: 'Logs' };

export default function Logs() {
    return <LogsPage />;
}
