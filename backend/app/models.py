from pydantic import BaseModel, Field
from typing import Literal


FlagLevel = Literal[
    "none",
    "yellow",
    "orange",
    "red",
]


class PassageSignal(BaseModel):
    id: str
    category: str
    title: str
    metricValue: str
    flagLevel: FlagLevel
    description: str


class SentenceAnalysis(BaseModel):
    id: str
    index: int
    paragraphIndex: int
    text: str
    flagLevel: FlagLevel
    signalScore: float = Field(
        ge=0.0,
        le=1.0,
    )
    passageCategory: str
    signals: list[PassageSignal]
    summaryExplanation: str


class SignalDistribution(BaseModel):
    lowPct: int = Field(
        ge=0,
        le=100,
    )
    mediumPct: int = Field(
        ge=0,
        le=100,
    )
    highPct: int = Field(
        ge=0,
        le=100,
    )
    normalPct: int = Field(
        ge=0,
        le=100,
    )


class AnalyzeRequest(BaseModel):
    essay: str = Field(
        min_length=1,
    )
    model_id: str = "custom"


class AnalysisResult(BaseModel):
    id: str
    title: str
    processedAt: str
    rawText: str

    wordCount: int
    sentenceCount: int
    readingTimeMinutes: int
    analysisComplexity: str
    reviewPriority: str

    distribution: SignalDistribution
    sentences: list[SentenceAnalysis]

    summaryMessage: str