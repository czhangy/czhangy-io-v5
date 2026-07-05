# Dropdown

A custom dropdown for use in forms and filter controls. Replaces native `<select>` elements with a styled trigger button and absolutely-positioned options list.

## Props

| Prop       | Type                      | Required | Default | Description                                      |
| ---------- | ------------------------- | -------- | ------- | ------------------------------------------------ |
| `value`    | `string`                  | Yes      | —       | Currently selected option value                  |
| `onChange` | `(value: string) => void` | Yes      | —       | Called with the selected option string           |
| `options`  | `string[]`                | Yes      | —       | List of option strings (value and display label) |

## State

| State         | Type                  | Initial value | Description                                                     |
| ------------- | --------------------- | ------------- | --------------------------------------------------------------- |
| `isOpen`      | `boolean`             | `false`       | Whether the options list is visible                             |
| `optionsRect` | `OptionsRect \| null` | `null`        | Viewport position/width used to place the portaled options list |

## Rendering

- `displayLabel` — the current `value`; trigger renders empty when no option is selected

## Effects

- **On `isOpen`** — attaches/detaches a `mousedown` listener on `document` to close the dropdown when clicking outside the wrapper or the portaled options list
- **On `isOpen`** — while open, tracks the trigger's bounding rect (recomputed on scroll/resize) so the options list can be positioned via a `document.body` portal, escaping any ancestor's `overflow`/`max-height` clipping (e.g. a scrollable modal)
