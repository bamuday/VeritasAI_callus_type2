import { DatasetView } from "@/components/DatasetView";
import { AppShell } from "@/components/AppShell";

export const metadata = {
  title: "Dataset - VeritasAI",
  description: "Dataset and benchmark information for VeritasAI.",
};

export default function DatasetPage() {
  return (
    <AppShell activeTab="dataset">
      <DatasetView />
    </AppShell>
  );
}
