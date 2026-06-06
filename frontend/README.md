# VitalsCare — NCD Health Risk Radar

**VitalsCare** is an AI-powered health risk screening platform for Non-Communicable Diseases (NCDs) like hypertension, diabetes, and cardiovascular disease, featuring interactive dashboards and full Bengali language support.

## Architecture

This repository contains the **Frontend** application for VitalsCare.
The backend (containing the ML engine and Gemini AI pipelines) has been decoupled and deployed independently on Render (`https://health-risk-radar.onrender.com`).

The frontend is built with:
- **React 19**
- **Vite**
- **Tailwind CSS v4**
- **Lucide Icons**
- **Vercel** (for deployment)

## Getting Started

### Prerequisites

- Node.js 18+

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables (Optional for local AI features):**
   Copy `.env.example` to `.env.local` and add your Gemini API key:
   ```bash
   cp .env.example .env.local
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173`. 
Note: API requests to `/api/*` are configured in `vercel.json` to proxy to the live Render backend in production.

## Project Structure

```
VitalsCare/frontend/
├── src/
│   ├── components/       # UI Components (Dashboards, Landing, Chatbot)
│   ├── utils/            # Helper functions
│   ├── types.ts          # TypeScript definitions
│   ├── App.tsx           # Main application routing
│   └── main.tsx          # React entry point
├── public/               # Static assets
├── index.html            # Vite entry point
├── vite.config.ts        # Vite configuration
└── vercel.json           # Vercel deployment & proxy rules
```
