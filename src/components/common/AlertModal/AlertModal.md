# AlertModal

A modal that shows a single message with an "OK" button to dismiss it. Used for surfacing errors or notices that only need acknowledgement, not a decision.

## Props

| Prop      | Type         | Required | Default | Description                        |
| --------- | ------------ | -------- | ------- | ---------------------------------- |
| `title`   | `string`     | Yes      | —       | Modal title                        |
| `message` | `string`     | Yes      | —       | The message to display             |
| `onClose` | `() => void` | Yes      | —       | Called when the modal should close |
