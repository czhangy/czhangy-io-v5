# AddGameModal

Modal that wraps GameForm to create a new game, POSTing to the games API on submit.

## Props

| Prop      | Type                   | Required | Default | Description                             |
| --------- | ---------------------- | -------- | ------- | --------------------------------------- |
| `onClose` | `() => void`           | Yes      | —       | Called to dismiss the modal             |
| `onAdd`   | `(game: Game) => void` | Yes      | —       | Called with the created game on success |

## Handlers

- `handleSubmit` — posts the form values to `/api/games`, throwing on failure so GameForm can surface the error
