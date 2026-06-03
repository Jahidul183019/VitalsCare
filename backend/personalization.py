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
            
        patient = profile.get("patient", {})
        suggestions_en = []
        suggestions_bn = []
        
        if patient.get("smoking") is True:
            suggestions_en.append("quit smoking to improve cardiovascular health")
            suggestions_bn.append("হৃদযন্ত্রের স্বাস্থ্য উন্নত করতে ধূমপান ত্যাগ করুন")
            
        systolic = patient.get("systolic_bp", 0)
        diastolic = patient.get("diastolic_bp", 0)
        if systolic > 140 or diastolic > 90:
            suggestions_en.append("regularly monitor your blood pressure and consult a doctor")
            suggestions_bn.append("নিয়মিত রক্তচাপ মাপুন এবং ডাক্তারের পরামর্শ নিন")
            
        if patient.get("bmi", 0) > 25.0:
            suggestions_en.append("manage weight through a balanced diet")
            suggestions_bn.append("সুষম খাদ্যের মাধ্যমে ওজন নিয়ন্ত্রণে রাখুন")
            
        if patient.get("salt_intake") == "high":
            suggestions_en.append("reduce dietary salt intake")
            suggestions_bn.append("খাবারে লবণের পরিমাণ কমান")
            
        if patient.get("activity_level") == "low":
            suggestions_en.append("engage in at least 30 minutes of daily physical activity")
            suggestions_bn.append("প্রতিদিন অন্তত ৩০ মিনিট শারীরিক ব্যায়াম করুন")
            
        if patient.get("stress_level") == "high":
            suggestions_en.append("practice mindfulness or relaxation techniques")
            suggestions_bn.append("মানসিক চাপ কমাতে ধ্যানের অভ্যাস করুন")
            
        # Limit to top 2 priority suggestions
        suggestions_en = suggestions_en[:2]
        suggestions_bn = suggestions_bn[:2]
        
        if not suggestions_en:
            if lang == "bn":
                return {"message": "আপনার ব্যক্তিগত সুপারিশ: স্বাস্থ্যকর জীবনযাপন বজায় রাখুন।"}
            return {"message": "Personalized suggestion: maintain a healthy lifestyle."}
            
        if lang == "bn":
            message = "আপনার ব্যক্তিগত সুপারিশ: " + " এবং ".join(suggestions_bn) + "।"
        else:
            message = "Personalized suggestion: " + " and ".join(suggestions_en) + "."
            
        return {"message": message}


personalization = _Personalization()
