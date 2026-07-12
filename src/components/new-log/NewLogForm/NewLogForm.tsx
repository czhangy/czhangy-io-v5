'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import LogForm from '@/components/logs/LogForm/LogForm';
import { CreateLogParams } from '@/lib/static/types';

type NewLogFormProps = {
    initialValues?: Partial<CreateLogParams>;
};

const NewLogForm: React.FC<NewLogFormProps> = ({ initialValues }) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const AUTOSAVE_INTERVAL_MS = 60 * 1000;

    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const router = useRouter();

    const draftRef = useRef<CreateLogParams>({
        title: initialValues?.title ?? '',
        tags: initialValues?.tags ?? [],
        body: initialValues?.body ?? '',
    });

    const handleChange = useCallback((values: CreateLogParams): void => {
        draftRef.current = values;
    }, []);

    // -------------------------------------------------------------------------
    // EFFECTS
    // -------------------------------------------------------------------------

    useEffect(() => {
        const intervalId = setInterval(() => {
            const { title, body } = draftRef.current;
            if (!title.trim() && !body.trim()) return;

            void fetch('/api/logs/draft', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(draftRef.current),
            });
        }, AUTOSAVE_INTERVAL_MS);

        return () => clearInterval(intervalId);
    }, [AUTOSAVE_INTERVAL_MS]);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleSubmit = async (values: CreateLogParams): Promise<void> => {
        const res = await fetch('/api/logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        });
        if (!res.ok) {
            const data = (await res.json().catch(() => ({}))) as {
                error?: string;
            };
            throw new Error(data.error ?? 'Failed to publish log.');
        }
        await fetch('/api/logs/draft', { method: 'DELETE' });
        router.push('/logs');
    };

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <LogForm
            submitLabel="Publish"
            initialValues={initialValues}
            onSubmit={handleSubmit}
            onChange={handleChange}
        />
    );
};

export default NewLogForm;
