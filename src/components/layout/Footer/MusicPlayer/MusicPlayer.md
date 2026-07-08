# MusicPlayer

A collapsible music player control rendered in the footer. Collapsed by default, showing only a toggle button; expands in place to reveal the current track's title/source and a mute control. Background audio is muted by default.

## State

| State        | Type      | Initial value | Description                                 |
| ------------ | --------- | ------------- | ------------------------------------------- |
| `isExpanded` | `boolean` | `false`       | Whether the player is expanded or collapsed |
| `isMuted`    | `boolean` | `true`        | Whether the background track is muted       |

## Effects

- **On mount** — starts background track playback (muted, looping)
- **On `isMuted` change** — syncs the audio element's muted state and resumes playback if it was paused when unmuting
