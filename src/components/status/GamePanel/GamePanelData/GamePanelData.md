# GamePanelData

Async server component that fetches the current game entry from the database and its metadata from the RAWG API, then renders GamePanel with the resolved data.

## Props

| Prop        | Type              | Required | Default | Description            |
| ----------- | ----------------- | -------- | ------- | ---------------------- |
| `label`     | `string`          | Yes      | —       | Forwarded to GamePanel |
| `icon`      | `React.ReactNode` | Yes      | —       | Forwarded to GamePanel |
| `className` | `string`          | No       | —       | Forwarded to GamePanel |
