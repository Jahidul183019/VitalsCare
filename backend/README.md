# VitalsCare v3.0 - Local AI Backend

Backend prototype for the VitalsCare platform. 

This service accepts community health inputs and returns comprehensive JSON risk assessments, combining machine learning with local LLM reasoning and localized medical guidelines.

## Key Features

1. **XGBoost ML Classification**: Predicts risk probabilities for Hypertension, Diabetes, Malnutrition, and Heart Disease using trained XGBoost models.
2. **RAG Pipeline**: Retrieves highly relevant context from WHO clinical guidelines and Bangladesh DGHS localized protocols.
3. **Knowledge Graph Engine**: Maps patient risk factors into a conceptual graph to uncover hidden interactions and comorbidities.
4. **Google Gemini API**: Uses Gemini Cloud LLM to synthesize ML data, graph insights, and RAG context into personalized clinical advice.
5. **Rule-Based Personalization Engine**: Deterministically triggers actionable micro-suggestions based on specific patient risk factors (e.g., smoking, high BMI).
6. **Bilingual Support**: Full support for both English and Bengali (`bn`) languages across LLM generations, explanations, and personalization.
7. **Live WHO Scraping**: Endpoints to scrape the latest WHO fact sheets directly from the web (`/scrape/refresh`).
8. **Authentication**: Built-in SQLite/PostgreSQL auth system with JWT tokens for user registration, login, and profile management.

## Install

```bash
pip install -r requirements.txt
```

## Run locally

From the `backend/` folder:

```bash
uvicorn app:app --reload
```

## Health check

```bash
curl http://127.0.0.1:8000/health
```

## Assess risk

```bash
curl -X POST http://127.0.0.1:8000/assess \
  -H 'Content-Type: application/json' \
  -d '{
    "age": 52,
    "systolic_bp": 146,
    "diastolic_bp": 94,
    "bmi": 29.4,
    "family_history": true,
    "activity_level": "low",
    "diet_quality": "poor",
    "smoking": true,
    "salt_intake": "high",
    "stress_level": "high",
    "dietary_diversity": 4.5,
    "income_level": "medium",
    "children_under5": 1,
    "lang": "en"
  }'
```

## Input format

Required fields:
- `age` (int)
- `systolic_bp` (float)
- `diastolic_bp` (float)
- `bmi` (float)
- `family_history` (bool)
- `activity_level` (one of `low`, `medium`, `high`)
- `diet_quality` (one of `poor`, `average`, `good`)
- `smoking` (bool)
- `salt_intake` (one of `low`, `medium`, `high`)
- `stress_level` (one of `low`, `medium`, `high`)
- `dietary_diversity` (float, 0-10)
- `income_level` (one of `low`, `medium`, `high`)
- `children_under5` (int)
- `lang` (`en` or `bn`)

## Prototype notes

- This is not a clinical diagnostic tool.
- The model is intentionally conservative and explainable.
- The recommendation text is written for a community screening demo and should be reviewed with clinical partners before real-world use.
- The frontend calls this API through Vite's `/api` proxy during local development.
- The backend uses PostgreSQL when `DATABASE_URL` is set, which is the expected Render deployment setup.
- If `DATABASE_URL` is not set, the backend falls back to a local SQLite database file in `backend/data.sqlite3` for development.
- To use the LLM capabilities and automatic Bengali translation, provide a valid Google Gemini API Key via the `GEMINI_API_KEY` environment variable.
