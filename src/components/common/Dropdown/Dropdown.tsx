'use client';

import { useEffect, useRef, useState } from 'react';
import ChevronIcon from '@/lib/icons/ChevronIcon';
import styles from './Dropdown.module.scss';

type DropdownProps = {
    value: string;
    onChange: (value: string) => void;
    options: string[];
};

const Dropdown: React.FC<DropdownProps> = ({ value, onChange, options }) => {
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

    const handleSelect = (opt: string): void => {
        onChange(opt);
        setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent): void => {
        if (e.key === 'Escape' && isOpen) {
            e.stopPropagation();
            setIsOpen(false);
        }
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const displayLabel = value;

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
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div
            ref={wrapperRef}
            className={styles.dropdown}
            onKeyDown={handleKeyDown}
        >
            <button
                type="button"
                className={styles.trigger}
                onClick={handleTriggerClick}
            >
                <span className={styles['trigger-label']}>{displayLabel}</span>
                <ChevronIcon />
            </button>
            {isOpen && (
                <ul className={styles.options}>
                    {options.map((opt) => (
                        <li
                            key={opt}
                            className={`${styles.option}${opt === value ? ` ${styles['option--active']}` : ''}`}
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

export default Dropdown;
