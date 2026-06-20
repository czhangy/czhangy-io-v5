# GlitchText

An animated text component that plays a character-scramble intro on mount, then applies a per-letter CSS glitch effect with staggered timing.

## Props

| Prop        | Type                  | Required | Default    | Description                                  |
| ----------- | --------------------- | -------- | ---------- | -------------------------------------------- |
| `text`      | `string`              | Yes      | —          | The text to display                          |
| `as`        | `React.ElementType`   | No       | `'span'`   | HTML element or component to render as       |
| `className` | `string`              | No       | —          | Additional class applied to the root element |

## State

| State         | Type             | Initial value                        | Description                                    |
| ------------- | ---------------- | ------------------------------------ | ---------------------------------------------- |
| `displayText` | `string`         | `text`                               | The currently rendered characters              |
| `isResolved`  | `boolean`        | `false`                              | Whether the scramble animation has completed   |

## Effects

- **On `text` change** — resets state, then runs a requestAnimationFrame loop that scrambles characters left-to-right until each resolves to its target, then sets `isResolved`

## Computations

- `letterDelays` — array of per-letter CSS animation delay values (seconds), deterministically spread so each letter's glitch burst is staggered
