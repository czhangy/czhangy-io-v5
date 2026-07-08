# MusicPlayer

A collapsible music player control rendered in the footer. Collapsed by default, showing only a toggle button; expands in place to reveal the current track's title/source, an elapsed/total timer, transport controls (previous, play/pause, next), and a mute control. Background audio is muted by default.

## State

| State         | Type      | Initial value | Description                                        |
| ------------- | --------- | ------------- | -------------------------------------------------- |
| `isExpanded`  | `boolean` | `false`       | Whether the player is expanded or collapsed        |
| `isMuted`     | `boolean` | `true`        | Whether the background track is muted              |
| `isPlaying`   | `boolean` | `true`        | Whether playback is active                         |
| `trackIndex`  | `number`  | `0`           | Index of the current track within `MUSIC_TRACKS`   |
| `currentTime` | `number`  | `0`           | Current playback position of the track, in seconds |
| `duration`    | `number`  | `0`           | Total duration of the current track, in seconds    |

## Effects

- **On `trackIndex` change** — reloads the audio element for the new track's source and resumes playback if it was playing
- **On `isPlaying` change** — plays or pauses the audio element
- **On `isMuted` change** — syncs the audio element's muted state

## Computations

- `currentTrack` — the `Track` at `trackIndex` within `MUSIC_TRACKS`
- `currentTimeLabel` / `durationLabel` — `currentTime` / `duration` formatted as `m:ss` for display
