import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import {
  CDSCO_ALERTS,
  CDSCO_DATA_UPDATED_AT,
  checkMedicineBatch,
} from './src/shared/cdsco.ts';
import {
  BANNED_DRUGS,
  BANNED_DRUG_LEGAL_NOTES,
  BANNED_DRUGS_SOURCE_TITLE,
} from './src/shared/bannedDrugs.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

function getGeminiClient(apiVersion?: string): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    ...(apiVersion ? { apiVersion } : {}),
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    dataUpdatedAt: CDSCO_DATA_UPDATED_AT,
    alertCount: CDSCO_ALERTS.length,
    bannedDrugCount: BANNED_DRUGS.length,
  });
});

app.get('/api/alerts', (req, res) => {
  const query = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';
  const items = query
    ? CDSCO_ALERTS.filter(
        (a) =>
          a.medicineName.toLowerCase().includes(query) ||
          a.genericName.toLowerCase().includes(query) ||
          a.batchNumber.toLowerCase().includes(query) ||
          a.state.toLowerCase().includes(query)
      )
    : CDSCO_ALERTS;

  res.json({
    alerts: items,
    dataUpdatedAt: CDSCO_DATA_UPDATED_AT,
    totalCount: CDSCO_ALERTS.length,
  });
});

app.get('/api/banned-drugs', (req, res) => {
  const query = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';
  const items = query
    ? BANNED_DRUGS.filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.notification.toLowerCase().includes(query) ||
          String(d.srNo) === query
      )
    : BANNED_DRUGS;

  res.json({
    bannedDrugs: items,
    totalCount: BANNED_DRUGS.length,
    sourceTitle: BANNED_DRUGS_SOURCE_TITLE,
    legalNotes: BANNED_DRUG_LEGAL_NOTES,
  });
});

app.post('/api/check', (req, res) => {
  const body = req.body as {
    medicineName?: string;
    batchNumber?: string;
    genericName?: string;
  };
  const medicineName = typeof body?.medicineName === 'string' ? body.medicineName : '';
  const batchNumber = typeof body?.batchNumber === 'string' ? body.batchNumber : '';
  const genericName = typeof body?.genericName === 'string' ? body.genericName : '';

  if (!medicineName.trim() && !batchNumber.trim() && !genericName.trim()) {
    res.status(400).json({ error: 'Please enter a medicine name or batch number.' });
    return;
  }

  const result = checkMedicineBatch(
    medicineName,
    batchNumber,
    CDSCO_ALERTS,
    genericName
  );
  res.json(result);
});

