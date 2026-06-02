from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from ml_models import predict_risks
from rag_pipeline import get_who_recommendations
from explainer import explain_risk
from graph_engine import knowledge_graph
from personalization import personalization
from ollama_engine import (
    generate_recommendation,
    check_ollama_running
)

app = FastAPI(title="VitalsCare v3.0 - Local AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class PatientData(BaseModel):
    user_id: Optional[str] = "anonymous"
    age: int
    systolic_bp: float
    diastolic_bp: float
    bmi: float
    family_history: bool = False
    activity_level: str = "medium"
    diet_quality: str = "average"
    salt_intake: str = "medium"
    stress_level: str = "medium"
    smoking: bool = False
    dietary_diversity: float = 5.0
    income_level: str = "medium"
    children_under5: int = 0
    lang: str = "en"

@app.get("/health")
async def health():
    ollama_status = check_ollama_running()
    return {
        "status": "VitalsCare v3.0 Running ✅",
        "ollama": "connected ✅" if ollama_status else "not running ❌",
        "features": [
            "XGBoost ML ✅",
            "RAG Pipeline ✅",
            "Knowledge Graph ✅",
            "Ollama Local LLM ✅",
            "Bengali Support ✅",
            "Personalization ✅"
        ]
    }

@app.post("/assess")
async def assess(patient: PatientData):
    try:
        patient_dict = patient.dict()
        lang = patient_dict.get("lang", "en")
        user_id = patient_dict.get("user_id", "anonymous")

        # STEP 1: XGBoost ML
        print("🤖 Running XGBoost ML...")
        risk_scores = predict_risks(patient_dict)

        # STEP 2: RAG - Get WHO guidelines
        print("📚 Running RAG Pipeline...")
        who_context = ""
        full_results = {}

        for disease, risk_data in risk_scores.items():
            recommendations = get_who_recommendations(
                disease,
                risk_data["risk_level"],
                patient_dict,
                lang
            )
            explanation = explain_risk(
                disease,
                risk_data,
                patient_dict,
                lang
            )
            who_context += "\n".join(
                recommendations["guidelines"]
            )
            full_results[disease] = {
                **risk_data,
                "recommendations": recommendations,
                "explanation": explanation
            }

        # STEP 3: Knowledge Graph
        print("🕸️ Running Knowledge Graph...")
        graph_insights = knowledge_graph.graph_reasoning(
            patient_dict, risk_scores, lang
        )

        # STEP 4: Ollama LLM
        # Combines ML + RAG + Graph → Bengali advice
        print("🦙 Running Ollama LLM...")
        ai_recommendation = generate_recommendation(
            patient_data=patient_dict,
            risk_scores=risk_scores,
            who_context=who_context,
            graph_insights=graph_insights,
            lang=lang
        )

        # STEP 5: Personalization
        print("👤 Updating user profile...")
        personalization.update_profile(
            user_id, patient_dict, risk_scores
        )
        personal_message = personalization.get_personalized_message(
            user_id, lang
        )

        return {
            "status": "success",
            "language": lang,
            "risk_results": full_results,
            "ai_recommendation": ai_recommendation,
            "graph_insights": graph_insights,
            "personalization": personal_message,
            "pipeline": {
                "step1": "XGBoost ML ✅",
                "step2": "RAG + WHO Guidelines ✅",
                "step3": "Knowledge Graph ✅",
                "step4": "Ollama Local LLM ✅",
                "step5": "Personalization ✅"
            }
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
