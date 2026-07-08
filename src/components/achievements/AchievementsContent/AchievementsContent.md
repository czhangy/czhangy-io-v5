# AchievementsContent

Client shell for the achievements page. Owns sort, filter, and pagination state via a reducer, and renders the controls row (category filter + sort field + direction toggle on the left; admin add button + pagination on the right) via the shared Controls component, the paginated achievement grid, and a centered pagination footer.

## Props

| Prop           | Type            | Required | Default | Description                               |
| -------------- | --------------- | -------- | ------- | ----------------------------------------- |
| `achievements` | `Achievement[]` | Yes      | —       | Full list of achievements from the server |

## State

Sort/filter/pagination state is managed by a single `useReducer`. The `State` shape:

| Field            | Type            | Initial value            | Description                                               |
| ---------------- | --------------- | ------------------------ | --------------------------------------------------------- |
| `sortField`      | `SortField`     | `'date'`                 | Active sort field                                         |
| `sortDirection`  | `SortDirection` | `'asc'`                  | Active sort direction                                     |
| `categoryFilter` | `string`        | `''`                     | Active category filter; `''` means "All"                  |
| `page`           | `number`        | `1`                      | Current page (1-indexed); resets to 1 on any state change |
| `itemsPerPage`   | `number`        | `ITEMS_PER_PAGE_DESKTOP` | Items per page; set responsively by `RESIZE` action       |

A separate `isAddOpen` (`boolean`, initial `false`) `useState` tracks whether AddAchievementModal is open, set by the admin add button's `onClick`.

## Effects

- **On mount** — reads `window.matchMedia('(max-width: 768px)')`, dispatches `RESIZE` with the initial match, then listens for changes to keep `itemsPerPage` in sync with the viewport (`ITEMS_PER_PAGE_MOBILE = 6` on mobile, `ITEMS_PER_PAGE_DESKTOP = 18` on desktop)

## Computations

- `getSortTimestamp` — converts an achievement to a timestamp for date comparison: uses its MM/DD/YYYY `date` string if set, otherwise falls back to `createdAt`. Used both for the `date` sort field and as the tie-breaker when sorting by `tier`.

Sorting by `name` is case-insensitive.
