# GamePanel

A status panel displaying the game currently being played, with admin-only inline search to update it via RAWG.

## Props

| Prop           | Type               | Required | Default | Description                                     |
| -------------- | ------------------ | -------- | ------- | ----------------------------------------------- |
| `initialEntry` | `GameEntry`        | Yes      | —       | Game name and RAWG ID from the DB               |
| `initialMeta`  | `RAWGGame \| null` | Yes      | —       | Cover image and genres from RAWG                |
| `label`        | `string`           | Yes      | —       | Panel header label                              |
| `icon`         | `React.ReactNode`  | Yes      | —       | Panel header icon                               |
| `cols`         | `number`           | Yes      | —       | Forwarded to the StatusPanel for grid placement |
| `rows`         | `number`           | No       | —       | Forwarded to the StatusPanel for grid placement |

## State

| State           | Type                 | Initial value  | Description                             |
| --------------- | -------------------- | -------------- | --------------------------------------- |
| `entry`         | `GameEntry`          | `initialEntry` | Currently displayed game                |
| `meta`          | `RAWGGame \| null`   | `initialMeta`  | Cover and genre data for displayed game |
| `isEditing`     | `boolean`            | `false`        | Whether the search input is open        |
| `query`         | `string`             | `''`           | Controlled search input value           |
| `searchResults` | `RAWGSearchResult[]` | `[]`           | Results from the RAWG search proxy      |
| `isSearching`   | `boolean`            | `false`        | Whether a search fetch is in progress   |

## Effects

- **On debounce (1000ms after query change)** — fires `performSearch` with the current query

## Computations

- `performSearch` — fetches `/api/games/search` and updates `searchResults`
