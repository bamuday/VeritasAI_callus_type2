VeritasAI — Actual Project Structure

This document is based on the VeritasAI files and project structure you actually shared during development.

It is intentionally different from a generic/template structure: the backend modules, frontend components, routes, and support files below reflect the project you have been working with.

1. Complete Project Structure

type2/
│
├── backend/
│   │
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── models.py
│   │   │
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── routes.py
│   │   │
│   │   └── analysis/
│   │       ├── __init__.py
│   │       ├── text.py
│   │       ├── pipeline.py
│   │       ├── perplexity.py
│   │       ├── burstiness.py
│   │       ├── tropes.py
│   │       ├── features.py
│   │       ├── evidence.py
│   │       └── scoring.py
│   │
│   ├── tests/
│   │   └── test_pipeline.py
│   │
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env.example
│   ├── README.md
│   ├── request.json
│   ├── response.json
│   ├── test_pipeline.py
│   └── .venv/
│
├── frontend/
│   │
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   │
│   │   ├── page.tsx
│   │   │
│   │   ├── dataset/
│   │   │   └── page.tsx
│   │   │
│   │   ├── evaluation/
│   │   │   └── page.tsx
│   │   │
│   │   ├── limitations/
│   │   │   └── page.tsx
│   │   │
│   │   └── methodology/
│   │       └── page.tsx
│   │
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── EssayInputView.tsx
│   │   ├── LoadingStateView.tsx
│   │   ├── AnalysisResultsView.tsx
│   │   ├── DatasetView.tsx
│   │   ├── EvaluationView.tsx
│   │   ├── LimitationsView.tsx
│   │   └── MethodologyView.tsx
│   │
│   ├── lib/
│   │   ├── analysisService.ts
│   │   ├── analyzer.ts
│   │   ├── mockData.ts
│   │   ├── samples.ts
│   │   ├── scoring.ts
│   │   └── types.ts
│   │
│   ├── public/
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── postcss.config.js
│   └── next.config.*
│
├── README.md
├── INSTALLATION.md
├── START_VERITASAI.md
├── FILE_STRUCTURE.md
└── .gitignore

2. Important Correction From the Earlier Structure

The earlier structure was too generic.

Your actual backend has additional analysis modules:

burstiness.py
evidence.py
scoring.py
tropes.py

and your frontend has dedicated views for:

Dataset
Evaluation
Limitations
Methodology

Your frontend also uses a lib/ layer for:

analysisService
analyzer
mockData
samples
scoring
types

So this structure should be used for your documentation rather than the previous generic version.

3. Backend

backend/
├── app/
├── tests/
├── requirements.txt
├── Dockerfile
├── .env.example
├── README.md
├── request.json
├── response.json
├── test_pipeline.py
└── .venv/

The backend is the statistical analysis engine and API server.

Main technologies:

Python
FastAPI
Pydantic
PyTorch
Transformers
Uvicorn

4. Backend Application

backend/app/
├── __init__.py
├── main.py
├── models.py
├── api/
└── analysis/

main.py

Creates the FastAPI application.

Responsibilities:

Create the FastAPI app.

Configure CORS.

Register API routes.

Expose the health endpoint.

Main health endpoint:

GET /health

Expected response:

{
  "status": "ok",
  "service": "veritasai"
}

5. Backend API

backend/app/api/
├── __init__.py
└── routes.py

routes.py

Contains the HTTP API endpoint for essay analysis.

Main endpoint:

POST /api/analyze

Request format:

{
  "essay": "Your essay...",
  "model_id": "custom"
}

The route passes the essay into:

analyze_essay()

from:

app.analysis.pipeline

The API layer handles HTTP concerns.

The statistical analysis remains in the analysis package.

6. Backend Data Models

backend/app/models.py

Contains the Pydantic data models.

The important models you currently use include:

PassageSignal
SentenceAnalysis
SignalDistribution
AnalyzeRequest
AnalysisResult

Conceptually:

AnalyzeRequest
│
├── essay
└── model_id

The output:

AnalysisResult
│
├── id
├── title
├── processedAt
├── rawText
├── wordCount
├── sentenceCount
├── readingTimeMinutes
├── analysisComplexity
├── reviewPriority
├── distribution
├── sentences[]
└── summaryMessage

7. Backend Analysis Package

backend/app/analysis/
├── __init__.py
├── text.py
├── pipeline.py
├── perplexity.py
├── burstiness.py
├── tropes.py
├── features.py
├── evidence.py
└── scoring.py

This is the core of VeritasAI.

8. text.py

app/analysis/text.py

Responsible for text processing.

