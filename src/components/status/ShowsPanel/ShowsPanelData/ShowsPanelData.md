# ShowsPanelData

Async server component that fetches show entries from the database and their metadata from the TVmaze API, then renders ShowsPanel with the resolved data.

## Props

| Prop        | Type              | Required | Default | Description             |
| ----------- | ----------------- | -------- | ------- | ----------------------- |
| `label`     | `string`          | Yes      | —       | Forwarded to ShowsPanel |
| `icon`      | `React.ReactNode` | Yes      | —       | Forwarded to ShowsPanel |
| `className` | `string`          | No       | —       | Forwarded to ShowsPanel |
