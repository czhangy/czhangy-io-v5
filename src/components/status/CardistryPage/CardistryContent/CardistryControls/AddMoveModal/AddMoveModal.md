# AddMoveModal

Modal for adding a new cardistry move. Accepts a move name via text input, POSTs to `/api/cardistry`, and notifies the parent with the saved entry.

## Props

| Prop      | Type                                 | Required | Default | Description                                       |
| --------- | ------------------------------------ | -------- | ------- | ------------------------------------------------- |
| `onClose` | `() => void`                         | Yes      | —       | Called when the modal should close                |
| `onAdd`   | `(move: CardistryMoveEntry) => void` | Yes      | —       | Called with the saved move after a successful add |

## State

| State  | Type     | Initial value | Description            |
| ------ | -------- | ------------- | ---------------------- |
| `name` | `string` | `''`          | Controlled input value |
