# TagsField

A labeled tag-chip input. Typing a value and pressing Enter or comma commits it as a removable chip; pressing Backspace in an empty input removes the last chip. Duplicate and empty tags are ignored.

## Props

| Prop       | Type                       | Required | Default | Description                          |
| ---------- | -------------------------- | -------- | ------- | ------------------------------------ |
| `label`    | `string`                   | Yes      | —       | Label text displayed above the field |
| `tags`     | `string[]`                 | Yes      | —       | Current committed tags               |
| `onChange` | `(tags: string[]) => void` | Yes      | —       | Called with the updated tag list     |

## State

| State   | Type     | Initial value | Description                            |
| ------- | -------- | ------------- | -------------------------------------- |
| `draft` | `string` | `''`          | The in-progress, not-yet-committed tag |
