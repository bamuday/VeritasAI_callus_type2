"use client";

import React, { useMemo, useState } from "react";
import {
  AnalysisResult,
  SentenceAnalysis,
  FlagLevel,
} from "@/lib/types";

interface AnalysisResultsViewProps {
  result: AnalysisResult;
  activeTool?: string;
  setActiveTool?: (tool: string) => void;
  theme?: 'dark' | 'light';
  onReset: () => void;
}

type AnalysisTab =
  | "overview"
  | "evidence"
  | "metrics"
  | "ethics";

export function AnalysisResultsView({
  result,
  activeTool = 'overview',
  setActiveTool,
  theme = 'dark',
  onReset,
}: AnalysisResultsViewProps) {
  const isDark = theme === 'dark';
  const defaultSelected =
    result.sentences.find((s) => s.flagLevel === "red")?.id ??
    result.sentences.find((s) => s.flagLevel === "orange")?.id ??
    result.sentences[0]?.id ??
    "s0";

  const [selectedSentenceId, setSelectedSentenceId] =
    useState<string>(defaultSelected);

  const [activeTab, setActiveTab] =
    useState<AnalysisTab>(
      (activeTool as AnalysisTab) || "overview"
    );

  const changeTab = (tab: AnalysisTab) => {
    setActiveTab(tab);
    setActiveTool?.(tab);
  };

  React.useEffect(() => {
    if (
      activeTool === "overview" ||
      activeTool === "evidence" ||
      activeTool === "metrics" ||
      activeTool === "ethics"
    ) {
      setActiveTab(activeTool);
    }
  }, [activeTool]);

  const selectedSentence: SentenceAnalysis | undefined =
    result.sentences.find(
      (sentence) => sentence.id === selectedSentenceId
    ) ?? result.sentences[0];

  const signalCounts = useMemo(() => {
    return {
      red: result.sentences.filter(
        (s) => s.flagLevel === "red"
      ).length,

      orange: result.sentences.filter(
        (s) => s.flagLevel === "orange"
      ).length,

      yellow: result.sentences.filter(
        (s) => s.flagLevel === "yellow"
      ).length,

      none: result.sentences.filter(
        (s) => s.flagLevel === "none"
      ).length,
    };
  }, [result]);

  const getSignalBadge = (level: FlagLevel) => {
    switch (level) {
      case "red":
        return {
          label: "Strong Signal",
          className:
            "bg-red-500/10 text-red-400 border-red-500/30",
        };

      case "orange":
        return {
          label: "Moderate Signal",
          className:
            "bg-orange-500/10 text-orange-400 border-orange-500/30",
        };

      case "yellow":
        return {
          label: "Minor Signal",
          className:
            "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
        };

      default:
        return {
          label: "No Signal",
          className:
            "bg-[#111a2c] text-slate-600 dark:text-[#8793aa] border-[#25324a]",
        };
    }
  };

  const currentBadge = selectedSentence
    ? getSignalBadge(selectedSentence.flagLevel)
    : getSignalBadge("none");

  const overallScore = useMemo(() => {
    if (!result.sentences.length) return 0;

    const total = result.sentences.reduce(
      (sum, sentence) => sum + Number(sentence.signalScore || 0),
      0
    );

    return Math.max(
      0,
      Math.min(1, total / result.sentences.length)
    );
  }, [result]);

  const getScoreLevel = (score: number) => {
    if (score >= 0.75) {
      return {
        label: "HIGH",
        bar: "bg-red-500",
        text: "text-red-400",
        badge: "border-red-500/30 bg-red-500/10",
      };
    }

    if (score >= 0.55) {
      return {
        label: "MEDIUM",
        bar: "bg-orange-500",
        text: "text-orange-400",
        badge: "border-orange-500/30 bg-orange-500/10",
      };
    }

    if (score >= 0.35) {
      return {
        label: "LOW",
        bar: "bg-yellow-400",
        text: "text-yellow-400",
        badge: "border-yellow-500/30 bg-yellow-500/10",
      };
    }

    return {
      label: "NATURAL / UNFLAGGED",
      bar: "bg-indigo-500",
      text: "text-indigo-400",
      badge: "border-indigo-500/30 bg-indigo-500/10",
    };
  };
const tabClass = (tab: AnalysisTab) =>
    `flex items-center gap-3 w-full px-5 py-3.5 text-left border-l-4 transition-all ${
      activeTab === tab
        ? "border-indigo-400 bg-indigo-500/10 text-indigo-300 font-semibold"
        : "border-transparent text-slate-600 dark:text-[#8490a7] hover:bg-slate-100 dark:bg-[#101a2d] hover:text-slate-900 dark:text-[#dce5f5]"
    }`;

  return (
    <div data-theme={theme} className="min-h-[calc(100vh-64px)] bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#050b18] dark:text-[#dce5f5]">

      {/* =====================================================
          TOP HEADER
      ====================================================== */}

      <div className="border-b border-slate-200 dark:border-slate-200 dark:border-[#1c2942] bg-white dark:bg-[#080f20]">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-10 py-5">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-slate-200 dark:bg-[#182b4b] text-white">
                  <span className="material-symbols-outlined text-[20px]">
                    verified
                  </span>
                </span>

                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-[#dce5f5]">
                    VeritasAI Analysis
                  </h1>

                  <p className="text-xs text-slate-500 dark:text-[#6f7d96]">
                    Statistical admissions essay diagnostics
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-[#6f7d96]">
                <span>
                  Document ID:{" "}
                  <strong className="text-slate-700 dark:text-[#b8c3d6]">
                    {result.id}
                  </strong>
                </span>

                <span>•</span>

                <span>
                  {result.wordCount} words
                </span>

                <span>•</span>

                <span>
                  {result.sentenceCount} sentences
                </span>
              </div>
            </div>

            <button
              onClick={onReset}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-slate-200 dark:bg-[#182b4b] text-white text-sm font-semibold hover:bg-slate-300 dark:bg-[#21395f] transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">
                edit
              </span>

              Analyze New Essay
            </button>

          </div>
        </div>
      </div>


      {/* =====================================================
          MAIN LAYOUT
      ====================================================== */}

      <div className="max-w-[1800px] mx-auto flex">

        {/* ===================================================
            SIDEBAR
        ==================================================== */}

        <aside className="hidden lg:flex w-64 shrink-0 min-h-[calc(100vh-145px)] bg-white dark:bg-[#080f20] border-r border-slate-200 dark:border-[#1c2942] flex-col">

          <div className="p-6 border-b border-slate-200 dark:border-[#1c2942]">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-[#5f6d86]">
              Analysis Tools
            </p>

            <h2 className="mt-1 text-sm font-semibold text-slate-900 dark:text-[#dce5f5]">
              Diagnostic Framework
            </h2>
          </div>

          <nav className="py-4">

            <button
              onClick={() => changeTab("overview")}
              className={tabClass("overview")}
            >
              <span className="material-symbols-outlined text-[20px]">
                dashboard
              </span>

              Overview
            </button>

            <button
              onClick={() => changeTab("evidence")}
              className={tabClass("evidence")}
            >
              <span className="material-symbols-outlined text-[20px]">
                policy
              </span>

              Evidence Panel
            </button>

            <button
              onClick={() => changeTab("metrics")}
              className={tabClass("metrics")}
            >
              <span className="material-symbols-outlined text-[20px]">
                analytics
              </span>

              Metrics
            </button>

            <button
              onClick={() => changeTab("ethics")}
              className={tabClass("ethics")}
            >
              <span className="material-symbols-outlined text-[20px]">
                gavel
              </span>

              Ethics Charter
            </button>

          </nav>

          <div className="mt-auto p-4 border-t border-slate-200 dark:border-[#1c2942] bg-slate-50 dark:bg-[#0d1629]">

            <button
              onClick={onReset}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-slate-300 dark:border-[#31405a] bg-white dark:bg-[#080f20] text-slate-900 dark:text-[#dce5f5] text-sm font-semibold hover:bg-slate-50 dark:bg-[#0d1629] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">
                add
              </span>

              New Analysis
            </button>

          </div>

        </aside>


        {/* ===================================================
            CONTENT
        ==================================================== */}

        <main className="flex-1 min-w-0 p-5 lg:p-8">

          {/* MOBILE TABS */}

          <div className="lg:hidden mb-5 grid grid-cols-4 bg-white dark:bg-[#080f20] border border-slate-200 dark:border-[#1c2942] rounded-xl overflow-hidden">

            {[
              ["overview", "Overview"],
              ["evidence", "Evidence"],
              ["metrics", "Metrics"],
              ["ethics", "Ethics"],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() =>
                  setActiveTab(id as AnalysisTab)
                }
                className={`py-3 text-xs font-semibold ${
                  activeTab === id
                    ? "bg-slate-200 dark:bg-[#182b4b] text-white"
                    : "text-slate-600 dark:text-[#8793aa]"
                }`}
              >
                {label}
              </button>
            ))}

          </div>


          {/* =================================================
              OVERVIEW
          ================================================== */}

          {activeTab === "overview" && (
            <div className="space-y-6">

              {/* Overall Statistical Signal */}

              <ScoreSlider
                score={overallScore}
                title="Overall Statistical Signal"
              />

              {/* Summary */}

              <section className="bg-white dark:bg-[#080f20] border border-slate-200 dark:border-[#1c2942] rounded-2xl p-6 shadow-sm">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  <div>
                    <p className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-[#5f6d86]">
                      Diagnostic Overview
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-[#dce5f5] mt-1">
                      {result.title}
                    </h2>

                    <p className="text-sm text-slate-500 dark:text-[#6f7d96] mt-2 max-w-3xl">
                      {result.summaryMessage}
                    </p>
                  </div>

                  <div className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0d1629] border border-slate-200 dark:border-[#1c2942]">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-[#5f6d86] font-bold">
                      Review Priority
                    </p>

                    <p className="text-sm font-bold text-slate-900 dark:text-[#dce5f5] mt-1">
                      {result.reviewPriority.replace(
                        "_",
                        " "
                      )}
                    </p>
                  </div>

                </div>

              </section>


              {/* Distribution */}

              <section className="bg-white dark:bg-[#080f20] border border-slate-200 dark:border-[#1c2942] rounded-2xl p-6 shadow-sm">

                <div className="flex items-center justify-between mb-5">

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-[#dce5f5]">
                      Overall Signal Distribution
                    </h3>

                    <p className="text-sm text-slate-500 dark:text-[#6f7d96] mt-1">
                      Passage-level statistical signals.
                    </p>
                  </div>

                  <span className="material-symbols-outlined text-slate-500 dark:text-[#5f6d86]">
                    tune
                  </span>

                </div>

                <div className="h-5 rounded-full overflow-hidden flex bg-slate-100 dark:bg-[#141f34]">

                  <div
                    className="bg-yellow-400"
                    style={{
                      width: `${result.distribution.lowPct}%`,
                    }}
                  />

                  <div
                    className="bg-orange-400"
                    style={{
                      width: `${result.distribution.mediumPct}%`,
                    }}
                  />

                  <div
                    className="bg-red-500"
                    style={{
                      width: `${result.distribution.highPct}%`,
                    }}
                  />

                  <div
                    className="bg-[#34445e]"
                    style={{
                      width: `${result.distribution.normalPct}%`,
                    }}
                  />

                </div>


                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5">

                  <DistributionCard
                    label="Low Signal"
                    value={result.distribution.lowPct}
                    count={signalCounts.yellow}
                    color="yellow"
                  />

                  <DistributionCard
                    label="Medium Signal"
                    value={result.distribution.mediumPct}
                    count={signalCounts.orange}
                    color="orange"
                  />

                  <DistributionCard
                    label="High Signal"
                    value={result.distribution.highPct}
                    count={signalCounts.red}
                    color="red"
                  />

                  <DistributionCard
                    label="Natural / Unflagged"
                    value={result.distribution.normalPct}
                    count={signalCounts.none}
                    color="slate"
                  />

                </div>

              </section>


              {/* Document */}

              <section className="bg-white dark:bg-[#080f20] border border-slate-200 dark:border-[#1c2942] rounded-2xl shadow-sm overflow-hidden">

                <div className="p-6 border-b border-slate-200 dark:border-[#1c2942]">

                  <h3 className="text-lg font-bold text-slate-900 dark:text-[#dce5f5]">
                    Document Passages
                  </h3>

                  <p className="text-sm text-slate-500 dark:text-[#6f7d96] mt-1">
                    Select a sentence to inspect its diagnostic evidence.
                  </p>

                </div>

                <div className="p-6 space-y-3">

                  {result.sentences.map((sentence) => (
                    <SentenceRow
                      key={sentence.id}
                      sentence={sentence}
                      selected={
                        sentence.id === selectedSentenceId
                      }
                      onClick={() => {
                        setSelectedSentenceId(
                          sentence.id
                        );

                        changeTab("evidence");
                      }}
                    />
                  ))}

                </div>

              </section>

            </div>
          )}


          {/* =================================================
              EVIDENCE
          ================================================== */}

          {activeTab === "evidence" && (
            <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-6">

              {/* Essay */}

              <section className="bg-white dark:bg-[#080f20] border border-slate-200 dark:border-[#1c2942] rounded-2xl shadow-sm overflow-hidden">

                <div className="p-6 border-b border-slate-200 dark:border-[#1c2942]">

                  <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-[#5f6d86] font-bold">
                    Source Document
                  </p>

                  <h2 className="text-2xl font-bold text-slate-900 dark:text-[#dce5f5] mt-1">
                    {result.title}
                  </h2>

                  <p className="text-xs text-slate-500 dark:text-[#6f7d96] mt-2 font-mono">
                    {result.wordCount} words •{" "}
                    {result.sentenceCount} sentences
                  </p>

                </div>

                <div className="p-8 text-[18px] leading-9 font-serif">

                  {result.sentences.map((sentence) => {

                    const selected =
                      sentence.id ===
                      selectedSentenceId;

                    return (
                      <span
                        key={sentence.id}
                        onClick={() =>
                          setSelectedSentenceId(
                            sentence.id
                          )
                        }
                        className={`cursor-pointer rounded px-1 transition-all ${
                          selected
                            ? "bg-indigo-500/15 ring-2 ring-indigo-400/50"
                            : sentence.flagLevel === "red"
                            ? "bg-red-500/15 hover:bg-red-500/25"
                            : sentence.flagLevel === "orange"
                            ? "bg-orange-500/15 hover:bg-orange-500/25"
                            : sentence.flagLevel === "yellow"
                            ? "bg-yellow-500/15 hover:bg-yellow-500/25"
                            : "hover:bg-slate-100 dark:bg-[#141f34]"
                        }`}
                      >
                        {sentence.text}{" "}
                      </span>
                    );
                  })}

                </div>

              </section>


              {/* Evidence */}

              <section className="bg-white dark:bg-[#080f20] border border-slate-200 dark:border-[#1c2942] rounded-2xl shadow-sm overflow-hidden">

                <div className="p-6 border-b border-slate-200 dark:border-[#1c2942] flex items-center justify-between">

                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-[#5f6d86] font-bold">
                      Evidence Panel
                    </p>

                    <h2 className="text-xl font-bold text-slate-900 dark:text-[#dce5f5] mt-1">
                      Sentence Diagnostics
                    </h2>
                  </div>

                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border ${currentBadge.className}`}
                  >
                    {currentBadge.label}
                  </span>

                </div>

                <div className="p-6">

                  {selectedSentence ? (
                    <div className="space-y-5">

                      <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#0d1629] border-l-4 border-[#162b4d]">

                        <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-[#5f6d86] font-bold mb-3">
                          Selected Passage
                        </p>

                        <p className="font-serif italic text-base leading-7 text-slate-700 dark:text-[#cfd8e8]">
                          "{selectedSentence.text}"
                        </p>

                      </div>

                      <ScoreSlider
                        score={selectedSentence.signalScore}
                        title="Sentence-Level Statistical Signal"
                      />


                      <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#0d1629] border border-slate-200 dark:border-[#1c2942]">

                        <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-[#5f6d86] font-bold mb-2">
                          Diagnostic Summary
                        </p>

                        <p className="text-sm leading-6 text-slate-600 dark:text-[#8793aa]">
                          {selectedSentence.summaryExplanation}
                        </p>

                      </div>


                      <div>

                        <div className="flex items-center justify-between mb-3">

                          <h3 className="text-sm font-bold text-slate-900 dark:text-[#dce5f5]">
                            Statistical Signals
                          </h3>

                          <span className="text-xs text-slate-500 dark:text-[#5f6d86]">
                            {selectedSentence.signals.length} signals
                          </span>

                        </div>

                        <div className="space-y-3">

                          {selectedSentence.signals.map(
                            (signal) => {

                              const badge =
                                getSignalBadge(
                                  signal.flagLevel
                                );

                              return (
                                <div
                                  key={signal.id}
                                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-200 dark:border-[#1c2942] bg-white dark:bg-[#080f20] hover:shadow-sm transition-shadow"
                                >

                                  <div className="flex items-start justify-between gap-4">

                                    <div>
                                      <h4 className="font-semibold text-sm text-slate-900 dark:text-[#dce5f5]">
                                        {signal.title}
                                      </h4>

                                      <p className="text-xs text-slate-500 dark:text-[#6f7d96] mt-2 leading-5">
                                        {signal.description}
                                      </p>
                                    </div>

                                    <span
                                      className={`shrink-0 px-2 py-1 rounded-md border text-[10px] font-bold ${badge.className}`}
                                    >
                                      {signal.metricValue}
                                    </span>

                                  </div>

                                </div>
                              );
                            }
                          )}

                        </div>

                      </div>

                    </div>
                  ) : (
                    <div className="py-16 text-center text-slate-500 dark:text-[#6f7d96]">
                      Select a sentence to inspect evidence.
                    </div>
                  )}

                </div>

              </section>

            </div>
          )}


          {/* =================================================
              METRICS
          ================================================== */}

          {activeTab === "metrics" && (
            <div className="space-y-6">

              <section className="bg-white dark:bg-[#080f20] border border-slate-200 dark:border-[#1c2942] rounded-2xl p-6 shadow-sm">

                <h2 className="text-2xl font-bold text-slate-900 dark:text-[#dce5f5]">
                  Analysis Metrics
                </h2>

                <p className="text-sm text-slate-500 dark:text-[#6f7d96] mt-2">
                  Raw document and diagnostic measurements returned by the backend.
                </p>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">

                  <MetricCard
                    label="Word Count"
                    value={result.wordCount}
                    icon="text_fields"
                  />

                  <MetricCard
                    label="Sentences"
                    value={result.sentenceCount}
                    icon="notes"
                  />

                  <MetricCard
                    label="Reading Time"
                    value={`${result.readingTimeMinutes} min`}
                    icon="schedule"
                  />

                  <MetricCard
                    label="Complexity"
                    value={result.analysisComplexity}
                    icon="speed"
                  />

                </div>

              </section>


              <section className="bg-white dark:bg-[#080f20] border border-slate-200 dark:border-[#1c2942] rounded-2xl shadow-sm overflow-hidden">

                <div className="p-6 border-b border-slate-200 dark:border-[#1c2942]">

                  <h3 className="text-lg font-bold text-slate-900 dark:text-[#dce5f5]">
                    Sentence-Level Metrics
                  </h3>

                </div>

                <div className="overflow-x-auto">

                  <table className="w-full text-sm">

                    <thead className="bg-slate-50 dark:bg-[#0d1629] border-b border-slate-200 dark:border-[#1c2942]">

                      <tr>
                        <th className="text-left p-4 font-semibold">
                          Sentence
                        </th>

                        <th className="text-left p-4 font-semibold">
                          Flag
                        </th>

                        <th className="text-left p-4 font-semibold">
                          Score
                        </th>

                        <th className="text-left p-4 font-semibold">
                          Signals
                        </th>
                      </tr>

                    </thead>

                    <tbody>

                      {result.sentences.map(
                        (sentence) => {

                          const badge =
                            getSignalBadge(
                              sentence.flagLevel
                            );

                          return (
                            <tr
                              key={sentence.id}
                              className="border-b border-slate-100 hover:bg-slate-50 dark:bg-[#0d1629] cursor-pointer"
                              onClick={() => {
                                setSelectedSentenceId(
                                  sentence.id
                                );

                                changeTab(
                                  "evidence"
                                );
                              }}
                            >

                              <td className="p-4 max-w-xl">
                                <p className="line-clamp-2">
                                  {sentence.text}
                                </p>
                              </td>

                              <td className="p-4">
                                <span
                                  className={`px-2 py-1 rounded border text-xs font-semibold ${badge.className}`}
                                >
                                  {badge.label}
                                </span>
                              </td>

                              <td className="p-4 font-mono">
                                {Number(
                                  sentence.signalScore
                                ).toFixed(3)}
                              </td>

                              <td className="p-4">
                                {sentence.signals.length}
                              </td>

                            </tr>
                          );
                        }
                      )}

                    </tbody>

                  </table>

                </div>

              </section>

            </div>
          )}


          {/* =================================================
              ETHICS
          ================================================== */}

          {activeTab === "ethics" && (
            <div className="max-w-5xl space-y-6">

              <section className="bg-white dark:bg-[#080f20] border border-slate-200 dark:border-[#1c2942] rounded-2xl p-8 shadow-sm">

                <div className="flex gap-4">

                  <div className="w-12 h-12 shrink-0 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
                    <span className="material-symbols-outlined">
                      gavel
                    </span>
                  </div>

                  <div>

                    <p className="text-xs uppercase tracking-wider font-bold text-red-400">
                      Ethical Use
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-[#dce5f5] mt-1">
                      Diagnostic signals are not proof of authorship
                    </h2>

                    <p className="text-sm leading-7 text-slate-600 dark:text-[#8793aa] mt-4">
                      A statistical signal can indicate that a passage
                      resembles patterns observed in a reference corpus.
                      It cannot establish that a human did or did not use
                      an AI system.
                    </p>

                  </div>

                </div>

              </section>


              <div className="grid md:grid-cols-2 gap-5">

                <EthicsCard
                  icon="warning"
                  title="Human writing can trigger signals"
                  text="Highly structured academic writing, formulaic essays, second-language writing, and short passages may produce similar statistical patterns."
                />

                <EthicsCard
                  icon="person_search"
                  title="Human review is required"
                  text="Diagnostic results should be evaluated alongside writing history, context, prior work, and other relevant evidence."
                />

                <EthicsCard
                  icon="language"
                  title="Language bias matters"
                  text="Differences in language proficiency and educational background can affect statistical measures such as vocabulary predictability and sentence variation."
                />

                <EthicsCard
                  icon="security"
                  title="Use responsibly"
                  text="VeritasAI should support investigation and review, not serve as an automatic disciplinary decision-maker."
                />

              </div>


              <section className="bg-slate-200 dark:bg-[#182b4b] text-white rounded-2xl p-8">

                <p className="text-xs uppercase tracking-wider text-indigo-300 font-bold">
                  VeritasAI Policy
                </p>

                <p className="text-lg leading-8 mt-3">
                  The appropriate interpretation of this system is:
                  <strong> evidence for review, not evidence of guilt.</strong>
                </p>

              </section>

            </div>
          )}

        </main>

      </div>
    </div>
  );
}


/* ============================================================
   SMALL UI COMPONENTS
============================================================ */


function ScoreSlider({
  score,
  title,
}: {
  score: number;
  title: string;
}) {
  const safeScore = Math.max(0, Math.min(1, Number(score) || 0));

  const level =
    safeScore >= 0.75
      ? {
          label: "HIGH",
          bar: "bg-red-500",
          text: "text-red-500 dark:text-red-400",
          badge: "border-red-200 bg-red-50 text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400",
        }
      : safeScore >= 0.55
      ? {
          label: "MEDIUM",
          bar: "bg-orange-500",
          text: "text-orange-500 dark:text-orange-400",
          badge: "border-orange-200 bg-orange-50 text-orange-600 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-400",
        }
      : safeScore >= 0.35
      ? {
          label: "LOW",
          bar: "bg-yellow-400",
          text: "text-yellow-600 dark:text-yellow-400",
          badge: "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-400",
        }
      : {
          label: "NATURAL / UNFLAGGED",
          bar: "bg-indigo-500",
          text: "text-indigo-600 dark:text-indigo-400",
          badge: "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-400",
        };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#1c2942] dark:bg-[#080f20]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-[#5f6d86]">
            {title}
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-[#6f7d96]">
            Higher values indicate stronger configured statistical signals requiring review.
          </p>
        </div>

        <div className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-bold ${level.badge}`}>
          {level.label} · {safeScore.toFixed(3)}
        </div>
      </div>

      <div className="mt-5">
        <div className="relative h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-[#1c2942]">
          <div
            className={`h-full rounded-full transition-all duration-500 ${level.bar}`}
            style={{ width: `${safeScore * 100}%` }}
          />
        </div>

        <div className="mt-2 flex justify-between text-[10px] font-mono text-slate-400 dark:text-[#5f6d86]">
          <span>0.00</span>
          <span>0.35</span>
          <span>0.55</span>
          <span>0.75</span>
          <span>1.00</span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <ScoreMeaning
          color="bg-indigo-500"
          title="Natural / Unflagged"
          range="0.00–0.34"
          text="Few measurable statistical signals requiring review."
        />
        <ScoreMeaning
          color="bg-yellow-400"
          title="Low"
          range="0.35–0.54"
          text="Some statistical signals; low review priority."
        />
        <ScoreMeaning
          color="bg-orange-500"
          title="Medium"
          range="0.55–0.74"
          text="More noticeable signals; human review is useful."
        />
        <ScoreMeaning
          color="bg-red-500"
          title="High"
          range="0.75–1.00"
          text="Stronger signal concentration; careful review required."
        />
      </div>

      <p className="mt-5 text-[11px] leading-5 text-slate-500 dark:text-[#69758d]">
        This is a statistical review score, not an AI-authorship probability.
        A high score does not prove AI use, and a low score does not prove human authorship.
      </p>
    </section>
  );
}




function ScoreMeaning({
  color,
  title,
  range,
  text,
}: {
  color: string;
  title: string;
  range: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-[#1c2942] bg-slate-50 dark:bg-[#0b1428] p-3">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
        <span className="text-xs font-semibold text-slate-900 dark:text-[#dce5f5]">
          {title}
        </span>
      </div>

      <div className="mt-1 font-mono text-[10px] text-slate-500 dark:text-[#74819a]">
        {range}
      </div>

      <p className="mt-2 text-[10px] leading-4 text-slate-500 dark:text-[#69758d]">
        {text}
      </p>
    </div>
  );
}

function DistributionCard({
  label,
  value,
  count,
  color,
}: {
  label: string;
  value: number;
  count: number;
  color: "yellow" | "orange" | "red" | "slate";
}) {
  const styles = {
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-500/10 dark:border-yellow-500/30 dark:text-yellow-400",
    orange: "bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-500/10 dark:border-orange-500/30 dark:text-orange-400",
    red: "bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400",
    slate: "bg-slate-50 dark:bg-[#0d1629] border-slate-200 dark:border-[#1c2942] text-slate-700 dark:text-[#b8c3d6]",
  };

  return (
    <div className={`rounded-xl border p-4 ${styles[color]}`}>

      <p className="text-xs font-bold uppercase tracking-wide">
        {label}
      </p>

      <div className="flex items-end justify-between mt-2">

        <span className="text-2xl font-bold">
          {value}%
        </span>

        <span className="text-xs">
          {count} passages
        </span>

      </div>

    </div>
  );
}


function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: string;
}) {
  return (
    <div className="p-5 rounded-xl border border-slate-200 dark:border-[#1c2942] bg-slate-50 dark:bg-[#0d1629]">

      <span className="material-symbols-outlined text-slate-900 dark:text-[#dce5f5]">
        {icon}
      </span>

      <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-[#5f6d86] font-bold mt-4">
        {label}
      </p>

      <p className="text-2xl font-bold text-slate-900 dark:text-[#dce5f5] mt-1">
        {value}
      </p>

    </div>
  );
}


function SentenceRow({
  sentence,
  selected,
  onClick,
}: {
  sentence: SentenceAnalysis;
  selected: boolean;
  onClick: () => void;
}) {
  const color =
    sentence.flagLevel === "red"
      ? "border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10"
      : sentence.flagLevel === "orange"
      ? "border-orange-200 bg-orange-50 dark:border-orange-500/30 dark:bg-orange-500/10"
      : sentence.flagLevel === "yellow"
      ? "border-yellow-200 bg-yellow-50 dark:border-yellow-500/30 dark:bg-yellow-500/10"
      : "border-slate-200 dark:border-slate-200 dark:border-[#1c2942] bg-white dark:bg-[#080f20]";

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all hover:shadow-sm ${color} ${
        selected
          ? "ring-2 ring-[#162b4d]/20"
          : ""
      }`}
    >

      <div className="flex items-start gap-4">

        <span className="shrink-0 w-8 h-8 rounded-lg bg-white dark:bg-[#080f20] border border-slate-200 dark:border-[#1c2942] flex items-center justify-center text-xs font-bold text-slate-500 dark:text-[#6f7d96]">
          {sentence.index + 1}
        </span>

        <div className="min-w-0 flex-1">

          <p className="text-sm leading-6 text-slate-700 dark:text-[#b8c3d6]">
            {sentence.text}
          </p>

          <div className="flex flex-wrap gap-2 mt-3">

            <span className="text-xs font-mono text-slate-500 dark:text-[#6f7d96]">
              Score:{" "}
              {Number(
                sentence.signalScore
              ).toFixed(3)}
            </span>

            <span className="text-xs text-slate-500 dark:text-[#5f6d86]">
              •
            </span>

            <span className="text-xs text-slate-500 dark:text-[#6f7d96]">
              {sentence.signals.length} signals
            </span>

          </div>

        </div>

        <span className="material-symbols-outlined text-slate-500 dark:text-[#5f6d86]">
          chevron_right
        </span>

      </div>

    </button>
  );
}


function EthicsCard({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-white dark:bg-[#080f20] border border-slate-200 dark:border-[#1c2942] rounded-2xl p-6 shadow-sm">

      <span className="material-symbols-outlined text-slate-900 dark:text-[#dce5f5]">
        {icon}
      </span>

      <h3 className="font-bold text-slate-900 dark:text-[#dce5f5] mt-4">
        {title}
      </h3>

      <p className="text-sm text-slate-600 dark:text-[#8793aa] leading-6 mt-2">
        {text}
      </p>

    </div>
  );
}