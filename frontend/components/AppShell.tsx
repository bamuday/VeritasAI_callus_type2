"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface AppShellProps {
  activeTab: "analyzer" | "dataset" | "evaluation" | "methodology" | "limitations";
  children: React.ReactNode;
}

export function AppShell({ activeTab, children }: AppShellProps) {
  const router = useRouter();
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = window.localStorage.getItem("veritas-theme");
    const next = saved === "light" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    document.documentElement.dataset.theme = next;
  }, []);

  const handleTheme = (next: "dark" | "light") => {
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("veritas-theme", next);
  };

  const handleTab = (tab: string) => {
    if (tab === "analyzer") {
      router.push("/");
      return;
    }
    router.push(`/${tab}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface transition-colors duration-300">
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTab}
        theme={theme}
        setTheme={handleTheme}
        onNewAnalyzer={() => router.push("/")}
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
