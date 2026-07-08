# CareerContent

Client component that renders the job history timeline with admin controls for adding, editing, and deleting entries. An "Add Job" button opens AddJobModal; editing a card opens EditJobModal.

## Props

| Prop   | Type    | Required | Default | Description                      |
| ------ | ------- | -------- | ------- | -------------------------------- |
| `jobs` | `Job[]` | Yes      | —       | Jobs fetched server-side at load |

## State

| State        | Type          | Initial value | Description                                   |
| ------------ | ------------- | ------------- | --------------------------------------------- |
| `jobs`       | `Job[]`       | `initialJobs` | Current list of jobs, kept sorted by end date |
| `editingJob` | `Job \| null` | `null`        | Job being edited, or null if none open        |
| `isAddOpen`  | `boolean`     | `false`       | Whether AddJobModal is open                   |

## Handlers

- `handleAdd` — inserts the newly created job and re-sorts the timeline
- `handleUpdate` — merges an edited job into the list, re-sorts, and closes the edit modal
- `handleDelete` — deletes a job by id and removes it from the list

## Computations

- `getSortTimestamp` — sort key for a job; current/ongoing jobs (`endDate` null) sort as most recent
- `isAdmin` — whether the current session role is `ADMIN`
