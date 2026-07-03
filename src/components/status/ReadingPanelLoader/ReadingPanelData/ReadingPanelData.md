# ReadingPanelData

Async server component that fetches the 3 most recently added ReadMedia records and passes them to ReadingPanel.

## Props

| Prop    | Type              | Required | Default | Description        |
| ------- | ----------------- | -------- | ------- | ------------------ |
| `label` | `string`          | Yes      | —       | Panel header label |
| `icon`  | `React.ReactNode` | Yes      | —       | Panel header icon  |
| `cols`  | `number`          | Yes      | —       | Grid column span   |
| `rows`  | `number`          | No       | `1`     | Grid row span      |
