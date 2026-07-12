'use client';

import JobForm from '@/components/career/CareerContent/JobForm/JobForm';
import Modal from '@/components/common/Modal/Modal';
import { CreateJobParams, Job } from '@/lib/static/types';
import CareerHelpers from '@/lib/utils/CareerHelpers';

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
        const updated = await CareerHelpers.update(job.id, values);
        onEdit(updated);
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
