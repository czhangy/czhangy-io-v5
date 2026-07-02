# GamePanelData

Async server component that fetches the current game entry from the database and its metadata from the RAWG API, then renders GamePanel with the resolved data.

## Props

| Prop        | Type              | Required | Default | Description            |
| ----------- | ----------------- | -------- | ------- | ---------------------- |
| `icon`      | `React.ReactNode` | No       | —       | Forwarded to GamePanel |
| `className` | `string`          | No       | —       | Forwarded to GamePanel |
