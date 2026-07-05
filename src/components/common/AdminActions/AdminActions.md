# AdminActions

A row of icon buttons — highlight, edit, and delete — for admin-only actions on a list entry. Each button only renders when its corresponding handler prop is supplied.

## Props

| Prop          | Type         | Required | Default | Description                                        |
| ------------- | ------------ | -------- | ------- | -------------------------------------------------- |
| `onHighlight` | `() => void` | No       | —       | Called when the highlight (star) button is clicked |
| `onEdit`      | `() => void` | No       | —       | Called when the edit button is clicked             |
| `onDelete`    | `() => void` | No       | —       | Called when the delete button is clicked           |
| `className`   | `string`     | No       | —       | Additional class applied to the root element       |