It contains functionality for:

Word tokenization
Text normalization
Paragraph handling
Sentence boundary detection
Sentence extraction
Word counting
Character counting
Reading-time calculation
Document complexity

Important functions include:

tokenize_words()
normalize_word()
normalize_text()
split_paragraphs()
_sentence_spans()
split_sentences()
_paragraph_index_at()
extract_sentences()
count_words()
count_characters()
reading_time_minutes()
analysis_complexity()

Sentence flow

Raw essay
     │
     ▼
normalize_text()
     │
     ▼
_sentence_spans()
     │
     ▼
Direct sentence slices
     │
     ▼
tokenize_words()
     │
     ▼
Sentence objects

A major implementation rule in your project is that sentence text should not be reconstructed by joining tokenized words.

9. pipeline.py

app/analysis/pipeline.py

This is the main orchestration module.

Main function:

analyze_essay()

It coordinates the complete analysis process.

Essay
 │
 ▼
Validation
 │
 ▼
Sentence extraction
 │
 ▼
Document statistics
 │
 ▼
Feature extraction
 │
 ▼
Sentence analysis
 │
 ├── Perplexity
 ├── Burstiness
 ├── Tropes
 └── Lexical predictability
 │
 ▼
Signal aggregation
 │
 ▼
Distribution
 │
 ▼
Review priority
 │
 ▼
Summary
 │
 ▼
AnalysisResult

10. perplexity.py

app/analysis/perplexity.py

Provides language-model-based perplexity analysis.

Your implementation uses:

PyTorch
Transformers

The module calculates token-level language-model predictability and converts it into a diagnostic signal.

It should be interpreted as statistical evidence, not as proof of human or AI authorship.

11. burstiness.py

app/analysis/burstiness.py

Analyzes sentence-length variation and sentence rhythm.

The sentence is compared with the document's sentence-length distribution.

Conceptually:

Sentence lengths
       │
       ▼
Essay-level statistics
       │
       ▼
Sentence comparison
       │
       ▼
Burstiness signal

12. tropes.py

app/analysis/tropes.py

Handles formulaic phrasing / configured trope detection.

The module can identify configured phrases and return supporting diagnostic information.

The result is represented as one of the sentence-level signals.

13. features.py

app/analysis/features.py

Extracts general statistical and linguistic features.

The project uses this module for measurements such as:

Word statistics
Sentence lengths
Function-word ratio
Punctuation density
Punctuation counts
Contraction count
Contraction rate
Lexical predictability
N-gram-related features

These features provide supporting evidence for the diagnostic pipeline.

14. evidence.py

app/analysis/evidence.py

Converts calculated statistics into evidence that can be displayed to the user.

It contributes to:

Signal titles
Metric values
Categories
Descriptions
Explanations

The frontend uses the resulting signal information in the evidence panel.

15. scoring.py

app/analysis/scoring.py

Contains scoring-related logic used by the analysis system.

It is responsible for helping convert statistical measurements into the diagnostic scoring framework.

The important distinction is:

raw statistical measurement
          │
          ▼
diagnostic score
          │
          ▼
signal / flag level

16. Backend Tests

Your project contains:

backend/tests/
└── test_pipeline.py

and also a root-level:

backend/test_pipeline.py

The root-level script has been used extensively during your manual debugging and verification.

The tests/scripts have been used to verify:

Sentence extraction
Pipeline execution
Raw text preservation
Sentence text integrity
API response structure

17. Backend Configuration

requirements.txt

Contains the Python dependencies.

The important packages currently include:

fastapi
uvicorn
pydantic
torch
transformers
tokenizers

Install:

python -m pip install -r requirements.txt

Dockerfile

Provides a containerization configuration for the backend.

This is useful for:

Deployment
Reproducible environments
Container-based execution

.env.example

Contains example environment configuration.

Do not put real secrets into:

.env.example

Use a local .env for actual private configuration when required.

18. .venv

backend/.venv/

This is the local Python virtual environment.

It contains installed packages such as:

torch
transformers
fastapi
uvicorn
pydantic

It should not normally be committed to Git.

Use:

source .venv/bin/activate

on macOS/Linux.

19. Frontend

Your frontend is a Next.js application.

Based on the files you shared, the frontend is organized into:

frontend/
├── app/
├── components/
├── lib/
├── public/
├── package.json
├── package-lock.json
├── tsconfig.json
├── postcss.config.js
└── next.config.*

Technology stack:

Next.js
React
TypeScript
Tailwind CSS
Lucide React

Your package configuration currently uses:

Next.js 14.x
React 18.x
TypeScript 5.x
Tailwind CSS 3.x

