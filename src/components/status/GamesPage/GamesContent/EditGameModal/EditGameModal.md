# EditGameModal

Modal form for editing an existing game's name, genre, and icon URL, pre-filled from the current values.

## Props

| Prop      | Type                   | Required | Default | Description                             |
| --------- | ---------------------- | -------- | ------- | --------------------------------------- |
| `game`    | `Game`                 | Yes      | —       | The game being edited                   |
| `onClose` | `() => void`           | Yes      | —       | Called to dismiss the modal             |
| `onEdit`  | `(game: Game) => void` | Yes      | —       | Called with the updated game on success |

## State

| State   | Type     | Initial value | Description               |
| ------- | -------- | ------------- | ------------------------- |
| `name`  | `string` | `game.name`   | Controlled name input     |
| `genre` | `string` | `game.genre`  | Controlled genre input    |
| `icon`  | `string` | `game.icon`   | Controlled icon URL input |

## Computations

- `isValid` — true when all three fields are non-empty
