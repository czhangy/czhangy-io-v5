import DeleteIcon from '@/lib/icons/DeleteIcon';
import EditIcon from '@/lib/icons/EditIcon';
import StarIcon from '@/lib/icons/StarIcon';
import styles from './AdminActions.module.scss';

type AdminActionsProps = {
    onHighlight?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    className?: string;
};

const AdminActions: React.FC<AdminActionsProps> = ({
    onHighlight,
    onEdit,
    onDelete,
    className,
}) => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={`${styles['admin-actions']} ${className ?? ''}`}>
            {onHighlight ? (
                <button
                    type="button"
                    className={styles['action-button']}
                    onClick={onHighlight}
                >
                    <StarIcon />
                </button>
            ) : null}
            {onEdit ? (
                <button
                    type="button"
                    className={styles['action-button']}
                    onClick={onEdit}
                >
                    <EditIcon />
                </button>
            ) : null}
            {onDelete ? (
                <button
                    type="button"
                    className={styles['action-button']}
                    onClick={onDelete}
                >
                    <DeleteIcon />
                </button>
            ) : null}
        </div>
    );
};

export default AdminActions;
