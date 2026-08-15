# VeritasAI — Technical Architecture

This document describes the internal architecture of VeritasAI.

---

# 1. High-Level Architecture

```text
                         ┌───────────────────┐
                         │       User        │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │ Next.js Frontend  │
                         │                   │
                         │ App Router        │
                         │ Components        │
                         │ Service Layer     │
                         └─────────┬─────────┘
                                   │
                              HTTP / JSON
                                   │
                                   ▼
                         ┌───────────────────┐
                         │ FastAPI Backend   │
                         │                   │
                         │ API               │
                         │ Auth              │
                         │ Analysis          │
                         │ Database           │
                         └──────┬─────┬──────┘
                                │     │
                     ┌──────────┘     └──────────┐
                     ▼                           ▼
             ┌──────────────┐             ┌──────────────┐
             │ PyTorch /    │             │ PostgreSQL   │
             │ Transformers │             │              │
             └──────────────┘             └──────────────┘
```

---

# 2. Architectural Layers

The application has five logical layers:

```text
Presentation
     ↓
API
     ↓
Application / Analysis
     ↓
Persistence
     ↓
Infrastructure
```

---

# 3. Presentation Layer

Technology:

```text
Next.js
React
TypeScript
Tailwind CSS
Framer Motion
```

Responsibilities:

- User input
- Authentication UI
- Results visualization
- Navigation
- Essay history
- Methodology
- Limitations
- Evaluation

The frontend should not contain secrets or database credentials.

---

# 4. API Layer

Main backend files:

```text
backend/app/main.py
backend/app/api/routes.py
backend/app/api/dependencies.py
backend/app/auth/routes.py
```

Responsibilities:

- HTTP routing
- Request validation
- Authentication boundaries
- Calling application logic
- Returning JSON responses
- Error handling

---

# 5. Analysis Layer

```text
backend/app/analysis/
```

Modules:

```text
text.py
features.py
perplexity.py
burstiness.py
tropes.py
evidence.py
scoring.py
pipeline.py
```

---

# 6. Analysis Pipeline

```text
Raw Text
   │
   ▼
Normalize
   │
   ▼
Extract Sentences
   │
   ▼
Extract Features
   │
   ├── Perplexity
   ├── Burstiness
   ├── Lexical
   ├── Repetition
   └── Tropes
   │
   ▼
Normalize Signals
   │
   ▼
Weighted Score
   │
   ▼
Flag Classification
   │
   ▼
Evidence
   │
   ▼
Document Aggregation
   │
   ▼
AnalysisResult
```

---

# 7. Text Processing

`text.py` is responsible for:

```text
Line-ending normalization
Whitespace normalization
Sentence extraction
Word tokenization
Paragraph indexing
Character spans
```

Sentence spans are important because the UI needs to display evidence corresponding to the original text.

---

# 8. Perplexity

`perplexity.py` uses a local Hugging Face language model.

Default:

```text
distilgpt2
```

Configuration:

```env
MODEL_NAME=distilgpt2
MAX_MODEL_TOKENS=512
```

The model produces token-level loss/perplexity information.

Important:

```text
Perplexity depends on the model.
```

It is not a universal authorship measurement.

---

# 9. Burstiness

Burstiness measures sentence-length variation.

Conceptually:

```text
Sentence lengths
      ↓
Distribution
      ↓
Variation
      ↓
Rhythm signal
```

Very uniform sentence structure can increase one type of statistical signal.

---

# 10. Lexical Features

The feature layer can measure:

```text
Vocabulary diversity
Type-token ratio
Repeated content words
Repeated n-grams
```

These are supplementary signals.

---

# 11. Formulaic Phrase Detection

`tropes.py` detects configured phrases/patterns that may be considered formulaic.

This is an explainability feature rather than definitive evidence.

---

# 12. Scoring

Current engineering weights:

```text
Perplexity / smoothness   52%
Sentence rhythm           18%
Formulaic tropes          14%
Lexical statistics         9%
Repeated n-grams           7%
```

The weighted score is bounded approximately between:

```text
0.0 and 1.0
```

These weights require empirical validation before being described as calibrated probabilities.

---

# 13. Flag Classification

Current levels:

```text
none
yellow
orange
red
```

Approximate thresholds:

