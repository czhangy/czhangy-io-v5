# GamesControls

Controls bar at the top of the games page with a back link and an admin-only Add Game button.

## Props

| Prop      | Type                   | Required | Default | Description                             |
| --------- | ---------------------- | -------- | ------- | --------------------------------------- |
| `isAdmin` | `boolean`              | Yes      | —       | Whether to show the Add Game button     |
| `onAdd`   | `(game: Game) => void` | Yes      | —       | Called with the new game after creation |

## State

| State    | Type      | Initial value | Description                      |
| -------- | --------- | ------------- | -------------------------------- |
| `isOpen` | `boolean` | `false`       | Whether the AddGameModal is open |
