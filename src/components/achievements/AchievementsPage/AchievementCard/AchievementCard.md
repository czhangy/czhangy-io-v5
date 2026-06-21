# AchievementCard

A single achievement card displaying name and date (same row), category, tier (rendered as ★ stars), and description.

## Props

| Prop          | Type          | Required | Default | Description                 |
| ------------- | ------------- | -------- | ------- | --------------------------- |
| `achievement` | `Achievement` | Yes      | —       | Achievement data to display |

## Computations

- `tierStars` — maps tier (1–3) to a filled/empty star string; tier 1 is ★★★, tier 3 is ★☆☆
