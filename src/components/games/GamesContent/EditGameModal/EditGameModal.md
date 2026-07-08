# EditGameModal

Modal that wraps GameForm to edit an existing game, PUTing to the games API on submit.

## Props

| Prop      | Type                   | Required | Default | Description                             |
| --------- | ---------------------- | -------- | ------- | --------------------------------------- |
| `game`    | `Game`                 | Yes      | —       | Game being edited                       |
| `onClose` | `() => void`           | Yes      | —       | Called to dismiss the modal             |
| `onEdit`  | `(game: Game) => void` | Yes      | —       | Called with the updated game on success |

## Handlers

- `handleSubmit` — puts the form values to `/api/games/[name]`, throwing on failure so GameForm can surface the error
