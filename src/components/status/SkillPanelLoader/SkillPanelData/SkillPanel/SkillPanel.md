# SkillPanel

A status panel displaying the skill currently being learned, with admin-only inline editing to update the name and category.

## Props

| Prop           | Type              | Required | Default | Description                                     |
| -------------- | ----------------- | -------- | ------- | ----------------------------------------------- |
| `initialEntry` | `SkillEntry`      | Yes      | —       | Skill name and category from the DB             |
| `label`        | `string`          | Yes      | —       | Panel header label                              |
| `icon`         | `React.ReactNode` | Yes      | —       | Panel header icon                               |
| `cols`         | `number`          | Yes      | —       | Forwarded to the StatusPanel for grid placement |
| `rows`         | `number`          | No       | —       | Forwarded to the StatusPanel for grid placement |

## State

| State           | Type            | Initial value           | Description                     |
| --------------- | --------------- | ----------------------- | ------------------------------- |
| `entry`         | `SkillEntry`    | `initialEntry`          | Currently displayed skill       |
| `isEditing`     | `boolean`       | `false`                 | Whether the edit form is open   |
| `draft`         | `string`        | `''`                    | Controlled text input value     |
| `draftCategory` | `SkillCategory` | `initialEntry.category` | Selected category while editing |
