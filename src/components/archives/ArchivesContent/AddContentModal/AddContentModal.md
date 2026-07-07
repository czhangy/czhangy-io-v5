# AddContentModal

Modal for searching and adding a movie or TV show to the archives. Thin wrapper around AddSearchableModal that supplies the debounced TMDB search and the POST to `/api/content`.

## Props

| Prop      | Type                        | Required | Default | Description                                               |
| --------- | --------------------------- | -------- | ------- | --------------------------------------------------------- |
| `onClose` | `() => void`                | Yes      | —       | Called when the modal should close                        |
| `onAdd`   | `(entry: Content) => void`  | Yes      | —       | Called with the saved entry after a successful add        |
| `onError` | `(message: string) => void` | Yes      | —       | Called with the error message (e.g. duplicate) on failure |

## Handlers

- `handleSearch` — fetches `/api/tmdb/search` for the given query, returning an empty array on failure
- `handleSelect` — POSTs the selected TMDB result to `/api/content` with `isOldEntry: true` and `preventDuplicate: true`, backdating `addedAt` to the epoch; returns `{ saved }` on success or `{ error }` (a duplicate message on 409, a generic message on other failures)
