# Controls

A composable controls bar for list/collection pages. Optionally renders a back-link, a left-side filter/sort slot, an admin-gated add button, and a trailing group pairing the live-filter search input with pagination, arranged in a single responsive row. Any modal opened by the add button is rendered via `children`.

## Props

| Prop         | Type                                                                           | Required | Default | Description                                                                                 |
| ------------ | ------------------------------------------------------------------------------ | -------- | ------- | ------------------------------------------------------------------------------------------- |
| `backLink`   | `{ href: string; label: string }`                                              | No       | —       | Renders a back-navigation link on the left                                                  |
| `left`       | `React.ReactNode`                                                              | No       | —       | Arbitrary content rendered in the left group (e.g. filter/sort dropdowns)                   |
| `add`        | `{ label: string; isAdmin: boolean; onClick: () => void }`                     | No       | —       | Renders an admin-only add button, positioned to the left of the search input                |
| `search`     | `{ value: string; placeholder: string; onChange: (value: string) => void }`    | No       | —       | Renders a controlled live-filter search input, paired with pagination in the trailing group |
| `pagination` | `{ page: number; totalPages: number; onPrev: () => void; onNext: () => void }` | No       | —       | Renders pagination controls, paired with search in the trailing group                       |
| `rightAlign` | `boolean`                                                                      | No       | `false` | Right-aligns the bar instead of space-between (for pages with no search/left content)       |
| `children`   | `React.ReactNode`                                                              | No       | —       | Rendered inside the bar, e.g. an add modal                                                  |

## Rendering

- `hasTrailing` — whether the trailing group renders at all; it's only emitted when at least one of `search`/`pagination` is supplied, and always keeps the two together on the same row without splitting across a wrap
