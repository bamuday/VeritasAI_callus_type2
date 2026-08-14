# VeritasAI — Start Here

This version adds database persistence and real Google/GitHub authentication **without changing the detector's analysis pipeline or response schema**.

## What was added

- PostgreSQL database via Docker Compose
- SQLAlchemy ORM
- Alembic migrations
- Google OAuth login
- GitHub OAuth login
- Server-side signed session cookie
- Users and linked OAuth accounts
- Multiple essays per user
- Saved analysis snapshots
- Sentence-level evidence persistence
- "My Essays" history in the frontend
- `.env.example` files and database setup documentation

## First run

### 1. Start PostgreSQL

From the repository root:

```bash
docker compose up -d postgres
```

### 2. Configure backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
cp .env.example .env
pip install -r requirements.txt
alembic upgrade head
```

On Windows PowerShell, activate with:

```powershell
.venv\Scripts\Activate.ps1
```

### 3. Configure OAuth

Create Google and/or GitHub OAuth applications and put the client credentials into `backend/.env`.

Local callback URLs:

```text
Google: http://localhost:8000/api/auth/google/callback
GitHub: http://localhost:8000/api/auth/github/callback
```

Use `http://localhost:3000` as the authorized frontend origin during local development.

### 4. Start FastAPI

```bash
python -m uvicorn app.main:app --reload
```

API docs:

```text
http://localhost:8000/docs
```

Health check:

```text
http://localhost:8000/health
```

### 5. Start Next.js

Open a second terminal:

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Important behavior

Anonymous `/api/analyze` requests remain supported. When an authenticated user submits an essay, FastAPI saves the exact submitted text and the resulting analysis after the existing detector completes.

The detector does **not** read the user's saved essay history as a reference corpus. Saved user essays therefore do not change the detection result.

## Security notes

- OAuth client secrets stay in `backend/.env` and are not committed.
- Provider passwords are never stored by VeritasAI.
- Application sessions use an HTTP cookie signed by FastAPI.
- In production, set a strong random `SESSION_SECRET` and use HTTPS.

## Database model

```text
users
  └── auth_accounts (Google/GitHub)
  └── essays
        └── analyses
              └── sentence_analyses
```

See `DATABASE_SETUP.md` for more detail.


## Authentication

For email/password, Google, and GitHub setup, see `AUTH_SETUP.md`.
