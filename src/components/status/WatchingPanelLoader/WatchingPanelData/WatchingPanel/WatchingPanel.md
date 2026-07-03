# WatchingPanel

A status panel displaying the 5 most recently added shows, with an admin-only "+" button in the header to add a new show via TVmaze search. Adding a show prepends it to the list and drops the oldest entry, keeping the list at 5.

## Props

| Prop             | Type                     | Required | Default | Description                                     |
| ---------------- | ------------------------ | -------- | ------- | ----------------------------------------------- |
| `initialEntries` | `ShowEntry[]`            | Yes      | —       | Show names and TVmaze IDs from the DB           |
| `initialMeta`    | `(TVmazeShow \| null)[]` | Yes      | —       | Poster and genre data from TVmaze               |
| `label`          | `string`                 | Yes      | —       | Panel header label                              |
| `icon`           | `React.ReactNode`        | Yes      | —       | Panel header icon                               |
| `cols`           | `number`                 | Yes      | —       | Forwarded to the StatusPanel for grid placement |
| `rows`           | `number`                 | No       | —       | Forwarded to the StatusPanel for grid placement |

## State

| State           | Type                     | Initial value    | Description                                   |
| --------------- | ------------------------ | ---------------- | --------------------------------------------- |
| `entries`       | `ShowEntry[]`            | `initialEntries` | Currently displayed shows (most recent first) |
| `meta`          | `(TVmazeShow \| null)[]` | `initialMeta`    | Poster and genre data for each show           |
| `isAdding`      | `boolean`                | `false`          | Whether the add search form is visible        |
| `query`         | `string`                 | `''`             | Controlled search input value                 |
| `searchResults` | `TVmazeSearchResult[]`   | `[]`             | Results from the TVmaze search                |
| `isSearching`   | `boolean`                | `false`          | Whether a search fetch is in progress         |

## Effects

- **On debounce (1000ms after query change)** — fires `performSearch` with the current query

## Computations

- `MAX_SHOWS` — maximum number of shows to display (5)
- `isAdmin` — whether the current session role is `ADMIN`
- `addButton` — the `PanelButton` with a `PlusIcon` passed as `headerAction`, rendered only when admin and not currently adding
- `performSearch` — calls `searchShows` from TVmazeHelpers and updates `searchResults`