app.post('/api/scan-label', async (req, res) => {
  const body = req.body as { imageBase64?: string; mimeType?: string };
  const imageBase64 = typeof body?.imageBase64 === 'string' ? body.imageBase64 : '';
  const mimeType = typeof body?.mimeType === 'string' ? body.mimeType : 'image/jpeg';

  if (!imageBase64) {
    res.status(400).json({ error: 'No image data provided.' });
    return;
  }

  const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');
  const ai = getGeminiClient('v1beta') ?? getGeminiClient();

  if (!ai) {
    res.status(503).json({
      error: 'AI label reader is currently unavailable. Please enter the medicine name and batch number manually.',
    });
    return;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          {
            text:
              'You are reading a medicine label, blister strip, syrup bottle, or carton in India. ' +
              'Extract the visible printed text accurately without guessing. Pay close attention to Batch Number (often labeled B.No., Batch No., Batch, Lot), ' +
              'distinguishing 0 vs O, 1 vs I vs L, 5 vs S, and 8 vs B carefully. Return empty strings for any field not clearly visible in the photo, ' +
              'and rate each extracted field confidence honestly from 0.0 to 1.0 (below 0.7 if blurry, glared, skewed, or empty). ' +
              'Do NOT give medical, dosage, or treatment advice.',
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            medicineName: {
              type: Type.STRING,
              description: 'Brand or product name printed on the label, e.g. Calpol 650 or Cough Care DX.',
            },
            drugNameConfidence: {
              type: Type.NUMBER,
              description: 'Confidence score between 0.0 and 1.0 for medicineName (under 0.7 if blurry or unsure).',
            },
            genericName: {
              type: Type.STRING,
              description: 'Generic composition or salt name if visible, e.g. Paracetamol IP.',
            },
            manufacturer: {
              type: Type.STRING,
              description: 'Manufacturer or marketed-by company name if visible.',
            },
            manufacturerConfidence: {
              type: Type.NUMBER,
              description: 'Confidence score between 0.0 and 1.0 for manufacturer (under 0.7 if blurry or missing).',
            },
            batchNumber: {
              type: Type.STRING,
              description: 'Exact batch code printed after B.No. or Batch No., preserving hyphens and letters.',
            },
            batchNumberConfidence: {
              type: Type.NUMBER,
              description: 'Confidence score between 0.0 and 1.0 for batchNumber (under 0.7 if glare, blurry, or ambiguous characters).',
            },
            mfgDate: {
              type: Type.STRING,
              description: 'Manufacturing date if visible, e.g. 09/2024.',
            },
            expDate: {
              type: Type.STRING,
              description: 'Expiry date if visible, e.g. 08/2026.',
            },
            confidence: {
              type: Type.STRING,
              description: 'high, medium, or low based on image clarity.',
            },
            notes: {
              type: Type.STRING,
              description: 'Brief note if batch text was blurry, glared, or partially cut off.',
            },
          },
          required: [
            'medicineName',
            'drugNameConfidence',
            'batchNumber',
            'batchNumberConfidence',
            'manufacturer',
            'manufacturerConfidence',
            'confidence',
          ],
        },
      },
    });

    const rawText = (response.text ?? '{}')
      .trim()
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/```\s*$/, '');
    const parsed = JSON.parse(rawText) as {
      medicineName?: string;
      drugNameConfidence?: number;
      genericName?: string;
      manufacturer?: string;
      manufacturerConfidence?: number;
      batchNumber?: string;
      batchNumberConfidence?: number;
      mfgDate?: string;
      expDate?: string;
      confidence?: string;
      notes?: string;
    };

    const clampConf = (val: unknown, textVal: string): number => {
      if (typeof val === 'number' && !Number.isNaN(val)) {
        return Math.max(0, Math.min(1, val));
      }
      return textVal.trim() ? 0.75 : 0.0;
    };

    const drugName = parsed.medicineName ?? '';
    const batchNumber = parsed.batchNumber ?? '';
    const manufacturer = parsed.manufacturer ?? '';
    const drugNameConfidence = clampConf(parsed.drugNameConfidence, drugName);
    const batchNumberConfidence = clampConf(parsed.batchNumberConfidence, batchNumber);
    const manufacturerConfidence = clampConf(parsed.manufacturerConfidence, manufacturer);

    res.json({
      // Web client fields
      medicineName: drugName,
      genericName: parsed.genericName ?? '',
      manufacturer,
      batchNumber,
      mfgDate: parsed.mfgDate ?? '',
      expDate: parsed.expDate ?? '',
      confidence: parsed.confidence ?? 'medium',
      notes: parsed.notes ?? '',
      // Android client contract fields
      drug_name: drugName,
      drug_name_confidence: drugNameConfidence,
      batch_number: batchNumber,
      batch_number_confidence: batchNumberConfidence,
      manufacturer_confidence: manufacturerConfidence,
    });
  } catch (err) {
    console.error('Gemini label scan error:', err);
    res.status(502).json({
      error: 'Could not read the medicine label clearly. Please try a sharper photo in soft light or type the batch number manually.',
    });
  }
});

const LANGUAGE_SPEECH_NAMES: Record<string, string> = {
  hi: 'natural everyday spoken Hindi',
  en: 'warm, natural Indian English',
  ta: 'natural everyday spoken Tamil',
  bn: 'natural everyday spoken Bengali',
  mr: 'natural everyday spoken Marathi',
  te: 'natural everyday spoken Telugu',
};

const TTS_CACHE_DIR = path.join(__dirname, '.tts-cache');
const PUBLIC_AUDIO_DIR = path.join(__dirname, 'public', 'audio');
const ttsCache = new Map<string, string>();

try {
  fs.mkdirSync(TTS_CACHE_DIR, { recursive: true });
} catch {
  // Ignore if read-only
}

function getTtsDiskPath(cacheKey: string): string {
  const hash = crypto.createHash('sha256').update(cacheKey).digest('hex').slice(0, 24);
  return path.join(TTS_CACHE_DIR, `${hash}.wav`);
}

function readTtsFromDisk(cacheKey: string, staticId?: string): string | null {
  if (staticId && /^[a-z0-9_-]+$/i.test(staticId)) {
    const staticFile = path.join(PUBLIC_AUDIO_DIR, `${staticId}.wav`);
    try {
      if (fs.existsSync(staticFile)) {
        return fs.readFileSync(staticFile).toString('base64');
      }
    } catch {
      // Ignore read error
    }
  }
  try {
    const diskPath = getTtsDiskPath(cacheKey);
    if (fs.existsSync(diskPath)) {
      return fs.readFileSync(diskPath).toString('base64');
    }
  } catch {
    // Ignore read error
  }
  return null;
}

function writeTtsToDisk(cacheKey: string, base64Audio: string): void {
  try {
    fs.mkdirSync(TTS_CACHE_DIR, { recursive: true });
    fs.writeFileSync(getTtsDiskPath(cacheKey), Buffer.from(base64Audio, 'base64'));
  } catch {
    // Ignore disk write error
  }
}

async function synthesizeWithModel(
  ai: GoogleGenAI,
  model: 'gemini-3.8-flash-tts' | 'gemini-3.8-flash-lite-tts',
  text: string,
  langName: string
): Promise<string | null> {
  const stylePrompt =
    `Speak as a real, empathetic Indian woman in her mid-30s talking gently face-to-face with a family member at home in ${langName}. ` +
    `Use relaxed, authentic human pacing with natural breath pauses between sentences, warm inflection, and genuine personal care. ` +
    `Do not sound like an automated system, customer-care IVR, news anchor, or AI assistant.`;

  let response;
  try {
    response = await ai.models.generateContent({
      model,
      contents: [
        {
          role: 'user',
          parts: [
            {
              text,
              speechMetadata: {
                style: stylePrompt,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
  } catch (err) {
    const errStatus = (err as { status?: number })?.status;
    if (errStatus === 429) {
      throw err;
    }
    response = await ai.models.generateContent({
      model,
      contents: text,
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
  }

  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ?? null;
}

app.post('/api/tts', async (req, res) => {
  const body = req.body as { text?: string; language?: string; staticId?: string };
  const text = typeof body?.text === 'string' ? body.text.trim() : '';
  const language = typeof body?.language === 'string' ? body.language.trim() : 'hi';
  const staticId = typeof body?.staticId === 'string' ? body.staticId.trim() : undefined;

  if (!text) {
    res.status(400).json({ error: 'Text is required for speech generation.' });
    return;
  }

  const cacheKey = `v3-human:Kore:${language}:${text}`;
  const memCached = ttsCache.get(cacheKey);
  if (memCached) {
    res.json({ audioBase64: memCached, mimeType: 'audio/wav' });
    return;
  }

  const diskCached = readTtsFromDisk(cacheKey, staticId);
  if (diskCached) {
    ttsCache.set(cacheKey, diskCached);
    res.json({ audioBase64: diskCached, mimeType: 'audio/wav' });
    return;
  }

  const ai = getGeminiClient('v1beta');
  if (!ai) {
    res.status(503).json({ error: 'TTS service unavailable.' });
    return;
  }

  const langName = LANGUAGE_SPEECH_NAMES[language] ?? 'natural everyday spoken Hindi';

  try {
    let base64Audio: string | null = null;
    let lastError: unknown = null;

    for (const model of ['gemini-3.8-flash-tts', 'gemini-3.8-flash-lite-tts'] as const) {
      try {
        base64Audio = await synthesizeWithModel(ai, model, text, langName);
        if (base64Audio) break;
      } catch (err) {
        lastError = err;
        console.warn(`TTS model ${model} failed for ${language}:`, (err as Error)?.message ?? err);
      }
    }

    if (!base64Audio) {
      if (lastError) throw lastError;
      res.status(502).json({ error: 'No audio returned by TTS model.' });
      return;
    }

    if (ttsCache.size >= 80) {
      const oldestKey = ttsCache.keys().next().value;
      if (oldestKey) ttsCache.delete(oldestKey);
    }
    ttsCache.set(cacheKey, base64Audio);
    writeTtsToDisk(cacheKey, base64Audio);

    res.json({ audioBase64: base64Audio, mimeType: 'audio/wav' });
  } catch (err) {
    const status = (err as { status?: number })?.status;
    console.error('Gemini TTS error:', err);
    res.status(status === 429 ? 429 : 502).json({
      error:
        status === 429
          ? 'Voice service is briefly busy. Please wait a few seconds and try again.'
          : 'Unable to generate speech audio right now.',
      upstreamStatus: status ?? null,
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MedCheck server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
