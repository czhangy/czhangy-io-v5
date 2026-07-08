'use client';

import JobForm from '@/components/career/CareerContent/JobForm/JobForm';
import Modal from '@/components/common/Modal/Modal';
import { CreateJobParams, Job } from '@/lib/static/types';

type AddJobModalProps = {
    onClose: () => void;
    onAdd: (job: Job) => void;
};

const AddJobModal: React.FC<AddJobModalProps> = ({ onClose, onAdd }) => {
    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleSubmit = async (values: CreateJobParams): Promise<void> => {
        const res = await fetch('/api/career', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        });
        if (!res.ok) {
            const data = (await res.json().catch(() => ({}))) as {
                error?: string;
            };
            throw new Error(data.error ?? 'Failed to create job.');
        }
        onAdd((await res.json()) as Job);
        onClose();
    };

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <Modal title="ADD JOB" onClose={onClose}>
            <JobForm
                submitLabel="Add"
                onSubmit={handleSubmit}
                onClose={onClose}
            />
        </Modal>
    );
};

export default AddJobModal;
