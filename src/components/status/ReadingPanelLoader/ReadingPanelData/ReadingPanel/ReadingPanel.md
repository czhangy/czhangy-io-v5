# ReadingPanel

Client component for the Reading status panel. Displays up to 3 recently-added books with cover, title, and genre tags. Admin users can search and add books via the Google Books API using the + button.

## Props

| Prop             | Type               | Required | Default | Description                           |
| ---------------- | ------------------ | -------- | ------- | ------------------------------------- |
| `initialEntries` | `ReadMediaEntry[]` | Yes      | —       | Most recent books fetched from the DB |
| `label`          | `string`           | Yes      | —       | Panel header label                    |
| `icon`           | `React.ReactNode`  | Yes      | —       | Panel header icon                     |
| `cols`           | `number`           | Yes      | —       | Grid column span                      |
| `rows`           | `number`           | No       | `1`     | Grid row span                         |

## State

| State           | Type                 | Initial value    | Description                           |
| --------------- | -------------------- | ---------------- | ------------------------------------- |
| `entries`       | `ReadMediaEntry[]`   | `initialEntries` | Currently displayed books             |
| `isAdding`      | `boolean`            | `false`          | Whether the search form is open       |
| `query`         | `string`             | `''`             | Current search input value            |
| `searchResults` | `BookSearchResult[]` | `[]`             | Results returned from book search     |
| `isSearching`   | `boolean`            | `false`          | Whether a search request is in flight |
