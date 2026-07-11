# LogsContent

Client component rendered by LogsPage. Renders a searchable, paginated list of log summaries — title, tags, publish date, and a plain-text excerpt of the body — plus the controls bar with a tag filter dropdown, an admin-only "Add Log" button that navigates to the new-log route, and, for admins, edit and delete actions per entry. Each summary links to its full log at `/logs/[slug]`; the edit action navigates to `/logs/[slug]/edit`.

## Props

| Prop             | Type    | Required | Default | Description                                                |
| ---------------- | ------- | -------- | ------- | ---------------------------------------------------------- |
| `initialEntries` | `Log[]` | Yes      | —       | Log entries fetched server-side by LogsPage, newest first. |

## State

| State         | Type     | Initial value    | Description                                             |
| ------------- | -------- | ---------------- | ------------------------------------------------------- |
| `entries`     | `Log[]`  | `initialEntries` | The working set of log entries, mutated on delete.      |
| `page`        | `number` | `1`              | Current pagination page.                                |
| `searchQuery` | `string` | `''`             | Current search input value, matched against log titles. |
| `tagFilter`   | `string` | `''`             | Active tag filter; `''` means "All"                     |

## Computations

- `filterEntries` — filters `entries` by case-insensitive title match against `searchQuery`, then by `tagFilter` (entries must include the selected tag, unless `tagFilter` is `''`)
- `allTags` — the sorted, deduplicated set of tags across all `entries`, used as the filter dropdown's options
- `maxTagLabel` — the longest string among `allTags` and "All", used to size the filter dropdown so it doesn't reflow as the selection changes
- `filteredEntries` / `totalPages` / `paginatedEntries` — derives the current page's slice of matching entries
- Each entry's body excerpt is derived via `LogHelpers.getExcerpt`, which strips HTML and truncates to a plain-text summary
