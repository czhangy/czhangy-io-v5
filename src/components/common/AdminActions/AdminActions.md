# AdminActions

A row of icon buttons — highlight, edit, and delete — for admin-only actions on a list entry. Each button only renders when its corresponding handler prop is supplied. The highlight and delete buttons prompt for confirmation via `ConfirmationModal` before invoking their handler; edit is invoked immediately.

## Props

| Prop          | Type         | Required | Default | Description                                                               |
| ------------- | ------------ | -------- | ------- | ------------------------------------------------------------------------- |
| `entryName`   | `string`     | Yes      | —       | Name of the entry these actions apply to, shown in the confirmation modal |
| `onHighlight` | `() => void` | No       | —       | Called when the highlight (star) button is confirmed                      |
| `onEdit`      | `() => void` | No       | —       | Called when the edit button is clicked                                    |
| `onDelete`    | `() => void` | No       | —       | Called when the delete button is confirmed                                |
| `className`   | `string`     | No       | —       | Additional class applied to the root element                              |

## State

| State           | Type                              | Initial value | Description                                    |
| --------------- | --------------------------------- | ------------- | ---------------------------------------------- |
| `pendingAction` | `'highlight' \| 'delete' \| null` | `null`        | Which action, if any, is awaiting confirmation |
