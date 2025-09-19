# ContractHub Backend (FastAPI)

## Setup

1. Create a Python venv and install deps:
```bash
python -m venv .venv
. .venv/Scripts/activate  # on Windows PowerShell: . .venv/Scripts/Activate.ps1
pip install -r backend/requirements.txt
```

2. Provision Postgres with pgvector (local Docker example):
```bash
docker run --name contracthub-pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d ankane/pgvector:latest
```

3. Configure env:
- Copy `backend/.env.example` to `backend/.env` and adjust values.

4. Run server:
```bash
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

## Endpoints
- POST `/auth/signup` → returns JWT
- POST `/auth/login` → returns JWT
- POST `/documents/upload` → multipart file, requires `Authorization: Bearer <token>`
- GET `/documents/list` → list user documents
- POST `/query/search` → RAG-style search, requires auth

## Notes
- Embeddings and parsing are mocked. Vector dim = 4. Uses pgvector `<=>` operator.
- All data is scoped by `user_id` from JWT.

## Deployment
- DB: Supabase (enable pgvector extension) or managed Postgres with `CREATE EXTENSION IF NOT EXISTS vector`.
- Backend: Render/Fly/Heroku. Set `DATABASE_URL` and `JWT_SECRET` env vars. Start cmd:
```
uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT
```
