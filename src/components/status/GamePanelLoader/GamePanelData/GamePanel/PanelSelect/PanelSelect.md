# PanelSelect

A compact styled select element used within the GamePanel edit form, with a chevron arrow indicator and optional empty/placeholder state styling.

## Props

| Prop          | Type                                                | Required | Default | Description                                                  |
| ------------- | --------------------------------------------------- | -------- | ------- | ------------------------------------------------------------ |
| `value`       | `string`                                            | Yes      | —       | Controlled selected value                                    |
| `onChange`    | `(e: React.ChangeEvent<HTMLSelectElement>) => void` | Yes      | —       | Change handler                                               |
| `options`     | `(string \| number)[]`                              | Yes      | —       | List of option values (used as both value and label)         |
| `placeholder` | `string`                                            | No       | —       | Disabled placeholder option shown when value is empty        |
| `compact`     | `boolean`                                           | No       | `false` | Fixes width to 3.5rem for short numeric options like ratings |

## Computations

- `isEmpty` — true when `value` is empty and a `placeholder` is provided; triggers dim text color
