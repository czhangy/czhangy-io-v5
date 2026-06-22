# ShowsPanelBody

Client-side body of the ShowsPanel. Renders a list of shows with TVmaze poster images. Admins can click the per-row edit button to replace a show name inline; on save, the new name is persisted via `PATCH /api/status/shows` and the poster is re-fetched from TVmaze.

## Props

| Prop               | Type                 | Required | Default | Description                                   |
| ------------------ | -------------------- | -------- | ------- | --------------------------------------------- |
| `initialShowNames` | `string[]`           | Yes      | —       | Ordered list of show names from the DB        |
| `initialPosters`   | `(string \| null)[]` | Yes      | —       | TVmaze poster URLs corresponding to each name |

## State

| State          | Type                 | Initial value      | Description                        |
| -------------- | -------------------- | ------------------ | ---------------------------------- |
| `showNames`    | `string[]`           | `initialShowNames` | Current show names                 |
| `posters`      | `(string \| null)[]` | `initialPosters`   | Current poster URLs                |
| `editingIndex` | `number \| null`     | `null`             | Index of the row currently editing |
| `draft`        | `string`             | `''`               | In-progress show name being edited |
