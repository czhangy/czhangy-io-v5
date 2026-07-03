# LocationPanel

A Status page panel displaying the user's current general location. Admins see an edit button on hover that enables inline editing, persisted via `PATCH /api/status/location`.

## Props

| Prop              | Type              | Required | Default | Description                                     |
| ----------------- | ----------------- | -------- | ------- | ----------------------------------------------- |
| `initialLocation` | `string`          | Yes      | —       | Location string fetched server-side             |
| `label`           | `string`          | Yes      | —       | Panel header label                              |
| `icon`            | `React.ReactNode` | Yes      | —       | Panel header icon                               |
| `cols`            | `number`          | Yes      | —       | Forwarded to the StatusPanel for grid placement |
| `rows`            | `number`          | No       | —       | Forwarded to the StatusPanel for grid placement |

## State

| State       | Type      | Initial value     | Description                          |
| ----------- | --------- | ----------------- | ------------------------------------ |
| `isEditing` | `boolean` | `false`           | Whether the inline edit form is open |
| `location`  | `string`  | `initialLocation` | Saved location value                 |
| `draft`     | `string`  | `initialLocation` | In-progress edit value               |
