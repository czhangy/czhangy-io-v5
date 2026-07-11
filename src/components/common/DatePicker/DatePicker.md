# DatePicker

A custom date picker for use in forms. Replaces free-text date entry with a styled trigger button and an absolutely-positioned calendar popup for selecting a day.

## Props

| Prop       | Type                      | Required | Default | Description                                                            |
| ---------- | ------------------------- | -------- | ------- | ---------------------------------------------------------------------- |
| `value`    | `string`                  | Yes      | —       | Currently selected date, formatted `MM/DD/YYYY`, or `''` if unselected |
| `onChange` | `(value: string) => void` | Yes      | —       | Called with the selected date string, or `''` when cleared             |

## State

| State       | Type                | Initial value                                           | Description                                                 |
| ----------- | ------------------- | ------------------------------------------------------- | ----------------------------------------------------------- |
| `isOpen`    | `boolean`           | `false`                                                 | Whether the calendar popup is visible                       |
| `popupRect` | `PopupRect \| null` | `null`                                                  | Viewport position used to place the portaled calendar popup |
| `viewDate`  | `Date`              | `value` parsed into a `Date`, or today if empty/invalid | The month currently displayed in the calendar grid          |

## Handlers

- `handlePrevMonth` / `handleNextMonth` — step `viewDate` by one month
- `handlePrevYear` / `handleNextYear` — step `viewDate` by one year, for jumping across distant years faster than the month steppers

## Computations

- `isSameDay` — compares two `Date`s by calendar day, ignoring time

## Rendering

- `selectedDate` — `value` parsed into a `Date`, or `null` if empty/invalid; used to highlight the selected day
- `today` — used to highlight the current day in the grid
- `monthLabel` — `viewDate` formatted as a full month name and year for the calendar header
- `calendarDays` — the grid of days for `viewDate`'s month, padded with leading `null` cells so the first day aligns under its weekday column

## Effects

- **On `isOpen`** — attaches/detaches a `mousedown` listener on `document` to close the popup when clicking outside the wrapper or the portaled popup
- **On `isOpen`** — while open, tracks the trigger's bounding rect (recomputed on scroll/resize) so the popup can be positioned via a `document.body` portal, clamped to stay within the viewport's right edge
