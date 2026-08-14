from dataclasses import dataclass
import statistics


# ============================================================
# RESULT MODEL
# ============================================================

@dataclass(frozen=True)
class BurstinessResult:
    """
    Sentence rhythm statistics for an essay or passage.
    """

    mean_length: float
    variance: float
    standard_deviation: float
    coefficient_of_variation: float
    normalized_score: float


# ============================================================
# BASIC STATISTICS
# ============================================================

def calculate_mean(lengths: list[int]) -> float:
    """
    Calculate the average sentence length.
    """

    if not lengths:
        return 0.0

    return statistics.mean(lengths)


def calculate_variance(lengths: list[int]) -> float:
    """
    Calculate population variance of sentence lengths.
    """

    if not lengths:
        return 0.0

    if len(lengths) == 1:
        return 0.0

    return statistics.pvariance(lengths)


def calculate_standard_deviation(lengths: list[int]) -> float:
    """
    Calculate population standard deviation.
    """

    if not lengths:
        return 0.0

    if len(lengths) == 1:
        return 0.0

    return statistics.pstdev(lengths)


# ============================================================
# COEFFICIENT OF VARIATION
# ============================================================

def calculate_coefficient_of_variation(
    lengths: list[int],
) -> float:
    """
    Calculate:

        standard deviation / mean

    This normalizes variation relative to the average sentence
    length, making essays with different average sentence lengths
    more comparable.
    """

    if not lengths:
        return 0.0

    mean = calculate_mean(lengths)

    if mean == 0:
        return 0.0

    standard_deviation = calculate_standard_deviation(lengths)

    return standard_deviation / mean


# ============================================================
# NORMALIZED BURSTINESS SCORE
# ============================================================

def calculate_burstiness_score(
    lengths: list[int],
) -> float:
    """
    Return a normalized 0-10 burstiness score.

    Higher values indicate greater variation in sentence length.

    Lower values indicate a more uniform sentence rhythm.

    Important:
        This is a stylistic signal, NOT an authorship verdict.
    """

    if not lengths:
        return 0.0

    if len(lengths) == 1:
        return 0.5

    mean = calculate_mean(lengths)
    standard_deviation = calculate_standard_deviation(lengths)

    if mean <= 0:
        return 0.0

    # Same general normalization concept as the frontend,
    # but kept as a standalone and testable calculation.
    denominator = max(
        1.0,
        mean / 4.0,
    )

    score = standard_deviation / denominator

    return round(
        min(
            10.0,
            max(
                0.5,
                score,
            ),
        ),
        2,
    )


# ============================================================
# INTERPRETATION
# ============================================================

def burstiness_status(
    score: float,
) -> str:
    """
    Convert the numerical burstiness score into a human-readable
    status for the frontend.
    """

    if score < 2.5:
        return "Uniform (LLM)"

    return "High Variance (Human)"


# ============================================================
# COMPLETE ANALYSIS
# ============================================================

def analyze_burstiness(
    sentence_lengths: list[int],
) -> BurstinessResult:
    """
    Calculate all burstiness statistics in one call.
    """

    mean = calculate_mean(sentence_lengths)
    variance = calculate_variance(sentence_lengths)
    standard_deviation = calculate_standard_deviation(
        sentence_lengths
    )
    coefficient = calculate_coefficient_of_variation(
        sentence_lengths
    )
    score = calculate_burstiness_score(
        sentence_lengths
    )

    return BurstinessResult(
        mean_length=round(mean, 2),
        variance=round(variance, 2),
        standard_deviation=round(
            standard_deviation,
            2,
        ),
        coefficient_of_variation=round(
            coefficient,
            4,
        ),
        normalized_score=score,
    )


# ============================================================
# SENTENCE-LEVEL SIGNAL
# ============================================================

def sentence_rhythm_signal(
    sentence_length: int,
    all_lengths: list[int],
) -> float:
    """
    Estimate how uniform a particular sentence is relative to
    the essay's sentence-length distribution.

    Returns:
        0.0 -> highly unusual / varied
        1.0 -> highly uniform

    This should be combined with other evidence instead of being
    used independently.
    """

    if len(all_lengths) < 2:
        return 0.45

    mean = calculate_mean(all_lengths)
    standard_deviation = calculate_standard_deviation(
        all_lengths
    )

    if standard_deviation == 0:
        return 1.0

    distance = abs(
        sentence_length - mean
    ) / standard_deviation

    # A sentence very close to the essay's average gets a
    # stronger uniformity signal.
    signal = 1.0 - (
        distance / 2.5
    )

    return round(
        min(
            1.0,
            max(
                0.0,
                signal,
            ),
        ),
        4,
    )


# ============================================================
# HUMAN-READABLE EXPLANATION
# ============================================================

def rhythm_explanation(
    sentence_length: int,
    result: BurstinessResult,
) -> str:
    """
    Generate evidence text for the frontend.
    """

    if result.mean_length == 0:
        return "No sentence-length data available."

    difference = abs(
        sentence_length - result.mean_length
    )

    if result.standard_deviation == 0:
        return (
            f"This sentence contains {sentence_length} words "
            "and the analyzed essay has almost no sentence-length "
            "variation."
        )

    if difference < result.standard_deviation * 0.5:
        return (
            f"This sentence contains {sentence_length} words, "
            f"close to the essay average of "
            f"{result.mean_length:.1f} words. "
            "Its length therefore contributes to a more uniform "
            "sentence rhythm."
        )

    return (
        f"This sentence contains {sentence_length} words, "
        f"compared with an essay average of "
        f"{result.mean_length:.1f}. "
        "The difference contributes to greater sentence-rhythm "
        "variation."
    )