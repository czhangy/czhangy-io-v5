# AchievementForm

A shared form for creating or editing an achievement. Manages all field state, validation, and submission internally. Calls `onSubmit` with the collected values and displays a form-level error if it throws.

## Props

| Prop            | Type                                               | Required | Default | Description                                                                 |
| --------------- | -------------------------------------------------- | -------- | ------- | --------------------------------------------------------------------------- |
| `initialValues` | `Partial<AchievementFormValues>`                   | No       | `{}`    | Pre-populates fields for edit flows                                         |
| `submitLabel`   | `string`                                           | Yes      | —       | Label for the submit button                                                 |
| `onSubmit`      | `(values: AchievementFormValues) => Promise<void>` | Yes      | —       | Called with form values on valid submit; thrown errors are caught and shown |
| `onCancel`      | `() => void`                                       | Yes      | —       | Called when Cancel is clicked                                               |

## State

| State          | Type                     | Initial value                      | Description                       |
| -------------- | ------------------------ | ---------------------------------- | --------------------------------- |
| `tier`         | `number`                 | `initialValues.tier ?? 1`          | Selected tier (1–3)               |
| `name`         | `string`                 | `initialValues.name ?? ''`         | Name field value                  |
| `category`     | `string`                 | `initialValues.category ?? 'Life'` | Selected category                 |
| `description`  | `string`                 | `initialValues.description ?? ''`  | Description field value           |
| `date`         | `string`                 | `initialValues.date ?? ''`         | Date field value (MM/DD/YYYY)     |
| `errors`       | `Record<string, string>` | `{}`                               | Field-level and form-level errors |
| `isSubmitting` | `boolean`                | `false`                            | Whether a submission is in flight |

## Computations

- `validate` — runs all field validation rules and returns a map of field name → error message
