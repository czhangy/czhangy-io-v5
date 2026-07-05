# SearchInput

A reusable search input with a loading spinner, a clear (✕) button, and a dropdown of results.

## Props

| Prop             | Type                                           | Required | Default | Description                                      |
| ---------------- | ---------------------------------------------- | -------- | ------- | ------------------------------------------------ |
| `value`          | `string`                                       | Yes      | —       | Controlled input value                           |
| `placeholder`    | `string`                                       | Yes      | —       | Input placeholder text                           |
| `isSearching`    | `boolean`                                      | Yes      | —       | When true, shows spinner instead of clear button |
| `results`        | `SearchResult[]`                               | Yes      | —       | Dropdown items to display                        |
| `onChange`       | `(e: ChangeEvent<HTMLInputElement>) => void`   | Yes      | —       | Input change handler                             |
| `onKeyDown`      | `(e: KeyboardEvent<HTMLInputElement>) => void` | Yes      | —       | Key handler (typically Escape/Enter)             |
| `onClear`        | `() => void`                                   | Yes      | —       | Called when the clear (✕) button is clicked      |
| `onSelectResult` | `(id: string \| number) => void`               | Yes      | —       | Called with the selected result's id             |
| `hideClear`      | `boolean`                                      | No       | `false` | When true, hides the clear (✕) button            |

## State

| State          | Type                   | Initial value | Description                                                             |
| -------------- | ---------------------- | ------------- | ----------------------------------------------------------------------- |
| `dropdownRect` | `DropdownRect \| null` | `null`        | Position/width of the results dropdown, measured from the input wrapper |

## Effects

- **On results change / mount / scroll / resize** — recomputes the input wrapper's bounding rect so the portaled dropdown stays anchored to the input

## Computations

- `hasResults` — whether there are results to show, used to gate rect measurement and the portal render

Renders its results dropdown into a portal on `document.body`, positioned with `position: fixed` and driven by the `dropdownRect` state. This lets the dropdown overflow scroll-clipped ancestors (e.g. a `Modal` with `overflow-y: auto`) instead of being cut off.
