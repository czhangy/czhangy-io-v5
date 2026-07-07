# HighlightMatch

Renders a string with the portions matching a search query highlighted in the accent color. Used to show live-filter matches within list entry names.

## Props

| Prop    | Type     | Required | Default | Description                                 |
| ------- | -------- | -------- | ------- | ------------------------------------------- |
| `text`  | `string` | Yes      | —       | The full text to render                     |
| `query` | `string` | Yes      | —       | The search query to highlight within `text` |

## Computations

- `segments` — `text` split into matched/unmatched runs via a case-insensitive search for `query`; matched runs are wrapped in a highlighted `span`, unmatched runs render as plain text. When `query` is blank, `text` renders as a single unmatched segment.
