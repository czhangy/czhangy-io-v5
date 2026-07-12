# NewLogForm

Thin wrapper around `LogForm` that creates a new log entry. Publishing posts the entry to the API, which persists it and generates a unique slug, then returns to the logs list. While composing, the in-progress entry is autosaved to a server-side draft every minute so it can be resumed from any device.

## Props

| Prop            | Type                       | Required | Default | Description                                            |
| --------------- | -------------------------- | -------- | ------- | ------------------------------------------------------ |
| `initialValues` | `Partial<CreateLogParams>` | No       | —       | Pre-filled field values, loaded from an existing draft |

## Effects

- **On mount** — starts a one-minute interval that PUTs the latest in-progress values to `/api/logs/draft`, skipping the request if both title and body are still empty; cleared on unmount

## Handlers

- `handleChange` — records the latest form values in a ref, read by the autosave interval
- `handleSubmit` — posts the form values to `/api/logs`, throwing on failure so `LogForm` can surface the error; on success, deletes the draft before returning to the logs list
