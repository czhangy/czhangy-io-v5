'use client';

import { useRef, useState } from 'react';
import SearchInput from '@/components/common/SearchInput/SearchInput';
import EditButton from '@/components/status/EditButton/EditButton';
import StatusPanel from '@/components/status/StatusPanel/StatusPanel';
import { Key } from '@/lib/static/enums';
import styles from './LocationPanel.module.scss';

type LocationPanelProps = {
    initialLocation: string;
    label: string;
    icon: React.ReactNode;
    cols: number;
    rows?: number;
};

const LocationPanel: React.FC<LocationPanelProps> = ({
    initialLocation,
    label,
    icon,
    cols,
    rows,
}) => {
    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [location, setLocation] = useState<string>(initialLocation);
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);

    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const performSearch = async (q: string): Promise<void> => {
        setIsSearching(true);
        setResults([]);
        const res = await fetch(
            `/api/locations/search?q=${encodeURIComponent(q)}`
        );
        const data: string[] = res.ok ? ((await res.json()) as string[]) : [];
        setResults(data);
        setIsSearching(false);
    };

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleEdit = (): void => {
        setQuery('');
        setResults([]);
        setIsEditing(true);
    };

    const handleQueryChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        const value = e.target.value;
        setQuery(value);
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        if (!value.trim()) {
            setResults([]);
            return;
        }
        searchTimeoutRef.current = setTimeout(() => performSearch(value), 500);
    };

    const handleSelectResult = async (name: string | number): Promise<void> => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        await fetch('/api/highlights/location', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: String(name) }),
        });
        setLocation(String(name));
        setIsEditing(false);
    };

    const handleClose = (): void => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        setQuery('');
        setResults([]);
        setIsSearching(false);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === Key.Escape) handleClose();
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <StatusPanel
            label={label}
            icon={icon}
            cols={cols}
            rows={rows}
            headerAction={
                <EditButton onClick={handleEdit} disabled={isEditing} />
            }
        >
            {isEditing ? (
                <SearchInput
                    value={query}
                    placeholder="Search locations..."
                    isSearching={isSearching}
                    results={results.map((r) => ({
                        id: r,
                        name: r,
                        note: null,
                    }))}
                    onChange={handleQueryChange}
                    onKeyDown={handleKeyDown}
                    onClear={handleClose}
                    onSelectResult={handleSelectResult}
                    hideClear={!query}
                />
            ) : (
                <p className={styles.location}>{location}</p>
            )}
        </StatusPanel>
    );
};

export default LocationPanel;