20. Frontend App Router

The frontend uses the Next.js App Router.

frontend/app/
├── layout.tsx
├── globals.css
├── page.tsx
├── dataset/
│   └── page.tsx
├── evaluation/
│   └── page.tsx
├── limitations/
│   └── page.tsx
└── methodology/
    └── page.tsx

21. Main Frontend Page

app/page.tsx

This is the main VeritasAI analysis page.

It manages the main UI states:

input
loading
results

The page imports:

EssayInputView
LoadingStateView
AnalysisResultsView
analysisService
mockData
types

The flow is:

Essay Input
     │
     ▼
Run Analysis
     │
     ▼
Loading
     │
     ▼
API Request
     │
     ▼
Analysis Result
     │
     ▼
Results View

22. Frontend Routes

Home

/

Main essay analysis interface.

Dataset

/dataset

Uses:

DatasetView

Purpose:

Dataset / evaluation information

Evaluation

/evaluation

Uses:

EvaluationView

Purpose:

Evaluation methodology
Performance / diagnostic evaluation

Limitations

/limitations

Uses:

LimitationsView

Purpose:

System limitations
Responsible interpretation

Methodology

/methodology

Uses:

MethodologyView

Purpose:

Explain how VeritasAI performs its statistical analysis

23. Frontend Components

frontend/components/
├── Navbar.tsx
├── Footer.tsx
├── EssayInputView.tsx
├── LoadingStateView.tsx
├── AnalysisResultsView.tsx
├── DatasetView.tsx
├── EvaluationView.tsx
├── LimitationsView.tsx
└── MethodologyView.tsx

24. EssayInputView.tsx

Responsible for the essay-entry interface.

Conceptually:

EssayInputView
│
├── Essay text area
├── Input controls
└── Run Analysis

The component passes the essay back to the main page.

25. LoadingStateView.tsx

Displays the analysis/loading state while the backend request is being processed.

Flow:

Run Analysis
     │
     ▼
LoadingStateView
     │
     ▼
Backend analysis
     │
     ▼
Results

26. AnalysisResultsView.tsx

Displays the main analysis dashboard.

It contains the result presentation including:

Diagnostic Overview
Review Priority
Overall Signal Distribution
Document Passages
Sentence scores
Signal evidence

The UI can show individual signals such as:

Perplexity
Burstiness
Formulaic phrasing
Lexical predictability

27. DatasetView.tsx

Displays dataset-related information.

Route:

/dataset

28. EvaluationView.tsx

Displays evaluation information.

Route:

/evaluation

29. LimitationsView.tsx

Displays limitations and responsible-use information.

Route:

/limitations

30. MethodologyView.tsx

Displays the methodology behind the VeritasAI diagnostic framework.

Route:

/methodology

31. Navbar.tsx

Provides navigation across the application.

It connects the main interface with pages such as:

Dashboard
Dataset
Evaluation
Methodology
Limitations

32. Footer.tsx

Contains the bottom-level application navigation/information.

It is used for links such as:

Privacy Policy
Terms of Service
Ethical AI Charter

33. Frontend lib/

frontend/lib/
├── analysisService.ts
├── analyzer.ts
├── mockData.ts
├── samples.ts
├── scoring.ts
└── types.ts

This layer contains application logic, API communication, shared types, sample data, and scoring helpers.

34. analysisService.ts

Responsible for communication between the frontend and backend analysis API.

Conceptually:

Frontend
   │
   ▼
analyzeEssay()
   │
   ▼
POST /api/analyze
   │
   ▼
FastAPI

This keeps API communication separate from UI components.

35. types.ts

Contains shared TypeScript types used by the frontend.

The frontend uses these types to represent the backend response.

Conceptually:

AnalysisResult
├── document metadata
├── distribution
└── sentences[]
    ├── signal score
    ├── flag level
    └── signals[]

36. mockData.ts

Contains demo/mock analysis data used by the frontend.

The main page has used demo result data during development.

This allows the interface to display a complete analysis dashboard even before a live API request is completed.

37. samples.ts

Contains sample essay or diagnostic data used for development/testing/demo purposes.

38. analyzer.ts

Contains frontend-side analyzer/helper logic used by the application.

This should remain separate from:

analysisService.ts

because API communication and local analysis/helper logic are different responsibilities.

39. scoring.ts

Contains frontend scoring/helper logic.

This should be kept separate from the backend scoring module:

backend/app/analysis/scoring.py

The backend is the authoritative location for server-side analysis.

40. Frontend Configuration

