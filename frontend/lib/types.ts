export type FlagLevel = 'none' | 'yellow' | 'orange' | 'red';

export type ReviewPriority = 'LOW' | 'MODERATE' | 'HIGH_ATTENTION';

export interface PassageSignal {
  id: string;
  category: 'smoothness' | 'burstiness' | 'tropes' | 'predictability' | 'reference_comparison';
  title: string;
  metricValue: string;
  flagLevel: FlagLevel;
  description: string;
}

export interface SentenceAnalysis {
  id: string;
  index: number;
  paragraphIndex: number;
  text: string;
  flagLevel: FlagLevel;
  signalScore: number; // 0.0 to 1.0
  passageCategory?: string;
  signals: PassageSignal[];
  summaryExplanation: string;
}

export interface SignalDistribution {
  lowPct: number; // Yellow (15% in demo)
  mediumPct: number; // Orange (35% in demo)
  highPct: number; // Red (50% in demo)
  normalPct: number; // Green / Unflagged
}

export interface AnalysisResult {
  id: string;
  title: string;
  processedAt: string;
  rawText: string;
  wordCount: number;
  sentenceCount: number;
  readingTimeMinutes: number;
  analysisComplexity: 'Low' | 'Standard' | 'High';
  reviewPriority: ReviewPriority;
  distribution: SignalDistribution;
  sentences: SentenceAnalysis[];
  summaryMessage: string;
}

export interface PipelineProgressState {
  step: number;
  totalSteps: number;
  label: string;
  detail: string;
  isComplete: boolean;
}
