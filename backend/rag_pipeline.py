"""RAG pipeline retrieving clinical guidelines from WHO/DGHS PDFs and text files.

This system scans the `who_data` directory for PDFs, text files, and markdown documents,
extracts text, chunks it, and performs a TF-IDF term overlap query matching. It falls
back to localized default files if no reference guides are placed in `who_data`.
"""
from __future__ import annotations

import os
import re
import math
from typing import Dict, List, Any

try:
    import pypdf
except ImportError:
    pypdf = None


def _split_text(text: str, source_name: str, chunk_size: int = 500, overlap: int = 100) -> List[Dict[str, str]]:
    """Splits a body of text into overlapping document chunks."""
    words = text.split()
    chunks = []
    
    step = chunk_size - overlap
    if step <= 0:
        step = chunk_size
        
    for i in range(0, len(words), step):
        chunk_words = words[i:i + chunk_size]
        chunk_text = " ".join(chunk_words).strip()
        if chunk_text:
            chunks.append({
                "text": chunk_text,
                "source": source_name
            })
            
    return chunks


def _create_default_guidelines(data_dir: str) -> None:
    """Generate basic default guidelines in English and Bengali to bootstrap the RAG index."""
    # English Guides
    hypertension_en = (
        "WHO Hypertension Guidelines (2024)\n"
        "- Diagnosis of hypertension should be confirmed by a clinical professional.\n"
        "- Adults with hypertension should have their blood pressure measured at least annually.\n"
        "- Lifestyle modifications include reducing sodium intake to less than 2g/day (approx 5g of salt).\n"
        "- Promote physical activity of at least 150 minutes of moderate-intensity aerobic exercise per week.\n"
        "- Limit alcohol consumption and completely avoid tobacco smoking.\n"
        "- Patients with systolic blood pressure >= 140 mmHg or diastolic >= 90 mmHg require regular clinic reviews.\n"
        "- For high-risk individuals, drug treatment should be initiated immediately alongside lifestyle therapy."
    )
    
    diabetes_en = (
        "WHO Diabetes Screening & Care Guidelines (2024)\n"
        "- Screening for diabetes should be performed using fasting blood glucose or HbA1c tests.\n"
        "- Adults with a BMI over 25 kg/m2 or family history should be screened periodically.\n"
        "- Lifestyle advice should focus on nutrition: reduce simple carbohydrates, eliminate sugar-sweetened beverages.\n"
        "- Encourage eating high-fiber foods such as whole grains, vegetables, and lentils.\n"
        "- Recommend physical activity like brisk walking or cycling for 30 minutes daily.\n"
        "- Early screening helps prevent microvascular complications (neuropathy, retinopathy, nephropathy).\n"
        "- Maintain target HbA1c below 7.0% for most non-pregnant adults."
    )

    cvd_en = (
        "WHO Cardiovascular Disease (CVD) Prevention Guidelines (2024)\n"
        "- Total cardiovascular risk assessment should incorporate age, BP, smoking status, BMI, and family history.\n"
        "- Tobacco cessation is the most effective intervention for reducing cardiovascular event risks.\n"
        "- Advise a heart-healthy diet low in saturated fats and trans-fats, and rich in whole grains.\n"
        "- Recommend active stress management and adequate sleep (7-8 hours per night).\n"
        "- Physical exercise improves cardiorespiratory fitness and lowers blood pressure.\n"
        "- High-risk patients should be evaluated for aspirin, statin, or beta-blocker therapy by a physician."
    )

    # Bengali Guides
    hypertension_bn = (
        "ডাব্লুএইচও হাইপারটেনশন নির্দেশিকা (২০২৪)\n"
        "- উচ্চ রক্তচাপের নির্ণয় পেশাদার দ্বারা নিশ্চিত করা উচিত।\n"
        "- উচ্চ রক্তচাপ রোগীদের অন্তত বছরে একবার রক্তচাপ পরিমাপ করা উচিত।\n"
        "- জীবনযাত্রার পরিবর্তনের মধ্যে প্রতিদিন সোডিয়াম গ্রহণ ২ গ্রামের কম করা (প্রায় ৫ গ্রাম লবণ) অন্তর্ভুক্ত।\n"
        "- প্রতি সপ্তাহে কমপক্ষে ১৫০ মিনিট মাঝারি-তীব্রতার অ্যারোবিক ব্যায়াম করুন।\n"
        "- অ্যালকোহল সেবন সীমিত করুন এবং তামাক ধূমপান সম্পূর্ণরূপে বর্জন করুন।\n"
        "- সিস্টোলিক রক্তচাপ >= ১৪০ বা ডায়াস্টোলিক >= ৯০ রোগীদের নিয়মিত ক্লিনিক পর্যালোচনা প্রয়োজন।"
    )
    
    diabetes_bn = (
        "ডাব্লুএইচও ডায়াবেটিস স্ক্রীনিং এবং যত্ন নির্দেশিকা (২০২৪)\n"
        "- ফাস্টিং রক্তে গ্লুকোজ বা HbA1c পরীক্ষার মাধ্যমে ডায়াবেটিস স্ক্রীনিং করা উচিত।\n"
        "- ২৫ বা তার বেশি বিএমআই বা পারিবারিক ইতিহাস থাকলে নিয়মিত স্ক্রীন করা উচিত।\n"
        "- পুষ্টির উপর গুরুত্ব দিন: সাধারণ শর্বরা কমিয়ে দিন, মিষ্টি পানীয় বর্জন করুন।\n"
        "- ফাইবার সমৃদ্ধ খাবার যেমন শাকসবজি, ডাল এবং লাল চালের ভাত খান।\n"
        "- প্রতিদিন ৩০ মিনিট হাঁটা বা সাইকেল চালানোর অভ্যাস করুন।"
    )

    cvd_bn = (
        "ডাব্লুএইচও কার্ডিওভাসকুলার ডিজিজ (সিভিডি) প্রতিরোধ নির্দেশিকা (২০২৪)\n"
        "- কার্ডিওভাসকুলার ঝুঁকি মূল্যায়নে বয়স, রক্তচাপ, ধূমপানের অভ্যাস এবং বিএমআই বিবেচনা করা উচিত।\n"
        "- তামাক বর্জন সবচেয়ে কার্যকর পদক্ষেপ।\n"
        "- সম্পৃক্ত চর্বিযুক্ত খাবার পরিহার করুন এবং শস্যজাতীয় খাবার বেশি খান।\n"
        "- মানসিক চাপ কমান এবং প্রতিদিন ৭-৮ ঘণ্টা পর্যাপ্ত ঘুমান।"
    )

    with open(os.path.join(data_dir, "who_hypertension_en.txt"), "w", encoding="utf-8") as f:
        f.write(hypertension_en)
    with open(os.path.join(data_dir, "who_diabetes_en.txt"), "w", encoding="utf-8") as f:
        f.write(diabetes_en)
    with open(os.path.join(data_dir, "who_cvd_en.txt"), "w", encoding="utf-8") as f:
        f.write(cvd_en)

    with open(os.path.join(data_dir, "who_hypertension_bn.txt"), "w", encoding="utf-8") as f:
        f.write(hypertension_bn)
    with open(os.path.join(data_dir, "who_diabetes_bn.txt"), "w", encoding="utf-8") as f:
        f.write(diabetes_bn)
    with open(os.path.join(data_dir, "who_cvd_bn.txt"), "w", encoding="utf-8") as f:
        f.write(cvd_bn)


