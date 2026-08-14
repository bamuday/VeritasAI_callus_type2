'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoginPage } from '@/components/LoginPage';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { EssayInputView } from '@/components/EssayInputView';
import { AnalysisResultsView } from '@/components/AnalysisResultsView';
import { DatasetView } from '@/components/DatasetView';
import { EvaluationView } from '@/components/EvaluationView';
import { MethodologyView } from '@/components/MethodologyView';
import { LimitationsView } from '@/components/LimitationsView';
import { LoadingStateView } from '@/components/LoadingStateView';

import { analyzeEssay } from '@/lib/analysisService';
import { AnalysisResult } from '@/lib/types';
import { LayoutDashboard, FileText, BarChart2, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('analyzer');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Sub-tool state inside Analysis Results (Overview, Evidence Panel, Metrics, Ethics Charter)
  const [activeTool, setActiveTool] = useState<string>('evidence');

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { const saved = window.localStorage.getItem('veritas-theme'); const next: 'light' | 'dark' = saved === 'light' ? 'light' : 'dark'; setTheme(next); document.documentElement.classList.toggle('dark', next === 'dark'); document.documentElement.dataset.theme = next; }, []);
  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark'); document.documentElement.dataset.theme = theme; window.localStorage.setItem('veritas-theme', theme); }, [theme]);

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  const handleAnalyze = async (text: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeEssay(text);
      setAnalysisResult(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred during analysis.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setError(null);
  };

  const isDark = theme === 'dark';

  const analysisTools = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'evidence', label: 'Evidence Panel', icon: FileText },
    { id: 'metrics', label: 'Metrics', icon: BarChart2 },
    { id: 'ethics', label: 'Ethics Charter', icon: ShieldCheck },
  ];


  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-on-surface transition-colors duration-300">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
      />

      <main className="container mx-auto px-4 py-8 flex-grow">
        <AnimatePresence mode="wait">
          {activeTab === 'analyzer' && (
            <motion.div
              key="analyzer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {isLoading ? (
                <LoadingStateView />
              ) : analysisResult ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Sidebar Diagnostic Framework with Animated Active Pill */}
                  <div className={`p-4 rounded-2xl border h-fit space-y-1 ${
                    'bg-surface-container-lowest border-outline-variant shadow-sm'
                  }`}>
                    <div className="text-xs font-semibold uppercase tracking-wider px-3 py-2 text-on-surface-variant">
                      Analysis Tools
                    </div>
                    <div className="text-[10px] text-on-surface-variant px-3 pb-2">DIAGNOSTIC FRAMEWORK</div>

                    {analysisTools.map((tool) => {
                      const Icon = tool.icon;
                      const isActive = activeTool === tool.id;
                      return (
                        <button
                          key={tool.id}
                          onClick={() => setActiveTool(tool.id)}
                          className={`w-full relative flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                            isActive
                              ? 'text-indigo-400'
                              : 'text-on-surface-variant hover:text-on-surface'
                          }`}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="activeAnalysisTool"
                              className={`absolute inset-0 rounded-xl ${
                                isDark ? 'bg-indigo-600/10 border border-indigo-500/30' : 'bg-indigo-50 border border-indigo-200'
                              }`}
                              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                          )}
                          <Icon className="w-4 h-4 relative z-10" />
                          <span className="relative z-10">{tool.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Main Tool Content Display with Smooth Entry Animation */}
                  <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTool}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                      >
                        <AnalysisResultsView result={analysisResult} onReset={handleReset} />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <EssayInputView onAnalyze={handleAnalyze} error={error} />
              )}
            </motion.div>
          )}

          {activeTab === 'dataset' && (
            <motion.div key="dataset" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DatasetView />
            </motion.div>
          )}

          {activeTab === 'evaluation' && (
            <motion.div key="evaluation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EvaluationView />
            </motion.div>
          )}

          {activeTab === 'methodology' && (
            <motion.div key="methodology" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <MethodologyView />
            </motion.div>
          )}

          {activeTab === 'limitations' && (
            <motion.div key="limitations" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LimitationsView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}