# KelanaAI deployment checklist

1. Create a Neon PostgreSQL database and set `DATABASE_URL` on the backend host.
2. Set `AWS_REGION`, `MODEL_ID`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `JWT_SECRET_KEY`, `KNOWLEDGE_BASE_ID`, and `KNOWLEDGE_BASE_MODEL_ARN` as backend environment variables.
3. Deploy `backend/` using `backend/render.yaml`, with `uvicorn main:app --host 0.0.0.0 --port $PORT`.
4. Set `NEXT_PUBLIC_API_URL` on Vercel to the deployed backend URL.
5. Add the Vercel URL to the backend CORS allow-list.
6. Verify register, login, trip generation, trip history, assistant, and chat from the public URL.

Never commit production secrets to Git.
