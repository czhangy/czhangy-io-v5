'use client';

import { useEffect, useRef } from 'react';
import styles from './SearchInput.module.scss';

export type SearchResult = {
    id: number;
    name: string;
    year: string | null;
};

type SearchInputProps = {
    value: string;
    placeholder: string;
    isSearching: boolean;
    results: SearchResult[];
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onClear: () => void;
    onSelectResult: (id: number) => void;
};

const SearchInput: React.FC<SearchInputProps> = ({
    value,
    placeholder,
    isSearching,
    results,
    onChange,
    onKeyDown,
    onClear,
    onSelectResult,
}) => {
    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const wrapperRef = useRef<HTMLDivElement>(null);

    // -------------------------------------------------------------------------
    // EFFECTS
    // -------------------------------------------------------------------------

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(e.target as Node)
            ) {
                onClear();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [onClear]);

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div ref={wrapperRef} className={styles.wrapper}>
            <input
                className={styles.input}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                autoFocus
            />
            {isSearching ? (
                <span className={styles.spinner} />
            ) : (
                <button
                    type="button"
                    className={styles.clear}
                    onClick={onClear}
                >
                    ✕
                </button>
            )}
            {results.length > 0 ? (
                <ul className={styles.dropdown}>
                    {results.map((result) => (
                        <li
                            key={result.id}
                            className={styles['dropdown-item']}
                            onClick={() => onSelectResult(result.id)}
                        >
                            <span className={styles['result-name']}>
                                {result.name}
                            </span>
                            {result.year ? (
                                <span className={styles['result-year']}>
                                    {result.year}
                                </span>
                            ) : null}
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    );
};

export default SearchInput;
