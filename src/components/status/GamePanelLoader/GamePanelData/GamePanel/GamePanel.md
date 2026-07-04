# GamePanel

A status panel displaying the game currently being played, with admin-only edit mode to select an existing game from the database or create a new one.

## Props

| Prop          | Type              | Required | Default | Description                                     |
| ------------- | ----------------- | -------- | ------- | ----------------------------------------------- |
| `initialGame` | `Game \| null`    | Yes      | —       | Currently active game from the DB, or null      |
| `label`       | `string`          | Yes      | —       | Panel header label                              |
| `icon`        | `React.ReactNode` | Yes      | —       | Panel header icon                               |
| `cols`        | `number`          | Yes      | —       | Forwarded to the StatusPanel for grid placement |
| `rows`        | `number`          | No       | —       | Forwarded to the StatusPanel for grid placement |

## State

| State        | Type           | Initial value | Description                                                 |
| ------------ | -------------- | ------------- | ----------------------------------------------------------- |
| `game`       | `Game \| null` | `initialGame` | Currently displayed game                                    |
| `isEditing`  | `boolean`      | `false`       | Whether the edit form is open                               |
| `games`      | `Game[]`       | `[]`          | All games fetched from the DB when edit opens               |
| `isFetching` | `boolean`      | `false`       | Whether the initial games fetch is in progress              |
| `newName`    | `string`       | `''`          | Name input; also used to filter the existing games dropdown |
| `newGenre`   | `string`       | `''`          | Genre dropdown selection for creating a new game            |
| `newIcon`    | `string`       | `''`          | Icon URL input for creating a new game                      |
| `isSaving`   | `boolean`      | `false`       | Whether the new game POST request is in progress            |

## Computations

- `filteredGames` — `games` filtered by case-insensitive match against `newName`; shown in the dropdown beneath the name input
- `canSave` — true when all three new-game fields are non-empty
