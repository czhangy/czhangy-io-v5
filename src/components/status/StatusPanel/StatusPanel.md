# StatusPanel

A uniform panel shell used across the Status page dashboard. Renders a labeled header and a content slot below, with consistent border and spacing. Grid placement is controlled via `cols` and `rows` props, which are applied as CSS custom properties and consumed by the panel's own styles.

## Props

| Prop           | Type              | Required | Default | Description                                                             |
| -------------- | ----------------- | -------- | ------- | ----------------------------------------------------------------------- |
| `label`        | `string`          | Yes      | —       | Header label displayed in small mono caps                               |
| `cols`         | `number`          | Yes      | —       | Number of grid columns the panel spans                                  |
| `icon`         | `React.ReactNode` | No       | —       | Icon rendered left of the label in the header                           |
| `children`     | `React.ReactNode` | No       | —       | Panel body content                                                      |
| `headerAction` | `React.ReactNode` | No       | —       | Element rendered right-aligned in the header; revealed on hover via CSS |
| `rows`         | `number`          | No       | `1`     | Number of grid rows the panel spans                                     |
| `isLoading`    | `boolean`         | No       | `false` | When true, shows loading animations and suppresses children             |
| `noPadding`    | `boolean`         | No       | `false` | When true, removes body padding so children can fill edge-to-edge       |
| `mobileOrder`  | `number`          | No       | —       | CSS `order` value applied at `≤768px` to control mobile grid sequence   |
