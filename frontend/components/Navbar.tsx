'use client';

import { Moon, Sun, Plus } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  onNewAnalyzer?: () => void;
}

export function Navbar({
  activeTab,
  setActiveTab,
  theme,
  setTheme,
  onNewAnalyzer,
}: NavbarProps) {
  const tabs = [
    { id: 'analyzer', label: 'Analyzer' },
    { id: 'history', label: 'My Essays' },
    { id: 'dataset', label: 'Dataset' },
    { id: 'evaluation', label: 'Evaluation' },
    { id: 'methodology', label: 'Methodology' },
    { id: 'limitations', label: 'Limitations' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-outline-variant bg-surface-container/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <button
          type="button"
          onClick={() => setActiveTab('analyzer')}
          className="text-lg font-semibold text-indigo-400 transition hover:text-indigo-300"
          aria-label="Go to VeritasAI home"
        >
          VeritasAI
        </button>

        <nav className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-3 py-2 text-sm transition ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              {tab.label}
            </button>
          ))}

          {onNewAnalyzer && (
            <button
              type="button"
              onClick={onNewAnalyzer}
              className="ml-2 flex items-center gap-2 rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-600"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden md:inline">New Analyzer</span>
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              setTheme(theme === 'dark' ? 'light' : 'dark')
            }
            className="ml-1 rounded-lg border border-outline-variant p-2 text-on-surface-variant transition hover:text-on-surface"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
