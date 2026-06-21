# AchievementsContent

Client shell for the achievements page. Owns sort and filter state, and renders the controls row (category filter + sort field select + direction toggle on the left, admin add button on the right) and the filtered, sorted achievement grid.

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

## Computations

- `CATEGORIES` — unique sorted list of categories present in `achievements`
- `parseDate` — converts a nullable MM/DD/YYYY string to a timestamp for date comparison
- `sortedAchievements` — filtered by `categoryFilter` then sorted by `sortField`/`sortDirection`
