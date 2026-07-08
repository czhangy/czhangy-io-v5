# EditJobModal

Modal that wraps JobForm to edit an existing job entry, PUTing to the career API on submit.

## Props

| Prop      | Type                 | Required | Default | Description                            |
| --------- | -------------------- | -------- | ------- | -------------------------------------- |
| `job`     | `Job`                | Yes      | —       | Job being edited                       |
| `onClose` | `() => void`         | Yes      | —       | Called to dismiss the modal            |
| `onEdit`  | `(job: Job) => void` | Yes      | —       | Called with the updated job on success |

## Handlers

- `handleSubmit` — puts the form values to `/api/career/[id]`, throwing on failure so JobForm can surface the error
