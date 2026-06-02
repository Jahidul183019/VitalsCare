"""Lightweight wrapper exposing `predict_risks()` for the app.

This wraps the existing `risk_engine.calculate_risk` function and
returns a per-condition mapping expected by the API.
"""
from __future__ import annotations

from typing import Dict

from risk_engine import calculate_risk


RISK_BANDS = ((34, "low", "green"), (69, "medium", "yellow"), (100, "high", "red"))


def _risk_band_from_score(score: int) -> tuple[str, str]:
    for upper, level, color in RISK_BANDS:
        if score <= upper:
            return level, color
    return "high", "red"


def predict_risks(patient_data: dict) -> Dict[str, dict]:
    """Return a mapping of condition -> risk metadata.

    The returned structure matches what the FastAPI app expects:
    - risk_level (str)
    - color (str)
    - probability (number)
    - contributing_factors (list)
    - recommendation (str)
    """
    calc = calculate_risk(patient_data)
    condition_scores = calc.get("condition_scores", {})

    out: Dict[str, dict] = {}
    for cond, score in condition_scores.items():
        level, color = _risk_band_from_score(score)
        key = cond.lower()
        out[key] = {
            "probability": float(score),
            "risk_level": level,
            "color": color,
            "contributing_factors": calc.get("contributing_factors", []),
            "recommendation": calc.get("recommendation"),
        }

    return out
