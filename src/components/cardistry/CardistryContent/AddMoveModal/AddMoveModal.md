# AddMoveModal

Modal for adding a new cardistry move. Accepts a move name and type, POSTs to `/api/moves`, and notifies the parent with the saved entry.

## Props

| Prop      | Type                   | Required | Default | Description                                       |
| --------- | ---------------------- | -------- | ------- | ------------------------------------------------- |
| `onClose` | `() => void`           | Yes      | —       | Called when the modal should close                |
| `onAdd`   | `(move: Move) => void` | Yes      | —       | Called with the saved move after a successful add |

## State

| State  | Type     | Initial value | Description              |
| ------ | -------- | ------------- | ------------------------ |
| `name` | `string` | `''`          | Controlled name input    |
| `type` | `string` | `''`          | Controlled type dropdown |
