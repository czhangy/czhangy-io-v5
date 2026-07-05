# NBAPanelData

Async server component that fetches the most recent Warriors game from the ESPN API and renders the away and home team logos, abbreviations, and final scores inside a StatusPanel. The winning team's score is highlighted.

## Props

| Prop          | Type              | Required | Default | Description                  |
| ------------- | ----------------- | -------- | ------- | ---------------------------- |
| `label`       | `string`          | Yes      | —       | Forwarded to the StatusPanel |
| `icon`        | `React.ReactNode` | Yes      | —       | Forwarded to the StatusPanel |
| `cols`        | `number`          | Yes      | —       | Forwarded to the StatusPanel |
| `rows`        | `number`          | No       | —       | Forwarded to the StatusPanel |
| `mobileOrder` | `number`          | No       | —       | Forwarded to the StatusPanel |
