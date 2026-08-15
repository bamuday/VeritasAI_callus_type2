# VeritasAI — Installation & Start Guide

This guide is the practical setup document for running the complete VeritasAI project locally.

It covers:

- Prerequisites
- Repository setup
- PostgreSQL
- Backend virtual environment
- Python dependencies
- Environment variables
- Database migrations
- Authentication
- FastAPI
- Next.js
- Frontend environment configuration
- Testing
- Production build
- Troubleshooting
- Clean reset

---

# 1. Architecture You Are Starting

VeritasAI runs as three local services/processes:

```text
┌────────────────────┐
│  Next.js Frontend  │
│   localhost:3000   │
└─────────┬──────────┘
          │ HTTP / JSON
          ▼
┌────────────────────┐
│   FastAPI Backend  │
│   localhost:8000   │
└─────────┬──────────┘
          │ SQL
          ▼
┌────────────────────┐
│ PostgreSQL 16      │
│   localhost:5432   │
└────────────────────┘
```

OAuth providers are external:

```text
Google OAuth ──┐
               ├──> FastAPI ──> Session/PostgreSQL
GitHub OAuth ──┘
```

---

# 2. Prerequisites

Install these before starting.

## Required

### Python

Recommended:

```text
Python 3.11
```

Verify:

```bash
python3.11 --version
```

Expected:

```text
Python 3.11.x
```

### Node.js

Use a current LTS release compatible with Next.js 14.

Verify:

```bash
node --version
npm --version
```

### Docker

Docker Desktop is the easiest way to run the included PostgreSQL service.

Verify:

```bash
docker --version
docker compose version
```

### Git

Verify:

```bash
git --version
```

---

# 3. Get the Project

If cloning from Git:

```bash
git clone <YOUR_REPOSITORY_URL>
cd VeritasAI_callus_type2-main
```

If you already have the project directory, simply:

```bash
cd VeritasAI_callus_type2-main
```

Check the root:

```bash
ls
```

You should see:

```text
backend
frontend
docker-compose.yml
readme.md
installation.md
```

---

# 4. Start PostgreSQL

PostgreSQL is provided through Docker Compose.

From the repository root:

```bash
docker compose up -d postgres
```

Check the service:

```bash
docker compose ps
```

The container should be:

```text
veritasai-postgres
```

The project uses:

```text
Host:     localhost
Port:     5432
Database: veritasai
User:     veritasai
Password: veritasai
```

These are development credentials only.

Do not use them for production.

---

# 5. Backend Setup

Open a new terminal.

Go into the backend:

```bash
cd VeritasAI_callus_type2-main/backend
```

---

# 6. Create Python Virtual Environment

macOS/Linux:

```bash
python3.11 -m venv .venv
```

Windows PowerShell:

```powershell
py -3.11 -m venv .venv
```

The directory should now exist:

```text
backend/
└── .venv/
```

---

# 7. Activate Virtual Environment

## macOS/Linux

```bash
source .venv/bin/activate
```

## Windows PowerShell

```powershell
.\.venv\Scripts\Activate.ps1
```

If PowerShell blocks activation:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then:

```powershell
.\.venv\Scripts\Activate.ps1
```

---

# 8. Verify Python Environment

This step is important.

macOS/Linux:

```bash
which python
python -c "import sys; print(sys.executable)"
```

Windows:

```powershell
where.exe python
python -c "import sys; print(sys.executable)"
```

The path should point inside:

```text
backend/.venv/
```

For example:

```text
.../VeritasAI_callus_type2-main/backend/.venv/bin/python
```

If it points to system Python, do not continue until the virtual environment is active.

---

# 9. Install Backend Dependencies

Upgrade pip:

```bash
python -m pip install --upgrade pip
```

Install dependencies:

```bash
python -m pip install -r requirements.txt
```

The backend dependencies include:

```text
FastAPI
Uvicorn
Pydantic
SQLAlchemy
Psycopg
Alembic
Authlib
Argon2
HTTPX
PyTorch
Transformers
Tokenizers
```

---

# 10. Verify PyTorch

Run:

```bash
python -c "import torch; print(torch.__version__)"
```

The repository currently pins:

```text
2.8.0
```

---

# 11. Verify Transformers

Run:

```bash
python -c "import transformers; print(transformers.__version__)"
```

The repository currently pins:

