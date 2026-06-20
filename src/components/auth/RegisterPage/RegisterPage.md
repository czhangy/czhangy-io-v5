# RegisterPage

An admin-only form for creating new regular user accounts. Accepts a password, posts to the register API, and shows a success or error message in place.

## State

| State      | Type      | Initial value | Description                         |
| ---------- | --------- | ------------- | ----------------------------------- |
| `password` | `string`  | `''`          | Controlled password input value     |
| `error`    | `string`  | `''`          | Error message from the API          |
| `success`  | `boolean` | `false`       | Whether the last creation succeeded |
| `loading`  | `boolean` | `false`       | Whether a request is in flight      |
