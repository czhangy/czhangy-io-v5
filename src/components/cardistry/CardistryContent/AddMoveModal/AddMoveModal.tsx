'use client';

import MoveForm from '@/components/cardistry/CardistryContent/MoveForm/MoveForm';
import Modal from '@/components/common/Modal/Modal';
import { Move } from '@/lib/static/types';
import MoveHelpers from '@/lib/utils/MoveHelpers';

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
        const created = await MoveHelpers.create(values);
        onAdd(created);
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
