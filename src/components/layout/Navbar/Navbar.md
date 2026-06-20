# Navbar

A fixed top-right navigation widget present on every page. Renders a hamburger button that toggles a dropdown menu containing site-wide navigation links. Closes on outside click or Escape key. Also renders a session badge at the top-left indicating the logged-in user's role.

## State

| State    | Type      | Initial value | Description              |
| -------- | --------- | ------------- | ------------------------ |
| `isOpen` | `boolean` | `false`       | Whether the menu is open |

## Effects

- **On `isOpen` true** — attaches `mousedown` and `keydown` listeners to detect outside clicks and Escape key; cleans up on close or unmount
