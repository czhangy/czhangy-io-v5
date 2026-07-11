# AchievementForm

A shared form for creating or editing an achievement. Manages all field state, validation, and submission internally. Calls `onSubmit` with the collected values and displays a form-level error if it throws.

## Props

| Prop            | Type                                                 | Required | Default | Description                                                                 |
| --------------- | ---------------------------------------------------- | -------- | ------- | --------------------------------------------------------------------------- |
| `submitLabel`   | `string`                                             | Yes      | —       | Label for the submit button                                                 |
| `initialValues` | `Partial<CreateAchievementParams>`                   | No       | —       | Pre-populates fields for edit flows                                         |
| `onSubmit`      | `(values: CreateAchievementParams) => Promise<void>` | Yes      | —       | Called with form values on valid submit; thrown errors are caught and shown |

## State

| State          | Type      | Initial value                      | Description                                   |
| -------------- | --------- | ---------------------------------- | --------------------------------------------- |
| `tier`         | `number`  | `initialValues?.tier ?? 0`         | Selected tier (1–3); `0` = unset              |
| `name`         | `string`  | `initialValues?.name ?? ''`        | Name field value                              |
| `category`     | `string`  | `initialValues?.category ?? ''`    | Selected category                             |
| `description`  | `string`  | `initialValues?.description ?? ''` | Description field value                       |
| `date`         | `string`  | `initialValues?.date ?? TODAY`     | Date field value (MM/DD/YYYY), via DatePicker |
| `error`        | `string`  | `''`                               | Form-level validation or submission error     |
| `isSubmitting` | `boolean` | `false`                            | Whether a submission is in flight             |

## Handlers

- `handleSubmit` — validates the form, calls `onSubmit`, and surfaces any thrown error
- `handleTierChange` — updates `tier` from the Tier Dropdown
- `handleCategoryChange` — updates `category` from the Category Dropdown

## Computations

- `validate` — runs all field validation rules and returns an error message, or an empty string when the form is valid
