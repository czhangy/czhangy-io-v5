# EditGameModal

Modal form for editing an existing game's name, genre, icon URL, and rating, pre-filled from the current values.

## Props

| Prop      | Type                   | Required | Default | Description                             |
| --------- | ---------------------- | -------- | ------- | --------------------------------------- |
| `game`    | `Game`                 | Yes      | —       | The game being edited                   |
| `onClose` | `() => void`           | Yes      | —       | Called to dismiss the modal             |
| `onEdit`  | `(game: Game) => void` | Yes      | —       | Called with the updated game on success |

## State

| State    | Type     | Initial value                                      | Description                |
| -------- | -------- | -------------------------------------------------- | -------------------------- |
| `name`   | `string` | `game.name`                                        | Controlled name input      |
| `genre`  | `string` | `game.genre`                                       | Controlled genre dropdown  |
| `icon`   | `string` | `game.icon`                                        | Controlled icon URL input  |
| `rating` | `string` | `game.rating !== null ? String(game.rating) : '1'` | Controlled rating dropdown |

## Computations

- `isValid` — true when name, genre, and icon are all non-empty
