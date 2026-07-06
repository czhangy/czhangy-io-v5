# ArchivesContent

Client component rendered by ArchivesPage. Displays a paginated list of archived media entries with poster, name, and genre tags. Admin users see a highlight button and a delete button on the right of each row — delete removes the entry from the DB and filters it from local state. The controls bar (back link, add button, pagination) is rendered via ListControls, with AddContentModal opened from the add button.

## Props

| Prop             | Type        | Required | Default | Description                      |
| ---------------- | ----------- | -------- | ------- | -------------------------------- |
| `initialEntries` | `Content[]` | Yes      | —       | All archived entries from the DB |

## State

| State       | Type        | Initial value    | Description                     |
| ----------- | ----------- | ---------------- | ------------------------------- |
| `entries`   | `Content[]` | `initialEntries` | Currently displayed entries     |
| `page`      | `number`    | `1`              | Current page index (1-based)    |
| `isAddOpen` | `boolean`   | `false`          | Whether AddContentModal is open |

## Handlers

- `handleAdd` — inserts a newly added entry (deduplicating by `name`) into its sorted position and navigates to the page it lands on
- `handleFeature` — re-submits an entry's existing data to `POST /api/content`, bumping its `addedAt` to now without changing any other field
- `handleDelete` — removes an entry by name and clamps the page if necessary

## Computations

- `totalPages` — total page count derived from `entries.length` and `ITEMS_PER_PAGE`
- `paginatedEntries` — slice of `entries` for the current page
- `isAdmin` — whether the current session role is `ADMIN`
