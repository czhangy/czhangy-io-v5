import type { Metadata } from 'next';
import CareerPage from '@/components/career/CareerPage/CareerPage';

export const metadata: Metadata = { title: 'Career' };

export default function Career() {
    return <CareerPage />;
}
