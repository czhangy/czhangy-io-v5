'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useSession } from '@/lib/context/SessionContext';
import { ShowEntry } from '@/lib/utils';
import {
    getShowById,
    searchShows,
    TVmazeSearchResult,
    TVmazeShow,
} from '@/lib/utils/tvmaze';
import PanelEditButton from '../../PanelEditButton/PanelEditButton';
import styles from './ShowsPanelBody.module.scss';

type ShowsPanelBodyProps = {
    initialEntries: ShowEntry[];
    initialMeta: (TVmazeShow | null)[];
};

const ShowsPanelBody: React.FC<ShowsPanelBodyProps> = ({
    initialEntries,
    initialMeta,
}) => {
    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { role } = useSession();

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [entries, setEntries] = useState<ShowEntry[]>(initialEntries);
    const [meta, setMeta] = useState<(TVmazeShow | null)[]>(initialMeta);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [query, setQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<TVmazeSearchResult[]>(
        []
    );

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setQuery(entries[index].name === '???' ? '' : entries[index].name);
        setSearchResults([]);
    };

    const handleCancel = () => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        setEditingIndex(null);
        setQuery('');
        setSearchResults([]);
    };

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        if (!value.trim()) {
            setSearchResults([]);
            return;
        }
        searchTimeoutRef.current = setTimeout(() => {
            performSearch(value);
        }, 1000);
    };

    const handleSelectResult = async (result: TVmazeSearchResult) => {
        if (editingIndex === null) return;
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        const newEntry: ShowEntry = { name: result.name, tvmazeId: result.id };
        const newEntries = entries.map((e, i) =>
            i === editingIndex ? newEntry : e
        );
        const newShowMeta = await getShowById(result.id);
        await fetch('/api/status/shows', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: JSON.stringify(newEntries) }),
        });
        setEntries(newEntries);
        setMeta(meta.map((m, i) => (i === editingIndex ? newShowMeta : m)));
        setEditingIndex(null);
        setQuery('');
        setSearchResults([]);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') handleCancel();
    };

    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const performSearch = async (q: string): Promise<void> => {
        const results = await searchShows(q);
        setSearchResults(results);
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const isAdmin: boolean = role === 'ADMIN';

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <ul className={styles.list}>
            {entries.map((entry, i) => (
                <li key={i} className={styles.item}>
                    {meta[i]?.poster ? (
                        <Image
                            className={styles.poster}
                            src={meta[i]!.poster!}
                            alt={`${entry.name} poster`}
                            width={43}
                            height={60}
                        />
                    ) : (
                        <div className={styles['poster-placeholder']} />
                    )}
                    {editingIndex === i ? (
                        <div className={styles['edit-form']}>
                            <div className={styles['search-wrapper']}>
                                <input
                                    className={styles.input}
                                    value={query}
                                    onChange={handleQueryChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Search shows..."
                                    autoFocus
                                />
                                {searchResults.length > 0 ? (
                                    <ul className={styles.dropdown}>
                                        {searchResults.map((result) => (
                                            <li
                                                key={result.id}
                                                className={
                                                    styles['dropdown-item']
                                                }
                                                onClick={() =>
                                                    handleSelectResult(result)
                                                }
                                            >
                                                <span
                                                    className={
                                                        styles['result-name']
                                                    }
                                                >
                                                    {result.name}
                                                </span>
                                                {result.year ? (
                                                    <span
                                                        className={
                                                            styles[
                                                                'result-year'
                                                            ]
                                                        }
                                                    >
                                                        {result.year}
                                                    </span>
                                                ) : null}
                                            </li>
                                        ))}
                                    </ul>
                                ) : null}
                            </div>
                            <button
                                type="button"
                                className={styles.cancel}
                                onClick={handleCancel}
                            >
                                CANCEL
                            </button>
                        </div>
                    ) : (
                        <div className={styles.info}>
                            <span className={styles.title}>{entry.name}</span>
                            {meta[i]?.genres && meta[i]!.genres.length > 0 ? (
                                <div className={styles.metadata}>
                                    {meta[i]!.genres.slice(0, 2).map((g) => (
                                        <span
                                            key={g}
                                            className={styles['genre-tag']}
                                        >
                                            {g}
                                        </span>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    )}
                    {isAdmin && editingIndex !== i ? (
                        <PanelEditButton onClick={() => handleEdit(i)} />
                    ) : null}
                </li>
            ))}
        </ul>
    );
};

export default ShowsPanelBody;
