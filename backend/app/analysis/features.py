from __future__ import annotations

import math
import re
import statistics
from collections import Counter


# ============================================================
# BASIC TOKEN FEATURES
# ============================================================

def normalize_words(words: list[str]) -> list[str]:
    """
    Normalize token strings for statistical calculations.
    """

    return [
        word.lower().strip("'-")
        for word in words
        if word.strip("'-")
    ]


def unique_word_count(words: list[str]) -> int:
    """
    Number of unique normalized words.
    """

    normalized = normalize_words(words)

    return len(set(normalized))


def vocabulary_diversity(words: list[str]) -> float:
    """
    Type-token ratio.

        unique words / total words

    Higher values generally indicate greater lexical variety.

    This is a supporting signal only because TTR is strongly
    affected by passage length.
    """

    normalized = normalize_words(words)

    if not normalized:
        return 0.0

    return round(
        len(set(normalized)) / len(normalized),
        4,
    )


# ============================================================
# N-GRAM FEATURES
# ============================================================

def generate_ngrams(
    words: list[str],
    n: int,
) -> list[tuple[str, ...]]:
    """
    Generate word n-grams.
    """

    normalized = normalize_words(words)

    if len(normalized) < n:
        return []

    return [
        tuple(normalized[i:i + n])
        for i in range(len(normalized) - n + 1)
    ]


def repeated_ngram_ratio(
    words: list[str],
    n: int = 3,
) -> float:
    """
    Measure how much an n-gram sequence repeats.

    Returns:
        0.0 -> no repeated n-grams
        1.0 -> extremely repetitive

    The value is capped to [0, 1].
    """

    ngrams = generate_ngrams(words, n)

    if not ngrams:
        return 0.0

    counts = Counter(ngrams)

    repeated_instances = sum(
        count - 1
        for count in counts.values()
        if count > 1
    )

    ratio = repeated_instances / len(ngrams)

    return round(
        min(1.0, max(0.0, ratio)),
        4,
    )


def most_repeated_ngrams(
    words: list[str],
    n: int = 3,
    limit: int = 5,
) -> list[dict[str, str | int]]:
    """
    Return the most frequently repeated n-grams.

    Useful for generating visible evidence.
    """

    ngrams = generate_ngrams(words, n)

    if not ngrams:
        return []

    counts = Counter(ngrams)

    results = []

    for gram, count in counts.most_common(limit):

        if count < 2:
            continue

        results.append(
            {
                "ngram": " ".join(gram),
                "count": count,
            }
        )

    return results


# ============================================================
# WORD LENGTH
# ============================================================

def average_word_length(
    words: list[str],
) -> float:
    """
    Calculate average character length of normalized words.
    """

    normalized = normalize_words(words)

    if not normalized:
        return 0.0

    return round(
        statistics.mean(
            len(word)
            for word in normalized
        ),
        3,
    )


def word_length_variance(
    words: list[str],
) -> float:
    """
    Calculate population variance of word lengths.
    """

    normalized = normalize_words(words)

    if len(normalized) < 2:
        return 0.0

    return round(
        statistics.pvariance(
            len(word)
            for word in normalized
        ),
        4,
    )


# ============================================================
# PUNCTUATION FEATURES
# ============================================================

def punctuation_counts(
    text: str,
) -> dict[str, int]:
    """
    Count common punctuation marks.

    These measurements are descriptive rather than direct
    authorship indicators.
    """

    return {
        "comma": text.count(","),
        "semicolon": text.count(";"),
        "colon": text.count(":"),
        "dash": len(
            re.findall(
                r"[—–-]",
                text,
            )
        ),
        "question": text.count("?"),
        "exclamation": text.count("!"),
        "parentheses": text.count("(")
        + text.count(")"),
    }


def punctuation_density(
    text: str,
    word_count: int,
) -> float:
    """
    Punctuation marks per word.
    """

    if word_count <= 0:
        return 0.0

    punctuation = len(
        re.findall(
            r"[,;:!?—–()-]",
            text,
        )
    )

    return round(
        punctuation / word_count,
        4,
    )


# ============================================================
# CONTRACTION FEATURES
# ============================================================

CONTRACTION_PATTERN = re.compile(
    r"\b[A-Za-z]+['’][A-Za-z]+\b"
)


def contraction_count(
    text: str,
) -> int:
    """
    Count contractions such as:

        I'm
        don't
        can't
        I've
    """

    return len(
        CONTRACTION_PATTERN.findall(text)
    )


def contraction_rate(
    text: str,
    word_count: int,
) -> float:
    """
    Contractions per word.
    """

    if word_count <= 0:
        return 0.0

    return round(
        contraction_count(text) / word_count,
        4,
    )


# ============================================================
# SENTENCE FEATURES
# ============================================================

