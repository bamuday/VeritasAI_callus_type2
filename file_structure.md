# VeritasAI — File Structure Reference

This document explains the repository tree and the purpose of each important file.

---

# 1. Root

```text
VeritasAI_callus_type2-main/
├── .gitattributes
├── .gitignore
├── README.md
├── START_HERE.md
├── AUTH_SETUP.md
├── DATABASE_SETUP.md
├── TEAM_GIT.md
├── architecture.md
├── file_structure.md
├── installation.md
├── docker-compose.yml
├── backend/
└── frontend/
```

---

# 2. Backend

```text
backend/
├── .env.example
├── alembic.ini
├── requirements.txt
├── request.json
├── response.json
│
├── alembic/
│   ├── env.py
│   ├── script.py.mako
│   └── versions/
│       ├── .gitkeep
│       ├── 0001_initial.py
│       └── 0002_credentials.py
│
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── models.py
│   │
│   ├── analysis/
│   ├── api/
│   ├── auth/
│   ├── core/
│   └── db/
│
├── test_bytes.py
├── test_mutation.py
├── test_pipeline.py
└── test_text.py
```

---

# 3. Backend Root Files

## `.env.example`

Template for backend environment variables.

Contains configuration placeholders such as:

```text
Database
Model
Session
Frontend URL
OAuth
```

Never replace this with real secrets.

---

## `requirements.txt`

Python dependency list.

Includes the project's:

```text
FastAPI
Uvicorn
SQLAlchemy
Psycopg
Alembic
Authlib
Argon2
HTTPX
PyTorch
Transformers
```

---

## `alembic.ini`

Alembic configuration.

Used for:

```bash
alembic upgrade head
alembic revision
alembic downgrade
```

---

## `request.json`

Sample API request for manual testing.

---

## `response.json`

Sample/recorded API response for development/testing.

---

# 4. Backend App

```text
backend/app/
├── __init__.py
├── main.py
├── models.py
├── analysis/
├── api/
├── auth/
├── core/
└── db/
```

---

# 5. `main.py`

FastAPI application entry point.

Responsibilities:

```text
Create app
Configure middleware
Configure CORS
Configure sessions
Register routes
Expose health endpoint
```

Run:

```bash
python -m uvicorn app.main:app --reload
```

---

# 6. `models.py`

Pydantic request/response models.

Used to define API contracts.

---

# 7. Analysis Directory

```text
backend/app/analysis/
├── __init__.py
├── burstiness.py
├── evidence.py
├── features.py
├── perplexity.py
├── pipeline.py
├── scoring.py
├── text.py
└── tropes.py
```

---

## `text.py`

Text processing:

```text
Normalization
Sentence extraction
Word tokenization
Paragraph indexing
Character spans
```

---

## `features.py`

Lexical and repetition features.

Examples:

```text
Vocabulary diversity
TTR
Repeated words
Repeated n-grams
```

---

## `perplexity.py`

Language-model perplexity/smoothness calculations.

Uses:

```text
PyTorch
Transformers
```

Default model:

```text
distilgpt2
```

---

## `burstiness.py`

Sentence-length/rhythm analysis.

---

## `tropes.py`

Formulaic phrase detection.

---

## `evidence.py`

Converts signals into diagnostic evidence and explanations.

---

## `scoring.py`

Central scoring logic.

Contains:

```text
Signal normalization
Weighted scoring
Flag thresholds
Distribution
Review priority
```

---

## `pipeline.py`

Main analysis orchestrator.

It combines all analysis modules.

---

# 8. API Directory

```text
backend/app/api/
├── __init__.py
├── dependencies.py
└── routes.py
```

## `routes.py`

Main application endpoints.

Includes:

```text
/api/analyze
/api/essays
```

---

## `dependencies.py`

Reusable FastAPI dependencies.

Examples:

```text
Database session
Authenticated user
```

---

# 9. Auth Directory

```text
backend/app/auth/
├── __init__.py
├── routes.py
└── service.py
```

## `routes.py`

Authentication endpoints.

```text
register
login
logout
current user
Google OAuth
GitHub OAuth
```

## `service.py`

Authentication implementation:

```text
Password hashing
Password verification
OAuth
User creation/upsert
Session handling
```

---

# 10. Core Directory

```text
backend/app/core/
└── config.py
```

Central application configuration.

Reads environment variables.

---

# 11. Database Directory

```text
backend/app/db/
├── __init__.py
├── base.py
├── models.py
└── session.py
```

## `base.py`

SQLAlchemy declarative base.

## `models.py`

Database entities.

## `session.py`

Engine and session factory.

---

# 12. Alembic

```text
backend/alembic/
├── env.py
├── script.py.mako
└── versions/
```

Used for database schema evolution.

Current migration chain:

```text
0001_initial
      ↓
0002_credentials
```

---

# 13. Backend Tests

```text
test_pipeline.py
test_text.py
test_bytes.py
test_mutation.py
```

Purpose:

```text
Pipeline behavior
Text processing
Byte-level checks
Mutation/regression checks
```

---

# 14. Frontend