```text
< 0.37       none
0.37–<0.58   yellow
0.58–<0.78   orange
>= 0.78      red
```

Interpretation:

```text
none   → little statistical signal
yellow → minor signal
orange → multiple aligned signals
red    → strong statistical signal
```

Not:

```text
red = definitely AI
```

---

# 14. Evidence Architecture

The evidence layer converts numerical signals into human-readable explanations.

Example:

```text
Raw feature
   ↓
Normalized signal
   ↓
Signal category
   ↓
Explanation
```

This is what allows the frontend to show why a sentence was flagged.

---

# 15. Document Aggregation

Sentence-level results are aggregated into document-level information.

Example:

```text
Sentence results
      │
      ├── none
      ├── yellow
      ├── orange
      └── red
      │
      ▼
Distribution
      │
      ▼
Review priority
```

Possible review priority:

```text
LOW
MODERATE
HIGH_ATTENTION
```

---

# 16. Authentication Architecture

```text
                    ┌──────────────┐
                    │ Login UI     │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
         Password        Google       GitHub
              │            │            │
              └────────────┼────────────┘
                           ▼
                     Auth Service
                           │
                           ▼
                         User
                           │
                           ▼
                       Session
```

---

# 17. Persistence Architecture

```text
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

The result can also be preserved as JSON.

---

# 18. Frontend Architecture

```text
frontend/
├── app/
│   ├── page.tsx
│   ├── dataset/
│   ├── evaluation/
│   ├── methodology/
│   ├── limitations/
│   └── logout/
│
├── components/
└── lib/
```

---

# 19. Frontend Service Layer

```text
analysisService.ts
       │
       ▼
POST /api/analyze

authService.ts
       │
       ▼
/api/auth/*

essayService.ts
       │
       ▼
/api/essays/*
```

This keeps HTTP communication separate from presentation components.

---

# 20. Database Architecture

```text
┌──────────────┐
│ users        │
└──────┬───────┘
       │
       ├──────────────┐
       ▼              ▼
┌──────────────┐  ┌──────────────┐
│ auth_accounts│  │ essays       │
└──────────────┘  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ analyses     │
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ sentences    │
                  └──────────────┘
```

---

# 21. Request Lifecycle

Analysis request:

```text
Browser
  ↓
POST /api/analyze
  ↓
Pydantic validation
  ↓
Pipeline
  ↓
Text normalization
  ↓
Sentence extraction
  ↓
Feature extraction
  ↓
Signal normalization
  ↓
Scoring
  ↓
Evidence
  ↓
Document aggregation
  ↓
Optional persistence
  ↓
JSON response
  ↓
Next.js results UI
```

---

# 22. Error Boundaries

Errors should be handled at:

```text
Frontend request
       ↓
FastAPI route
       ↓
Analysis pipeline
       ↓
Model layer
       ↓
Database
```

The frontend should show a useful error state instead of silently failing.

---

# 23. Performance Considerations

The model is local.

Therefore:

```text
First model load
```

can be significantly slower than subsequent requests.

Performance depends on:

- CPU/GPU
- Essay length
- Model
- Token count
- Concurrent requests

Production deployment should consider model preloading and concurrency limits.

---

# 24. Security Architecture

Secrets stay on backend.

```text
Browser
   X
   │
   └── No database credentials
   └── No OAuth client secrets
   └── No session secret
```

Backend owns:

```text
Database
OAuth secrets
Password hashing
Session configuration
Model execution
```

---

# 25. Deployment Architecture

A typical production deployment can be:

```text
Internet
   │
   ▼
Reverse Proxy / HTTPS
   │
   ├───────────────┐
   ▼               ▼
Next.js         FastAPI
                   │
                   ├── Model
                   │
                   ▼
               PostgreSQL
```

OAuth providers connect to FastAPI callbacks.

---

# 26. Architecture Principles

The project should follow:

```text
Separation of concerns
Explicit API contracts
Backend-owned secrets
Database migrations
Small testable modules
Explainable signals
Responsible interpretation
```

---

# 27. Major Architectural Limitation

The detector's statistical score should not be represented as a scientifically validated probability unless the weights and thresholds have been calibrated on representative data.

That is an evaluation problem, not merely a UI problem.