def sentence_length_statistics(
    lengths: list[int],
) -> dict[str, float]:
    """
    Calculate basic sentence-length statistics.
    """

    if not lengths:
        return {
            "mean": 0.0,
            "median": 0.0,
            "minimum": 0.0,
            "maximum": 0.0,
            "variance": 0.0,
            "standardDeviation": 0.0,
        }

    mean = statistics.mean(lengths)

    variance = (
        statistics.pvariance(lengths)
        if len(lengths) > 1
        else 0.0
    )

    standard_deviation = math.sqrt(
        variance
    )

    return {
        "mean": round(mean, 3),
        "median": round(
            statistics.median(lengths),
            3,
        ),
        "minimum": float(min(lengths)),
        "maximum": float(max(lengths)),
        "variance": round(
            variance,
            3,
        ),
        "standardDeviation": round(
            standard_deviation,
            3,
        ),
    }


# ============================================================
# FUNCTION WORDS
# ============================================================

FUNCTION_WORDS = {
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "if",
    "then",
    "because",
    "although",
    "while",
    "of",
    "to",
    "in",
    "on",
    "for",
    "with",
    "from",
    "by",
    "as",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "it",
    "this",
    "that",
    "these",
    "those",
}


def function_word_ratio(
    words: list[str],
) -> float:
    """
    Calculate the proportion of tokens that are common
    grammatical/function words.
    """

    normalized = normalize_words(words)

    if not normalized:
        return 0.0

    count = sum(
        word in FUNCTION_WORDS
        for word in normalized
    )

    return round(
        count / len(normalized),
        4,
    )


# ============================================================
# REPETITION
# ============================================================

def repeated_word_ratio(
    words: list[str],
) -> float:
    """
    Calculate repeated lexical token ratio.

    Common function words are ignored so that normal grammar
    does not dominate the measurement.
    """

    normalized = normalize_words(words)

    content_words = [
        word
        for word in normalized
        if word not in FUNCTION_WORDS
    ]

    if not content_words:
        return 0.0

    counts = Counter(content_words)

    repeated = sum(
        count - 1
        for count in counts.values()
        if count > 1
    )

    return round(
        repeated / len(content_words),
        4,
    )


# ============================================================
# LEXICAL SIGNAL
# ============================================================

def lexical_predictability_signal(
    words: list[str],
) -> float:
    """
    Convert lexical statistics into a weak normalized signal.

    This is deliberately low-weight in the eventual detector.

    Returns:
        0.0 -> little formulaic lexical evidence
        1.0 -> stronger lexical repetition / lower diversity
    """

    normalized = normalize_words(words)

    if len(normalized) < 20:
        # Short passages do not provide enough lexical evidence.
        return 0.45

    diversity = vocabulary_diversity(
        normalized
    )

    repetition = repeated_word_ratio(
        normalized
    )

    # Lower diversity contributes a stronger signal.
    diversity_signal = (
        0.65 - diversity
    ) / 0.35

    diversity_signal = max(
        0.0,
        min(
            1.0,
            diversity_signal,
        ),
    )

    repetition_signal = min(
        1.0,
        repetition * 3.0,
    )

    combined = (
        0.70 * diversity_signal
        + 0.30 * repetition_signal
    )

    return round(
        max(
            0.0,
            min(
                1.0,
                combined,
            ),
        ),
        4,
    )


# ============================================================
# COMPLETE FEATURE EXTRACTION
# ============================================================

def extract_features(
    text: str,
    words: list[str],
    sentence_lengths: list[int],
) -> dict:
    """
    Extract all general-purpose measurable features.

    No classification happens here.
    """

    word_count = len(words)

    punctuation = punctuation_counts(
        text
    )

    sentence_stats = sentence_length_statistics(
        sentence_lengths
    )

    return {
        "wordCount": word_count,

        "uniqueWordCount": unique_word_count(
            words
        ),

        "vocabularyDiversity": vocabulary_diversity(
            words
        ),

        "averageWordLength": average_word_length(
            words
        ),

        "wordLengthVariance": word_length_variance(
            words
        ),

        "repeatedBigramRatio": repeated_ngram_ratio(
            words,
            n=2,
        ),

        "repeatedTrigramRatio": repeated_ngram_ratio(
            words,
            n=3,
        ),

        "repeatedNgrams": most_repeated_ngrams(
            words,
            n=3,
        ),

        "repeatedWordRatio": repeated_word_ratio(
            words
        ),

        "functionWordRatio": function_word_ratio(
            words
        ),

        "punctuationDensity": punctuation_density(
            text,
            word_count,
        ),

        "punctuationCounts": punctuation,

        "contractionCount": contraction_count(
            text
        ),

        "contractionRate": contraction_rate(
            text,
            word_count,
        ),

        "lexicalPredictabilitySignal":
            lexical_predictability_signal(
                words
            ),

        "sentenceLengths": sentence_lengths,

        "sentenceLengthStatistics":
            sentence_stats,
    }