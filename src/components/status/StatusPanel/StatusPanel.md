# StatusPanel

A uniform panel shell used across the Status page dashboard. Renders a labeled header and a content slot below, with consistent border and spacing. The header action slot is CSS-revealed on panel hover. Grid placement (column/row spans) is controlled by the parent via `className`.

## Props

| Prop           | Type              | Required | Default | Description                                                             |
| -------------- | ----------------- | -------- | ------- | ----------------------------------------------------------------------- |
| `label`        | `string`          | Yes      | —       | Header label displayed in small mono caps                               |
| `children`     | `React.ReactNode` | Yes      | —       | Panel body content                                                      |
| `headerAction` | `React.ReactNode` | No       | —       | Element rendered right-aligned in the header; revealed on hover via CSS |
| `className`    | `string`          | No       | —       | Additional class for grid placement from parent                         |
