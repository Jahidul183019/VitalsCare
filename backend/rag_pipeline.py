"""Simple RAG pipeline stub returning WHO-like guideline snippets.

This is a lightweight placeholder so the app can run locally
without an external RAG system. It returns a dict with a
`guidelines` list and optional metadata.
"""
from __future__ import annotations

from typing import Dict, List


def get_who_recommendations(disease: str, risk_level: str, patient: dict, lang: str = "en") -> Dict[str, List[str]]:
    # Minimal, static guideline snippets — replace with real RAG code later.
    snippets_en = {
        "hypertension": [
            "Measure blood pressure accurately and repeat after rest.",
            "Advise low-salt diet and increased physical activity.",
        ],
        "diabetes": [
            "Recommend fasting glucose test or HbA1c.",
            "Encourage reduction of sugary drinks and portion control.",
        ],
    }

    snippets_bn = {
        "hypertension": [
            "রক্তচাপ সঠিকভাবে পরিমাপ করুন এবং বিশ্রামের পরে পুনরায় পরিমাপ করুন।",
            "কম লবণজাতীয় খাবার এবং বেশি শারীরিক কার্যকলাপ পরামর্শ দিন।",
        ],
        "diabetes": [
            "ফাস্টিং গ্লুকোজ বা HbA1c পরীক্ষা করার পরামর্শ।",
            "মিষ্টি পানীয় কমান এবং অংশ-নিয়ন্ত্রণ করুন।",
        ],
    }

    key = disease.lower()
    if lang == "bn":
        guidelines = snippets_bn.get(key, ["সাধারণ স্বাস্থ্য সিস্টেম অনুসরণ করুন।"])
    else:
        guidelines = snippets_en.get(key, ["Follow routine primary care guidance."])

    return {"guidelines": guidelines, "source": "static_stub"}
