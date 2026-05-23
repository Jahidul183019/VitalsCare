# Health Risk Radar

Backend-plus-frontend prototype for Infinity AI BuildFest 2026.

This project is a simple, explainable HealthTech demo for rural community screening. It takes a small set of patient inputs, computes risk for key conditions, and returns a JSON response that the frontend renders directly.

## Project Structure

```text
Health-Risk-Radar/
├── backend/
│   ├── app.py
│   ├── risk_engine.py
│   ├── recommendations.json
│   └── README.md
└── frontend/
  ├── src/
  ├── vite.config.ts
  └── README.md
```

## What the Backend Does

- Exposes a FastAPI app with CORS enabled for local frontend access
- Validates incoming patient data with Pydantic
- Sends the data to the explainable scoring engine in `risk_engine.py`
- Returns JSON containing risk level, color code, contributing factors, and recommendation

## Risk Logic

The scoring engine uses transparent, rule-based logic for:

- Hypertension
- Diabetes

It also uses `recommendations.json` to map a primary condition and risk level to localized advice suitable for a community health worker in rural Bangladesh.

## Frontend Plan

The `frontend/` folder contains the UI layer. It calls the backend through a Vite proxy and renders:

- risk level
- color-coded status
- contributing factors
- actionable recommendation

## Local Setup

From the project root, install dependencies if needed:

```bash
cd backend && python3 -m venv venv && source venv/bin/activate && pip install fastapi uvicorn pydantic
cd ../frontend && npm install
```

## Run the App

```bash
bash start.sh
```

This starts both services:

- Frontend: `http://localhost:3000/`
- Backend: `http://127.0.0.1:8000/`

If you want to run only the backend, use:

```bash
uvicorn backend.app:app --reload
```

The API will be available at:

- `http://127.0.0.1:8000/health`
- `http://127.0.0.1:8000/docs`
- `http://127.0.0.1:8000/assess`

## Test the API

Health check:

```bash
curl http://127.0.0.1:8000/health
```

Sample risk request:

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
    "diet_quality": "poor"
  }'
```

## API Input Fields

- `age`
- `systolic_bp`
- `diastolic_bp`
- `bmi`
- `family_history`
- `activity_level` with values `low`, `medium`, or `high`
- `diet_quality` with values `poor`, `average`, or `good`

## Notes

- This is a prototype, not a clinical diagnostic tool.
- The logic is intentionally simple and explainable for a hackathon demo.
- The localized recommendation content is meant for community screening and should be reviewed with medical partners before real-world use.
- The frontend posts to `/api/assess`, which Vite proxies to the backend `/assess` endpoint.
