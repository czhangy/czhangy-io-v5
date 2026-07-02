# SpotifyPanel

Suspense boundary for the Spotify panel. Shows a loading skeleton while the async data component fetches the most recently played track from the Spotify Web API, then streams in the track with album art. Clicking the track opens it in Spotify.

## Props

| Prop        | Type              | Required | Default | Description                                        |
| ----------- | ----------------- | -------- | ------- | -------------------------------------------------- |
| `icon`      | `React.ReactNode` | No       | —       | Forwarded to both the fallback and the track panel |
| `className` | `string`          | No       | —       | Forwarded to both the fallback and the track panel |
