"""Knowledge graph stub exposing `knowledge_graph.graph_reasoning()`.

Provides a tiny, deterministic reasoning output for demo purposes.
"""
from __future__ import annotations

from typing import Dict, Any


class _KG:
    @staticmethod
    def graph_reasoning(patient: dict, risk_scores: dict, lang: str = "en") -> Dict[str, Any]:
        # Produce a couple of simple insights.
        insights = []
        if patient.get("smoking"):
            insights.append("Smoking increases cardiovascular and diabetes risk.")
        if patient.get("salt_intake") == "high":
            insights.append("High salt intake may worsen blood pressure control.")
        return {"insights": insights}


knowledge_graph = _KG()
