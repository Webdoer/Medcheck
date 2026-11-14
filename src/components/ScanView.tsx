/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Camera,
  Upload,
  Keyboard,
  Flashlight,
  Lightbulb,
  X,
  Lock,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import type { TranslationBundle } from '../i18n/translations';
import { MEDIA } from '../assets/media';

export interface ScannedFields {
  medicineName: string;
  genericName: string;
  manufacturer: string;
  batchNumber: string;
  expDate: string;
  notes?: string;
  drugNameConfidence?: number;
  batchNumberConfidence?: number;
  manufacturerConfidence?: number;
}

interface ScanViewProps {
  t: TranslationBundle;
  initialMode: 'camera' | 'manual';
  autoTriggerSample?: boolean;
  onConsumeAutoSample: () => void;
  onVerify: (medicineName: string, batchNumber: string, genericName?: string) => void;
  onBack: () => void;
}

export const ScanView: React.FC<ScanViewProps> = ({
  t,
  initialMode,
  autoTriggerSample,
  onConsumeAutoSample,
  onVerify,
  onBack,
}) => {
  const [mode, setMode] = useState<'camera' | 'manual'>(initialMode);
  const [stage, setStage] = useState<'capture' | 'reading' | 'confirm'>(
    initialMode === 'manual' ? 'confirm' : 'capture'
  );
  const [cameraActive, setCameraActive] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [debugErrorLog, setDebugErrorLog] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const [fields, setFields] = useState<ScannedFields>({
    medicineName: '',
    genericName: '',
    manufacturer: '',
    batchNumber: '',
    expDate: '',
  });
  const [scanError, setScanError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setIsVideoLoaded(false);
    setTorchOn(false);
  };

  // 4. Cleanup on unmount or leaving screen
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    setMode(initialMode);
    if (initialMode === 'manual') {
      stopCamera();
      setStage('confirm');
    } else {
      setStage('capture');
      startLiveCamera();
    }
  }, [initialMode]);

  useEffect(() => {
    if (autoTriggerSample) {
      onConsumeAutoSample();
      handleUseSampleImage();
    }
  }, [autoTriggerSample]);

  // 1 & 2 & 5 & 8. Start live camera with fallback & error handling & logging
  const startLiveCamera = async () => {
    setCameraError(null);
    setDebugErrorLog(null);
    setScanError(null);
    setIsVideoLoaded(false);

    // Check secure context
    if (!window.isSecureContext) {
      const err = new Error('Camera access requires HTTPS or localhost (secure context).');
      err.name = 'InsecureContextError';
      handleCameraError(err, t.cameraInsecureMsg || 'Camera requires a secure HTTPS connection.');
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const err = new Error('navigator.mediaDevices.getUserMedia not supported');
      err.name = 'NotFoundError';
      handleCameraError(err, t.cameraUnavailableMsg);
      return;
    }

    // Stop previous stream before requesting a new one (Requirement 4)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    try {
      let stream: MediaStream;
      try {
        // Requirement 2: Request camera with facingMode ideal environment
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
      } catch (err: any) {
        if (err.name === 'OverconstrainedError' || err.name === 'NotFoundError') {
          console.warn('Camera facingMode ideal environment failed, retrying with { video: true }:', err.name);
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        } else {
          throw err;
        }
      }

      streamRef.current = stream;
      setCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (playErr: any) {
          console.error('Video play error:', playErr);
          setDebugErrorLog(`PlayError: ${playErr?.message || playErr}`);
        }
      }
    } catch (err: any) {
      handleCameraError(err);
    }
  };

  const handleCameraError = (err: any, customMsg?: string) => {
    const errName = err?.name || 'UnknownError';
    const errMessage = err?.message || 'Camera error';
    
    // Requirement 8: Log exact error name and message to console
    console.error(`[MedCheck Camera Error] Name: ${errName}, Message: ${errMessage}`, err);
    setDebugErrorLog(`${errName}: ${errMessage}`);

    let friendly = customMsg || t.cameraUnavailableMsg;
    if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
      friendly = t.cameraPermissionDeniedMsg || 'Camera permission was denied. Please allow camera access in your browser settings.';
    } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
      friendly = t.cameraNotFoundMsg || 'No camera device found on this device.';
    } else if (errName === 'NotReadableError' || errName === 'TrackStartError') {
      friendly = t.cameraInUseMsg || 'Camera is already in use by another application or tab.';
    } else if (errName === 'InsecureContextError') {
      friendly = t.cameraInsecureMsg || 'Camera access requires a secure HTTPS connection.';
    }

    setCameraError(friendly);
    setCameraActive(false);
  };

  // Video metadata handler for loading state (Requirement 7)
  const handleLoadedMetadata = () => {
    setIsVideoLoaded(true);
    if (videoRef.current) {
      videoRef.current.play().catch((e) => console.log('Metadata play catch:', e));
    }
  };

  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (!videoTrack) return;

    const nextTorch = !torchOn;
    try {
      await videoTrack.applyConstraints({
        advanced: [{ torch: nextTorch } as MediaTrackConstraintSet],
      });
      setTorchOn(nextTorch);
    } catch {
      // Device does not support torch constraint
    }
  };

  const sendImageToReader = async (dataUrl: string, mimeType: string) => {
    stopCamera();
    setStage('reading');
    setScanError(null);

    try {
      const res = await fetch('/api/scan-label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: dataUrl, mimeType }),
      });

      const payload = (await res.json()) as Partial<ScannedFields> & {
        error?: string;
        drug_name_confidence?: number;
        batch_number_confidence?: number;
        manufacturer_confidence?: number;
      };

      if (!res.ok) {
        setScanError(payload.error || t.cameraUnavailableMsg);
        setStage('confirm');
        return;
      }

      setFields({
        medicineName: payload.medicineName ?? '',
        genericName: payload.genericName ?? '',
        manufacturer: payload.manufacturer ?? '',
        batchNumber: payload.batchNumber ?? '',
        expDate: payload.expDate ?? '',
        notes: payload.notes ?? '',
        drugNameConfidence: payload.drug_name_confidence,
        batchNumberConfidence: payload.batch_number_confidence,
        manufacturerConfidence: payload.manufacturer_confidence,
      });
      setStage('confirm');
    } catch {
      setScanError(t.cameraUnavailableMsg);
      setStage('confirm');
    }
  };

  const handleCaptureFrame = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1024;
    canvas.height = video.videoHeight || 768;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    sendImageToReader(dataUrl, 'image/jpeg');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        sendImageToReader(reader.result, file.type || 'image/jpeg');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleUseSampleImage = async () => {
    setStage('reading');
    setScanError(null);
    try {
      const response = await fetch(MEDIA.sampleBlister);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          sendImageToReader(reader.result, blob.type || 'image/jpeg');
        }
      };
      reader.readAsDataURL(blob);
    } catch {
      setFields({
        medicineName: 'Paracetamol Tablets 10mg',
        genericName: 'Paracetamol IP',
        manufacturer: '',
        batchNumber: 'KL-9021-B',
        expDate: '08/2026',
      });
      setStage('confirm');
    }
  };

  const handleSubmitConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fields.medicineName.trim() && !fields.batchNumber.trim()) {
      setFormError(t.enterAtLeastOneError);
      return;
    }
    setFormError(null);
    onVerify(fields.medicineName.trim(), fields.batchNumber.trim(), fields.genericName.trim());
  };

  return (
    <div className="flex flex-col space-y-5 max-w-3xl mx-auto w-full">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-[22px] font-bold text-on-surface">{t.scanTitle}</h1>
        <div className="flex items-center p-1 rounded-full bg-surface-container-high">
          <button
            type="button"
            onClick={() => {
              setMode('camera');
              setStage('capture');
              startLiveCamera();
            }}
            className={`min-h-[40px] px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              mode === 'camera'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>{t.modeCamera}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              stopCamera();
              setMode('manual');
              setStage('confirm');
            }}
            className={`min-h-[40px] px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              mode === 'manual'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Keyboard className="w-4 h-4" />
            <span>{t.modeManual}</span>
          </button>
        </div>
      </div>

      {/* Stage 1: Camera / Photo Capture */}
      {stage === 'capture' && mode === 'camera' && (
        <div className="flex flex-col space-y-4">
          {/* Requirement 3: Video as bottom layer (no blur on video), overlays transparent with pointer-events-none except buttons */}
          <div className="relative w-full rounded-[28px] overflow-hidden bg-black shadow-lg h-[100dvh] max-h-[520px] flex flex-col justify-between p-4">
            {/* Bottom Layer Video Element (Requirement 1 & 3) */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              onLoadedMetadata={handleLoadedMetadata}
              className="absolute inset-0 w-full h-full object-cover z-0 bg-black"
            />

            {/* Fallback image backdrop if camera not active or failed */}
            {!cameraActive && !cameraError && (
              <img
                src={MEDIA.sampleBlister}
                alt="Sample blister foil preview"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-50 z-0"
              />
            )}

            {/* Loading state until video fires loadedmetadata (Requirement 7) */}
            {cameraActive && !isVideoLoaded && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white z-10 pointer-events-none space-y-2">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm font-medium">{t.cameraLoadingMsg || 'Starting camera...'}</p>
              </div>
            )}

            {/* Overlays Layer (Requirement 3: pointer-events-none except buttons) */}
            <div className="relative z-20 pointer-events-none flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  onBack();
                }}
                aria-label="Close scanner"
                className="pointer-events-auto w-11 h-11 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 cursor-pointer shadow-md"
              >
                <X className="w-5 h-5" />
              </button>

              {cameraActive && (
                <button
                  type="button"
                  onClick={toggleTorch}
                  className={`pointer-events-auto min-h-[44px] px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md ${
                    torchOn ? 'bg-primary text-on-primary' : 'bg-black/60 text-white'
                  }`}
                >
                  <Flashlight className="w-4 h-4" />
                  <span>{torchOn ? t.torchOff : t.torchOn}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowTips((prev) => !prev)}
                aria-label={t.scanTipsTitle}
                className="pointer-events-auto w-11 h-11 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 cursor-pointer shadow-md"
              >
                <Lightbulb className="w-5 h-5" />
              </button>
            </div>

            {/* Center Viewfinder Frame (Requirement 3: pointer-events-none) */}
            <div className="relative z-25 pointer-events-none self-center w-[250px] h-[250px] rounded-[24px] border-2 border-primary/90 flex items-center justify-center overflow-hidden my-4">
              {cameraActive && isVideoLoaded ? (
                <div className="absolute inset-x-3 h-0.5 bg-primary shadow-[0_0_12px_rgba(189,237,221,0.9)] animate-scan-laser" />
              ) : (
                <div className="text-center px-4 py-3 rounded-2xl bg-black/75 text-white space-y-3 pointer-events-auto">
                  <Camera className="w-8 h-8 mx-auto text-primary" />
                  <button
                    type="button"
                    onClick={startLiveCamera}
                    className="min-h-[44px] px-5 py-2 rounded-full bg-primary hover:bg-primary-container text-on-primary text-sm font-semibold cursor-pointer shadow-md"
                  >
                    {t.startCameraBtn}
                  </button>
                </div>
              )}
            </div>

            {/* Privacy Micro Pill (Requirement 3: pointer-events-none) */}
            <div className="relative z-20 pointer-events-none self-center flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 text-white/95 text-xs shadow-md">
              <Lock className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>{t.privacyScanPill}</span>
            </div>
          </div>

          {/* Requirement 5: Error handling with friendly message and Try again button */}
          {cameraError && (
            <div className="p-4 rounded-2xl bg-possible-bg text-possible-ink space-y-3 border border-possible-accent/40 shadow-sm">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-possible-accent shrink-0 mt-0.5" />
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-bold">{cameraError}</p>
                  {/* Requirement 8: Small debug line in development */}
                  {debugErrorLog && (
                    <p className="text-xs font-mono opacity-80 bg-black/5 p-1.5 rounded">
                      Debug: {debugErrorLog}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={startLiveCamera}
                  className="min-h-[40px] px-4 rounded-full bg-primary text-on-primary text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t.tryAgainBtn || 'Try Again'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="min-h-[40px] px-4 rounded-full bg-surface-container-high text-on-surface text-sm font-semibold cursor-pointer"
                >
                  {t.takePhotoPhoneCameraBtn || 'Take photo with phone camera'}
                </button>
              </div>
            </div>
          )}

          {showTips && (
            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/40 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-on-surface">{t.scanTipsTitle}</p>
                <button
                  type="button"
                  onClick={() => setShowTips(false)}
                  className="text-xs font-semibold text-primary cursor-pointer"
                >
                  {t.closeBtn}
                </button>
              </div>
              <ul className="list-disc pl-5 text-sm text-on-surface-variant space-y-1">
                {t.scanTipsList.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Drawer with Requirement 6 Fallback Button */}
          <div className="p-4 rounded-3xl bg-surface-container grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              className="hidden"
            />
            {/* Requirement 6: Fallback button "Take photo with phone camera" using input type=file capture=environment */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="min-h-[52px] px-4 py-2.5 rounded-full bg-surface-container-lowest hover:bg-surface-container-high text-secondary text-sm font-semibold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Upload className="w-5 h-5" />
              <span>{t.takePhotoPhoneCameraBtn || 'Take photo with phone camera'}</span>
            </button>

            {cameraActive && isVideoLoaded ? (
              <button
                type="button"
                onClick={handleCaptureFrame}
                className="min-h-[52px] px-5 py-2.5 rounded-full bg-primary hover:bg-primary-container text-on-primary text-base font-semibold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Camera className="w-5 h-5" />
                <span>{t.capturePhotoBtn}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleUseSampleImage}
                className="min-h-[52px] px-5 py-2.5 rounded-full bg-primary hover:bg-primary-container text-on-primary text-sm font-semibold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                <span>{t.useSamplePhotoBtn}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                stopCamera();
                setMode('manual');
                setStage('confirm');
              }}
              className="min-h-[52px] px-4 py-2.5 rounded-full bg-surface-container-lowest hover:bg-surface-container-high text-on-surface text-sm font-semibold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Keyboard className="w-5 h-5" />
              <span>{t.modeManual}</span>
            </button>
          </div>
        </div>
      )}

      {/* Stage 2: Calming AI Reading Progress */}
      {stage === 'reading' && (
        <div className="rounded-[28px] bg-surface-container-lowest p-8 shadow-sm border border-outline-variant/40 flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-on-surface">{t.readingLabelTitle}</h2>
          <p className="text-sm text-on-surface-variant max-w-sm">{t.readingLabelSub}</p>
          <p className="text-xs text-primary font-medium">{t.privacyScanPill}</p>
        </div>
      )}

      {/* Stage 3: Editable Label Confirmation / Manual Entry */}
      {stage === 'confirm' && (
        <form
          onSubmit={handleSubmitConfirm}
          className="rounded-[24px] bg-surface-container-lowest p-5 sm:p-6 shadow-sm border border-outline-variant/40 space-y-4"
        >
          <div>
            <h2 className="text-lg font-bold text-on-surface">{t.confirmDetailsTitle}</h2>
            <p className="text-sm text-on-surface-variant mt-1">{t.confirmDetailsSub}</p>
          </div>

          {scanError && (
            <div className="p-3.5 rounded-xl bg-possible-bg text-possible-ink text-sm">
              {scanError}
            </div>
          )}

          {fields.notes && (
            <div className="p-3 rounded-xl bg-secondary-container/40 text-on-secondary-fixed text-xs">
              {fields.notes}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5 sm:col-span-2">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="med-name" className="text-sm font-semibold text-on-surface">
                  {t.medicineNameLabel}
                </label>
                {typeof fields.drugNameConfidence === 'number' && fields.drugNameConfidence < 0.7 && (
                  <span className="text-xs font-semibold text-possible-ink bg-possible-bg px-2 py-0.5 rounded-full">
                    {Math.round(fields.drugNameConfidence * 100)}%
                  </span>
                )}
              </div>
              <input
                id="med-name"
                type="text"
                value={fields.medicineName}
                onChange={(e) => setFields({ ...fields, medicineName: e.target.value })}
                placeholder={t.medicineNamePlaceholder}
                className={`min-h-[52px] px-4 rounded-2xl text-on-surface text-base focus:outline-none focus:border-primary ${
                  typeof fields.drugNameConfidence === 'number' && fields.drugNameConfidence < 0.7
                    ? 'bg-possible-bg/50 border-2 border-possible-accent'
                    : 'bg-surface-container-low border border-outline-variant/60'
                }`}
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="batch-no" className="text-sm font-semibold text-on-surface">
                  {t.batchNumberLabel}
                </label>
                {typeof fields.batchNumberConfidence === 'number' && fields.batchNumberConfidence < 0.7 && (
                  <span className="text-xs font-semibold text-possible-ink bg-possible-bg px-2 py-0.5 rounded-full">
                    {Math.round(fields.batchNumberConfidence * 100)}%
                  </span>
                )}
              </div>
              <input
                id="batch-no"
                type="text"
                value={fields.batchNumber}
                onChange={(e) => setFields({ ...fields, batchNumber: e.target.value })}
                placeholder={t.batchNumberPlaceholder}
                className={`min-h-[52px] px-4 rounded-2xl text-on-surface font-mono font-semibold tracking-wider text-base focus:outline-none focus:border-primary ${
                  typeof fields.batchNumberConfidence === 'number' && fields.batchNumberConfidence < 0.7
                    ? 'bg-possible-bg/50 border-2 border-possible-accent'
                    : 'bg-surface-container-low border border-secondary/60'
                }`}
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label htmlFor="exp-date" className="text-sm font-semibold text-on-surface">
                {t.expDateLabel}
              </label>
              <input
                id="exp-date"
                type="text"
                value={fields.expDate}
                onChange={(e) => setFields({ ...fields, expDate: e.target.value })}
                placeholder="MM/YYYY"
                className="min-h-[52px] px-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 text-on-surface font-mono text-base focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-col space-y-1.5 sm:col-span-2">
              <label htmlFor="generic-name" className="text-sm font-semibold text-on-surface">
                {t.genericNameLabel}
              </label>
              <input
                id="generic-name"
                type="text"
                value={fields.genericName}
                onChange={(e) => setFields({ ...fields, genericName: e.target.value })}
                className="min-h-[48px] px-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 text-on-surface text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {formError && (
            <p className="text-sm font-medium text-flagged-accent">{formError}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 min-h-[54px] px-6 rounded-full bg-primary hover:bg-primary-container text-on-primary text-base font-semibold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span>{t.verifyNowBtn}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('camera');
                setStage('capture');
                setScanError(null);
                startLiveCamera();
              }}
              className="min-h-[54px] px-5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.retakePhotoBtn}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
