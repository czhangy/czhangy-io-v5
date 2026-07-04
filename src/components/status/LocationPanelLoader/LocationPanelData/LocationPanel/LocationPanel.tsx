'use client';

import { useRef, useState } from 'react';
import PanelButton from '@/components/status/PanelButton/PanelButton';
import SearchInput from '@/components/status/SearchInput/SearchInput';
import StatusPanel from '@/components/status/StatusPanel/StatusPanel';
import { useSession } from '@/lib/context/SessionContext';
import { Key } from '@/lib/static/enums';
import { LocationResult } from '@/lib/static/types';
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

    const { role } = useSession();
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [location, setLocation] = useState<string>(initialLocation);
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<LocationResult[]>([]);
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
        const data: LocationResult[] = res.ok
            ? ((await res.json()) as LocationResult[])
            : [];
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

    const handleSelectResult = async (id: string | number): Promise<void> => {
        const result = results.find((r) => r.id === String(id));
        if (!result) return;
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        await fetch('/api/status/location', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: result.name }),
        });
        setLocation(result.name);
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

    const isAdmin: boolean = role === 'ADMIN';

    const editButton: React.ReactNode = isAdmin ? (
        <PanelButton onClick={handleEdit} disabled={isEditing} />
    ) : null;

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <StatusPanel
            label={label}
            icon={icon}
            cols={cols}
            rows={rows}
            headerAction={editButton}
        >
            {isEditing ? (
                <SearchInput
                    value={query}
                    placeholder="Search locations..."
                    isSearching={isSearching}
                    results={results.map((r) => ({ ...r, year: null }))}
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
