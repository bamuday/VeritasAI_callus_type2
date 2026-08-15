# VeritasAI

**Statistical Admissions Essay Diagnostics**

VeritasAI is a full-stack admissions-essay analysis platform that examines writing characteristics using statistical and language-model-based signals. It is designed as a **review-support system**, not as a definitive AI-authorship detector.

> **Important:** A high statistical signal does not prove that text was written by AI. Human writing can naturally exhibit predictable, formulaic, repetitive, or statistically smooth patterns. VeritasAI should be used to identify passages for further review.

## Features

- Local language-model perplexity analysis
- Sentence-rhythm / burstiness analysis
- Lexical statistics (TTR, vocabulary diversity, repetition)
- Formulaic phrase / trope detection
- Weighted sentence-level scoring
- Document-level review priority
- Sentence-level evidence and explanations
- Optional PostgreSQL persistence
- Email/password authentication
- Google OAuth
- GitHub OAuth
- Saved essay history
- Next.js dashboard and visual diagnostics

## Table of Contents

- [Project Overview](#project-overview)
- [System Architecture](#system-architecture)
- [Analysis Pipeline](#analysis-pipeline)
- [Scoring Framework](#scoring-framework)
- [Technology Stack](#technology-stack)
- [Repository Architecture](#repository-architecture)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Detector Evaluation](#detector-evaluation)
- [Security Notes](#security-notes)
- [Limitations and Responsible Use](#limitations-and-responsible-use)
- [Production Checklist](#production-checklist)
- [Future Improvements](#future-improvements)
- [License](#license)

## Project Overview

VeritasAI is built as a two-part application:

```
┌─────────────────────────────────────────────────────────────────┐
│                         VERITASAI                                │
│                                                                    │
│   Next.js Frontend  ─────── HTTP / JSON ─────── FastAPI Backend  │
│          │                                           │            │
│          │                                           ├─ Analysis │
│          │                                           ├─ Auth     │
│          │                                           └─ DB       │
│          │                                                 │      │
│          └────────────────────────────────────────────── PostgreSQL
└─────────────────────────────────────────────────────────────────┘
```

The **frontend** provides the user interface, authentication screens, essay input, analysis dashboard, evidence views, methodology/limitations pages, evaluation tools, and saved essay history.

The **backend** owns the analysis pipeline, authentication/session handling, database persistence, API contracts, and model execution.

## System Architecture

```
                              USER
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Next.js Frontend  │
                    │                     │
                    │ Login / Register    │
                    │ Essay Input         │
                    │ Analysis Dashboard  │
                    │ Evidence            │
                    │ Metrics             │
                    │ History             │
                    └──────────┬──────────┘
                               │
                         HTTP / JSON
                               │
                               ▼
                    ┌─────────────────────┐
                    │     FastAPI API     │
                    │                     │
                    │ /api/analyze        │
                    │ /api/auth/*         │
                    │ /api/essays/*       │
                    │ /health             │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼──────────────────┐
             │                 │                  │
             ▼                 ▼                  ▼
      ┌──────────────┐  ┌──────────────┐  ┌───────────────┐
      │ Auth Layer   │  │ Analysis     │  │ Persistence   │
      │              │  │ Pipeline     │  │               │
      │ Credentials  │  │              │  │ SQLAlchemy    │
      │ Google OAuth │  │ Text         │  │ PostgreSQL    │
      │ GitHub OAuth │  │ Perplexity   │  │ Alembic       │
      └──────┬───────┘  │ Features     │  └───────┬───────┘
             │          │ Burstiness   │          │
             │          │ Tropes       │          │
             │          │ Evidence     │          │
             │          │ Scoring      │          │
             │          └──────┬───────┘          │
             │                 │                  │
             └─────────────────┼──────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ AnalysisResult JSON │
                    └─────────────────────┘
```

## Analysis Pipeline

The detector pipeline is centered around `backend/app/analysis/pipeline.py`:

```
Raw Essay
   │
   ▼
Input Validation
   │
   ▼
Text Normalization
   │
   ▼
Sentence Extraction
   │
   ▼
Document Statistics
   │
   ├───────────────┬────────────────┬────────────────┐
   ▼               ▼                ▼                ▼
Perplexity     Burstiness       Lexical          Tropes
   │               │                │                │
   └───────────────┴────────────────┴────────────────┘
                           │
                           ▼
                    Signal Generation
                           │
                           ▼
                    Weighted Scoring
                           │
                           ▼
                    Flag Classification
                           │
                           ▼
                  Evidence / Explanation
                           │
                           ▼
                 Document Aggregation
                           │
                           ▼
                    AnalysisResult
```

### Pipeline steps

1. **Input validation** — Empty input is rejected. A minimum of approximately 20 words is required for document analysis; very short passages are treated as weak evidence.
2. **Text normalization** — Handles CRLF/CR line endings, non-breaking spaces, whitespace, repeated blank lines, sentence extraction, tokenization, and paragraph indexing. Sentence text is extracted from character spans of the normalized source rather than reconstructed by joining tokens, which preserves spacing and punctuation.
3. **Sentence extraction** — Boundaries are detected using `.`, `!`, `?` followed by whitespace or end of document.
4. **Feature extraction** — Each sentence receives perplexity, sentence rhythm, formulaic phrase score, vocabulary diversity, repeated-word ratio, and repeated n-gram ratio measurements.
5. **Signal normalization** — Raw features are converted into bounded diagnostic signals in the range `0.0`–`1.0`.
6. **Weighted score** — Signals are combined using the weights below and constrained to `0.0`–`1.0`. Short passages are additionally down-weighted.

## Scoring Framework

### Signal weights (provisional engineering defaults)

| Signal | Weight |
|---|---|
| Perplexity / smoothness | 52% |
| Sentence rhythm | 18% |
| Formulaic tropes | 14% |
| Lexical statistics | 9% |
| Repeated n-grams | 7% |

### Flag thresholds

| Score | Flag |
|---|---|
| < 0.37 | none |
| 0.37 – < 0.58 | yellow |
| 0.58 – < 0.78 | orange |
| >= 0.78 | red |

Flags represent **increasing levels of statistical signal**, not a human/AI verdict:

- `none` → no material statistical signal
- `yellow` → minor signal; review evidence
- `orange` → multiple aligned signals; further review recommended
- `red` → strong statistical signal; human review strongly recommended

### Document-level review priority

Sentence flags are aggregated into a document-level priority: `LOW`, `MODERATE`, or `HIGH_ATTENTION`. This is a **triage mechanism**, not an authorship verdict.

## Authentication Architecture

VeritasAI supports three authentication paths — email/password, Google OAuth, and GitHub OAuth — all resolving to a signed FastAPI/Starlette session backed by a PostgreSQL user record.

- Passwords are hashed with **Argon2**; plain-text passwords are never stored.
- OAuth is implemented with **Authlib** for both Google (OpenID Connect) and GitHub.
- Session state is configured via `SESSION_SECRET` and `SESSION_HTTPS_ONLY`.

Relevant files: `backend/app/auth/routes.py`, `backend/app/auth/service.py`

## Persistence Architecture

```
User
 │
 ├── AuthAccount
 │
 └── Essay
       │
       └── Analysis
             │
             └── SentenceAnalysis
```

The detector remains usable anonymously. When an authenticated user runs an analysis, the backend additionally persists the essay, analysis snapshot, sentence-level analyses, signals, detector version, review flag, and explanation.

## Technology Stack

### Backend

| Technology | Purpose |
|---|---|
| Python 3.11 | Runtime |
| FastAPI | REST API |
| Uvicorn | ASGI server |
| Pydantic | Validation and API schemas |
| SQLAlchemy | ORM |
| Psycopg | PostgreSQL driver |
| Alembic | Database migrations |
| Authlib | OAuth |
| Argon2-CFFI | Password hashing |
| HTTPX | HTTP/OAuth support |
| PyTorch | Model execution |
| Transformers | Hugging Face model support |
| Tokenizers | Text tokenization |

### Frontend

| Technology | Purpose |
|---|---|
| Next.js 14 | React framework |
| React 18 | UI |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Framer Motion | Animation |
| Lucide React | Icons |

### Database / Infrastructure

| Technology | Purpose |
|---|---|
| PostgreSQL 16 | Persistence |
| Docker Compose | Development infrastructure |

## Repository Architecture

```
VeritasAI/
│
├── backend/       ← API + detector + auth + database
├── frontend/      ← Next.js application
│
├── docker-compose.yml
│
└── documentation
```

<details>
<summary>Complete file architecture</summary>

```
VeritasAI_callus_type2-main/
│
├── .gitattributes
├── .gitignore
│
├── README.md
├── installation.md
├── START_HERE.md
├── AUTH_SETUP.md
├── DATABASE_SETUP.md
├── TEAM_GIT.md
├── architecture.md
├── file_structure.md
├── project_structure.md
│
├── docker-compose.yml
│
├── backend/
│   ├── .env.example
│   ├── alembic.ini
│   ├── requirements.txt
│   ├── request.json
│   ├── response.json
│   │
│   ├── alembic/
│   │   ├── env.py
│   │   ├── script.py.mako
│   │   └── versions/
│   │       ├── .gitkeep
│   │       ├── 0001_initial.py
│   │       └── 0002_credentials.py
│   │
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── models.py
│   │   │
│   │   ├── analysis/
│   │   │   ├── __init__.py
│   │   │   ├── burstiness.py
│   │   │   ├── evidence.py
│   │   │   ├── features.py
│   │   │   ├── perplexity.py
│   │   │   ├── pipeline.py
│   │   │   ├── scoring.py
│   │   │   ├── text.py
│   │   │   └── tropes.py
│   │   │
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── dependencies.py
│   │   │   └── routes.py
│   │   │
│   │   ├── auth/
│   │   │   ├── __init__.py
│   │   │   ├── routes.py
│   │   │   └── service.py
│   │   │
│   │   ├── core/
│   │   │   └── config.py
│   │   │
│   │   └── db/
│   │       ├── __init__.py
│   │       ├── base.py
│   │       ├── models.py
│   │       └── session.py
│   │
│   ├── test_bytes.py
│   ├── test_mutation.py
│   ├── test_pipeline.py
│   └── test_text.py
│
└── frontend/
    ├── .env.example
    ├── package.json
    ├── package-lock.json
    ├── next-env.d.ts
    ├── postcss.config.js
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── README.md
    │
    ├── app/
    │   ├── page.tsx
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── dataset/
    │   │   └── page.tsx
    │   ├── evaluation/
    │   │   └── page.tsx
    │   ├── limitations/
    │   │   └── page.tsx
    │   ├── methodology/
    │   │   └── page.tsx
    │   └── logout/
    │       └── logout_page.tsx
    │
    ├── components/
    │   ├── AnalysisResultsView.tsx
    │   ├── AppShell.tsx
    │   ├── DatasetView.tsx
    │   ├── EssayInputView.tsx
    │   ├── EvaluationView.tsx
    │   ├── Footer.tsx
    │   ├── INSTALL_AND_REPLACE.md
    │   ├── LimitationsView.tsx
    │   ├── LoadingStateView.tsx
    │   ├── LoginPage.tsx
    │   ├── MethodologyView.tsx
    │   ├── Navbar.tsx
    │   └── ThemeToggle.tsx
    │
    └── lib/
        ├── analysisService.ts
        ├── analyzer.ts
        ├── authService.ts
        ├── essayService.ts
        ├── mockData.ts
        ├── samples.ts
        └── types.ts
```

</details>

## Database Schema

```
users (1:N) → auth_accounts
users (1:N) → essays (1:N) → analyses (1:N) → sentence_analyses
```

- **users**: id, name, email (unique), password_hash, avatar_url, created_at, updated_at
- **auth_accounts**: id, user_id (FK), provider, provider_account_id, created_at
- **essays**: id, user_id (FK), title, content, word_count, created_at, updated_at
- **analyses**: id, essay_id (FK), detector_version, overall_score, flag_level, explanation, result_json, created_at
- **sentence_analyses**: id, analysis_id (FK), sentence_index, paragraph_index, text, flag_level, signal_score, passage_category, explanation, signals_json, created_at

Cascade deletion is configured so deleting an essay removes its related analyses and sentence analyses.

## API Reference

### Health

```
GET /health
```

```json
{ "status": "ok", "service": "veritasai" }
```

### Analyze essay

```
POST /api/analyze
Content-Type: application/json
```

Request:

```json
{
  "essay": "Your essay text goes here.",
  "model_id": "custom"
}
```

Response includes: `id`, `title`, `processedAt`, `rawText`, `wordCount`, `sentenceCount`, `readingTimeMinutes`, `analysisComplexity`, `reviewPriority`, `distribution`, `sentences`, `summaryMessage`.

Each sentence includes: `id`, `index`, `paragraphIndex`, `text`, `flagLevel`, `signalScore`, `passageCategory`, `signals`, `summaryExplanation`.

### Authentication

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
GET  /api/auth/google
GET  /api/auth/google/callback
GET  /api/auth/github
GET  /api/auth/github/callback
```

Register request:

```json
{
  "name": "Example User",
  "email": "user@example.com",
  "password": "minimum-8-characters"
}
```

Login request:

```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

### Essays

```
GET    /api/essays
GET    /api/essays/{essay_id}
DELETE /api/essays/{essay_id}
```

All essay endpoints require authentication and ownership.

## Environment Variables

### Backend

```bash
cd backend
cp .env.example .env
```

```ini
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

### Frontend

Create `frontend/.env.local`:

```ini
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Installation

For the complete installation sequence, see [`installation.md`](installation.md).

Requirements:

- Python 3.11
- Node.js
- npm
- Docker Desktop
- Git

PostgreSQL can be run through the included Docker Compose configuration.

## Running the Project

The recommended local setup runs three processes: PostgreSQL, the FastAPI backend, and the Next.js frontend.

### Quick start

```bash
# 1. Clone/open the repository
cd VeritasAI_callus_type2-main

# 2. Start PostgreSQL
docker compose up -d postgres

# 3. Backend
cd backend
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# 4. In another terminal: frontend
cd frontend
npm install
printf "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000\n" > .env.local
npm run dev
```

Open the app:

- Frontend: http://localhost:3000
- API: http://127.0.0.1:8000
- Swagger: http://127.0.0.1:8000/docs
- Health: http://127.0.0.1:8000/health

## Testing

```bash
cd backend
source .venv/bin/activate

# Python syntax
python -m py_compile app/analysis/pipeline.py
python -m py_compile app/analysis/text.py

# Pipeline / text / byte / mutation tests
python test_pipeline.py
python test_text.py
python test_bytes.py
python test_mutation.py
```

API health check (with FastAPI running):

```bash
curl http://127.0.0.1:8000/health
```

API analysis check:

```bash
curl -s -X POST http://127.0.0.1:8000/api/analyze \
  -H "Content-Type: application/json" \
  --data-binary @request.json
```

## Development Workflow

1. Pull latest code
2. Activate backend virtual environment
3. Start PostgreSQL
4. Apply migrations
5. Run backend tests
6. Start FastAPI
7. Check `/health`
8. Test `/api/analyze`
9. Start frontend
10. Test login/register
11. Test essay analysis
12. Test saved history
13. Test deletion
14. Test production build

Frontend production build:

```bash
cd frontend
npm run build
npm run start
```

## Troubleshooting

**`ModuleNotFoundError: No module named 'torch'`** — Verify the active interpreter points into `backend/.venv/`, then reinstall with `python -m pip install -r requirements.txt`.

**`python` points to the wrong interpreter** — Check with `which python` / `which python3`; remove conflicting aliases (`unalias python; hash -r`) and reactivate the venv.

**PostgreSQL connection error** — Confirm the container is running with `docker compose ps`; start it with `docker compose up -d postgres`; inspect logs with `docker logs veritasai-postgres`. Default local credentials: db `veritasai`, user `veritasai`, password `veritasai`, host `localhost`, port `5432`.

**Migration error** — Run `alembic current` / `alembic upgrade head`. For a full local reset (⚠️ destroys local data): `docker compose down -v && docker compose up -d postgres && alembic upgrade head`.

**Port 8000 / 3000 already in use** — Find and kill the process (`lsof -nP -iTCP:8000 -sTCP:LISTEN` then `kill -9 <PID>` on macOS/Linux, or `netstat -ano | findstr :8000` then `taskkill /PID <PID> /F` on Windows), or run the frontend on another port with `npm run dev -- -p 3001` (update `FRONTEND_URL`/CORS accordingly).

**OAuth does not work** — Verify backend `.env` has provider credentials, FastAPI was restarted after editing `.env`, the callback URL exactly matches the provider configuration, and `FRONTEND_URL` is correct.

**Frontend cannot reach backend** — Check `NEXT_PUBLIC_API_BASE_URL` in `frontend/.env.local`, then restart Next.js.

**CORS error** — Development origins `http://localhost:3000` and `http://127.0.0.1:3000` are allowed by default; configure the actual frontend origin for production.

**Transformers warning on startup** — A model-loss configuration warning can appear during model initialization; if the API still runs and analysis completes, this is generally benign, but should be cleaned up before production.

## Detector Evaluation

Functional correctness does not establish detector accuracy. A proper evaluation should include at least:

- **Dataset A — Human**: genuinely human-written essays
- **Dataset B — AI-generated**: freshly generated AI essays without manual rewriting
- **Dataset C — Mixed**: human and AI passages combined
- **Dataset D — Edited AI**: AI-generated text that has been manually modified

Measure precision, recall, F1 score, false-positive rate, false-negative rate, score distribution, threshold stability, and sentence-/document-level performance. Thresholds should be calibrated against representative evaluation data rather than tuned against one or two examples.

## Security Notes

- **Secrets** — Never commit `backend/.env`, `frontend/.env.local`, OAuth client secrets, or production database/session secrets. `.env.example` files exist specifically so secrets can remain local.
- **Passwords** — Hashed with Argon2; never replace with plain-text storage.
- **OAuth secrets** — Google/GitHub client secrets belong only on the backend and must never be exposed through `NEXT_PUBLIC_*` variables.
- **Sessions** — Use a strong random `SESSION_SECRET`; enable `SESSION_HTTPS_ONLY=true` in production.
- **Database** — Do not expose PostgreSQL directly to the public internet without a deliberate security architecture.

## Limitations and Responsible Use

VeritasAI is **not an authorship-proof system**. Statistical writing signals can occur in human writing, AI-assisted writing, edited AI writing, academic and technical writing, highly polished writing, non-native English writing, and formulaic professional writing.

Intended workflow:

```
Statistical signal → Human review → Context → Additional evidence → Decision
```

**Not** a valid interpretation:

```
High score → "AI" → Automatic rejection
```

### Key technical limitations

1. **Perplexity is model-dependent** — not a universal value; changing the model changes the score distribution.
2. **Short passages are unreliable** — not enough observations for strong statistical conclusions.
3. **Thresholds are provisional** — current weights/thresholds are engineering defaults requiring empirical validation.
4. **Human writing can look statistically predictable** — a high signal does not imply machine authorship.
5. **AI writing can be edited** — human editing can substantially change statistical properties.
6. **Domain differences matter** — academic, technical, creative, and professional writing have different distributions.

## Production Checklist

- [ ] Validate the detector against a representative benchmark
- [ ] Calibrate score thresholds
- [ ] Measure false positives and false negatives
- [ ] Add automated backend tests
- [ ] Add frontend integration tests
- [ ] Use a production PostgreSQL instance
- [ ] Rotate `SESSION_SECRET`
- [ ] Enable HTTPS-only sessions
- [ ] Configure production CORS
- [ ] Configure OAuth callback URLs for production
- [ ] Remove development credentials
- [ ] Add rate limiting if needed
- [ ] Configure structured logging
- [ ] Add monitoring
- [ ] Add backup/recovery for PostgreSQL
- [ ] Test large essays, malformed requests, empty/short input, concurrent requests
- [ ] Review data-retention requirements
- [ ] Add an explicit project license

## Future Improvements

**Detector** — larger benchmark datasets, ROC/PR analysis, threshold calibration, stylometric features, character-level statistics, sentence embeddings, dependency-pattern analysis, better multilingual support, reference-corpus comparison.

**Backend** — automated API test suite, CI/CD, structured logging, rate limiting, background model loading, model caching, batch analysis, performance profiling.

**Frontend** — rich sentence highlighting, interactive evidence graph, exportable reports, analysis comparison, revision history, evaluation dashboards, better mobile layout.

**Infrastructure** — production Docker image, reverse proxy, HTTPS, PostgreSQL backups, observability, health/readiness checks, horizontal scaling.

## Project Status

Detector accuracy still requires proper benchmark validation before any production claim about authorship-detection performance. See [Project Overview](#project-overview) for the current feature set.

## License

No license should be claimed unless the project owner explicitly chooses one. Add a real license file before publishing the repository as an open-source project.

## Disclaimer

VeritasAI provides statistical diagnostics about writing characteristics. It does not provide definitive authorship attribution and should not be represented as a system capable of proving that an essay was written by a human or generated by an AI system. Results should be interpreted as signals for further review, not definitive conclusions.