```text
4.55.4
```

---

# 12. Configure Backend Environment

From:

```text
backend/
```

copy the example file:

```bash
cp .env.example .env
```

Windows:

```powershell
copy .env.example .env
```

---

# 13. Backend `.env`

A local development configuration should look like:

```env
APP_NAME=VeritasAI Backend
APP_VERSION=1.1.0
ENVIRONMENT=development
HOST=127.0.0.1
PORT=8000

FRONTEND_URL=http://localhost:3000

MODEL_NAME=distilgpt2
MAX_MODEL_TOKENS=512

DATABASE_URL=postgresql+psycopg://veritasai:veritasai@localhost:5432/veritasai

SESSION_SECRET=replace-with-a-long-random-secret
SESSION_HTTPS_ONLY=false

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_REDIRECT_URI=http://localhost:8000/api/auth/github/callback
```

---

# 14. Generate a Better Session Secret

For local testing, a placeholder works.

For a real deployment, generate a strong secret.

Python example:

```bash
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

Copy the output into:

```env
SESSION_SECRET=YOUR_GENERATED_SECRET
```

Never commit the real `.env`.

---

# 15. Run Database Migrations

Make sure:

1. PostgreSQL is running.
2. `.venv` is active.
3. `backend/.env` exists.

Then:

```bash
cd backend
alembic upgrade head
```

Check migration state:

```bash
alembic current
```

The database should contain:

```text
users
auth_accounts
essays
analyses
sentence_analyses
```

---

# 16. Authentication Setup

Authentication is optional for the basic anonymous analysis endpoint.

You can run VeritasAI with:

```text
Email/password
```

without configuring Google/GitHub.

---

# 17. Email/Password Authentication

Start the application and use the registration UI.

The frontend calls:

```http
POST /api/auth/register
```

with:

```json
{
  "name": "Your Name",
  "email": "you@example.com",
  "password": "your-password"
}
```

Password requirements currently include:

```text
Minimum: 8 characters
Maximum: 128 characters
```

Passwords are hashed using Argon2.

---

# 18. Google OAuth Setup

Google login requires an OAuth application.

Create a Google OAuth Web Application.

Use this local redirect URI:

```text
http://localhost:8000/api/auth/google/callback
```

Put the credentials into:

```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
```

Restart FastAPI after changing the file.

Start login through:

```text
http://localhost:8000/api/auth/google
```

---

# 19. GitHub OAuth Setup

Create a GitHub OAuth App.

Use:

```text
Application name: VeritasAI Local
Homepage URL: http://localhost:3000
Authorization callback URL: http://localhost:8000/api/auth/github/callback
```

Add credentials:

```env
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
GITHUB_REDIRECT_URI=http://localhost:8000/api/auth/github/callback
```

Restart FastAPI.

---

# 20. Start the Backend

From:

```text
backend/
```

with `.venv` active:

```bash
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Expected:

```text
Uvicorn running on http://127.0.0.1:8000
```

Do not close this terminal.

---

# 21. Verify Backend

Open:

```text
http://127.0.0.1:8000/health
```

Expected JSON:

```json
{
  "status": "ok",
  "service": "veritasai"
}
```

Open Swagger:

```text
http://127.0.0.1:8000/docs
```

You should see the FastAPI API documentation.

---

# 22. Test Analysis Without Frontend

The repository contains:

```text
backend/request.json
```

Test:

```bash
curl -s -X POST http://127.0.0.1:8000/api/analyze \
  -H "Content-Type: application/json" \
  --data-binary @request.json
```

Save output:

```bash
curl -s -X POST http://127.0.0.1:8000/api/analyze \
  -H "Content-Type: application/json" \
  --data-binary @request.json \
  -o response.json
```

Inspect:

```bash
cat response.json
```

---

# 23. Frontend Setup

Open another terminal.

Go to:

```bash
cd VeritasAI_callus_type2-main/frontend
```

Install packages:

```bash
npm install
```

The frontend uses:

```text
Next.js 14
React 18
TypeScript
Tailwind CSS
Framer Motion
Lucide React
```

---

# 24. Frontend Environment

Create:

```text
frontend/.env.local
```

Add:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Do not put backend secrets in this file.

Anything beginning with:

```text
NEXT_PUBLIC_
```

can be exposed to the browser.

Therefore never put:

