import GlitchText from '@/components/common/GlitchText/GlitchText';
import { prisma } from '@/lib/static/prisma';
import { Game } from '@/lib/static/types';
import GamesContent from './GamesContent/GamesContent';
import styles from './GamesPage.module.scss';

const GamesPage = async () => {
    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const fetchHighlightedGame = async (list: Game[]): Promise<Game | null> => {
        try {
            const item = await prisma.highlights.findUnique({
                where: { key: 'game' },
            });
            if (!item) return null;
            return list.find((g) => g.name === item.value) ?? null;
        } catch {
            return null;
        }
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const records = await prisma.games.findMany({
        orderBy: [{ rating: 'desc' }, { name: 'asc' }],
    });
    const games: Game[] = records.map((g) => ({
        name: g.name,
        genre: g.genre,
        icon: g.icon,
        rating: g.rating,
    }));
    const highlightedGame: Game | null = await fetchHighlightedGame(games);

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['games-page']}>
            <div className={styles.content}>
                <GlitchText text="GAMES" className={styles.title} />
                <GamesContent
                    initialGames={games}
                    highlightedGame={highlightedGame}
                />
            </div>
        </div>
    );
};

export default GamesPage;
