"""Personalization module with a simple in-memory profile store.

Used by the app to update and fetch simple personalized messages.
"""
from __future__ import annotations

from typing import Dict, Any

_STORE: Dict[str, Dict[str, Any]] = {}


class _Personalization:
    @staticmethod
    def update_profile(user_id: str, patient_data: dict, risk_scores: dict) -> None:
        _STORE[user_id] = {"patient": patient_data, "risk": risk_scores}

    @staticmethod
    def get_personalized_message(user_id: str, lang: str = "en") -> Dict[str, str]:
        profile = _STORE.get(user_id)
        if not profile:
            return {"message": "No personalization available." if lang == "en" else "কোনো ব্যক্তিগতকরণ উপলব্ধ নেই।"}
        if lang == "bn":
            return {"message": "আপনার ব্যক্তিগত সুপারিশ: নিয়মিত হাঁটা এবং লবণ কমান।"}
        return {"message": "Personalized suggestion: walk regularly and reduce salt."}


personalization = _Personalization()
