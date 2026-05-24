# Frontend

This folder contains the React UI for VitalsCare / Health Risk Radar.

Current frontend responsibilities:

- show the landing page and navigation shell
- handle login, registration, profile, and logout flows
- collect patient inputs in the assessment form
- call the FastAPI backend through `/api/assess`
- display the returned JSON risk summary, including risk level, color code, contributing factors, and recommendation

## Local development

Run the frontend from this folder with:

```bash
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:3000/` and proxies `/api` to the backend at `http://127.0.0.1:8000`, so the frontend can talk to the API without hard-coding a backend URL.

## Production build

```bash
npm run build
```

## If you want both services together

Run the root-level `start.sh` script from the project root.