```text
DATABASE_URL
SESSION_SECRET
GOOGLE_CLIENT_SECRET
GITHUB_CLIENT_SECRET
```

in the frontend environment.

---

# 25. Start Frontend

Run:

```bash
npm run dev
```

Expected:

```text
Local: http://localhost:3000
```

Open:

```text
http://localhost:3000
```

---

# 26. Complete Local Startup

Once everything has been configured, you need three terminals.

## Terminal 1 — PostgreSQL

```bash
cd VeritasAI_callus_type2-main
docker compose up -d postgres
```

## Terminal 2 — Backend

```bash
cd VeritasAI_callus_type2-main/backend
source .venv/bin/activate
alembic upgrade head
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

## Terminal 3 — Frontend

```bash
cd VeritasAI_callus_type2-main/frontend
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

# 27. Complete Application Flow

When a user signs in:

```text
Browser
   │
   ▼
Next.js LoginPage
   │
   ├── Email/password
   │
   ├── Google
   │
   └── GitHub
   │
   ▼
FastAPI Authentication
   │
   ▼
Signed Session
   │
   ▼
PostgreSQL User
```

When the user analyzes an essay:

```text
EssayInputView
      │
      ▼
analysisService.ts
      │
      ▼
POST /api/analyze
      │
      ▼
FastAPI
      │
      ▼
analyze_essay()
      │
      ├── Text normalization
      ├── Sentence extraction
      ├── Perplexity
      ├── Burstiness
      ├── Lexical features
      ├── Tropes
      ├── Evidence
      └── Scoring
      │
      ▼
AnalysisResult
      │
      ├── Anonymous → return JSON
      │
      └── Authenticated
             │
             ▼
          PostgreSQL
             │
             ▼
       Return AnalysisResult
```

---

# 28. Saved Essay History

Authenticated users can access:

```text
My Essays
```

The frontend calls:

```http
GET /api/essays
```

Selecting an essay calls:

```http
GET /api/essays/{id}
```

Deleting an essay calls:

```http
DELETE /api/essays/{id}
```

The database cascade removes associated analyses and sentence analyses.

---

# 29. Run Backend Tests

From:

```text
backend/
```

activate the environment:

```bash
source .venv/bin/activate
```

Run:

```bash
python test_pipeline.py
python test_text.py
python test_bytes.py
python test_mutation.py
```

Syntax checks:

```bash
python -m py_compile app/analysis/pipeline.py
python -m py_compile app/analysis/text.py
```

---

# 30. Build Frontend for Production

From:

```text
frontend/
```

run:

```bash
npm run build
```

If successful:

```bash
npm run start
```

The production frontend will normally be available at:

```text
http://localhost:3000
```

---

# 31. Useful Commands

## PostgreSQL

Start:

```bash
docker compose up -d postgres
```

Stop:

```bash
docker compose stop postgres
```

Restart:

```bash
docker compose restart postgres
```

Logs:

```bash
docker logs veritasai-postgres
```

Status:

```bash
docker compose ps
```

---

## Backend

Start:

```bash
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Migrations:

```bash
alembic upgrade head
```

Migration status:

```bash
alembic current
```

---

## Frontend

Install:

```bash
npm install
```

Development:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Production server:

```bash
npm run start
```

---

# 32. Troubleshooting

## Problem: `source venv/bin/activate` fails

The project uses:

```text
.venv
```

Correct:

```bash
source .venv/bin/activate
```

Incorrect:

```bash
source venv/bin/activate
```

---

## Problem: Python alias points to system Python

Check:

```bash
which python
```

If necessary:

```bash
unalias python
hash -r
```

Then:

```bash
source .venv/bin/activate
```

---

## Problem: `No module named torch`

Run:

```bash
which python
python -m pip show torch
```

If the package is missing:

```bash
python -m pip install -r requirements.txt
```

---

## Problem: PostgreSQL refused connection

Check:

```bash
docker compose ps
```

Start it:

```bash
docker compose up -d postgres
```

---

## Problem: `alembic upgrade head` fails

Confirm PostgreSQL is running.

Then verify:

```bash
cat backend/.env
```

and ensure:

```env
DATABASE_URL=postgresql+psycopg://veritasai:veritasai@localhost:5432/veritasai
```

Then:

```bash
cd backend
alembic upgrade head
```

---

## Problem: frontend gives CORS errors

Check:

```env
FRONTEND_URL=http://localhost:3000
```

in backend `.env`.

Also check:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

in frontend `.env.local`.

Restart both services after editing environment variables.

---

## Problem: Login works but history does not

History requires:

```text
Authenticated session
+
PostgreSQL
+
Current migrations
```

Check:

```bash
docker compose ps
```

Then:

```bash
cd backend
alembic upgrade head
```

---

## Problem: Google/GitHub login fails

Check that the callback URL exactly matches.

Google:

```text
http://localhost:8000/api/auth/google/callback
```

GitHub:

```text
http://localhost:8000/api/auth/github/callback
```

Also confirm credentials exist in backend `.env`.

Restart FastAPI.

---

## Problem: Port 8000 is busy

macOS/Linux:

```bash
lsof -nP -iTCP:8000 -sTCP:LISTEN
```

Then:

```bash
kill -9 <PID>
```

Windows:

```powershell
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

