'use client';

import MoveForm from '@/components/cardistry/CardistryContent/MoveForm/MoveForm';
import Modal from '@/components/common/Modal/Modal';
import { Move } from '@/lib/static/types';

type EditMoveModalProps = {
    move: Move;
    onClose: () => void;
    onEdit: (move: Move) => void;
};

const EditMoveModal: React.FC<EditMoveModalProps> = ({
    move,
    onClose,
    onEdit,
}) => {
    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleSubmit = async (values: {
        name: string;
        type: string;
        tutorial: string;
        count?: number;
    }): Promise<void> => {
        const res = await fetch(`/api/moves/${encodeURIComponent(move.name)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        });
        if (!res.ok) {
            const data = (await res.json().catch(() => ({}))) as {
                error?: string;
            };
            throw new Error(data.error ?? 'Failed to save move.');
        }
        onEdit((await res.json()) as Move);
        onClose();
    };

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <Modal title="EDIT MOVE" onClose={onClose}>
            <MoveForm
                submitLabel="Save"
                initialValues={move}
                onSubmit={handleSubmit}
                onClose={onClose}
            />
        </Modal>
    );
};

export default EditMoveModal;
