# SkillPanelLoader

Suspense boundary for the skill panel. Shows a loading skeleton while SkillPanelData fetches, then streams in the resolved panel.

## Props

| Prop        | Type              | Required | Default | Description                                       |
| ----------- | ----------------- | -------- | ------- | ------------------------------------------------- |
| `icon`      | `React.ReactNode` | No       | —       | Forwarded to both the fallback and SkillPanelData |
| `className` | `string`          | No       | —       | Forwarded to both the fallback and SkillPanelData |
