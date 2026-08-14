import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-outline-variant bg-surface px-4 py-8 text-on-surface sm:px-6">
      <div className="mx-auto flex max-w-container-max flex-col items-center justify-between gap-5 md:flex-row">
        <Link href="/" className="text-xl font-bold text-primary transition-opacity hover:opacity-80">
          VeritasAI
        </Link>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-semibold uppercase tracking-wider">
          <Link href="/limitations" className="text-on-surface-variant transition-colors hover:text-primary">Privacy Policy</Link>
          <Link href="/limitations" className="text-on-surface-variant transition-colors hover:text-primary">Terms of Service</Link>
          <Link href="/limitations" className="text-on-surface-variant transition-colors hover:text-primary">Ethical AI Charter</Link>
          <Link href="/evaluation" className="text-on-surface-variant transition-colors hover:text-primary">Evaluation &amp; Post-Mortems</Link>
        </div>

        <div className="text-center text-xs text-on-surface-variant md:text-right">
          © 2024 VeritasAI Admissions Research Lab. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
