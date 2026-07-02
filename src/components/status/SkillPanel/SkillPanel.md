# SkillPanel

A status panel displaying the skill currently being learned, with admin-only inline editing to update the name and category.

## Props

| Prop           | Type              | Required | Default | Description                         |
| -------------- | ----------------- | -------- | ------- | ----------------------------------- |
| `initialEntry` | `SkillEntry`      | Yes      | —       | Skill name and category from the DB |
| `icon`         | `React.ReactNode` | No       | —       | Forwarded to the StatusPanel icon   |
| `className`    | `string`          | No       | —       | Class forwarded to the StatusPanel  |

## State

| State           | Type            | Initial value           | Description                     |
| --------------- | --------------- | ----------------------- | ------------------------------- |
| `entry`         | `SkillEntry`    | `initialEntry`          | Currently displayed skill       |
| `isEditing`     | `boolean`       | `false`                 | Whether the edit form is open   |
| `draft`         | `string`        | `''`                    | Controlled text input value     |
| `draftCategory` | `SkillCategory` | `initialEntry.category` | Selected category while editing |
