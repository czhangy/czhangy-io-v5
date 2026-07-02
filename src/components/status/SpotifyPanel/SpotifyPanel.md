# SpotifyPanel

Suspense boundary for the Spotify panel. Defines the panel label and icon, passes them to both the loading fallback and SpotifyPanelData so they only need to be specified in one place.

## Props

| Prop        | Type     | Required | Default | Description                                        |
| ----------- | -------- | -------- | ------- | -------------------------------------------------- |
| `className` | `string` | No       | —       | Forwarded to both the fallback and the track panel |
