# NewLogPage

A server component for the log entry composer route. Renders the page title and NewLogForm, loading any existing autosaved draft to resume it.

## Computations

- `initialValues` — the draft's title, tags, and body loaded from the database, or `undefined` if no draft exists
