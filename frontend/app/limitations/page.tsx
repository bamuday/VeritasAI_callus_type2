import { LimitationsView } from "@/components/LimitationsView";
import { AppShell } from "@/components/AppShell";

export const metadata = {
  title: "Limitations & Ethical AI Charter - VeritasAI",
  description: "Limitations and responsible-use guidance for VeritasAI.",
};

export default function LimitationsPage() {
  return (
    <AppShell activeTab="limitations">
      <LimitationsView />
    </AppShell>
  );
}
