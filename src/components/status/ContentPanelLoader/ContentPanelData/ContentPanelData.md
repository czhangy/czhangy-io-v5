# WatchingPanelData

Async server component that fetches the 5 most recently added entries from the `WatchedMedia` table and renders WatchingPanel with the resolved data. No external API calls are made at read time.

## Props

| Prop          | Type              | Required | Default | Description                |
| ------------- | ----------------- | -------- | ------- | -------------------------- |
| `label`       | `string`          | Yes      | —       | Forwarded to WatchingPanel |
| `icon`        | `React.ReactNode` | Yes      | —       | Forwarded to WatchingPanel |
| `cols`        | `number`          | Yes      | —       | Forwarded to WatchingPanel |
| `rows`        | `number`          | No       | —       | Forwarded to WatchingPanel |
| `mobileOrder` | `number`          | No       | —       | Forwarded to WatchingPanel |
