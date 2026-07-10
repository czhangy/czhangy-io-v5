# LogContent

Client component rendered by LogPage. Renders a single log entry in full — title, publish date, tags, and the rendered HTML body — plus a back link to the log list and, for admins, an edit action that navigates to `/logs/[slug]/edit` and a delete action that removes the entry and redirects back to `/logs`.

## Props

| Prop    | Type  | Required | Default | Description                                               |
| ------- | ----- | -------- | ------- | --------------------------------------------------------- |
| `entry` | `Log` | Yes      | —       | The log entry to display, fetched server-side by LogPage. |
