# VeritasAI — START HERE

Welcome to VeritasAI.

This file is the fastest way for a new developer, teammate, evaluator, or reviewer to understand the repository and get it running.

---

## 1. What is VeritasAI?

VeritasAI is a full-stack statistical writing-analysis platform.

It analyzes essay text using signals including:

- Language-model perplexity
- Sentence rhythm / burstiness
- Lexical statistics
- Formulaic phrase detection
- Repetition / n-gram statistics
- Sentence-level scoring
- Document-level review priority

It also provides:

- Email/password authentication
- Google OAuth
- GitHub OAuth
- PostgreSQL persistence
- Saved essay history
- Next.js dashboard
- FastAPI REST API

**Important:** VeritasAI produces statistical evidence for review. A score is not proof that a text was written by AI.

---

# 2. Repository at a Glance

```text
VeritasAI/
├── backend/                 # FastAPI + analysis engine + database
├── frontend/                # Next.js application
├── docker-compose.yml       # Local PostgreSQL
│
├── README.md                # Complete project documentation
├── START_HERE.md            # This file
├── AUTH_SETUP.md            # Authentication setup
├── DATABASE_SETUP.md        # PostgreSQL + migrations
├── TEAM_GIT.md              # Git/team workflow
├── architecture.md          # Technical architecture
└── file_structure.md        # Repository/file reference
```

---

# 3. Read the Documentation in This Order

For a new developer:

```text
1. START_HERE.md
2. README.md
3. installation.md
4. architecture.md
5. file_structure.md
6. DATABASE_SETUP.md
7. AUTH_SETUP.md
8. TEAM_GIT.md
```

---

# 4. Prerequisites

Install:

```text
Git
Python 3.11
Node.js + npm
Docker Desktop
```

Verify:

```bash
git --version
python3.11 --version
node --version
npm --version
docker --version
docker compose version
```

---

# 5. First-Time Installation

From the repository root:

```bash
docker compose up -d postgres
```

Backend:

```bash
cd backend

python3.11 -m venv .venv
source .venv/bin/activate

python -m pip install --upgrade pip
python -m pip install -r requirements.txt

cp .env.example .env

alembic upgrade head

python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Open another terminal:

```bash
cd frontend

npm install

printf "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000\n" > .env.local

npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 6. Daily Startup

After first-time installation:

### Terminal 1

```bash
docker compose up -d postgres
```

### Terminal 2

```bash
cd backend
source .venv/bin/activate
alembic upgrade head
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Terminal 3

```bash
cd frontend
npm run dev
```

---

# 7. Verify the Backend

Health:

```text
http://127.0.0.1:8000/health
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

Expected health response:

```json
{
  "status": "ok",
  "service": "veritasai"
}
```

---

# 8. Understand the Main Data Flow

```text
User
 │
 ▼
Next.js UI
 │
 ▼
analysisService.ts
 │
 │ POST /api/analyze
 ▼
FastAPI
 │
 ▼
Analysis Pipeline
 │
 ├── Normalize text
 ├── Extract sentences
 ├── Perplexity
 ├── Burstiness
 ├── Lexical features
 ├── Formulaic phrases
 ├── Repetition
 ├── Scoring
 └── Evidence
 │
 ▼
AnalysisResult
 │
 ├── Anonymous → JSON response
 │
 └── Authenticated → PostgreSQL
```

---

# 9. Main Backend Entry Point

```text
backend/app/main.py
```

This creates the FastAPI application.

The important backend layers are:

```text
app/
├── analysis/
├── api/
├── auth/
├── core/
└── db/
```

---

# 10. Main Frontend Entry Point

```text
frontend/app/page.tsx
```

The frontend communicates with the backend through the service layer:

```text
frontend/lib/
├── analysisService.ts
├── authService.ts
├── essayService.ts
└── types.ts
```

---

# 11. Main API

Analyze:

```http
POST /api/analyze
```

Authentication:

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

OAuth:

```http
GET /api/auth/google
GET /api/auth/google/callback
GET /api/auth/github
GET /api/auth/github/callback
```

Essays:

```http
GET    /api/essays
GET    /api/essays/{id}
DELETE /api/essays/{id}
```

---

# 12. Where to Modify the Detector

If you want to modify analysis behavior, start here:

```text
backend/app/analysis/pipeline.py
backend/app/analysis/scoring.py
backend/app/analysis/perplexity.py
backend/app/analysis/burstiness.py
backend/app/analysis/features.py
backend/app/analysis/tropes.py
backend/app/analysis/evidence.py
backend/app/analysis/text.py
```

---

# 13. Where to Modify the UI

Main components:

```text
frontend/components/
```

Important files:

```text
EssayInputView.tsx
AnalysisResultsView.tsx
LoginPage.tsx
Navbar.tsx
MethodologyView.tsx
LimitationsView.tsx
EvaluationView.tsx
DatasetView.tsx
```

---

# 14. Where to Modify the Database

Database models:

```text
backend/app/db/models.py
```

Database session:

```text
backend/app/db/session.py
```

Migrations:

```text
backend/alembic/versions/
```

After changing models:

```bash
alembic revision --autogenerate -m "describe change"
alembic upgrade head
```

---

# 15. Where to Configure Authentication

```text
backend/app/auth/routes.py
backend/app/auth/service.py
backend/app/core/config.py
backend/.env
```

Detailed setup:

```text
AUTH_SETUP.md
```

---

# 16. Where to Configure PostgreSQL

```text
docker-compose.yml
backend/.env
backend/alembic.ini
backend/app/db/
```

Detailed setup:

```text
DATABASE_SETUP.md
```

---

# 17. Testing

Backend:

```bash
cd backend
source .venv/bin/activate

python test_pipeline.py
python test_text.py
python test_bytes.py
python test_mutation.py
```

Frontend production build:

```bash
cd frontend
npm run build
```

---

# 18. Git Workflow

Before coding:

```bash
git pull --rebase origin main
```

Create a branch:

```bash
git checkout -b feature/your-feature
```

After coding:

```bash
git status
git add .
git commit -m "feat: describe change"
git push -u origin feature/your-feature
```

See:

```text
TEAM_GIT.md
```

---

# 19. If Something Breaks

Check in this order:

```text
1. Is PostgreSQL running?
2. Is backend .venv activated?
3. Is backend .env configured?
4. Did alembic upgrade head succeed?
5. Does /health work?
6. Does /docs load?
7. Is frontend .env.local correct?
8. Is Next.js running?
9. Is the browser calling port 8000?
10. Check backend terminal logs.
```

---

# 20. Most Important Warning

Do not make unsupported claims about detector accuracy.

The current system is a statistical diagnostic tool.

Before claiming production-grade detection performance, evaluate it against a representative benchmark and report:

```text
Precision
Recall
F1
False-positive rate
False-negative rate
Threshold calibration
```

---

# 21. Next Steps

After the application runs:

1. Create a local account.
2. Analyze a sample essay.
3. Inspect sentence-level evidence.
4. Open the methodology page.
5. Open the limitations page.
6. Test saved history.
7. Test deletion.
8. Run backend tests.
9. Build the frontend.
10. Read the architecture documentation.
