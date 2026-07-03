# WatchedControls

Controls bar for the watched page. Renders an "Add Content" button on the left (admin-only) that opens the AddContentModal, and pagination on the right.

## Props

| Prop         | Type                                 | Required | Default | Description                                        |
| ------------ | ------------------------------------ | -------- | ------- | -------------------------------------------------- |
| `page`       | `number`                             | Yes      | —       | Current page index (1-based)                       |
| `totalPages` | `number`                             | Yes      | —       | Total number of pages                              |
| `onPrev`     | `() => void`                         | Yes      | —       | Called when the previous button is clicked         |
| `onNext`     | `() => void`                         | Yes      | —       | Called when the next button is clicked             |
| `isAdmin`    | `boolean`                            | Yes      | —       | Whether to show the Add Content button             |
| `onAdd`      | `(entry: WatchedMediaEntry) => void` | Yes      | —       | Called with the saved entry after a successful add |

## State

| State    | Type      | Initial value | Description                   |
| -------- | --------- | ------------- | ----------------------------- |
| `isOpen` | `boolean` | `false`       | Whether the add modal is open |
