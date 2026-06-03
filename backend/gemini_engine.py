import requests
import os

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")


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

    if not GEMINI_API_KEY:
        return {
            "ai_advice": get_fallback_advice(risk_scores, lang),
            "model": "fallback",
            "language": lang,
            "status": "error",
            "error": "GEMINI_API_KEY is not set."
        }

    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
        
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "maxOutputTokens": 300,
                "temperature": 0.2
            }
        }
        
        response = requests.post(
            url,
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=15
        )
        
        response_data = response.json()
        
        if response.status_code != 200:
            raise Exception(f"Gemini API Error: {response_data.get('error', {}).get('message', 'Unknown Error')}")
            
        ai_text = response_data.get("candidates", [])[0].get("content", {}).get("parts", [])[0].get("text", "")

        return {
            "ai_advice": ai_text,
            "model": "gemini-1.5-flash",
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
def explain_risk_with_gemini(
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

    if not GEMINI_API_KEY:
        return f"{disease} risk is {risk_level} based on health data."

    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
        
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "maxOutputTokens": 100,
                "temperature": 0.2
            }
        }
        
        response = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=10)
        
        if response.status_code != 200:
            raise Exception()
            
        return response.json().get("candidates", [])[0].get("content", {}).get("parts", [])[0].get("text", "")

    except Exception:
        return f"{disease} risk is {risk_level} based on health data."


# =========================
# CHECK GEMINI STATUS
# =========================
def check_gemini_running() -> bool:
    if not GEMINI_API_KEY:
        return False
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash?key={GEMINI_API_KEY}"
        r = requests.get(url, timeout=5)
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
        if high_risks:
            return f"আপনার {', '.join(high_risks)}-এর উচ্চ ঝুঁকি আছে। দয়া করে ডাক্তারের পরামর্শ নিন।"
        return "আপনার স্বাস্থ্য ঝুঁকি কম। সুস্থ জীবনযাপন চালিয়ে যান।"
    else:
        if high_risks:
            return f"High risk detected for {', '.join(high_risks)}. Please consult a doctor."
        return "Your health risk is low. Keep maintaining healthy habits."

