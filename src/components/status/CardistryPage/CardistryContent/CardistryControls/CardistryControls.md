# CardistryControls

Controls bar for the Cardistry page. Contains the back-to-status link, an admin-only Add Move button, and top-row pagination.

## Props

| Prop         | Type                                 | Required | Default | Description                           |
| ------------ | ------------------------------------ | -------- | ------- | ------------------------------------- |
| `page`       | `number`                             | Yes      | —       | Current page, forwarded to pagination |
| `totalPages` | `number`                             | Yes      | —       | Total pages, forwarded to pagination  |
| `onPrev`     | `() => void`                         | Yes      | —       | Decrement page                        |
| `onNext`     | `() => void`                         | Yes      | —       | Increment page                        |
| `isAdmin`    | `boolean`                            | Yes      | —       | Whether to show the Add Move button   |
| `onAdd`      | `(move: CardistryMoveEntry) => void` | Yes      | —       | Called with the saved move after add  |

## State

| State    | Type      | Initial value | Description                     |
| -------- | --------- | ------------- | ------------------------------- |
| `isOpen` | `boolean` | `false`       | Whether AddMoveModal is visible |
