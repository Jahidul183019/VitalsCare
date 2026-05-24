# Health Risk Radar

Backend-plus-frontend prototype for Infinity AI BuildFest 2026.

This project is a simple, explainable HealthTech demo for rural community screening. It includes authentication, a profile page, a landing page, an assessment form, and a dashboard that renders the backend's JSON response directly.

## Project Structure

```text
Health-Risk-Radar/
├── backend/
│   ├── app.py
│   ├── db.py
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
- Handles login, register, profile update, password change, and logout endpoints
- Uses PostgreSQL when `DATABASE_URL` is set, with SQLite fallback for local development

## Risk Logic

The scoring engine uses transparent, rule-based logic for:

- Hypertension
- Diabetes

It also uses `recommendations.json` to map a primary condition and risk level to localized advice suitable for a community health worker in rural Bangladesh.

## Frontend

The `frontend/` folder contains the UI layer. It calls the backend through a Vite proxy and renders:

- login and registration screens
- landing page navigation
- profile and logout flow
- risk level
- color-coded status
- contributing factors
- actionable recommendation

### Frontend development

From the `frontend/` folder:

```bash
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:3000/` and proxies `/api` to `http://127.0.0.1:8000`.

To verify the frontend build:

```bash
npm run build
```

## Local Setup

From the project root, install dependencies if needed:

```bash
cd backend && pip install -r requirements.txt
cd ../frontend && npm install
```

## Run the App

```bash
bash start.sh
```

This starts both services:

- Frontend: `http://localhost:3000/` or the next available Vite port if 3000 is busy
- Backend: `http://127.0.0.1:8000/`

If you want to run only the backend from the `backend/` folder, use:

```bash
uvicorn app:app --reload
```

If you want to run only the backend from the project root, use:

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
- Set `DATABASE_URL` on Render or any Postgres host to enable the Postgres-backed runtime.
