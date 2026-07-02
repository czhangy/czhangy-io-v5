# SpotifyPanelData

Async server component that fetches the most recently played track from the Spotify Web API and renders it inside a StatusPanel with album art, track name, and artist. Clicking the track opens it in Spotify.

## Props

| Prop        | Type              | Required | Default | Description                       |
| ----------- | ----------------- | -------- | ------- | --------------------------------- |
| `icon`      | `React.ReactNode` | No       | —       | Forwarded to the StatusPanel icon |
| `className` | `string`          | No       | —       | Forwarded to the StatusPanel      |
