'use client';

import JobForm from '@/components/career/CareerContent/JobForm/JobForm';
import Modal from '@/components/common/Modal/Modal';
import { CreateJobParams, Job } from '@/lib/static/types';

type EditJobModalProps = {
    job: Job;
    onClose: () => void;
    onEdit: (job: Job) => void;
};

const EditJobModal: React.FC<EditJobModalProps> = ({
    job,
    onClose,
    onEdit,
}) => {
    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleSubmit = async (values: CreateJobParams): Promise<void> => {
        const res = await fetch(`/api/career/${job.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        });
        if (!res.ok) {
            const data = (await res.json().catch(() => ({}))) as {
                error?: string;
            };
            throw new Error(data.error ?? 'Failed to save job.');
        }
        onEdit((await res.json()) as Job);
        onClose();
    };

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <Modal title="EDIT JOB" onClose={onClose}>
            <JobForm
                submitLabel="Save"
                initialValues={{
                    company: job.company,
                    title: job.title,
                    logo: job.logo,
                    startDate: job.startDate,
                    endDate: job.endDate ?? '',
                }}
                onSubmit={handleSubmit}
                onClose={onClose}
            />
        </Modal>
    );
};

export default EditJobModal;
