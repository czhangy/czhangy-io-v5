# WatchedContent

Client component rendered by WatchedPage. Displays the full list of watched media entries with poster, name, and genre tags. Admin users see a delete button on the right of each row that removes the entry from the DB and filters it from local state.

## Props

| Prop             | Type                  | Required | Default | Description                     |
| ---------------- | --------------------- | -------- | ------- | ------------------------------- |
| `initialEntries` | `WatchedMediaEntry[]` | Yes      | —       | All watched entries from the DB |

## State

| State     | Type                  | Initial value    | Description                 |
| --------- | --------------------- | ---------------- | --------------------------- |
| `entries` | `WatchedMediaEntry[]` | `initialEntries` | Currently displayed entries |
