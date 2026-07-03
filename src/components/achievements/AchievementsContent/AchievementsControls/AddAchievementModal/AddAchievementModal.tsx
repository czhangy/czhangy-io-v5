'use client';

import { useRouter } from 'next/navigation';
import AchievementForm from '@/components/achievements/AchievementsContent/AchievementForm/AchievementForm';
import Modal from '@/components/common/Modal/Modal';
import { AchievementFormValues } from '@/lib/static/types';

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
        const res = await fetch('/api/achievements', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        });
        if (!res.ok) {
            const data = (await res.json().catch(() => ({}))) as {
                error?: string;
            };
            throw new Error(data.error ?? 'Failed to create achievement.');
        }
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
