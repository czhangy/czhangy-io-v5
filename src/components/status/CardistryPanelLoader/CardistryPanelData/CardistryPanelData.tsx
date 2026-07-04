import { prisma } from '@/lib/static/prisma';
import { CardistryMoveEntry } from '@/lib/static/types';
import CardistryPanel from './CardistryPanel/CardistryPanel';

type CardistryPanelDataProps = {
    label: string;
    icon: React.ReactNode;
    cols: number;
    rows?: number;
};

const CardistryPanelData = async ({
    label,
    icon,
    cols,
    rows,
}: CardistryPanelDataProps) => {
    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const fetchActiveMove = async (): Promise<CardistryMoveEntry | null> => {
        try {
            const item = await prisma.statusItem.findUnique({
                where: { key: 'cardistryMove' },
            });
            if (!item) return null;
            const move = await prisma.cardistryMove.findUnique({
                where: { id: parseInt(item.value, 10) },
            });
            if (move) {
                return { ...move, createdAt: move.createdAt.toISOString() };
            }
        } catch {}
        return null;
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const activeMove: CardistryMoveEntry | null = await fetchActiveMove();

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <CardistryPanel
            initialMove={activeMove}
            label={label}
            icon={icon}
            cols={cols}
            rows={rows}
        />
    );
};

export default CardistryPanelData;
