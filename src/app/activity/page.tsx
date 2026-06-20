import type { Metadata } from 'next';
import WipPage from '@/components/wip/WipPage/WipPage';

export const metadata: Metadata = { title: 'Activity' };

export default function Activity() {
    return <WipPage />;
}
