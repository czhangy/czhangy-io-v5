# AddMoveModal

Modal that wraps MoveForm to create a new cardistry move, POSTing to the moves API on submit.

## Props

| Prop      | Type                   | Required | Default | Description                                       |
| --------- | ---------------------- | -------- | ------- | ------------------------------------------------- |
| `onClose` | `() => void`           | Yes      | —       | Called to dismiss the modal                       |
| `onAdd`   | `(move: Move) => void` | Yes      | —       | Called with the saved move after a successful add |

## Handlers

- `handleSubmit` — posts the form values to `/api/moves`, throwing on failure so MoveForm can surface the error
