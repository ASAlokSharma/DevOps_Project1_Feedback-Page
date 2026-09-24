# Test cases: Student Feedback App

## Automated (run in CI on every push/PR)
`test/validation.test.js` covers the email/length/required-field logic in `shared/validate.js`. Run locally only if you have Node installed: `node --test test/validation.test.js`. Otherwise, just push — GitHub Actions runs it for you.

## Manual test cases (run against the deployed preview URL)

| # | Field | Input | Expected result |
|---|-------|-------|------------------|
| 1 | Email | `plainaddress` (no @) | Rejected — "Enter a valid email address." |
| 2 | Email | `missing@domain` (no TLD) | Rejected |
| 3 | Email | `@missingusername.com` | Rejected |
| 4 | Email | `user name` (space) | Rejected |
| 5 | Email | `alex` | Accepted |
| 6 | Name | empty | Rejected — "Name is required." |
| 7 | Name | 101+ characters | Rejected — "Name must be under 100 characters." |
| 8 | Name | `   ` (spaces only) | Rejected (treated as empty) |
| 9 | Course | empty | Rejected |
| 10 | Feedback | empty | Rejected |
| 11 | Feedback | 501+ characters | Rejected — "Feedback must be under 500 characters." |
| 12 | Feedback | `<script>alert(1)</script>` | Accepted as text, but rendered as plain text (not executed) in the list — confirms XSS escaping works |
| 13 | All fields | valid values | Submits successfully, toast appears, new entry shows in list |
| 14 | Network | submit with backend unreachable (e.g. stop the dev preview) | Shows "Network error" toast, doesn't crash |
| 15 | Admin page | visit `/admin` with no credentials | Browser shows a login prompt (401 until authenticated) |
| 16 | Admin page | wrong password | Login prompt reappears (401) |
| 17 | Admin page | correct password | Table of all feedback loads, including email column |

Test case 12 is the important one to actually try — it's what proves `escapeHtml()` in `app.js` is doing its job instead of just trusting the database.