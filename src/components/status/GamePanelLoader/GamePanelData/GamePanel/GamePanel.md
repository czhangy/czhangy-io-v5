# GamePanel

A status panel displaying the game currently being played, with admin-only edit mode to select an existing game or create a new one from a single unified interface.

## Props

| Prop           | Type               | Required | Default | Description                                     |
| -------------- | ------------------ | -------- | ------- | ----------------------------------------------- |
| `initialEntry` | `GameEntry`        | Yes      | —       | Game name and ID from the DB                    |
| `initialMeta`  | `RAWGGame \| null` | Yes      | —       | Cover image and genres for display              |
| `label`        | `string`           | Yes      | —       | Panel header label                              |
| `icon`         | `React.ReactNode`  | Yes      | —       | Panel header icon                               |
| `cols`         | `number`           | Yes      | —       | Forwarded to the StatusPanel for grid placement |
| `rows`         | `number`           | No       | —       | Forwarded to the StatusPanel for grid placement |

## State

| State        | Type               | Initial value  | Description                                                 |
| ------------ | ------------------ | -------------- | ----------------------------------------------------------- |
| `entry`      | `GameEntry`        | `initialEntry` | Currently displayed game                                    |
| `meta`       | `RAWGGame \| null` | `initialMeta`  | Cover and genre data for the displayed game                 |
| `isEditing`  | `boolean`          | `false`        | Whether the edit form is open                               |
| `games`      | `Game[]`           | `[]`           | All games fetched from the DB when edit opens               |
| `isFetching` | `boolean`          | `false`        | Whether the initial games fetch is in progress              |
| `newName`    | `string`           | `''`           | Name input; also used to filter the existing games dropdown |
| `newGenre`   | `string`           | `''`           | Genre input for creating a new game                         |
| `newIcon`    | `string`           | `''`           | Icon URL input for creating a new game                      |
| `isSaving`   | `boolean`          | `false`        | Whether the new game POST request is in progress            |

## Computations

- `filteredGames` — `games` filtered by case-insensitive match against `newName`; shown in the dropdown beneath the name input
- `canSave` — true when all three new-game fields are non-empty
