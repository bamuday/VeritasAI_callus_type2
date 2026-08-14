from __future__ import annotations

import re
from dataclasses import dataclass


# ============================================================
# DATA STRUCTURE
# ============================================================

@dataclass
class Sentence:
    """
    Represents one sentence extracted from the essay.

    start/end are character offsets in the normalized essay.
    paragraph_index identifies the original paragraph.
    """

    id: str
    index: int
    paragraph_index: int
    text: str
    start: int
    end: int
    words: list[str]


# ============================================================
# WORD TOKENIZATION
# ============================================================

WORD_PATTERN = re.compile(
    r"\b[\w’'-]+\b",
    flags=re.UNICODE,
)


def tokenize_words(text: str) -> list[str]:
    """Extract words from text."""
    return WORD_PATTERN.findall(text)


def normalize_word(word: str) -> str:
    """Normalize a word for statistical calculations."""
    return word.lower().strip("'-")


# ============================================================
# TEXT NORMALIZATION
# ============================================================

def normalize_text(text: str) -> str:
    """
    Normalize line endings and whitespace while preserving
    paragraph structure and spaces inside sentences.
    """

    if not text:
        return ""

    # Normalize line endings.
    text = text.replace("\r\n", "\n")
    text = text.replace("\r", "\n")

    # Convert non-breaking spaces to ordinary spaces.
    text = text.replace("\u00a0", " ")

    # Remove trailing whitespace from each line.
    lines = [
        line.strip()
        for line in text.split("\n")
    ]

    normalized_lines: list[str] = []

    previous_blank = False

    for line in lines:
        if not line:
            if not previous_blank:
                normalized_lines.append("")

            previous_blank = True

        else:
            normalized_lines.append(line)
            previous_blank = False

    return "\n".join(normalized_lines).strip()


# ============================================================
# PARAGRAPH HANDLING
# ============================================================

def split_paragraphs(text: str) -> list[str]:
    """
    Split an essay into paragraphs.

    A blank line represents a paragraph boundary.
    """

    normalized = normalize_text(text)

    if not normalized:
        return []

    paragraphs = re.split(
        r"\n\s*\n",
        normalized,
    )

    return [
        paragraph.strip()
        for paragraph in paragraphs
        if paragraph.strip()
    ]


# ============================================================
# SENTENCE BOUNDARY DETECTION
# ============================================================

SENTENCE_BOUNDARY_PATTERN = re.compile(
    r"[.!?]+(?=\s|$)",
    flags=re.UNICODE,
)


def _sentence_spans(text: str) -> list[tuple[int, int]]:
    """
    Return character spans for sentences.

    IMPORTANT:
    This works directly on the normalized document.

    It does NOT reconstruct sentences from words.
    It does NOT join tokens.
    It does NOT modify internal spaces.
    """

    normalized = normalize_text(text)

    if not normalized:
        return []

    spans: list[tuple[int, int]] = []

    sentence_start = 0

    for match in SENTENCE_BOUNDARY_PATTERN.finditer(
        normalized
    ):
        sentence_end = match.end()

        raw = normalized[
            sentence_start:sentence_end
        ]

        stripped = raw.strip()

        if stripped:
            leading = len(raw) - len(raw.lstrip())
            trailing = len(raw) - len(raw.rstrip())

            start = (
                sentence_start
                + leading
            )

            end = (
                sentence_end
                - trailing
            )

            spans.append(
                (start, end)
            )

        sentence_start = sentence_end

    # Handle remaining text after final punctuation.
    if sentence_start < len(normalized):

        raw = normalized[
            sentence_start:
        ]

        stripped = raw.strip()

        if stripped:

            leading = (
                len(raw)
                - len(raw.lstrip())
            )

            start = (
                sentence_start
                + leading
            )

            end = len(normalized)

            spans.append(
                (start, end)
            )

    return spans


# ============================================================
# SENTENCE SEGMENTATION
# ============================================================

def split_sentences(text: str) -> list[str]:
    """
    Split text into sentences.

    The returned strings are direct slices of normalized_text.
    Therefore internal spaces are preserved exactly.
    """

    normalized = normalize_text(text)

    if not normalized:
        return []

    return [
        normalized[start:end]
        for start, end in _sentence_spans(normalized)
    ]


# ============================================================
# PARAGRAPH INDEX
# ============================================================

def _paragraph_index_at(
    text: str,
    position: int,
) -> int:
    """
    Determine which paragraph contains a character position.
    """

    if not text:
        return 0

    prefix = text[:position]

    return len(
        re.findall(
            r"\n\s*\n",
            prefix,
        )
    )


# ============================================================
# STRUCTURED SENTENCE EXTRACTION
# ============================================================

def extract_sentences(
    text: str,
) -> list[Sentence]:
    """
    Convert the essay into structured Sentence objects.

    Sentence text is taken directly from the normalized
    document.

    No sentence is reconstructed from tokenized words.
    """

    normalized = normalize_text(text)

    if not normalized:
        return []

    results: list[Sentence] = []

    spans = _sentence_spans(
        normalized
    )

    for index, (start, end) in enumerate(
        spans
    ):

        sentence_text = normalized[
            start:end
        ]

        words = tokenize_words(
            sentence_text
        )

        paragraph_index = (
            _paragraph_index_at(
                normalized,
                start,
            )
        )

        results.append(
            Sentence(
                id=f"s{index}",
                index=index,
                paragraph_index=paragraph_index,
                text=sentence_text,
                start=start,
                end=end,
                words=words,
            )
        )

    return results


# ============================================================
# BASIC DOCUMENT STATISTICS
# ============================================================

def count_words(
    text: str,
) -> int:
    """Count words using the detector tokenizer."""

    return len(
        tokenize_words(text)
    )


def count_characters(
    text: str,
) -> int:
    """Count characters in submitted text."""

    return len(text)


def reading_time_minutes(
    word_count: int,
    words_per_minute: int = 200,
) -> int:
    """Estimate reading time."""

    if word_count <= 0:
        return 0

    return max(
        1,
        (
            word_count
            + words_per_minute
            - 1
        )
        // words_per_minute,
    )


# ============================================================
# DOCUMENT COMPLEXITY
# ============================================================

def analysis_complexity(
    word_count: int,
) -> str:
    """
    Classify document complexity.

    < 250:
        Low

    250-500:
        Standard

    > 500:
        High
    """

    if word_count < 250:
        return "Low"

    if word_count <= 500:
        return "Standard"

    return "High"