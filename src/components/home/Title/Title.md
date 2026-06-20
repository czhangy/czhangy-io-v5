# Title

Displays the site title "CZHANGY.IO" with a two-phase animation: a character scramble on mount that resolves left-to-right, followed by an ambient CSS glitch effect using chromatic-aberration-style pseudo-element overlays.

## State

| State         | Type      | Initial value | Description                                        |
| ------------- | --------- | ------------- | -------------------------------------------------- |
| `displayText` | `string`  | `'CZHANGY.IO'`| The currently rendered characters (scrambled or resolved) |
| `isResolved`  | `boolean` | `false`       | Whether the scramble has finished; enables the glitch CSS class |

## Effects

- **On mount** — runs a `requestAnimationFrame` loop that scrambles each character and resolves them left-to-right over ~1.3s, then sets `isResolved` to true
