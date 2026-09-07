# Protect CRUD endpoints to respect user ownership

GET filters by authenticated user. PUT and DELETE return HTTP 403 when the trip belongs to another user. Generate and detail reads are also ownership-scoped.
