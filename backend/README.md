# VitalsCare Backend Infrastructure

The VitalsCare backend is a robust FastAPI application serving as the intelligence engine for the platform. It orchestrates a multi-step pipeline combining traditional machine learning, Retrieval-Augmented Generation (RAG), and Large Language Models (LLMs) to deliver clinical insights.

## Core Processing Pipeline

Every assessment request (`POST /assess`) triggers a 5-step analytical pipeline:

1. **Machine Learning Classification (XGBoost):** Evaluates patient biometrics against models trained on over 170,000 real-world clinical records to predict risks for Diabetes, CVD, Hypertension, and Malnutrition.
2. **Retrieval-Augmented Generation (RAG):** Extracts disease-specific context from integrated WHO guidelines and Bangladesh DGHS medical documents.
3. **Knowledge Graph Reasoning:** Maps complex interactions between identified risk factors to uncover comorbidity patterns.
4. **LLM Synthesis (Gemini 2.5 Flash):** Processes the combined ML, RAG, and graph data to generate highly personalized, culturally appropriate health recommendations.
5. **Personalization Engine:** Tracks historical user trends to provide continuous micro-suggestions.

## Model Training & Datasets

Our predictive models are trained exclusively on verified clinical datasets:

| Disease Target | Dataset Source | Records | Accuracy |
|----------------|----------------|---------|----------|
| **Diabetes** | Kaggle (iammustafatz) | 100,000 | 97.26% |
| **Cardiovascular (CVD)** | Kaggle (fedesoriano) | 918 | 74.46% |
| **Hypertension** | Kaggle (miadul) | 1,186 | 74.79% |
| **Malnutrition (BMI Proxy)** | Kaggle (sulianova) | 69,965 | 99.83% |

*Trained models are cached locally using `joblib` for high-performance inference.*

## Environment Configuration

Ensure the following environment variables are configured in your deployment environment (e.g., Render):

- `GEMINI_API_KEY`: Required for LLM synthesis and conversational AI features.
- `DATABASE_URL`: Required for persistent user and session storage (PostgreSQL recommended).

## API Surface

- `GET /health`: System health and AI service connectivity checks.
- `POST /assess`: Initiates the core diagnostic pipeline.
- `POST /chat`: Engages the conversational AI Health Agent.
- `GET /model/info`: Retrieves current model accuracy and training telemetry.

---
*Developed for Infinity AI BuildFest 2026.*
