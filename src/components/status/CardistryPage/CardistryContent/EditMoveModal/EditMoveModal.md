# EditMoveModal

A modal for editing an existing cardistry move's name, type, and count.

## Props

| Prop      | Type                                 | Required | Default | Description                               |
| --------- | ------------------------------------ | -------- | ------- | ----------------------------------------- |
| `move`    | `CardistryMoveEntry`                 | Yes      | —       | The move to edit; used to pre-fill fields |
| `onClose` | `() => void`                         | Yes      | —       | Called when the modal should close        |
| `onEdit`  | `(move: CardistryMoveEntry) => void` | Yes      | —       | Called with the updated move on success   |

## State

| State   | Type     | Initial value | Description                   |
| ------- | -------- | ------------- | ----------------------------- |
| `name`  | `string` | `move.name`   | Controlled name input         |
| `type`  | `string` | `move.type`   | Controlled type select        |
| `count` | `number` | `move.count`  | Controlled count number input |
