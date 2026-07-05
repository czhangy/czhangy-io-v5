# Modal

A portal-rendered modal shell with a darkened backdrop, title bar, and close button. Fades and slides in on mount; fades and slides out when dismissed via the X button or backdrop click, then calls `onClose` after the animation completes. Closing is immediate when `prefers-reduced-motion` is active.

## Props

| Prop       | Type              | Required | Default | Description                               |
| ---------- | ----------------- | -------- | ------- | ----------------------------------------- |
| `title`    | `string`          | Yes      | —       | Text displayed in the modal header        |
| `onClose`  | `() => void`      | Yes      | —       | Called after the close animation finishes |
| `children` | `React.ReactNode` | Yes      | —       | Content rendered inside the modal body    |

## State

| State       | Type      | Initial value | Description                            |
| ----------- | --------- | ------------- | -------------------------------------- |
| `isClosing` | `boolean` | `false`       | Whether the close animation is playing |

## Effects

- **On mount** — locks body scroll by setting `overflow: hidden` and pinning the body with `position: fixed` at the current scroll offset; restores the previous styles and scroll position on unmount. Pinning via `position: fixed` (rather than `overflow: hidden` alone) is required to prevent iOS Safari from scrolling the page when a focused input inside the modal is scrolled into view above the keyboard.
