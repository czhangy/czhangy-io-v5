# LocationPanelLoader

Suspense boundary for the location panel. Shows a loading skeleton while LocationPanelData fetches, then streams in the resolved panel.

## Props

| Prop        | Type              | Required | Default | Description                                          |
| ----------- | ----------------- | -------- | ------- | ---------------------------------------------------- |
| `icon`      | `React.ReactNode` | No       | —       | Forwarded to both the fallback and LocationPanelData |
| `className` | `string`          | No       | —       | Forwarded to both the fallback and LocationPanelData |
