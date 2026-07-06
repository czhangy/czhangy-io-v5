# ConfirmationModal

A confirmation prompt rendered inside the shared `Modal` shell, with a message naming the affected entry and Yes/No buttons. Only mounted by `AdminActions`.

## Props

| Prop        | Type         | Required | Default | Description                                                         |
| ----------- | ------------ | -------- | ------- | ------------------------------------------------------------------- |
| `title`     | `string`     | Yes      | —       | Text displayed in the modal header                                  |
| `action`    | `string`     | Yes      | —       | Verb describing the pending action (e.g. "highlight", "delete")     |
| `entryName` | `string`     | Yes      | —       | Name of the affected entry, highlighted in the confirmation message |
| `onConfirm` | `() => void` | Yes      | —       | Called when the "Yes" button is clicked                             |
| `onCancel`  | `() => void` | Yes      | —       | Called when "No" is clicked, or the modal is otherwise dismissed    |
