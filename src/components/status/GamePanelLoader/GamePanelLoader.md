# GamePanelLoader

Suspense boundary for the game panel. Defines the panel label and icon, passes them to both the loading fallback and GamePanelData so they only need to be specified in one place.

## Props

| Prop   | Type     | Required | Default | Description                                      |
| ------ | -------- | -------- | ------- | ------------------------------------------------ |
| `cols` | `number` | Yes      | —       | Forwarded to both the fallback and GamePanelData |
| `rows` | `number` | No       | —       | Forwarded to both the fallback and GamePanelData |
