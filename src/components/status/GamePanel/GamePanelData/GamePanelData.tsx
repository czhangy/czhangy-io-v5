import RAWGHelpers from '@/lib/utils/RAWGHelpers';
import { prisma } from '@/lib/utils/shared/prisma';
import { GameEntry, RAWGGame } from '@/lib/utils/shared/types';
import GamePanel from '../GamePanel';

type GamePanelDataProps = {
    icon?: React.ReactNode;
    className?: string;
};

const GamePanelData = async ({ icon, className }: GamePanelDataProps) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const DEFAULT_GAME_ENTRY: GameEntry = { name: 'Something', rawgId: -1 };

    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const fetchGameEntry = async (): Promise<GameEntry> => {
        try {
            const item = await prisma.statusItem.findUnique({
                where: { key: 'game' },
            });
            if (item) return JSON.parse(item.value) as GameEntry;
        } catch {}
        return DEFAULT_GAME_ENTRY;
    };

    const fetchGameMeta = async (
        entry: GameEntry
    ): Promise<RAWGGame | null> => {
        try {
            return await RAWGHelpers.getGameById(entry.rawgId);
        } catch {}
        return null;
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const gameEntry: GameEntry = await fetchGameEntry();
    const gameMeta: RAWGGame | null = await fetchGameMeta(gameEntry);

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <GamePanel
            initialEntry={gameEntry}
            initialMeta={gameMeta}
            icon={icon}
            className={className}
        />
    );
};

export default GamePanelData;
