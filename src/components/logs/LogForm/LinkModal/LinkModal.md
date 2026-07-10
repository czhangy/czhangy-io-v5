# LinkModal

A modal prompting for a URL, used when applying a link to the current selection in the rich text editor. Only mounted by `LogForm`.

## Props

| Prop        | Type                    | Required | Default | Description                                                |
| ----------- | ----------------------- | -------- | ------- | ---------------------------------------------------------- |
| `onConfirm` | `(url: string) => void` | Yes      | —       | Called with the trimmed URL when confirmed                 |
| `onCancel`  | `() => void`            | Yes      | —       | Called on Escape, or when the modal is otherwise dismissed |

## State

| State | Type     | Initial value | Description           |
| ----- | -------- | ------------- | --------------------- |
| `url` | `string` | `''`          | The URL being entered |
