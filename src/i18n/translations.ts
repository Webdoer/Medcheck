export type LanguageCode = 'hi' | 'en' | 'ta' | 'bn' | 'mr' | 'te';

export interface LanguageOption {
  code: LanguageCode;
  nativeName: string;
  englishName: string;
  speechLang: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'hi', nativeName: 'हिंदी', englishName: 'Hindi', speechLang: 'hi-IN' },
  { code: 'en', nativeName: 'English', englishName: 'English', speechLang: 'en-IN' },
  { code: 'ta', nativeName: 'தமிழ்', englishName: 'Tamil', speechLang: 'ta-IN' },
  { code: 'bn', nativeName: 'বাংলা', englishName: 'Bengali', speechLang: 'bn-IN' },
  { code: 'mr', nativeName: 'मराठी', englishName: 'Marathi', speechLang: 'mr-IN' },
  { code: 'te', nativeName: 'తెలుగు', englishName: 'Telugu', speechLang: 'te-IN' },
];

export interface TranslationBundle {
  appName: string;
  appNameNative: string;
  tagline: string;
  subTagline: string;
  cdscoDatabaseHint: string;
  missionTitle: string;
  missionBody: string;
  noLoginPrivacy: string;
  chooseLanguageTitle: string;
  sixLanguagesCount: string;
  listenWelcomeBtn: string;
  listenWelcomeSub: string;
  welcomeSpeechText: string;
  continueBtn: string;
  freeNoSaveMicro: string;
  helplineTitle: string;
  helplineSub: string;
  callNow: string;

  navHome: string;
  navScan: string;
  navHistory: string;
  navHelp: string;

  homeGreeting: string;
  dataUpdatedPrefix: string;
  batchesTrackedSuffix: string;
  heroLabel: string;
  heroTitle: string;
  heroSub: string;
  scanCameraBtn: string;
  manualEntryBtn: string;
  trySampleBtn: string;
  directSearchLabel: string;
  directSearchPlaceholder: string;
  voiceListening: string;
  voiceNotSupported: string;
  quickExamplesLabel: string;
  recentAlertsTitle: string;
  batchAlertsTab: string;
  bannedDrugsTab: string;
  bannedSearchPlaceholder: string;
  bannedNoMatches: string;
  showMoreBannedBtn: string;
  showAllBannedBtn: string;
  viewAllAlerts: string;
  showFewerAlerts: string;
  privacyCardTitle: string;
  privacyCardBody: string;
  helplineBannerLabel: string;
  tapToCall: string;

  scanTitle: string;
  modeCamera: string;
  modeManual: string;
  startCameraBtn: string;
  capturePhotoBtn: string;
  uploadPhotoBtn: string;
  useSamplePhotoBtn: string;
  torchOn: string;
  torchOff: string;
  scanTipsTitle: string;
  scanTipsList: string[];
  cameraUnavailableMsg: string;
  tryAgainBtn: string;
  takePhotoPhoneCameraBtn: string;
  cameraLoadingMsg: string;
  cameraPermissionDeniedMsg: string;
  cameraNotFoundMsg: string;
  cameraInUseMsg: string;
  cameraInsecureMsg: string;
  privacyScanPill: string;
  readingLabelTitle: string;
  readingLabelSub: string;
  confirmDetailsTitle: string;
  confirmDetailsSub: string;
  medicineNameLabel: string;
  medicineNamePlaceholder: string;
  genericNameLabel: string;
  batchNumberLabel: string;
  batchNumberPlaceholder: string;
  expDateLabel: string;
  verifyNowBtn: string;
  retakePhotoBtn: string;
  enterAtLeastOneError: string;

  checkingHeading: string;
  checkingSub: string;
  stayCalmTitle: string;
  stayCalmBody: string;

  listenResultBtn: string;
  stopListeningBtn: string;
  voiceBusyHint: string;
  checkAnotherBtn: string;
  savedOnPhoneNote: string;

  flaggedBadge: string;
  bannedGazetteBadge: string;
  gazetteNotificationLabel: string;
  serialNoLabel: string;
  legalNoteLabel: string;
  bannedCardExplanation: string;
  alsoFlaggedBannedTitle: string;
  flaggedSummaryPrefix: string;
  reasonLabel: string;
  stateLabel: string;
  monthLabel: string;
  labLabel: string;
  sourceLabel: string;
  whatToDoTitle: string;
  flaggedStep1Title: string;
  flaggedStep1Body: string;
  flaggedStep2Title: string;
  flaggedStep2Body: string;
  flaggedStep3Title: string;
  flaggedStep3Body: string;
  callHelplineCta: string;
  reportGuideBtn: string;
  reportGuideTitle: string;
  reportGuideBody: string;

  possibleBadge: string;
  possibleTitle: string;
  possibleSub: string;
  yourEntryLabel: string;
  flaggedBatchLabel: string;
  lookalikeHint: string;
  typoHint: string;
  medicineMatchHint: string;
  confirmIsMatchBtn: string;
  confirmNotMatchBtn: string;

  notFoundBadge: string;
  notFoundTitle: string;
  notFoundSub: string;
  whatThisMeansTitle: string;
  notFoundMeaningBody: string;
  notFoundCaution: string;
  physicalCheckTitle: string;
  physicalChecks: { title: string; desc: string }[];

  historyTitle: string;
  historySub: string;
  checksCountLabel: string;
  filterAll: string;
  filterFlagged: string;
  filterPossible: string;
  filterNotFound: string;
  historyEmptyTitle: string;
  historyEmptyBody: string;
  clearHistoryBtn: string;
  clearConfirmTitle: string;
  clearConfirmBody: string;
  cancelBtn: string;
  confirmDeleteBtn: string;
  viewDetailsBtn: string;
  historyLocalBadge: string;
  closeBtn: string;

