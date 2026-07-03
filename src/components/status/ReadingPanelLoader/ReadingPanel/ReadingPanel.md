# ReadingPanel

Status panel displaying the currently reading books. Renders three placeholder rows shaped like future book entries while functionality is pending.

## Props

| Prop    | Type              | Required | Default | Description        |
| ------- | ----------------- | -------- | ------- | ------------------ |
| `label` | `string`          | Yes      | —       | Panel header label |
| `icon`  | `React.ReactNode` | Yes      | —       | Panel header icon  |
| `cols`  | `number`          | Yes      | —       | Grid column span   |
| `rows`  | `number`          | No       | `1`     | Grid row span      |
