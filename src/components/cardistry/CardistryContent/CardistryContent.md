# CardistryContent

Client component that manages the cardistry move list, pagination state, and add flow for the Cardistry page.

## Props

| Prop           | Type                   | Required | Default | Description                   |
| -------------- | ---------------------- | -------- | ------- | ----------------------------- |
| `initialMoves` | `CardistryMoveEntry[]` | Yes      | —       | All moves fetched server-side |

## State

| State   | Type                   | Initial value  | Description                         |
| ------- | ---------------------- | -------------- | ----------------------------------- |
| `moves` | `CardistryMoveEntry[]` | `initialMoves` | Full sorted list of cardistry moves |
| `page`  | `number`               | `1`            | Current pagination page             |
