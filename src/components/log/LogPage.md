# LogPage

A server component for the individual log detail route. Fetches a single log entry by slug, resolving a 404 for unknown slugs, and renders LogContent.

## Props

| Prop   | Type     | Required | Default | Description                                                 |
| ------ | -------- | -------- | ------- | ----------------------------------------------------------- |
| `slug` | `string` | Yes      | —       | Slug of the log entry to fetch, taken from the route param. |
