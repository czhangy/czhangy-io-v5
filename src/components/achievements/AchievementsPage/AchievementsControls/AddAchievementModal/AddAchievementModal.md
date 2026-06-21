# AddAchievementModal

A thin modal wrapper for creating a new achievement. Delegates form rendering and validation to AchievementForm, and on success posts to the API, refreshes the page, then closes.

## Props

| Prop      | Type         | Required | Default | Description                 |
| --------- | ------------ | -------- | ------- | --------------------------- |
| `onClose` | `() => void` | Yes      | —       | Called to dismiss the modal |
