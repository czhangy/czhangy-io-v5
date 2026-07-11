# JobForm

Shared form for creating and editing a job entry (company, title, logo, and start/end date), used by both AddJobModal and EditJobModal.

## Props

| Prop            | Type                                         | Required | Default | Description                                                   |
| --------------- | -------------------------------------------- | -------- | ------- | ------------------------------------------------------------- |
| `submitLabel`   | `string`                                     | Yes      | —       | Label for the submit button (e.g. "Add" or "Save")            |
| `initialValues` | `Partial<CreateJobParams>`                   | No       | —       | Pre-filled field values, used when editing                    |
| `onSubmit`      | `(values: CreateJobParams) => Promise<void>` | Yes      | —       | Called with the form values on submit; throw to show an error |
| `onClose`       | `() => void`                                 | Yes      | —       | Called when Escape is pressed                                 |

## State

| State          | Type      | Initial value                    | Description                                                             |
| -------------- | --------- | -------------------------------- | ----------------------------------------------------------------------- |
| `company`      | `string`  | `initialValues?.company ?? ''`   | Controlled company input                                                |
| `title`        | `string`  | `initialValues?.title ?? ''`     | Controlled title input                                                  |
| `logo`         | `string`  | `initialValues?.logo ?? ''`      | Controlled logo input                                                   |
| `startDate`    | `string`  | `initialValues?.startDate ?? ''` | Controlled start date value (MM/DD/YYYY), via DatePicker                |
| `endDate`      | `string`  | `initialValues?.endDate ?? ''`   | Controlled end date value (MM/DD/YYYY), via DatePicker; blank = Present |
| `error`        | `string`  | `''`                             | Validation or submission error message                                  |
| `isSubmitting` | `boolean` | `false`                          | Whether a submission is in flight                                       |

## Handlers

- `handleSubmit` — validates the form, calls `onSubmit`, and surfaces any thrown error
- `handleKeyDown` — submits on Enter, closes on Escape; forwarded to the Company, Title, and Logo text fields (not the DatePicker fields)

## Computations

- `validate` — returns a validation error message, or an empty string when the form is valid
