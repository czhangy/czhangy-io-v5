# PanelButton

A shared action trigger for use in StatusPanel headers via the `headerAction` slot. Renders as a `<button>` when `onClick` is provided, or as a Next.js `<Link>` when `href` is provided.

## Props

| Prop      | Type              | Required | Default        | Description                            |
| --------- | ----------------- | -------- | -------------- | -------------------------------------- |
| `icon`    | `React.ReactNode` | No       | `<EditIcon />` | Icon rendered inside the element       |
| `onClick` | `() => void`      | No       | —              | Click handler; renders as `<button>`   |
| `href`    | `string`          | No       | —              | Navigation target; renders as `<Link>` |
