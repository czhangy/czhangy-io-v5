# AchievementsContent

Client shell for the achievements page. Owns filter, search, and pagination state via a reducer, and renders the controls row (category filter on the left; admin add button + search + pagination on the right) via the shared Controls component, the paginated achievement grid, and a centered pagination footer. Achievements are always sorted by date (most recent first).

## Props

| Prop           | Type            | Required | Default | Description                               |
| -------------- | --------------- | -------- | ------- | ----------------------------------------- |
| `achievements` | `Achievement[]` | Yes      | —       | Full list of achievements from the server |

## State

Filter/pagination state is managed by a single `useReducer`. The `State` shape:

| Field            | Type     | Initial value            | Description                                               |
| ---------------- | -------- | ------------------------ | --------------------------------------------------------- |
| `categoryFilter` | `string` | `''`                     | Active category filter; `''` means "All"                  |
| `searchQuery`    | `string` | `''`                     | Active live-filter search query, matched against name     |
| `page`           | `number` | `1`                      | Current page (1-indexed); resets to 1 on any state change |
| `itemsPerPage`   | `number` | `ITEMS_PER_PAGE_DESKTOP` | Items per page; set responsively by `RESIZE` action       |

A separate `isAddOpen` (`boolean`, initial `false`) `useState` tracks whether AddAchievementModal is open, set by the admin add button's `onClick`.

## Effects

- **On mount** — reads `window.matchMedia('(max-width: 768px)')`, dispatches `RESIZE` with the initial match, then listens for changes to keep `itemsPerPage` in sync with the viewport (`ITEMS_PER_PAGE_MOBILE = 6` on mobile, `ITEMS_PER_PAGE_DESKTOP = 18` on desktop)

## Computations

- `getSortTimestamp` — converts an achievement to a timestamp for date comparison: uses its MM/DD/YYYY `date` string if set, otherwise falls back to `createdAt`.
- `getCreatedTimestamp` — converts an achievement's `createdAt` to a timestamp. Used as the secondary sort key (tie-breaker) when two achievements share the same `getSortTimestamp` value.

Achievements are always sorted by `getSortTimestamp` descending (most recent first), with ties broken by `getCreatedTimestamp` descending.
