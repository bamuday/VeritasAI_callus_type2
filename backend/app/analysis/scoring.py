from __future__ import annotations

from dataclasses import dataclass

from app.analysis.perplexity import perplexity_signal


# ============================================================
# SCORE RESULT
# ============================================================

@dataclass(frozen=True)
class ScoreResult:
    """
    Final interpretable statistical signal for one passage.

    score:
        0.0 -> weak overall statistical signal
        1.0 -> strong overall statistical signal

    flag_level:
        none / yellow / orange / red
    """

    score: float
    flag_level: str


# ============================================================
# UTILITIES
# ============================================================

def clamp(
    value: float,
    minimum: float = 0.0,
    maximum: float = 1.0,
) -> float:
    return max(
        minimum,
        min(maximum, value),
    )


# ============================================================
# LEXICAL SIGNAL
# ============================================================

def lexical_signal(
    vocabulary_diversity: float,
    repeated_word_ratio: float,
    word_count: int | None = None,
) -> float:
    """
    Combine vocabulary diversity and repetition.

    Short passages receive reduced lexical weight because
    TTR and repetition statistics are unstable with few words.
    """

    if vocabulary_diversity <= 0:
        diversity_component = 0.0

    else:
        diversity_component = clamp(
            (0.85 - vocabulary_diversity) / 0.50
        )

    repetition_component = clamp(
        repeated_word_ratio * 3.0
    )

    score = (
        0.70 * diversity_component
        + 0.30 * repetition_component
    )

    if word_count is not None:
        if word_count < 8:
            return 0.0

        if word_count < 20:
            score *= 0.35

        elif word_count < 30:
            score *= 0.60

    return clamp(score)


# ============================================================
# RHYTHM SIGNAL
# ============================================================

def rhythm_signal(
    sentence_uniformity: float,
) -> float:
    """
    0.0 -> varied rhythm
    1.0 -> highly uniform rhythm
    """

    return clamp(
        sentence_uniformity
    )


# ============================================================
# TROPE SIGNAL
# ============================================================

def trope_signal(
    trope_score: float,
) -> float:
    return clamp(
        trope_score
    )


# ============================================================
# REPETITION SIGNAL
# ============================================================

def repetition_signal(
    repeated_ngram_ratio: float,
) -> float:
    return clamp(
        repeated_ngram_ratio * 4.0
    )


# ============================================================
# COMPONENT SIGNALS
# ============================================================

def calculate_component_signals(
    *,
    perplexity: float,
    sentence_uniformity: float,
    trope_score: float,
    vocabulary_diversity: float,
    repeated_word_ratio: float,
    repeated_ngram_ratio: float,
    word_count: int | None = None,
) -> dict[str, float]:

    return {
        "perplexity": perplexity_signal(
            perplexity
        ),

        "rhythm": rhythm_signal(
            sentence_uniformity
        ),

        "tropes": trope_signal(
            trope_score
        ),

        "lexical": lexical_signal(
            vocabulary_diversity,
            repeated_word_ratio,
            word_count=word_count,
        ),

        "repetition": repetition_signal(
            repeated_ngram_ratio
        ),
    }


# ============================================================
# WEIGHTED SCORE
# ============================================================

def calculate_signal_score(
    *,
    perplexity: float,
    sentence_uniformity: float,
    trope_score: float,
    vocabulary_diversity: float,
    repeated_word_ratio: float,
    repeated_ngram_ratio: float,
    word_count: int | None = None,
) -> float:
    """
    Combine independent statistical signals.

    Current provisional engineering weights:

        Perplexity / smoothness     52%
        Sentence rhythm            18%
        Formulaic tropes           14%
        Lexical statistics          9%
        Repeated n-grams            7%

    These weights are NOT scientifically calibrated.
    They must be evaluated against the project's dataset.
    """

    signals = calculate_component_signals(
        perplexity=perplexity,
        sentence_uniformity=sentence_uniformity,
        trope_score=trope_score,
        vocabulary_diversity=vocabulary_diversity,
        repeated_word_ratio=repeated_word_ratio,
        repeated_ngram_ratio=repeated_ngram_ratio,
        word_count=word_count,
    )

    score = (
        0.52 * signals["perplexity"]
        + 0.18 * signals["rhythm"]
        + 0.14 * signals["tropes"]
        + 0.09 * signals["lexical"]
        + 0.07 * signals["repetition"]
    )

    # Short passages should have less influence.
    if word_count is not None:

        if word_count < 8:
            score = 0.0

        elif word_count < 20:
            score *= 0.60

    return round(
        clamp(score),
        4,
    )


# ============================================================
# FLAG LEVEL
# ============================================================

