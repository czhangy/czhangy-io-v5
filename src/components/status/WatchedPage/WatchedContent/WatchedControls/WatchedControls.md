# WatchedControls

Controls bar for the watched page that renders pagination aligned to the right.

## Props

| Prop         | Type         | Required | Default | Description                                |
| ------------ | ------------ | -------- | ------- | ------------------------------------------ |
| `page`       | `number`     | Yes      | —       | Current page index (1-based)               |
| `totalPages` | `number`     | Yes      | —       | Total number of pages                      |
| `onPrev`     | `() => void` | Yes      | —       | Called when the previous button is clicked |
| `onNext`     | `() => void` | Yes      | —       | Called when the next button is clicked     |
