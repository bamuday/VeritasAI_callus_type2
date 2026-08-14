from __future__ import annotations

import hashlib
from datetime import datetime, timezone

from app.models import (
    AnalysisResult,
    SentenceAnalysis,
    SignalDistribution,
)

from app.analysis.text import (
    analysis_complexity,
    count_words,
    extract_sentences,
    reading_time_minutes,
)

from app.analysis.features import (
    extract_features,
    lexical_predictability_signal,
)

from app.analysis.tropes import (
    detect_tropes,
    trope_explanation,
    trope_signal_score,
)

from app.analysis.burstiness import (
    analyze_burstiness,
    rhythm_explanation,
    sentence_rhythm_signal,
)

from app.analysis.perplexity import (
    analyze_perplexity,
)

from app.analysis.scoring import (
    calculate_distribution,
    determine_review_priority,
    score_passage,
)

from app.analysis.evidence import (
    build_signals,
    build_summary_explanation,
)


# ============================================================
# DOCUMENT TITLE
# ============================================================

def generate_title(text: str) -> str:
    """
    Generate a simple document title.

    We deliberately do not ask an LLM to generate a title.
    """

    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    if lines:
        first_line = lines[0]

        if (
            len(first_line) <= 80
            and not first_line.endswith(
                (".", "!", "?")
            )
        ):
            return first_line

    return "Admissions Essay Analysis"


# ============================================================
# DOCUMENT ID
# ============================================================

def generate_document_id(
    text: str,
) -> str:
    """
    Generate a deterministic document identifier.

    No database is required.
    """

    digest = hashlib.sha256(
        text.encode("utf-8")
    ).hexdigest()[:12]

    return f"VER-{digest.upper()}"


# ============================================================
# DOCUMENT SUMMARY
# ============================================================

def generate_summary_message(
    review_priority: str,
    sentence_count: int,
    distribution: dict[str, int],
) -> str:
    """
    Generate the document-level message shown to the reviewer.

    This deliberately avoids claiming an AI percentage.
    """

    if sentence_count == 0:
        return (
            "No analyzable sentences were found."
        )

    if review_priority == "HIGH_ATTENTION":

        return (
            "Several passages contain strong statistical signals "
            "that warrant close human review. These signals "
            "describe measurable writing characteristics and "
            "should not be treated as proof of machine authorship."
        )

    if review_priority == "MODERATE":

        return (
            "Multiple passages contain moderate statistical "
            "signals. Review the highlighted evidence and the "
            "underlying text rather than relying on a single "
            "overall score."
        )

    return (
        "The essay contains limited statistical signals under "
        "the current thresholds. This result does not establish "
        "human authorship; it indicates that the detector found "
        "few measurable features requiring review."
    )


# ============================================================
# SENTENCE ANALYSIS
# ============================================================

def analyze_sentence(
    sentence,
    all_sentence_lengths: list[int],
) -> SentenceAnalysis:
    """
    Analyze one sentence using all independent detector signals.
    """

    original_text = str(sentence.text)

    words = list(sentence.words)

    word_count = len(words)

    # --------------------------------------------------------
    # Perplexity
    # --------------------------------------------------------

    perplexity_result = analyze_perplexity(
        original_text
    )

    perplexity = float(
        perplexity_result["perplexity"]
    )

    perplexity_signal_score = float(
        perplexity_result["signal"]
    )

    perplexity_explanation = str(
        perplexity_result["explanation"]
    )

    # --------------------------------------------------------
    # Burstiness / sentence rhythm
    # --------------------------------------------------------

    burstiness_result = analyze_burstiness(
        all_sentence_lengths
    )

    sentence_uniformity = sentence_rhythm_signal(
        sentence_length=word_count,
        all_lengths=all_sentence_lengths,
    )

    burstiness_explanation = rhythm_explanation(
        sentence_length=word_count,
        result=burstiness_result,
    )

    # --------------------------------------------------------
    # Formulaic phrases
    # --------------------------------------------------------

    trope_matches = detect_tropes(
        original_text
    )

    trope_score = trope_signal_score(
        trope_matches
    )

    trope_count = len(
        trope_matches
    )

    trope_explanation_text = trope_explanation(
        trope_matches
    )

    # --------------------------------------------------------
    # Lexical features
    # --------------------------------------------------------

    features = extract_features(
        text=original_text,
        words=words,
        sentence_lengths=all_sentence_lengths,
    )

    vocabulary_diversity = float(
        features["vocabularyDiversity"]
    )

    repeated_word_ratio = float(
        features["repeatedWordRatio"]
    )

    repeated_ngram_ratio = float(
        features["repeatedTrigramRatio"]
    )

    lexical_signal = lexical_predictability_signal(
        words
    )

    # --------------------------------------------------------
    # Combined score
    # --------------------------------------------------------

    score_result = score_passage(
        perplexity=perplexity,
        sentence_uniformity=sentence_uniformity,
        trope_score=trope_score,
        vocabulary_diversity=vocabulary_diversity,
        repeated_word_ratio=repeated_word_ratio,
        repeated_ngram_ratio=repeated_ngram_ratio,
        word_count=word_count,
    )

    # --------------------------------------------------------
    # Evidence
    # --------------------------------------------------------

    signals = build_signals(
        perplexity=perplexity,
        perplexity_signal_score=(
            perplexity_signal_score
        ),
        perplexity_explanation=(
            perplexity_explanation
        ),

        burstiness_score=(
            burstiness_result.normalized_score
        ),
        burstiness_cv=(
            burstiness_result.coefficient_of_variation
        ),
        burstiness_explanation=(
            burstiness_explanation
        ),

        trope_count=trope_count,
        trope_score=trope_score,
        trope_explanation=(
            trope_explanation_text
        ),

        vocabulary_diversity=(
            vocabulary_diversity
        ),
        repeated_word_ratio=(
            repeated_word_ratio
        ),
        lexical_signal=(
            lexical_signal
        ),

        # No reference corpus yet.
        reference_score=None,
        reference_description=None,
    )

    # --------------------------------------------------------
    # Summary
    # --------------------------------------------------------

    summary = build_summary_explanation(
        flag_level=score_result.flag_level,
        signals=signals,
    )

    # --------------------------------------------------------
    # Category
    # --------------------------------------------------------

    category = determine_primary_category(
        signals
    )

    return SentenceAnalysis(
        id=sentence.id,
        index=sentence.index,
        paragraphIndex=sentence.paragraph_index,
        text=original_text,
        flagLevel=score_result.flag_level,
        signalScore=score_result.score,
        passageCategory=category,
        signals=signals,
        summaryExplanation=summary,
    )


