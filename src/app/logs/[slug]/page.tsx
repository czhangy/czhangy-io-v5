import type { Metadata } from 'next';
import LogPage from '@/components/log/LogPage';

export const metadata: Metadata = { title: 'Log' };

type LogDetailProps = {
    params: Promise<{ slug: string }>;
};

export default async function LogDetail({ params }: LogDetailProps) {
    const { slug } = await params;
    return <LogPage slug={slug} />;
}
