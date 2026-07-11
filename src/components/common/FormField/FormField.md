# FormField

A labeled form field used in modal forms. Renders a text input by default, a Dropdown when a list of `options` is supplied, or a DatePicker when `type="date"` is set.

## Props

| Prop        | Type                                                 | Required | Default | Description                                                              |
| ----------- | ---------------------------------------------------- | -------- | ------- | ------------------------------------------------------------------------ |
| `label`     | `string`                                             | Yes      | —       | Label text displayed above the field                                     |
| `value`     | `string`                                             | Yes      | —       | Current field value                                                      |
| `onChange`  | `(value: string) => void`                            | Yes      | —       | Called with the new value on change                                      |
| `options`   | `string[]`                                           | No       | —       | Renders a Dropdown with these options instead of an input                |
| `type`      | `'date'`                                             | No       | —       | Renders a DatePicker instead of an input (ignored when `options` is set) |
| `onKeyDown` | `(e: React.KeyboardEvent<HTMLInputElement>) => void` | No       | —       | Forwarded to the input (ignored when using `options` or `type`)          |
| `autoFocus` | `boolean`                                            | No       | —       | Forwarded to the input (ignored when using `options` or `type`)          |
