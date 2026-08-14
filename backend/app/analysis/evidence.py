from __future__ import annotations

from app.models import PassageSignal


# ============================================================
# FLAG HELPERS
# ============================================================

def _level_from_score(score: float) -> str:
    """
    Convert a normalized 0-1 signal into the frontend's
    diagnostic flag levels.
    """

    if score >= 0.78:
        return "red"

    if score >= 0.58:
        return "orange"

    if score >= 0.37:
        return "yellow"

    return "none"


def _stronger_level(
    first: str,
    second: str,
) -> str:
    """
    Return the stronger of two diagnostic levels.
    """

    priority = {
        "none": 0,
        "yellow": 1,
        "orange": 2,
        "red": 3,
    }

    return (
        first
        if priority[first] >= priority[second]
        else second
    )


# ============================================================
# PERPLEXITY EVIDENCE
# ============================================================

def build_perplexity_signal(
    perplexity: float,
    signal_score: float,
    explanation: str,
) -> PassageSignal:

    level = _level_from_score(signal_score)

    return PassageSignal(
        id="perplexity",
        category="smoothness",
        title="Vocabulary Smoothness",
        metricValue=f"{perplexity:.2f}",
        flagLevel=level,
        description=explanation,
    )


# ============================================================
# BURSTINESS EVIDENCE
# ============================================================

def build_burstiness_signal(
    burstiness_score: float,
    coefficient_of_variation: float,
    explanation: str,
) -> PassageSignal:

    # Low variation = stronger uniformity signal.
    if burstiness_score < 2.5:
        signal = 0.72

    elif burstiness_score < 4.0:
        signal = 0.50

    elif burstiness_score < 6.0:
        signal = 0.30

    else:
        signal = 0.12

    level = _level_from_score(signal)

    return PassageSignal(
        id="burstiness",
        category="burstiness",
        title="Sentence Rhythm",
        metricValue=(
            f"{burstiness_score:.2f} / 10 "
            f"(CV {coefficient_of_variation:.3f})"
        ),
        flagLevel=level,
        description=explanation,
    )


# ============================================================
# TROPE EVIDENCE
# ============================================================

def build_trope_signal(
    trope_count: int,
    trope_score: float,
    explanation: str,
) -> PassageSignal:

    level = _level_from_score(
        trope_score
    )

    return PassageSignal(
        id="tropes",
        category="tropes",
        title="Formulaic Phrasing",
        metricValue=str(trope_count),
        flagLevel=level,
        description=explanation,
    )


# ============================================================
# PREDICTABILITY EVIDENCE
# ============================================================

def build_predictability_signal(
    vocabulary_diversity: float,
    repeated_word_ratio: float,
    lexical_signal: float,
) -> PassageSignal:

    level = _level_from_score(
        lexical_signal
    )

    return PassageSignal(
        id="predictability",
        category="predictability",
        title="Lexical Predictability",
        metricValue=(
            f"TTR {vocabulary_diversity:.2f} "
            f"| repetition {repeated_word_ratio:.3f}"
        ),
        flagLevel=level,
        description=(
            f"Vocabulary diversity is {vocabulary_diversity:.2f} "
            f"and repeated content-word ratio is "
            f"{repeated_word_ratio:.3f}. "
            "These measurements provide supporting evidence "
            "about lexical variety and repetition."
        ),
    )


# ============================================================
# REFERENCE COMPARISON EVIDENCE
# ============================================================

def build_reference_signal(
    score: float,
    reference_description: str,
) -> PassageSignal:

    level = _level_from_score(
        score
    )

    return PassageSignal(
        id="reference-comparison",
        category="reference_comparison",
        title="Reference Comparison",
        metricValue=f"{score:.2f}",
        flagLevel=level,
        description=reference_description,
    )


# ============================================================
# COMPLETE SIGNAL SET
# ============================================================

