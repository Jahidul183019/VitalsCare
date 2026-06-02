import requests


OLLAMA_URL = "https://unpopular-creasing-panoramic.ngrok-free.de"


# =========================
# MAIN AI GENERATION
# =========================
def generate_recommendation(
    patient_data: dict,
    risk_scores: dict,
    who_context: str,
    graph_insights: dict,
    lang: str = "en"
) -> dict:

    language_instruction = (
        "Respond entirely in Bengali (বাংলা) script."
        if lang == "bn"
        else "Respond in simple English."
    )

    prompt = f"""
You are VitalsCare AI, a medical assistant 
for rural Bangladesh health workers.

{language_instruction}

PATIENT PROFILE:
- Age: {patient_data.get('age')} years
- BMI: {patient_data.get('bmi')}
- Blood Pressure: {patient_data.get('systolic_bp')}/{patient_data.get('diastolic_bp')} mmHg
- Activity: {patient_data.get('activity_level')}
- Diet: {patient_data.get('diet_quality')}
- Smoking: {patient_data.get('smoking')}
- Family History: {patient_data.get('family_history')}
- Income: {patient_data.get('income_level')}

ML RISK SCORES:
{risk_scores}

WHO GUIDELINES:
{who_context}

KNOWLEDGE GRAPH INSIGHTS:
{graph_insights}

Provide:
1. Simple 2-line summary
2. Top 3 actions
3. Bangladesh food advice
4. Doctor warning

Max 150 words.
"""

    try:
        response = requests.post(
            f"{OLLAMA_URL}/api/generate",
            json={
                "model": "gemma2",
                "prompt": prompt,
                "stream": False
            },
            timeout=60
        )

        return {
            "ai_advice": response.json().get("response", ""),
            "model": "gemma2 (ngrok)",
            "language": lang,
            "status": "success"
        }

    except Exception as e:
        return {
            "ai_advice": get_fallback_advice(risk_scores, lang),
            "model": "fallback",
            "language": lang,
            "status": "error",
            "error": str(e)
        }


# =========================
# RISK EXPLANATION
# =========================
def explain_risk_with_ollama(
    disease: str,
    risk_level: str,
    factors: list,
    lang: str = "en"
) -> str:

    language_instruction = (
        "Respond in Bengali (বাংলা)."
        if lang == "bn"
        else "Respond in simple English."
    )

    prompt = f"""
{language_instruction}

Patient has {risk_level} risk for {disease}.
Factors: {factors}

Explain in 2 simple sentences.
No medical jargon.
"""

    try:
        response = requests.post(
            f"{OLLAMA_URL}/api/generate",
            json={
                "model": "gemma2",
                "prompt": prompt,
                "stream": False
            },
            timeout=60
        )

        return response.json().get("response", "")

    except Exception:
        return f"{disease} risk is {risk_level} based on health data."


# =========================
# CHECK OLLAMA STATUS
# =========================
def check_ollama_running() -> bool:
    try:
        r = requests.get(f"{OLLAMA_URL}/api/tags", timeout=5)
        return r.status_code == 200
    except:
        return False


# =========================
# FALLBACK ADVICE
# =========================
def get_fallback_advice(risk_scores: dict, lang: str) -> str:

    high_risks = [
        d for d, v in risk_scores.items()
        if v.get("risk_level") == "high"
    ]

    if lang == "bn":
        return (
            f"উচ্চ ঝুঁকি: {', '.join(high_risks)}. ডাক্তার দেখান।"
            if high_risks else
            "আপনার স্বাস্থ্য ভালো আছে।"
        )

    return (
        f"High risk: {', '.join(high_risks)}. See doctor."
        if high_risks else
        "Your health is good."
    )
