# Security Specification: Kin Media Production Firestore Security

## Data Invariants
1. Admins have full CRUD access over deliverables, users, and admin lists.
2. A client can ONLY read a deliverable if their authenticated email (`request.auth.token.email.lower()`) matches `resource.data.clientEmail.lower()` and `request.auth.token.email_verified == true`.
3. Clients cannot create, modify, or delete deliverables.
4. Clients can create revision comments on deliverables assigned to their email, but cannot edit other clients' deliverables or comments.
5. Bootstrapped admin: `minakhairat96@gmail.com` is granted administrative access. Users with document records in `/admins/{userId}` are also admins.
6. User profiles can only be written by the user themselves (without changing role) or by an admin.
7. Document IDs must conform to `isValidId` (`^[a-zA-Z0-9_\-]+$` and length <= 128).
8. All string fields have explicit length boundaries to guard against Denial of Wallet attacks.

## The "Dirty Dozen" Payloads (Must be REJECTED with PERMISSION_DENIED)
1. **Unauthenticated Read of Deliverables**: An unauthenticated user attempts `get` or `list` on `/deliverables/{id}`. (DENIED: `isSignedIn() == false`).
2. **Client Reading Another Client's Deliverable**: Authenticated user with email `clientA@test.com` attempts `get` on deliverable assigned to `clientB@test.com`. (DENIED: `clientEmail != auth.email`).
3. **Client Modifying Deliverable Link**: Authenticated client tries to alter `link` or `clientEmail` in `/deliverables/{id}`. (DENIED: only admin can update deliverables).
4. **Client Deleting Deliverable**: Authenticated client attempts `delete` on `/deliverables/{id}`. (DENIED: only admin can delete).
5. **Self-Promotion to Admin**: Non-admin user tries to create or update `/admins/{uid}` with their own UID. (DENIED: only existing admin can manage `/admins`).
6. **Client Setting Role to Admin**: Normal user creates `/users/{uid}` with `"role": "admin"`. (DENIED: non-admin cannot assign admin role).
7. **Email Spoof Attack with Unverified Email**: Attacker with unverified email tries to read a deliverable or admin data. (DENIED: `request.auth.token.email_verified == true` required).
8. **Malicious Long Payload / Denial of Wallet**: Attacker sends a 500KB string for deliverable title or notes. (DENIED: `size()` bounds check).
9. **Path Traversal / Malicious ID**: Attacker requests `/deliverables/..%2F..%2Fsecret`. (DENIED: `isValidId()` regex guard).
10. **Revision Forgery on Other Client's Deliverable**: User A tries to post a revision to User B's deliverable. (DENIED: Parent deliverable clientEmail check).
11. **Shadow Fields Injection**: Client tries to write extra unexpected fields into Revision document. (DENIED: strict keys validation).
12. **Blanket List Scraping**: Non-admin user sends query `deliverables` without matching their own email. (DENIED: query enforcer evaluates `resource.data.clientEmail`).
