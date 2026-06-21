# AddAchievementModal

A form modal for creating a new achievement. Uses the common Modal shell for overlay, animations, title, and close button. Validates all fields before submitting to the API, then refreshes the achievements list on success.

## Props

| Prop      | Type         | Required | Default | Description                 |
| --------- | ------------ | -------- | ------- | --------------------------- |
| `onClose` | `() => void` | Yes      | —       | Called to dismiss the modal |

## State

| State          | Type                     | Initial value | Description                       |
| -------------- | ------------------------ | ------------- | --------------------------------- |
| `tier`         | `number`                 | `1`           | Selected tier (1–3)               |
| `name`         | `string`                 | `''`          | Name field value                  |
| `category`     | `string`                 | `'Life'`      | Selected category                 |
| `description`  | `string`                 | `''`          | Description field value           |
| `date`         | `string`                 | `''`          | Date field value (MM/DD/YYYY)     |
| `errors`       | `Record<string, string>` | `{}`          | Field-level and form-level errors |
| `isSubmitting` | `boolean`                | `false`       | Whether a submission is in flight |

## Computations

- `validate` — runs all field validation rules and returns a map of field name → error message
