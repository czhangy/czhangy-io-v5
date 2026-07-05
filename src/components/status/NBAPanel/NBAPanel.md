# NBAPanel

Suspense boundary for the NBA panel. Defines the panel label and icon, passes them to both the loading fallback and NBAPanelData so they only need to be specified in one place.

## Props

| Prop          | Type     | Required | Default | Description                                       |
| ------------- | -------- | -------- | ------- | ------------------------------------------------- |
| `cols`        | `number` | Yes      | —       | Forwarded to both the fallback and the data panel |
| `rows`        | `number` | No       | —       | Forwarded to both the fallback and the data panel |
| `mobileOrder` | `number` | No       | —       | Forwarded to both the fallback and the data panel |
