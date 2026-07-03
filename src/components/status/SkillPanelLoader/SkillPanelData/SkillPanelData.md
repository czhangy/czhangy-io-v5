# SkillPanelData

Async server component that fetches the current skill entry from the database, then renders SkillPanel with the resolved data.

## Props

| Prop    | Type              | Required | Default | Description             |
| ------- | ----------------- | -------- | ------- | ----------------------- |
| `label` | `string`          | Yes      | —       | Forwarded to SkillPanel |
| `icon`  | `React.ReactNode` | Yes      | —       | Forwarded to SkillPanel |
| `cols`  | `number`          | Yes      | —       | Forwarded to SkillPanel |
| `rows`  | `number`          | No       | —       | Forwarded to SkillPanel |
