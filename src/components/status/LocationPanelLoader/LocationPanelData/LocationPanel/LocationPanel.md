# LocationPanel

A Status page panel displaying the user's current general location. Admins see an edit button that opens a `SearchInput` backed by `GET /api/locations/search` (Nominatim). Selecting a result immediately persists the location via `PATCH /api/status/location` and closes the search form. Pressing Escape or clicking outside cancels without saving.

## Props

| Prop              | Type              | Required | Default | Description                                     |
| ----------------- | ----------------- | -------- | ------- | ----------------------------------------------- |
| `initialLocation` | `string`          | Yes      | —       | Location string fetched server-side             |
| `label`           | `string`          | Yes      | —       | Panel header label                              |
| `icon`            | `React.ReactNode` | Yes      | —       | Panel header icon                               |
| `cols`            | `number`          | Yes      | —       | Forwarded to the StatusPanel for grid placement |
| `rows`            | `number`          | No       | —       | Forwarded to the StatusPanel for grid placement |

## State

| State         | Type               | Initial value     | Description                               |
| ------------- | ------------------ | ----------------- | ----------------------------------------- |
| `isEditing`   | `boolean`          | `false`           | Whether the search form is open           |
| `location`    | `string`           | `initialLocation` | Persisted location displayed in read mode |
| `query`       | `string`           | `''`              | Current text in the search input          |
| `results`     | `LocationResult[]` | `[]`              | Location suggestions from the API         |
| `isSearching` | `boolean`          | `false`           | Whether an API search is in flight        |

## Effects

- **On query change** — debounces 500 ms then calls `GET /api/locations/search?q=…`

## Computations

- `performSearch` — fetches location suggestions from the API and populates `results`
