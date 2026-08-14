"use client";

import React from "react";
import Link from "next/link";

export function LimitationsView() {
  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-gutter">
      <div className="md:col-span-12 lg:col-span-8 lg:col-start-3 space-y-12">
        {/* Header */}
        <section className="space-y-4 text-center">
          <span className="font-label-caps text-xs text-primary uppercase tracking-widest bg-surface-container px-3 py-1 rounded border border-outline-variant">
            Ethical Governance
          </span>
          <h1 className="font-display-lg text-display-lg text-primary">Limitations & Ethical AI Charter</h1>
          <p className="font-reading-body text-reading-body text-on-surface-variant max-w-reading-column mx-auto">
            VeritasAI enforces strict institutional usage constraints. Diagnostic flags must never serve as sole justification for academic disciplinary action.
          </p>
        </section>

        {/* Second Language Writing Risk (Requirement #13) */}
        <section className="space-y-6 bg-error-container/20 p-8 md:p-10 border-l-4 border-error rounded-r-lg shadow-sm">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl text-error">language</span>
            <h2 className="font-headline-lg text-headline-lg text-error">
              Second-Language (L2) Writer Risk & Bias
            </h2>
          </div>
          <p className="font-reading-body text-reading-body text-on-surface leading-relaxed">
            Independent scholarly research consistently demonstrates that AI detection systems disproportionately flag non-native English speakers. Because L2 writers often employ structured grammatical constructions and a narrower vocabulary range taught in standard English curricula, their prose naturally exhibits lower perplexity and burstiness.
          </p>
          <div className="bg-surface-container-lowest p-4 rounded border border-outline-variant font-ui-body text-xs text-on-surface-variant leading-relaxed">
            <strong>Mandatory Policy:</strong> Admissions officers must evaluate flagged essays from international or L2 applicants with human contextual judgment, taking into account the applicant's prior written work and TOEFL/IELTS context.
          </div>
        </section>

        {/* 7 Core Disclaimers & Rules (Requirement #14) */}
        <section className="space-y-8 bg-surface-container-lowest p-8 md:p-12 border border-outline-variant rounded-lg shadow-sm">
          <h2 className="font-headline-lg text-headline-lg text-primary border-b border-outline-variant pb-3">
            Core Technical Limitations & Operational Rules
          </h2>

          <div className="space-y-6 font-ui-body text-sm">
            <div className="flex gap-4 items-start p-4 bg-surface-container-low rounded border border-outline-variant">
              <span className="w-7 h-7 rounded-full bg-primary text-on-primary font-data-mono text-xs flex items-center justify-center font-bold shrink-0">1</span>
              <div>
                <strong className="text-primary block font-bold mb-1">A Diagnostic Flag is NOT Proof of AI Authorship</strong>
                <p className="text-on-surface-variant text-xs leading-relaxed">
                  Flags represent statistical pattern matches against reference corpora. They do not constitute empirical or legal proof that an LLM generated the text.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 bg-surface-container-low rounded border border-outline-variant">
              <span className="w-7 h-7 rounded-full bg-primary text-on-primary font-data-mono text-xs flex items-center justify-center font-bold shrink-0">2</span>
              <div>
                <strong className="text-primary block font-bold mb-1">Human Writing Can Produce Similar Patterns</strong>
                <p className="text-on-surface-variant text-xs leading-relaxed">
                  Highly disciplined academic writers, technical journalists, and students following strict essay templates often produce text with low perplexity and static length distributions.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 bg-surface-container-low rounded border border-outline-variant">
              <span className="w-7 h-7 rounded-full bg-primary text-on-primary font-data-mono text-xs flex items-center justify-center font-bold shrink-0">3</span>
              <div>
                <strong className="text-primary block font-bold mb-1">Machine-Polished Human Writing Creates Mixed Signals</strong>
                <p className="text-on-surface-variant text-xs leading-relaxed">
                  When a student writes an original essay and uses a grammar tool or LLM to rephrase specific paragraphs, the document will yield mixed sentence-level signals rather than a uniform classification.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 bg-surface-container-low rounded border border-outline-variant">
              <span className="w-7 h-7 rounded-full bg-primary text-on-primary font-data-mono text-xs flex items-center justify-center font-bold shrink-0">4</span>
              <div>
                <strong className="text-primary block font-bold mb-1">Short Passages (&lt; 150 Words) Have High Statistical Uncertainty</strong>
                <p className="text-on-surface-variant text-xs leading-relaxed">
                  Burstiness and perplexity metrics require a sufficient sample size of sentences to compute reliable variance. Short paragraphs yield high variance error margins.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 bg-surface-container-low rounded border border-outline-variant">
              <span className="w-7 h-7 rounded-full bg-primary text-on-primary font-data-mono text-xs flex items-center justify-center font-bold shrink-0">5</span>
              <div>
                <strong className="text-primary block font-bold mb-1">Mandatory Human-in-the-Loop Review</strong>
                <p className="text-on-surface-variant text-xs leading-relaxed">
                  Automated decision-making based solely on detector metrics is strictly prohibited by our institutional deployment charter.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-outline-variant flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary-container text-on-primary px-8 py-3 rounded font-label-caps text-xs font-bold hover:bg-opacity-90 transition-all shadow-sm"
            >
              Return to Essay Analyzer
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
