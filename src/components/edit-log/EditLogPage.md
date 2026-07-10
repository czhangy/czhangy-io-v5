# EditLogPage

A server component for the log entry editor route. Fetches a single log entry by slug, resolving a 404 for unknown slugs, and renders the page title alongside EditLogForm.

## Props

| Prop   | Type     | Required | Default | Description                                                          |
| ------ | -------- | -------- | ------- | -------------------------------------------------------------------- |
| `slug` | `string` | Yes      | —       | Slug of the log entry to fetch and edit, taken from the route param. |
