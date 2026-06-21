'use client';

import { useRouter } from 'next/navigation';
import axios from 'axios';
import Modal from '@/components/common/Modal/Modal';
import type { Achievement } from '@/generated/prisma/client';
import AchievementForm from '../../AchievementForm/AchievementForm';
import type { AchievementFormValues } from '../../AchievementForm/AchievementForm';

type EditAchievementModalProps = {
    achievement: Achievement;
    onClose: () => void;
};

const EditAchievementModal: React.FC<EditAchievementModalProps> = ({
    achievement,
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
        await axios.patch(`/api/achievements/${achievement.id}`, values);
        router.refresh();
        onClose();
    };

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <Modal title="EDIT ACHIEVEMENT" onClose={onClose}>
            <AchievementForm
                initialValues={{ ...achievement, date: achievement.date ?? '' }}
                submitLabel="Save"
                onSubmit={handleSubmit}
                onCancel={onClose}
            />
        </Modal>
    );
};

export default EditAchievementModal;
