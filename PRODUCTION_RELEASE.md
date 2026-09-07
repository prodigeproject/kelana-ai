# Production release checklist

- Backend runs with the production port and `/health` responds successfully.
- Frontend uses `NEXT_PUBLIC_API_URL` instead of a localhost-only URL.
- Database and AWS credentials are configured as hosting-provider environment variables.
- HTTPS, authentication, trip generation, RAG assistant, and conversation history are verified end to end.
