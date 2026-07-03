# WatchingPanel

A status panel displaying the 5 most recently added movies and TV shows, with an admin-only "+" button in the header to add a new entry. Adding an entry POSTs to `/api/watched` (which upserts by `tmdbId`), then prepends the saved record to the list, keeping at most 5 entries.

## Props

| Prop             | Type                  | Required | Default | Description                                     |
| ---------------- | --------------------- | -------- | ------- | ----------------------------------------------- |
| `initialEntries` | `WatchedMediaEntry[]` | Yes      | —       | 5 most recent entries from the DB               |
| `label`          | `string`              | Yes      | —       | Panel header label                              |
| `icon`           | `React.ReactNode`     | Yes      | —       | Panel header icon                               |
| `cols`           | `number`              | Yes      | —       | Forwarded to the StatusPanel for grid placement |
| `rows`           | `number`              | No       | —       | Forwarded to the StatusPanel for grid placement |

## State

| State           | Type                  | Initial value    | Description                                     |
| --------------- | --------------------- | ---------------- | ----------------------------------------------- |
| `entries`       | `WatchedMediaEntry[]` | `initialEntries` | Currently displayed entries (most recent first) |
| `isAdding`      | `boolean`             | `false`          | Whether the add search form is visible          |
| `query`         | `string`              | `''`             | Controlled search input value                   |
| `searchResults` | `TMDBSearchResult[]`  | `[]`             | Results from the TMDB search                    |
| `isSearching`   | `boolean`             | `false`          | Whether a search fetch is in progress           |

## Effects

- **On debounce (1000ms after query change)** — fires `performSearch` with the current query

## Computations

- `MAX_ENTRIES` — maximum number of entries to display (5)
- `isAdmin` — whether the current session role is `ADMIN`
- `addButton` — the `PanelButton` with a `PlusIcon` passed as `headerAction`, rendered only when admin and not currently adding
- `performSearch` — fetches `/api/media/search` and updates `searchResults`
