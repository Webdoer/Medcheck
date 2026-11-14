# MedCheck (मेडचेक)

> A mobile-first public health utility for Indian families to verify medicine batches against government quality alerts (CDSCO NSQ and Spurious Drug Bulletins) and Section 26A banned drugs and fixed-dose combinations (FDCs).

---

## Overview

**MedCheck** is an accessible, privacy-centric public health application designed to enable citizens to verify whether medicine stock (tablets, capsules, syrups, blisters) has been flagged by the **Central Drugs Standard Control Organization (CDSCO)** or state regulatory testing laboratories for substandard quality (Not of Standard Quality / NSQ) or spurious manufacturing.

Engineered with compassionate design principles and zero tracking or account registration requirements, MedCheck ensures health safety information is transparently accessible to every household.

---

## Key Features

### 1. Smart Label Scanner and OCR
- **Automated Label Extraction**: Uses Gemini AI vision to extract the medicine name, batch number (B.No.), and expiry date directly from package labels.
- **Low-Confidence Highlighting**: Fields identified with less than 70% OCR confidence are flagged for manual verification.
- **Camera Support and Fallback**: Supports real-time camera streams with torch toggle, error recovery, and standard file upload fallbacks.

### 2. Regulatory Alert and Banned Drug Database
- **Section 26A Banned Drugs and FDCs**: Fully indexed database of prohibited drugs under Section 26A of the Drugs and Cosmetics Act, 1940 (sourced from official Ministry of Health Gazette notifications).
- **CDSCO NSQ Bulletins**: Comprehensive database of government-flagged substandard and spurious batches with search and filtering capabilities.
- **Character Normalization**: Fuzzy matching normalizes common OCR character ambiguities (e.g., `0/O`, `1/I/L`, `5/S`, `8/B`).

### 3. Multilingual Support and Audio Guidance
- **Six Indian Languages**: Localized in Hindi (default), English, Tamil, Bengali, Marathi, and Telugu.
- **Text-to-Speech Guidance**: Integrated audio assistance delivers verification results and safety guidance in the user's preferred language.

### 4. Privacy by Design
- **No Registration Required**: Complete anonymity with no account creation or login mechanism.
- **Local Data Persistence**: Verification history is stored solely on the client device (up to 20 recent checks). No user images or personal identification data are retained on external servers.

### 5. Regulatory Helpline and Verification Guidance
- **CDSCO National Helpline**: Integrated direct calling support for the national toll-free helpline (1800-11-4477).
- **Actionable Steps**: Clear guidance on steps to take if a batch is flagged (discontinuing use, consulting a medical practitioner, contacting the pharmacy).
- **Balanced Safety Communication**: Records not present in alert bulletins are clearly communicated as "No active alert found" rather than a definitive safety certification, encouraging standard packaging vigilance.

---

## Android Native Application (`/android/`)

In addition to the Web PWA, MedCheck provides a native Android application built with Kotlin, Jetpack Compose, and Material 3:
- **Screens**: Language Selection, Home, Scan (CameraX), Confirmation, Verification, Results, History, and Help.
- **Architecture**: MVVM pattern, Room Database with seeded local alert data, Retrofit/Ktor proxy client, and Android TextToSpeech framework.

---

## Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Backend / Proxy API**: Node.js, Express, `@google/genai` (Gemini SDK)
- **Native Android**: Kotlin, Jetpack Compose, Material 3, Room, CameraX, Android TTS

---

## Installation and Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- Gemini API Key

### Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file based on `.env.example`:
   ```env
   GEMINI_API_KEY="your-gemini-api-key"
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```
   The local application will start at `http://localhost:3000`.

4. **Production Build**
   ```bash
   npm run build
   ```

---

## Project Structure

```
├── server.ts                 # Express server & Gemini OCR proxy API
├── src/
│   ├── App.tsx               # Main React SPA router & state management
│   ├── main.tsx              # React entry point
│   ├── index.css             # Tailwind CSS styles & animations
│   ├── assets/               # Sample blister images & media assets
│   ├── components/           # UI Views (Home, Scan, Result, History, Help, etc.)
│   ├── i18n/                 # 6-language translation bundles
│   └── shared/               # CDSCO dataset & 444 Section 26A banned drugs
├── android/                  # Native Android App (Kotlin, Compose, Room, CameraX)
└── public/                   # Static assets, PWA manifest, and audio files
```

---

## Disclaimer

MedCheck is a public health utility created to assist citizens in referencing official regulatory alerts. It provides government public alert lookups only and **does not provide medical diagnosis, dosage recommendations, or treatment advice**. For medical decisions or concerns, always consult a qualified healthcare professional or licensed pharmacist.

---

## Team Members

- **Member 1:** Aryaman Sharma
- **Member 2:** Siddhartha Pandey
- **Member 3 (Leader):** Sanyam Kumar