  helpHeroTitle: string;
  helpHeroSub: string;
  localProcessingTitle: string;
  localProcessingSub: string;
  cdscoSyncTitle: string;
  cdscoSyncSub: string;
  reassuranceCardTitle: string;
  reassuranceCardSub: string;
  faqTitle: string;
  faqs: { q: string; a: string }[];
  accessibilityTitle: string;
  voiceSpeedLabel: string;
  speedSlow: string;
  speedNormal: string;
  speedFast: string;
  highContrastLabel: string;
  highContrastSub: string;
  installAppTitle: string;
  installAppSub: string;
  installAppBtn: string;
  iosInstallHint: string;
  offlineBanner: string;
  dataSourceFooter: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationBundle> = {
  hi: {
    appName: 'MedCheck',
    appNameNative: 'मेडचेक',
    tagline: 'भारत सरकार (CDSCO) की सूची से दवा की जांच करें',
    subTagline: 'Check medicine batches against CDSCO quality alerts in seconds',
    cdscoDatabaseHint: 'केंद्रीय औषधि मानक नियंत्रण संगठन (CDSCO) अलर्ट सूची से मिलान',
    missionTitle: 'जनहित में निःशुल्क सुविधा',
    missionBody: 'हर भारतीय परिवार के लिए सरल और शांत दवा जांच सेवा। किसी तकनीकी जानकारी की आवश्यकता नहीं।',
    noLoginPrivacy: 'सुरक्षित • कोई लॉगिन नहीं • केवल आपके फोन पर सेव',
    chooseLanguageTitle: 'अपनी भाषा चुनें / Select Language',
    sixLanguagesCount: '6 भाषाएं',
    listenWelcomeBtn: 'निर्देश सुनें',
    listenWelcomeSub: 'अपनी चुनी हुई भाषा में सुनें',
    welcomeSpeechText: 'नमस्ते! आइए साथ मिलकर आपकी दवा की जांच करते हैं। बस दवा के पत्ते या डिब्बे की एक साफ़ फोटो खींच लें, या फिर नाम और बैच नंबर लिख दें... मैं अभी सरकारी सुरक्षा सूची में देखकर बताती हूँ।',
    continueBtn: 'आगे बढ़ें • Continue',
    freeNoSaveMicro: '100% नि:शुल्क • फोटो सेव नहीं होती • कोई लॉगिन नहीं',
    helplineTitle: 'CDSCO राष्ट्रीय औषधि हेल्पलाइन',
    helplineSub: 'निःशुल्क सहायता (24×7 Toll-Free)',
    callNow: 'कॉल करें',

    navHome: 'होम',
    navScan: 'दवा जांचें',
    navHistory: 'इतिहास',
    navHelp: 'मदद व सुरक्षा',

    homeGreeting: 'नमस्ते! अपनी दवा की जांच करें',
    dataUpdatedPrefix: 'डेटा अपडेट:',
    batchesTrackedSuffix: 'अलर्ट बैच सक्रिय',
    heroLabel: 'त्वरित सुरक्षा जांच',
    heroTitle: 'दवा के डिब्बे या पत्ते की फोटो लें',
    heroSub: 'बैच नंबर (B.No.) और दवा का नाम कैमरे के सामने लाएं या हाथ से लिखें।',
    scanCameraBtn: 'फोटो से स्कैन करें',
    manualEntryBtn: 'नाम या बैच नंबर लिखें',
    trySampleBtn: 'नमूना पत्ता आज़माएं',
    directSearchLabel: 'सीधे बैच या दवा खोजें',
    directSearchPlaceholder: 'उदा. CC-8402, Rofecoxib, Nimesulide + Paracetamol...',
    voiceListening: 'सुन रहे हैं... दवा का नाम या बैच नंबर बोलें',
    voiceNotSupported: 'इस ब्राउज़र में बोलकर खोज उपलब्ध नहीं है, कृपया टाइप करें।',
    quickExamplesLabel: 'तुरंत जांच उदाहरण:',
    recentAlertsTitle: 'सरकारी सुरक्षा सूचियाँ',
    batchAlertsTab: 'बैच अलर्ट',
    bannedDrugsTab: 'प्रतिबंधित दवाएँ (444)',
    bannedSearchPlaceholder: '444 प्रतिबंधित दवाएँ, घटक या S.O./GSR नं. खोजें...',
    bannedNoMatches: 'इस खोज से मेल खाने वाली कोई प्रतिबंधित दवा नहीं मिली।',
    showMoreBannedBtn: 'और दिखाएं (+30)',
    showAllBannedBtn: 'सभी 444 दिखाएं',
    viewAllAlerts: 'सभी देखें',
    showFewerAlerts: 'कम दिखाएं',
    privacyCardTitle: '100% सुरक्षित और निजी',
    privacyCardBody: 'आपकी दवा की फोटो केवल टेक्स्ट पढ़ने के लिए उपयोग होती है और कहीं सेव नहीं की जाती। जांच का इतिहास सिर्फ आपके फोन में रहता है।',
    helplineBannerLabel: 'राष्ट्रीय औषधि हेल्पलाइन (24×7 नि:शुल्क)',
    tapToCall: 'तुरंत कॉल करें',

    scanTitle: 'दवा की जांच करें',
    modeCamera: 'कैमरा / फोटो',
    modeManual: 'हाथ से लिखें',
    startCameraBtn: 'लाइव कैमरा खोलें',
    capturePhotoBtn: 'फोटो खींचकर पढ़ें',
    uploadPhotoBtn: 'गैलरी से फोटो चुनें',
    useSamplePhotoBtn: 'नमूना पत्ता स्कैन करें',
    torchOn: 'टॉर्च ऑन',
    torchOff: 'टॉर्च बंद',
    scanTipsTitle: 'साफ़ फोटो के लिए टिप्स',
    scanTipsList: [
      'दवा के पत्ते पर सीधी चमक (glare) न पड़ने दें।',
      'B.No. या Batch No. वाले हिस्से को फ़्रेम के बीच में रखें।',
      'यदि अक्षर धुंधले हों, तो अगले चरण में आप उन्हें सुधार सकते हैं।',
    ],
    cameraUnavailableMsg: 'सीधा कैमरा इस डिवाइस/ब्राउज़र में उपलब्ध नहीं है। आप गैलरी से फोटो अपलोड कर सकते हैं या नीचे नमूना पत्ता आज़मा सकते हैं।',
    tryAgainBtn: 'पुनः प्रयास करें (Try Again)',
    takePhotoPhoneCameraBtn: 'फोन कैमरे से फोटो लें (Take photo with phone camera)',
    cameraLoadingMsg: 'कैमरा चालू हो रहा है...',
    cameraPermissionDeniedMsg: 'कैमरा अनुमति अस्वीकार कर दी गई। कृपया ब्राउज़र सेटिंग्स में कैमरा अनुमति दें।',
    cameraNotFoundMsg: 'इस डिवाइस पर कोई कैमरा नहीं मिला।',
    cameraInUseMsg: 'कैमरा पहले से ही किसी अन्य ऐप या टैब द्वारा उपयोग में है।',
    cameraInsecureMsg: 'कैमरा एक्सेस के लिए सुरक्षित HTTPS कनेक्शन आवश्यक है।',
    privacyScanPill: 'फोटो केवल टेक्स्ट पढ़ने के लिए उपयोग होती है, कभी सेव नहीं होती',
    readingLabelTitle: 'लेबल पढ़ा जा रहा है...',
    readingLabelSub: 'दवा का नाम और बैच नंबर पहचाना जा रहा है',
    confirmDetailsTitle: 'विवरण की पुष्टि करें',
    confirmDetailsSub: 'यदि फोटो में कोई अक्षर (जैसे 0 और O, या 1 और I) गलत पढ़ा गया हो, तो जांच से पहले सुधार लें।',
    medicineNameLabel: 'दवा का नाम',
    medicineNamePlaceholder: 'उदा. Calpol 650 या Cough Care DX',
    genericNameLabel: 'दवा का घटक (यदि पता हो)',
    batchNumberLabel: 'बैच नंबर (Batch / B.No.)',
    batchNumberPlaceholder: 'उदा. CC-8402 या KL-9021-B',
    expDateLabel: 'समाप्ति तिथि (EXP)',
    verifyNowBtn: 'CDSCO सूची से मिलान करें',
    retakePhotoBtn: 'दूसरी फोटो लें',
    enterAtLeastOneError: 'कृपया कम से कम दवा का नाम या बैच नंबर दर्ज करें।',

    checkingHeading: 'CDSCO सूची से मिलान हो रहा है...',
    checkingSub: 'सरकारी NSQ और नकली दवाओं के अलर्ट जांचे जा रहे हैं',
    stayCalmTitle: 'कृपया शांत रहें',
    stayCalmBody: 'मेडचेक केवल सरकारी गुणवत्ता अलर्ट दिखाता है। यह कोई चिकित्सकीय सलाह नहीं देता।',

    listenResultBtn: 'परिणाम सुनें',
    stopListeningBtn: 'सुनना रोकें',
    voiceBusyHint: 'इस भाषा की आवाज़ अभी तैयार नहीं हो सकी, कृपया कुछ सेकंड बाद फिर सुनें।',
    checkAnotherBtn: 'दूसरी दवा जांचें',
    savedOnPhoneNote: 'यह जांच केवल आपके फोन के इतिहास में सेव की गई है।',

    flaggedBadge: 'CDSCO अलर्ट सूची में दर्ज',
    bannedGazetteBadge: 'धारा 26A के तहत प्रतिबंधित दवा',
    gazetteNotificationLabel: 'भारत सरकार राजपत्र अधिसूचना (Gazette Notification)',
    serialNoLabel: 'क्रमांक (Sr. No.)',
    legalNoteLabel: 'न्यायालय / नियामक टिप्पणी',
    bannedCardExplanation: 'औषधि और प्रसाधन सामग्री अधिनियम, 1940 की धारा 26A के अंतर्गत भारत सरकार द्वारा इसके निर्माण, बिक्री और वितरण पर प्रतिबंध/नियमन लागू किया गया है।',
    alsoFlaggedBannedTitle: 'धारा 26A प्रतिबंधित दवा मिलान',
    flaggedSummaryPrefix: 'यह बैच सरकारी अलर्ट सूची में मिला है।',
    reasonLabel: 'कारण',
    stateLabel: 'राज्य',
    monthLabel: 'अलर्ट माह',
    labLabel: 'परीक्षण प्रयोगशाला',
    sourceLabel: 'आधिकारिक स्रोत',
    whatToDoTitle: 'अब क्या करें (सरल मार्गदर्शन)',
    flaggedStep1Title: 'इस बैच का उपयोग तुरंत रोकें',
    flaggedStep1Body: 'इस बोतल या पत्ते का सेवन बंद करें और इसे बच्चों की पहुंच से दूर रखें।',
    flaggedStep2Title: 'यदि आपने दवा ले ली है, तो घबराएं नहीं',
    flaggedStep2Body: 'दवा का पत्ता/बोतल साथ लेकर अपने नजदीकी डॉक्टर, फार्मासिस्ट या सरकारी स्वास्थ्य केंद्र (PHC/CHC) से सलाह लें।',
    flaggedStep3Title: 'केमिस्ट को सूचित करें व बिल रखें',
    flaggedStep3Body: 'जहाँ से दवा खरीदी थी उन्हें यह अलर्ट दिखाएं और रसीद संभाल कर रखें।',
    callHelplineCta: 'CDSCO हेल्पलाइन 1800-11-4477 पर कॉल करें',
    reportGuideBtn: 'शिकायत दर्ज करने की जानकारी',
    reportGuideTitle: 'राज्य औषधि नियंत्रक को सूचना कैसे दें',
    reportGuideBody: '1800-11-4477 पर कॉल करें या अपने राज्य के औषधि नियंत्रण कार्यालय (State Drug Controller) को दवा का नाम, बैच नंबर, निर्माण तिथि और दुकान की रसीद के साथ सूचित करें।',

    possibleBadge: 'संभावित मिलान (जांच आवश्यक)',
    possibleTitle: 'यह एक अलर्ट बैच से मिलता-जुलता है',
    possibleSub: 'आगे विवरण देखने से पहले अपने पत्ते के बैच नंबर से एक-एक अक्षर ध्यान से मिलाएं।',
    yourEntryLabel: 'आपका दर्ज बैच',
    flaggedBatchLabel: 'अलर्ट वाला बैच',
    lookalikeHint: '0 और O या 1 और I जैसे मिलते-जुलते अक्षर मिले हैं।',
    typoHint: 'केवल 1-2 अक्षरों का अंतर है — कृपया पत्ता दोबारा देखें।',
    medicineMatchHint: 'इस दवा का नाम सरकारी अलर्ट में शामिल एक दवा से मिलता है।',
    confirmIsMatchBtn: 'हाँ, मेरा बैच यही है — अलर्ट विवरण देखें',
    confirmNotMatchBtn: 'नहीं, मेरा बैच अलग है',

    notFoundBadge: 'अलर्ट सूची में नहीं मिला',
    notFoundTitle: 'यह बैच हमारी अलर्ट सूची में दर्ज नहीं है',
    notFoundSub: 'वर्तमान CDSCO NSQ या नकली दवा अलर्ट रिकॉर्ड में यह बैच नंबर नहीं मिला।',
    whatThisMeansTitle: 'इसका क्या अर्थ है?',
    notFoundMeaningBody: 'इस सूची में नाम न होना इस बात की गारंटी कभी नहीं है कि दवा पूरी तरह सही या सुरक्षित है। हर महीने केवल चुनिंदा नमूनों की जांच होती है।',
    notFoundCaution: 'यदि दवा का रंग, गंध, स्वाद या सील अजीब लगे, तो इसका सेवन न करें और अपने फार्मासिस्ट या डॉक्टर से पूछें।',
    physicalCheckTitle: 'पैकेजिंग की 4 आसान जांच',
    physicalChecks: [
      { title: 'छपाई की साफ़-सफ़ाई', desc: 'बैच नंबर और अक्षर धुंधले या मिटे तो नहीं हैं?' },
      { title: 'सील और पैकिंग', desc: 'पत्ता या ढक्कन पहले से खुला या टूटा तो नहीं है?' },
      { title: 'दवा की बनावट', desc: 'गोली टूटी हुई या रंग बदला हुआ तो नहीं दिखता?' },
      { title: 'तारीख की जांच', desc: 'समाप्ति तिथि (EXP) स्पष्ट और मान्य है?' },
    ],

    historyTitle: 'मेरा जांच इतिहास',
    historySub: 'केवल आपके फोन पर सुरक्षित',
    checksCountLabel: 'जांचें',
    filterAll: 'सभी',
    filterFlagged: 'अलर्ट में',
    filterPossible: 'संदेहास्पद',
    filterNotFound: 'सूची में नहीं',
    historyEmptyTitle: 'अभी कोई जांच इतिहास नहीं है',
    historyEmptyBody: 'जब आप किसी दवा की जांच करेंगे, तो वह केवल आपके फोन पर यहाँ दिखाई देगी।',
    clearHistoryBtn: 'सारा इतिहास साफ़ करें',
    clearConfirmTitle: 'क्या सारा इतिहास हटा दें?',
    clearConfirmBody: 'आपके फोन से सभी पिछली जांचें हट जाएंगी। इसे वापस नहीं लाया जा सकता।',
    cancelBtn: 'रद्द करें',
    confirmDeleteBtn: 'हाँ, हटाएं',
    viewDetailsBtn: 'विवरण देखें',
    historyLocalBadge: 'केवल फोन स्टोरेज • कोई सर्वर अपलोड नहीं',
    closeBtn: 'बंद करें',

    helpHeroTitle: 'आपकी सुरक्षा और गोपनीयता',
    helpHeroSub: 'मेडचेक एक निःशुल्क जनहित सेवा है। यह कोई दवा, खुराक या इलाज की सलाह नहीं देती।',
    localProcessingTitle: 'फोटो सुरक्षित नहीं रखी जाती',
    localProcessingSub: 'लेबल पढ़ने के तुरंत बाद फोटो हटा दी जाती है।',
    cdscoSyncTitle: 'CDSCO अलर्ट डेटा',
    cdscoSyncSub: 'मासिक NSQ और नकली दवा सूचियों पर आधारित।',
    reassuranceCardTitle: 'संदेह होने पर विशेषज्ञ से पूछें',
    reassuranceCardSub: 'किसी भी दवा के बारे में शंका हो तो डॉक्टर, फार्मासिस्ट या 1800-11-4477 पर बात करें।',
    faqTitle: 'सामान्य प्रश्न',
    faqs: [
      {
        q: 'यदि मेरी दवा अलर्ट सूची में निकली और मैंने खा ली है, तो क्या करूँ?',
        a: 'घबराएं नहीं। इस दवा को आगे लेना बंद करें, दवा का पत्ता/बोतल संभाल कर रखें, और अपने डॉक्टर या नजदीकी सरकारी स्वास्थ्य केंद्र (PHC/CHC) से तुरंत संपर्क करें।',
      },
      {
        q: 'क्या दवा की फोटो सर्वर पर सेव होती है?',
        a: 'नहीं। फोटो का उपयोग केवल लेबल पर लिखे नाम और बैच नंबर को पढ़ने के लिए होता है और उसे कहीं भी सेव या संग्रहीत नहीं किया जाता।',
      },
      {
        q: 'यदि बैच अलर्ट सूची में नहीं मिला, तो क्या दवा 100% असली है?',
        a: 'नहीं। सूची में नाम न होना दवा के सही होने की गारंटी नहीं है। हमेशा सील, प्रिंट और एक्सपायरी जांचें और संदेह होने पर फार्मासिस्ट से पूछें।',
      },
      {
        q: 'CDSCO NSQ सूची क्या होती है?',
        a: 'NSQ का अर्थ "Not of Standard Quality" है। केंद्रीय और राज्य औषधि प्रयोगशालाएं हर महीने बाजार से नमूने जांचती हैं और मानक पर खरी न उतरने वाली दवाओं के बैच प्रकाशित करती हैं।',
      },
    ],
    accessibilityTitle: 'आवाज़ और पढ़ने की सुविधा',
    voiceSpeedLabel: 'बोलकर पढ़ने की गति',
    speedSlow: 'धीमी (0.8x)',
    speedNormal: 'सामान्य (1.0x)',
    speedFast: 'तेज़ (1.2x)',
    highContrastLabel: 'उच्च कंट्रास्ट मोड',
    highContrastSub: 'साफ़ व गहरे अक्षर (कमजोर दृष्टि के लिए सहायक)',
    installAppTitle: 'ऐप की तरह फोन में इंस्टॉल करें',
    installAppSub: 'ऑफलाइन भी बैच नंबर जांचने के लिए होम स्क्रीन पर जोड़ें।',
    installAppBtn: 'MedCheck इंस्टॉल करें',
    iosInstallHint: 'iPhone/iPad पर: Safari में Share दबाएं और "Add to Home Screen" चुनें।',
    offlineBanner: 'ऑफलाइन मोड — फोन में सेव CDSCO सूची से जांच हो रही है',
    dataSourceFooter: 'स्रोत: केंद्रीय औषधि मानक नियंत्रण संगठन (CDSCO) मासिक NSQ बुलेटिन',
  },

  en: {
    appName: 'MedCheck',
    appNameNative: 'मेडचेक',
    tagline: 'Check medicine batches against CDSCO alerts',
    subTagline: 'Verify substandard (NSQ) or spurious drug notices in seconds',
    cdscoDatabaseHint: 'Aligned with Central Drugs Standard Control Organisation (CDSCO) alerts',
    missionTitle: 'Free Public Health Utility',
    missionBody: 'A calm, clear way for every family in India to check if a medicine strip appears in government quality alerts.',
    noLoginPrivacy: 'Private • No login required • Saved only on your phone',
    chooseLanguageTitle: 'Select Language / अपनी भाषा चुनें',
    sixLanguagesCount: '6 Languages',
    listenWelcomeBtn: 'Listen to Instructions',
    listenWelcomeSub: 'Hear welcome guide in your selected language',
    welcomeSpeechText: 'Hi there! Let us check your medicine together. Just take a clear photo of the strip or box, or type the medicine name and batch number... and I will look it up in the government safety alerts for you right away.',
    continueBtn: 'Continue',
    freeNoSaveMicro: '100% Free • Photos are never kept • No login needed',
    helplineTitle: 'CDSCO National Drug Helpline',
    helplineSub: 'Toll-free support (24×7)',
    callNow: 'Call',

    navHome: 'Home',
    navScan: 'Check Med',
    navHistory: 'History',
    navHelp: 'Help & Privacy',

    homeGreeting: 'Check your medicine batch',
    dataUpdatedPrefix: 'Data updated:',
    batchesTrackedSuffix: 'alert batches indexed',
    heroLabel: 'Quick Safety Check',
    heroTitle: 'Photograph your medicine strip or box',
    heroSub: 'Point your camera at the printed Batch No. (B.No.) or type the details manually.',
    scanCameraBtn: 'Scan with Camera',
    manualEntryBtn: 'Enter Name or Batch No.',
    trySampleBtn: 'Try Sample Strip',
    directSearchLabel: 'Quick Search by Name or Batch',
    directSearchPlaceholder: 'e.g. CC-8402, Rofecoxib, Nimesulide + Paracetamol...',
    voiceListening: 'Listening... say the medicine name or batch code',
    voiceNotSupported: 'Voice input is not supported in this browser. Please type instead.',
    quickExamplesLabel: 'Try sample checks:',
    recentAlertsTitle: 'Government Safety Lists',
    batchAlertsTab: 'Batch Alerts',
    bannedDrugsTab: 'Banned Drugs (444)',
    bannedSearchPlaceholder: 'Search 444 banned drugs, salts or S.O./GSR No...',
    bannedNoMatches: 'No Section 26A banned drug matched your filter.',
    showMoreBannedBtn: 'Show more (+30)',
    showAllBannedBtn: 'Show all',
    viewAllAlerts: 'View all',
    showFewerAlerts: 'Show fewer',
    privacyCardTitle: 'Private by Design',
    privacyCardBody: 'Label photos are used only to read printed text and are never stored by MedCheck. Your check history stays strictly on your phone.',
    helplineBannerLabel: 'National Drug Helpline (24×7 Toll-Free)',
    tapToCall: 'Call Helpline',

    scanTitle: 'Scan & Check Medicine',
    modeCamera: 'Camera / Photo',
    modeManual: 'Type Manually',
    startCameraBtn: 'Open Live Camera',
    capturePhotoBtn: 'Capture & Read Label',
    uploadPhotoBtn: 'Upload Photo',
    useSamplePhotoBtn: 'Scan Sample Blister Photo',
    torchOn: 'Torch On',
    torchOff: 'Torch Off',
    scanTipsTitle: 'Tips for a clear reading',
    scanTipsList: [
      'Avoid direct harsh glare on shiny foil blister packs.',
      'Hold the printed B.No. / Batch No. inside the center frame.',
      'You can review and edit every character before checking.',
    ],
    cameraUnavailableMsg: 'Live camera access is unavailable in this browser view. Upload a photo or test with the sample blister image below.',
    tryAgainBtn: 'Try Again',
    takePhotoPhoneCameraBtn: 'Take photo with phone camera',
    cameraLoadingMsg: 'Starting camera...',
    cameraPermissionDeniedMsg: 'Camera permission denied. Please allow camera access in browser settings.',
    cameraNotFoundMsg: 'No camera device found on this device.',
    cameraInUseMsg: 'Camera is already in use by another application or tab.',
    cameraInsecureMsg: 'Camera access requires a secure HTTPS connection.',
    privacyScanPill: 'Photo is used only to read text and is never kept',
    readingLabelTitle: 'Reading medicine label...',
    readingLabelSub: 'Extracting medicine name and batch code carefully',
    confirmDetailsTitle: 'Confirm Label Details',
    confirmDetailsSub: 'Please check look-alike characters (0 vs O, 1 vs I) and edit if needed before verifying.',
    medicineNameLabel: 'Medicine Name',
    medicineNamePlaceholder: 'e.g. Calpol 650 or Cough Care DX',
    genericNameLabel: 'Composition / Salt (optional)',
    batchNumberLabel: 'Batch Number (B.No.)',
    batchNumberPlaceholder: 'e.g. CC-8402 or KL-9021-B',
    expDateLabel: 'Expiry Date (EXP)',
    verifyNowBtn: 'Check Against CDSCO Alerts',
    retakePhotoBtn: 'Retake / Choose Another Photo',
    enterAtLeastOneError: 'Please enter a medicine name or a batch number.',

    checkingHeading: 'Checking CDSCO alert lists...',
    checkingSub: 'Comparing against monthly NSQ & spurious drug bulletins',
    stayCalmTitle: 'Please stay calm',
    stayCalmBody: 'MedCheck provides regulatory alert lookup only—never dosage, diagnosis, or treatment advice.',

    listenResultBtn: 'Listen',
    stopListeningBtn: 'Stop Audio',
    voiceBusyHint: 'Voice audio is taking a moment to load. Please tap Listen again in a few seconds.',
    checkAnotherBtn: 'Check Another Medicine',
    savedOnPhoneNote: 'This check is saved only on your own phone.',

    flaggedBadge: 'Flagged on CDSCO Alert',
    bannedGazetteBadge: 'Prohibited under Section 26A',
    gazetteNotificationLabel: 'Gazette Notification',
    serialNoLabel: 'Sr. No.',
    legalNoteLabel: 'Legal / Regulatory Note',
    bannedCardExplanation: 'Prohibited or restricted for manufacture and sale by Ministry of Health & Family Welfare Gazette Notification under Section 26A of the Drugs & Cosmetics Act, 1940.',
    alsoFlaggedBannedTitle: 'Section 26A Prohibited Drug Match',
    flaggedSummaryPrefix: 'This batch appears on a government quality alert.',
    reasonLabel: 'Reason',
    stateLabel: 'State',
    monthLabel: 'Alert Month',
    labLabel: 'Testing Lab',
    sourceLabel: 'Official Source',
    whatToDoTitle: 'What to do next',
    flaggedStep1Title: 'Stop using this medicine batch',
    flaggedStep1Body: 'Set the strip or bottle aside safely away from children.',
    flaggedStep2Title: 'If already taken, stay calm & consult a professional',
    flaggedStep2Body: 'Show the strip or bottle to a doctor, pharmacist, or nearby Primary Health Centre (PHC/CHC).',
    flaggedStep3Title: 'Inform your chemist & keep the bill',
    flaggedStep3Body: 'Notify the pharmacy where you purchased it and keep your purchase receipt.',
    callHelplineCta: 'Call CDSCO Helpline: 1800-11-4477',
    reportGuideBtn: 'How to Report to Drug Controller',
    reportGuideTitle: 'Reporting to State Drug Control',
    reportGuideBody: 'Call 1800-11-4477 or contact your State Drug Controller office with the medicine name, batch number, manufacturer, and chemist receipt.',

    possibleBadge: 'Possible Match — Compare Carefully',
    possibleTitle: 'This looks similar to a flagged batch',
    possibleSub: 'Compare both batch codes character by character before viewing alert details.',
    yourEntryLabel: 'Your Entry',
    flaggedBatchLabel: 'Flagged Batch',
    lookalikeHint: 'Look-alike characters detected (such as 0 and O, or 1 and I).',
    typoHint: 'Only 1–2 characters differ from a flagged batch.',
    medicineMatchHint: 'Medicine name matches an item in CDSCO alerts.',
    confirmIsMatchBtn: 'Yes, this matches my strip — View Alert Details',
    confirmNotMatchBtn: 'No, my batch is different',

    notFoundBadge: 'Not Found in Alerts',
    notFoundTitle: 'This batch is not in our alert list',
    notFoundSub: 'No matching batch was found in the indexed CDSCO NSQ or spurious drug notices.',
    whatThisMeansTitle: 'What does this mean?',
    notFoundMeaningBody: 'Not being listed here is never a guarantee that a medicine is genuine or safe. Only sampled batches are tested each month.',
    notFoundCaution: 'If tablets look discolored, crumbly, have an odd smell, or the seal looks tampered with, do not use them and ask a pharmacist or doctor.',
    physicalCheckTitle: '4-Point Physical Packaging Check',
    physicalChecks: [
      { title: 'Print Clarity', desc: 'Is the batch stamp sharp and smudge-free?' },
      { title: 'Seal Integrity', desc: 'Are foil pockets or bottle cap intact?' },
      { title: 'Appearance', desc: 'Do tablets or liquid have uniform color?' },
      { title: 'Expiry Check', desc: 'Is the EXP date clearly legible and valid?' },
    ],

    historyTitle: 'Check History',
    historySub: 'Saved only on this device',
    checksCountLabel: 'checks',
    filterAll: 'All',
    filterFlagged: 'Flagged',
    filterPossible: 'Possible Match',
    filterNotFound: 'Not Found',
    historyEmptyTitle: 'No checks saved yet',
    historyEmptyBody: 'Medicine checks you perform will appear here—stored privately on your phone only.',
    clearHistoryBtn: 'Clear All History',
    clearConfirmTitle: 'Clear local history?',
    clearConfirmBody: 'All saved checks will be removed from this phone. This cannot be undone.',
    cancelBtn: 'Cancel',
    confirmDeleteBtn: 'Clear History',
    viewDetailsBtn: 'View Details',
    historyLocalBadge: 'Device-only storage • Never uploaded',
    closeBtn: 'Close',

    helpHeroTitle: 'Trust, Safety & Privacy',
    helpHeroSub: 'MedCheck is a free public utility. It never gives dosage, diagnosis, or treatment advice.',
    localProcessingTitle: 'Photos Never Kept',
    localProcessingSub: 'Used only to read label text, then discarded.',
    cdscoSyncTitle: 'CDSCO Bulletins',
    cdscoSyncSub: 'Tracks NSQ & spurious drug batch alerts.',
    reassuranceCardTitle: 'When in doubt, ask a professional',
    reassuranceCardSub: 'Consult your doctor, pharmacist, or call 1800-11-4477 anytime.',
    faqTitle: 'Frequently Asked Questions',
    faqs: [
      {
        q: 'What if my batch is flagged and I already took a dose?',
        a: 'Please stay calm. Stop taking any further doses from that strip or bottle, keep the packaging, and consult a doctor, pharmacist, or nearby PHC/CHC.',
      },
      {
        q: 'Does MedCheck keep photos of my medicines?',
        a: 'No. Label photos are sent only to read the printed text and are never saved or stored by MedCheck.',
      },
      {
        q: 'If a batch is "Not Found", does that prove it is safe?',
        a: 'No. Absence from CDSCO alert lists is never a guarantee that a medicine is authentic or good quality. Always inspect packaging and ask a pharmacist if unsure.',
      },
      {
        q: 'What is the CDSCO NSQ list?',
        a: 'NSQ stands for "Not of Standard Quality". Every month, CDSCO and state drug labs test samples from the market and publish batches that failed quality tests.',
      },
    ],
    accessibilityTitle: 'Voice & Readability Settings',
    voiceSpeedLabel: 'Voice Read-out Speed',
    speedSlow: 'Slow (0.8x)',
    speedNormal: 'Normal (1.0x)',
    speedFast: 'Fast (1.2x)',
    highContrastLabel: 'High Contrast Text',
    highContrastSub: 'Boosts text contrast for outdoor and low-vision reading',
    installAppTitle: 'Install MedCheck on Your Phone',
    installAppSub: 'Works like an app on low-end phones, with offline batch checks.',
    installAppBtn: 'Install App',
    iosInstallHint: 'On iPhone/iPad: tap Share in Safari, then choose "Add to Home Screen".',
    offlineBanner: 'Offline Mode — Checking against cached CDSCO list on your phone',
    dataSourceFooter: 'Data source: Central Drugs Standard Control Organisation (CDSCO) monthly NSQ & spurious lists',
  },

  ta: {
    appName: 'MedCheck',
    appNameNative: 'மெட்செக்',
    tagline: 'CDSCO எச்சரிக்கை பட்டியலில் மருந்தை சரிபார்க்கவும்',
    subTagline: 'Check medicine batches against CDSCO alerts in seconds',
    cdscoDatabaseHint: 'மத்திய மருந்து தரக் கட்டுப்பாட்டு அமைப்பு (CDSCO) தரவு',
    missionTitle: 'இலவச பொது சுகாதார சேவை',
    missionBody: 'ஒவ்வொரு குடும்பமும் தங்கள் மருந்து அரசு எச்சரிக்கை பட்டியலில் உள்ளதா என்பதை எளிதாகச் சரிபார்க்கலாம்.',
    noLoginPrivacy: 'பாதுகாப்பானது • உள்நுழைவு தேவையில்லை • உங்கள் போனில் மட்டும் சேமிப்பு',
    chooseLanguageTitle: 'மொழியைத் தேர்ந்தெடுக்கவும் / Select Language',
    sixLanguagesCount: '6 மொழிகள்',
    listenWelcomeBtn: 'வழிகாட்டுதலைக் கேளுங்கள்',
    listenWelcomeSub: 'தேர்ந்தெடுத்த மொழியில் கேட்கவும்',
    welcomeSpeechText: 'வணக்கம்! உங்க மருந்தை நாம இப்போ சுலபமா சரிபார்க்கலாம். மருந்து அட்டையோட ஒரு தெளிவான போட்டோ எடுங்க, இல்லன்னா பேரும் பேட்ச் எண்ணும் டைப் பண்ணுங்க... அரசு பாதுகாப்புப் பட்டியல்ல இருக்கான்னு நான் உடனே பார்த்துச் சொல்றேன்.',
    continueBtn: 'தொடரவும் • Continue',
    freeNoSaveMicro: '100% இலவசம் • புகைப்படம் சேமிக்கப்படாது',
    helplineTitle: 'CDSCO தேசிய மருந்து உதவி எண்',
    helplineSub: 'கட்டணமில்லா உதவி (24×7)',
    callNow: 'அழைக்க',

    navHome: 'முகப்பு',
    navScan: 'சரிபார்',
    navHistory: 'வரலாறு',
    navHelp: 'உதவி',

    homeGreeting: 'உங்கள் மருந்தைச் சரிபார்க்கவும்',
    dataUpdatedPrefix: 'புதுப்பிப்பு:',
    batchesTrackedSuffix: 'எச்சரிக்கை பேட்ச்கள்',
    heroLabel: 'விரைவு சோதனை',
    heroTitle: 'மருந்து அட்டை அல்லது பெட்டியைப் படம் எடுக்கவும்',
    heroSub: 'Batch No. (B.No.) தெரியும்படி கேமராவில் காட்டவும் அல்லது தட்டச்சு செய்யவும்.',
    scanCameraBtn: 'கேமராவால் ஸ்கேன் செய்க',
    manualEntryBtn: 'பெயர் / பேட்ச் எண் எழுதுக',
    trySampleBtn: 'மாதிரி அட்டையைப் பார்',
    directSearchLabel: 'மருந்து அல்லது பேட்ச் தேடல்',
    directSearchPlaceholder: 'எ.கா. CC-8402, Rofecoxib, Nimesulide + Paracetamol...',
    voiceListening: 'கேட்கிறது... மருந்து பெயர் அல்லது பேட்ச் எண் சொல்லுங்கள்',
    voiceNotSupported: 'இந்த உலாவியில் குரல் தேடல் இல்லை.',
    quickExamplesLabel: 'உடனடி மாதிரி சோதனை:',
    recentAlertsTitle: 'அரசு பாதுகாப்புப் பட்டியல்கள்',
    batchAlertsTab: 'பேட்ச் எச்சரிக்கை',
    bannedDrugsTab: 'தடைசெய்யப்பட்ட மருந்துகள் (444)',
    bannedSearchPlaceholder: '444 தடைசெய்யப்பட்ட மருந்துகள் அல்லது S.O./GSR தேடு...',
    bannedNoMatches: 'பொருந்தும் தடைசெய்யப்பட்ட மருந்து எதுவும் இல்லை.',
    showMoreBannedBtn: 'மேலும் காட்டு (+30)',
    showAllBannedBtn: 'அனைத்தும் காட்டு',
    viewAllAlerts: 'அனைத்தும்',
    showFewerAlerts: 'குறைவாகக் காட்டு',
    privacyCardTitle: '100% தனிப்பட்டது',
    privacyCardBody: 'புகைப்படங்கள் எழுத்தைப் படிக்க மட்டுமே பயன்படுத்தப்படும்; சேமிக்கப்படாது.',
    helplineBannerLabel: 'தேசிய மருந்து உதவி எண் (24×7)',
    tapToCall: 'உடனே அழைக்கவும்',

    scanTitle: 'மருந்து ஸ்கேன் & சோதனை',
    modeCamera: 'கேமரா / படம்',
    modeManual: 'கைமுறையாக',
    startCameraBtn: 'கேமராவைத் திற',
    capturePhotoBtn: 'படம் எடுத்துப் படி',
    uploadPhotoBtn: 'படம் பதிவேற்று',
    useSamplePhotoBtn: 'மாதிரி படத்தை ஸ்கேன் செய்',
    torchOn: 'டார்ச் ஆன்',
    torchOff: 'டார்ச் ஆஃப்',
    scanTipsTitle: 'தெளிவான படத்திற்கான குறிப்புகள்',
    scanTipsList: [
      'அட்டையில் நேரடி வெளிச்சம் பிரதிபலிக்காமல் பார்த்துக்கொள்ளுங்கள்.',
      'B.No. பகுதியை நடுவில் வைக்கவும்.',
      'சரிபார்க்கும் முன் எழுத்துக்களைத் திருத்திக்கொள்ளலாம்.',
    ],
    cameraUnavailableMsg: 'நேரடி கேமரா இங்கே கிடைக்கவில்லை. படத்தைப் பதிவேற்றவும் அல்லது மாதிரிப் படத்தை முயற்சிக்கவும்.',
    tryAgainBtn: 'மீண்டும் முயற்சிக்கவும் (Try Again)',
    takePhotoPhoneCameraBtn: 'போன் கேமரா மூலம் புகைப்படம் எடுக்கவும்',
    cameraLoadingMsg: 'கேமரா தொடங்குகிறது...',
    cameraPermissionDeniedMsg: 'கேமரா அனுமதி மறுக்கப்பட்டது. பிரவுசர் அமைப்புகளில் அனுமதிக்கவும்.',
    cameraNotFoundMsg: 'கேமரா சாதனங்கள் எதுவும் காணப்படவில்லை.',
    cameraInUseMsg: 'கேமரா வேறு பயன்பாட்டில் உள்ளது.',
    cameraInsecureMsg: 'பாதுகாப்பான HTTPS இணைப்பு தேவை.',
    privacyScanPill: 'எழுத்தைப் படிக்க மட்டுமே; படம் சேமிக்கப்படாது',
    readingLabelTitle: 'லேபிள் படிக்கப்படுகிறது...',
    readingLabelSub: 'மருந்து பெயரும் பேட்ச் எண்ணும் கண்டறியப்படுகின்றன',
    confirmDetailsTitle: 'விவரங்களை உறுதிப்படுத்தவும்',
    confirmDetailsSub: '0 மற்றும் O, 1 மற்றும் I போன்ற எழுத்துக்களைச் சரிபார்த்து தேவையானால் திருத்தவும்.',
    medicineNameLabel: 'மருந்தின் பெயர்',
    medicineNamePlaceholder: 'எ.கா. Calpol 650',
    genericNameLabel: 'மருந்து உட்பொருள் (விருப்பம்)',
    batchNumberLabel: 'பேட்ச் எண் (B.No.)',
    batchNumberPlaceholder: 'எ.கா. CC-8402',
    expDateLabel: 'காலாவதி தேதி (EXP)',
    verifyNowBtn: 'CDSCO பட்டியலில் சரிபார்',
    retakePhotoBtn: 'வேறொரு படம் எடு',
    enterAtLeastOneError: 'மருந்தின் பெயர் அல்லது பேட்ச் எண்ணை உள்ளிடவும்.',

    checkingHeading: 'CDSCO பட்டியலில் சரிபார்க்கிறது...',
    checkingSub: 'அரசு தர எச்சரிக்கைகளுடன் ஒப்பிடப்படுகிறது',
    stayCalmTitle: 'அமைதியாக இருங்கள்',
    stayCalmBody: 'இது எச்சரிக்கை தகவல் மட்டுமே; மருத்துவ ஆலோசனை அல்ல.',

    listenResultBtn: 'கேளுங்கள்',
    stopListeningBtn: 'நிறுத்து',
    voiceBusyHint: 'தமிழ் குரல் தயாராக சில வினாடிகள் ஆகும். தயவுசெய்து மீண்டும் தட்டவும்.',
    checkAnotherBtn: 'மற்றொரு மருந்தைச் சரிபார்',
    savedOnPhoneNote: 'இந்தச் சோதனை உங்கள் போனில் மட்டுமே சேமிக்கப்பட்டது.',

    flaggedBadge: 'CDSCO எச்சரிக்கையில் உள்ளது',
    bannedGazetteBadge: 'பிரிவு 26A கீழ் தடைசெய்யப்பட்ட மருந்து',
    gazetteNotificationLabel: 'அரசிதழ் அறிவிப்பு (Gazette Notification)',
    serialNoLabel: 'வரிசை எண் (Sr. No.)',
    legalNoteLabel: 'சட்ட / ஒழுங்குமுறை குறிப்பு',
    bannedCardExplanation: 'மருந்துகள் மற்றும் அழகுசாதனப் பொருட்கள் சட்டம், 1940 பிரிவு 26A கீழ் மத்திய சுகாதார அமைச்சக அரசிதழ் அறிவிப்பால் உற்பத்தி மற்றும் விற்பனை தடைசெய்யப்பட்டது/கட்டுப்படுத்தப்பட்டது.',
    alsoFlaggedBannedTitle: 'பிரிவு 26A தடைசெய்யப்பட்ட மருந்து பொருத்தம்',
    flaggedSummaryPrefix: 'இந்த பேட்ச் அரசு எச்சரிக்கை பட்டியலில் கண்டறியப்பட்டது.',
    reasonLabel: 'காரணம்',
    stateLabel: 'மாநிலம்',
    monthLabel: 'மாதம்',
    labLabel: 'ஆய்வகம்',
    sourceLabel: 'ஆதாரம்',
    whatToDoTitle: 'அடுத்து என்ன செய்ய வேண்டும்',
    flaggedStep1Title: 'இந்த மருந்தைப் பயன்படுத்துவதை நிறுத்துங்கள்',
    flaggedStep1Body: 'பாதுகாப்பாகத் தனியே வைக்கவும்.',
    flaggedStep2Title: 'ஏற்கனவே உட்கொண்டிருந்தால் பதற வேண்டாம்',
    flaggedStep2Body: 'மருத்துவர், மருந்தாளர் அல்லது அருகிலுள்ள ஆரம்ப சுகாதார நிலையத்தை (PHC) அணுகவும்.',
    flaggedStep3Title: 'மருந்தகத்திற்குத் தெரிவித்து ரசீதை வைத்திருங்கள்',
    flaggedStep3Body: 'வாங்கிய கடைக்குத் தெரிவித்து பில் வைத்திருங்கள்.',
    callHelplineCta: 'உதவி எண்: 1800-11-4477 அழைக்கவும்',
    reportGuideBtn: 'புகார் அளிப்பது எப்படி?',
    reportGuideTitle: 'மாநில மருந்து கட்டுப்பாட்டு அலுவலரிடம் புகார்',
    reportGuideBody: '1800-11-4477 எண்ணிற்கு அழைக்கவும் அல்லது மாநில மருந்து கட்டுப்பாட்டு அலுவலகத்தில் ரசீதுடன் தெரிவிக்கவும்.',

    possibleBadge: 'ஒத்த பேட்ச் எண் — கவனமாக ஒப்பிடுங்கள்',
    possibleTitle: 'இது எச்சரிக்கை பேட்சைப் போல் உள்ளது',
    possibleSub: 'முழு விவரம் பார்க்கும் முன் இரு பேட்ச் எண்களையும் ஒப்பிடுங்கள்.',
    yourEntryLabel: 'நீங்கள் உள்ளிட்டது',
    flaggedBatchLabel: 'எச்சரிக்கை பேட்ச்',
    lookalikeHint: '0/O அல்லது 1/I போன்ற ஒத்த எழுத்துக்கள் உள்ளன.',
    typoHint: '1-2 எழுத்துக்கள் மட்டுமே வேறுபடுகின்றன.',
    medicineMatchHint: 'மருந்தின் பெயர் எச்சரிக்கை பட்டியலில் உள்ள மருந்துடன் பொருந்துகிறது.',
    confirmIsMatchBtn: 'ஆம், என் பேட்ச் இதுதான் — விவரம் பார்',
    confirmNotMatchBtn: 'இல்லை, என் பேட்ச் வேறு',

    notFoundBadge: 'எச்சரிக்கையில் இல்லை',
    notFoundTitle: 'இந்த பேட்ச் எச்சரிக்கை பட்டியலில் இல்லை',
    notFoundSub: 'தற்போதைய CDSCO பட்டியலில் இந்த பேட்ச் எண் காணப்படவில்லை.',
    whatThisMeansTitle: 'இதன் பொருள் என்ன?',
    notFoundMeaningBody: 'பட்டியலில் இல்லாதது மருந்து 100% தரமானது என்பதற்கான உத்தரவாதம் அல்ல.',
    notFoundCaution: 'நிறம், வாசனை அல்லது சீலில் சந்தேகம் இருந்தால் மருந்தாளர் அல்லது மருத்துவரை அணுகவும்.',
    physicalCheckTitle: '4-அம்ச வெளிப்புறச் சோதனை',
    physicalChecks: [
      { title: 'அச்சுத் தெளிவு', desc: 'பேட்ச் எண் தெளிவாக உள்ளதா?' },
      { title: 'சீல் பாதுகாப்பு', desc: 'பேக்கிங் கிழியாமல் உள்ளதா?' },
      { title: 'மருந்தின் தோற்றம்', desc: 'நிறம் மாற்றமின்றி உள்ளதா?' },
      { title: 'காலாவதி தேதி', desc: 'EXP தேதி சரியாக உள்ளதா?' },
    ],

    historyTitle: 'சோதனை வரலாறு',
    historySub: 'உங்கள் போனில் மட்டும் சேமிப்பு',
    checksCountLabel: 'சோதனைகள்',
    filterAll: 'அனைத்தும்',
    filterFlagged: 'எச்சரிக்கை',
    filterPossible: 'ஒத்தவை',
    filterNotFound: 'பட்டியலில் இல்லை',
    historyEmptyTitle: 'வரலாறு எதுவும் இல்லை',
    historyEmptyBody: 'நீங்கள் சரிபார்க்கும் மருந்துகள் இங்கே சேமிக்கப்படும்.',
    clearHistoryBtn: 'வரலாற்றை அழி',
    clearConfirmTitle: 'வரலாற்றை அழிக்கவா?',
    clearConfirmBody: 'உங்கள் போனில் சேமிக்கப்பட்ட அனைத்து பதிவுகளும் நீக்கப்படும்.',
    cancelBtn: 'ரத்து செய்',
    confirmDeleteBtn: 'அழி',
    viewDetailsBtn: 'விவரம் பார்',
    historyLocalBadge: 'போனில் மட்டும் சேமிப்பு',
    closeBtn: 'மூடு',

    helpHeroTitle: 'பாதுகாப்பு & தனியுரிமை',
    helpHeroSub: 'MedCheck ஒரு இலவச பொது சேவை. இது மருத்துவ ஆலோசனை வழங்காது.',
    localProcessingTitle: 'படங்கள் சேமிக்கப்படாது',
    localProcessingSub: 'எழுத்தைப் படித்தவுடன் நீக்கப்படும்.',
    cdscoSyncTitle: 'CDSCO தரவு',
    cdscoSyncSub: 'மாதாந்திர அரசு எச்சரிக்கை பட்டியல்.',
    reassuranceCardTitle: 'சந்தேகம் இருந்தால் மருத்துவரைக் கேளுங்கள்',
    reassuranceCardSub: 'மருந்தாளர், மருத்துவர் அல்லது 1800-11-4477 அழைக்கவும்.',
    faqTitle: 'பொதுவான கேள்விகள்',
    faqs: [
      {
        q: 'எச்சரிக்கை மருந்தை ஏற்கனவே சாப்பிட்டிருந்தால் என்ன செய்வது?',
        a: 'பதற வேண்டாம். உடனே அந்த மருந்தை நிறுத்திவிட்டு, அட்டையுடன் மருத்துவர் அல்லது அருகிலுள்ள அரசு மருத்துவமனையை அணுகவும்.',
      },
      {
        q: 'மருந்து புகைப்படம் சர்வரில் சேமிக்கப்படுமா?',
        a: 'இல்லை. எழுத்தைப் படிக்க மட்டுமே பயன்படும்; எங்கும் சேமிக்கப்படாது.',
      },
      {
        q: 'பட்டியலில் இல்லை என்றால் மருந்து பாதுகாப்பானதா?',
        a: 'அது உத்தரவாதம் அல்ல. எப்போதும் பேக்கிங் மற்றும் காலாவதி தேதியைச் சரிபார்க்கவும்.',
      },
      {
        q: 'CDSCO NSQ பட்டியல் என்றால் என்ன?',
        a: 'தரச் சோதனையில் தோல்வியடைந்த மருந்து பேட்ச்களின் அரசு மாதாந்திர பட்டியல்.',
      },
    ],
    accessibilityTitle: 'குரல் & வாசிப்பு அமைப்புகள்',
    voiceSpeedLabel: 'குரல் வேகம்',
    speedSlow: 'மெதுவாக (0.8x)',
    speedNormal: 'சாதாரணம் (1.0x)',
    speedFast: 'வேகமாக (1.2x)',
    highContrastLabel: 'அதிக கான்ட்ராஸ்ட்',
    highContrastSub: 'எழுத்துக்கள் தெளிவாகத் தெரிய',
    installAppTitle: 'செயலியாக நிறுவவும்',
    installAppSub: 'ஆஃப்லைனிலும் பயன்படுத்த முகப்புத் திரையில் சேர்க்கவும்.',
    installAppBtn: 'MedCheck நிறுவு',
    iosInstallHint: 'iPhone/iPad: Safari-ல் Share -> Add to Home Screen அழுத்தவும்.',
    offlineBanner: 'ஆஃப்லைன் நிலை — சேமிக்கப்பட்ட CDSCO பட்டியலில் சரிபார்க்கிறது',
    dataSourceFooter: 'ஆதாரம்: CDSCO மாதாந்திர NSQ & போலி மருந்து எச்சரிக்கைகள்',
  },

  bn: {
    appName: 'MedCheck',
    appNameNative: 'মেডচেক',
    tagline: 'সরকারি (CDSCO) তালিকা থেকে ওষুধ যাচাই করুন',
    subTagline: 'Check medicine batches against CDSCO quality alerts in seconds',
    cdscoDatabaseHint: 'কেন্দ্রীয় ওষুধ মান নিয়ন্ত্রণ সংস্থা (CDSCO) সতর্কতা তালিকা',
    missionTitle: 'বিনামূল্যে জনস্বাস্থ্য পরিষেবা',
    missionBody: 'প্রতিটি পরিবারের জন্য সহজ ও শান্ত ওষুধ যাচাই অ্যাপ। কোনো প্রযুক্তিগত জ্ঞানের প্রয়োজন নেই।',
    noLoginPrivacy: 'নিরাপদ • লগইন প্রয়োজন নেই • শুধুমাত্র আপনার ফোনে সেভ হয়',
    chooseLanguageTitle: 'ভাষা নির্বাচন করুন / Select Language',
    sixLanguagesCount: '6টি ভাষা',
    listenWelcomeBtn: 'নির্দেশ শুনুন',
    listenWelcomeSub: 'আপনার ভাষায় শুনুন',
    welcomeSpeechText: 'নমস্কার! চলুন একসাথে আপনার ওষুধটা একবার যাচাই করে নিই। শুধু ওষুধের পাতার একটা পরিষ্কার ছবি তুলুন, অথবা নাম আর ব্যাচ নম্বরটা লিখে দিন... সরকারি সতর্কতা তালিকায় আছে কিনা আমি এখনই দেখে বলছি।',
    continueBtn: 'এগিয়ে যান • Continue',
    freeNoSaveMicro: '100% বিনামূল্যে • ছবি সংরক্ষণ করা হয় না',
    helplineTitle: 'CDSCO জাতীয় ওষুধ হেল্পলাইন',
    helplineSub: 'টোল-ফ্রি সহায়তা (24×7)',
    callNow: 'কল করুন',

    navHome: 'হোম',
    navScan: 'যাচাই করুন',
    navHistory: 'ইতিহাস',
    navHelp: 'সাহায্য ও গোপনীয়তা',

    homeGreeting: 'আপনার ওষুধ যাচাই করুন',
    dataUpdatedPrefix: 'ডেটা আপডেট:',
    batchesTrackedSuffix: 'সতর্কতা ব্যাচ',
    heroLabel: 'দ্রুত নিরাপত্তা যাচাই',
    heroTitle: 'ওষুধের পাতা বা বাক্সের ছবি তুলুন',
    heroSub: 'ক্যামেরার সামনে B.No. বা Batch No. ধরুন অথবা হাতে লিখুন।',
    scanCameraBtn: 'ক্যামেরা দিয়ে স্ক্যান করুন',
    manualEntryBtn: 'নাম বা ব্যাচ নম্বর লিখুন',
    trySampleBtn: 'নমুনা পাতা দেখুন',
    directSearchLabel: 'সরাসরি নাম বা ব্যাচ খুঁজুন',
    directSearchPlaceholder: 'যেমন CC-8402, Rofecoxib, Nimesulide + Paracetamol...',
    voiceListening: 'শুনছি... ওষুধের নাম বা ব্যাচ নম্বর বলুন',
    voiceNotSupported: 'এই ব্রাউজারে ভয়েস সার্চ উপলব্ধ নয়।',
    quickExamplesLabel: 'নমুনা যাচাই:',
    recentAlertsTitle: 'সরকারি নিরাপত্তা তালিকা',
    batchAlertsTab: 'ব্যাচ সতর্কতা',
    bannedDrugsTab: 'নিষিদ্ধ ওষুধ (444)',
    bannedSearchPlaceholder: '444টি নিষিদ্ধ ওষুধ বা S.O./GSR নম্বর খুঁজুন...',
    bannedNoMatches: 'এই অনুসন্ধানে কোনো নিষিদ্ধ ওষুধ পাওয়া যায়নি।',
    showMoreBannedBtn: 'আরও দেখুন (+30)',
    showAllBannedBtn: 'সব দেখুন',
    viewAllAlerts: 'সব দেখুন',
    showFewerAlerts: 'কম দেখুন',
    privacyCardTitle: '100% নিরাপদ ও ব্যক্তিগত',
    privacyCardBody: 'ছবি শুধুমাত্র লেখা পড়ার জন্য ব্যবহৃত হয় এবং কোথাও সংরক্ষণ করা হয় না।',
    helplineBannerLabel: 'জাতীয় ওষুধ হেল্পলাইন (24×7)',
    tapToCall: 'এখনই কল করুন',

    scanTitle: 'ওষুধ স্ক্যান ও যাচাই',
    modeCamera: 'ক্যামেরা / ছবি',
    modeManual: 'হাতে লিখুন',
    startCameraBtn: 'ক্যামেরা খুলুন',
    capturePhotoBtn: 'ছবি তুলে পড়ুন',
    uploadPhotoBtn: 'ছবি আপলোড করুন',
    useSamplePhotoBtn: 'নমুনা পাতা স্ক্যান করুন',
    torchOn: 'টর্চ অন',
    torchOff: 'টর্চ অফ',
    scanTipsTitle: 'স্পষ্ট ছবির জন্য টিপস',
    scanTipsList: [
      'ফয়েলে সরাসরি আলোর প্রতিফলন এড়িয়ে চলুন।',
      'B.No. অংশটি ফ্রেমের মাঝখানে রাখুন।',
      'যাচাইয়ের আগে যেকোনো অক্ষর সংশোধন করতে পারবেন।',
    ],
    cameraUnavailableMsg: 'লাইভ ক্যামেরা এখানে উপলব্ধ নয়। ছবি আপলোড করুন বা নমুনা পাতা পরীক্ষা করুন।',
    tryAgainBtn: 'আবার চেষ্টা করুন (Try Again)',
    takePhotoPhoneCameraBtn: 'ফোনের ক্যামেরা দিয়ে ছবি তুলুন',
    cameraLoadingMsg: 'ক্যামেরা চালু হচ্ছে...',
    cameraPermissionDeniedMsg: 'ক্যামেরার অনুমতি দেওয়া হয়নি। ব্রাউজার সেটিংসে অনুমতি দিন।',
    cameraNotFoundMsg: 'কোনো ক্যামেরা পাওয়া যায়নি।',
    cameraInUseMsg: 'ক্যামেরাটি অন্য কোনো অ্যাপ বা ট্যাবে ব্যবহৃত হচ্ছে।',
    cameraInsecureMsg: 'ক্যামেরা ব্যবহারের জন্য সুরক্ষিত HTTPS সংযোগ প্রয়োজন।',
    privacyScanPill: 'ছবি শুধুমাত্র লেখা পড়তে ব্যবহৃত হয়, কখনো সেভ হয় না',
    readingLabelTitle: 'লেবেল পড়া হচ্ছে...',
    readingLabelSub: 'ওষুধের নাম ও ব্যাচ নম্বর শনাক্ত করা হচ্ছে',
    confirmDetailsTitle: 'তথ্য নিশ্চিত করুন',
    confirmDetailsSub: '0 এবং O বা 1 এবং I-এর মতো অক্ষর মিলিয়ে নিন ও প্রয়োজনে সংশোধন করুন।',
    medicineNameLabel: 'ওষুধের নাম',
    medicineNamePlaceholder: 'যেমন Calpol 650',
    genericNameLabel: 'উপাদান (ঐচ্ছিক)',
    batchNumberLabel: 'ব্যাচ নম্বর (B.No.)',
    batchNumberPlaceholder: 'যেমন CC-8402',
    expDateLabel: 'মেয়াদ উত্তীর্ণের তারিখ (EXP)',
    verifyNowBtn: 'CDSCO তালিকায় যাচাই করুন',
    retakePhotoBtn: 'অন্য ছবি তুলুন',
    enterAtLeastOneError: 'অনুগ্রহ করে ওষুধের নাম বা ব্যাচ নম্বর লিখুন।',

    checkingHeading: 'CDSCO তালিকা মিলিয়ে দেখা হচ্ছে...',
    checkingSub: 'সরকারি NSQ এবং নকল ওষুধের সতর্কতা দেখা হচ্ছে',
    stayCalmTitle: 'অনুগ্রহ করে শান্ত থাকুন',
    stayCalmBody: 'মেডচেক কোনো চিকিৎসা বা ডোজ পরামর্শ দেয় না।',

    listenResultBtn: 'শুনুন',
    stopListeningBtn: 'থামান',
    voiceBusyHint: 'বাংলা ভয়েস লোড হতে কয়েক সেকেন্ড সময় লাগছে। অনুগ্রহ করে একটু পর আবার চাপুন।',
    checkAnotherBtn: 'অন্য ওষুধ যাচাই করুন',
    savedOnPhoneNote: 'এই তথ্য শুধুমাত্র আপনার ফোনেই সংরক্ষিত হয়েছে।',

    flaggedBadge: 'CDSCO সতর্কতা তালিকায় আছে',
    bannedGazetteBadge: 'ধারা 26A অনুযায়ী নিষিদ্ধ ওষুধ',
    gazetteNotificationLabel: 'সরকারি গেজেট বিজ্ঞপ্তি (Notification)',
    serialNoLabel: 'ক্রমিক নং (Sr. No.)',
    legalNoteLabel: 'আইনি / নিয়ন্ত্রক নোট',
    bannedCardExplanation: 'ড্রাগস অ্যান্ড কসমেটিকস অ্যাক্ট, 1940-এর ধারা 26A অনুযায়ী কেন্দ্রীয় স্বাস্থ্য মন্ত্রকের গেজেট বিজ্ঞপ্তি দ্বারা উৎপাদন ও বিক্রয় নিষিদ্ধ বা নিয়ন্ত্রিত।',
    alsoFlaggedBannedTitle: 'ধারা 26A নিষিদ্ধ ওষুধের মিল',
    flaggedSummaryPrefix: 'এই ব্যাচটি সরকারি সতর্কতা তালিকায় পাওয়া গেছে।',
    reasonLabel: 'কারণ',
    stateLabel: 'রাজ্য',
    monthLabel: 'সতর্কতার মাস',
    labLabel: 'পরীক্ষাগার',
    sourceLabel: 'সরকারি সূত্র',
    whatToDoTitle: 'এখন কী করবেন',
    flaggedStep1Title: 'এই ওষুধের ব্যবহার বন্ধ করুন',
    flaggedStep1Body: 'বোতল বা পাতাটি শিশুদের নাগালের বাইরে আলাদা রাখুন।',
    flaggedStep2Title: 'যদি খেয়ে থাকেন তবে আতঙ্কিত হবেন না',
    flaggedStep2Body: 'ওষুধের পাতাসহ ডাক্তার, ফার্মাসিস্ট বা নিকটস্থ স্বাস্থ্যকেন্দ্রে (PHC) যোগাযোগ করুন।',
    flaggedStep3Title: 'দোকানদারকে জানান ও রসিদ রাখুন',
    flaggedStep3Body: 'যে দোকান থেকে কিনেছেন তাদের জানান এবং রসিদ সংরক্ষণ করুন।',
    callHelplineCta: 'হেল্পলাইন 1800-11-4477-এ কল করুন',
    reportGuideBtn: 'কীভাবে অভিযোগ জানাবেন',
    reportGuideTitle: 'ড্রাগ কন্ট্রোলারকে জানানোর নিয়ম',
    reportGuideBody: '1800-11-4477 নম্বরে কল করুন অথবা রসিদসহ আপনার রাজ্যের ড্রাগ কন্ট্রোল অফিসে জানান।',

    possibleBadge: 'সম্ভাব্য মিল — সাবধানে তুলনা করুন',
    possibleTitle: 'এটি একটি সতর্কতা ব্যাচের সাথে মিলছে',
    possibleSub: 'বিস্তারিত দেখার আগে উভয় ব্যাচ নম্বর অক্ষর ধরে ধরে মিলিয়ে নিন।',
    yourEntryLabel: 'আপনার লেখা ব্যাচ',
    flaggedBatchLabel: 'সতর্কতা ব্যাচ',
    lookalikeHint: '0/O বা 1/I-এর মতো দেখতে অক্ষর পাওয়া গেছে।',
    typoHint: 'মাত্র ১-২টি অক্ষরের পার্থক্য রয়েছে।',
    medicineMatchHint: 'ওষুধের নাম সতর্কতা তালিকার একটি ওষুধের সাথে মিলছে।',
    confirmIsMatchBtn: 'হ্যাঁ, আমার ব্যাচ এটাই — বিস্তারিত দেখুন',
    confirmNotMatchBtn: 'না, আমার ব্যাচ আলাদা',

    notFoundBadge: 'সতর্কতা তালিকায় নেই',
    notFoundTitle: 'এই ব্যাচটি আমাদের সতর্কতা তালিকায় নেই',
    notFoundSub: 'বর্তমান CDSCO তালিকায় এই ব্যাচ নম্বরটি পাওয়া যায়নি।',
    whatThisMeansTitle: 'এর অর্থ কী?',
    notFoundMeaningBody: 'তালিকায় না থাকা কখনোই ওষুধটি আসল বা নিরাপদ হওয়ার গ্যারান্টি নয়।',
    notFoundCaution: 'রঙ, গন্ধ বা সিলে কোনো সন্দেহ হলে ফার্মাসিস্ট বা ডাক্তারের পরামর্শ নিন।',
    physicalCheckTitle: 'প্যাকেজিংয়ের ৪টি পরীক্ষা',
    physicalChecks: [
      { title: 'ছাপার মান', desc: 'ব্যাচ লেখা কি স্পষ্ট ও পরিষ্কার?' },
      { title: 'সিল পরীক্ষা', desc: 'পাতা বা মুখ কি সঠিকভাবে সিল করা?' },
      { title: 'ওষুধের চেহারা', desc: 'ট্যাবলেট বা সিরাপের রঙ কি স্বাভাবিক?' },
      { title: 'মেয়াদ যাচাই', desc: 'EXP তারিখ কি স্পষ্ট ও বৈধ?' },
    ],

    historyTitle: 'যাচাই ইতিহাস',
    historySub: 'শুধুমাত্র আপনার ফোনে সংরক্ষিত',
    checksCountLabel: 'টি যাচাই',
    filterAll: 'সব',
    filterFlagged: 'সতর্কতা',
    filterPossible: 'সম্ভাব্য মিল',
    filterNotFound: 'তালিকায় নেই',
    historyEmptyTitle: 'কোনো ইতিহাস নেই',
    historyEmptyBody: 'আপনি যাচাই করলে তা শুধুমাত্র আপনার ফোনে এখানে জমা থাকবে।',
    clearHistoryBtn: 'ইতিহাস মুছুন',
    clearConfirmTitle: 'সব ইতিহাস মুছে ফেলবেন?',
    clearConfirmBody: 'আপনার ফোনের সব রেকর্ড মুছে যাবে।',
    cancelBtn: 'বাতিল',
    confirmDeleteBtn: 'মুছে ফেলুন',
    viewDetailsBtn: 'বিস্তারিত দেখুন',
    historyLocalBadge: 'শুধুমাত্র ডিভাইসে সংরক্ষিত',
    closeBtn: 'বন্ধ করুন',

    helpHeroTitle: 'সুরক্ষা ও গোপনীয়তা',
    helpHeroSub: 'মেডচেক একটি বিনামূল্যে জনসেবা। এটি কোনো চিকিৎসা পরামর্শ দেয় না।',
    localProcessingTitle: 'ছবি রাখা হয় না',
    localProcessingSub: 'লেখা পড়ার পরপরই মুছে ফেলা হয়।',
    cdscoSyncTitle: 'CDSCO তথ্য',
    cdscoSyncSub: 'মাসিক সরকারি সতর্কতা তালিকা ভিত্তিক।',
    reassuranceCardTitle: 'সন্দেহ হলে বিশেষজ্ঞকে জিজ্ঞাসা করুন',
    reassuranceCardSub: 'ডাক্তার, ফার্মাসিস্ট বা 1800-11-4477 নম্বরে কথা বলুন।',
    faqTitle: 'সাধারণ প্রশ্নাবলী',
    faqs: [
      {
        q: 'ওষুধটি সতর্কতা তালিকায় থাকলে এবং আমি খেয়ে ফেললে কী করব?',
        a: 'আতঙ্কিত হবেন না। ওষুধটি খাওয়া বন্ধ করুন এবং পাতাসহ ডাক্তার বা স্বাস্থ্যকেন্দ্রে দেখান।',
      },
      {
        q: 'ছবি কি সার্ভারে সেভ হয়?',
        a: 'না। ছবি শুধুমাত্র লেখা পড়ার জন্য ব্যবহৃত হয় এবং কখনো সংরক্ষণ করা হয় না।',
      },
      {
        q: 'তালিকায় না পাওয়া গেলে কি ওষুধটি নিরাপদ?',
        a: 'না, এটি কোনো গ্যারান্টি নয়। সন্দেহ হলে ফার্মাসিস্টকে দেখান।',
      },
      {
        q: 'CDSCO NSQ তালিকা কী?',
        a: 'মান পরীক্ষায় ব্যর্থ হওয়া ওষুধের সরকারি মাসিক তালিকা।',
      },
    ],
    accessibilityTitle: 'ভয়েস ও পড়ার সুবিধা',
    voiceSpeedLabel: 'ভয়েসের গতি',
    speedSlow: 'ধীর (0.8x)',
    speedNormal: 'স্বাভাবিক (1.0x)',
    speedFast: 'দ্রুত (1.2x)',
    highContrastLabel: 'হাই কন্ট্রাস্ট টেক্সট',
    highContrastSub: 'অক্ষর আরও স্পষ্ট দেখাতে',
    installAppTitle: 'অ্যাপ হিসেবে ইনস্টল করুন',
    installAppSub: 'অফলাইনেও ব্যবহারের জন্য হোম স্ক্রিনে যোগ করুন।',
    installAppBtn: 'MedCheck ইনস্টল করুন',
    iosInstallHint: 'iPhone/iPad: Safari-তে Share -> Add to Home Screen চাপুন।',
    offlineBanner: 'অফলাইন মোড — ফোনে সংরক্ষিত CDSCO তালিকা থেকে যাচাই হচ্ছে',
    dataSourceFooter: 'সূত্র: CDSCO মাসিক NSQ এবং নকল ওষুধের তালিকা',
  },

  mr: {
    appName: 'MedCheck',
    appNameNative: 'मेडचेक',
    tagline: 'भारत सरकार (CDSCO) यादीतून औषध तपासा',
    subTagline: 'Check medicine batches against CDSCO quality alerts in seconds',
    cdscoDatabaseHint: 'केंद्रीय औषध मानक नियंत्रण संघटना (CDSCO) सूचना यादी',
    missionTitle: 'जनहितासाठी मोफत सुविधा',
    missionBody: 'प्रत्येक कुटुंबासाठी सोपी व शांत औषध तपासणी सेवा.',
    noLoginPrivacy: 'सुरक्षित • लॉगिन नाही • फक्त तुमच्या फोनवर जतन',
    chooseLanguageTitle: 'तुमची भाषा निवडा / Select Language',
    sixLanguagesCount: '6 भाषा',
    listenWelcomeBtn: 'सूचना ऐका',
    listenWelcomeSub: 'तुमच्या भाषेत माहिती ऐका',
    welcomeSpeechText: 'नमस्कार! चला, आपण तुमच्या औषधाची खात्री करून घेऊया. फक्त औषधाच्या पाकिटाचा एक स्पष्ट फोटो काढा, किंवा नाव आणि बॅच नंबर लिहा... सरकारी सूचना यादीत ते आहे का ते मी लगेच पाहून सांगते.',
    continueBtn: 'पुढे जा • Continue',
    freeNoSaveMicro: '100% मोफत • फोटो जतन केला जात नाही',
    helplineTitle: 'CDSCO राष्ट्रीय औषध हेल्पलाइन',
    helplineSub: 'मोफत मदत (24×7)',
    callNow: 'कॉल करा',

    navHome: 'मुख्यपृष्ठ',
    navScan: 'तपासा',
    navHistory: 'इतिहास',
    navHelp: 'मदत व सुरक्षा',

    homeGreeting: 'तुमचे औषध तपासा',
    dataUpdatedPrefix: 'डेटा अपडेट:',
    batchesTrackedSuffix: 'बॅच यादीत',
    heroLabel: 'त्वरित तपासणी',
    heroTitle: 'औषधाच्या पाकिटाचा किंवा बाटलीचा फोटो घ्या',
    heroSub: 'B.No. किंवा Batch No. कॅमेऱ्यासमोर आणा किंवा स्वतः टाइप करा.',
    scanCameraBtn: 'कॅमेऱ्याने स्कॅन करा',
    manualEntryBtn: 'नाव किंवा बॅच क्रमांक लिहा',
    trySampleBtn: 'नमुना पाकीट पहा',
    directSearchLabel: 'थेट नाव किंवा बॅच शोधा',
    directSearchPlaceholder: 'उदा. CC-8402, Rofecoxib, Nimesulide + Paracetamol...',
    voiceListening: 'ऐकत आहोत... औषधाचे नाव किंवा बॅच बोला',
    voiceNotSupported: 'या ब्राउझरमध्ये आवाज शोध उपलब्ध नाही.',
    quickExamplesLabel: 'नमुना तपासणी:',
    recentAlertsTitle: 'सरकारी सुरक्षा याद्या',
    batchAlertsTab: 'बॅच सूचना',
    bannedDrugsTab: 'बंदी घातलेली औषधे (444)',
    bannedSearchPlaceholder: '444 बंदी घातलेली औषधे किंवा S.O./GSR क्र. शोधा...',
    bannedNoMatches: 'या शोधात कोणतेही प्रतिबंधित औषध सापडले नाही.',
    showMoreBannedBtn: 'अधिक पहा (+30)',
    showAllBannedBtn: 'सर्व पहा',
    viewAllAlerts: 'सर्व पहा',
    showFewerAlerts: 'कमी पहा',
    privacyCardTitle: '100% सुरक्षित व खाजगी',
    privacyCardBody: 'फोटो फक्त मजकूर वाचण्यासाठी वापरला जातो आणि कुठेही साठवला जात नाही.',
    helplineBannerLabel: 'राष्ट्रीय औषध हेल्पलाइन (24×7)',
    tapToCall: 'आता कॉल करा',

    scanTitle: 'औषध स्कॅन करा',
    modeCamera: 'कॅमेरा / फोटो',
    modeManual: 'हाताने लिहा',
    startCameraBtn: 'कॅमेरा उघडा',
    capturePhotoBtn: 'फोटो काढून वाचा',
    uploadPhotoBtn: 'फोटो अपलोड करा',
    useSamplePhotoBtn: 'नमुना फोटो स्कॅन करा',
    torchOn: 'टॉर्च चालू',
    torchOff: 'टॉर्च बंद',
    scanTipsTitle: 'स्पष्ट फोटोसाठी टिप्स',
    scanTipsList: [
      'पाकिटावर थेट चमक येऊ देऊ नका.',
      'B.No. भाग मध्यभागी ठेवा.',
      'तपासण्यापूर्वी तुम्ही अक्षरे दुरुस्त करू शकता.',
    ],
    cameraUnavailableMsg: 'थेट कॅमेरा येथे उपलब्ध नाही. फोटो अपलोड करा किंवा नमुना फोटो वापरा.',
    tryAgainBtn: 'पुन्हा प्रयत्न करा (Try Again)',
    takePhotoPhoneCameraBtn: 'फोनच्या कॅमेऱ्याने फोटो काढा',
    cameraLoadingMsg: 'कॅमेरा सुरू होत आहे...',
    cameraPermissionDeniedMsg: 'कॅमेरा परवानगी नाकारली. कृपया ब्राउझर सेटिंग्जमध्ये परवानगी द्या.',
    cameraNotFoundMsg: 'कोणताही कॅमेरा आढळला नाही.',
    cameraInUseMsg: 'कॅमेरा आधीच इतर अनुप्रयोग किंवा टॅबद्वारे वापरला जात आहे.',
    cameraInsecureMsg: 'कॅमेरा प्रवेशासाठी सुरक्षित HTTPS कनेक्शन आवश्यक आहे.',
    privacyScanPill: 'फोटो फक्त वाचण्यासाठी; कधीही साठवला जात नाही',
    readingLabelTitle: 'लेबल वाचले जात आहे...',
    readingLabelSub: 'औषधाचे नाव आणि बॅच क्रमांक ओळखला जात आहे',
    confirmDetailsTitle: 'तपशील तपासा',
    confirmDetailsSub: '0 आणि O किंवा 1 आणि I सारखी अक्षरे तपासून हवी असल्यास दुरुस्ती करा.',
    medicineNameLabel: 'औषधाचे नाव',
    medicineNamePlaceholder: 'उदा. Calpol 650',
    genericNameLabel: 'घटक (ऐच्छिक)',
    batchNumberLabel: 'बॅच क्रमांक (B.No.)',
    batchNumberPlaceholder: 'उदा. CC-8402',
    expDateLabel: 'मुदत तारीख (EXP)',
    verifyNowBtn: 'CDSCO यादीशी जुळवा',
    retakePhotoBtn: 'दुसरा फोटो घ्या',
    enterAtLeastOneError: 'कृपया औषधाचे नाव किंवा बॅच क्रमांक टाका.',

    checkingHeading: 'CDSCO यादी तपासली जात आहे...',
    checkingSub: 'सरकारी NSQ आणि बनावट औषध सूचना तपासल्या जात आहेत',
    stayCalmTitle: 'कृपया शांत राहा',
    stayCalmBody: 'मेडचेक कोणताही वैद्यकीय सल्ला किंवा डोस देत नाही.',

    listenResultBtn: 'ऐका',
    stopListeningBtn: 'थांबवा',
    voiceBusyHint: 'मराठी आवाज सुरू होण्यासाठी काही सेकंद लागत आहेत. कृपया पुन्हा प्रयत्न करा.',
    checkAnotherBtn: 'दुसरे औषध तपासा',
    savedOnPhoneNote: 'ही तपासणी फक्त तुमच्या फोनवरच जतन केली आहे.',

    flaggedBadge: 'CDSCO सूचना यादीत समाविष्ट',
    bannedGazetteBadge: 'कलम 26A अंतर्गत प्रतिबंधित औषध',
    gazetteNotificationLabel: 'राजपत्र अधिसूचना (Gazette Notification)',
    serialNoLabel: 'अनुक्रमांक (Sr. No.)',
    legalNoteLabel: 'कायदेशीर / नियामक टीप',
    bannedCardExplanation: 'औषधे व सौंदर्यप्रसाधने कायदा, 1940 च्या कलम 26A अंतर्गत केंद्रीय आरोग्य मंत्रालयाच्या राजपत्र अधिसूचनेनुसार उत्पादन व विक्रीवर बंदी/नियमन लागू आहे.',
    alsoFlaggedBannedTitle: 'कलम 26A प्रतिबंधित औषध जुळणी',
    flaggedSummaryPrefix: 'हा बॅच सरकारी गुणवत्ता सूचना यादीत आढळला आहे.',
    reasonLabel: 'कारण',
    stateLabel: 'राज्य',
    monthLabel: 'महिना',
    labLabel: 'प्रयोगशाळा',
    sourceLabel: 'अधिकृत स्रोत',
    whatToDoTitle: 'पुढे काय करावे',
    flaggedStep1Title: 'या बॅचचा वापर त्वरित थांबवा',
    flaggedStep1Body: 'हे औषध मुलांपासून दूर सुरक्षित ठेवा.',
    flaggedStep2Title: 'औषध घेतले असल्यास घाबरू नका',
    flaggedStep2Body: 'पाकिटासह डॉक्टर, फार्मासिस्ट किंवा जवळच्या आरोग्य केंद्रात (PHC) भेटा.',
    flaggedStep3Title: 'केमिस्टला कळवा आणि पावती ठेवा',
    flaggedStep3Body: 'औषध घेतलेल्या दुकानात कळवा व बिल जपून ठेवा.',
    callHelplineCta: 'हेल्पलाइन 1800-11-4477 वर कॉल करा',
    reportGuideBtn: 'तक्रार कशी करावी?',
    reportGuideTitle: 'अन्न व औषध प्रशासनाकडे तक्रार',
    reportGuideBody: '1800-11-4477 वर कॉल करा किंवा राज्याच्या औषध नियंत्रक कार्यालयात पावतीसह कळवा.',

    possibleBadge: 'संभाव्य जुळणी — काळजीपूर्वक तपासा',
    possibleTitle: 'हा बॅच एका फ्लॅग केलेल्या बॅचसारखा दिसतो',
    possibleSub: 'पुढील माहिती पाहण्यापूर्वी दोन्ही बॅच क्रमांक अक्षरांनुसार तपासा.',
    yourEntryLabel: 'तुमची नोंद',
    flaggedBatchLabel: 'सूचना बॅच',
    lookalikeHint: '0/O किंवा 1/I सारखी अक्षरे आढळली आहेत.',
    typoHint: 'फक्त १-२ अक्षरांचा फरक आहे.',
    medicineMatchHint: 'औषधाचे नाव यादीतील एका औषधाशी जुळते.',
    confirmIsMatchBtn: 'होय, माझा बॅच हाच आहे — तपशील पहा',
    confirmNotMatchBtn: 'नाही, माझा बॅच वेगळा आहे',

    notFoundBadge: 'यादीत आढळले नाही',
    notFoundTitle: 'हा बॅच आमच्या सूचना यादीत नाही',
    notFoundSub: 'सध्याच्या CDSCO यादीत हा बॅच क्रमांक आढळला नाही.',
    whatThisMeansTitle: 'याचा अर्थ काय?',
    notFoundMeaningBody: 'यादीत नाव नसणे म्हणजे औषध पूर्णपणे योग्य आहे याची हमी नाही.',
    notFoundCaution: 'रंग, वास किंवा सीलमध्ये काही वेगळे वाटल्यास औषध घेऊ नका व फार्मासिस्टला विचारा.',
    physicalCheckTitle: 'पॅकिंगची ४ महत्त्वाची तपासणी',
    physicalChecks: [
      { title: 'छपाईची स्पष्टता', desc: 'बॅच क्रमांक स्पष्ट वाचता येतो का?' },
      { title: 'सीलची स्थिती', desc: 'पाकीट किंवा झाकण नीट बंद आहे का?' },
      { title: 'औषधाचे स्वरूप', desc: 'रंग किंवा पोत सामान्य आहे का?' },
      { title: 'मुदत तारीख', desc: 'EXP तारीख वैध आहे का?' },
    ],

    historyTitle: 'तपासणी इतिहास',
    historySub: 'फक्त तुमच्या फोनवर जतन',
    checksCountLabel: 'तपासण्या',
    filterAll: 'सर्व',
    filterFlagged: 'सूचना असलेली',
    filterPossible: 'संभाव्य',
    filterNotFound: 'यादीत नाही',
    historyEmptyTitle: 'अजून कोणताही इतिहास नाही',
    historyEmptyBody: 'तुम्ही तपासलेली औषधे फक्त तुमच्या फोनवर येथे दिसतील.',
    clearHistoryBtn: 'सर्व इतिहास पुसा',
    clearConfirmTitle: 'इतिहास पुसून टाकायचा का?',
    clearConfirmBody: 'तुमच्या फोनवरील सर्व नोंदी कायमच्या हटवल्या जातील.',
    cancelBtn: 'रद्द करा',
    confirmDeleteBtn: 'होय, पुसा',
    viewDetailsBtn: 'तपशील पहा',
    historyLocalBadge: 'फक्त फोन स्टोरेज • सर्व्हरवर नाही',
    closeBtn: 'बंद करा',

    helpHeroTitle: 'सुरक्षा आणि गोपनीयता',
    helpHeroSub: 'मेडचेक ही मोफत सेवा आहे. ती कोणताही वैद्यकीय सल्ला देत नाही.',
    localProcessingTitle: 'फोटो ठेवला जात नाही',
    localProcessingSub: 'मजकूर वाचल्यानंतर लगेच काढून टाकला जातो.',
    cdscoSyncTitle: 'CDSCO माहिती',
    cdscoSyncSub: 'मासिक सरकारी NSQ यादीवर आधारित.',
    reassuranceCardTitle: 'शंका असल्यास तज्ञांना विचारा',
    reassuranceCardSub: 'डॉक्टर, फार्मासिस्ट किंवा 1800-11-4477 वर संपर्क साधा.',
    faqTitle: 'नेहमी विचारले जाणारे प्रश्न',
    faqs: [
      {
        q: 'माझे औषध यादीत आढळले आणि मी ते आधीच घेतले असेल तर?',
        a: 'घाबरू नका. पुढे औषध घेणे थांबवा आणि पाकिटासह डॉक्टर किंवा PHC केंद्राचा सल्ला घ्या.',
      },
      {
        q: 'औषधाचा फोटो सर्व्हरवर सेव्ह होतो का?',
        a: 'नाही. फोटो फक्त लेबल वाचण्यासाठी वापरला जातो आणि जतन केला जात नाही.',
      },
      {
        q: 'यादीत नसेल तर औषध सुरक्षित आहे का?',
        a: 'नाही, ती हमी नाही. नेहमी पॅकिंग तपासा आणि शंका असल्यास फार्मासिस्टला विचारा.',
      },
      {
        q: 'CDSCO NSQ यादी म्हणजे काय?',
        a: 'गुणवत्ता चाचणीत अपयशी ठरलेल्या औषधांची सरकारी मासिक यादी.',
      },
    ],
    accessibilityTitle: 'आवाज व वाचण्याची सोय',
    voiceSpeedLabel: 'वाचनाचा वेग',
    speedSlow: 'हळू (0.8x)',
    speedNormal: 'सामान्य (1.0x)',
    speedFast: 'वेगवान (1.2x)',
    highContrastLabel: 'उच्च कॉन्ट्रास्ट',
    highContrastSub: 'अधिक स्पष्ट अक्षरांसाठी',
    installAppTitle: 'फोनवर अ‍ॅप प्रमाणे इंस्टॉल करा',
    installAppSub: 'ऑफलाइन तपासणीसाठी होम स्क्रीनवर जोडा.',
    installAppBtn: 'MedCheck इंस्टॉल करा',
    iosInstallHint: 'iPhone/iPad: Safari मध्ये Share -> Add to Home Screen दाबा.',
    offlineBanner: 'ऑफलाइन मोड — फोनवरील जतन यादीतून तपासणी सुरू आहे',
    dataSourceFooter: 'स्रोत: CDSCO मासिक NSQ आणि बनावट औषध यादी',
  },

  te: {
    appName: 'MedCheck',
    appNameNative: 'మెడ్‌చెక్',
    tagline: 'ప్రభుత్వ (CDSCO) హెచ్చరిక జాబితాలో మందును తనిఖీ చేయండి',
    subTagline: 'Check medicine batches against CDSCO quality alerts in seconds',
    cdscoDatabaseHint: 'కేంద్ర ఔషధ ప్రమాణాల నియంత్రణ సంస్థ (CDSCO) జాబితా',
    missionTitle: 'ఉచిత ప్రజా ఆరోగ్య సేవ',
    missionBody: 'ప్రతి కుటుంబం తమ మందు ప్రభుత్వ నాణ్యతా హెచ్చరికలలో ఉందో లేదో సులభంగా తనిఖీ చేసుకోవచ్చు.',
    noLoginPrivacy: 'సురక్షితం • లాగిన్ అవసరం లేదు • మీ ఫోన్‌లోనే సేవ్ అవుతుంది',
    chooseLanguageTitle: 'మీ భాషను ఎంచుకోండి / Select Language',
    sixLanguagesCount: '6 భాషలు',
    listenWelcomeBtn: 'సూచనలు వినండి',
    listenWelcomeSub: 'మీరు ఎంచుకున్న భాషలో వినండి',
    welcomeSpeechText: 'నమస్కారం! రండి, మీ మందును ఇప్పుడు సులభంగా చెక్ చేద్దాం. మందుల స్ట్రిప్ ఫోటో ఒకటి స్పష్టంగా తీయండి, లేదా పేరు, బ్యాచ్ నంబర్ టైప్ చేయండి... ప్రభుత్వ హెచ్చరిక జాబితాలో ఉందో లేదో నేను వెంటనే చూసి చెబుతాను.',
    continueBtn: 'కొనసాగండి • Continue',
    freeNoSaveMicro: '100% ఉచితం • ఫోటోలు సేవ్ చేయబడవు',
    helplineTitle: 'CDSCO జాతీయ మందుల హెల్ప్‌లైన్',
    helplineSub: 'ఉచిత సహాయం (24×7)',
    callNow: 'కాల్ చేయండి',

    navHome: 'హోమ్',
    navScan: 'తనిఖీ',
    navHistory: 'చరిత్ర',
    navHelp: 'సహాయం',

    homeGreeting: 'మీ మందు బ్యాచ్ తనిఖీ చేయండి',
    dataUpdatedPrefix: 'డేటా అప్‌డేట్:',
    batchesTrackedSuffix: 'హెచ్చరిక బ్యాచ్‌లు',
    heroLabel: 'త్వరిత తనిఖీ',
    heroTitle: 'మందుల స్ట్రిప్ లేదా బాక్స్ ఫోటో తీయండి',
    heroSub: 'B.No. లేదా Batch No. కెమెరా ముందు చూపించండి లేదా టైప్ చేయండి.',
    scanCameraBtn: 'కెమెరాతో స్కాన్ చేయండి',
    manualEntryBtn: 'పేరు / బ్యాచ్ నంబర్ రాయండి',
    trySampleBtn: 'నమూనా స్ట్రిప్ చూడండి',
    directSearchLabel: 'నేరుగా మందు లేదా బ్యాచ్ వెతకండి',
    directSearchPlaceholder: 'ఉదా. CC-8402, Rofecoxib, Nimesulide + Paracetamol...',
    voiceListening: 'వింటున్నాము... మందు పేరు లేదా బ్యాచ్ నంబర్ చెప్పండి',
    voiceNotSupported: 'ఈ బ్రౌజర్‌లో వాయిస్ శోధన లేదు.',
    quickExamplesLabel: 'నమూనా తనిఖీలు:',
    recentAlertsTitle: 'ప్రభుత్వ భద్రతా జాబితాలు',
    batchAlertsTab: 'బ్యాచ్ హెచ్చరికలు',
    bannedDrugsTab: 'నిషేధిత మందులు (444)',
    bannedSearchPlaceholder: '444 నిషేధిత మందులు లేదా S.O./GSR నం. వెతకండి...',
    bannedNoMatches: 'ఈ శోధనకు సరిపోయే నిషేధిత మందు కనపడలేదు.',
    showMoreBannedBtn: 'మరిన్ని చూపు (+30)',
    showAllBannedBtn: 'అన్నీ చూపు',
    viewAllAlerts: 'అన్నీ చూడండి',
    showFewerAlerts: 'తక్కువ చూపు',
    privacyCardTitle: '100% సురక్షితం & ప్రైవేట్',
    privacyCardBody: 'ఫోటో కేవలం అక్షరాలు చదవడానికి మాత్రమే; ఎక్కడా సేవ్ చేయబడదు.',
    helplineBannerLabel: 'జాతీయ మందుల హెల్ప్‌లైన్ (24×7)',
    tapToCall: 'వెంటనే కాల్ చేయండి',

    scanTitle: 'మందు స్కాన్ చేయండి',
    modeCamera: 'కెమెరా / ఫోటో',
    modeManual: 'టైప్ చేయండి',
    startCameraBtn: 'కెమెరా తెరవండి',
    capturePhotoBtn: 'ఫోటో తీసి చదవండి',
    uploadPhotoBtn: 'ఫోటో అప్‌లోడ్ చేయండి',
    useSamplePhotoBtn: 'నమూనా ఫోటో స్కాన్ చేయండి',
    torchOn: 'టార్చ్ ఆన్',
    torchOff: 'టార్చ్ ఆఫ్',
    scanTipsTitle: 'స్పష్టమైన ఫోటో కోసం చిట్కాలు',
    scanTipsList: [
      'స్ట్రిప్‌పై నేరుగా కాంతి పడకుండా చూడండి.',
      'B.No. భాగాన్ని మధ్యలో ఉంచండి.',
      'తనిఖీకి ముందు అక్షరాలను సరిదిద్దవచ్చు.',
    ],
    cameraUnavailableMsg: 'లైవ్ కెమెరా ఇక్కడ అందుబాటులో లేదు. ఫోటో అప్‌లోడ్ చేయండి లేదా నమూనా స్ట్రిప్ ప్రయత్నించండి.',
    tryAgainBtn: 'మళ్లీ ప్రయత్నించండి (Try Again)',
    takePhotoPhoneCameraBtn: 'ఫోన్ కెమెరాతో ఫోటో తీయండి',
    cameraLoadingMsg: 'కెమెరా ప్రారంభమవుతోంది...',
    cameraPermissionDeniedMsg: 'కెమెరా అనుమతి నిరాకరించబడింది. దయచేసి బ్రౌజర్ సెట్టింగ్‌లలో అనుమతించండి.',
    cameraNotFoundMsg: 'కెమెరా పరికరం కనుగొనబడలేదు.',
    cameraInUseMsg: 'కెమెరా ఇప్పటికే వేరే యాప్ లేదా ట్యాబ్ ద్వారా ఉపయోగించబడుతోంది.',
    cameraInsecureMsg: 'కెమెరా యాక్సెస్ చేయడానికి సురక్షితమైన HTTPS కనెక్షన్ అవసరం.',
    privacyScanPill: 'అక్షరాలు చదవడానికి మాత్రమే; ఫోటో నిల్వ చేయబడదు',
    readingLabelTitle: 'లేబుల్ చదువుతున్నాము...',
    readingLabelSub: 'మందు పేరు మరియు బ్యాచ్ నంబర్ గుర్తించబడుతోంది',
    confirmDetailsTitle: 'వివరాలను నిర్ధారించండి',
    confirmDetailsSub: '0 మరియు O లేదా 1 మరియు I వంటి అక్షరాలను పరిశీలించి అవసరమైతే మార్చండి.',
    medicineNameLabel: 'మందు పేరు',
    medicineNamePlaceholder: 'ఉదా. Calpol 650',
    genericNameLabel: 'మూల పదార్థం (ఐచ్ఛికం)',
    batchNumberLabel: 'బ్యాచ్ నంబర్ (B.No.)',
    batchNumberPlaceholder: 'ఉదా. CC-8402',
    expDateLabel: 'గడువు తేదీ (EXP)',
    verifyNowBtn: 'CDSCO జాబితాలో తనిఖీ చేయండి',
    retakePhotoBtn: 'వేరే ఫోటో తీయండి',
    enterAtLeastOneError: 'దయచేసి మందు పేరు లేదా బ్యాచ్ నంబర్ నమోదు చేయండి.',

    checkingHeading: 'CDSCO జాబితాలో సరిపోల్చుతున్నాము...',
    checkingSub: 'ప్రభుత్వ NSQ మరియు నకిలీ మందుల హెచ్చరికలు పరిశీలించబడుతున్నాయి',
    stayCalmTitle: 'దయచేసి ప్రశాంతంగా ఉండండి',
    stayCalmBody: 'మెడ్‌చెక్ వైద్య సలహా లేదా మోతాదు సూచనలు ఇవ్వదు.',

    listenResultBtn: 'వినండి',
    stopListeningBtn: 'ఆపు',
    voiceBusyHint: 'తెలుగు వాయిస్ సిద్ధమవడానికి కొన్ని సెకన్లు పడుతుంది. దయచేసి మళ్లీ నొక్కండి.',
    checkAnotherBtn: 'మరో మందు తనిఖీ చేయండి',
    savedOnPhoneNote: 'ఈ తనిఖీ మీ ఫోన్‌లో మాత్రమే సేవ్ చేయబడింది.',

    flaggedBadge: 'CDSCO హెచ్చరికలో ఉంది',
    bannedGazetteBadge: 'సెక్షన్ 26A కింద నిషేధిత మందు',
    gazetteNotificationLabel: 'ప్రభుత్వ గెజిట్ నోటిఫికేషన్',
    serialNoLabel: 'వరుస సంఖ్య (Sr. No.)',
    legalNoteLabel: 'చట్టపరమైన / నియంత్రణ గమనిక',
    bannedCardExplanation: 'డ్రగ్స్ & కాస్మెటిక్స్ యాక్ట్, 1940 సెక్షన్ 26A ప్రకారం కేంద్ర ఆరోగ్య మంత్రిత్వ శాఖ గెజిట్ నోటిఫికేషన్ ద్వారా దీని తయారీ మరియు విక్రయంపై నిషేధం/నియంత్రణ అమల్లో ఉంది.',
    alsoFlaggedBannedTitle: 'సెక్షన్ 26A నిషేధిత మందు సరిపోలింది',
    flaggedSummaryPrefix: 'ఈ బ్యాచ్ ప్రభుత్వ నాణ్యత హెచ్చరిక జాబితాలో గుర్తించబడింది.',
    reasonLabel: 'కారణం',
    stateLabel: 'రాష్ట్రం',
    monthLabel: 'నెల',
    labLabel: 'పరీక్షా ల్యాబ్',
    sourceLabel: 'అధికారిక మూలం',
    whatToDoTitle: 'తర్వాత ఏం చేయాలి',
    flaggedStep1Title: 'ఈ మందు వాడకం వెంటనే ఆపండి',
    flaggedStep1Body: 'పిల్లలకు అందకుండా పక్కన పెట్టండి.',
    flaggedStep2Title: 'ఇప్పటికే తీసుకున్నట్లయితే ఆందోళన చెందకండి',
    flaggedStep2Body: 'మందుల ప్యాక్‌తో డాక్టర్, ఫార్మసిస్ట్ లేదా సమీప ప్రభుత్వ ఆరోగ్య కేంద్రాన్ని (PHC) సంప్రదించండి.',
    flaggedStep3Title: 'మెడికల్ షాప్‌కు తెలియజేసి బిల్లు ఉంచండి',
    flaggedStep3Body: 'కొనుగోలు చేసిన షాప్‌కు సమాచారం ఇచ్చి రసీదు భద్రపరచండి.',
    callHelplineCta: 'హెల్ప్‌లైన్ 1800-11-4477 కు కాల్ చేయండి',
    reportGuideBtn: 'ఫిర్యాదు ఎలా చేయాలి?',
    reportGuideTitle: 'రాష్ట్ర డ్రగ్ కంట్రోలర్‌కు ఫిర్యాదు',
    reportGuideBody: '1800-11-4477 కు కాల్ చేయండి లేదా బిల్లుతో రాష్ట్ర డ్రగ్ కంట్రోల్ కార్యాలయానికి తెలియజేయండి.',

    possibleBadge: 'సరిపోలిన బ్యాచ్ — జాగ్రత్తగా పోల్చండి',
    possibleTitle: 'ఇది హెచ్చరిక బ్యాచ్‌లా కనిపిస్తోంది',
    possibleSub: 'వివరాలు చూసే ముందు రెండు బ్యాచ్ నంబర్లను అక్షరం అక్షరం పోల్చండి.',
    yourEntryLabel: 'మీరు నమోదు చేసినది',
    flaggedBatchLabel: 'హెచ్చరిక బ్యాచ్',
    lookalikeHint: '0/O లేదా 1/I వంటి సారూప్య అక్షరాలు ఉన్నాయి.',
    typoHint: '1-2 అక్షరాలు మాత్రమే తేడా ఉన్నాయి.',
    medicineMatchHint: 'మందు పేరు హెచ్చరిక జాబితాలోని మందుతో సరిపోలుతోంది.',
    confirmIsMatchBtn: 'అవును, నా బ్యాచ్ ఇదే — వివరాలు చూడండి',
    confirmNotMatchBtn: 'కాదు, నా బ్యాచ్ వేరు',

    notFoundBadge: 'జాబితాలో కనపడలేదు',
    notFoundTitle: 'ఈ బ్యాచ్ మా హెచ్చరిక జాబితాలో లేదు',
    notFoundSub: 'ప్రస్తుత CDSCO జాబితాలో ఈ బ్యాచ్ నంబర్ కనపడలేదు.',
    whatThisMeansTitle: 'దీని అర్థం ఏమిటి?',
    notFoundMeaningBody: 'జాబితాలో లేకపోవడం మందు 100% నాణ్యమైనదని హామీ ఇవ్వదు.',
    notFoundCaution: 'రంగు, వాసన లేదా సీల్‌లో తేడా కనిపిస్తే వాడకండి; ఫార్మసిస్ట్ లేదా డాక్టర్‌ను అడగండి.',
    physicalCheckTitle: 'ప్యాకేజింగ్ 4 పాయింట్ల తనిఖీ',
    physicalChecks: [
      { title: 'ప్రింట్ స్పష్టత', desc: 'బ్యాచ్ నంబర్ స్పష్టంగా ఉందా?' },
      { title: 'సీల్ పరిశీలన', desc: 'స్ట్రిప్ లేదా మూత సరిగ్గా ఉందా?' },
      { title: 'మందు రూపం', desc: 'రంగు మార్పు లేకుండా ఉందా?' },
      { title: 'గడువు తేదీ', desc: 'EXP తేదీ చెల్లుబాటులో ఉందా?' },
    ],

    historyTitle: 'తనిఖీ చరిత్ర',
    historySub: 'మీ ఫోన్‌లో మాత్రమే సేవ్ చేయబడింది',
    checksCountLabel: 'తనిఖీలు',
    filterAll: 'అన్నీ',
    filterFlagged: 'హెచ్చరిక',
    filterPossible: 'సరిపోలినవి',
    filterNotFound: 'జాబితాలో లేనివి',
    historyEmptyTitle: 'చరిత్ర ఇంకా లేదు',
    historyEmptyBody: 'మీరు తనిఖీ చేసిన మందులు మీ ఫోన్‌లో ఇక్కడ కనిపిస్తాయి.',
    clearHistoryBtn: 'చరిత్రను క్లియర్ చేయండి',
    clearConfirmTitle: 'చరిత్రను తొలగించాలా?',
    clearConfirmBody: 'మీ ఫోన్‌లో సేవ్ అయిన రికార్డులన్నీ తొలగించబడతాయి.',
    cancelBtn: 'రద్దు',
    confirmDeleteBtn: 'తొలగించు',
    viewDetailsBtn: 'వివరాలు చూడండి',
    historyLocalBadge: 'ఫోన్‌లో మాత్రమే నిల్వ • సర్వర్‌కు వెళ్లదు',
    closeBtn: 'మూసివేయి',

    helpHeroTitle: 'భద్రత & గోప్యత',
    helpHeroSub: 'మెడ్‌చెక్ ఒక ఉచిత ప్రజా సేవ. ఇది వైద్య సలహా ఇవ్వదు.',
    localProcessingTitle: 'ఫోటోలు సేవ్ కావు',
    localProcessingSub: 'అక్షరాలు చదివిన వెంటనే తొలగించబడతాయి.',
    cdscoSyncTitle: 'CDSCO డేటా',
    cdscoSyncSub: 'నెలవారీ ప్రభుత్వ NSQ జాబితా ఆధారితం.',
    reassuranceCardTitle: 'సందేహం ఉంటే నిపుణులను అడగండి',
    reassuranceCardSub: 'డాక్టర్, ఫార్మసిస్ట్ లేదా 1800-11-4477 కు కాల్ చేయండి.',
    faqTitle: 'తరచుగా అడిగే ప్రశ్నలు',
    faqs: [
      {
        q: 'నా మందు హెచ్చరిక జాబితాలో ఉండి నేను ఇప్పటికే వేసుకుంటే ఏం చేయాలి?',
        a: 'ఆందోళన చెందకండి. వాడటం ఆపి, ప్యాక్‌తో డాక్టర్ లేదా సమీప PHC ని సంప్రదించండి.',
      },
      {
        q: 'ఫోటోలు సర్వర్‌లో సేవ్ అవుతాయా?',
        a: 'లేవు. లేబుల్ చదవడానికి మాత్రమే ఉపయోగించబడి తొలగించబడతాయి.',
      },
      {
        q: 'జాబితాలో లేకపోతే మందు సురక్షితమేనా?',
        a: 'అది హామీ కాదు. ప్యాకేజింగ్ తనిఖీ చేసి సందేహం ఉంటే ఫార్మసిస్ట్‌ను అడగండి.',
      },
      {
        q: 'CDSCO NSQ జాబితా అంటే ఏమిటి?',
        a: 'నాణ్యతా పరీక్షలో విఫలమైన మందుల ప్రభుత్వ నెలవారీ జాబితా.',
      },
    ],
    accessibilityTitle: 'వాయిస్ & చదవడానికి సెట్టింగ్స్',
    voiceSpeedLabel: 'వాయిస్ వేగం',
    speedSlow: 'నెమ్మదిగా (0.8x)',
    speedNormal: 'సాధారణం (1.0x)',
    speedFast: 'వేగంగా (1.2x)',
    highContrastLabel: 'హై కాంట్రాస్ట్',
    highContrastSub: 'అక్షరాలు మరింత స్పష్టంగా కనిపించడానికి',
    installAppTitle: 'యాప్‌లా ఫోన్‌లో ఇన్‌స్టాల్ చేయండి',
    installAppSub: 'ఆఫ్‌లైన్‌లో కూడా తనిఖీ చేయడానికి హోమ్ స్క్రీన్‌కు జోడించండి.',
    installAppBtn: 'MedCheck ఇన్‌స్టాల్ చేయండి',
    iosInstallHint: 'iPhone/iPad: Safari లో Share -> Add to Home Screen నొక్కండి.',
    offlineBanner: 'ఆఫ్‌లైన్ మోడ్ — ఫోన్‌లో ఉన్న CDSCO జాబితాతో తనిఖీ జరుగుతోంది',
    dataSourceFooter: 'మూలం: CDSCO నెలవారీ NSQ & నకిలీ మందుల జాబితాలు',
  },
};
