'use client';

import MoveForm from '@/components/cardistry/CardistryContent/MoveForm/MoveForm';
import Modal from '@/components/common/Modal/Modal';
import { Move } from '@/lib/static/types';

type AddMoveModalProps = {
    onClose: () => void;
    onAdd: (move: Move) => void;
};

const AddMoveModal: React.FC<AddMoveModalProps> = ({ onClose, onAdd }) => {
    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleSubmit = async (values: {
        name: string;
        type: string;
        tutorial: string;
    }): Promise<void> => {
        const res = await fetch('/api/moves', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        });
        if (!res.ok) {
            const data = (await res.json().catch(() => ({}))) as {
                error?: string;
            };
            throw new Error(data.error ?? 'Failed to create move.');
        }
        onAdd((await res.json()) as Move);
        onClose();
    };

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <Modal title="ADD MOVE" onClose={onClose}>
            <MoveForm
                submitLabel="Add"
                onSubmit={handleSubmit}
                onClose={onClose}
            />
        </Modal>
    );
};

export default AddMoveModal;
