import type { Metadata } from 'next';
import CardistryPage from '@/components/cardistry/CardistryPage';

export const metadata: Metadata = { title: 'Carding' };

export default function Cardistry() {
    return <CardistryPage />;
}
