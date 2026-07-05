import styles from './AddButton.module.scss';

type AddButtonProps = {
    label: string;
    disabled: boolean;
    onSubmit: () => void;
};

const AddButton: React.FC<AddButtonProps> = ({ label, disabled, onSubmit }) => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles.actions}>
            <button
                type="button"
                className={styles.submit}
                onClick={onSubmit}
                disabled={disabled}
            >
                {label}
            </button>
        </div>
    );
};

export default AddButton;
