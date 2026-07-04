import styles from './PanelSelect.module.scss';

type PanelSelectProps = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: (string | number)[];
    placeholder?: string;
    compact?: boolean;
};

const PanelSelect: React.FC<PanelSelectProps> = ({
    value,
    onChange,
    options,
    placeholder,
    compact = false,
}) => {
    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const isEmpty = !value && !!placeholder;

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <select
            className={`${styles['panel-select']}${compact ? ` ${styles['panel-select--compact']}` : ''}${isEmpty ? ` ${styles['panel-select--empty']}` : ''}`}
            value={value}
            onChange={onChange}
        >
            {placeholder && (
                <option value="" disabled>
                    {placeholder}
                </option>
            )}
            {options.map((opt) => (
                <option key={opt} value={opt}>
                    {opt}
                </option>
            ))}
        </select>
    );
};

export default PanelSelect;
