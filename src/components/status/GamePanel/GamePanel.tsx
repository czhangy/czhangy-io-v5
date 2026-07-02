'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useSession } from '@/lib/context/SessionContext';
import {
    GameEntry,
    RAWGGame,
    RAWGSearchResult,
} from '@/lib/utils/shared/types';
import PanelEditButton from '../PanelEditButton/PanelEditButton';
import SearchInput from '../SearchInput/SearchInput';
import StatusPanel from '../StatusPanel/StatusPanel';
import styles from './GamePanel.module.scss';

type GamePanelProps = {
    initialEntry: GameEntry;
    initialMeta: RAWGGame | null;
    icon?: React.ReactNode;
    className?: string;
};

const GamePanel: React.FC<GamePanelProps> = ({
    initialEntry,
    initialMeta,
    icon,
    className,
}) => {
    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { role } = useSession();

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [entry, setEntry] = useState<GameEntry>(initialEntry);
    const [meta, setMeta] = useState<RAWGGame | null>(initialMeta);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [query, setQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<RAWGSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleEdit = () => {
        setIsEditing(true);
        setQuery(entry.rawgId > 0 ? entry.name : '');
        setSearchResults([]);
    };

    const handleCancel = () => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        setIsEditing(false);
        setQuery('');
        setSearchResults([]);
        setIsSearching(false);
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

    const handleSelectResult = async (id: number) => {
        const result = searchResults.find((r) => r.id === id);
        if (!result) return;
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        const newEntry: GameEntry = { name: result.name, rawgId: result.id };
        await fetch('/api/status/game', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: JSON.stringify(newEntry) }),
        });
        setEntry(newEntry);
        setMeta({ cover: result.cover, genres: result.genres });
        setIsEditing(false);
        setQuery('');
        setSearchResults([]);
    };

    const handleSaveAsTyped = async () => {
        const trimmed = query.trim();
        if (!trimmed) return;
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        const newEntry: GameEntry = { name: trimmed, rawgId: -1 };
        await fetch('/api/status/game', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: JSON.stringify(newEntry) }),
        });
        setEntry(newEntry);
        setMeta(null);
        setIsEditing(false);
        setQuery('');
        setSearchResults([]);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') handleCancel();
        if (e.key === 'Enter') handleSaveAsTyped();
    };

    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const performSearch = async (q: string): Promise<void> => {
        setIsSearching(true);
        setSearchResults([]);
        const res = await fetch(`/api/games/search?q=${encodeURIComponent(q)}`);
        if (res.ok) setSearchResults((await res.json()) as RAWGSearchResult[]);
        setIsSearching(false);
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const isAdmin: boolean = role === 'ADMIN';

    const editButton: React.ReactNode =
        isAdmin && !isEditing ? <PanelEditButton onClick={handleEdit} /> : null;

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <StatusPanel
            label="GRINDING"
            icon={icon}
            headerAction={editButton}
            className={className}
        >
            {isEditing ? (
                <div className={styles['edit-form']}>
                    <SearchInput
                        value={query}
                        placeholder="Search games..."
                        isSearching={isSearching}
                        results={searchResults}
                        onChange={handleQueryChange}
                        onKeyDown={handleKeyDown}
                        onClear={handleCancel}
                        onSelectResult={handleSelectResult}
                    />
                </div>
            ) : (
                <div className={styles.content}>
                    <Image
                        className={
                            meta?.cover
                                ? styles.cover
                                : styles['cover--fallback']
                        }
                        src={meta?.cover ?? '/game.png'}
                        alt={`${entry.name} cover`}
                        width={90}
                        height={56}
                    />
                    <div className={styles.info}>
                        <span className={styles.name}>{entry.name}</span>
                        {meta?.genres && meta.genres.length > 0 ? (
                            <div className={styles.genres}>
                                {meta.genres.slice(0, 2).map((g) => (
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
                </div>
            )}
        </StatusPanel>
    );
};

export default GamePanel;
