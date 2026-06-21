import type { Metadata } from 'next';
import WipPage from '@/components/wip/WipPage';

export const metadata: Metadata = { title: 'Activity' };

export default function Activity() {
    return <WipPage />;
}
