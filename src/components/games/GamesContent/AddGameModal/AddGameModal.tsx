'use client';

import Modal from '@/components/common/Modal/Modal';
import GameForm from '@/components/games/GamesContent/GameForm/GameForm';
import { Game } from '@/lib/static/types';
import GameHelpers from '@/lib/utils/GameHelpers';

type AddGameModalProps = {
    onClose: () => void;
    onAdd: (game: Game) => void;
};

const AddGameModal: React.FC<AddGameModalProps> = ({ onClose, onAdd }) => {
    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleSubmit = async (values: Game): Promise<void> => {
        const created = await GameHelpers.create(values);
        onAdd(created);
        onClose();
    };

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <Modal title="ADD GAME" onClose={onClose}>
            <GameForm
                submitLabel="Add"
                onSubmit={handleSubmit}
                onClose={onClose}
            />
        </Modal>
    );
};

export default AddGameModal;
