"use client";

import React from "react";
import Link from "next/link";

export function MethodologyView() {
  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-gutter">
      <div className="md:col-span-12 lg:col-span-8 lg:col-start-3 space-y-12">
        {/* Header Section */}
        <section className="space-y-4 text-center">
          <span className="font-label-caps text-xs text-primary uppercase tracking-widest bg-surface-container px-3 py-1 rounded border border-outline-variant">
            Scientific Framework
          </span>
          <h1 className="font-display-lg text-display-lg text-primary">Methodology: Statistical Signals</h1>
          <p className="font-reading-body text-reading-body text-on-surface-variant max-w-reading-column mx-auto">
            A comprehensive breakdown of the statistical indicators underpinning VeritasAI's diagnostic framework, avoiding simple LLM prompts in favor of objective structural metrics.
          </p>
        </section>

        {/* Section 1: Methodology Signals */}
        <section className="space-y-8 bg-surface-container-lowest p-8 md:p-12 border border-outline-variant rounded-lg shadow-sm">
          <div className="flex items-center gap-4 border-b border-outline-variant pb-4">
            <span className="material-symbols-outlined text-3xl text-primary">smb_share</span>
            <h2 className="font-headline-lg text-headline-lg text-primary">Core Statistical Indicators</h2>
          </div>

          <p className="font-reading-body text-reading-body text-on-surface leading-relaxed">
            Our detection engine does not rely on calling a third-party language model to render a judgment. Instead, it measures fundamental mathematical properties of written prose using token perplexity matrices and structural length distributions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Smoothness (Perplexity) */}
            <div className="bg-surface-container-low p-6 rounded border border-outline-variant/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2.5 h-6 bg-secondary-fixed-dim rounded"></div>
                  <h3 className="font-ui-body text-ui-body font-bold text-primary">1. Smoothness (Perplexity)</h3>
                </div>
                <p className="font-ui-body text-sm text-on-surface-variant mb-6 leading-relaxed">
                  Measures the statistical predictability of word choices. Machine models tend to select highly probable, "smooth" sequences, resulting in low perplexity. Human writing includes unexpected phrasing, creative leaps, or idiosyncratic word choices.
                </p>
              </div>

              {/* Visual representation of Smoothness */}
              <div className="relative h-28 bg-surface rounded border border-outline-variant p-3 flex items-end justify-between gap-2">
                {/* Machine (Low / Smooth) */}
                <div className="w-1/2 h-full flex flex-col justify-end gap-1">
                  <span className="font-data-mono text-[10px] text-on-surface-variant">Machine (Low / Flat)</span>
                  <div className="flex items-end gap-1 h-16">
                    <div className="w-full bg-primary-fixed-dim rounded-t h-[30%]"></div>
                    <div className="w-full bg-primary-fixed-dim rounded-t h-[32%]"></div>
                    <div className="w-full bg-primary-fixed-dim rounded-t h-[28%]"></div>
                    <div className="w-full bg-primary-fixed-dim rounded-t h-[35%]"></div>
                    <div className="w-full bg-primary-fixed-dim rounded-t h-[30%]"></div>
                  </div>
                </div>

                <div className="w-px h-full bg-outline-variant"></div>

                {/* Human (High / Spiky) */}
                <div className="w-1/2 h-full flex flex-col justify-end gap-1">
                  <span className="font-data-mono text-[10px] text-on-surface-variant">Human (High / Spiky)</span>
                  <div className="flex items-end gap-1 h-16">
                    <div className="w-full bg-secondary-fixed-dim rounded-t h-[15%]"></div>
                    <div className="w-full bg-secondary-fixed-dim rounded-t h-[85%]"></div>
                    <div className="w-full bg-secondary-fixed-dim rounded-t h-[35%]"></div>
                    <div className="w-full bg-secondary-fixed-dim rounded-t h-[95%]"></div>
                    <div className="w-full bg-secondary-fixed-dim rounded-t h-[25%]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rhythm (Burstiness) */}
            <div className="bg-surface-container-low p-6 rounded border border-outline-variant/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2.5 h-6 bg-tertiary-fixed-dim rounded"></div>
                  <h3 className="font-ui-body text-ui-body font-bold text-primary">2. Rhythm (Burstiness)</h3>
                </div>
                <p className="font-ui-body text-sm text-on-surface-variant mb-6 leading-relaxed">
                  Evaluates variance in sentence length and syntactic structure across a passage. Machine text often exhibits uniform, monotonous sentence lengths. Human writers vary their cadence naturally, interspersing short punchy sentences with complex clauses.
                </p>
              </div>

              {/* Visual representation of Rhythm */}
              <div className="relative h-28 bg-surface rounded border border-outline-variant p-4 flex flex-col justify-center gap-3">
                {/* Machine (Uniform) */}
                <div className="flex items-center gap-2">
                  <span className="font-data-mono text-[10px] text-on-surface-variant w-16">Machine</span>
                  <div className="h-2 bg-primary-fixed-dim rounded w-3/4"></div>
                  <div className="h-2 bg-primary-fixed-dim rounded w-2/3"></div>
                </div>

                {/* Human (Varied) */}
                <div className="flex items-center gap-2">
                  <span className="font-data-mono text-[10px] text-on-surface-variant w-16">Human</span>
                  <div className="h-2 bg-secondary-fixed-dim rounded w-1/4"></div>
                  <div className="h-2 bg-secondary-fixed-dim rounded w-full"></div>
                  <div className="h-2 bg-secondary-fixed-dim rounded w-1/3"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Pipeline Diagram */}
        <section className="space-y-6 bg-surface-container-lowest p-8 md:p-12 border border-outline-variant rounded-lg shadow-sm">
          <h2 className="font-headline-lg text-headline-lg text-primary border-b border-outline-variant pb-3">
            Detection Pipeline Workflow
          </h2>
          <p className="font-ui-body text-sm text-on-surface-variant leading-relaxed">
            The application follows a transparent, modular signal evaluation architecture rather than a single black-box LLM verdict:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-4 bg-surface-container-low rounded border border-outline-variant flex flex-col items-center text-center">
              <span className="w-8 h-8 rounded-full bg-primary text-on-primary font-data-mono text-xs flex items-center justify-center font-bold mb-3">1</span>
              <h4 className="font-ui-body text-xs font-bold text-primary mb-1">Essay Tokenizer</h4>
              <p className="font-ui-body text-[11px] text-on-surface-variant">Splits text into sentence units and N-gram tokens</p>
            </div>

            <div className="p-4 bg-surface-container-low rounded border border-outline-variant flex flex-col items-center text-center">
              <span className="w-8 h-8 rounded-full bg-primary text-on-primary font-data-mono text-xs flex items-center justify-center font-bold mb-3">2</span>
              <h4 className="font-ui-body text-xs font-bold text-primary mb-1">Signal Calculators</h4>
              <p className="font-ui-body text-[11px] text-on-surface-variant">Computes token perplexity and length burstiness variance</p>
            </div>

            <div className="p-4 bg-surface-container-low rounded border border-outline-variant flex flex-col items-center text-center">
              <span className="w-8 h-8 rounded-full bg-primary text-on-primary font-data-mono text-xs flex items-center justify-center font-bold mb-3">3</span>
              <h4 className="font-ui-body text-xs font-bold text-primary mb-1">Passage Evaluator</h4>
              <p className="font-ui-body text-[11px] text-on-surface-variant">Flags localized sentences (Yellow, Orange, Red)</p>
            </div>

            <div className="p-4 bg-surface-container-low rounded border border-outline-variant flex flex-col items-center text-center">
              <span className="w-8 h-8 rounded-full bg-primary text-on-primary font-data-mono text-xs flex items-center justify-center font-bold mb-3">4</span>
              <h4 className="font-ui-body text-xs font-bold text-primary mb-1">Evidence Synthesizer</h4>
              <p className="font-ui-body text-[11px] text-on-surface-variant">Generates human-readable explanations & trope alerts</p>
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <Link
              href="/dataset"
              className="inline-flex items-center gap-2 bg-primary-container text-on-primary px-6 py-2.5 rounded font-label-caps text-xs font-bold hover:bg-opacity-90 transition-all"
            >
              Explore Dataset & Training Corpora
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
