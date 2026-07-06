import type { Metadata } from 'next';
import WipPage from '@/components/wip/WipPage';

export const metadata: Metadata = { title: 'New Log' };

export default function NewLog() {
    return <WipPage />;
}
