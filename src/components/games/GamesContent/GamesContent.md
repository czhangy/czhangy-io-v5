# GamesContent

Client component that renders the full games list with admin controls for adding, editing, and deleting entries. The controls bar (back link, add button, pagination) is rendered via Controls, with AddGameModal opened from the add button.

## Props

| Prop           | Type     | Required | Default | Description                       |
| -------------- | -------- | -------- | ------- | --------------------------------- |
| `initialGames` | `Game[]` | Yes      | —       | Games fetched server-side at load |

## State

| State         | Type           | Initial value  | Description                                  |
| ------------- | -------------- | -------------- | -------------------------------------------- |
| `games`       | `Game[]`       | `initialGames` | Current list of games, kept sorted by rating |
| `editingGame` | `Game \| null` | `null`         | Game being edited, or null if none open      |
| `isAddOpen`   | `boolean`      | `false`        | Whether AddGameModal is open                 |

## Handlers

- `handleAdd` — inserts the newly created game and navigates to the page it lands on
- `handleUpdate` — merges an edited game into the list, re-sorts, and closes the edit modal
- `handleDelete` — removes a game by name and clamps the page if necessary

## Computations

- `totalPages` — total page count derived from `games.length` and `ITEMS_PER_PAGE`
- `paginatedGames` — slice of `games` for the current page
- `isAdmin` — whether the current session role is `ADMIN`
