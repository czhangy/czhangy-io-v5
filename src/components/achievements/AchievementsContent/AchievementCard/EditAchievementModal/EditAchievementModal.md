# EditAchievementModal

A modal for editing an existing achievement. Pre-populates the shared AchievementForm with the achievement's current data and submits a PATCH request on save, then refreshes the page.

## Props

| Prop          | Type          | Required | Default | Description                            |
| ------------- | ------------- | -------- | ------- | -------------------------------------- |
| `achievement` | `Achievement` | Yes      | —       | Achievement to pre-populate and update |
| `onClose`     | `() => void`  | Yes      | —       | Called to dismiss the modal            |
