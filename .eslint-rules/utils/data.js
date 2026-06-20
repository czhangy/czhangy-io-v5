const fs = require('fs');

/**
 * Returns true if (s1, s2) is a valid game score.
 * Rules: winner >= 15, margin >= 2, overtime must be exactly 2 apart.
 */
const isValidGameScore = (s1, s2) => {
    const winner = Math.max(s1, s2);
    const loser = Math.min(s1, s2);
    if (winner < 15 || winner - loser < 2) return false;
    if (winner > 15 && loser !== winner - 2) return false;
    return true;
};

/**
 * Returns an object keyed by property name for all non-computed Identifier
 * properties on an ObjectExpression node. Each value is the Property node.
 */
const getNamedProps = (node) => {
    const props = {};
    for (const p of node.properties) {
        if (p.type !== 'Property' || p.computed || p.key.type !== 'Identifier')
            continue;
        props[p.key.name] = p;
    }
    return props;
};

/**
 * Extracts the property name from an `ObjectName.PropName` MemberExpression.
 * Returns null if the node doesn't match the expected shape.
 */
const getMemberName = (node, objectName) => {
    if (!node || node.type !== 'MemberExpression') return null;
    if (node.object.type !== 'Identifier' || node.object.name !== objectName)
        return null;
    if (node.computed || node.property.type !== 'Identifier') return null;
    return node.property.name;
};

const MATCH_PROP_ORDER = ['label', 'maxGames', 'games', 'team1', 'team2'];

/**
 * Returns true if the ObjectExpression node has all 5 MatchModel properties.
 */
const isMatchModel = (node) => {
    const keys = new Set(
        node.properties
            .filter(
                (p) =>
                    p.type === 'Property' &&
                    !p.computed &&
                    p.key.type === 'Identifier'
            )
            .map((p) => p.key.name)
    );
    return MATCH_PROP_ORDER.every((k) => keys.has(k));
};

/**
 * Extracts game score pairs from an ArrayExpression node.
 * Returns null if any element is not a plain `{ team1Score, team2Score }` literal.
 */
const extractGameScores = (gamesNode) => {
    if (!gamesNode || gamesNode.type !== 'ArrayExpression') return null;
    const games = [];
    for (const el of gamesNode.elements) {
        if (!el || el.type !== 'ObjectExpression') return null;
        const game = {};
        for (const p of el.properties) {
            if (
                p.type !== 'Property' ||
                p.computed ||
                p.key.type !== 'Identifier'
            )
                return null;
            if (p.value.type !== 'Literal' || typeof p.value.value !== 'number')
                return null;
            game[p.key.name] = p.value.value;
        }
        if (
            typeof game.team1Score !== 'number' ||
            typeof game.team2Score !== 'number'
        )
            return null;
        games.push(game);
    }
    return games;
};

/**
 * Returns true if the games array represents a valid completed match.
 * One team must reach ceil(maxGames/2) wins, and the last game must be decisive.
 */
const isValidGameCount = (games, maxGames) => {
    const winsNeeded = Math.ceil(maxGames / 2);
    let t1Wins = 0;
    let t2Wins = 0;
    for (const { team1Score: s1, team2Score: s2 } of games) {
        if (s1 > s2) t1Wins++;
        else t2Wins++;
    }
    const lastGame = games[games.length - 1];
    const lastWinner =
        lastGame && lastGame.team1Score > lastGame.team2Score ? 1 : 2;
    return (
        (t1Wins === winsNeeded && t2Wins < winsNeeded && lastWinner === 1) ||
        (t2Wins === winsNeeded && t1Wins < winsNeeded && lastWinner === 2)
    );
};

/**
 * Finds the highest season number N from files in `dir` matching `filenameRegex`.
 * The regex must have exactly one capture group for the season number.
 * Returns null if the directory can't be read or no files match.
 */
const getLatestSeasonN = (dir, filenameRegex) => {
    let allFiles;
    try {
        allFiles = fs.readdirSync(dir).filter((f) => filenameRegex.test(f));
    } catch {
        return null;
    }
    if (allFiles.length === 0) return null;
    return Math.max(
        ...allFiles.map((f) => parseInt(f.match(filenameRegex)[1]))
    );
};

module.exports = {
    isValidGameScore,
    getNamedProps,
    getMemberName,
    isMatchModel,
    extractGameScores,
    isValidGameCount,
    getLatestSeasonN,
    MATCH_PROP_ORDER,
};
