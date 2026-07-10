# LogForm

Shared form for creating and editing a log entry: title, tags, and a Tiptap-powered rich text body (bold/italic/underline, headings, lists, blockquotes, links). Used by both `NewLogForm` and `EditLogForm`. Tags are entered as removable chips via `TagsField`. Applying a link opens `LinkModal` to collect the URL instead of a browser prompt.

## Props

| Prop            | Type                                         | Required | Default | Description                                                   |
| --------------- | -------------------------------------------- | -------- | ------- | ------------------------------------------------------------- |
| `submitLabel`   | `string`                                     | Yes      | —       | Label for the submit button (e.g. "Publish" or "Save")        |
| `initialValues` | `Partial<CreateLogParams>`                   | No       | —       | Pre-filled field values, used when editing                    |
| `onSubmit`      | `(values: CreateLogParams) => Promise<void>` | Yes      | —       | Called with the form values on submit; throw to show an error |

## State

| State             | Type       | Initial value                | Description                                    |
| ----------------- | ---------- | ---------------------------- | ---------------------------------------------- |
| `title`           | `string`   | `initialValues?.title ?? ''` | Entry title                                    |
| `tags`            | `string[]` | `initialValues?.tags ?? []`  | Committed tags                                 |
| `body`            | `string`   | `initialValues?.body ?? ''`  | Entry body, serialized as HTML from the editor |
| `error`           | `string`   | `''`                         | Validation or submission error message         |
| `isSubmitting`    | `boolean`  | `false`                      | Whether a submission is in flight              |
| `isLinkModalOpen` | `boolean`  | `false`                      | Whether `LinkModal` is open for entering a URL |

## Handlers

- `handleSubmit` — calls `onSubmit` with the current field values, and surfaces any thrown error

## Computations

- `toolbarButtonClass` — builds a toolbar button's class name, adding the active-state modifier when its corresponding mark/node is active at the cursor
- `isValid` — whether `title` is non-empty, the editor has content, and no submission is already in flight, gating the submit button
