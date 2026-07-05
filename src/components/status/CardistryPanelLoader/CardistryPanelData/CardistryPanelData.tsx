import { prisma } from '@/lib/static/prisma';
import { Move } from '@/lib/static/types';
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

    const fetchActiveMove = async (): Promise<Move | null> => {
        try {
            const item = await prisma.highlight.findUnique({
                where: { key: 'move' },
            });
            if (!item) return null;
            const move = await prisma.cardistryMove.findUnique({
                where: { name: item.value },
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

    const activeMove: Move | null = await fetchActiveMove();

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
