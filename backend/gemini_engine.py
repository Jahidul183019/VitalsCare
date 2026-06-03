import requests
import os

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()


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
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
        
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
            "model": "gemini-2.0-flash",
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
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
        
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
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash?key={GEMINI_API_KEY}"
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


# =========================
# CHATBOT ASSISTANT
# =========================
def chat_with_gemini(messages: list, lang: str = "en") -> str:
    system_instruction = f"""
    You are VitalCare Assistant, an empathetic, highly specialized and professional medical information assistant for non-communicable disease (NCD) preventative screening in Bangladesh. 

    CRITICAL HEALTHCARE BOT RULES:
    - Maintain a humble, professional, clear, and clinical precision tone at all times.
    - Encourage healthy diets (low-salt, low-starch, whole foods), exercise, and routine medical evaluations.
    - You must always state that your advice is for informational and screening awareness purposes only, and cannot substitute for a licensed professional physician or formal medical diagnosis.
    - Keep your paragraphs clear, readable, and highly focused. Limit responses to around 150-200 words.
    """
    
    if lang == "bn":
        system_instruction += "\n- If the user asks in Bengali (বাংলা), respond in perfect, warm and natural Bengali. E.g., using polite 'আপনি' address."
    
    if not GEMINI_API_KEY:
        if lang == "bn":
            return "আমি বর্তমানে অফলাইন মুডে চলছি কারণ সার্ভার সম্পূর্ণ লোড হচ্ছে। একটি সক্রিয় এআই উত্তর পেতে আপনি আমাদের 'Assess' স্ক্রীনিং প্রোগ্রামটি চালু করতে পারেন!"
        return "I am currently running in Offline mode as the server has not fully loaded. To see a dynamic response, you can launch the Screening Assessment program!"

    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
        
        # Map message history to Gemini format
        formatted_contents = []
        for m in messages:
            role = "user" if m.get("sender") == "user" else "model"
            formatted_contents.append({
                "role": role,
                "parts": [{"text": m.get("text", "")}]
            })
            
        payload = {
            "contents": formatted_contents,
            "systemInstruction": {
                "role": "user",
                "parts": [{"text": system_instruction}]
            },
            "generationConfig": {
                "maxOutputTokens": 300,
                "temperature": 0.3
            }
        }
        
        response = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=15)
        response_data = response.json()
        
        if response.status_code != 200:
            raise Exception(f"Gemini Chat API Error: {response_data.get('error', {}).get('message', 'Unknown Error')}")
            
        return response_data.get("candidates", [])[0].get("content", {}).get("parts", [])[0].get("text", "")

    except Exception as e:
        print(f"Chatbot Gemini Error: {e}")
        if lang == "bn":
            return "দুঃখিত, এআই সার্ভারটি বর্তমানে উপলব্ধ নেই। অনুগ্রহ করে আপনার সেটিংস যাচাই করুন।"
        return "AI service is currently unavailable. Please verify your GEMINI_API_KEY settings or try again later."


