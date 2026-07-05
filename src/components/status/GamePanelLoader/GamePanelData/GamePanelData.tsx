import { prisma } from '@/lib/static/prisma';
import { Game } from '@/lib/static/types';
import GamePanel from './GamePanel/GamePanel';

type GamePanelDataProps = {
    label: string;
    icon: React.ReactNode;
    cols: number;
    rows?: number;
};

const GamePanelData = async ({
    label,
    icon,
    cols,
    rows,
}: GamePanelDataProps) => {
    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const fetchGame = async (): Promise<Game | null> => {
        try {
            const item = await prisma.highlights.findUnique({
                where: { key: 'game' },
            });
            if (!item) return null;
            return await prisma.games.findUnique({
                where: { name: item.value },
            });
        } catch {}
        return null;
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const game: Game | null = await fetchGame();

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <GamePanel
            initialGame={game}
            label={label}
            icon={icon}
            cols={cols}
            rows={rows}
        />
    );
};

export default GamePanelData;
