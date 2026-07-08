# JobCard

A single job entry card showing a company logo, company name, job title, and date range. "Present" is shown as plain text when the job is current. Admins see edit/delete actions.

## Props

| Prop       | Type         | Required | Default | Description                                 |
| ---------- | ------------ | -------- | ------- | ------------------------------------------- |
| `job`      | `Job`        | Yes      | —       | Job data to display                         |
| `isAdmin`  | `boolean`    | Yes      | —       | Whether to render admin edit/delete actions |
| `onEdit`   | `() => void` | Yes      | —       | Called when the edit action is clicked      |
| `onDelete` | `() => void` | Yes      | —       | Called when the delete action is confirmed  |
