'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check local storage or document class on load
    const isDarkMode = document.documentElement.classList.contains('dark') ||
      localStorage.getItem('theme') === 'dark';

    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextState = !isDark;
    setIsDark(nextState);

    if (nextState) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="z-50 flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 rounded-full border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
    >
      {isDark ? (
        <>
          <span className="text-amber-400 text-sm">☀️</span>
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <span className="text-indigo-400 text-sm">🌙</span>
          <span>Dark Mode</span>
        </>
      )}
    </button>
  );
}
