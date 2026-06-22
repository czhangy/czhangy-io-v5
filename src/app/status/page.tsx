import type { Metadata } from 'next';
import WipPage from '@/components/wip/WipPage';

export const metadata: Metadata = { title: 'Status' };

export default function Status() {
    return <WipPage />;
}
