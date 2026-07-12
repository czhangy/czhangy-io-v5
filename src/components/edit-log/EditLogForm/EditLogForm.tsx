'use client';

import { useRouter } from 'next/navigation';
import LogForm from '@/components/logs/LogForm/LogForm';
import { CreateLogParams, Log } from '@/lib/static/types';
import LogHelpers from '@/lib/utils/LogHelpers';

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
        await LogHelpers.update(entry.id, values);
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
