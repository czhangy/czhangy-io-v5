# MoveListItem

A single cardistry move entry as rendered in the moves list — proficiency pips, name, type, and admin increment/edit/delete actions when applicable. The name links out to the move's tutorial URL. Optionally renders as a highlighted spotlight entry with a small title header.

## Props

| Prop             | Type                       | Required | Default | Description                                                                          |
| ---------------- | -------------------------- | -------- | ------- | ------------------------------------------------------------------------------------ |
| `move`           | `Move`                     | Yes      | —       | Move entry to display                                                                |
| `searchQuery`    | `string`                   | Yes      | —       | Active search query, used to highlight matches in the name                           |
| `isAdmin`        | `boolean`                  | Yes      | —       | Whether admin increment/edit/delete actions should render                            |
| `isIncrementing` | `boolean`                  | Yes      | —       | Whether an increment request is in flight, disabling increment buttons               |
| `onIncrement`    | `(amount: number) => void` | Yes      | —       | Called when an increment button is pressed                                           |
| `onEdit`         | `() => void`               | Yes      | —       | Called when the edit action is triggered                                             |
| `onDelete`       | `() => void`               | Yes      | —       | Called when the delete action is triggered                                           |
| `highlightLabel` | `string`                   | No       | —       | When provided, renders a title header above the entry with special highlight styling |
