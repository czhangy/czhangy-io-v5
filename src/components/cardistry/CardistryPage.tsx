import GlitchText from '@/components/common/GlitchText/GlitchText';
import { prisma } from '@/lib/static/prisma';
import { Move } from '@/lib/static/types';
import CardistryContent from './CardistryContent/CardistryContent';
import styles from './CardistryPage.module.scss';

const CardistryPage = async () => {
    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const fetchHighlightedMove = async (list: Move[]): Promise<Move | null> => {
        try {
            const item = await prisma.highlights.findUnique({
                where: { key: 'move' },
            });
            if (!item) return null;
            return list.find((m) => m.name === item.value) ?? null;
        } catch {
            return null;
        }
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const records = await prisma.moves.findMany({
        orderBy: { createdAt: 'asc' },
    });

    const moves: Move[] = records.map((r) => ({
        name: r.name,
        type: r.type,
        count: r.count,
        createdAt: r.createdAt.toISOString(),
    }));
    const highlightedMove: Move | null = await fetchHighlightedMove(moves);

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['cardistry-page']}>
            <div className={styles.content}>
                <GlitchText text="CARDISTRY" className={styles.title} />
                <CardistryContent
                    initialMoves={moves}
                    highlightedMove={highlightedMove}
                />
            </div>
        </div>
    );
};

export default CardistryPage;
