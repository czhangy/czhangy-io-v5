# Navbar

A full-width header bar present on every page, rendered in the document flow so page content does not overlap it. Contains a session badge on the left (showing the logged-in user's role when authenticated) and navigation controls on the right: a home icon link and a hamburger button that toggles a dropdown menu of site-wide links. The menu closes on outside click or Escape key.

## State

| State    | Type      | Initial value | Description              |
| -------- | --------- | ------------- | ------------------------ |
| `isOpen` | `boolean` | `false`       | Whether the menu is open |

## Effects

- **On `isOpen` true** — attaches `mousedown` and `keydown` listeners to detect outside clicks and Escape key; cleans up on close or unmount
