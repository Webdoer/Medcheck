import React, { useState } from 'react';
import {
  ArrowLeft,
  Phone,
  AlertTriangle,
  SearchCheck,
  Info,
  CheckCircle2,
  QrCode,
  FileWarning,
  HeartHandshake,
  ChevronRight,
  Ban,
} from 'lucide-react';
import type { BatchCheckResult, CdscoAlert, PossibleMatchItem } from '../shared/cdsco';
import { BANNED_DRUG_LEGAL_NOTES } from '../shared/bannedDrugs';
import type { LanguageCode, TranslationBundle } from '../i18n/translations';
import { ListenButton } from './ListenButton';
import { useSpeechSynthesis } from '../hooks/useSpeech';
import { MEDIA } from '../assets/media';

interface ResultViewProps {
  t: TranslationBundle;
  language: LanguageCode;
  voiceSpeed: 0.8 | 1.0 | 1.2;
  result: BatchCheckResult;
  onConfirmPossibleMatch: (alert: CdscoAlert) => void;
  onRejectPossibleMatch: () => void;
  onCheckAnother: () => void;
  onBack: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  t,
  language,
  voiceSpeed,
  result,
  onConfirmPossibleMatch,
  onRejectPossibleMatch,
  onCheckAnother,
  onBack,
}) => {
  const { isSpeaking, isLoading, speechError, speak, stop } = useSpeechSynthesis(
    language,
    voiceSpeed
  );
  const [showReportGuide, setShowReportGuide] = useState(false);
  const [consultImgError, setConsultImgError] = useState(false);
  const [selectedPossibleIndex, setSelectedPossibleIndex] = useState(0);

  const bannedMatches = result.bannedMatches ?? [];
  const hasFlaggedContent =
    result.status === 'flagged' && (Boolean(result.exactAlert) || bannedMatches.length > 0);

  const buildSpeechText = (): string => {
    if (result.status === 'flagged' && result.exactAlert) {
      const a = result.exactAlert;
      switch (language) {
        case 'hi':
          return `कृपया ध्यान से सुनें... ${a.medicineName}, जिसका बैच नंबर ${a.batchNumber} है, सरकारी गुणवत्ता अलर्ट सूची में पाया गया है। बिल्कुल घबराएं नहीं। अभी के लिए इस दवा का इस्तेमाल रोक दें और बच्चों की पहुंच से दूर रख दें। अगर आपने यह दवा ले ली है, तो पत्ता या बोतल लेकर अपने डॉक्टर या नजदीकी स्वास्थ्य केंद्र से मिल लें।`;
        case 'ta':
          return `கொஞ்சம் கவனமா கேளுங்க... ${a.medicineName}, பேட்ச் எண் ${a.batchNumber}, அரசு தர எச்சரிக்கை பட்டியல்ல இருக்கு. பயப்படாதீங்க, பதறவும் வேண்டாம். இப்போதைக்கு இந்த மருந்தை நிறுத்திட்டு பத்திரமா தனியா வச்சிடுங்க. நீங்க ஏற்கனவே சாப்பிட்டிருந்தா, இந்த அட்டையை எடுத்துட்டு போய் உங்க டாக்டரையோ பக்கத்துல இருக்கிற ஆரம்ப சுகாதார நிலையத்தையோ பாருங்க.`;
        case 'bn':
          return `একটু মন দিয়ে শুনুন... ${a.medicineName}, যার ব্যাচ নম্বর ${a.batchNumber}, সেটি সরকারি সতর্কতা তালিকায় পাওয়া গেছে। একদম ভয় পাবেন না। এখনই এই ওষুধটা খাওয়া বন্ধ করে আলাদা সরিয়ে রাখুন। যদি ইতিমধ্যেই খেয়ে থাকেন, তাহলে ওষুধের পাতাটা নিয়ে একবার ডাক্তার বা কাছের স্বাস্থ্যকেন্দ্রে দেখিয়ে নিন।`;
        case 'mr':
          return `कृपया लक्ष देऊन ऐका... ${a.medicineName}, ज्याचा बॅच नंबर ${a.batchNumber} आहे, हे औषध सरकारी गुणवत्ता सूचना यादीत आढळलं आहे. अजिबात घाबरू नका. सध्या हे औषध घेणं थांबवा आणि सुरक्षित बाजूला ठेवा. जर तुम्ही ते आधीच घेतलं असेल, तर पाकीट सोबत घेऊन तुमच्या डॉक्टरांना किंवा जवळच्या आरोग्य केंद्रात नक्की भेटा.`;
        case 'te':
          return `దయచేసి కొంచెం జాగ్రత్తగా వినండి... ${a.medicineName}, బ్యాచ్ నంబర్ ${a.batchNumber}, ప్రభుత్వ నాణ్యతా హెచ్చరిక జాబితాలో కనిపించింది. అస్సలు కంగారు పడకండి. ప్రస్తుతానికి ఈ మందు వాడటం ఆపేసి, పిల్లలకు అందకుండా పక్కన పెట్టండి. మీరు ఇప్పటికే వేసుకుని ఉంటే, ఆ ప్యాక్ తీసుకుని మీ డాక్టర్‌ని గానీ దగ్గర్లోని హెల్త్ సెంటర్‌ని గానీ ఒకసారి కలవండి.`;
        default:
          return `Please take a moment to check this carefully... ${a.medicineName}, batch ${a.batchNumber}, has been flagged in a government quality alert because ${a.reasonSummary}. Please do not panic. Just stop using this pack for now and keep it out of reach. If you have already taken a dose, simply bring the pack along and check in with your doctor or local clinic.`;
      }
    }

    if (result.status === 'flagged' && bannedMatches.length > 0) {
      const first = bannedMatches[0];
      switch (language) {
        case 'hi':
          return `कृपया ध्यान से सुनें... ${first.name} भारत सरकार की धारा 26 ए प्रतिबंधित दवा सूची में दर्ज है, अधिसूचना ${first.notification}। बिल्कुल घबराएं नहीं। अभी के लिए इस दवा को लेना रोक दें, और किसी सुरक्षित विकल्प के लिए अपने डॉक्टर या फार्मासिस्ट से सलाह लें।`;
        case 'ta':
          return `கவனமா கேளுங்க... ${first.name}, இந்திய அரசின் பிரிவு 26A தடைசெய்யப்பட்ட மருந்துகள் பட்டியல்ல இருக்கு. பயப்பட வேண்டாம். இப்போதைக்கு இதை நிறுத்திட்டு, பாதுகாப்பான மாற்று மருந்துக்காக உங்க டாக்டரையோ மருந்தாளரையோ கேளுங்க.`;
        case 'bn':
          return `একটু মন দিয়ে শুনুন... ${first.name} ভারত সরকারের ধারা 26A নিষিদ্ধ ওষুধের তালিকায় রয়েছে। একদম ভয় পাবেন না। এখনই এটি ব্যবহার বন্ধ রাখুন এবং নিরাপদ বিকল্পের জন্য আপনার ডাক্তার বা ফার্মাসিস্টের সাথে কথা বলুন।`;
        case 'mr':
          return `कृपया लक्ष देऊन ऐका... ${first.name} हे भारत सरकारच्या कलम 26A अंतर्गत प्रतिबंधित औषधांच्या यादीत आहे. अजिबात घाबरू नका. सध्या याचा वापर थांबवा आणि सुरक्षित पर्यायासाठी डॉक्टरांचा किंवा फार्मासिस्टचा सल्ला घ्या.`;
        case 'te':
          return `దయచేసి జాగ్రత్తగా వినండి... ${first.name} భారత ప్రభుత్వ సెక్షన్ 26A నిషేధిత మందుల జాబితాలో ఉంది. అస్సలు కంగారు పడకండి. ప్రస్తుతానికి దీని వాడకం ఆపి, సురక్షితమైన ప్రత్యామ్నాయం కోసం మీ డాక్టర్ లేదా ఫార్మసిస్ట్‌ను సంప్రదించండి.`;
        default:
          return `Please take a moment to review this... ${first.name} appears on the Government of India Section 26A prohibited drugs list under ${first.notification}. Please stay calm, pause using this medicine for now, and speak with your doctor or pharmacist about a suitable alternative.`;
      }
    }

    if (result.status === 'possible_match') {
      const candidate = result.possibleMatches[selectedPossibleIndex]?.alert;
      const candBatch = candidate?.batchNumber ?? '';
      switch (language) {
        case 'hi':
          return `एक बार ध्यान से मिला लें... आपने ${result.queryBatch} लिखा है, जो अलर्ट वाले बैच ${candBatch} से बहुत मिलता-जुलता है। आगे बढ़ने से पहले अपने पत्ते पर एक-एक अक्षर फिर से देखकर पुष्टि करें।`;
        case 'ta':
          return `ஒரு நிமிஷம் சரியா சரிபார்த்துக்கோங்க... நீங்க கொடுத்த ${result.queryBatch} எண், எச்சரிக்கை பட்டியல்ல உள்ள ${candBatch} எண்ணோடு ரொம்ப ஒத்துப்போகுது. மேல பாக்குறதுக்கு முன்னாடி உங்க அட்டையில உள்ள ஒவ்வொரு எழுத்தையும் கவனமா ஒப்பிட்டுப் பாருங்க.`;
        case 'bn':
          return `একবার ভালো করে মিলিয়ে দেখুন... আপনার লেখা ${result.queryBatch} নম্বরটা সতর্কতা তালিকার ${candBatch} ব্যাচের সাথে খুব মিলে যাচ্ছে। এগিয়ে যাওয়ার আগে পাতার প্রতিটি অক্ষর আবার মিলিয়ে নিশ্চিত করুন।`;
        case 'mr':
          return `एकदा नीट तपासून घ्या... तुम्ही टाकलेला ${result.queryBatch} नंबर सूचना यादीतील ${candBatch} या बॅचशी खूप मिळताजुळता आहे. पुढे जाण्यापूर्वी तुमच्या पाकिटावरील प्रत्येक अक्षर पुन्हा एकदा नीट जुळवून खात्री करा.`;
        case 'te':
          return `ఒకసారి జాగ్రత్తగా పోల్చి చూడండి... మీరు ఇచ్చిన ${result.queryBatch} నంబర్, హెచ్చరిక జాబితాలోని ${candBatch} బ్యాచ్‌తో చాలా దగ్గరగా ఉంది. ముందుకు వెళ్లే ముందు మీ స్ట్రిప్‌పై ఉన్న ప్రతి అక్షరాన్ని మరోసారి సరిపోల్చుకోండి.`;
        default:
          return `Let us double-check this together... You entered ${result.queryBatch}, which looks very close to the flagged batch ${candBatch}. Before viewing the alert details, please compare every letter and digit against your strip.`;
      }
    }

    switch (language) {
      case 'hi':
        return `आपके द्वारा जांचा गया बैच ${result.queryBatch} अभी सरकारी अलर्ट सूची में दर्ज नहीं है। फिर भी, सूची में न होने का मतलब सौ प्रतिशत गारंटी नहीं होता... इसलिए अगर गोली का रंग, गंध या सील कुछ अजीब लगे, तो इस्तेमाल करने से पहले अपने फार्मासिस्ट या डॉक्टर से जरूर पूछ लें।`;
      case 'ta':
        return `நீங்க சரிபார்த்த ${result.queryBatch} பேட்ச் இப்போதைக்கு அரசு எச்சரிக்கை பட்டியல்ல இல்லை. இருந்தாலும் இது 100 சதவீத உத்தரவாதம் இல்லை... அதனால மருந்தோட நிறம், வாசனை அல்லது சீல்ல ஏதாவது சந்தேகம் இருந்தா பயன்படுத்துறதுக்கு முன்னாடி உங்க மருந்தாளரையோ டாக்டரையோ கேளுங்க.`;
      case 'bn':
        return `আপনি যে ${result.queryBatch} ব্যাচটা দেখলেন, সেটা বর্তমান সরকারি সতর্কতা তালিকায় নেই। তবুও, তালিকায় না থাকা মানেই পুরোপুরি নিরাপদ তার গ্যারান্টি নয়... তাই রঙ, গন্ধ বা সিলে সামান্য সন্দেহ হলে খাওয়ার আগে ফার্মাসিস্ট বা ডাক্তারকে জিজ্ঞাসা করে নেবেন।`;
      case 'mr':
        return `तुम्ही तपासलेला ${result.queryBatch} बॅच सध्या सरकारी सूचना यादीत आढळला नाही. तरीही यादीत नसणं म्हणजे शंभर टक्के खात्री नसते... त्यामुळे गोळ्यांचा रंग, वास किंवा सीलमध्ये काही वेगळं वाटल्यास वापरण्यापूर्वी फार्मासिस्ट किंवा डॉक्टरांना नक्की विचारा.`;
      case 'te':
        return `మీరు తనిఖీ చేసిన ${result.queryBatch} బ్యాచ్ ప్రస్తుతానికి ప్రభుత్వ హెచ్చరిక జాబితాలో లేదు. అయినప్పటికీ జాబితాలో లేకపోవడం వంద శాతం హామీ కాదు... కాబట్టి రంగు, వాసన లేదా సీల్‌లో ఏదైనా తేడా అనిపిస్తే వాడే ముందు మీ ఫార్మసిస్ట్ లేదా డాక్టర్‌ని అడగండి.`;
      default:
        return `Good news so far... batch ${result.queryBatch} does not appear in our current government alert list. Still, not being listed is never a complete guarantee, so if the tablets look unusual, smell odd, or the seal seems tampered with, please check with your pharmacist or doctor before using it.`;
    }
  };

  const handleToggleAudio = () => {
    if (isSpeaking || isLoading) {
      stop();
    } else {
      speak(buildSpeechText());
    }
  };

  const renderMatchReasonHint = (item: PossibleMatchItem) => {
    if (item.matchReason === 'lookalike') return t.lookalikeHint;
    if (item.matchReason === 'typo') return t.typoHint;
    return t.medicineMatchHint;
  };

  return (
    <div className="flex flex-col space-y-5 max-w-3xl mx-auto w-full">
      {/* Top Contextual Back Row */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            stop();
            onBack();
          }}
          className="min-h-[44px] inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.navHome}</span>
        </button>

        <span className="text-xs text-on-surface-variant">{t.savedOnPhoneNote}</span>
      </div>

      {/* =========================================================
          STATE 1: FLAGGED BATCH OR SECTION 26A BANNED DRUG
         ========================================================= */}
      {hasFlaggedContent && (
        <div className="flex flex-col space-y-5">
          {/* Calm Reassurance Lead */}
          <div className="rounded-2xl bg-secondary-container/50 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-secondary shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-on-secondary-fixed">{t.stayCalmTitle}</p>
              <p className="text-xs text-on-secondary-container mt-0.5">{t.stayCalmBody}</p>
            </div>
          </div>

          {/* Primary Flagged Batch Card (if NSQ/Spurious match) */}
          {result.exactAlert && (
            <section className="rounded-[24px] bg-flagged-bg text-flagged-ink p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-flagged-accent">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{t.flaggedBadge}</span>
                </span>
                <span className="text-xs font-mono font-semibold text-flagged-ink/80">
                  {result.exactAlert.severity === 'spurious' ? 'SPURIOUS ALERT' : 'NSQ ALERT'}
                </span>
              </div>

              <div>
                <h1 className="text-2xl font-bold text-flagged-ink leading-snug">
                  {result.exactAlert.medicineName}
                </h1>
                <p className="text-sm text-flagged-ink/80 mt-0.5">
                  {result.exactAlert.genericName}
                </p>
                <p className="mt-2.5 inline-block px-3.5 py-1.5 rounded-full bg-surface-container-lowest text-flagged-accent font-mono text-sm font-bold tracking-wider">
                  {t.batchNumberLabel}: {result.exactAlert.batchNumber}
                </p>
              </div>

              {/* Structured Regulatory Facts */}
              <div className="rounded-2xl bg-surface-container-lowest text-on-surface p-4 space-y-3">
                <div>
                  <p className="text-xs font-semibold text-on-surface-variant">{t.reasonLabel}</p>
                  <p className="text-sm font-medium text-on-surface mt-0.5 leading-relaxed">
                    {result.exactAlert.reasonSummary}
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-outline-variant/40 text-sm">
                  <div>
                    <p className="text-xs text-on-surface-variant">{t.stateLabel}</p>
                    <p className="font-semibold text-on-surface">{result.exactAlert.state}</p>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant">{t.monthLabel}</p>
                    <p className="font-semibold text-on-surface">{result.exactAlert.alertMonth}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-xs text-on-surface-variant">{t.labLabel}</p>
                    <p className="font-semibold text-on-surface">{result.exactAlert.testingLab}</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-outline-variant/40">
                  <p className="text-xs text-on-surface-variant">{t.sourceLabel}</p>
                  <p className="text-xs font-semibold text-secondary mt-0.5">
                    {result.exactAlert.bulletinSource}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Section 26A Prohibited Drug / FDC Card */}
          {bannedMatches.length > 0 && (
            <section className="rounded-[24px] bg-flagged-bg text-flagged-ink p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-flagged-accent">
                  <Ban className="w-4 h-4" />
                  <span>{result.exactAlert ? t.alsoFlaggedBannedTitle : t.bannedGazetteBadge}</span>
                </span>
                <span className="text-xs font-mono font-semibold text-flagged-ink/80">
                  SECTION 26A GAZETTE
                </span>
              </div>

              {!result.exactAlert && (
                <div>
                  <h1 className="text-2xl font-bold text-flagged-ink leading-snug">
                    {result.queryMedicine || bannedMatches[0].name}
                  </h1>
                  <p className="text-sm text-flagged-ink/85 mt-1 leading-relaxed">
                    {t.bannedCardExplanation}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {bannedMatches.map((entry) => (
                  <div
                    key={entry.srNo}
                    className="rounded-2xl bg-surface-container-lowest text-on-surface p-4 space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-base font-bold text-on-surface leading-snug">
                        {entry.name}
                      </p>
                      <span className="text-xs font-mono font-bold text-flagged-accent shrink-0">
                        {t.serialNoLabel} #{entry.srNo}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-outline-variant/40">
                      <p className="text-xs text-on-surface-variant">{t.gazetteNotificationLabel}</p>
                      <p className="text-xs font-mono font-semibold text-secondary mt-0.5">
                        {entry.notification}
                      </p>
                    </div>

                    {entry.legalNote && (
                      <div className="p-3 rounded-xl bg-possible-bg/70 text-possible-ink text-xs leading-relaxed">
                        <p className="font-bold mb-0.5">{t.legalNoteLabel}</p>
                        <p>{BANNED_DRUG_LEGAL_NOTES[entry.legalNote]}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Voice Read-out Button */}
          <ListenButton
            isSpeaking={isSpeaking}
            isLoading={isLoading}
            errorMessage={speechError ? t.voiceBusyHint : null}
            onToggle={handleToggleAudio}
            listenLabel={t.listenResultBtn}
            stopLabel={t.stopListeningBtn}
          />

          {/* Consultation Photo + Reassurance */}
          <div className="rounded-[24px] overflow-hidden bg-surface-container-low border border-outline-variant/40">
            {!consultImgError && (
              <img
                src={MEDIA.consultation}
                alt="Doctor and pharmacist calmly consulting an elderly patient in a primary health clinic"
                referrerPolicy="no-referrer"
                onError={() => setConsultImgError(true)}
                className="w-full h-40 sm:h-48 object-cover"
              />
            )}
            <div className="p-4 sm:p-5 space-y-4">
              <h2 className="text-lg font-bold text-on-surface">{t.whatToDoTitle}</h2>

              <div className="space-y-3">
                {[
                  { num: 1, title: t.flaggedStep1Title, body: t.flaggedStep1Body, tone: 'bg-flagged-accent text-white' },
                  { num: 2, title: t.flaggedStep2Title, body: t.flaggedStep2Body, tone: 'bg-primary text-on-primary' },
                  { num: 3, title: t.flaggedStep3Title, body: t.flaggedStep3Body, tone: 'bg-secondary text-on-secondary' },
                ].map((step) => (
                  <div
                    key={step.num}
                    className="flex items-start gap-3 p-3.5 rounded-2xl bg-surface-container-lowest"
                  >
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${step.tone}`}
                    >
                      {step.num}
                    </span>
                    <div>
                      <p className="text-base font-semibold text-on-surface">{step.title}</p>
                      <p className="text-sm text-on-surface-variant mt-0.5 leading-relaxed">
                        {step.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* One-Tap CDSCO Helpline & Report Guide */}
          <div className="flex flex-col space-y-3">
            <a
              href="tel:1800114477"
              className="min-h-[54px] w-full rounded-full bg-flagged-accent hover:opacity-95 text-white text-base font-semibold flex items-center justify-center gap-2.5 px-6 shadow-sm transition-opacity"
            >
              <Phone className="w-5 h-5" />
              <span>{t.callHelplineCta}</span>
            </a>

            <button
              type="button"
              onClick={() => setShowReportGuide((prev) => !prev)}
              className="min-h-[52px] w-full rounded-full bg-surface-container-high hover:bg-surface-dim text-on-surface text-sm font-semibold flex items-center justify-center gap-2 px-6 cursor-pointer"
            >
              <FileWarning className="w-4 h-4" />
              <span>{t.reportGuideBtn}</span>
            </button>

            {showReportGuide && (
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/50 text-sm space-y-1.5">
                <p className="font-bold text-on-surface">{t.reportGuideTitle}</p>
                <p className="text-on-surface-variant leading-relaxed">{t.reportGuideBody}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          STATE 2: POSSIBLE MATCH (Side-by-side diff + confirmation)
         ========================================================= */}
      {result.status === 'possible_match' && result.possibleMatches.length > 0 && (() => {
        const activeItem = result.possibleMatches[selectedPossibleIndex] ?? result.possibleMatches[0];
        return (
          <div className="flex flex-col space-y-5">
            <section className="rounded-[24px] bg-possible-bg text-possible-ink p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-possible-accent text-sm font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{t.possibleBadge}</span>
              </div>

              <div>
                <h1 className="text-2xl font-bold text-possible-ink leading-snug">
                  {t.possibleTitle}
                </h1>
                <p className="text-sm text-possible-ink/85 mt-1 leading-relaxed">
                  {t.possibleSub}
                </p>
              </div>

              {result.possibleMatches.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {result.possibleMatches.map((m, idx) => (
                    <button
                      key={m.alert.id}
                      type="button"
                      onClick={() => setSelectedPossibleIndex(idx)}
                      className={`min-h-[38px] px-3 py-1 rounded-full text-xs font-mono font-semibold cursor-pointer ${
                        idx === selectedPossibleIndex
                          ? 'bg-possible-accent text-white'
                          : 'bg-white/75 text-possible-ink hover:bg-white'
                      }`}
                    >
                      {m.alert.batchNumber}
                    </button>
                  ))}
                </div>
              )}

              {/* Side-by-side character comparison */}
              <div className="rounded-2xl bg-white/90 p-4 space-y-4">
                <p className="text-xs font-medium text-possible-ink/80">
                  {renderMatchReasonHint(activeItem)}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-surface-container-low">
                    <p className="text-xs text-on-surface-variant mb-1.5">{t.yourEntryLabel}</p>
                    <div className="font-mono text-lg font-bold tracking-wider flex flex-wrap gap-0.5">
                      {activeItem.userDiff.map((seg, i) => (
                        <span
                          key={i}
                          className={
                            seg.isDifferent
                              ? 'px-1 rounded bg-possible-accent/20 text-possible-ink underline decoration-2'
                              : 'text-secondary'
                          }
                        >
                          {seg.char}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-flagged-bg/50">
                    <p className="text-xs text-flagged-accent font-semibold mb-1.5">
                      {t.flaggedBatchLabel} ({activeItem.alert.medicineName})
                    </p>
                    <div className="font-mono text-lg font-bold tracking-wider flex flex-wrap gap-0.5">
                      {activeItem.alertDiff.map((seg, i) => (
                        <span
                          key={i}
                          className={
                            seg.isDifferent
                              ? 'px-1 rounded bg-flagged-accent text-white'
                              : 'text-flagged-ink'
                          }
                        >
                          {seg.char}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mandatory Confirmation Step before revealing alert details */}
              <div className="flex flex-col space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    stop();
                    onConfirmPossibleMatch(activeItem.alert);
                  }}
                  className="min-h-[52px] w-full px-5 py-3 rounded-full bg-possible-accent hover:opacity-95 text-white text-sm sm:text-base font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t.confirmIsMatchBtn}</span>
                  <ChevronRight className="w-4 h-4 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    stop();
                    onRejectPossibleMatch();
                  }}
                  className="min-h-[52px] w-full px-5 py-3 rounded-full bg-white hover:bg-surface-container text-on-surface text-sm sm:text-base font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t.confirmNotMatchBtn}</span>
                </button>
              </div>
            </section>

            <ListenButton
              isSpeaking={isSpeaking}
              isLoading={isLoading}
              errorMessage={speechError ? t.voiceBusyHint : null}
              onToggle={handleToggleAudio}
              listenLabel={t.listenResultBtn}
              stopLabel={t.stopListeningBtn}
            />
          </div>
        );
      })()}

      {/* =========================================================
          STATE 3: NOT FOUND IN ALERTS (Serene blue-grey, NO green)
         ========================================================= */}
      {result.status === 'not_found' && (
        <div className="flex flex-col space-y-5">
          <section className="rounded-[24px] bg-notfound-bg text-notfound-ink p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-full bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
                <SearchCheck className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-notfound-accent">
                  {t.notFoundBadge}
                </p>
                <h1 className="text-xl sm:text-2xl font-bold text-notfound-ink mt-1 leading-snug">
                  {t.notFoundTitle}
                </h1>
                <p className="text-sm text-notfound-ink/80 mt-1">{t.notFoundSub}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-surface-container-lowest p-4 flex flex-wrap items-center justify-between gap-2">
              <span className="text-base font-bold text-on-surface">{result.queryMedicine}</span>
              <span className="text-sm font-mono font-semibold text-secondary">
                {t.batchNumberLabel}: {result.queryBatch}
              </span>
            </div>
          </section>

          <ListenButton
            isSpeaking={isSpeaking}
            isLoading={isLoading}
            errorMessage={speechError ? t.voiceBusyHint : null}
            onToggle={handleToggleAudio}
            listenLabel={t.listenResultBtn}
            stopLabel={t.stopListeningBtn}
          />

          {/* Plain-language Meaning & Disclaimer */}
          <div className="rounded-[24px] bg-surface-container-low p-5 space-y-3">
            <div className="flex items-center gap-2 text-on-surface">
              <Info className="w-5 h-5 text-secondary shrink-0" />
              <h2 className="text-lg font-bold">{t.whatThisMeansTitle}</h2>
            </div>
            <p className="text-[15px] text-on-surface leading-relaxed">
              {t.notFoundMeaningBody}
            </p>
            <div className="p-3.5 rounded-xl bg-surface-container text-sm text-on-surface-variant leading-relaxed">
              {t.notFoundCaution}
            </div>
          </div>

          {/* 4-Point Physical Packaging Checklist */}
          <div className="rounded-[24px] bg-surface-container-lowest p-5 border border-outline-variant/40 space-y-3">
            <h2 className="text-base font-bold text-on-surface">{t.physicalCheckTitle}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {t.physicalChecks.map((check, i) => (
                <div key={i} className="p-3 rounded-xl bg-surface-container-low flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{check.title}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{check.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Check Another & Helpline Footer */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            stop();
            onCheckAnother();
          }}
          className="flex-1 min-h-[54px] px-6 rounded-full bg-primary hover:bg-primary-container text-on-primary text-base font-semibold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          <QrCode className="w-5 h-5" />
          <span>{t.checkAnotherBtn}</span>
        </button>

        <a
          href="tel:1800114477"
          className="min-h-[54px] px-6 rounded-full bg-surface-container hover:bg-surface-container-high text-secondary text-sm font-semibold flex items-center justify-center gap-2"
        >
          <Phone className="w-4 h-4" />
          <span>1800-11-4477</span>
        </a>
      </div>

      <p className="text-xs text-center text-on-surface-variant pt-1">
        {result.dataUpdatedAt}
      </p>
    </div>
  );
};
