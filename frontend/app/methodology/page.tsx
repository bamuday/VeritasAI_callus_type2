import { MethodologyView } from "@/components/MethodologyView";
import { AppShell } from "@/components/AppShell";

export const metadata = {
  title: "Methodology - VeritasAI",
  description: "VeritasAI statistical analysis methodology.",
};

export default function MethodologyPage() {
  return (
    <AppShell activeTab="methodology">
      <MethodologyView />
    </AppShell>
  );
}
