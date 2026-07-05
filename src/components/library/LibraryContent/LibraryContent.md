# LibraryContent

Client component rendered by LibraryPage. Displays a paginated list of read media entries with cover, title, author, and genre tags. Admin users see a feature button and a delete button on each row, plus an "Add Book" button in the controls bar.

## Props

| Prop             | Type               | Required | Default | Description                     |
| ---------------- | ------------------ | -------- | ------- | ------------------------------- |
| `initialEntries` | `ReadMediaEntry[]` | Yes      | —       | All library entries from the DB |

## State

| State     | Type               | Initial value    | Description                  |
| --------- | ------------------ | ---------------- | ---------------------------- |
| `entries` | `ReadMediaEntry[]` | `initialEntries` | Currently displayed entries  |
| `page`    | `number`           | `1`              | Current page index (1-based) |

## Handlers

- `handleAdd` — inserts a newly added entry (deduplicating by `id`) into its sorted position and navigates to the page it lands on
- `handleFeature` — re-submits an entry's existing data to `POST /api/books`, bumping its `addedAt` to now without changing any other field
- `handleDelete` — removes an entry by id and clamps the page if necessary

## Computations

- `totalPages` — total page count derived from `entries.length` and `ITEMS_PER_PAGE`
- `paginatedEntries` — slice of `entries` for the current page
- `isAdmin` — whether the current session role is `ADMIN`
