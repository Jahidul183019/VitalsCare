"""XGBoost risk classification models for community health screening.

This module generates a representative synthetic patient training set
and fits three XGBoost classifiers (for Hypertension, Diabetes, and Heart Disease)
on startup. These models are then used to predict risk probabilities.
"""
from __future__ import annotations

import numpy as np
import xgboost as xgb
from typing import Dict, Any

# Global cache for trained models
_models: Dict[str, xgb.XGBClassifier] = {}


def _generate_synthetic_data(n_samples: int = 1000) -> tuple[np.ndarray, dict[str, np.ndarray]]:
    """Generate synthetic patient data with clinical patterns for model training."""
    np.random.seed(42)
    
    # Generate random features
    age = np.random.randint(18, 85, size=n_samples)
    systolic_bp = np.random.randint(90, 180, size=n_samples)
    diastolic_bp = np.random.randint(60, 110, size=n_samples)
    bmi = np.random.uniform(15.0, 40.0, size=n_samples)
    family_history = np.random.choice([0, 1], p=[0.7, 0.3], size=n_samples)
    
    # Categorical mappings
    # activity_level: low=0, medium=1, high=2
    activity_level = np.random.choice([0, 1, 2], p=[0.3, 0.5, 0.2], size=n_samples)
    # diet_quality: poor=0, average=1, good=2
    diet_quality = np.random.choice([0, 1, 2], p=[0.2, 0.6, 0.2], size=n_samples)
    # smoking: yes=1, no=0
    smoking = np.random.choice([0, 1], p=[0.8, 0.2], size=n_samples)
    # stress_level: low=0, medium=1, high=2
    stress_level = np.random.choice([0, 1, 2], p=[0.2, 0.6, 0.2], size=n_samples)
    # salt_intake: low=0, medium=1, high=2
    salt_intake = np.random.choice([0, 1, 2], p=[0.2, 0.5, 0.3], size=n_samples)

    X = np.column_stack([
        age, systolic_bp, diastolic_bp, bmi, family_history,
        activity_level, diet_quality, smoking, stress_level, salt_intake
    ])

    # 1. Hypertension risk heuristics
    ht_score = (
        (systolic_bp - 120) * 0.5 + 
        (diastolic_bp - 80) * 0.8 + 
        (age - 40) * 0.2 + 
        (bmi - 25) * 0.5 + 
        family_history * 10 - 
        activity_level * 5 + 
        salt_intake * 8
    )
    y_hypertension = (ht_score > 15).astype(int)

    # 2. Diabetes risk heuristics
    db_score = (
        (bmi - 25) * 1.5 + 
        (age - 45) * 0.3 + 
        family_history * 25 - 
        activity_level * 10 + 
        (diet_quality == 0) * 15
    )
    y_diabetes = (db_score > 10).astype(int)

    # 3. Heart Disease risk heuristics
    hd_score = (
        (systolic_bp - 120) * 0.4 + 
        (age - 50) * 0.5 + 
        smoking * 30 + 
        family_history * 15 + 
        (bmi - 25) * 0.8 + 
        stress_level * 10 - 
        activity_level * 8
    )
    y_heart_disease = (hd_score > 20).astype(int)

    targets = {
        "hypertension": y_hypertension,
        "diabetes": y_diabetes,
        "heart_disease": y_heart_disease
    }

    return X, targets


def init_models() -> None:
    """Train and cache the XGBoost classifiers on synthetic datasets."""
    global _models
    X, targets = _generate_synthetic_data()
    for disease, y in targets.items():
        model = xgb.XGBClassifier(
            n_estimators=30,
            max_depth=3,
            learning_rate=0.1,
            random_state=42,
            eval_metric="logloss"
        )
        model.fit(X, y)
        _models[disease] = model


def _map_patient_to_features(patient: dict) -> np.ndarray:
    """Convert raw patient dictionary to a numerical feature vector matching the model schema."""
    activity_map = {"low": 0, "medium": 1, "high": 2}
    diet_map = {"poor": 0, "average": 1, "good": 2}
    stress_map = {"low": 0, "medium": 1, "high": 2}
    salt_map = {"low": 0, "medium": 1, "high": 2}

    age = float(patient.get("age", 40))
    systolic_bp = float(patient.get("systolic_bp", 120))
    diastolic_bp = float(patient.get("diastolic_bp", 80))
    bmi = float(patient.get("bmi", 23.0))
    family_history = 1.0 if patient.get("family_history") else 0.0
    
    activity = activity_map.get(str(patient.get("activity_level")).lower(), 1)
    diet = diet_map.get(str(patient.get("diet_quality")).lower(), 1)
    smoking = 1.0 if patient.get("smoking") else 0.0
    stress = stress_map.get(str(patient.get("stress_level")).lower(), 1)
    salt = salt_map.get(str(patient.get("salt_intake")).lower(), 1)

    return np.array([[
        age, systolic_bp, diastolic_bp, bmi, family_history,
        activity, diet, smoking, stress, salt
    ]])


