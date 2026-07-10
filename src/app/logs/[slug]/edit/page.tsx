import type { Metadata } from 'next';
import EditLogPage from '@/components/edit-log/EditLogPage';

export const metadata: Metadata = { title: 'Edit Log' };

type EditLogRouteProps = {
    params: Promise<{ slug: string }>;
};

export default async function EditLog({ params }: EditLogRouteProps) {
    const { slug } = await params;
    return <EditLogPage slug={slug} />;
}
