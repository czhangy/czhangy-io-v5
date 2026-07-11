import DatePicker from '@/components/common/DatePicker/DatePicker';
import Dropdown from '@/components/common/Dropdown/Dropdown';
import styles from './FormField.module.scss';

type FormFieldProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options?: string[];
    type?: 'date';
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    autoFocus?: boolean;
};

const FormField: React.FC<FormFieldProps> = ({
    label,
    value,
    onChange,
    options,
    type,
    onKeyDown,
    autoFocus,
}) => {
    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        onChange(e.target.value);
    };

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles.field}>
            <span className={styles.label}>{label}</span>
            {options ? (
                <Dropdown value={value} onChange={onChange} options={options} />
            ) : type === 'date' ? (
                <DatePicker value={value} onChange={onChange} />
            ) : (
                <input
                    className={styles.input}
                    value={value}
                    onChange={handleInputChange}
                    onKeyDown={onKeyDown}
                    autoFocus={autoFocus}
                />
            )}
        </div>
    );
};

export default FormField;
