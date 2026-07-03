# AddContentModal

Modal for searching and adding a movie or TV show to the watched list. Uses the shared search interface with debounced TMDB lookup. On selection, POSTs to `/api/watched` and notifies the parent with the saved entry.

## Props

| Prop      | Type                                 | Required | Default | Description                                        |
| --------- | ------------------------------------ | -------- | ------- | -------------------------------------------------- |
| `onClose` | `() => void`                         | Yes      | —       | Called when the modal should close                 |
| `onAdd`   | `(entry: WatchedMediaEntry) => void` | Yes      | —       | Called with the saved entry after a successful add |

## State

| State           | Type                 | Initial value | Description                           |
| --------------- | -------------------- | ------------- | ------------------------------------- |
| `query`         | `string`             | `''`          | Current search input value            |
| `searchResults` | `TMDBSearchResult[]` | `[]`          | Results returned from TMDB search     |
| `isSearching`   | `boolean`            | `false`       | Whether a search request is in flight |
