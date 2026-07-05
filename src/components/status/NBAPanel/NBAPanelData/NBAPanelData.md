# NBAPanelData

Async server component that fetches NBA data and renders it inside a StatusPanel.

## Props

| Prop          | Type              | Required | Default | Description                  |
| ------------- | ----------------- | -------- | ------- | ---------------------------- |
| `label`       | `string`          | Yes      | —       | Forwarded to the StatusPanel |
| `icon`        | `React.ReactNode` | Yes      | —       | Forwarded to the StatusPanel |
| `cols`        | `number`          | Yes      | —       | Forwarded to the StatusPanel |
| `rows`        | `number`          | No       | —       | Forwarded to the StatusPanel |
| `mobileOrder` | `number`          | No       | —       | Forwarded to the StatusPanel |
