# LoginPage

A password-only login form with a "Log In" title and subtitle. Reads an optional `callbackUrl` query parameter to redirect after successful authentication.

## State

| State      | Type      | Initial value | Description                          |
| ---------- | --------- | ------------- | ------------------------------------ |
| `password` | `string`  | `''`          | Controlled input value               |
| `error`    | `string`  | `''`          | Error message from failed login      |
| `loading`  | `boolean` | `false`       | Whether a login request is in flight |
