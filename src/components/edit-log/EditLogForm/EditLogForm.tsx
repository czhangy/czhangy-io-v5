'use client';

import { useRouter } from 'next/navigation';
import LogForm from '@/components/logs/LogForm/LogForm';
import { CreateLogParams, Log } from '@/lib/static/types';

type EditLogFormProps = {
    entry: Log;
};

const EditLogForm: React.FC<EditLogFormProps> = ({ entry }) => {
    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const router = useRouter();

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleSubmit = async (values: CreateLogParams): Promise<void> => {
        const res = await fetch(`/api/logs/${entry.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        });
        if (!res.ok) {
            const data = (await res.json().catch(() => ({}))) as {
                error?: string;
            };
            throw new Error(data.error ?? 'Failed to save log.');
        }
        router.push(`/logs/${entry.slug}`);
    };

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <LogForm
            submitLabel="Save"
            initialValues={{
                title: entry.title,
                tags: entry.tags,
                body: entry.body,
            }}
            onSubmit={handleSubmit}
        />
    );
};

export default EditLogForm;
