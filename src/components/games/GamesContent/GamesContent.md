# GamesContent

Client component that renders the full games list with admin controls for adding, editing, and deleting entries. The controls bar (back link, add button, pagination) is rendered via Controls, with AddGameModal opened from the add button. The currently highlighted game (shown on the status page) is pulled out into a spotlight entry at the top of the page via GameListItem and excluded from the searchable, paginated list below.

## Props

| Prop              | Type           | Required | Default | Description                                                         |
| ----------------- | -------------- | -------- | ------- | ------------------------------------------------------------------- |
| `initialGames`    | `Game[]`       | Yes      | —       | Games fetched server-side at load                                   |
| `highlightedGame` | `Game \| null` | Yes      | —       | Currently highlighted game fetched server-side, or null if none set |

## State

| State             | Type             | Initial value                   | Description                                             |
| ----------------- | ---------------- | ------------------------------- | ------------------------------------------------------- |
| `games`           | `Game[]`         | `initialGames`                  | Current list of games, kept sorted by rating            |
| `editingGame`     | `Game \| null`   | `null`                          | Game being edited, or null if none open                 |
| `isAddOpen`       | `boolean`        | `false`                         | Whether AddGameModal is open                            |
| `highlightedName` | `string \| null` | `highlightedGame?.name ?? null` | Name of the currently highlighted game, or null if none |

## Handlers

- `handleAdd` — inserts the newly created game and navigates to the page it lands on
- `handleUpdate` — merges an edited game into the list, re-sorts, and closes the edit modal
- `handleDelete` — removes a game by name, clamps the page if necessary, and clears the highlight if the deleted game was highlighted

## Computations

- `spotlightGame` — the game in `games` matching `highlightedName`, rendered at the top of the page
- `totalPages` — total page count derived from `games.length` and `ITEMS_PER_PAGE`
- `paginatedGames` — slice of `games` for the current page, excluding the highlighted game
- `isAdmin` — whether the current session role is `ADMIN`
