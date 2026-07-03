# CardistryPanel

A status panel displaying the cardistry move currently being practiced, with admin-only inline editing to update the name.

## Props

| Prop           | Type              | Required | Default | Description                                     |
| -------------- | ----------------- | -------- | ------- | ----------------------------------------------- |
| `initialEntry` | `SkillEntry`      | Yes      | —       | Skill name from the DB                          |
| `label`        | `string`          | Yes      | —       | Panel header label                              |
| `icon`         | `React.ReactNode` | Yes      | —       | Panel header icon                               |
| `cols`         | `number`          | Yes      | —       | Forwarded to the StatusPanel for grid placement |
| `rows`         | `number`          | No       | —       | Forwarded to the StatusPanel for grid placement |

## State

| State       | Type         | Initial value  | Description                   |
| ----------- | ------------ | -------------- | ----------------------------- |
| `entry`     | `SkillEntry` | `initialEntry` | Currently displayed move name |
| `isEditing` | `boolean`    | `false`        | Whether the edit form is open |
| `draft`     | `string`     | `''`           | Controlled text input value   |

## Effects

- **On `isEditing` change** — attaches/detaches a `mousedown` listener to close the form when clicking outside