```text
frontend/
├── .env.example
├── package.json
├── package-lock.json
├── next-env.d.ts
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── README.md
├── app/
├── components/
└── lib/
```

---

# 15. Frontend Configuration

## `package.json`

Defines:

```text
Scripts
Dependencies
Project metadata
```

Important commands:

```bash
npm run dev
npm run build
npm run start
```

---

## `tailwind.config.ts`

Tailwind configuration.

---

## `postcss.config.js`

PostCSS configuration.

---

## `tsconfig.json`

TypeScript compiler configuration.

---

## `.env.example`

Frontend environment template.

---

# 16. Frontend App Directory

```text
frontend/app/
├── page.tsx
├── globals.css
├── layout.tsx
├── dataset/
├── evaluation/
├── limitations/
├── methodology/
└── logout/
```

---

## `page.tsx`

Main application page/controller.

Coordinates:

```text
Authentication
Essay input
Analysis
Results
History
Navigation
```

---

## `layout.tsx`

Root Next.js layout.

---

## `globals.css`

Global styles.

---

# 17. Frontend Pages

## `dataset/page.tsx`

Dataset page.

## `evaluation/page.tsx`

Evaluation page.

## `limitations/page.tsx`

Limitations page.

## `methodology/page.tsx`

Methodology page.

## `logout/logout_page.tsx`

Logout page component.

---

# 18. Components

```text
frontend/components/
├── AnalysisResultsView.tsx
├── AppShell.tsx
├── DatasetView.tsx
├── EssayInputView.tsx
├── EvaluationView.tsx
├── Footer.tsx
├── LimitationsView.tsx
├── LoadingStateView.tsx
├── LoginPage.tsx
├── MethodologyView.tsx
├── Navbar.tsx
└── ThemeToggle.tsx
```

---

## `EssayInputView.tsx`

Essay entry UI.

---

## `AnalysisResultsView.tsx`

Analysis results UI.

---

## `LoginPage.tsx`

Login/register UI.

---

## `AppShell.tsx`

Application shell/layout behavior.

---

## `Navbar.tsx`

Main navigation.

---

## `ThemeToggle.tsx`

Theme switch.

---

## `LoadingStateView.tsx`

Loading state while analysis is running.

---

## `EvaluationView.tsx`

Detector evaluation interface.

---

## `DatasetView.tsx`

Dataset interface.

---

## `MethodologyView.tsx`

Explains detector methodology.

---

## `LimitationsView.tsx`

Explains limitations and responsible use.

---

## `Footer.tsx`

Footer UI.

---

# 19. Frontend Library

```text
frontend/lib/
├── analysisService.ts
├── analyzer.ts
├── authService.ts
├── essayService.ts
├── mockData.ts
├── samples.ts
└── types.ts
```

---

## `analysisService.ts`

Backend analysis API client.

Calls:

```http
POST /api/analyze
```

---

## `authService.ts`

Authentication API client.

---

## `essayService.ts`

Saved essay API client.

---

## `types.ts`

TypeScript interfaces/types for API data.

---

## `analyzer.ts`

Frontend-side analysis/helper functionality.

---

## `mockData.ts`

Development/mock data.

---

## `samples.ts`

Sample essay content.

---

# 20. Root Docker Compose

```text
docker-compose.yml
```

Provides the local PostgreSQL development service.

Start:

```bash
docker compose up -d postgres
```

---

# 21. Where to Look for Common Changes

## Change detector score

```text
backend/app/analysis/scoring.py
```

## Change perplexity

```text
backend/app/analysis/perplexity.py
```

## Change sentence parsing

```text
backend/app/analysis/text.py
```

## Add a new detector signal

```text
backend/app/analysis/
```

Then integrate it in:

```text
pipeline.py
scoring.py
evidence.py
```

## Add API endpoint

```text
backend/app/api/routes.py
```

## Change authentication

```text
backend/app/auth/
```

## Change database schema

```text
backend/app/db/models.py
backend/alembic/versions/
```

## Change analysis dashboard

```text
frontend/components/AnalysisResultsView.tsx
```

## Change essay input

```text
frontend/components/EssayInputView.tsx
```

## Change login UI

```text
frontend/components/LoginPage.tsx
```

## Change API client

```text
frontend/lib/
```

---

# 22. Architecture Summary

```text
                 VERITASAI
                     │
       ┌─────────────┴─────────────┐
       │                           │
   FRONTEND                    BACKEND
       │                           │
   Next.js                     FastAPI
       │                           │
 Components                  API / Auth
       │                           │
 Service Layer              Analysis Pipeline
       │                           │
       │                  ┌────────┼────────┐
       │                  │        │        │
       │              Perplexity  Text   Scoring
       │                           │
       │                       Evidence
       │                           │
       └───────────────────────────┤
                                   ▼
                              PostgreSQL
```

---

# 23. Important Files for a New Developer

If you only have time to inspect ten files:

```text
README.md
START_HERE.md
backend/app/main.py
backend/app/analysis/pipeline.py
backend/app/analysis/scoring.py
backend/app/analysis/text.py
backend/app/api/routes.py
backend/app/auth/routes.py
frontend/app/page.tsx
frontend/components/AnalysisResultsView.tsx
```

