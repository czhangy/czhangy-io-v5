# EditMoveModal

A modal for editing an existing cardistry move's name, type, and count.

## Props

| Prop      | Type                   | Required | Default | Description                               |
| --------- | ---------------------- | -------- | ------- | ----------------------------------------- |
| `move`    | `Move`                 | Yes      | —       | The move to edit; used to pre-fill fields |
| `onClose` | `() => void`           | Yes      | —       | Called when the modal should close        |
| `onEdit`  | `(move: Move) => void` | Yes      | —       | Called with the updated move on success   |

## State

| State   | Type     | Initial value        | Description              |
| ------- | -------- | -------------------- | ------------------------ |
| `name`  | `string` | `move.name`          | Controlled name input    |
| `type`  | `string` | `move.type`          | Controlled type dropdown |
| `count` | `string` | `String(move.count)` | Controlled count input   |

## Computations

- `isValid` — true when name and type are non-empty and count is a valid non-negative integer
