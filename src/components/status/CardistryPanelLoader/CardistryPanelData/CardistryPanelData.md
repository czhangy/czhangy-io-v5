# CardistryPanelData

Async server component that fetches the current skill entry from the database, then renders CardistryPanel with the resolved data.

## Props

| Prop    | Type              | Required | Default | Description                 |
| ------- | ----------------- | -------- | ------- | --------------------------- |
| `label` | `string`          | Yes      | —       | Forwarded to CardistryPanel |
| `icon`  | `React.ReactNode` | Yes      | —       | Forwarded to CardistryPanel |
| `cols`  | `number`          | Yes      | —       | Forwarded to CardistryPanel |
| `rows`  | `number`          | No       | —       | Forwarded to CardistryPanel |
