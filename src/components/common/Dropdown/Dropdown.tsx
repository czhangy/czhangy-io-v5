'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ChevronIcon from '@/lib/icons/ChevronIcon';
import styles from './Dropdown.module.scss';

type DropdownProps = {
    value: string;
    onChange: (value: string) => void;
    options: string[];
};

const Dropdown: React.FC<DropdownProps> = ({ value, onChange, options }) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    type OptionsRect = {
        top: number;
        left: number;
        width: number;
    };

    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const wrapperRef = useRef<HTMLDivElement>(null);
    const optionsRef = useRef<HTMLUListElement>(null);

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [optionsRect, setOptionsRect] = useState<OptionsRect | null>(null);

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
            const target = e.target as Node;
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(target) &&
                !optionsRef.current?.contains(target)
            ) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    useLayoutEffect(() => {
        if (!isOpen) return;
        const updateRect = (): void => {
            if (!wrapperRef.current) return;
            const rect = wrapperRef.current.getBoundingClientRect();
            setOptionsRect({
                top: rect.bottom,
                left: rect.left,
                width: rect.width,
            });
        };
        updateRect();
        window.addEventListener('scroll', updateRect, true);
        window.addEventListener('resize', updateRect);
        return () => {
            window.removeEventListener('scroll', updateRect, true);
            window.removeEventListener('resize', updateRect);
        };
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
            {isOpen && optionsRect
                ? createPortal(
                      <ul
                          ref={optionsRef}
                          className={styles.options}
                          style={
                              {
                                  '--options-top': `${optionsRect.top}px`,
                                  '--options-left': `${optionsRect.left}px`,
                                  '--options-width': `${optionsRect.width}px`,
                              } as React.CSSProperties
                          }
                      >
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
                      </ul>,
                      document.body
                  )
                : null}
        </div>
    );
};

export default Dropdown;
