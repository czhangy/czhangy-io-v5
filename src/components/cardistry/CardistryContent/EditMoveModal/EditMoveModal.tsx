'use client';

import MoveForm from '@/components/cardistry/CardistryContent/MoveForm/MoveForm';
import Modal from '@/components/common/Modal/Modal';
import { Move } from '@/lib/static/types';
import MoveHelpers from '@/lib/utils/MoveHelpers';

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
        const updated = await MoveHelpers.update(move.name, values);
        onEdit(updated);
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
