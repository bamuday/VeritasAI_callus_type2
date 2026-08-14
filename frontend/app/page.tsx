"use client";

import { AnalysisResultsView } from "@/components/AnalysisResultsView";
import { DatasetView } from "@/components/DatasetView";
import { EssayInputView } from "@/components/EssayInputView";
import { EvaluationView } from "@/components/EvaluationView";
import { Footer } from "@/components/Footer";
import { LimitationsView } from "@/components/LimitationsView";
import { LoadingStateView } from "@/components/LoadingStateView";
import { LoginPage } from "@/components/LoginPage";
import { MethodologyView } from "@/components/MethodologyView";
import { Navbar } from "@/components/Navbar";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { analyzeEssay } from "@/lib/analysisService";
import type { AuthUser } from "@/lib/authService";
import { logout as apiLogout, getCurrentUser } from "@/lib/authService";
import { deleteEssay, getEssay, listEssays, type EssayDetail, type EssaySummary } from "@/lib/essayService";
import type { AnalysisResult } from "@/lib/types";

import {
  BarChart2,
  FileText,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Trash2,
} from "lucide-react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("analyzer");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeTool, setActiveTool] = useState("overview");
  const [essays, setEssays] = useState<EssaySummary[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /*
   * ---------------------------------------------------------
   * THEME INITIALIZATION
   * ---------------------------------------------------------
   */

  useEffect(() => {
    let mounted = true;
    getCurrentUser()
      .then((user) => {
        if (!mounted) return;
        setCurrentUser(user);
        setIsLoggedIn(Boolean(user));
        setAuthChecking(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setAuthError(err instanceof Error ? err.message : "Unable to verify your session.");
        setAuthChecking(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem("veritas-theme");

    const next: "light" | "dark" = saved === "light" ? "light" : "dark";

    setTheme(next);

    document.documentElement.classList.toggle("dark", next === "dark");

    document.documentElement.dataset.theme = next;
  }, []);

  /*
   * ---------------------------------------------------------
   * THEME UPDATE
   * ---------------------------------------------------------
   */

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");

    document.documentElement.dataset.theme = theme;

    window.localStorage.setItem("veritas-theme", theme);
  }, [theme]);

  const loadEssays = async () => {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      setEssays(await listEssays());
    } catch (err) {
      setHistoryError(err instanceof Error ? err.message : "Unable to load your essays.");
    } finally {
      setHistoryLoading(false);
    }
  };

  const openEssay = async (id: number) => {
    try {
      const essay: EssayDetail = await getEssay(id);
      setAnalysisResult(essay.latest_analysis);
      setActiveTab("analyzer");
      setActiveTool("overview");
    } catch (err) {
      setHistoryError(err instanceof Error ? err.message : "Unable to load the selected essay.");
    }
  };

  const handleDeleteEssay = async (essay: EssaySummary) => {
    const confirmed = window.confirm(
      `Delete “${essay.title}”? This will permanently delete the essay and its saved analysis.`,
    );
    if (!confirmed) return;

    try {
      setHistoryError(null);
      await deleteEssay(essay.id);
      setEssays((current) => current.filter((item) => item.id !== essay.id));
    } catch (err) {
      setHistoryError(err instanceof Error ? err.message : "Unable to delete the essay.");
    }
  };

  useEffect(() => {
    if (isLoggedIn && activeTab === "history") {
      void loadEssays();
    }
  }, [activeTab, isLoggedIn]);

  /*
   * ---------------------------------------------------------
   * ANALYZE ESSAY
   * ---------------------------------------------------------
   */

  const handleAnalyze = async (text: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeEssay(text);

      setAnalysisResult(result);
      setActiveTab("analyzer");
      setActiveTool("overview");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during analysis.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * NEW ANALYSIS
   * ---------------------------------------------------------
   */

  const handleReset = () => {
    setAnalysisResult(null);
    setError(null);
    setActiveTab("analyzer");
    setActiveTool("overview");
  };

  /*
   * ---------------------------------------------------------
   * LOGOUT
   *
   * No /logout route is used.
   * This directly returns the application to LoginPage.
   * ---------------------------------------------------------
   */

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to log out.");
      return;
    }
    setIsLoggedIn(false);
    setCurrentUser(null);
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
    setActiveTab("analyzer");
    setActiveTool("overview");
  };

  /*
   * ---------------------------------------------------------
   * LOGIN SCREEN
   * ---------------------------------------------------------
   */

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">
        <div className="text-sm text-on-surface-variant">Checking your session…</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <LoginPage
        errorMessage={authError}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsLoggedIn(true);
          setAuthError(null);
        }}
      />
    );
  }

  /*
   * ---------------------------------------------------------
   * ANALYSIS TOOLS
   * ---------------------------------------------------------
   */

  const analysisTools = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      id: "evidence",
      label: "Evidence Panel",
      icon: FileText,
    },
    {
      id: "metrics",
      label: "Metrics",
      icon: BarChart2,
    },
    {
      id: "ethics",
      label: "Ethics Charter",
      icon: ShieldCheck,
    },
  ];

  /*
   * ---------------------------------------------------------
   * MAIN APPLICATION
   * ---------------------------------------------------------
   */

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-on-surface transition-colors duration-300">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Top actions */}
      <div className="flex justify-end items-center gap-3 px-4 pt-4">
        {currentUser && (
          <div className="text-right">
            <div className="text-sm font-medium text-on-surface">{currentUser.name ?? currentUser.email}</div>
            <div className="text-xs text-on-surface-variant">{currentUser.email}</div>
          </div>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-500/30"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>

      <main className="container mx-auto flex-grow px-4 py-8">
        <AnimatePresence mode="wait">
          {/* -------------------------------------------------
              HISTORY
             ------------------------------------------------- */}

          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mx-auto max-w-5xl"
            >
              <div className="mb-6">
                <h1 className="text-2xl font-bold">My Essays</h1>
                <p className="mt-1 text-sm text-on-surface-variant">Saved submissions and their latest analysis results.</p>
              </div>

              {historyLoading ? (
                <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 text-sm text-on-surface-variant">Loading your essays…</div>
              ) : historyError ? (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-300">{historyError}</div>
              ) : essays.length === 0 ? (
                <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 text-center text-sm text-on-surface-variant">No saved essays yet. Analyze an essay and it will appear here.</div>
              ) : (
                <div className="space-y-3">
                  {essays.map((essay) => (
                    <div
                      key={essay.id}
                      className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 transition hover:border-indigo-500/40 hover:bg-surface-container"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={() => void openEssay(essay.id)}
                          className="min-w-0 flex-1 text-left"
                        >
                          <div className="font-semibold text-on-surface">{essay.title}</div>
                          <div className="mt-1 text-xs text-on-surface-variant">{essay.word_count} words · {new Date(essay.created_at).toLocaleString()}</div>
                        </button>

                        <div className="flex items-center gap-4">
                          <div className="hidden text-xs text-on-surface-variant sm:block">{essay.analysis_count} analysis{essay.analysis_count === 1 ? "" : "es"}</div>
                          <button
                            type="button"
                            onClick={() => void handleDeleteEssay(essay)}
                            aria-label={`Delete ${essay.title}`}
                            title="Delete essay"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/30 text-red-400 transition hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-on-surface-variant sm:hidden">{essay.analysis_count} analysis{essay.analysis_count === 1 ? "" : "es"}</div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* -------------------------------------------------
              ANALYZER
             ------------------------------------------------- */}

          {activeTab === "analyzer" && (
            <motion.div
              key="analyzer"
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              transition={{
                duration: 0.2,
              }}
            >
              {isLoading ? (
                <LoadingStateView />
              ) : analysisResult ? (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                  {/* Analysis Tools Sidebar */}
                  <div className="h-fit space-y-1 rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm">
                    <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      Analysis Tools
                    </div>

                    <div className="px-3 pb-2 text-[10px] text-on-surface-variant">
                      DIAGNOSTIC FRAMEWORK
                    </div>

                    {analysisTools.map((tool) => {
                      const Icon = tool.icon;

                      const isActive = activeTool === tool.id;

                      return (
                        <button
                          key={tool.id}
                          type="button"
                          onClick={() => setActiveTool(tool.id)}
                          className={`relative flex w-full items-center space-x-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                            isActive
                              ? "text-indigo-400"
                              : "text-on-surface-variant hover:text-on-surface"
                          }`}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="activeAnalysisTool"
                              className="absolute inset-0 rounded-xl border border-indigo-500/30 bg-indigo-600/10"
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 30,
                              }}
                            />
                          )}

                          <Icon className="relative z-10 h-4 w-4" />

                          <span className="relative z-10">{tool.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Analysis Content */}
                  <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTool}
                        initial={{
                          opacity: 0,
                          scale: 0.98,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.98,
                        }}
                        transition={{
                          duration: 0.15,
                        }}
                      >
                        <AnalysisResultsView
                          result={analysisResult}
                          activeTool={activeTool}
                          theme={theme}
                          onReset={handleReset}
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <EssayInputView onAnalyze={handleAnalyze} error={error} />
              )}
            </motion.div>
          )}

          {/* -------------------------------------------------
              DATASET
             ------------------------------------------------- */}

          {activeTab === "dataset" && (
            <motion.div
              key="dataset"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
            >
              <DatasetView />
            </motion.div>
          )}

          {/* -------------------------------------------------
              EVALUATION
             ------------------------------------------------- */}

          {activeTab === "evaluation" && (
            <motion.div
              key="evaluation"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
            >
              <EvaluationView />
            </motion.div>
          )}

          {/* -------------------------------------------------
              METHODOLOGY
             ------------------------------------------------- */}

          {activeTab === "methodology" && (
            <motion.div
              key="methodology"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
            >
              <MethodologyView />
            </motion.div>
          )}

          {/* -------------------------------------------------
              LIMITATIONS
             ------------------------------------------------- */}

          {activeTab === "limitations" && (
            <motion.div
              key="limitations"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
            >
              <LimitationsView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}