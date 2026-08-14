import re
from dataclasses import dataclass


# ============================================================
# TROPE DATA MODEL
# ============================================================

@dataclass(frozen=True)
class TropeMatch:
    """
    Represents one detected formulaic phrase.
    """

    phrase: str
    reason: str
    severity: str  # "red" or "orange"


# ============================================================
# FORMULAIC PATTERN DATABASE
# ============================================================

TROPE_PATTERNS: list[tuple[str, str, str]] = [
    (
        r"\bdelving into\b",
        "delving into",
        "LLM Transition Cliché",
        "red",
    ),
    (
        r"\bdelving in\b",
        "delving in",
        "LLM Transition Cliché",
        "red",
    ),
    (
        r"\bmultifaceted realm\b",
        "multifaceted realm",
        "RLHF Overused Phrase",
        "red",
    ),
    (
        r"\bmultifaceted dimensions\b",
        "multifaceted dimensions",
        "Formulaic Academic Construction",
        "red",
    ),
    (
        r"\bunequivocally clear\b",
        "unequivocally clear",
        "Formal Hyperbole",
        "orange",
    ),
    (
        r"\bcatalyzed a paradigm shift\b",
        "catalyzed a paradigm shift",
        "Corporate LLM Jargon",
        "red",
    ),
    (
        r"\bparadigm shift\b",
        "paradigm shift",
        "Formulaic Academic Marker",
        "orange",
    ),
    (
        r"\binterplay between\b",
        "interplay between",
        "Formulaic Academic Marker",
        "orange",
    ),
    (
        r"\brobust framework\b",
        "robust framework",
        "Abstract Filler",
        "orange",
    ),
    (
        r"\bsynergistic effects\b",
        "synergistic effects",
        "High-Frequency LLM N-Gram",
        "red",
    ),
    (
        r"\bin conclusion\b",
        "in conclusion",
        "Generic Conclusion Marker",
        "orange",
    ),
    (
        r"\btraversing the complex landscape\b",
        "traversing the complex landscape",
        "RLHF Structural Template",
        "red",
    ),
    (
        r"\bit is important to note\b",
        "it is important to note",
        "Passive Filler Transition",
        "orange",
    ),
    (
        r"\bit is important to consider\b",
        "it is important to consider",
        "Passive Filler Transition",
        "orange",
    ),
    (
        r"\bfurthermore, it is imperative\b",
        "furthermore, it is imperative",
        "Formulaic Academic Transition",
        "red",
    ),
    (
        r"\btestament to\b",
        "testament to",
        "Formal LLM Cliché",
        "orange",
    ),
    (
        r"\btapestry of\b",
        "tapestry of",
        "Cliché Metaphorical Construction",
        "orange",
    ),
    (
        r"\bplays a pivotal role\b",
        "plays a pivotal role",
        "Formulaic Academic Phrase",
        "orange",
    ),
    (
        r"\bplays a significant role\b",
        "plays a significant role",
        "Formulaic Academic Phrase",
        "orange",
    ),
    (
        r"\bin order to foster\b",
        "in order to foster",
        "Formulaic Purpose Construction",
        "orange",
    ),
    (
        r"\brich environment for exploration\b",
        "rich environment for exploration",
        "Formulaic Academic Construction",
        "orange",
    ),
    (
        r"\bco-creators of\b",
        "co-creators of",
        "Formulaic Conceptual Construction",
        "orange",
    ),
    (
        r"\bthematic coherence\b",
        "thematic coherence",
        "Formulaic Academic Marker",
        "orange",
    ),
]


# ============================================================
# COMPILED REGEX CACHE
# ============================================================

_COMPILED_PATTERNS = [
    (
        re.compile(pattern, flags=re.IGNORECASE),
        phrase,
        reason,
        severity,
    )
    for pattern, phrase, reason, severity in TROPE_PATTERNS
]


# ============================================================
# DETECTION
# ============================================================

def detect_tropes(text: str) -> list[TropeMatch]:
    """
    Detect configured formulaic phrases in a sentence.

    This function does NOT decide whether a sentence is AI-written.

    It only reports observable phrase-level evidence.

    That distinction matters:
        phrase detected != AI authorship proven
    """

    if not text:
        return []

    matches: list[TropeMatch] = []

    for pattern, phrase, reason, severity in _COMPILED_PATTERNS:

        if pattern.search(text):
            matches.append(
                TropeMatch(
                    phrase=phrase,
                    reason=reason,
                    severity=severity,
                )
            )

    return matches


# ============================================================
# SCORING
# ============================================================

def trope_signal_score(matches: list[TropeMatch]) -> float:
    """
    Convert detected trope evidence into a normalized signal.

    This is deliberately capped.

    A sentence containing ten formulaic phrases should not
    automatically receive a score of 10.0.
    """

    if not matches:
        return 0.0

    score = 0.0

    for match in matches:

        if match.severity == "red":
            score += 0.32

        elif match.severity == "orange":
            score += 0.20

    return min(1.0, score)


# ============================================================
# HUMAN-READABLE EXPLANATION
# ============================================================

def trope_explanation(matches: list[TropeMatch]) -> str:
    """
    Generate evidence text for the frontend Evidence Panel.
    """

    if not matches:
        return (
            "No configured formulaic transitional or academic "
            "phrasing was detected in this passage."
        )

    phrases = [
        f'"{match.phrase}"'
        for match in matches
    ]

    return (
        f"Detected {len(matches)} configured formulaic "
        f"pattern(s): {', '.join(phrases)}. "
        "These patterns are supporting evidence only and "
        "cannot establish authorship on their own."
    )