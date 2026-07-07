# AddSearchableModal

A modal that debounces a text query, searches an external source, and lets the user pick a result to add. If `onSelect` reports an error (e.g. a duplicate entry), the modal closes and hands the message to `onError` rather than staying open. Generic over the raw search result type and the saved entity type returned after adding.

## Props

| Prop          | Type                                                        | Required | Default | Description                                                                            |
| ------------- | ----------------------------------------------------------- | -------- | ------- | -------------------------------------------------------------------------------------- |
| `title`       | `string`                                                    | Yes      | —       | Modal title                                                                            |
| `placeholder` | `string`                                                    | Yes      | —       | Search input placeholder                                                               |
| `search`      | `(query: string) => Promise<TResult[]>`                     | Yes      | —       | Fetches search results for the debounced query                                         |
| `toResult`    | `(result: TResult) => { id, name, note?, image?, genres? }` | Yes      | —       | Maps a raw result to the shape SearchInput renders                                     |
| `onSelect`    | `(result: TResult) => Promise<SelectOutcome<TSaved>>`       | Yes      | —       | Persists the selected result; returns `{ saved }` on success or `{ error }` on failure |
| `onClose`     | `() => void`                                                | Yes      | —       | Called when the modal should close                                                     |
| `onAdd`       | `(saved: TSaved) => void`                                   | Yes      | —       | Called with the saved entity after a successful select                                 |
| `onError`     | `(message: string) => void`                                 | Yes      | —       | Called with the error message when `onSelect` fails, after the modal has closed        |

## State

| State           | Type        | Initial value | Description                           |
| --------------- | ----------- | ------------- | ------------------------------------- |
| `query`         | `string`    | `''`          | Controlled search input value         |
| `searchResults` | `TResult[]` | `[]`          | Results for the current query         |
| `isSearching`   | `boolean`   | `false`       | Whether a search request is in flight |

## Handlers

- `handleQueryChange` — updates `query` and debounces a call to `search` by 1 second
- `handleSelectResult` — looks up the selected result by id, calls `onSelect`, and either closes the modal and calls `onError`, or calls `onAdd` then `onClose`
- `handleClear` — resets the query and results
- `handleKeyDown` — closes the modal on Escape
