# FilterControl

A game-button-styled custom dropdown for the achievements filter and sort controls.

## Props

| Prop       | Type                      | Required | Default | Description                                                                       |
| ---------- | ------------------------- | -------- | ------- | --------------------------------------------------------------------------------- |
| `value`    | `string`                  | Yes      | —       | Currently selected option value                                                   |
| `onChange` | `(value: string) => void` | Yes      | —       | Called with the selected option string                                            |
| `options`  | `string[]`                | Yes      | —       | List of option strings (value and display label)                                  |
| `maxLabel` | `string`                  | No       | —       | Longest possible label; pins the component width so it never resizes on selection |

## State

| State    | Type      | Initial value | Description                         |
| -------- | --------- | ------------- | ----------------------------------- |
| `isOpen` | `boolean` | `false`       | Whether the options list is visible |

## Rendering

- `displayLabel` — the current `value`; trigger renders empty when no option is selected

## Effects

- **On `isOpen`** — attaches/detaches a `mousedown` listener on `document` to close the dropdown when clicking outside the wrapper
