# Frontend

This folder contains the React UI for Community Health Risk Radar.

Current frontend responsibilities:

- collect patient inputs
- call the FastAPI backend through `/api/assess`
- display the returned JSON risk summary
- show risk level, color code, contributing factors, and recommendation

## Local development

Run the frontend from this folder with:

```bash
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:3000/` and proxies `/api` to the backend at `http://127.0.0.1:8000`, so the frontend can talk to the API without hard-coding a backend URL.

If you want both services together, run the root-level `start.sh` script from the project root.
