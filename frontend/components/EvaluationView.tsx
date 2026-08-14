"use client";

import React from "react";
import Link from "next/link";

export function EvaluationView() {
  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-gutter">
      <div className="md:col-span-12 lg:col-span-8 lg:col-start-3 space-y-12">
        {/* Header */}
        <section className="space-y-4 text-center">
          <span className="font-label-caps text-xs text-primary uppercase tracking-widest bg-surface-container px-3 py-1 rounded border border-outline-variant">
            Empirical Rigor
          </span>
          <h1 className="font-display-lg text-display-lg text-primary">Evaluation & Confident Failures</h1>
          <p className="font-reading-body text-reading-body text-on-surface-variant max-w-reading-column mx-auto">
            Transparency in academic evaluation requires acknowledging limitations alongside capabilities. Below are our test-set performance metrics and a post-mortem of confident failures.
          </p>
        </section>

        {/* Section 1: Test-Set Metrics */}
        <section className="space-y-8 bg-surface-container-lowest p-8 md:p-12 border border-outline-variant rounded-lg shadow-sm">
          <div className="flex items-center gap-4 border-b border-outline-variant pb-4">
            <span className="material-symbols-outlined text-3xl text-primary">analytics</span>
            <h2 className="font-headline-lg text-headline-lg text-primary">Benchmark Test-Set Performance</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-surface-container-low rounded border border-outline-variant">
              <div className="font-data-mono text-3xl font-bold text-primary">94.2%</div>
              <div className="font-label-caps text-[11px] text-on-surface-variant uppercase mt-1">Precision</div>
              <div className="font-ui-body text-[10px] text-outline mt-0.5">High confidence in flagged synthetic text</div>
            </div>

            <div className="p-4 bg-surface-container-low rounded border border-outline-variant">
              <div className="font-data-mono text-3xl font-bold text-primary">89.6%</div>
              <div className="font-label-caps text-[11px] text-on-surface-variant uppercase mt-1">Recall</div>
              <div className="font-ui-body text-[10px] text-outline mt-0.5">Prioritizing low false positives over total coverage</div>
            </div>

            <div className="p-4 bg-surface-container-low rounded border border-outline-variant">
              <div className="font-data-mono text-3xl font-bold text-primary">91.8%</div>
              <div className="font-label-caps text-[11px] text-on-surface-variant uppercase mt-1">F1 Score</div>
              <div className="font-ui-body text-[10px] text-outline mt-0.5">Balanced diagnostic metric</div>
            </div>

            <div className="p-4 bg-surface-container-low rounded border border-outline-variant">
              <div className="font-data-mono text-3xl font-bold text-error">2.1%</div>
              <div className="font-label-caps text-[11px] text-on-surface-variant uppercase mt-1">False Positive Rate</div>
              <div className="font-ui-body text-[10px] text-outline mt-0.5">Native English test corpora baseline</div>
            </div>
          </div>
        </section>

        {/* Section 2: Requirement #12 - Three Essays We Got Confidently Wrong */}
        <section className="space-y-8 bg-surface-container-lowest p-8 md:p-12 border border-outline-variant rounded-lg shadow-sm">
          <div className="flex items-center gap-4 border-b border-outline-variant pb-4">
            <span className="material-symbols-outlined text-3xl text-error">dangerous</span>
            <div>
              <h2 className="font-headline-lg text-headline-lg text-primary">Three Essays We Got Confidently Wrong</h2>
              <p className="font-ui-body text-xs text-on-surface-variant mt-0.5">
                Detailed post-mortems of authentic human essays misclassified as synthetic by our detection engine.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Case 1 */}
            <div className="p-6 border border-outline-variant rounded bg-surface-container-low space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-outline-variant/60 pb-3">
                <span className="font-label-caps text-xs text-error font-bold uppercase tracking-wider">
                  Case #1: Thesaurus & Over-Formal Vocabulary Syndrome
                </span>
                <span className="font-data-mono text-xs bg-error-container text-on-error-container px-2 py-0.5 rounded">
                  Detector Flag: 92% High Signal (False Positive)
                </span>
              </div>

              <div className="bg-surface p-4 rounded border-l-4 border-error font-reading-body text-xs leading-relaxed italic text-on-surface">
                "Furthermore, the ubiquitous juxtaposition of socio-economic paradigms within metropolitan infrastructures mandates an introspective re-evaluative synthesis of civic responsibilities..."
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-ui-body">
                <div>
                  <strong className="text-primary block mb-1">Why it was wrong:</strong>
                  <p className="text-on-surface-variant leading-relaxed">
                    The authentic high-school applicant attempted to adopt a perceived "scholarly" tone by substituting simpler words with thesaurus synonyms. The resulting uniform high-register vocabulary matched the low-perplexity signal typical of zero-shot LLM outputs.
                  </p>
                </div>
                <div>
                  <strong className="text-primary block mb-1">What was learned:</strong>
                  <p className="text-on-surface-variant leading-relaxed">
                    Vocabulary register alone cannot serve as a primary signal. Engine V2 was updated to cross-reference vocabulary rarity with sentence-level syntactic variance.
                  </p>
                </div>
              </div>
            </div>

            {/* Case 2 */}
            <div className="p-6 border border-outline-variant rounded bg-surface-container-low space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-outline-variant/60 pb-3">
                <span className="font-label-caps text-xs text-error font-bold uppercase tracking-wider">
                  Case #2: Rigid 5-Paragraph Secondary School Template
                </span>
                <span className="font-data-mono text-xs bg-error-container text-on-error-container px-2 py-0.5 rounded">
                  Detector Flag: 88% High Signal (False Positive)
                </span>
              </div>

              <div className="bg-surface p-4 rounded border-l-4 border-error font-reading-body text-xs leading-relaxed italic text-on-surface">
                "Firstly, my passion for biology began in 9th grade. Secondly, my laboratory internship deepened this commitment. In conclusion, I hope to continue this work at university..."
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-ui-body">
                <div>
                  <strong className="text-primary block mb-1">Why it was wrong:</strong>
                  <p className="text-on-surface-variant leading-relaxed">
                    The student closely adhered to a formulaic 5-paragraph structure ("Firstly", "Secondly", "In conclusion") taught in AP English classes. This structural rigidity created a uniform sentence-length distribution (low burstiness) that mirrored AI templates.
                  </p>
                </div>
                <div>
                  <strong className="text-primary block mb-1">What was learned:</strong>
                  <p className="text-on-surface-variant leading-relaxed">
                    Formally taught educational templates must be distinguished from LLM tropes. Added dedicated template-detection logic to prevent structural false flags.
                  </p>
                </div>
              </div>
            </div>

            {/* Case 3 */}
            <div className="p-6 border border-outline-variant rounded bg-surface-container-low space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-outline-variant/60 pb-3">
                <span className="font-label-caps text-xs text-error font-bold uppercase tracking-wider">
                  Case #3: Second-Language (L2) Non-Native Writing Pattern
                </span>
                <span className="font-data-mono text-xs bg-error-container text-on-error-container px-2 py-0.5 rounded">
                  Detector Flag: 85% Moderate-High Signal (False Positive)
                </span>
              </div>

              <div className="bg-surface p-4 rounded border-l-4 border-error font-reading-body text-xs leading-relaxed italic text-on-surface">
                "It is important to express that my family journey was challenging. Every day, we worked hard to achieve our dreams in a new country..."
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-ui-body">
                <div>
                  <strong className="text-primary block mb-1">Why it was wrong:</strong>
                  <p className="text-on-surface-variant leading-relaxed">
                    Non-native English writers often rely on standard, clear grammatical patterns and a focused vocabulary range. This structural simplicity registers statistically as low perplexity.
                  </p>
                </div>
                <div>
                  <strong className="text-primary block mb-1">What was learned:</strong>
                  <p className="text-on-surface-variant leading-relaxed">
                    Reinforces requirement for mandatory human review and explicit L2 warning disclaimers before taking any administrative action.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-between items-center">
            <Link
              href="/limitations"
              className="inline-flex items-center gap-2 bg-primary-container text-on-primary px-6 py-2.5 rounded font-label-caps text-xs font-bold hover:bg-opacity-90 transition-all"
            >
              Read Full Ethical AI Charter & Institutional Guidelines
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
