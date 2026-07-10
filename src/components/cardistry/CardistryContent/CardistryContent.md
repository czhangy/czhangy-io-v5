# CardistryContent

Client component that manages the cardistry move list, pagination state, and add flow for the Cardistry page. The controls bar (back link, add button, pagination) is rendered via Controls, with AddMoveModal opened from the add button. The currently highlighted move (shown on the status page) is pulled out into a spotlight entry at the top of the page via MoveListItem and excluded from the searchable, paginated list below.

## Props

| Prop              | Type           | Required | Default | Description                                                         |
| ----------------- | -------------- | -------- | ------- | ------------------------------------------------------------------- |
| `initialMoves`    | `Move[]`       | Yes      | —       | All moves fetched server-side                                       |
| `highlightedMove` | `Move \| null` | Yes      | —       | Currently highlighted move fetched server-side, or null if none set |

## State

| State               | Type             | Initial value                   | Description                                                              |
| ------------------- | ---------------- | ------------------------------- | ------------------------------------------------------------------------ |
| `moves`             | `Move[]`         | `initialMoves`                  | Full sorted list of cardistry moves                                      |
| `page`              | `number`         | `1`                             | Current pagination page                                                  |
| `editingMove`       | `Move \| null`   | `null`                          | Move currently open in the edit modal                                    |
| `incrementingMoves` | `Set<string>`    | `new Set()`                     | Names of moves with in-flight increment requests; disables their buttons |
| `isAddOpen`         | `boolean`        | `false`                         | Whether AddMoveModal is open                                             |
| `highlightedName`   | `string \| null` | `highlightedMove?.name ?? null` | Name of the currently highlighted move, or null if none                  |

## Handlers

- `handleAdd` — inserts a newly added move (deduplicating by `name`) into its sorted position and marks it as the highlighted move, mirroring the server always spotlighting newly created moves
- `handleUpdate` — merges an edited move into the list and closes the edit modal
- `handleIncrement` — bumps a move's count by a fixed amount via `PUT /api/moves/:name`, disabling its buttons while in flight
- `handleDelete` — removes a move by name, clamps the page if necessary, and if the deleted move was highlighted, re-spotlights the remaining move with the most recent `createdAt` (persisted server-side via `PATCH /api/moves/:name`), or clears the highlight if none remain

## Computations

- `spotlightMove` — the move in `moves` matching `highlightedName`, rendered at the top of the page
- `totalPages` — total page count derived from `moves.length` and `ITEMS_PER_PAGE`
- `paginatedMoves` — slice of `moves` for the current page, excluding the highlighted move
- `isAdmin` — whether the current session role is `ADMIN`
