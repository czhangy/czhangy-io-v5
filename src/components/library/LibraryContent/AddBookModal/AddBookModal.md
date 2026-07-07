# AddBookModal

Modal for searching and adding a book to the library. Thin wrapper around AddSearchableModal that supplies the debounced Google Books search and the POST to `/api/books`.

## Props

| Prop      | Type                    | Required | Default | Description                                        |
| --------- | ----------------------- | -------- | ------- | -------------------------------------------------- |
| `onClose` | `() => void`            | Yes      | —       | Called when the modal should close                 |
| `onAdd`   | `(entry: Book) => void` | Yes      | —       | Called with the saved entry after a successful add |

## Handlers

- `handleSearch` — fetches `/api/google_books/search` for the given query, returning an empty array on failure
- `handleSelect` — POSTs the selected result to `/api/books` with `isOldEntry: true`, backdating `addedAt` to the epoch; returns the saved entry or `null` on failure
