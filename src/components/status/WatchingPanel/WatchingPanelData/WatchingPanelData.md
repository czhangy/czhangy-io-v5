# WatchingPanelData

Async server component that fetches show entries from the database and their metadata from the TVmaze API, then renders WatchingPanel with the resolved data.

## Props

| Prop        | Type              | Required | Default | Description                |
| ----------- | ----------------- | -------- | ------- | -------------------------- |
| `label`     | `string`          | Yes      | —       | Forwarded to WatchingPanel |
| `icon`      | `React.ReactNode` | Yes      | —       | Forwarded to WatchingPanel |
| `className` | `string`          | No       | —       | Forwarded to WatchingPanel |
