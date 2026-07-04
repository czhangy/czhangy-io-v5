'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './PanelSelect.module.scss';

type PanelSelectProps = {
    value: string;
    onChange: (value: string) => void;
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
    // HOOKS
    // -------------------------------------------------------------------------

    const wrapperRef = useRef<HTMLDivElement>(null);

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [isOpen, setIsOpen] = useState<boolean>(false);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleTriggerClick = (): void => {
        setIsOpen((prev) => !prev);
    };

    const handleSelect = (opt: string | number): void => {
        onChange(String(opt));
        setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent): void => {
        if (e.key === 'Escape' && isOpen) {
            e.stopPropagation();
            setIsOpen(false);
        }
    };

    // -------------------------------------------------------------------------
    // EFFECTS
    // -------------------------------------------------------------------------

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const isEmpty = !value && !!placeholder;

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div
            ref={wrapperRef}
            className={`${styles['panel-select']}${compact ? ` ${styles['panel-select--compact']}` : ''}`}
            onKeyDown={handleKeyDown}
        >
            <button
                type="button"
                className={`${styles.trigger}${isEmpty ? ` ${styles['trigger--empty']}` : ''}`}
                onClick={handleTriggerClick}
            >
                <span className={styles['trigger-label']}>
                    {value || placeholder}
                </span>
            </button>
            {isOpen && (
                <ul className={styles.options}>
                    {options.map((opt) => (
                        <li
                            key={opt}
                            className={`${styles.option}${String(opt) === value ? ` ${styles['option--active']}` : ''}`}
                            onMouseDown={(e: React.MouseEvent) =>
                                e.preventDefault()
                            }
                            onClick={() => handleSelect(opt)}
                        >
                            {opt}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PanelSelect;
