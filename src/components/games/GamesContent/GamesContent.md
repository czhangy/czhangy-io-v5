# GamesContent

Client component that renders the full games list with admin controls for adding, editing, and deleting entries.

## Props

| Prop           | Type     | Required | Default | Description                       |
| -------------- | -------- | -------- | ------- | --------------------------------- |
| `initialGames` | `Game[]` | Yes      | —       | Games fetched server-side at load |

## State

| State         | Type           | Initial value  | Description                                |
| ------------- | -------------- | -------------- | ------------------------------------------ |
| `games`       | `Game[]`       | `initialGames` | Current list of games, kept sorted by name |
| `editingGame` | `Game \| null` | `null`         | Game being edited, or null if none open    |
