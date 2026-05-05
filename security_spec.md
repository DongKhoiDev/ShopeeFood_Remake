# Security Spec

## Data Invariants
1. A user document must have `role` either 'user' or 'admin'. Only users can create their own profile, but they cannot bootstrap themselves as 'admin' unless verified or if they are the first admin (or we lock down admin via an explicit rule).
2. Restaurants can only be created by an Admin.
3. Orders can only be created by the authenticated user placing the order. They must set themselves as `userId`.
4. Users can only read their own orders. Admins can read all orders.

## Dirty Dozen Payloads
1. User profile creation with `role = 'admin'` (Should fail if self-bootstrapping).
2. User profile update affecting `role` field.
3. Restaurant created by non-admin.
4. Restaurant update missing `updatedAt == request.time`.
5. Order creation with `userId` not matching `request.auth.uid`.
6. Order creation missing `status: 'PENDING'`.
...

## Test Runner
Testing will be conceptually validated via rules.
