# NewLogForm

A form for composing a new blog log entry: title, tags, and a Tiptap-powered rich text body (bold/italic/underline, headings, lists, blockquotes, links). Applying a link opens `LinkModal` to collect the URL instead of a browser prompt. Publishing posts the entry to the API, which persists it and generates a unique slug, then returns to the logs list.

## State

| State             | Type      | Initial value | Description                                    |
| ----------------- | --------- | ------------- | ---------------------------------------------- |
| `title`           | `string`  | `''`          | Entry title                                    |
| `tags`            | `string`  | `''`          | Comma-separated tags (raw text)                |
| `body`            | `string`  | `''`          | Entry body, serialized as HTML from the editor |
| `isPublishing`    | `boolean` | `false`       | Whether a publish request is in flight         |
| `isLinkModalOpen` | `boolean` | `false`       | Whether `LinkModal` is open for entering a URL |

## Computations

- `toolbarButtonClass` — builds a toolbar button's class name, adding the active-state modifier when its corresponding mark/node is active at the cursor
- `isValid` — whether `title` is non-empty, the editor has content, and no publish request is already in flight, gating the Publish button
