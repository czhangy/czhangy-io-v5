'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import styles from './SearchInput.module.scss';

type SearchInputProps = {
    value: string;
    placeholder: string;
    isSearching: boolean;
    results: {
        id: string | number;
        name: string;
        note?: string;
        image?: string;
        genres?: string[];
    }[];
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onClear: () => void;
    onSelectResult: (id: string | number) => void;
    hideClear?: boolean;
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
    hideClear,
}) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    type DropdownRect = {
        top: number;
        left: number;
        width: number;
    };

    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const wrapperRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLUListElement>(null);

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [dropdownRect, setDropdownRect] = useState<DropdownRect | null>(null);

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const hasResults = results.length > 0;

    // -------------------------------------------------------------------------
    // EFFECTS
    // -------------------------------------------------------------------------

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(target) &&
                !dropdownRef.current?.contains(target)
            ) {
                onClear();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [onClear]);

    useLayoutEffect(() => {
        if (!hasResults) return;
        const updateRect = (): void => {
            if (!wrapperRef.current) return;
            const rect = wrapperRef.current.getBoundingClientRect();
            setDropdownRect({
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
    }, [hasResults]);

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
            ) : !hideClear ? (
                <button
                    type="button"
                    className={styles.clear}
                    onClick={onClear}
                >
                    ✕
                </button>
            ) : null}
            {hasResults && dropdownRect
                ? createPortal(
                      <ul
                          ref={dropdownRef}
                          className={styles.dropdown}
                          style={
                              {
                                  '--dropdown-top': `${dropdownRect.top}px`,
                                  '--dropdown-left': `${dropdownRect.left}px`,
                                  '--dropdown-width': `${dropdownRect.width}px`,
                              } as React.CSSProperties
                          }
                      >
                          {results.map((result) => (
                              <li
                                  key={result.id}
                                  className={styles['dropdown-item']}
                                  onClick={() => onSelectResult(result.id)}
                              >
                                  {result.image ? (
                                      <Image
                                          className={styles['result-image']}
                                          src={result.image}
                                          alt=""
                                          width={32}
                                          height={45}
                                      />
                                  ) : null}
                                  <div className={styles['result-info']}>
                                      <span className={styles['result-name']}>
                                          {result.name}
                                      </span>
                                      {result.genres &&
                                      result.genres.length > 0 ? (
                                          <div
                                              className={
                                                  styles['result-genres']
                                              }
                                          >
                                              {result.genres
                                                  .slice(0, 2)
                                                  .map((genre) => (
                                                      <span
                                                          key={genre}
                                                          className={
                                                              styles[
                                                                  'genre-tag'
                                                              ]
                                                          }
                                                      >
                                                          {genre}
                                                      </span>
                                                  ))}
                                          </div>
                                      ) : null}
                                  </div>
                                  {result.note ? (
                                      <span className={styles['result-note']}>
                                          {result.note}
                                      </span>
                                  ) : null}
                              </li>
                          ))}
                      </ul>,
                      document.body
                  )
                : null}
        </div>
    );
};

export default SearchInput;
