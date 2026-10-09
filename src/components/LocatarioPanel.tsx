import React, { useState, useRef } from 'react';
import { 
  TransitRoute, 
  TransitUnit, 
  CitizenReport, 
  Coordinates,
  OverloadAlert
} from '../types';
import { 
  FileText, 
  Bus, 
  Camera, 
  MapPin, 
  Users, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  BellRing, 
  Eye, 
  Radio, 
  Clock, 
  Send, 
  ShieldAlert,
  Compass,
  Mic
} from 'lucide-react';
import { CitizenReportModule } from './CitizenReportModule';
import { toneGenerator, voiceService } from '../services/voiceAssistant';
import { offlineManager } from '../services/offlineSync';

interface LocatarioPanelProps {
  reports: CitizenReport[];
  routes: TransitRoute[];
  units: TransitUnit[];
  onAddReport: (report: CitizenReport) => void;
  onCenterMap: (coords: Coordinates) => void;
  isOnline: boolean;
  userLocation: Coordinates;
  onAddReinforcementUnit: (routeId: string) => void;
  onViewReport?: (report: CitizenReport) => void;
}

export const LocatarioPanel: React.FC<LocatarioPanelProps> = ({
  reports,
  routes,
  units,
  onAddReport,
  onCenterMap,
  isOnline,
  userLocation,
  onAddReinforcementUnit,
  onViewReport,
}) => {
  // Sub-tabs inside Locatario: Citizen Incidents vs Combi Overload
  const [activeSubTab, setActiveSubTab] = useState<'ciudadano' | 'sobrecupo'>('ciudadano');

  // Overload reporting states
  const [overloadAddress, setOverloadAddress] = useState<string>('Av. Melchor Ocampo frente a Plaza Las Américas, Col. Segundo Sector');
  const [selectedUnitId, setSelectedUnitId] = useState<string>(units[0]?.id || 'u-101');
  const [overloadPassengers, setOverloadPassengers] = useState<number>(45);
  const [overloadPhoto, setOverloadPhoto] = useState<string | null>(null);
  const [lastOverloadReport, setLastOverloadReport] = useState<CitizenReport | null>(null);

  // Dispatch response notification
  const [dispatchNotification, setDispatchNotification] = useState<{
    folio: string;
    unitAssigned: string;
    driverName: string;
    etaMinutes: number;
    address: string;
    timestamp: string;
  } | null>(null);

  // Camera Live Video Stream in Overload
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Start live webcam for in-app camera capture
  const startLiveCamera = async () => {
    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: { ideal: 'environment' } },
          audio: false
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: true,
          audio: false
        });
      }

      setMediaStream(stream);
      setIsCameraActive(true);
    } catch (err) {
      console.warn('Camera error:', err);
      fileInputRef.current?.click();
    }
  };

  const stopLiveCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(t => t.stop());
      setMediaStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Watermark photo with date, time, and GPS
  const stampPhotoCanvas = (imageSrc: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width || 800;
      canvas.height = img.height || 600;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw original image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Watermark bar at the bottom
      const barHeight = Math.max(70, Math.floor(canvas.height * 0.16));
      ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
      ctx.fillRect(0, canvas.height - barHeight, canvas.width, barHeight);

      // Accent border
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(0, canvas.height - barHeight, canvas.width, 4);

      // Date & Time
      const now = new Date();
      const dateStr = now.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      // Location coordinates
      const locStr = userLocation 
        ? `GPS: ${userLocation.lat.toFixed(5)}, ${userLocation.lng.toFixed(5)}`
        : 'GPS: 17.9632, -102.1985 (Lázaro Cárdenas Centro)';

      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.max(14, Math.floor(barHeight * 0.28))}px sans-serif`;
      ctx.fillText(`LC NOVA • EVIDENCIA OFICIAL SOBRECUPO LOCATARIO`, 16, canvas.height - barHeight + 26);

      ctx.fillStyle = '#facc15';
      ctx.font = `bold ${Math.max(12, Math.floor(barHeight * 0.22))}px monospace`;
      ctx.fillText(`FECHA: ${dateStr}  |  HORA: ${timeStr}`, 16, canvas.height - barHeight + 48);

      ctx.fillStyle = '#38bdf8';
      ctx.font = `${Math.max(11, Math.floor(barHeight * 0.20))}px sans-serif`;
      ctx.fillText(`UBICACIÓN: ${overloadAddress.slice(0, 50)} (${locStr})`, 16, canvas.height - barHeight + 68);

      const stampedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setOverloadPhoto(stampedDataUrl);
      toneGenerator.playSuccessBeep();
    };
    img.src = imageSrc;
  };

  const captureFrameFromLiveVideo = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const rawDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    stopLiveCamera();
    stampPhotoCanvas(rawDataUrl);
  };

  const handleFileCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const raw = event.target?.result as string;
      if (raw) {
        stampPhotoCanvas(raw);
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit Overload Report
  const handleSubmitOverload = () => {
    toneGenerator.playSuccessBeep();
    const targetUnit = units.find(u => u.id === selectedUnitId) || units[0];
    const generatedFolio = `SOBRECUPO-LC-${Math.floor(1000 + Math.random() * 9000)}`;

    const alert: OverloadAlert = {
      id: generatedFolio,
      unitId: targetUnit.id,
      routeId: targetUnit.routeId,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      photoUrl: overloadPhoto || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
      passengersReported: overloadPassengers,
      status: 'dispatched',
    };

    const now = new Date();
    const dateStr = now.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const photoToUse = overloadPhoto || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80';

    const officialReport: CitizenReport = {
      id: 'rep-overload-' + Date.now(),
      folio: generatedFolio,
      type: 'sobrecupo',
      title: `Sobrecupo en Parada - Combi ${targetUnit.unitNumber}`,
      description: `Reporte de saturación de pasaje (${overloadPassengers} personas en espera) en ${overloadAddress}. Se despachó unidad extra municipal.`,
      coords: userLocation || targetUnit.coords,
      address: overloadAddress || 'Av. Melchor Ocampo, Lázaro Cárdenas, Michoacán',
      photoUrl: photoToUse,
      timestamp: `Hoy, ${timeStr}`,
      exactDate: dateStr,
      exactTime: timeStr,
      headerTitle: 'LC NOVA • EVIDENCIA GEO-VERIFICADA SOBRECUPO',
      status: 'cuadrilla_asignada',
      urgency: 'alta',
      upvotes: 1,
      isSynced: offlineManager.isOnline(),
    };

    setLastOverloadReport(officialReport);
    onAddReport(officialReport);

    if (!offlineManager.isOnline()) {
      offlineManager.enqueueItem('overload_alert', alert);
    }

    stopLiveCamera();

    // Trigger reinforcement unit dispatch
    onAddReinforcementUnit(targetUnit.routeId);

    // Show dispatcher response notification
    setTimeout(() => {
      setDispatchNotification({
        folio: generatedFolio,
        unitAssigned: 'LC-450 (Refuerzo Municipal)',
        driverName: 'Marcos Solorio Ruiz (Central ASIPONA)',
        etaMinutes: 4,
        address: overloadAddress,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      toneGenerator.playSuccessBeep();
      voiceService.speak(
        `Reporte de sobrecupo ${generatedFolio} aceptado. Central despachó la unidad de apoyo LC-450 a tu parada.`
      );
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Panel Locatario Header */}
      <div className="bg-slate-900 border border-emerald-700/60 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 flex items-center justify-center font-black shadow-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  Panel del Locatario & Ciudadano
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  ● PARTICIPACIÓN CIUDADANA
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Módulo exclusivo para residentes y vecinos: reporta incidencias urbanas y sobrecupo de combis con fotos selladas y dictado por voz.
              </p>
            </div>
          </div>

          {/* Sub-Tabs Switcher */}
          <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                setActiveSubTab('ciudadano');
                toneGenerator.playSuccessBeep();
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                activeSubTab === 'ciudadano'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Reportes Ciudadanos (Voz 🎙️)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveSubTab('sobrecupo');
                toneGenerator.playSuccessBeep();
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                activeSubTab === 'sobrecupo'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bus className="w-3.5 h-3.5" />
              <span>Reportes de Sobrecupo en Combis</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===================== SUB-TAB 1: REPORTES CIUDADANOS ===================== */}
      {activeSubTab === 'ciudadano' && (
        <CitizenReportModule
          reports={reports.filter(r => r.type !== 'sobrecupo')}
          onAddReport={onAddReport}
          onCenterMap={onCenterMap}
          isOnline={isOnline}
          userLocation={userLocation}
        />
      )}

      {/* ===================== SUB-TAB 2: REPORTES DE SOBRECUPO ===================== */}
      {activeSubTab === 'sobrecupo' && (
        <div className="space-y-6">
          {/* Dispatcher Response Banner */}
          {dispatchNotification && (
            <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-emerald-950/80 border-2 border-amber-400 rounded-2xl p-5 shadow-2xl space-y-3 animate-in fade-in duration-300">
              <div className="flex items-start justify-between gap-3 border-b border-amber-800/60 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-lg animate-bounce">
                    <BellRing className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                        DESPACHO AUTORIZADO
                      </span>
                      <span className="text-xs font-mono text-amber-300 font-bold">
                        FOLIO: {dispatchNotification.folio}
                      </span>
                    </div>
                    <h4 className="text-base font-black text-white mt-0.5">
                      ¡UNIDAD EXTRA EN CAMINO A TU PARADA!
                    </h4>
                  </div>
                </div>

                <button
                  onClick={() => setDispatchNotification(null)}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Llegada Estimada</span>
                  <p className="text-xl font-mono font-black text-emerald-400">
                    ~{dispatchNotification.etaMinutes} MINUTOS
                  </p>
                  <span className="text-[10px] text-amber-300">En ruta directa a tu ubicación</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Unidad de Refuerzo</span>
                  <p className="text-sm font-bold text-white">{dispatchNotification.unitAssigned}</p>
                  <p className="text-[11px] text-slate-400">Operador: {dispatchNotification.driverName}</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Parada Verificada</span>
                  <p className="text-xs font-semibold text-slate-200 truncate">{dispatchNotification.address}</p>
                  <p className="text-[10px] text-emerald-400">✓ Con evidencia fotográfica sellada</p>
                </div>
              </div>

              {lastOverloadReport && (
                <div className="pt-2 border-t border-amber-800/40 flex justify-end">
                  <button
                    type="button"
                    onClick={() => onViewReport && onViewReport(lastOverloadReport)}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Ver Ficha Oficial con Sello GPS</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Form Card for Overload Report */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Camera className="w-5 h-5 text-amber-400" />
                  Emitir Reporte de Sobrecupo en Combi
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Toma la fotografía de la parada o combi llena: se sellará con fecha, hora y coordenadas GPS oficiales.
                </p>
              </div>

              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800 self-start sm:self-auto">
                EVIDENCIA PARA DESPACHO DE REFUERZO
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              {/* Left Column: Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Dirección / Parada donde ocurre el sobrecupo:
                  </label>
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5">
                    <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                    <input
                      type="text"
                      value={overloadAddress}
                      onChange={(e) => setOverloadAddress(e.target.value)}
                      placeholder="Ej. Parada Hospital General, Av. Melchor Ocampo..."
                      className="w-full bg-transparent text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">
                      Unidad Saturada en Ruta:
                    </label>
                    <select
                      value={selectedUnitId}
                      onChange={(e) => setSelectedUnitId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    >
                      {units.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.unitNumber} - {u.nextStop}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">
                      Personas en Espera aprox:
                    </label>
                    <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5">
                      <Users className="w-4 h-4 text-amber-400 shrink-0" />
                      <input
                        type="number"
                        min={10}
                        max={90}
                        value={overloadPassengers}
                        onChange={(e) => setOverloadPassengers(Number(e.target.value))}
                        className="w-full bg-transparent text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <p className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    ¿Qué sucede al enviar este reporte?
                  </p>
                  <p>
                    Se genera un folio con validez municipal y se transmite la solicitud de unidad extra a la central de combis de Lázaro Cárdenas para desahogar a los usuarios.
                  </p>
                </div>
              </div>

              {/* Right Column: Camera & Stamped Photo Capture */}
              <div className="space-y-3">
                <label className="font-semibold text-slate-300 block">
                  Fotografía de Evidencia (Sellada con Fecha, Hora y GPS):
                </label>

                {overloadPhoto ? (
                  <div className="relative rounded-xl overflow-hidden border border-emerald-500 shadow-xl">
                    <img src={overloadPhoto} alt="Evidencia de sobrecupo sellada" className="w-full h-52 object-cover" />
                    <div className="absolute top-2 left-2 bg-emerald-500 text-slate-950 text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow">
                      ✓ SELLADO CON FECHA Y GPS
                    </div>
                    <button
                      type="button"
                      onClick={() => setOverloadPhoto(null)}
                      className="absolute top-2 right-2 bg-slate-950/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-700 shadow cursor-pointer"
                    >
                      Tomar otra
                    </button>
                  </div>
                ) : isCameraActive ? (
                  <div className="relative rounded-xl overflow-hidden border-2 border-amber-400 bg-black">
                    <video
                      ref={(node) => {
                        videoRef.current = node;
                        if (node && mediaStream && node.srcObject !== mediaStream) {
                          node.srcObject = mediaStream;
                          node.muted = true;
                          node.setAttribute('playsinline', 'true');
                          node.play().catch(console.error);
                        }
                      }}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-52 object-cover bg-black"
                    />
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={captureFrameFromLiveVideo}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl shadow-2xl flex items-center gap-1.5 cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Capturar con Sello</span>
                      </button>
                      <button
                        type="button"
                        onClick={stopLiveCamera}
                        className="bg-slate-900/90 text-slate-300 text-xs px-3 py-2 rounded-xl cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-700 rounded-xl p-5 text-center bg-slate-950/60 space-y-2.5">
                    <Camera className="w-8 h-8 text-amber-400 mx-auto" />
                    <p className="text-xs text-slate-300 font-semibold">
                      Captura la evidencia fotográfica de la parada o combi saturada
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={startLiveCamera}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Abrir Cámara en Vivo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 transition cursor-pointer"
                      >
                        <span>Subir Foto</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const sample = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80';
                          stampPhotoCanvas(sample);
                        }}
                        className="bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/70 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <span>Foto con Sello GPS Actual</span>
                      </button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileCapture}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={handleSubmitOverload}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs px-6 py-3 rounded-xl shadow-xl flex items-center justify-center gap-2 transition transform active:scale-98 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>ENVIAR REPORTE DE SOBRECUPO & SOLICITAR REFUERZO</span>
              </button>
            </div>
          </div>

          {/* List of Previous Overload Reports */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Bus className="w-4 h-4 text-amber-400" />
              Historial de Reportes de Sobrecupo en Lázaro Cárdenas ({reports.filter(r => r.type === 'sobrecupo').length})
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {reports.filter(r => r.type === 'sobrecupo').map((rep) => (
                <div key={rep.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-amber-300 text-[11px] font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                      {rep.folio}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">
                      ✓ DESPACHADO
                    </span>
                  </div>

                  <p className="font-bold text-white truncate">{rep.title}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{rep.description}</p>
                  
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">{rep.timestamp}</span>
                    <button
                      type="button"
                      onClick={() => onViewReport && onViewReport(rep)}
                      className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Ver Ficha</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
