import type { Metadata } from 'next';
import WipPage from '@/components/wip/WipPage';

export const metadata: Metadata = { title: 'Log' };

export default function LogDetail() {
    return <WipPage />;
}
