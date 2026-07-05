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
