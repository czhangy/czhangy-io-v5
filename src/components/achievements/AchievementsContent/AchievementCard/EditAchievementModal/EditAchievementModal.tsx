'use client';

import { useRouter } from 'next/navigation';
import AchievementForm from '@/components/achievements/AchievementsContent/AchievementForm/AchievementForm';
import Modal from '@/components/common/Modal/Modal';
import { Achievement, CreateAchievementParams } from '@/lib/static/types';
import AchievementHelpers from '@/lib/utils/AchievementHelpers';

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
        values: CreateAchievementParams
    ): Promise<void> => {
        await AchievementHelpers.update(achievement.name, values);
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
            />
        </Modal>
    );
};

export default EditAchievementModal;
