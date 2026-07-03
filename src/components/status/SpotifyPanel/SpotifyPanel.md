# SpotifyPanel

Suspense boundary for the Spotify panel. Defines the panel label and icon, passes them to both the loading fallback and SpotifyPanelData so they only need to be specified in one place.

## Props

| Prop   | Type     | Required | Default | Description                                        |
| ------ | -------- | -------- | ------- | -------------------------------------------------- |
| `cols` | `number` | Yes      | —       | Forwarded to both the fallback and the track panel |
| `rows` | `number` | No       | —       | Forwarded to both the fallback and the track panel |
