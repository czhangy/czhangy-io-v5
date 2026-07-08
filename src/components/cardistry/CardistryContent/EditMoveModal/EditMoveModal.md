# EditMoveModal

Modal that wraps MoveForm to edit an existing cardistry move, PUTing to the moves API on submit.

## Props

| Prop      | Type                   | Required | Default | Description                                |
| --------- | ---------------------- | -------- | ------- | ------------------------------------------ |
| `move`    | `Move`                 | Yes      | —       | Move being edited; used to pre-fill fields |
| `onClose` | `() => void`           | Yes      | —       | Called to dismiss the modal                |
| `onEdit`  | `(move: Move) => void` | Yes      | —       | Called with the updated move on success    |

## Handlers

- `handleSubmit` — puts the form values to `/api/moves/[name]`, throwing on failure so MoveForm can surface the error