def determine_flag_level(
    score: float,
    word_count: int,
    *,
    strongest_signal: float | None = None,
) -> str:
    """
    Convert the combined statistical signal into a diagnostic flag.

    The final classification is based primarily on the weighted
    aggregate score. Individual component signals remain available
    as supporting evidence but do not independently override the
    aggregate score.

    Thresholds are provisional engineering thresholds and should
    eventually be calibrated against the project's evaluation set.
    """

    score = clamp(score)

    # ``strongest_signal`` is retained for API/backward compatibility.
    # It should not independently classify a short passage.
    _ = strongest_signal

    # Insufficient evidence.
    if word_count < 8:
        return "none"

    # Short passages cannot support strong classifications.
    if word_count < 20:
        if score >= 0.37:
            return "yellow"
        return "none"

    # Standard passage thresholds.
    if score >= 0.78:
        return "red"

    if score >= 0.58:
        return "orange"

    if score >= 0.37:
        return "yellow"

    return "none"


# ============================================================
# COMPLETE PASSAGE SCORING
# ============================================================

def score_passage(
    *,
    perplexity: float,
    sentence_uniformity: float,
    trope_score: float,
    vocabulary_diversity: float,
    repeated_word_ratio: float,
    repeated_ngram_ratio: float,
    word_count: int,
) -> ScoreResult:

    signals = calculate_component_signals(
        perplexity=perplexity,
        sentence_uniformity=sentence_uniformity,
        trope_score=trope_score,
        vocabulary_diversity=vocabulary_diversity,
        repeated_word_ratio=repeated_word_ratio,
        repeated_ngram_ratio=repeated_ngram_ratio,
        word_count=word_count,
    )

    score = calculate_signal_score(
        perplexity=perplexity,
        sentence_uniformity=sentence_uniformity,
        trope_score=trope_score,
        vocabulary_diversity=vocabulary_diversity,
        repeated_word_ratio=repeated_word_ratio,
        repeated_ngram_ratio=repeated_ngram_ratio,
        word_count=word_count,
    )

    strongest_signal = max(
        signals.values()
    )

    level = determine_flag_level(
        score,
        word_count,
        strongest_signal=strongest_signal,
    )

    return ScoreResult(
        score=score,
        flag_level=level,
    )


# ============================================================
# DOCUMENT DISTRIBUTION
# ============================================================

def calculate_distribution(
    flag_levels: list[str],
) -> dict[str, int]:

    if not flag_levels:
        return {
            "lowPct": 0,
            "mediumPct": 0,
            "highPct": 0,
            "normalPct": 100,
        }

    total = len(flag_levels)

    yellow = flag_levels.count("yellow")
    orange = flag_levels.count("orange")
    red = flag_levels.count("red")

    low_pct = round(
        yellow / total * 100
    )

    medium_pct = round(
        orange / total * 100
    )

    high_pct = round(
        red / total * 100
    )

    normal_pct = (
        100
        - low_pct
        - medium_pct
        - high_pct
    )

    normal_pct = max(
        0,
        min(100, normal_pct),
    )

    return {
        "lowPct": low_pct,
        "mediumPct": medium_pct,
        "highPct": high_pct,
        "normalPct": normal_pct,
    }


# ============================================================
# REVIEW PRIORITY
# ============================================================

def determine_review_priority(
    flag_levels: list[str],
) -> str:

    if not flag_levels:
        return "LOW"

    red = flag_levels.count("red")
    orange = flag_levels.count("orange")
    yellow = flag_levels.count("yellow")

    total = len(flag_levels)

    flagged = (
        red
        + orange
        + yellow
    )

    flagged_ratio = flagged / total

    if red >= 2:
        return "HIGH_ATTENTION"

    if red >= 1 and orange >= 2:
        return "HIGH_ATTENTION"

    if orange >= 2:
        return "MODERATE"

    if flagged_ratio >= 0.33:
        return "MODERATE"

    return "LOW"


# ============================================================
# SIGNAL LEVEL DESCRIPTION
# ============================================================

def flag_description(
    flag_level: str,
) -> str:

    descriptions = {
        "none": (
            "No material statistical signal was detected "
            "under the current thresholds."
        ),

        "yellow": (
            "A minor statistical signal was detected. "
            "Review the supporting evidence rather than "
            "treating the passage as machine-written."
        ),

        "orange": (
            "Multiple statistical signals align with more "
            "predictable or formulaic prose. Further review "
            "is recommended."
        ),

        "red": (
            "Several statistical signals strongly align with "
            "predictable or formulaic prose. This is a review "
            "flag, not proof of machine authorship."
        ),
    }

    return descriptions.get(
        flag_level,
        descriptions["none"],
    )