# SkillPanelLoader

Suspense boundary for the skill panel. Defines the panel label and icon, passes them to both the loading fallback and SkillPanelData so they only need to be specified in one place.

## Props

| Prop   | Type     | Required | Default | Description                                       |
| ------ | -------- | -------- | ------- | ------------------------------------------------- |
| `cols` | `number` | Yes      | —       | Forwarded to both the fallback and SkillPanelData |
| `rows` | `number` | No       | —       | Forwarded to both the fallback and SkillPanelData |
