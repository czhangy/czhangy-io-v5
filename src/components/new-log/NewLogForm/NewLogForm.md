# NewLogForm

Thin wrapper around `LogForm` that creates a new log entry. Publishing posts the entry to the API, which persists it and generates a unique slug, then returns to the logs list.

## Handlers

- `handleSubmit` — posts the form values to `/api/logs`, throwing on failure so `LogForm` can surface the error