def predict_risks(patient_data: dict) -> Dict[str, dict]:
    """Exposes risk probabilities and levels for Hypertension, Diabetes, and Heart Disease."""
    # Ensure models are trained
    if not _models:
        init_models()
        
    features = _map_patient_to_features(patient_data)
    out: Dict[str, dict] = {}
    
    for disease in ["hypertension", "diabetes", "heart_disease"]:
        model = _models[disease]
        prob = float(model.predict_proba(features)[0][1] * 100)
        
        # Risk level classification
        if prob < 35.0:
            level = "low"
            color = "green"
        elif prob < 70.0:
            level = "medium"
            color = "yellow"
        else:
            level = "high"
            color = "red"

        # Determine contributing factors dynamically based on inputs
        factors = []
        if disease == "hypertension":
            if float(patient_data.get("systolic_bp", 120)) >= 130 or float(patient_data.get("diastolic_bp", 80)) >= 85:
                factors.append({"input": "blood_pressure", "points": 40, "reason": "Elevated blood pressure measurements"})
            if float(patient_data.get("bmi", 23)) >= 25:
                factors.append({"input": "bmi", "points": 15, "reason": "Overweight / Obesity"})
            if patient_data.get("salt_intake") == "high":
                factors.append({"input": "salt_intake", "points": 15, "reason": "High dietary salt intake"})
            if patient_data.get("family_history"):
                factors.append({"input": "family_history", "points": 15, "reason": "Family history of cardiovascular issues"})
            if patient_data.get("activity_level") == "low":
                factors.append({"input": "activity_level", "points": 10, "reason": "Sedentary lifestyle"})
        elif disease == "diabetes":
            if float(patient_data.get("bmi", 23)) >= 25:
                factors.append({"input": "bmi", "points": 35, "reason": "Higher body weight indexes"})
            if patient_data.get("family_history"):
                factors.append({"input": "family_history", "points": 25, "reason": "Family history of diabetes"})
            if patient_data.get("activity_level") == "low":
                factors.append({"input": "activity_level", "points": 15, "reason": "Lack of regular exercise"})
            if patient_data.get("diet_quality") == "poor":
                factors.append({"input": "diet_quality", "points": 15, "reason": "Diets rich in simple starches/sugars"})
            if float(patient_data.get("age", 40)) >= 45:
                factors.append({"input": "age", "points": 10, "reason": "Increased risk due to aging"})
        elif disease == "heart_disease":
            if float(patient_data.get("systolic_bp", 120)) >= 140:
                factors.append({"input": "blood_pressure", "points": 30, "reason": "Stage-2 high blood pressure"})
            if patient_data.get("smoking"):
                factors.append({"input": "smoking", "points": 30, "reason": "Active smoking habit"})
            if patient_data.get("stress_level") == "high":
                factors.append({"input": "stress_level", "points": 15, "reason": "High emotional or physical stress"})
            if float(patient_data.get("bmi", 23)) >= 28:
                factors.append({"input": "bmi", "points": 15, "reason": "Obesity strain on the heart"})
            if patient_data.get("activity_level") == "low":
                factors.append({"input": "activity_level", "points": 10, "reason": "Lack of cardiorespiratory exercise"})

        if not factors:
            factors.append({"input": "none", "points": 0, "reason": "No high-risk lifestyle or biomarker indicators detected"})

        # Primary recommendation
        rec = "Follow routine health guidance."
        if disease == "hypertension":
            if prob >= 70.0:
                rec = "Consult a doctor this week. Reduce daily salt, take blood pressure readings daily, and walk 30 mins."
            elif prob >= 35.0:
                rec = "Monitor blood pressure weekly. Cut down on salty pickles and processed foods."
            else:
                rec = "Maintain a low-sodium diet and check blood pressure during routine screenings."
        elif disease == "diabetes":
            if prob >= 70.0:
                rec = "Schedule a HbA1c test immediately. Limit rice/bread portions and avoid added sugars."
            elif prob >= 35.0:
                rec = "Track fasting blood sugar. Replace sweetened tea and soda with water."
            else:
                rec = "Keep a balanced, low-sugar diet and exercise 150 minutes per week."
        elif disease == "heart_disease":
            if prob >= 70.0:
                rec = "Urgent clinical checkup recommended. Quit smoking immediately, start cardiac-friendly activities, and check cholesterol."
            elif prob >= 35.0:
                rec = "Focus on stress reduction, avoid high-fat meals, and quit or reduce smoking."
            else:
                rec = "Continue regular aerobic exercise and eat a diet rich in green leafy vegetables."

        out[disease] = {
            "probability": prob,
            "risk_level": level,
            "color": color,
            "contributing_factors": factors,
            "recommendation": rec
        }
        
    return out


# Automatically train on import
init_models()
