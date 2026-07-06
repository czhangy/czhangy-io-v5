# AddGameModal

Modal form for creating a new game with name, genre, icon URL, and rating fields.

## Props

| Prop      | Type                   | Required | Default | Description                             |
| --------- | ---------------------- | -------- | ------- | --------------------------------------- |
| `onClose` | `() => void`           | Yes      | —       | Called to dismiss the modal             |
| `onAdd`   | `(game: Game) => void` | Yes      | —       | Called with the created game on success |

## State

| State    | Type     | Initial value | Description                |
| -------- | -------- | ------------- | -------------------------- |
| `name`   | `string` | `''`          | Controlled name input      |
| `genre`  | `string` | `''`          | Controlled genre dropdown  |
| `icon`   | `string` | `''`          | Controlled icon URL input  |
| `rating` | `string` | `'1'`         | Controlled rating dropdown |

## Computations

- `isValid` — true when name, genre, and icon are all non-empty
