# LibraryControls

Controls bar for the library page. Renders an "Add Book" button on the left (admin-only) that opens AddBookModal, and pagination on the right.

## Props

| Prop         | Type                              | Required | Default | Description                                        |
| ------------ | --------------------------------- | -------- | ------- | -------------------------------------------------- |
| `page`       | `number`                          | Yes      | —       | Current page index (1-based)                       |
| `totalPages` | `number`                          | Yes      | —       | Total number of pages                              |
| `onPrev`     | `() => void`                      | Yes      | —       | Called when the previous button is clicked         |
| `onNext`     | `() => void`                      | Yes      | —       | Called when the next button is clicked             |
| `isAdmin`    | `boolean`                         | Yes      | —       | Whether to show the Add Book button                |
| `onAdd`      | `(entry: ReadMediaEntry) => void` | Yes      | —       | Called with the saved entry after a successful add |

## State

| State    | Type      | Initial value | Description                   |
| -------- | --------- | ------------- | ----------------------------- |
| `isOpen` | `boolean` | `false`       | Whether the add modal is open |
