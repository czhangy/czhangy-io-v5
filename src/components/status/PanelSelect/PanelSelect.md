# PanelSelect

A custom dropdown shared across status page panels. Renders a styled trigger button with a chevron and an absolutely-positioned options list. Supports both flat value arrays and `{ value, label }` objects for cases where the displayed label differs from the stored value.

## Props

| Prop          | Type                      | Required | Default | Description                                                  |
| ------------- | ------------------------- | -------- | ------- | ------------------------------------------------------------ |
| `value`       | `string`                  | Yes      | —       | Currently selected value (always a string)                   |
| `onChange`    | `(value: string) => void` | Yes      | —       | Called with the selected option's string value               |
| `options`     | `(string \| number)[]`    | Yes      | —       | List of option values (used as both value and label)         |
| `placeholder` | `string`                  | No       | —       | Trigger label shown when no value is selected                |
| `compact`     | `boolean`                 | No       | `false` | Fixes width to 3.5rem for short numeric options like ratings |

## State

| State    | Type      | Initial value | Description                         |
| -------- | --------- | ------------- | ----------------------------------- |
| `isOpen` | `boolean` | `false`       | Whether the options list is visible |

## Effects

- **On `isOpen`** — attaches/detaches a `mousedown` listener on `document` to close the dropdown when clicking outside the wrapper

## Computations

- `isEmpty` — true when `value` is empty and a `placeholder` is provided; triggers dim text on the trigger
- `displayLabel` — the current `value`, falling back to `placeholder`, then empty string
