'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import LogForm from '@/components/logs/LogForm/LogForm';
import { CreateLogParams } from '@/lib/static/types';
import LogHelpers from '@/lib/utils/LogHelpers';

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

            void LogHelpers.saveDraft(draftRef.current);
        }, AUTOSAVE_INTERVAL_MS);

        return () => clearInterval(intervalId);
    }, [AUTOSAVE_INTERVAL_MS]);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleSubmit = async (values: CreateLogParams): Promise<void> => {
        await LogHelpers.create(values);
        await LogHelpers.deleteDraft();
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
