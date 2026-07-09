# MusicPlayer

A collapsible music player control rendered in the footer. Collapsed by default, showing only a toggle button; expands both horizontally and vertically to reveal the current track's title/source and elapsed/total timer on one row, with transport controls (previous, play/pause, next) and a mute control on the row below. Background audio is muted by default.

The expand animation grows to the panel's actual intrinsic size via a CSS grid `0fr → 1fr` transition (on `.content`, wrapping an `.inner` div with `min-width: 0; min-height: 0; overflow: hidden`) rather than a hardcoded `max-width`/`max-height` — avoids guessing a size large enough for every track's title/source text.

## State

| State         | Type       | Initial value | Description                                                                                                  |
| ------------- | ---------- | ------------- | ------------------------------------------------------------------------------------------------------------ |
| `isExpanded`  | `boolean`  | `false`       | Whether the player is expanded or collapsed                                                                  |
| `isMuted`     | `boolean`  | `true`        | Whether the background track is muted                                                                        |
| `isPlaying`   | `boolean`  | `false`       | Whether playback is active                                                                                   |
| `history`     | `number[]` | `[0]`         | Indices of tracks played so far, in order; the last is current. Replaced with a single random index on mount |
| `currentTime` | `number`   | `0`           | Current playback position of the track, in seconds                                                           |
| `duration`    | `number`   | `0`           | Total duration of the current track, in seconds                                                              |

## Effects

- **On mount** — picks a random starting track index and replaces `history` with it. `history` starts as `[0]` so the server-rendered and initial client render match (avoiding a hydration mismatch); the swap to a random track happens client-side right after mount
- **On `trackIndex` change** — reloads the audio element for the new track's source and resumes playback if it was playing
- **On `isPlaying` change** — plays or pauses the audio element
- **On `isMuted` change** — syncs the audio element's muted state

## Computations

- `trackIndex` — the last entry in `history`, i.e. the currently playing track's index
- `currentTrack` — the `Track` at `trackIndex` within `MUSIC_TRACKS`
- `currentTimeLabel` / `durationLabel` — `currentTime` / `duration` formatted as `m:ss` for display

## Behavior

- **Next** picks a random track excluding whichever of the last `NO_REPEAT_WINDOW` (5) tracks are still eligible (capped so at least one candidate always remains), and appends it to `history`. The audio element's `onEnded` reuses this same handler, so a track finishing naturally behaves like pressing Next.
- **Previous** pops the last entry off `history`, returning to whichever track played before the current one. It's a no-op if there's no prior track in `history`.
