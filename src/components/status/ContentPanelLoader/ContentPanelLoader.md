# WatchingPanelLoader

Suspense boundary for the shows panel. Defines the panel label and icon, passes them to both the loading fallback and WatchingPanelData so they only need to be specified in one place.

## Props

| Prop          | Type     | Required | Default | Description                                          |
| ------------- | -------- | -------- | ------- | ---------------------------------------------------- |
| `cols`        | `number` | Yes      | —       | Forwarded to both the fallback and WatchingPanelData |
| `rows`        | `number` | No       | —       | Forwarded to both the fallback and WatchingPanelData |
| `mobileOrder` | `number` | No       | —       | Forwarded to both the fallback and WatchingPanelData |
