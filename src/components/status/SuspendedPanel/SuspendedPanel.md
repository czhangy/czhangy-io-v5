# SuspendedPanel

A Suspense boundary wrapper for status panels that shows a loading skeleton while the panel's async content resolves.

## Props

| Prop        | Type              | Required | Default | Description                                     |
| ----------- | ----------------- | -------- | ------- | ----------------------------------------------- |
| `label`     | `string`          | Yes      | —       | Passed to the fallback StatusPanel header label |
| `children`  | `React.ReactNode` | Yes      | —       | The async panel loader to suspend on            |
| `className` | `string`          | No       | —       | Grid positioning class applied to the fallback  |
