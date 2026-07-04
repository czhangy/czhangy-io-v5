# CardistryPanel

A status panel displaying the cardistry move currently being practiced. Admins can select an existing move via a PanelSelect dropdown to mark it as active.

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
| `isEditing`  | `boolean`                  | `false`       | Whether the edit dropdown is open         |
| `moves`      | `CardistryMoveEntry[]`     | `[]`          | All moves fetched when entering edit mode |

## Effects

- **On `isEditing` change** — attaches/detaches a `mousedown` listener to close the dropdown when clicking outside