# ============================================================
# PRIMARY CATEGORY
# ============================================================

def determine_primary_category(
    signals,
) -> str:
    """
    Determine which signal category contributed most strongly
    to a passage.

    This is only a display category.
    """

    priority = {
        "none": 0,
        "yellow": 1,
        "orange": 2,
        "red": 3,
    }

    strongest = None
    strongest_level = 0

    for signal in signals:

        level = priority.get(
            signal.flagLevel,
            0,
        )

        if level > strongest_level:

            strongest_level = level
            strongest = signal.category

    if strongest is None:
        return "smoothness"

    return strongest


# ============================================================
# COMPLETE ESSAY ANALYSIS
# ============================================================

def analyze_essay(
    raw_text: str,
    model_id: str = "custom",
) -> AnalysisResult:

    if not raw_text or not raw_text.strip():
        raise ValueError(
            "Essay text cannot be empty."
        )

    # --------------------------------------------------------
    # Normalize / extract sentences
    # --------------------------------------------------------

    sentences = extract_sentences(
        raw_text
    )

    if not sentences:
        raise ValueError(
            "No analyzable sentences were found."
        )

    # --------------------------------------------------------
    # Document statistics
    # --------------------------------------------------------

    word_count = count_words(
        raw_text
    )

    sentence_count = len(
        sentences
    )
    
        # --------------------------------------------------------
    # Minimum evidence guard
    # --------------------------------------------------------
    #
    # Very short texts do not provide enough observations for
    # meaningful document-level statistical interpretation.
    #
    # The underlying statistical functions may still calculate
    # values, but we do not present them as meaningful evidence.
    #

    if word_count < 20:
        raise ValueError(
            "Insufficient text for statistical analysis. "
            "Please provide at least 20 words."
        )

    sentence_lengths = [
        len(sentence.words)
        for sentence in sentences
    ]

    # General document features are calculated once here.
    # Individual sentence analysis will use the same essay-level
    # sentence distribution.
    extract_features(
        text=raw_text,
        words=[
            word
            for sentence in sentences
            for word in sentence.words
        ],
        sentence_lengths=sentence_lengths,
    )

    # --------------------------------------------------------
    # Sentence analysis
    # --------------------------------------------------------

    analyzed_sentences = []

    for sentence in sentences:

        result = analyze_sentence(
            sentence=sentence,
            all_sentence_lengths=sentence_lengths,
        )

        analyzed_sentences.append(
            result
        )

    # --------------------------------------------------------
    # Document-level classification
    # --------------------------------------------------------

    flag_levels = [
        sentence.flagLevel
        for sentence in analyzed_sentences
    ]

    distribution = calculate_distribution(
        flag_levels
    )

    review_priority = determine_review_priority(
        flag_levels
    )

    # --------------------------------------------------------
    # Metadata
    # --------------------------------------------------------

    document_id = generate_document_id(
        raw_text
    )

    title = generate_title(
        raw_text
    )

    processed_at = datetime.now(
        timezone.utc
    ).strftime(
        "%Y-%m-%d %H:%M UTC"
    )

    reading_time = reading_time_minutes(
        word_count
    )

    complexity = analysis_complexity(
        word_count
    )

    summary_message = generate_summary_message(
        review_priority=review_priority,
        sentence_count=sentence_count,
        distribution=distribution,
    )

    # --------------------------------------------------------
    # Final API object
    # --------------------------------------------------------

    return AnalysisResult(
        id=document_id,
        title=title,
        processedAt=processed_at,
        rawText=raw_text,
        wordCount=word_count,
        sentenceCount=sentence_count,
        readingTimeMinutes=reading_time,
        analysisComplexity=complexity,
        reviewPriority=review_priority,
        distribution=SignalDistribution(
            lowPct=distribution["lowPct"],
            mediumPct=distribution["mediumPct"],
            highPct=distribution["highPct"],
            normalPct=distribution["normalPct"],
        ),
        sentences=analyzed_sentences,
        summaryMessage=summary_message,
    )