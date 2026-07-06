'use client';

import { useSession } from '@/lib/context/SessionContext';
import EditIcon from '@/lib/icons/EditIcon';
import styles from './EditButton.module.scss';

type EditButtonProps = {
    onClick?: () => void;
    active?: boolean;
};

const EditButton: React.FC<EditButtonProps> = ({ onClick, active }) => {
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
            className={`${styles.button}${active ? ` ${styles['button--active']}` : ''}`}
            onClick={onClick}
        >
            <EditIcon />
        </button>
    );
};

export default EditButton;