def build_signals(
    *,
    perplexity: float,
    perplexity_signal_score: float,
    perplexity_explanation: str,

    burstiness_score: float,
    burstiness_cv: float,
    burstiness_explanation: str,

    trope_count: int,
    trope_score: float,
    trope_explanation: str,

    vocabulary_diversity: float,
    repeated_word_ratio: float,
    lexical_signal: float,

    reference_score: float | None = None,
    reference_description: str | None = None,
) -> list[PassageSignal]:
    """
    Build all visible evidence signals for one sentence.

    The reference-comparison signal is optional because the
    database-free MVP does not yet have a reference corpus.

    Once the dataset/reference layer exists, it can be enabled
    without changing the frontend contract.
    """

    signals = [
        build_perplexity_signal(
            perplexity=perplexity,
            signal_score=perplexity_signal_score,
            explanation=perplexity_explanation,
        ),

        build_burstiness_signal(
            burstiness_score=burstiness_score,
            coefficient_of_variation=burstiness_cv,
            explanation=burstiness_explanation,
        ),

        build_trope_signal(
            trope_count=trope_count,
            trope_score=trope_score,
            explanation=trope_explanation,
        ),

        build_predictability_signal(
            vocabulary_diversity=vocabulary_diversity,
            repeated_word_ratio=repeated_word_ratio,
            lexical_signal=lexical_signal,
        ),
    ]

    if (
        reference_score is not None
        and reference_description is not None
    ):
        signals.append(
            build_reference_signal(
                score=reference_score,
                reference_description=(
                    reference_description
                ),
            )
        )

    return signals


# ============================================================
# PASSAGE SUMMARY
# ============================================================

def build_summary_explanation(
    flag_level: str,
    signals: list[PassageSignal],
) -> str:
    """
    Generate the sentence-level explanation displayed by the
    Evidence Panel.

    This explanation describes evidence rather than claiming
    authorship.
    """

    flagged = [
        signal
        for signal in signals
        if signal.flagLevel != "none"
    ]

    if flag_level == "none":

        return (
            "No material statistical signal was detected "
            "under the current thresholds. This does not prove "
            "that the passage is human-written."
        )

    if not flagged:

        return (
            "The combined score produced a review flag, but "
            "no individual evidence signal crossed its display "
            "threshold."
        )

    categories = ", ".join(
        signal.title.lower()
        for signal in flagged
    )

    if flag_level == "yellow":

        return (
            f"Minor statistical evidence was observed in "
            f"{categories}. The signal is weak and should not "
            "be interpreted as an authorship verdict."
        )

    if flag_level == "orange":

        return (
            f"Multiple measurable signals were observed, "
            f"including {categories}. These features warrant "
            "closer review but do not establish machine authorship."
        )

    return (
        f"Several strong measurable signals were observed, "
        f"including {categories}. The passage should be reviewed "
        "closely; the result is still probabilistic evidence, "
        "not proof of machine authorship."
    )


# ============================================================
# SIGNAL AGREEMENT
# ============================================================

def calculate_signal_agreement(
    signals: list[PassageSignal],
) -> float:
    """
    Estimate how consistently the individual signals point in
    the same direction.

    Returns:
        0.0 -> signals disagree strongly
        1.0 -> signals are highly aligned

    This is descriptive and should not be confused with model
    confidence.
    """

    if not signals:
        return 0.0

    values = []

    for signal in signals:

        mapping = {
            "none": 0.0,
            "yellow": 0.33,
            "orange": 0.66,
            "red": 1.0,
        }

        values.append(
            mapping.get(
                signal.flagLevel,
                0.0,
            )
        )

    if len(values) == 1:
        return 1.0

    mean = sum(values) / len(values)

    variance = sum(
        (value - mean) ** 2
        for value in values
    ) / len(values)

    # Maximum useful variance for values bounded 0-1.
    agreement = 1.0 - min(
        1.0,
        variance * 4.0,
    )

    return round(
        max(
            0.0,
            agreement,
        ),
        3,
    )