# NewLogForm

A form for composing a new blog log entry: title, tags, and a Tiptap-powered rich text body (bold/italic/underline, headings, lists, blockquotes, links). Not yet wired to any backend — the Publish button becomes enabled once the required fields are filled in, but currently only logs the draft payload.

## State

| State   | Type     | Initial value | Description                                    |
| ------- | -------- | ------------- | ---------------------------------------------- |
| `title` | `string` | `''`          | Entry title                                    |
| `tags`  | `string` | `''`          | Comma-separated tags (raw text)                |
| `body`  | `string` | `''`          | Entry body, serialized as HTML from the editor |

## Computations

- `toolbarButtonClass` — builds a toolbar button's class name, adding the active-state modifier when its corresponding mark/node is active at the cursor
- `isValid` — whether `title` is non-empty and the editor has content, gating the Publish button
