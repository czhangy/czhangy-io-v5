# FormField

A labeled form field used in modal forms. Renders a text input by default, or a Dropdown when a list of `options` is supplied.

## Props

| Prop        | Type                                                 | Required | Default | Description                                               |
| ----------- | ---------------------------------------------------- | -------- | ------- | --------------------------------------------------------- |
| `label`     | `string`                                             | Yes      | —       | Label text displayed above the field                      |
| `value`     | `string`                                             | Yes      | —       | Current field value                                       |
| `onChange`  | `(value: string) => void`                            | Yes      | —       | Called with the new value on change                       |
| `options`   | `string[]`                                           | No       | —       | Renders a Dropdown with these options instead of an input |
| `onKeyDown` | `(e: React.KeyboardEvent<HTMLInputElement>) => void` | No       | —       | Forwarded to the input (ignored when using `options`)     |
| `autoFocus` | `boolean`                                            | No       | —       | Forwarded to the input (ignored when using `options`)     |
