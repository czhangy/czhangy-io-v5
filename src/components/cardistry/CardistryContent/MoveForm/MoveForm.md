# MoveForm

Shared form for creating and editing a cardistry move (name, type, tutorial, and — when editing — count), used by both AddMoveModal and EditMoveModal.

## Props

| Prop            | Type                                        | Required | Default | Description                                                   |
| --------------- | ------------------------------------------- | -------- | ------- | ------------------------------------------------------------- |
| `submitLabel`   | `string`                                    | Yes      | —       | Label for the submit button (e.g. "Add" or "Save")            |
| `initialValues` | `Partial<Move>`                             | No       | —       | Pre-filled field values, used when editing                    |
| `onSubmit`      | `(values: MoveFormValues) => Promise<void>` | Yes      | —       | Called with the form values on submit; throw to show an error |
| `onClose`       | `() => void`                                | Yes      | —       | Called when Escape is pressed                                 |

## State

| State          | Type      | Initial value                                    | Description                             |
| -------------- | --------- | ------------------------------------------------ | --------------------------------------- |
| `name`         | `string`  | `initialValues?.name ?? ''`                      | Controlled name input                   |
| `type`         | `string`  | `initialValues?.type ?? ''`                      | Controlled type dropdown                |
| `tutorial`     | `string`  | `initialValues?.tutorial ?? ''`                  | Controlled tutorial input               |
| `count`        | `string`  | `String(initialValues.count)` if set, else `'0'` | Controlled count input, edit-only field |
| `error`        | `string`  | `''`                                             | Validation or submission error message  |
| `isSubmitting` | `boolean` | `false`                                          | Whether a submission is in flight       |

## Handlers

- `handleSubmit` — validates the form, calls `onSubmit`, and surfaces any thrown error
- `handleKeyDown` — submits on Enter, closes on Escape

## Computations

- `isEditing` — true when `initialValues` includes a `count`, used to show the Count field and include it in submitted values
- `validate` — returns a validation error message, or an empty string when the form is valid; requires the name to be title case and the tutorial to be a non-empty, valid URL
