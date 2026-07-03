# CardistryPanel

A status panel displaying the cardistry move currently being practiced. Admins can add new moves or select an existing one to mark as active.

## Props

| Prop          | Type                       | Required | Default | Description                                     |
| ------------- | -------------------------- | -------- | ------- | ----------------------------------------------- |
| `initialMove` | `CardistryMoveEntry\|null` | Yes      | —       | Active move fetched server-side                 |
| `label`       | `string`                   | Yes      | —       | Panel header label                              |
| `icon`        | `React.ReactNode`          | Yes      | —       | Panel header icon                               |
| `cols`        | `number`                   | Yes      | —       | Forwarded to the StatusPanel for grid placement |
| `rows`        | `number`                   | No       | —       | Forwarded to the StatusPanel for grid placement |

## State

| State        | Type                       | Initial value | Description                               |
| ------------ | -------------------------- | ------------- | ----------------------------------------- |
| `activeMove` | `CardistryMoveEntry\|null` | `initialMove` | Currently displayed move                  |
| `isEditing`  | `boolean`                  | `false`       | Whether the edit form is open             |
| `draft`      | `string`                   | `''`          | Controlled input for a new move name      |
| `moves`      | `CardistryMoveEntry[]`     | `[]`          | All moves fetched when entering edit mode |

## Effects

- **On `isEditing` change** — attaches/detaches a `mousedown` listener to close the form when clicking outside
