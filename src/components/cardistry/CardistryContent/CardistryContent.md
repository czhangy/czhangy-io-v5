# CardistryContent

Client component that manages the cardistry move list, pagination state, and add flow for the Cardistry page. The controls bar (back link, add button, pagination) is rendered via ListControls, with AddMoveModal opened from the add button.

## Props

| Prop           | Type     | Required | Default | Description                   |
| -------------- | -------- | -------- | ------- | ----------------------------- |
| `initialMoves` | `Move[]` | Yes      | —       | All moves fetched server-side |

## State

| State               | Type           | Initial value  | Description                                                              |
| ------------------- | -------------- | -------------- | ------------------------------------------------------------------------ |
| `moves`             | `Move[]`       | `initialMoves` | Full sorted list of cardistry moves                                      |
| `page`              | `number`       | `1`            | Current pagination page                                                  |
| `editingMove`       | `Move \| null` | `null`         | Move currently open in the edit modal                                    |
| `incrementingMoves` | `Set<string>`  | `new Set()`    | Names of moves with in-flight increment requests; disables their buttons |
| `isAddOpen`         | `boolean`      | `false`        | Whether AddMoveModal is open                                             |

## Handlers

- `handleAdd` — inserts a newly added move (deduplicating by `name`) into its sorted position and navigates to the page it lands on
- `handleUpdate` — merges an edited move into the list and closes the edit modal
- `handleIncrement` — bumps a move's count by a fixed amount via `PUT /api/moves/:name`, disabling its buttons while in flight
- `handleDelete` — removes a move by name and clamps the page if necessary

## Computations

- `totalPages` — total page count derived from `moves.length` and `ITEMS_PER_PAGE`
- `paginatedMoves` — slice of `moves` for the current page
- `isAdmin` — whether the current session role is `ADMIN`
