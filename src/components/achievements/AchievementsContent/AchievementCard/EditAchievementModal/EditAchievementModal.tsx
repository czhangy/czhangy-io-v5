'use client';

import { useRouter } from 'next/navigation';
import AchievementForm from '@/components/achievements/AchievementsContent/AchievementForm/AchievementForm';
import Modal from '@/components/common/Modal/Modal';
import { AchievementFormValues } from '@/lib/static/types';
import type { Achievement } from '@/generated/prisma/client';

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
        const res = await fetch(`/api/achievements/${achievement.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        });
        if (!res.ok) {
            const data = (await res.json().catch(() => ({}))) as {
                error?: string;
            };
            throw new Error(data.error ?? 'Failed to save achievement.');
        }
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
