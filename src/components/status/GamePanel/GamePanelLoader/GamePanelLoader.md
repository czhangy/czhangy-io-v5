# GamePanelLoader

Suspense boundary for the game panel. Shows a loading skeleton while GamePanelData fetches, then streams in the resolved panel.

## Props

| Prop        | Type              | Required | Default | Description                                      |
| ----------- | ----------------- | -------- | ------- | ------------------------------------------------ |
| `icon`      | `React.ReactNode` | No       | —       | Forwarded to both the fallback and GamePanelData |
| `className` | `string`          | No       | —       | Forwarded to both the fallback and GamePanelData |
