# SpotifyPanelData

Async server component that fetches the most recently played track from the Spotify Web API and renders it inside a StatusPanel with album art, track name, and artist. Clicking the track opens it in Spotify.

## Props

| Prop    | Type              | Required | Default | Description                  |
| ------- | ----------------- | -------- | ------- | ---------------------------- |
| `label` | `string`          | Yes      | —       | Forwarded to the StatusPanel |
| `icon`  | `React.ReactNode` | Yes      | —       | Forwarded to the StatusPanel |
| `cols`  | `number`          | Yes      | —       | Forwarded to the StatusPanel |
| `rows`  | `number`          | No       | —       | Forwarded to the StatusPanel |
