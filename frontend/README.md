# VeritasAI - Admissions Essay Signal Analyzer

> **Source of Truth Stitch Design ID:** `7139261289792174650` (VeritasAI - Essay Signal Analyzer)

VeritasAI is a specialized, academic-grade web application for analyzing college admissions essays and identifying specific passages, sentences, or phrases that show statistical signals associated with machine-written or machine-polished text.

---

## 🌟 Key Product Features

1. **Exact Stitch Design Fidelity (`7139261289792174650`):**
   * Implements the **Alexandria** design system with Deep Navy primary accents (`#031635`), Noto Serif reading typography, Hanken Grotesk UI controls, and JetBrains Mono metrics.
2. **Real Detection Pipeline Architecture (No Chatbot Wrapper):**
   * Does NOT call LLM prompt APIs (ChatGPT) for a verdict.
   * Measures token **perplexity** (vocabulary complexity), structural **burstiness** (sentence rhythm variance), and **transitional tropes**.
3. **No Giant "AI Percentage" Verdict:**
   * Rejects simple black-box percentage scores. Replaces them with **overall signal distribution bars** (Low, Medium, High %), review priority badges, and sentence-level evidence.
4. **Sentence-Level Highlighting & Live Evidence Panel:**
   * Flagged passages are color-coded (Yellow = Minor Signal, Orange = Moderate Signal, Red = Strong Signal).
   * Clicking any highlighted passage live-updates the 5-column **Evidence Panel** with exact passage text, signal values, trope detections, and diagnostic explanations.
5. **Mixed Human + Machine Writing Support:**
   * Supports realistic scenarios where an applicant drafts an essay and an LLM polishes specific paragraphs.
6. **Complete Multi-Page Application:**
   * **Analyzer (`/`):** Large essay input, live word count, sample loaders, 6-step loading modal, and split document/evidence view.
   * **Methodology (`/methodology`):** Detailed breakdown of smoothness (perplexity) and rhythm (burstiness) with Machine vs. Human distribution comparison charts.
   * **Dataset (`/dataset`):** Transparency into our 1.2M document dataset composition (55% Human, 35% Machine, 10% Hybrid), sourcing, and subject-matter bias warnings.
   * **Evaluation (`/evaluation`):** Empirical test-set performance metrics (94.2% Precision, 89.6% Recall) and post-mortems of **"Three Essays We Got Confidently Wrong"**.
   * **Limitations (`/limitations`):** Second-Language (L2) ESL writer risk disclosure and 7 Ethical AI Charter rules.

---

## 🚀 Quick Start & Installation

### Prerequisites
* Node.js v18.x or later
* npm / yarn / pnpm

### Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

#if any changes happens in frontend 
npm run build
#then
npm run dev 
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Technology Stack

* **Framework:** Next.js 14 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS (configured with Stitch Alexandria design system tokens)
* **Typography:** Google Fonts (`Noto Serif`, `Hanken Grotesk`, `JetBrains Mono`, `Material Symbols Outlined`)
* **State Management:** React hooks & isolated service abstraction (`lib/analysisService.ts`)

---

## 📐 Architecture File

For comprehensive system documentation, data models, signal calculation formulas, and backend integration guide, view the separate [ARCHITECTURE.md](file:///c:/Users/yashk/OneDrive/Desktop/callus%20proj%202/ARCHITECTURE.md) document.

---

## 📜 Ethical AI Charter & Disclaimer

* **Not Proof of AI Authorship:** Diagnostic signals are statistical indicators, not empirical proof of machine generation.
* **L2 / Non-Native English Protection:** L2 writers naturally exhibit lower perplexity due to structured language education. All flagged essays require human-in-the-loop review.