---

## Problem: Port 3000 is busy

macOS/Linux:

```bash
lsof -nP -iTCP:3000 -sTCP:LISTEN
```

Or:

```bash
npm run dev -- -p 3001
```

If you use another frontend port, update backend CORS/`FRONTEND_URL` accordingly.

---

# 33. Clean Database Reset

Only do this when you are comfortable deleting all local PostgreSQL data.

From repository root:

```bash
docker compose down -v
```

Start PostgreSQL again:

```bash
docker compose up -d postgres
```

Then:

```bash
cd backend
source .venv/bin/activate
alembic upgrade head
```

This recreates the local database from migrations.

---

# 34. Clean Frontend Reinstall

If the Node installation becomes corrupted:

```bash
cd frontend
rm -rf node_modules
rm -rf .next
npm install
npm run dev
```

Do not delete `package-lock.json` unless you intentionally want to regenerate dependency resolution.

---

# 35. Clean Backend Reinstall

If the Python environment becomes corrupted:

```bash
cd backend
rm -rf .venv
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
alembic upgrade head
```

---

# 36. Final Verification Checklist

Before considering the local installation complete:

- [ ] Python 3.11 is installed.
- [ ] Node.js and npm are installed.
- [ ] Docker is running.
- [ ] PostgreSQL container is running.
- [ ] Backend `.venv` exists.
- [ ] Backend `.venv` is activated.
- [ ] Backend requirements are installed.
- [ ] Backend `.env` exists.
- [ ] `SESSION_SECRET` is configured.
- [ ] Database migrations are applied.
- [ ] FastAPI starts on port 8000.
- [ ] `/health` returns `status: ok`.
- [ ] `/docs` loads.
- [ ] `/api/analyze` works.
- [ ] Frontend dependencies are installed.
- [ ] `frontend/.env.local` exists.
- [ ] Next.js starts on port 3000.
- [ ] Login/register works.
- [ ] Essay analysis works.
- [ ] Saved essay history works.
- [ ] Essay deletion works.
- [ ] Frontend production build succeeds.

---

# 37. Fastest Start After First Installation

Once everything has already been installed and configured:

### Terminal 1

```bash
cd VeritasAI_callus_type2-main
docker compose up -d postgres
```

### Terminal 2

```bash
cd VeritasAI_callus_type2-main/backend
source .venv/bin/activate
alembic upgrade head
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Terminal 3

```bash
cd VeritasAI_callus_type2-main/frontend
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 38. Production Warning

The commands in this document are for local development.

Before production deployment, you must change at minimum:

```text
Database credentials
Session secret
HTTPS configuration
CORS origins
OAuth callback URLs
Frontend API URL
PostgreSQL exposure
Logging
Rate limiting
Secret management
```

Do not expose the development PostgreSQL credentials publicly.

Do not commit `.env`.

Do not expose OAuth client secrets to the frontend.

Do not treat the detector's statistical score as proof of authorship.

---

# 39. Related Documentation

Project documentation includes:

```text
readme.md
START_HERE.md
AUTH_SETUP.md
DATABASE_SETUP.md
TEAM_GIT.md
architecture.md
file_structure.md
```

For the high-level project explanation and architecture:

```text
readme.md
```

For database and OAuth configuration:

```text
DATABASE_SETUP.md
AUTH_SETUP.md
```

For the practical local setup:

```text
installation.md
```
