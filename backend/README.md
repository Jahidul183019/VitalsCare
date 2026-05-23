# Health Risk Radar

Backend prototype for Infinity AI BuildFest 2026.

This service accepts a small set of community health inputs and returns JSON risk assessments for:

- Hypertension
- Diabetes

It is designed for a hackathon demo, so the logic is intentionally simple, explainable, and easy to show in a 3-minute video.

## What it does

- Uses rule-based thresholds as the primary scoring layer
- Optionally blends in a synthetic scikit-learn Logistic Regression calibrator if the package is available
- Returns a color-coded risk level for each condition
- Includes explicit explanation fields so the score is easy to justify
- Produces clean JSON from an HTTP endpoint

## Run

```bash
uvicorn backend.app:app --reload
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
    "diet_quality": "poor"
  }'
```

## Input format

Required fields:

- `age`
- `systolic_bp`
- `diastolic_bp`
- `bmi`
- `family_history`
- `activity_level` one of `low`, `medium`, `high`
- `diet_quality` one of `poor`, `average`, `good`

## Prototype notes

- This is not a clinical diagnostic tool.
- The model is intentionally conservative and explainable.
- The recommendation text is written for a community screening demo and should be reviewed with clinical partners before real-world use.
- The frontend calls this API through Vite's `/api` proxy during local development.