package.json
package-lock.json
tsconfig.json
postcss.config.js
next.config.*

package.json

Defines:

Dependencies
Development dependencies
npm scripts

Current important scripts:

npm run dev
npm run build
npm run start
npm run lint

tsconfig.json

TypeScript configuration.

The project uses the alias:

@/*

which maps to the frontend project root.

This is why imports such as:

import { EssayInputView } from "@/components/EssayInputView";

work.

41. CSS

frontend/app/globals.css

Contains global styles for the application.

The project also uses Tailwind CSS.

42. PostCSS

frontend/postcss.config.js

Provides PostCSS configuration used by the frontend build.

43. public/

frontend/public/

Contains static frontend assets.

Examples may include:

icons
images
logos
static files

44. Full Data Flow

The actual project flow is:

┌─────────────────────────────┐
│          User               │
│     Enters an essay         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       EssayInputView        │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│         page.tsx            │
│     input → loading         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│     analysisService.ts      │
└──────────────┬──────────────┘
               │
               │ POST /api/analyze
               ▼
┌─────────────────────────────┐
│       FastAPI routes.py     │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       pipeline.py           │
└──────────────┬──────────────┘
               │
       ┌───────┼────────┐
       │       │        │
       ▼       ▼        ▼
    text.py  features  scoring
       │       │        │
       └───────┼────────┘
               │
       ┌───────┼──────────────┐
       ▼       ▼       ▼      ▼
 perplexity burstiness tropes evidence
       │       │       │      │
       └───────┴───────┴──────┘
               │
               ▼
       AnalysisResult
               │
               ▼
        JSON API response
               │
               ▼
       AnalysisResultsView
               │
               ▼
          User dashboard

45. Backend vs Frontend Responsibilities

Backend

The backend should own:

Text normalization
Sentence extraction
Tokenization
Statistical features
Perplexity
Burstiness
Formulaic phrasing
Scoring
Evidence generation
Review priority
Final analysis result

Frontend

The frontend should own:

Essay input
Loading state
API communication
Result visualization
Navigation
Dashboard presentation
Methodology page
Evaluation page
Limitations page
Dataset page

This separation is important.

The frontend should not independently recreate the backend's statistical analysis.

46. Development Environment

Backend

Python 3.11
FastAPI
Uvicorn
PyTorch 2.8.0
Transformers 4.55.4
Pydantic 2.11.7

Frontend

Next.js 14.x
React 18.x
TypeScript 5.x
Tailwind CSS 3.x
Lucide React

47. Local Startup

Backend

cd "/Users/srinjoy/Desktop/callus hackthon/type2/backend"
source .venv/bin/activate
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000

Backend:

http://127.0.0.1:8000

API documentation:

http://127.0.0.1:8000/docs

Frontend

cd "/Users/srinjoy/Desktop/callus hackthon/type2/frontend"
npm install
npm run dev

Frontend:

http://localhost:3000

48. Git Ignore

The following should normally be ignored:

# Python
.venv/
__pycache__/
*.pyc

# Next.js
.next/
node_modules/

# Environment
.env
.env.*

# Local generated files
response.json

# OS
.DS_Store

Do not commit private essay submissions or generated analysis results containing user data.

49. Documentation Files

The project documentation should be organized as:

type2/
├── README.md
├── INSTALLATION.md
├── START_VERITASAI.md
└── FILE_STRUCTURE.md

README.md

Complete project overview.

INSTALLATION.md

Installation instructions for:

macOS
Windows
Python environment
Node.js environment
Dependencies

START_VERITASAI.md

Quick startup instructions.

FILE_STRUCTURE.md

This document.

50. Final Actual Architecture

                         VERITASAI
                            │
              ┌─────────────┴─────────────┐
              │                           │
          FRONTEND                     BACKEND
              │                           │
          Next.js                     FastAPI
              │                           │
       ┌──────┼──────┐                    │
       │      │      │                    ▼
      App Components Lib              API Routes
       │      │      │                    │
       │      │      └──────────────┐     ▼
       │      │                     │  Pipeline
       │      │                     │     │
       │      │                     │     ├── Text
       │      │                     │     ├── Features
       │      │                     │     ├── Perplexity
       │      │                     │     ├── Burstiness
       │      │                     │     ├── Tropes
       │      │                     │     ├── Evidence
       │      │                     │     └── Scoring
       │      │                     │
       │      └─────────────────────┘
       │
       ▼
   Results UI
       │
       ▼
  User-facing diagnostics

This is the structure you should use for the project's technical documentation because it matches the actual VeritasAI modules and frontend views you have shared, rather than assuming files that are not part of your project.