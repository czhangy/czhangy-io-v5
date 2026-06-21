import type { Metadata } from 'next';
import WipPage from '@/components/wip/WipPage';

export const metadata: Metadata = { title: 'Logs' };

export default function Logs() {
    return <WipPage />;
}
