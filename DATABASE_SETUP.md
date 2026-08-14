# VeritasAI database and authentication setup

This adds PostgreSQL persistence and Google/GitHub OAuth around the existing detector. The detector pipeline remains the same and anonymous `/api/analyze` requests still work, so the change is additive.

## 1. Start PostgreSQL

From the repository root:

```bash
docker compose up -d postgres
```

Check it:

```bash
docker compose ps
```

## 2. Configure the backend

```bash
cd backend
cp .env.example .env
```

Set a real `SESSION_SECRET` before sharing the environment.

For Google and GitHub login, add the provider credentials in `backend/.env`.

### Google OAuth redirect

```text
http://localhost:8000/api/auth/google/callback
```

### GitHub OAuth callback

```text
http://localhost:8000/api/auth/github/callback
```

OAuth providers should be configured for the same callback URLs shown above during local development.

## 3. Install backend dependencies

Activate the existing virtual environment and run:

```bash
pip install -r requirements.txt
```

## 4. Create/update database schema

```bash
alembic upgrade head
```

## 5. Run FastAPI

```bash
python -m uvicorn app.main:app --reload
```

## 6. Run the frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

## Data model

- `users`: application users
- `auth_accounts`: Google/GitHub identities linked to a user
- `essays`: original essay text and ownership
- `analyses`: analysis snapshot and detector version
- `sentence_analyses`: sentence-level evidence and signals

The `/api/analyze` response is intentionally unchanged. When the caller has an authenticated session, the essay and analysis are persisted after the existing detector completes. Anonymous analysis remains available.
