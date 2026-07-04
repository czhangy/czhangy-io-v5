import type { Metadata } from 'next';
import CardistryPage from '@/components/status/CardistryPage/CardistryPage';

export const metadata: Metadata = { title: 'Cardistry' };

export default function Cardistry() {
    return <CardistryPage />;
}
