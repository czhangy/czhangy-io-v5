# AchievementsContent

Client shell for the achievements page. Owns sort, filter, and pagination state, and renders the controls row (category filter + sort field + direction toggle on the left; pagination + admin add button on the right), the paginated achievement grid, and a centered pagination footer.

## Props

| Prop           | Type            | Required | Default | Description                               |
| -------------- | --------------- | -------- | ------- | ----------------------------------------- |
| `achievements` | `Achievement[]` | Yes      | —       | Full list of achievements from the server |

## State

| State            | Type            | Initial value | Description                              |
| ---------------- | --------------- | ------------- | ---------------------------------------- |
| `sortField`      | `SortField`     | `'date'`      | Active sort field                        |
| `sortDirection`  | `SortDirection` | `'asc'`       | Active sort direction                    |
| `categoryFilter` | `string`        | `''`          | Active category filter; `''` means "All" |
| `page`           | `number`        | `1`           | Current page number (1-indexed)          |

## Computations

- `parseDate` — converts a nullable MM/DD/YYYY string to a timestamp for date comparison

## SCSS Variable Dependencies

None — all tokens are sourced from `_constants.scss` directly.
