# AchievementCard

A single achievement card displaying name and date (same row), category, tier (rendered as ★ stars), and description. Shows hover edit and delete buttons for admins — edit opens a pre-populated modal; delete removes the achievement from the database immediately.

## Props

| Prop          | Type          | Required | Default | Description                                                   |
| ------------- | ------------- | -------- | ------- | ------------------------------------------------------------- |
| `achievement` | `Achievement` | Yes      | —       | Achievement data to display                                   |
| `searchQuery` | `string`      | Yes      | —       | Active search query; bolds the matching substring of the name |

## State

| State       | Type      | Initial value | Description                    |
| ----------- | --------- | ------------- | ------------------------------ |
| `isEditing` | `boolean` | `false`       | Whether the edit modal is open |

## Computations

- `tierStars` — maps tier (1–3) to a filled/empty star string; tier 1 is ★★★, tier 3 is ★☆☆
