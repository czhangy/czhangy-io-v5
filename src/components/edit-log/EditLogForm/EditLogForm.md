# EditLogForm

Thin wrapper around `LogForm` that edits an existing log entry, pre-filled with its current values. Saving PATCHes the entry to the API, then returns to the entry's detail page.

## Props

| Prop    | Type  | Required | Default | Description                                                |
| ------- | ----- | -------- | ------- | ---------------------------------------------------------- |
| `entry` | `Log` | Yes      | —       | The log entry to edit, fetched server-side by EditLogPage. |

## Handlers

- `handleSubmit` — PATCHes the form values to `/api/logs/[id]`, throwing on failure so `LogForm` can surface the error
