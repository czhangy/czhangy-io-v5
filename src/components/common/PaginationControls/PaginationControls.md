# PaginationControls

Page navigation controls with previous/next buttons and a current page indicator. Renders nothing when the total page count is 1 or fewer.

## Props

| Prop         | Type         | Required | Default | Description                                |
| ------------ | ------------ | -------- | ------- | ------------------------------------------ |
| `page`       | `number`     | Yes      | —       | Current page (1-indexed)                   |
| `totalPages` | `number`     | Yes      | —       | Total number of pages                      |
| `onPrev`     | `() => void` | Yes      | —       | Called when the previous button is clicked |
| `onNext`     | `() => void` | Yes      | —       | Called when the next button is clicked     |
