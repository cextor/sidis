# Security Specification - Sidis (Sistem Disposisi Surat)

## 1. Data Invariants
- A Disposition cannot exist without a valid `mailIncomingId`.
- Only `SEKRETARIS` or `ADMIN` can register incoming mail.
- Only `KAPUS` or `SEKRETARIS` can issue a disposition.
- Staff members can only see mail/dispositions assigned to them or public mail.
- Users can only modify their own profile data, except for `role` which only `ADMIN` can change.
- `createdAt` and `createdBy` fields are immutable after creation.
- `updatedAt` must always be set to `request.time`.

## 2. The "Dirty Dozen" Payloads (Denial Tests)

1. **Identity Spoofing**: Attempt to create a user profile with `role: 'ADMIN'` by a non-admin user.
2. **Path Injection**: Attempting to use a very long string (>128 chars) as a `mailId`.
3. **Ghost Field Update**: Updating a `MailIncoming` document with an extra field `isVerified: true`.
4. **State Shortcutting**: Updating `MailIncoming` status directly from `PENDING` to `COMPLETED` without a disposition (if business logic forbids it).
5. **Orphaned Disposition**: Creating a disposition for a `mailIncomingId` that doesn't exist.
6. **Unauthorized Read**: Staff member attempting to read a disposition sent to another staff member.
7. **Privilege Escalation**: User attempting to change their own `role`.
8. **Malicious File Link**: Attempting to set `pdfUrl` to a non-storage link or a script. (Checked via string size/format).
9. **Creation Timestamp Forgery**: Providing a `createdAt` date from the past instead of `request.time`.
10. **Modification of Immutable Fields**: Attempting to change `createdBy` on an existing mail.
11. **PII Leak**: Non-admin user attempting to list all emails/UIDs in the `users` collection.
12. **Denial of Wallet**: Attempting to create an extremely large subject string (e.g., 500KB) to consume storage/bandwidth.

## 3. Test Runner Plan
A `firestore.rules.test.ts` will be created to verify these denials once rules are drafted.
