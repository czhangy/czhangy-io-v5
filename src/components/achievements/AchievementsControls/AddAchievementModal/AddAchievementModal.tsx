'use client';

import { useRouter } from 'next/navigation';
import axios from 'axios';
import Modal from '@/components/common/Modal/Modal';
import AchievementForm from '../../AchievementForm/AchievementForm';
import type { AchievementFormValues } from '../../AchievementForm/AchievementForm';

type AddAchievementModalProps = {
    onClose: () => void;
};

const AddAchievementModal: React.FC<AddAchievementModalProps> = ({
    onClose,
}) => {
    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const router = useRouter();

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleSubmit = async (
        values: AchievementFormValues
    ): Promise<void> => {
        await axios.post('/api/achievements', values);
        router.refresh();
        onClose();
    };

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <Modal title="ADD ACHIEVEMENT" onClose={onClose}>
            <AchievementForm
                submitLabel="Add"
                onSubmit={handleSubmit}
                onCancel={onClose}
            />
        </Modal>
    );
};

export default AddAchievementModal;
