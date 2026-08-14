"use client";

import React from "react";
import Link from "next/link";

export function DatasetView() {
  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-gutter">
      <div className="md:col-span-12 lg:col-span-8 lg:col-start-3 space-y-12">
        {/* Header */}
        <section className="space-y-4 text-center">
          <span className="font-label-caps text-xs text-primary uppercase tracking-widest bg-surface-container px-3 py-1 rounded border border-outline-variant">
            Data Provenance
          </span>
          <h1 className="font-display-lg text-display-lg text-primary">Dataset Transparency</h1>
          <p className="font-reading-body text-reading-body text-on-surface-variant max-w-reading-column mx-auto">
            Full transparency into our reference corpora, data composition, limitations, and potential domain coverage biases.
          </p>
        </section>

        {/* Bento Grid Dataset Breakdown */}
        <section className="space-y-8 bg-surface-container-lowest p-8 md:p-12 border border-outline-variant rounded-lg shadow-sm">
          <div className="flex items-center gap-4 border-b border-outline-variant pb-4">
            <span className="material-symbols-outlined text-3xl text-primary">analytics</span>
            <h2 className="font-headline-lg text-headline-lg text-primary">Corpus Composition & Sourcing</h2>
          </div>

          <p className="font-reading-body text-reading-body text-on-surface leading-relaxed">
            Our diagnostic reference framework is calibrated on a benchmark dataset comprising 1.2 million admissions essays, research papers, and standardized test responses collected between 2019 and 2023.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Composition Card */}
            <div className="md:col-span-2 bg-surface-container-low p-6 rounded border border-outline-variant flex flex-col justify-between">
              <div>
                <h4 className="font-label-caps text-xs text-on-surface-variant mb-2 uppercase tracking-wider font-bold">
                  Total Calibrated Documents
                </h4>
                <div className="text-4xl font-bold font-headline-lg text-primary mb-1">
                  1.2M <span className="text-lg font-normal text-on-surface-variant">Essays & Papers</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex h-8 rounded overflow-hidden border border-outline-variant">
                  <div className="bg-primary w-[55%] flex items-center px-3 group relative cursor-help" title="55% Verified Human-Authored">
                    <span className="font-data-mono text-xs text-on-primary font-bold">55% Human</span>
                  </div>
                  <div className="bg-primary-fixed-dim w-[35%] flex items-center px-3 group relative cursor-help" title="35% Machine Generated">
                    <span className="font-data-mono text-xs text-on-primary-fixed font-bold">35% Machine</span>
                  </div>
                  <div className="bg-secondary-fixed w-[10%] flex items-center justify-center group relative cursor-help" title="10% Hybrid">
                    <span className="font-data-mono text-xs text-on-secondary-fixed font-bold">10%</span>
                  </div>
                </div>

                <div className="flex justify-between text-xs text-on-surface-variant mt-2 font-data-mono">
                  <span>55% Human-Authored</span>
                  <span>35% Synthetic (GPT-3.5/4, Claude)</span>
                  <span>10% Hybrid Polished</span>
                </div>
              </div>
            </div>

            {/* Sourcing Card */}
            <div className="bg-surface-container-low p-6 rounded border border-outline-variant flex flex-col justify-between">
              <div>
                <h4 className="font-label-caps text-xs text-on-surface-variant mb-4 uppercase tracking-wider font-bold">
                  Document Sources
                </h4>
                <ul className="space-y-3 font-data-mono text-xs text-on-surface">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
                    Partner Universities (Anonymized)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
                    Open Source Academic Corpora
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
                    Synthetically Generated Prompt Sets
                  </li>
                </ul>
              </div>

              <div className="mt-4 pt-3 border-t border-outline-variant text-[11px] text-on-surface-variant">
                Updated quarterly to mirror evolving model architectures.
              </div>
            </div>
          </div>
        </section>

        {/* Dataset Limitations & Subject Bias */}
        <section className="space-y-6 bg-surface-container-lowest p-8 md:p-12 border border-outline-variant rounded-lg shadow-sm">
          <h2 className="font-headline-lg text-headline-lg text-primary border-b border-outline-variant pb-3">
            Dataset Limitations & Bias Warning
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Subject Matter Bias */}
            <div className="p-6 border-l-4 border-tertiary-container bg-surface-container-low rounded">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-tertiary-container text-xl">warning</span>
                <h4 className="font-ui-body text-sm font-bold text-on-surface">Subject-Matter & Domain Bias</h4>
              </div>
              <p className="font-ui-body text-xs leading-relaxed text-on-surface-variant">
                Our reference dataset is heavily weighted toward humanities, social sciences, and personal narrative essays. Highly technical essays (e.g. computer science code walkthroughs or formal math proofs) naturally exhibit lower structural burstiness and may trigger false signals.
              </p>
            </div>

            {/* ESL L2 Writing Bias */}
            <div className="p-6 border-l-4 border-error bg-error-container/20 rounded">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-error text-xl">language</span>
                <h4 className="font-ui-body text-sm font-bold text-error">Second-Language (L2) Writer Risk</h4>
              </div>
              <p className="font-ui-body text-xs leading-relaxed text-on-surface-variant">
                Non-native English speakers frequently utilize structured, formulaic grammatical templates taught in language instruction. This structural predictability can mirror low perplexity signals, leading to higher false-positive rates for L2 writers.
              </p>
            </div>
          </div>

          <div className="pt-4 flex justify-between items-center">
            <Link
              href="/evaluation"
              className="inline-flex items-center gap-2 bg-primary-container text-on-primary px-6 py-2.5 rounded font-label-caps text-xs font-bold hover:bg-opacity-90 transition-all"
            >
              View Test Set Evaluation & Confident Failures
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
