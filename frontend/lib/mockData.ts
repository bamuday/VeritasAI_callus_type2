import { AnalysisResult } from './types';

export const DEMO_RESULT_STITCH: AnalysisResult = {
  id: 'ADM-2024-892',
  title: 'The Intersection of Narrative and Technology',
  processedAt: 'Oct 24, 2024',
  rawText: `The evolution of modern storytelling is intrinsically linked to the platforms that host it. Historically, narrative structures relied on linear progression, carefully designed to guide the audience from an established beginning to a definitive conclusion. However, the digital landscape has fractured this linearity.

Furthermore, it is imperative to consider that the multifaceted dimensions of interactive media facilitate a paradigm shift in user engagement strategies, thereby necessitating a comprehensive reevaluation of traditional pedagogical frameworks. This complexity allows users to become co-creators of the narrative experience.

The resulting tapestry of interconnected storylines provides a rich environment for exploration, though it simultaneously risks alienating participants who prefer a more curated journey. Balancing these competing needs remains a central challenge for contemporary designers.

Ultimately, the successful synthesis of these elements depends on a nuanced understanding of audience psychology. Designers must anticipate diverse pathways while maintaining thematic coherence across all potential interactions. Only then can the true potential of interactive narrative be realized.`,
  wordCount: 154,
  sentenceCount: 9,
  readingTimeMinutes: 1,
  analysisComplexity: 'Standard',
  reviewPriority: 'HIGH_ATTENTION',
  distribution: {
    lowPct: 22,
    mediumPct: 11,
    highPct: 11,
    normalPct: 56,
  },
  summaryMessage: 'Diagnostic signals indicate localized passages with significant structural uniformity and formulaic transitional tropes.',
  sentences: [
    {
      id: 's0',
      index: 0,
      paragraphIndex: 0,
      text: 'The evolution of modern storytelling is intrinsically linked to the platforms that host it.',
      flagLevel: 'none',
      signalScore: 0.12,
      signals: [
        {
          id: 'sig-0-1',
          category: 'smoothness',
          title: 'Vocabulary Complexity (Perplexity)',
          metricValue: 'Normal / Natural',
          flagLevel: 'none',
          description: 'Word transitions exhibit natural human distribution variance.',
        },
      ],
      summaryExplanation: 'Standard human opening sentence structure with organic phrase choices.',
    },
    {
      id: 's1',
      index: 1,
      paragraphIndex: 0,
      text: 'Historically, narrative structures relied on linear progression, carefully designed to guide the audience from an established beginning to a definitive conclusion.',
      flagLevel: 'yellow',
      signalScore: 0.42,
      signals: [
        {
          id: 'sig-1-1',
          category: 'smoothness',
          title: 'Vocabulary Complexity (Perplexity)',
          metricValue: 'Slightly Predictable',
          flagLevel: 'yellow',
          description: 'Contains minor textbook-style collocations ("linear progression", "definitive conclusion").',
        },
        {
          id: 'sig-1-2',
          category: 'burstiness',
          title: 'Sentence Rhythm (Burstiness)',
          metricValue: 'Moderate Variance',
          flagLevel: 'none',
          description: 'Clause structure shows mild symmetry with typical academic writing standards.',
        },
      ],
      summaryExplanation: 'Elevated formal phrasing commonly seen in both polished academic writing and curated reference corpora.',
    },
    {
      id: 's2',
      index: 2,
      paragraphIndex: 0,
      text: 'However, the digital landscape has fractured this linearity.',
      flagLevel: 'none',
      signalScore: 0.08,
      signals: [
        {
          id: 'sig-2-1',
          category: 'burstiness',
          title: 'Sentence Rhythm (Burstiness)',
          metricValue: 'High Variance (Short Burst)',
          flagLevel: 'none',
          description: 'Short 8-word sentence breaks the rhythm naturally, characteristic of human authorship.',
        },
      ],
      summaryExplanation: 'Short punchy sentence breaking structural uniformity.',
    },
    {
      id: 's3',
      index: 3,
      paragraphIndex: 1,
      text: 'Furthermore, it is imperative to consider that the multifaceted dimensions of interactive media facilitate a paradigm shift in user engagement strategies, thereby necessitating a comprehensive reevaluation of traditional pedagogical frameworks.',
      flagLevel: 'red',
      signalScore: 0.94,
      signals: [
        {
          id: 'sig-3-1',
          category: 'smoothness',
          title: 'Vocabulary Complexity (Perplexity)',
          metricValue: 'Unusually Low',
          flagLevel: 'red',
          description: 'The sequence of words is highly predictable given large language model training corpora, indicating a lack of unique lexical variation.',
        },
        {
          id: 'sig-3-2',
          category: 'burstiness',
          title: 'Sentence Rhythm (Burstiness)',
          metricValue: 'Static',
          flagLevel: 'red',
          description: 'Variance in sentence length and structural complexity is minimal compared to surrounding human-authored text.',
        },
        {
          id: 'sig-3-3',
          category: 'tropes',
          title: 'Transitional Tropes',
          metricValue: 'Detected',
          flagLevel: 'orange',
          description: 'Usage of formulaic academic bridging phrases ("Furthermore, it is imperative to consider...").',
        },
      ],
      summaryExplanation: 'High concentration of statistical predictability and low structural variance. Strong candidate for human-assisted or machine-polished text.',
    },
    {
      id: 's4',
      index: 4,
      paragraphIndex: 1,
      text: 'This complexity allows users to become co-creators of the narrative experience.',
      flagLevel: 'none',
      signalScore: 0.15,
      signals: [
        {
          id: 'sig-4-1',
          category: 'smoothness',
          title: 'Vocabulary Complexity (Perplexity)',
          metricValue: 'Natural',
          flagLevel: 'none',
          description: 'Concise thesis elaboration with standard vocabulary distribution.',
        },
      ],
      summaryExplanation: 'Direct active sentence with clear subject focus.',
    },
    {
      id: 's5',
      index: 5,
      paragraphIndex: 2,
      text: 'The resulting tapestry of interconnected storylines provides a rich environment for exploration, though it simultaneously risks alienating participants who prefer a more curated journey.',
      flagLevel: 'orange',
      signalScore: 0.68,
      signals: [
        {
          id: 'sig-5-1',
          category: 'tropes',
          title: 'Transitional Tropes',
          metricValue: 'Cliché Metaphor Detected',
          flagLevel: 'orange',
          description: 'The phrase "tapestry of interconnected..." is a documented high-frequency trope in LLM-generated essays.',
        },
        {
          id: 'sig-5-2',
          category: 'smoothness',
          title: 'Vocabulary Complexity (Perplexity)',
          metricValue: 'Moderate Predictability',
          flagLevel: 'yellow',
          description: 'Word transitions align with common synthetic essay templates.',
        },
      ],
      summaryExplanation: 'Contains characteristic LLM stylistic markers ("tapestry of") alongside balanced clause balancing.',
    },
    {
      id: 's6',
      index: 6,
      paragraphIndex: 2,
      text: 'Balancing these competing needs remains a central challenge for contemporary designers.',
      flagLevel: 'none',
      signalScore: 0.22,
      signals: [
        {
          id: 'sig-6-1',
          category: 'burstiness',
          title: 'Sentence Rhythm (Burstiness)',
          metricValue: 'Natural Transition',
          flagLevel: 'none',
          description: 'Active verb construction with organic phrasing.',
        },
      ],
      summaryExplanation: 'Natural transitional summary sentence.',
    },
    {
      id: 's7',
      index: 7,
      paragraphIndex: 3,
      text: 'Ultimately, the successful synthesis of these elements depends on a nuanced understanding of audience psychology.',
      flagLevel: 'none',
      signalScore: 0.31,
      signals: [
        {
          id: 'sig-7-1',
          category: 'smoothness',
          title: 'Vocabulary Complexity (Perplexity)',
          metricValue: 'Standard Academic',
          flagLevel: 'none',
          description: 'Standard vocabulary for admissions context.',
        },
      ],
      summaryExplanation: 'Standard concluding reflection.',
    },
    {
      id: 's8',
      index: 8,
      paragraphIndex: 3,
      text: 'Designers must anticipate diverse pathways while maintaining thematic coherence across all potential interactions.',
      flagLevel: 'yellow',
      signalScore: 0.51,
      signals: [
        {
          id: 'sig-8-1',
          category: 'burstiness',
          title: 'Sentence Rhythm (Burstiness)',
          metricValue: 'Low Structural Variance',
          flagLevel: 'yellow',
          description: 'Sentence length matches preceding sentences, creating minor cadence uniformity.',
        },
      ],
      summaryExplanation: 'Designers must anticipate diverse pathways while maintaining thematic coherence.',
    },
  ],
};

export const SAMPLE_ESL_ESSAY_TEXT = `When I first moved to the United States for high school, language was my biggest barrier. Firstly, I could not understand the fast speaking of my classmates. Secondly, I struggled with writing essays in English class because my native language grammar is very different. In conclusion, hard work and dedication allowed me to overcome these difficulties.

Furthermore, it is important to state that learning in a foreign environment requires strong determination. I spent three hours every night reading books with a dictionary. Consequently, my vocabulary expanded significantly over two years.`;

export const SAMPLE_HUMAN_ESSAY_TEXT = `At 2:14 AM on a crisp Tuesday, my computer terminal froze. 4,000 lines of Python code, built over three sleepless weeks of astrophysics research, had just threw a Segmentation Fault. My room smelled of cold instant ramen and stale Earl Grey tea.

Instead of panicking, I grinned. This bug meant my N-body gravity simulation was finally pushing past memory boundaries I hadn't accounted for. Physics doesn't care about your sleep schedule, and that's precisely why I love it.`;

export const SAMPLE_ADMISSIONS_ESSAY_MIXED = DEMO_RESULT_STITCH;
