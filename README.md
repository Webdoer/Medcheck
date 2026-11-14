# MedCheck (मेडचेक) 🩺🛡️

> **A free, mobile-first public health utility for Indian families to verify medicine batches against government quality alerts (CDSCO NSQ & Spurious Drug Bulletins) and Section 26A banned drugs/FDCs.**

---

## 🌟 Overview

**MedCheck** is a privacy-first, accessible public health application designed to empower citizens to verify whether their medicine stock (tablets, capsules, syrups, blisters) has been flagged by the **Central Drugs Standard Control Organization (CDSCO)** or state regulatory testing laboratories for substandard quality (NSQ) or spurious manufacturing.

Built with a calming, compassionate theme (cream background, misty sage, pale sky blue, soft lavender primary, slate-blue text) and zero tracking/login requirements, MedCheck ensures that health safety is accessible to every Indian family.

---

## 🚀 Key Features

### 1. 📷 Smart Label Scanner & OCR
- Point your phone camera at a medicine blister or box. Gemini AI extracts the **medicine name**, **batch number (B.No.)**, and **expiry date**.
- **Low Confidence Highlighting**: Fields recognized with less than 70% OCR confidence are automatically highlighted for manual review.
- **Robust Camera & Fallback**: Full support for live CameraX/WebRTC video streams with torch toggle, error recovery, and a native phone camera photo upload fallback (`<input type="file" capture="environment">`).

### 2. 🛡️ Comprehensive Banned & Flagged Database
- **444 Banned Drugs & FDCs**: Complete integration of all Sr. No. 1–444 prohibited drugs under **Section 26A of the Drugs and Cosmetics Act, 1940** (sourced directly from official Ministry of Health Gazette notifications).
- **CDSCO NSQ Bulletins**: Thousands of government-flagged substandard/spurious batches with search, filters, and direct gazette notes.
- **Look-Alike Character Normalization**: Advanced fuzzy matching handles look-alike characters (`0/O`, `1/I/L`, `5/S`, `8/B`).

### 3. 🌐 6 Indian Languages & Single Female Voice TTS
- Full support for **Hindi (हिन्दी)** [Default], **English**, **Tamil (தமிழ்)**, **Bengali (বাংলা)**, **मराठी (Marathi)**, and **Telugu (తెలుగు)**.
- **Natural Female TTS Audio Guide**: Listen to results and guidance in your chosen language using a warm, compassionate natural voice.

### 4. 🔒 100% On-Device Privacy & History
- No login or registration required.
- Verification history is stored **locally on your device only** (last 20 checks) with SQLite/LocalStorage persistence. No photos or personal data are ever uploaded to third-party servers.

### 5. 📞 Direct Helpline & Guidance
- **Tap-to-Call CDSCO National Helpline**: Instant one-tap access to toll-free **1800-11-4477**.
- **Actionable Steps**: Clear guidance on what to do if a medicine is flagged (stop use, consult a doctor or primary health center [PHC], inform the chemist).
- **No False Reassurance**: "Not found" results never use green colors or call a medicine "safe"—instead, they clearly state that absence from the alert list is not a guarantee and prompt packaging checks.

---

## 📱 Android Native App Source Included (`/android/`)
In addition to the high-performance Web PWA, MedCheck includes a complete native Android application codebase in Kotlin, Jetpack Compose, and Material 3 under `/android/`:
- **8 Screens**: Language Picker, Home, Scan (CameraX), Confirm, Checking, Result, History, Help.
- **Architecture**: MVVM, Room Database with seeded demo data, Retrofit/Ktor backend proxy communication, and Android `TextToSpeech`.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Vite.
- **Backend / API Proxy**: Node.js, Express, `@google/genai` (Gemini SDK for OCR label extraction).
- **Android App (Native)**: Kotlin, Jetpack Compose, Material 3, Room, CameraX, Android TTS.

---

## 🏃 Local Development & Running

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and provide your Gemini API key:
   ```env
   GEMINI_API_KEY="your-gemini-api-key"
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The app runs locally on `http://localhost:3000`.

4. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```
├── server.ts                 # Express server & Gemini OCR proxy API
├── src/
│   ├── App.tsx               # Main React SPA router & state management
│   ├── main.tsx              # React entry point
│   ├── index.css             # Tailwind CSS import & custom animations
│   ├── assets/               # Sample blister images & media assets
│   ├── components/           # UI Views (Home, Scan, Result, History, Help, etc.)
│   ├── i18n/                 # 6-language translation bundles
│   └── shared/               # CDSCO dataset & 444 Section 26A banned drugs
├── android/                  # Native Android App (Kotlin, Compose, Room, CameraX)
└── public/                   # Static assets, PWA manifest, and audio guides
```

---

## 📄 License & Public Health Disclaimer

MedCheck is a public health utility created to assist citizens in verifying regulatory alerts. It provides official government regulatory alert lookups only and **does not provide medical diagnosis, dosage, or treatment advice**. In case of health concerns, always consult a qualified medical professional or pharmacist.
