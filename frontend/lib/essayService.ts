const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

export interface EssaySummary {
  id: number;
  title: string;
  word_count: number;
  created_at: string;
  updated_at: string;
  analysis_count: number;
}

export interface EssayDetail extends EssaySummary {
  content: string;
  latest_analysis: import('./types').AnalysisResult | null;
}

export async function listEssays(): Promise<EssaySummary[]> {
  const response = await fetch(`${apiBaseUrl}/api/essays`, {
    credentials: 'include',
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Unable to load your essays.');
  }

  return response.json() as Promise<EssaySummary[]>;
}

export async function getEssay(id: number): Promise<EssayDetail> {
  const response = await fetch(`${apiBaseUrl}/api/essays/${id}`, {
    credentials: 'include',
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Unable to load the selected essay.');
  }

  return response.json() as Promise<EssayDetail>;
}

export async function deleteEssay(id: number): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/api/essays/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { detail?: string } | null;
    throw new Error(payload?.detail ?? 'Unable to delete the essay.');
  }
}
