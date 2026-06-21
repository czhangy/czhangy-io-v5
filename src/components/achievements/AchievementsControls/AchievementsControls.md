# AchievementsControls

A client component rendering the control row below the achievements page title. Shows an "Add Achievement" button only to admin users; clicking it opens the AddAchievementModal. Designed to eventually hold filters and sorting controls alongside the button.

## State

| State    | Type      | Initial value | Description               |
| -------- | --------- | ------------- | ------------------------- |
| `isOpen` | `boolean` | `false`       | Whether the modal is open |
