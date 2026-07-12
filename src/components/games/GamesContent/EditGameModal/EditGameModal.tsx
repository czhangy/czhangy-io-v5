'use client';

import Modal from '@/components/common/Modal/Modal';
import GameForm from '@/components/games/GamesContent/GameForm/GameForm';
import { Game } from '@/lib/static/types';
import GameHelpers from '@/lib/utils/GameHelpers';

type EditGameModalProps = {
    game: Game;
    onClose: () => void;
    onEdit: (game: Game) => void;
};

const EditGameModal: React.FC<EditGameModalProps> = ({
    game,
    onClose,
    onEdit,
}) => {
    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleSubmit = async (values: Game): Promise<void> => {
        const updated = await GameHelpers.update(game.name, values);
        onEdit(updated);
        onClose();
    };

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <Modal title="EDIT GAME" onClose={onClose}>
            <GameForm
                submitLabel="Save"
                initialValues={game}
                onSubmit={handleSubmit}
                onClose={onClose}
            />
        </Modal>
    );
};

export default EditGameModal;
