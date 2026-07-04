# GamePanelData

Async server component that reads the active game ID from the database and fetches the corresponding Game record, then renders GamePanel with the resolved data.

## Props

| Prop    | Type              | Required | Default | Description            |
| ------- | ----------------- | -------- | ------- | ---------------------- |
| `label` | `string`          | Yes      | —       | Forwarded to GamePanel |
| `icon`  | `React.ReactNode` | Yes      | —       | Forwarded to GamePanel |
| `cols`  | `number`          | Yes      | —       | Forwarded to GamePanel |
| `rows`  | `number`          | No       | —       | Forwarded to GamePanel |
