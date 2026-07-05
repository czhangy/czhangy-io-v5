import { NBAGameResponse, NBATeamResponse } from '@/lib/static/types';

const BASE_URL =
    'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams';

type ESPNLogo = {
    href: string;
    rel: string[];
};

type ESPNScore = {
    displayValue: string;
};

type ESPNTeam = {
    id: string;
    displayName: string;
    abbreviation: string;
    logos: ESPNLogo[];
};

type ESPNRecord = {
    type: string;
    displayValue: string;
};

type ESPNCompetitor = {
    homeAway: 'home' | 'away';
    winner?: boolean;
    team: ESPNTeam;
    score?: ESPNScore;
    record?: ESPNRecord[];
};

type ESPNEvent = {
    date: string;
    competitions: { competitors: ESPNCompetitor[] }[];
};

type ESPNScheduleResponse = {
    events: ESPNEvent[];
};

type ESPNTeamResponse = {
    team: {
        groups?: { parent?: { id: string } };
        record: {
            items: {
                type: string;
                stats: { name: string; value: number }[];
            }[];
        };
    };
};

export default class NBAHelpers {
    // -------------------------------------------------------------------------
    // PRIVATE
    // -------------------------------------------------------------------------

    private static async fetchSchedule(
        seasonType: number
    ): Promise<ESPNEvent[]> {
        const response = await fetch(
            `${BASE_URL}/9/schedule?seasontype=${seasonType}`,
            { next: { revalidate: 3600 } }
        );
        if (!response.ok) return [];
        const data = (await response.json()) as ESPNScheduleResponse;
        return data.events ?? [];
    }

    private static ordinal(n: number): string {
        const rem100 = n % 100;
        const rem10 = n % 10;
        if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
        if (rem10 === 1) return `${n}st`;
        if (rem10 === 2) return `${n}nd`;
        if (rem10 === 3) return `${n}rd`;
        return `${n}th`;
    }

    private static async fetchTeamDetails(
        teamId: string
    ): Promise<{ streak: string; standing: string }> {
        const response = await fetch(`${BASE_URL}/${teamId}`, {
            next: { revalidate: 3600 },
        });
        if (!response.ok) return { streak: '', standing: '' };
        const data = (await response.json()) as ESPNTeamResponse;
        const overall = data.team.record.items.find((r) => r.type === 'total');

        const streakVal = Math.round(
            overall?.stats.find((s) => s.name === 'streak')?.value ?? 0
        );
        const streak =
            streakVal > 0
                ? `W${streakVal}`
                : streakVal < 0
                  ? `L${Math.abs(streakVal)}`
                  : '';

        const seed = Math.round(
            overall?.stats.find((s) => s.name === 'playoffSeed')?.value ?? 0
        );
        const conferenceId = data.team.groups?.parent?.id;
        const conference =
            conferenceId === '5' ? 'East' : conferenceId === '6' ? 'West' : '';
        const standing =
            seed && conference
                ? `${NBAHelpers.ordinal(seed)} in ${conference}`
                : '';

        return { streak, standing };
    }

    private static isCompleted(event: ESPNEvent): boolean {
        return (
            event.competitions[0]?.competitors.every(
                (c) => !!c.score?.displayValue
            ) ?? false
        );
    }

    private static getDarkLogo(logos: ESPNLogo[]): string {
        return (
            logos.find((l) => l.rel.includes('dark'))?.href ??
            logos[0]?.href ??
            ''
        );
    }

    // -------------------------------------------------------------------------
    // PUBLIC
    // -------------------------------------------------------------------------

    static async getLastWarriorsGame(): Promise<NBAGameResponse | null> {
        const [regular, post] = await Promise.all([
            NBAHelpers.fetchSchedule(2),
            NBAHelpers.fetchSchedule(3),
        ]);

        const last = [...regular, ...post]
            .filter(NBAHelpers.isCompleted)
            .sort(
                (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
            )[0];

        if (!last) return null;

        const competitors = last.competitions[0].competitors;
        const away = competitors.find((c) => c.homeAway === 'away')!;
        const home = competitors.find((c) => c.homeAway === 'home')!;

        const [awayDetails, homeDetails] = await Promise.all([
            NBAHelpers.fetchTeamDetails(away.team.id),
            NBAHelpers.fetchTeamDetails(home.team.id),
        ]);

        const mapTeam = (
            c: ESPNCompetitor,
            details: { streak: string; standing: string }
        ): NBATeamResponse => ({
            abbreviation: c.team.abbreviation,
            displayName: c.team.displayName,
            logo: NBAHelpers.getDarkLogo(c.team.logos),
            score: c.score!.displayValue,
            record:
                c.record?.find((r) => r.type === 'total')?.displayValue ?? '',
            streak: details.streak,
            standing: details.standing,
            isWinner: c.winner ?? false,
            isHome: c.homeAway === 'home',
            isWarriors: c.team.abbreviation === 'GS',
        });

        return {
            date: last.date,
            away: mapTeam(away, awayDetails),
            home: mapTeam(home, homeDetails),
        };
    }
}
