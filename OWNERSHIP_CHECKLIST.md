# Session 8 ownership verification

- Authenticated GET requests return only trips with the current user's `user_id`.
- PUT requests return `403 Forbidden` when the trip owner differs.
- DELETE requests return `403 Forbidden` when the trip owner differs.
- The frontend never sends `user_id` in a trip creation request.
