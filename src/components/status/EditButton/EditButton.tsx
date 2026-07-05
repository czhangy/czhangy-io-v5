'use client';

import { useSession } from '@/lib/context/SessionContext';
import EditIcon from '@/lib/icons/EditIcon';
import styles from './EditButton.module.scss';

type EditButtonProps = {
    onClick?: () => void;
    disabled?: boolean;
};

const EditButton: React.FC<EditButtonProps> = ({ onClick, disabled }) => {
    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const { role } = useSession();

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    if (role !== 'ADMIN') return null;

    return (
        <button
            type="button"
            className={styles.button}
            onClick={onClick}
            disabled={disabled}
        >
            <EditIcon />
        </button>
    );
};

export default EditButton;
