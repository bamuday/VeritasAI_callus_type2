import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VeritasAI",
  description: "Statistical admissions essay diagnostics",
};

const themeScript = `
(function () {
  try {
    var saved = localStorage.getItem("veritas-theme");
    var theme = saved === "light" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.dataset.theme = theme;
  } catch (_) {
    document.documentElement.classList.add("dark");
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-background text-on-surface antialiased">
        {children}
      </body>
    </html>
  );
}
