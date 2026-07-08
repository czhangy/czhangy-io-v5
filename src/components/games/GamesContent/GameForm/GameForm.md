# GameForm

Shared form for creating and editing a game (name, genre, icon URL, and rating), used by both AddGameModal and EditGameModal.

## Props

| Prop            | Type                              | Required | Default | Description                                                   |
| --------------- | --------------------------------- | -------- | ------- | ------------------------------------------------------------- |
| `submitLabel`   | `string`                          | Yes      | —       | Label for the submit button (e.g. "Add" or "Save")            |
| `initialValues` | `Partial<Game>`                   | No       | —       | Pre-filled field values, used when editing                    |
| `onSubmit`      | `(values: Game) => Promise<void>` | Yes      | —       | Called with the form values on submit; throw to show an error |
| `onClose`       | `() => void`                      | Yes      | —       | Called when Escape is pressed                                 |

## State

| State          | Type      | Initial value                                     | Description                            |
| -------------- | --------- | ------------------------------------------------- | -------------------------------------- |
| `name`         | `string`  | `initialValues?.name ?? ''`                       | Controlled name input                  |
| `genre`        | `string`  | `initialValues?.genre ?? ''`                      | Controlled genre dropdown              |
| `icon`         | `string`  | `initialValues?.icon ?? ''`                       | Controlled icon URL input              |
| `rating`       | `string`  | `String(initialValues.rating)` if set, else `'1'` | Controlled rating dropdown             |
| `error`        | `string`  | `''`                                              | Validation or submission error message |
| `isSubmitting` | `boolean` | `false`                                           | Whether a submission is in flight      |

## Handlers

- `handleSubmit` — validates the form, calls `onSubmit`, and surfaces any thrown error
- `handleKeyDown` — submits on Enter, closes on Escape

## Computations

- `validate` — returns a validation error message, or an empty string when the form is valid
