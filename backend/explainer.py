"""Explainability helper — creates short human-readable explanations.

This is a simple function that formats contributing factors into
one- or two-sentence explanations suitable for display.
"""
from __future__ import annotations

from typing import Dict, Any


def explain_risk(disease: str, risk_data: Dict[str, Any], patient: dict, lang: str = "en") -> str:
    factors = risk_data.get("contributing_factors") or []
    top = factors[0]["reason"] if factors else "no clear dominant factors"
    if lang == "bn":
        return f"{disease} ঝুঁকির প্রধান কারণ: {top}. পরামর্শ: {risk_data.get('recommendation', '')}"
    return f"Primary reason for {disease} risk: {top}. Recommendation: {risk_data.get('recommendation', '')}"
