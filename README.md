# MedCheck — मेडचेक

> CDSCO NSQ/spurious medicine batch checker — a Hindi-first mobile PWA for Indian users.

![MedCheck](./docs/hero.png)

## Features

| Feature | Details |
|---|---|
| 📷 **QR/Barcode scan** | GS1-128, QR codes — auto-fills all form fields |
| 🤖 **AI Label OCR** | Gemma 4 extracts drug name, batch, manufacturer, dates with per-field confidence |
| ✏️ **Editable confirm form** | Highlights low-confidence fields + look-alike char warnings (0/O, 1/I, 5/S, 8/B) |
| 🔍 **Fuzzy match** | pg_trgm + Levenshtein — returns MATCH_FOUND / POSSIBLE_MATCH / NOT_FOUND |
| 🔊 **TTS** | Web Speech API (Hindi-first) with server-side gTTS fallback |
| 🌐 **6 languages** | Hindi, English, Tamil, Bengali, Marathi, Telugu |
| 📱 **PWA** | Installable, offline-capable via Workbox |
| 📋 **Monthly pipeline** | Auto-downloads CDSCO PDFs, extracts tables with Gemma 4, idempotent |
| 🛡 **Admin review queue** | Side-by-side PDF page image + editable row, approve/reject |

## Quick Start

### Prerequisites
- Node.js 20+
- Python 3.12+
- Docker + Docker Compose
- (Optional) Ollama with `gemma3:4b` model

### 1. Start Infrastructure

```bash
# Start PostgreSQL (and optionally Ollama)
docker compose up db -d

# With local Ollama LLM:
docker compose --profile local-llm up -d
ollama pull gemma3:4b
```

### 2. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt

# Copy and edit .env
cp .env.example .env

# Run
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

## Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | postgresql+asyncpg://... | PostgreSQL connection |
| `LLM_PROVIDER` | `ollama` | `ollama` / `openai_compat` / `google` |
| `LLM_BASE_URL` | `http://localhost:11434` | Ollama / OpenAI base URL |
| `LLM_MODEL` | `gemma3:4b` | Model name |
| `LLM_API_KEY` | `` | API key (if not Ollama) |
| `CONFIDENCE_THRESHOLD` | `0.75` | Rows below → review queue |
| `ADMIN_USERNAME` | `admin` | Change in production! |
| `ADMIN_PASSWORD` | `medcheck2024` | Change in production! |
| `SECRET_KEY` | `CHANGE_ME...` | JWT secret — 32 random bytes |

### Frontend (`frontend/.env.local`)

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend API URL |

## Architecture

```
Browser
  ├── /              → Home (language picker, scan/manual CTA)
  ├── /scan          → QR scanner + photo OCR upload
  ├── /confirm       → Editable form with confidence indicators
  ├── /result        → Result card + TTS + PDF link
  └── /admin         → Dashboard + review queue (JWT protected)
        └── /review  → Side-by-side PDF image + row editor

FastAPI
  ├── POST /api/check          → fuzzy batch search
  ├── POST /api/ocr/label      → Gemma 4 label extraction
  ├── POST /api/tts            → gTTS server-side TTS
  ├── POST /api/pipeline/run   → CDSCO PDF pipeline
  └── /api/admin/*             → JWT-protected admin endpoints

PostgreSQL
  ├── drug_alerts   (searchable with pg_trgm)
  ├── pdf_sources   (downloaded PDFs + hashes)
  └── review_queue  (low-confidence rows)
```

## Adding a Language

1. Add `src/i18n/<code>.json` with all keys from `en.json`
2. Add `{ code, label, native }` to the `LANGS` array in `src/app/page.tsx`
3. Add BCP-47 mapping in `src/hooks/useTTS.ts`
4. Add gTTS lang code in `backend/app/services/tts_service.py`

## Production Checklist

- [ ] Change `ADMIN_PASSWORD` and `SECRET_KEY`
- [ ] Use Alembic for DB migrations (not `create_all`)
- [ ] Set `CORS` origins to your actual domain
- [ ] Enable HTTPS (TLS termination via nginx/caddy)
- [ ] Set `disable: false` in `next.config.ts` PWA config
- [ ] Run `npm run build` for production bundle
TEam name:
aryaman sharma
siddhartha pandey
sanyam kumar
