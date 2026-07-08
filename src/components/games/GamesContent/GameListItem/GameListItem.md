# GameListItem

A single game entry as rendered in the games list — icon, name, genre, and star rating, with admin edit/delete actions when applicable. Optionally renders as a highlighted spotlight entry with a small title header.

## Props

| Prop             | Type         | Required | Default | Description                                                                          |
| ---------------- | ------------ | -------- | ------- | ------------------------------------------------------------------------------------ |
| `game`           | `Game`       | Yes      | —       | Game entry to display                                                                |
| `searchQuery`    | `string`     | Yes      | —       | Active search query, used to highlight matches in the name                           |
| `isAdmin`        | `boolean`    | Yes      | —       | Whether admin edit/delete actions should render                                      |
| `onEdit`         | `() => void` | Yes      | —       | Called when the edit action is triggered                                             |
| `onDelete`       | `() => void` | Yes      | —       | Called when the delete action is triggered                                           |
| `highlightLabel` | `string`     | No       | —       | When provided, renders a title header above the entry with special highlight styling |
