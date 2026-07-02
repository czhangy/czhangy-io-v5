# ShowsPanelLoader

Suspense boundary for the shows panel. Shows a loading skeleton while ShowsPanelData fetches, then streams in the resolved panel.

## Props

| Prop        | Type              | Required | Default | Description                                       |
| ----------- | ----------------- | -------- | ------- | ------------------------------------------------- |
| `icon`      | `React.ReactNode` | No       | —       | Forwarded to both the fallback and ShowsPanelData |
| `className` | `string`          | No       | —       | Forwarded to both the fallback and ShowsPanelData |
