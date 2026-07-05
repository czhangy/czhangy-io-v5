# AddBookModal

Modal for searching and adding a book to the library. Uses the shared search interface with debounced Google Books lookup. On selection, POSTs to `/api/read` and notifies the parent with the saved entry.

## Props

| Prop      | Type                              | Required | Default | Description                                        |
| --------- | --------------------------------- | -------- | ------- | -------------------------------------------------- |
| `onClose` | `() => void`                      | Yes      | —       | Called when the modal should close                 |
| `onAdd`   | `(entry: ReadMediaEntry) => void` | Yes      | —       | Called with the saved entry after a successful add |

## State

| State           | Type                 | Initial value | Description                           |
| --------------- | -------------------- | ------------- | ------------------------------------- |
| `query`         | `string`             | `''`          | Current search input value            |
| `searchResults` | `BookSearchResult[]` | `[]`          | Results returned from book search     |
| `isSearching`   | `boolean`            | `false`       | Whether a search request is in flight |
