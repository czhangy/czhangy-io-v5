# ListControls

Controls bar for a paginated admin-editable list page. Renders a back link to Status on the left, a live-filter search input in the middle, and an admin-only "add" button plus pagination on the right. Any modal opened by the add button is rendered via `children`.

## Props

| Prop                | Type                      | Required | Default | Description                                           |
| ------------------- | ------------------------- | -------- | ------- | ----------------------------------------------------- |
| `page`              | `number`                  | Yes      | —       | Current page (1-indexed)                              |
| `totalPages`        | `number`                  | Yes      | —       | Total number of pages                                 |
| `onPrev`            | `() => void`              | Yes      | —       | Called when the previous button is clicked            |
| `onNext`            | `() => void`              | Yes      | —       | Called when the next button is clicked                |
| `isAdmin`           | `boolean`                 | Yes      | —       | Whether to show the add button                        |
| `addLabel`          | `string`                  | Yes      | —       | Label text for the add button                         |
| `onAddClick`        | `() => void`              | Yes      | —       | Called when the add button is clicked                 |
| `searchValue`       | `string`                  | Yes      | —       | Controlled value of the search input                  |
| `searchPlaceholder` | `string`                  | Yes      | —       | Placeholder text for the search input                 |
| `onSearchChange`    | `(value: string) => void` | Yes      | —       | Called with the new value as the search input changes |
| `children`          | `React.ReactNode`         | No       | —       | Rendered inside the controls bar, e.g. an add modal   |
