# WatchedContent

Client component rendered by WatchedPage. Displays a paginated list of watched media entries with poster, name, and genre tags. Admin users see a delete button on the right of each row that removes the entry from the DB and filters it from local state. Pagination controls appear at the top right (via WatchedControls) and centered at the bottom.

## Props

| Prop             | Type                  | Required | Default | Description                     |
| ---------------- | --------------------- | -------- | ------- | ------------------------------- |
| `initialEntries` | `WatchedMediaEntry[]` | Yes      | —       | All watched entries from the DB |

## State

| State     | Type                  | Initial value    | Description                  |
| --------- | --------------------- | ---------------- | ---------------------------- |
| `entries` | `WatchedMediaEntry[]` | `initialEntries` | Currently displayed entries  |
| `page`    | `number`              | `1`              | Current page index (1-based) |

## Handlers

- `handleAdd` — prepends a newly added entry (deduplicating by `tmdbId`) and resets to page 1
- `handleDelete` — removes an entry by id and clamps the page if necessary

## Computations

- `totalPages` — total page count derived from `entries.length` and `ITEMS_PER_PAGE`
- `paginatedEntries` — slice of `entries` for the current page
- `isAdmin` — whether the current session role is `ADMIN`
