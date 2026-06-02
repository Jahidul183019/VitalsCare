import ollama
import os

def generate_recommendation(
    patient_data: dict,
    risk_scores: dict,
    who_context: str,
    graph_insights: dict,
    lang: str = "en"
) -> dict:
    """
    Ollama local LLM generates personalized
    health advice using ML + RAG context
    """

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
    
    ML RISK SCORES (XGBoost Results):
    {risk_scores}
    
    WHO GUIDELINES (Retrieved by RAG):
    {who_context}
    
    KNOWLEDGE GRAPH INSIGHTS:
    {graph_insights}
    
    Based on the ML scores and WHO guidelines above,
    provide:
    1. Simple 2-sentence health status summary
    2. Top 3 immediate actions
    3. Bangladesh-specific food advice
    4. When to see doctor
    
    Maximum 150 words. Very simple language.
    """

    try:
        response = ollama.chat(
            model='gemma2',
            messages=[
                {
                    'role': 'system',
                    'content': 'You are a helpful medical AI assistant for rural Bangladesh. Always give practical, simple advice.'
                },
                {
                    'role': 'user',
                    'content': prompt
                }
            ]
        )

        return {
            "ai_advice": response['message']['content'],
            "model": "Ollama Gemma2 (Local)",
            "language": lang,
            "status": "success",
            "offline": True
        }

    except Exception as e:
        return {
            "ai_advice": get_fallback_advice(risk_scores, lang),
            "model": "Fallback",
            "language": lang,
            "status": "fallback",
            "error": str(e)
        }


def explain_risk_with_ollama(
    disease: str,
    risk_level: str,
    factors: list,
    lang: str = "en"
) -> str:
    """Explain WHY patient got this risk score"""

    language_instruction = (
        "Respond in Bengali (বাংলা)."
        if lang == "bn"
        else "Respond in simple English."
    )

    prompt = f"""
    {language_instruction}
    
    Patient has {risk_level} risk for {disease}.
    Factors found by XGBoost AI: {factors}
    
    Explain in 2 simple sentences why they 
    have this risk. No medical jargon.
    Simple enough for a village health worker.
    """

    try:
        response = ollama.chat(
            model='gemma2',
            messages=[{'role': 'user', 'content': prompt}]
        )
        return response['message']['content']
    except:
        return f"Your {disease} risk is {risk_level} based on your health data."


def get_fallback_advice(risk_scores: dict, lang: str) -> str:
    """Backup if Ollama fails"""
    high_risks = [
        disease for disease, data in risk_scores.items()
        if data["risk_level"] == "high"
    ]

    if lang == "bn":
        if high_risks:
            return f"আপনার {', '.join(high_risks)}-এর উচ্চ ঝুঁকি আছে। দয়া করে ডাক্তারের পরামর্শ নিন।"
        return "আপনার স্বাস্থ্য ঝুঁকি কম। সুস্থ জীবনযাপন চালিয়ে যান।"
    else:
        if high_risks:
            return f"High risk detected for {', '.join(high_risks)}. Please consult a doctor."
        return "Your health risk is low. Keep maintaining healthy habits."


def check_ollama_running() -> bool:
    """Check if Ollama is running"""
    try:
        models = ollama.list()
        return True
    except:
        return False