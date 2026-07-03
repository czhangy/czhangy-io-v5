# PanelButton

A shared action trigger button for use in StatusPanel headers via the `headerAction` slot. Only rendered when the user is admin — visibility gating is the responsibility of the parent panel.

## Props

| Prop      | Type              | Required | Default        | Description                     |
| --------- | ----------------- | -------- | -------------- | ------------------------------- |
| `onClick` | `() => void`      | Yes      | —              | Called when button is clicked   |
| `icon`    | `React.ReactNode` | No       | `<EditIcon />` | Icon rendered inside the button |
