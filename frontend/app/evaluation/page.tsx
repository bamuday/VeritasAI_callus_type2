import { EvaluationView } from "@/components/EvaluationView";
import { AppShell } from "@/components/AppShell";

export const metadata = {
  title: "Evaluation Metrics & Confident Failures - VeritasAI",
  description: "Test set performance metrics and post-mortems of three essays we got confidently wrong.",
};

export default function EvaluationPage() {
  return (
    <AppShell activeTab="evaluation">
      <EvaluationView />
    </AppShell>
  );
}
