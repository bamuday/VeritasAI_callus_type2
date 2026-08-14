from __future__ import annotations

import math
from functools import lru_cache
from typing import Any
import torch
from app.core.config import settings


# ============================================================
# CONFIGURATION
# ============================================================

DEFAULT_MODEL_NAME = settings.model_name
MAX_MODEL_TOKENS = min(
    settings.max_model_tokens,
    512,
)


# ============================================================
# MODEL LOADING
# ============================================================

@lru_cache(maxsize=1)
def load_language_model() -> tuple[Any, Any, Any]:
    """
    Load the local causal language model lazily.

    The model is loaded only when the first analysis request
    requires it.

    Returns:
        tokenizer
        model
        torch module
    """

    import torch

    from transformers import (
        AutoModelForCausalLM,
        AutoTokenizer,
    )

    tokenizer = AutoTokenizer.from_pretrained(
        DEFAULT_MODEL_NAME
    )

    model = AutoModelForCausalLM.from_pretrained(
        DEFAULT_MODEL_NAME
    )

    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    model.eval()

    return tokenizer, model, torch


# ============================================================
# MODEL STATUS
# ============================================================

def is_model_available() -> bool:
    """
    Check whether the local transformer model can be loaded.

    This does not perform essay analysis.
    """

    try:
        load_language_model()
        return True

    except Exception:
        return False


# ============================================================
# TOKENIZATION
# ============================================================

def tokenize_for_model(
    text: str,
) -> tuple[Any, Any, Any]:
    """
    Tokenize text using the same tokenizer used by the model.
    """

    tokenizer, _, torch = load_language_model()

    encoded = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        max_length=MAX_MODEL_TOKENS,
    )

    return tokenizer, encoded, torch


# ============================================================
# PERPLEXITY
# ============================================================

def calculate_perplexity(
    text: str,
) -> float:
    """
    Calculate causal-language-model perplexity.

    Lower perplexity:
        more predictable token sequence.

    Higher perplexity:
        less predictable token sequence.

    Important:
        Perplexity is a statistical writing signal.
        It is NOT an AI-authorship probability.
    """

    if not text or not text.strip():
        return 0.0

    tokenizer, model, torch = load_language_model()

    encoded = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        max_length=MAX_MODEL_TOKENS,
    )

    input_ids = encoded["input_ids"]

    # We need at least two tokens for next-token loss.
    if input_ids.shape[1] < 2:
        return 0.0

    attention_mask = encoded.get(
        "attention_mask"
    )

    with torch.no_grad():
        outputs = model(
            input_ids=input_ids,
            attention_mask=attention_mask,
            labels=input_ids,
        )

        loss = outputs.loss

    perplexity = torch.exp(loss).item()

    if not math.isfinite(perplexity):
        return 0.0

    return round(
        min(float(perplexity), 1000.0),
        2,
    )


# ============================================================
# PERPLEXITY → NORMALIZED SIGNAL
# ============================================================

def perplexity_signal(
    perplexity: float,
) -> float:
    """
    Convert raw perplexity into a normalized smoothness signal.

    Higher value:
        stronger predictability / smoothness evidence.

    These are provisional engineering thresholds.
    They are NOT universal authorship boundaries.
    """

    if perplexity <= 0:
        return 0.0

    if perplexity <= 20:
        return 0.95

    if perplexity <= 30:
        return 0.82

    if perplexity <= 45:
        return 0.65

    if perplexity <= 65:
        return 0.45

    if perplexity <= 90:
        return 0.28

    return 0.12


# ============================================================
# PERPLEXITY STATUS
# ============================================================

def perplexity_status(
    perplexity: float,
) -> str:
    """
    Convert perplexity into neutral terminology.

    Avoids implying that high perplexity means "human".
    """

    if perplexity <= 20:
        return "Very Predictable"

    if perplexity <= 45:
        return "Moderately Predictable"

    if perplexity <= 90:
        return "Less Predictable"

    return "Highly Variable"


# ============================================================
# EVIDENCE DESCRIPTION
# ============================================================

def perplexity_explanation(
    perplexity: float,
) -> str:
    """
    Generate a neutral human-readable explanation.
    """

    if perplexity <= 20:
        return (
            f"Perplexity is {perplexity:.2f}, indicating a "
            "highly predictable token sequence under the local "
            "language model. This is a statistical smoothness "
            "signal, not proof of machine authorship."
        )

    if perplexity <= 30:
        return (
            f"Perplexity is {perplexity:.2f}. The passage is "
            "relatively predictable under the local language "
            "model and contributes a stronger smoothness signal."
        )

    if perplexity <= 55:
        return (
            f"Perplexity is {perplexity:.2f}, producing a "
            "moderate predictability signal. This range can occur "
            "in both human and machine-assisted academic writing."
        )

    if perplexity <= 90:
        return (
            f"Perplexity is {perplexity:.2f}. The observed token "
            "sequence is comparatively less predictable under the "
            "local language model."
        )

    return (
        f"Perplexity is {perplexity:.2f}, indicating comparatively "
        "high token-level variability under the local language "
        "model."
    )


# ============================================================
# SAFE ANALYSIS WRAPPER
# ============================================================

def analyze_perplexity(
    text: str,
) -> dict[str, float | str]:
    """
    Run the complete perplexity analysis for one passage.
    """

    perplexity = calculate_perplexity(text)

    return {
        "perplexity": perplexity,
        "signal": perplexity_signal(perplexity),
        "status": perplexity_status(perplexity),
        "explanation": perplexity_explanation(
            perplexity
        ),
    }