def _load_guidelines(lang: str = "en") -> List[Dict[str, str]]:
    """Reads and parses PDFs and text files from the who_data folder."""
    chunks = []
    data_dir = os.path.join(os.path.dirname(__file__), "who_data")
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
        _create_default_guidelines(data_dir)

    for filename in os.listdir(data_dir):
        filepath = os.path.join(data_dir, filename)
        
        # Filter default files by language suffix if possible to prevent overlap
        if "_en.txt" in filename and lang == "bn":
            continue
        if "_bn.txt" in filename and lang == "en":
            continue

        if filename.endswith(".pdf"):
            if pypdf is None:
                print("pypdf is not installed, skipping PDF reading")
                continue
            try:
                reader = pypdf.PdfReader(filepath)
                text = ""
                for page in reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
                chunks.extend(_split_text(text, filename))
            except Exception as e:
                print(f"Error reading PDF {filename}: {e}")
        elif filename.endswith(".txt") or filename.endswith(".md"):
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    text = f.read()
                chunks.extend(_split_text(text, filename))
            except Exception as e:
                print(f"Error reading text {filename}: {e}")
                
    return chunks


def _retrieve_top_chunks(query: str, chunks: List[Dict[str, str]], top_k: int = 2) -> List[str]:
    """Simple term-matching algorithm to score and rank document chunks."""
    if not chunks:
        return []
    
    def tokenize(text: str) -> List[str]:
        return re.findall(r'[a-zA-Z0-9\u0980-\u09ff]+', text.lower())

    query_tokens = tokenize(query)
    scores = []
    
    for chunk in chunks:
        text = chunk["text"]
        tokens = tokenize(text)
        score = 0.0
        for token in query_tokens:
            tf = tokens.count(token)
            if tf > 0:
                score += (1.0 + math.log(tf))
        
        if len(tokens) > 0:
            score /= math.sqrt(len(tokens))
            
        scores.append((score, text))
        
    scores.sort(key=lambda x: x[0], reverse=True)
    
    # Return top_k matching blocks
    results = [text for score, text in scores if score > 0]
    return results[:top_k]


def get_who_recommendations(disease: str, risk_level: str, patient: dict, lang: str = "en") -> Dict[str, Any]:
    """Retrieve matches from the WHO guideline library based on disease context."""
    chunks = _load_guidelines(lang)
    
    # Construct a structured query matching the patient's state
    query = f"{disease} guidelines advice recommendations {risk_level} {patient.get('activity_level', '')} {patient.get('diet_quality', '')}"
    if lang == "bn":
        disease_map = {
            "hypertension": "উচ্চ রক্তচাপ হাইপারটেনশন",
            "diabetes": "ডায়াবেটিস রক্তে শর্করা গ্লুকোজ",
            "heart_disease": "হৃদরোগ কার্ডিওভাসকুলার স্ট্রোক"
        }
        query = f"{disease_map.get(disease.lower(), disease)} নির্দেশিকা পরামর্শ ঝুঁকি {risk_level}"

    matches = _retrieve_top_chunks(query, chunks, top_k=2)
    
    # Fallback to static lists if index returned no relevant text chunks
    if not matches:
        if lang == "bn":
            matches = [
                f"{disease} ঝুঁকির জন্য ডাব্লুএইচও নির্দেশিকা অনুসরণ করুন। লবণ গ্রহণ সীমিত রাখুন এবং শারীরিক পরিশ্রম বাড়ান।"
            ]
        else:
            matches = [
                f"Follow WHO standard protocol for {disease}. Modify lifestyle risk factors and consult a physician."
            ]

    return {
        "guidelines": matches,
        "source": "who_data_rag"
    }
