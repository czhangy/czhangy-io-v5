# WatchingPanel

A status panel displaying the shows/movies currently being watched, with admin-only inline search per entry to update them via TVmaze.

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

| State           | Type                     | Initial value    | Description                             |
| --------------- | ------------------------ | ---------------- | --------------------------------------- |
| `entries`       | `ShowEntry[]`            | `initialEntries` | Currently displayed shows               |
| `meta`          | `(TVmazeShow \| null)[]` | `initialMeta`    | Poster and genre data for each show     |
| `editingIndex`  | `number \| null`         | `null`           | Index of the row currently being edited |
| `query`         | `string`                 | `''`             | Controlled search input value           |
| `searchResults` | `TVmazeSearchResult[]`   | `[]`             | Results from the TVmaze search          |
| `isSearching`   | `boolean`                | `false`          | Whether a search fetch is in progress   |

## Effects

- **On debounce (1000ms after query change)** — fires `performSearch` with the current query

## Computations

- `performSearch` — calls `searchShows` from tvmaze.ts and updates `searchResults`
