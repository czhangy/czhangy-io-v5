'use client';

import { useRouter } from 'next/navigation';
import AchievementForm from '@/components/achievements/AchievementsContent/AchievementForm/AchievementForm';
import Modal from '@/components/common/Modal/Modal';
import { CreateAchievementParams } from '@/lib/static/types';
import AchievementHelpers from '@/lib/utils/AchievementHelpers';

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
        values: CreateAchievementParams
    ): Promise<void> => {
        await AchievementHelpers.create(values);
        router.refresh();
        onClose();
    };

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <Modal title="ADD ACHIEVEMENT" onClose={onClose}>
            <AchievementForm submitLabel="Add" onSubmit={handleSubmit} />
        </Modal>
    );
};

export default AddAchievementModal;
