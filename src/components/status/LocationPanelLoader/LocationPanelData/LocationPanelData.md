# LocationPanelData

Async server component that fetches the current location from the database, then renders LocationPanel with the resolved data.

## Props

| Prop    | Type              | Required | Default | Description                |
| ------- | ----------------- | -------- | ------- | -------------------------- |
| `label` | `string`          | Yes      | —       | Forwarded to LocationPanel |
| `icon`  | `React.ReactNode` | Yes      | —       | Forwarded to LocationPanel |
| `cols`  | `number`          | Yes      | —       | Forwarded to LocationPanel |
| `rows`  | `number`          | No       | —       | Forwarded to LocationPanel |
