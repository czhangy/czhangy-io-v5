'use client';

import JobForm from '@/components/career/CareerContent/JobForm/JobForm';
import Modal from '@/components/common/Modal/Modal';
import { CreateJobParams, Job } from '@/lib/static/types';
import CareerHelpers from '@/lib/utils/CareerHelpers';

type AddJobModalProps = {
    onClose: () => void;
    onAdd: (job: Job) => void;
};

const AddJobModal: React.FC<AddJobModalProps> = ({ onClose, onAdd }) => {
    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleSubmit = async (values: CreateJobParams): Promise<void> => {
        const created = await CareerHelpers.create(values);
        onAdd(created);
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
