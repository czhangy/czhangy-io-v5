# NavMenu

A vertical navigation menu styled as a video game selection list. Tracks the active item and shows an accent-colored cursor indicator next to it.

## State

| State         | Type     | Initial value | Description                                        |
| ------------- | -------- | ------------- | -------------------------------------------------- |
| `activeIndex` | `number` | `0`           | Index of the currently active nav item |

## Effects

- **On mount / activeIndex change** — attaches a `keydown` listener to `window`; ArrowUp/ArrowDown moves the selection (looping), Enter navigates to the active item's route
