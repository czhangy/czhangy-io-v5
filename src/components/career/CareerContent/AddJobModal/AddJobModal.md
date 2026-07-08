# AddJobModal

Modal that wraps JobForm to create a new job entry, POSTing to the career API on submit.

## Props

| Prop      | Type                 | Required | Default | Description                            |
| --------- | -------------------- | -------- | ------- | -------------------------------------- |
| `onClose` | `() => void`         | Yes      | —       | Called to dismiss the modal            |
| `onAdd`   | `(job: Job) => void` | Yes      | —       | Called with the created job on success |

## Handlers

- `handleSubmit` — posts the form values to `/api/career`, throwing on failure so JobForm can surface the error
