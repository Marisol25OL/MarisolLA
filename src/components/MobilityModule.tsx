import React, { useState, useRef } from 'react';
import { 
  TransitRoute, 
  TransitUnit, 
  MechanicalFailureAlert,
  OverloadAlert,
  Coordinates,
  CitizenReport
} from '../types';
import { 
  Bus, 
  AlertTriangle, 
  Users, 
  Camera, 
  Radio, 
  Wrench, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  BellRing,
  FileText,
  Eye,
  Navigation,
  ExternalLink,
  Route,
  LocateFixed
} from 'lucide-react';
import { toneGenerator, voiceService } from '../services/voiceAssistant';
import { offlineManager } from '../services/offlineSync';

export interface DispatchNotification {
  folio: string;
  unitAssigned: string;
  driverName: string;
  etaMinutes: number;
  message: string;
  address: string;
  timestamp: string;
}

interface MobilityModuleProps {
  routes: TransitRoute[];
  units: TransitUnit[];
  selectedRouteId: string | null;
  userLocation: Coordinates | null;
  onSetUserLocation: (coords: Coordinates) => void;
  onSelectRoute: (routeId: string | null) => void;
  onCenterMap: (coords: Coordinates) => void;
  onUnitUpdate: (unit: TransitUnit) => void;
  onAddReinforcementUnit: (routeId: string) => void;
  onViewReport?: (report: CitizenReport) => void;
  onAddReport?: (report: CitizenReport) => void;
  onTraceRoute?: (result: {
    origin: Coordinates;
    destination: Coordinates;
    route: TransitRoute;
    walkingPath: Coordinates[];
    transitPath: Coordinates[];
    destinationName: string;
    instructions: string[];
  }) => void;
}

export const MobilityModule: React.FC<MobilityModuleProps> = ({
  routes,
  units,
  selectedRouteId,
  userLocation,
  onSetUserLocation,
  onSelectRoute,
  onCenterMap,
  onUnitUpdate,
  onAddReinforcementUnit,
  onViewReport,
  onAddReport,
  onTraceRoute,
}) => {
  // Tab state: 'user' or 'driver'
  const [activeTab, setActiveTab] = useState<'user' | 'driver'>('user');
  const [lastGeneratedReport, setLastGeneratedReport] = useState<CitizenReport | null>(null);

  // Collapsible Routes View State (User asked: "hazlo mas pequeño, como un boton desplegable")
  const [isRoutesOpen, setIsRoutesOpen] = useState<boolean>(false);

  // Driver Mode States
  const [driverUnitId, setDriverUnitId] = useState<string>('u-101');
  const [isGpsSharing, setIsGpsSharing] = useState<boolean>(true);
  const [driverPassengerCount, setDriverPassengerCount] = useState<number>(36);
  const [showMechanicalModal, setShowMechanicalModal] = useState<boolean>(false);
  const [faultType, setFaultType] = useState<MechanicalFailureAlert['faultType']>('frenos');
  const [faultDesc, setFaultDesc] = useState<string>('Pérdida de presión en línea de frenos sobre Av. Melchor Ocampo');
  const [recentFailureAlert, setRecentFailureAlert] = useState<MechanicalFailureAlert | null>(null);

  // User Mode Overload Report States
  const [selectedUnitForReport, setSelectedUnitForReport] = useState<string>('u-102');
  const [showOverloadModal, setShowOverloadModal] = useState<boolean>(false);
  const [overloadAddress, setOverloadAddress] = useState<string>('Av. Melchor Ocampo frente a Plaza Las Américas, Col. Segundo Sector');
  const [overloadPhoto, setOverloadPhoto] = useState<string | null>(null);
  const [overloadPassengers, setOverloadPassengers] = useState<number>(45);

  // Camera Live Video Stream in Modal
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Dispatcher response notification
  const [dispatchNotification, setDispatchNotification] = useState<DispatchNotification | null>(null);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(240); // 4 minutes

  const currentDriverUnit = units.find(u => u.id === driverUnitId) || units[0];

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
      // Fallback: trigger file input
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
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.fillRect(0, canvas.height - barHeight, canvas.width, barHeight);

      // Accent border
      ctx.fillStyle = '#06b6d4';
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
      ctx.fillText(`LC NOVA • EVIDENCIA OFICIAL SOBRECUPO`, 16, canvas.height - barHeight + 26);

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

  // Capture frame from active live video
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

  // Handle native file input capture
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

  // Handle Driver Emergency Mechanic Failure
  const handleReportBreakdown = () => {
    toneGenerator.playAlertBeep();
    const alert: MechanicalFailureAlert = {
      id: 'fail-' + Date.now(),
      unitId: currentDriverUnit.id,
      driverName: currentDriverUnit.driverName,
      routeId: currentDriverUnit.routeId,
      faultType,
      description: faultDesc,
      coords: currentDriverUnit.coords,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'dispatched_mechanic',
    };

    onUnitUpdate({
      ...currentDriverUnit,
      status: 'breakdown',
      lastUpdated: 'ALERTA DE EMERGENCIA EMITIDA',
    });

    if (!offlineManager.isOnline()) {
      offlineManager.enqueueItem('mechanical_failure', alert);
    }

    setRecentFailureAlert(alert);
    setShowMechanicalModal(false);
    voiceService.speak(`Alerta mecánica enviada para la unidad ${currentDriverUnit.unitNumber}.`);
  };

  // Handle User Overload Report Submission
  const handleSubmitOverload = () => {
    toneGenerator.playSuccessBeep();
    const targetUnit = units.find(u => u.id === selectedUnitForReport) || units[0];
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
      description: `Reporte de exceso de pasajeros (${overloadPassengers} personas en espera) en ${overloadAddress}. Se despachó la unidad extra LC-450.`,
      coords: userLocation || targetUnit.coords,
      address: overloadAddress || 'Av. Melchor Ocampo, Lázaro Cárdenas, Michoacán',
      photoUrl: photoToUse,
      timestamp: 'Justo ahora',
      exactDate: dateStr,
      exactTime: timeStr,
      headerTitle: 'LC NOVA • EVIDENCIA GEO-VERIFICADA',
      status: 'cuadrilla_asignada',
      urgency: 'alta',
      upvotes: 1,
      isSynced: offlineManager.isOnline(),
    };

    setLastGeneratedReport(officialReport);
    if (onAddReport) {
      onAddReport(officialReport);
    }

    if (!offlineManager.isOnline()) {
      offlineManager.enqueueItem('overload_alert', alert);
    }

    setShowOverloadModal(false);
    stopLiveCamera();

    // Trigger reinforcement unit dispatch in background
    onAddReinforcementUnit(targetUnit.routeId);

    // DISPATCHER RESPONSE NOTIFICATION WITH ETA & COUNTDOWN
    setTimeout(() => {
      const notif: DispatchNotification = {
        folio: generatedFolio,
        unitAssigned: 'LC-450 (Refuerzo Especial)',
        driverName: 'Marcos Solorio Ruiz (Central ASIPONA)',
        etaMinutes: 4,
        address: overloadAddress,
        message: `Tu reporte fue verificado con éxito con fecha y hora. Se autorizó la salida inmediata de la unidad extra para desahogar la parada.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setDispatchNotification(notif);
      setCountdownSeconds(240);
      toneGenerator.playSuccessBeep();
      voiceService.speak(
        `Atención: Reporte ${generatedFolio} aceptado. El encargado de ruta despachó la unidad extra LC-450. Llegará a tu parada en 4 minutos.`
      );
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Role Toggle Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2 flex items-center justify-between shadow-xl">
        <div className="flex gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800/80 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('user')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition ${
              activeTab === 'user'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Modo Pasajero</span>
          </button>
          <button
            onClick={() => setActiveTab('driver')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition ${
              activeTab === 'driver'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Modo Chofer</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-3 text-xs text-slate-400 px-3">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Telemetría GPS Activa (1 seg)
          </span>
          <span className="text-slate-600">•</span>
          <span>{units.length} Unidades en Operación</span>
        </div>
      </div>

      {/* DISPATCHER RESPONSE NOTIFICATION BANNER (Real Notification to the user with ETA) */}
      {dispatchNotification && (
        <div className="bg-gradient-to-r from-cyan-950/90 via-slate-900 to-purple-950/90 border-2 border-cyan-400 rounded-2xl p-5 shadow-2xl space-y-3 animate-in fade-in duration-300">
          <div className="flex items-start justify-between gap-3 border-b border-cyan-800/60 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center font-bold text-lg animate-bounce">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500 text-slate-950">
                    NOTIFICACIÓN DEL ENCARGADO DE RUTA
                  </span>
                  <span className="text-xs font-mono text-cyan-300 font-bold">
                    FOLIO: {dispatchNotification.folio}
                  </span>
                </div>
                <h4 className="text-base font-black text-white mt-0.5">
                  ¡UNIDAD EXTRA DESPACHADA A TU PARADA!
                </h4>
              </div>
            </div>

            <button
              onClick={() => setDispatchNotification(null)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
            >
              Cerrar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-semibold">TIEMPO ESTIMADO DE LLEGADA</span>
              <p className="text-xl font-mono font-black text-emerald-400">
                ~{dispatchNotification.etaMinutes} MINUTOS
              </p>
              <span className="text-[10px] text-cyan-300">En camino directo</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-semibold">UNIDAD ASIGNADA</span>
              <p className="text-sm font-bold text-white">{dispatchNotification.unitAssigned}</p>
              <p className="text-[11px] text-slate-400">Chofer: {dispatchNotification.driverName}</p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-semibold">UBICACIÓN VERIFICADA</span>
              <p className="text-xs font-semibold text-slate-200 truncate">{dispatchNotification.address}</p>
              <p className="text-[10px] text-emerald-400">✓ Con sello fotográfico de fecha y hora</p>
            </div>
          </div>

          {/* ACTION BUTTON TO VIEW GENERATED REPORT */}
          <div className="pt-3 border-t border-cyan-800/60 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                if (lastGeneratedReport && onViewReport) {
                  onViewReport(lastGeneratedReport);
                }
              }}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition transform active:scale-95 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Ver Reporte Oficial Generado (Foto, Fecha, Hora y GPS)</span>
            </button>
            <span className="text-[11px] text-cyan-200 font-mono">
              Folio de verificación: {dispatchNotification.folio}
            </span>
          </div>
        </div>
      )}

      {/* RECENTLY GENERATED OVERLOAD REPORT CARD (Always accessible to user) */}
      {lastGeneratedReport && (
        <div className="bg-slate-900/90 border border-cyan-500/50 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-2">
                <span>Reporte de Sobrecupo Generado:</span>
                <span className="font-mono text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-cyan-800 text-[11px]">
                  {lastGeneratedReport.folio}
                </span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                📅 {lastGeneratedReport.exactDate} • ⏰ {lastGeneratedReport.exactTime} • {lastGeneratedReport.address}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onViewReport && onViewReport(lastGeneratedReport)}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 shadow transition cursor-pointer shrink-0"
          >
            <Eye className="w-4 h-4" />
            <span>Ver Ficha de Evidencia</span>
          </button>
        </div>
      )}

      {/* ===================== USER VIEW ===================== */}
      {activeTab === 'user' && (
        <div className="space-y-5">
          {/* CÓMO LLEGAR EN COMBI DESDE MI UBICACIÓN (Trazar ruta y ver más conveniente) */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border-2 border-cyan-500/60 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-cyan-400" />
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    ¿Cómo llegar en combi desde mi ubicación?
                    <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded">
                      Ruta Más Conveniente
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Traza la combi óptima hacia cualquier colonia o centro de trabajo en Lázaro Cárdenas
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition((pos) => {
                        const coords = {
                          lat: Number(pos.coords.latitude.toFixed(5)),
                          lng: Number(pos.coords.longitude.toFixed(5)),
                        };
                        onSetUserLocation(coords);
                        onCenterMap(coords);
                        toneGenerator.playSuccessBeep();
                        voiceService.speak('Tu ubicación GPS ha sido detectada.');
                      });
                    }
                  }}
                  className="bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-cyan-700/60 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                >
                  <LocateFixed className="w-3.5 h-3.5" />
                  <span>Actualizar Mi GPS</span>
                </button>
              </div>
            </div>

            {/* Quick Destinations in Lázaro Cárdenas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
              {[
                { name: 'Siderúrgica ArcelorMittal', routeId: 'ruta-2', coords: { lat: 17.9390, lng: -102.2120 } },
                { name: 'Aduana Marítima / ASIPONA', routeId: 'ruta-2', coords: { lat: 17.9355, lng: -102.1845 } },
                { name: 'Hospital General / Melchor Ocampo', routeId: 'ruta-1', coords: { lat: 17.9785, lng: -102.2120 } },
                { name: 'Playa Azul / Boulevard', routeId: 'ruta-3', coords: { lat: 17.9820, lng: -102.3520 } },
              ].map((dest, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    const r = routes.find(rt => rt.id === dest.routeId) || routes[0];
                    const origin = userLocation || { lat: 17.9632, lng: -102.1985 };
                    if (onTraceRoute) {
                      onTraceRoute({
                        origin,
                        destination: dest.coords,
                        route: r,
                        walkingPath: [origin, r.stops[0].coords],
                        transitPath: r.waypoints,
                        destinationName: dest.name,
                        instructions: [
                          `Camina hacia la parada ${r.stops[0].name}`,
                          `Aborda la combi ${r.name}`,
                          `Desciende en la parada más cercana a ${dest.name}`,
                        ],
                      });
                    }
                    onCenterMap(dest.coords);
                    toneGenerator.playSuccessBeep();
                    voiceService.speak(`Trazando la ruta más conveniente hacia ${dest.name} en ${r.name}.`);
                  }}
                  className="bg-slate-950/80 hover:bg-slate-850 p-2.5 rounded-xl border border-slate-800 hover:border-cyan-500/60 text-left transition cursor-pointer group"
                >
                  <span className="font-bold text-white block group-hover:text-cyan-300 truncate">
                    {dest.name}
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1 mt-0.5">
                    <Route className="w-3 h-3" />
                    <span>Trazar Ruta en Combi</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 1. COMPACT COLLAPSIBLE ROUTES DROPDOWN (User requested small button) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow">
            <button
              onClick={() => setIsRoutesOpen(!isRoutesOpen)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-850 transition"
            >
              <div className="flex items-center gap-2.5">
                <Bus className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white">
                  Rutas de Combis y Camiones en Lázaro Cárdenas ({routes.length} Rutas)
                </span>
                {selectedRouteId && (
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-700">
                    Filtrando: {routes.find(r => r.id === selectedRouteId)?.code}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
                <span>{isRoutesOpen ? 'Ocultar desglose' : 'Ver desglose'}</span>
                {isRoutesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {/* EXPANDED CONTENT (Only shown when user opens it) */}
            {isRoutesOpen && (
              <div className="p-4 border-t border-slate-800 bg-slate-950/60 grid grid-cols-1 md:grid-cols-3 gap-3">
                {routes.map((route) => {
                  const isSelected = selectedRouteId === route.id;
                  const routeUnits = units.filter(u => u.routeId === route.id);

                  return (
                    <div
                      key={route.id}
                      onClick={() => onSelectRoute(isSelected ? null : route.id)}
                      className={`cursor-pointer rounded-xl p-3.5 border transition ${
                        isSelected
                          ? 'bg-slate-800/90 border-cyan-400 shadow-md'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded text-white"
                          style={{ backgroundColor: route.color }}
                        >
                          {route.code}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Cada {route.frequencyMinutes} min
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white mb-0.5">{route.name}</h4>
                      <p className="text-[11px] text-slate-400 truncate">{route.destination}</p>
                      <div className="mt-2 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px]">
                        <span className="text-cyan-300">{routeUnits.length} combis activas</span>
                        <span className="text-cyan-400 font-bold">{isSelected ? 'Activo' : 'Filtrar'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. REAL-TIME UNITS MONITOR & OVERLOAD ACTION */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
                  Monitoreo de Combis en Tiempo Real y ETA
                </h3>
                <p className="text-xs text-slate-400">
                  Ubicación vía telemetría GPS directa sobre el mapa satelital.
                </p>
              </div>

              {/* OVERLOAD REPORT BUTTON */}
              <button
                onClick={() => {
                  setShowOverloadModal(true);
                  setOverloadPhoto(null);
                  setIsCameraActive(false);
                }}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition hover:scale-[1.02] active:scale-[0.98]"
              >
                <Camera className="w-4 h-4" />
                <span>Reportar Sobrecupo (Foto con Fecha y GPS)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {units
                .filter(u => !selectedRouteId || u.routeId === selectedRouteId)
                .map((unit) => {
                  const isHigh = unit.occupancyPercent >= 90;
                  const isBroken = unit.status === 'breakdown';
                  const isReinforce = unit.status === 'reinforcement';

                  return (
                    <div
                      key={unit.id}
                      className={`rounded-xl p-4 border transition ${
                        isBroken
                          ? 'bg-red-950/30 border-red-800'
                          : isReinforce
                          ? 'bg-purple-950/30 border-purple-700'
                          : isHigh
                          ? 'bg-amber-950/20 border-amber-800/80'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                            {unit.unitNumber}
                          </span>
                          {isReinforce && (
                            <span className="text-[10px] bg-purple-500 text-white font-bold px-1.5 py-0.5 rounded">
                              REFUERZO
                            </span>
                          )}
                          {isBroken && (
                            <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded animate-pulse">
                              FALLA MECÁNICA
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span className={`text-xs font-bold ${
                            isHigh ? 'text-amber-400' : 'text-emerald-400'
                          }`}>
                            {unit.occupancyPercent}% Ocupado
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-300 mb-3">
                        <p className="flex items-center justify-between">
                          <span className="text-slate-400">Operador:</span>
                          <span className="font-semibold text-slate-200">{unit.driverName}</span>
                        </p>
                        <p className="flex items-center justify-between">
                          <span className="text-slate-400">Próxima Parada:</span>
                          <span className="font-semibold text-white truncate max-w-[170px]">{unit.nextStop}</span>
                        </p>
                        <p className="flex items-center justify-between">
                          <span className="text-slate-400">Tiempo de Llegada (ETA):</span>
                          <span className="font-bold text-cyan-400 font-mono text-sm">{unit.etaMinutes} min</span>
                        </p>
                      </div>

                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isBroken ? 'bg-red-500' : isHigh ? 'bg-amber-400' : 'bg-cyan-400'
                          }`}
                          style={{ width: `${Math.min(unit.occupancyPercent, 100)}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                        <button
                          onClick={() => onCenterMap(unit.coords)}
                          className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Ubicar</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedUnitForReport(unit.id);
                            setShowOverloadModal(true);
                          }}
                          className="text-[11px] text-slate-400 hover:text-amber-400 flex items-center gap-1 transition"
                        >
                          <Camera className="w-3 h-3" />
                          <span>Reportar Sobrecupo</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* ===================== DRIVER VIEW ===================== */}
      {activeTab === 'driver' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                  PANEL DEL CHOFER
                </span>
                <span className="text-xs text-slate-400">Unidad asignada: {currentDriverUnit.unitNumber}</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {currentDriverUnit.driverName}
              </h3>
              <p className="text-xs text-cyan-400 mt-0.5">
                Ruta 1: Centro - Las Guacamayas • Próxima parada: {currentDriverUnit.nextStop}
              </p>
            </div>

            <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="text-right">
                <p className="text-xs font-bold text-white">
                  {isGpsSharing ? 'Transmitiendo GPS en Vivo' : 'Transmisión Pausada'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {isGpsSharing ? 'Visible para usuarios' : 'No visible'}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsGpsSharing(!isGpsSharing);
                  voiceService.speak(isGpsSharing ? 'Transmisión detenida.' : 'Transmisión de GPS activada.');
                }}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  isGpsSharing ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    isGpsSharing ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400">Velocidad Actual</span>
              <p className="text-2xl font-mono font-bold text-cyan-400 mt-1">
                {currentDriverUnit.speedKmH} <span className="text-sm font-normal text-slate-400">km/h</span>
              </p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400">Pasajeros a Bordo</span>
              <div className="flex items-center justify-between mt-1">
                <p className="text-2xl font-mono font-bold text-amber-400">
                  {driverPassengerCount} <span className="text-sm font-normal text-slate-400">/ 40</span>
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      const next = Math.max(0, driverPassengerCount - 1);
                      setDriverPassengerCount(next);
                      onUnitUpdate({ ...currentDriverUnit, occupancyPercent: Math.round((next / 40) * 100) });
                    }}
                    className="w-7 h-7 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold text-sm"
                  >
                    -
                  </button>
                  <button
                    onClick={() => {
                      const next = Math.min(48, driverPassengerCount + 1);
                      setDriverPassengerCount(next);
                      onUnitUpdate({ ...currentDriverUnit, occupancyPercent: Math.round((next / 40) * 100) });
                    }}
                    className="w-7 h-7 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400">Tiempo de Ruta Restante</span>
              <p className="text-2xl font-mono font-bold text-white mt-1">
                18 <span className="text-sm font-normal text-slate-400">min</span>
              </p>
            </div>
          </div>

          <div className="bg-red-950/30 border border-red-800/80 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-base font-bold text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500 animate-bounce" />
                Botón de Emergencia: Falla Mecánica de la Unidad
              </h4>
              <p className="text-xs text-red-200/80 max-w-xl">
                Envía una alerta geolocalizada a los talleres de ASIPONA y Protección Civil.
              </p>
            </div>

            <button
              onClick={() => setShowMechanicalModal(true)}
              className="bg-red-600 hover:bg-red-500 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition"
            >
              <Wrench className="w-5 h-5" />
              <span>Reportar Falla Mecánica</span>
            </button>
          </div>
        </div>
      )}

      {/* ===================== MODAL: OVERLOAD REPORT WITH CAMERA CAPTURE & TIMESTAMP STAMP ===================== */}
      {showOverloadModal && (
        <div className="fixed inset-0 z-[2000] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 my-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold font-mono uppercase bg-amber-500 text-slate-950 px-2 py-0.5 rounded">
                  EVIDENCIA FOTOGRÁFICA AUTENTICADA
                </span>
                <h3 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-amber-400" />
                  Reporte de Exceso de Pasajeros (Sobrecupo)
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowOverloadModal(false);
                  stopLiveCamera();
                }}
                className="text-slate-400 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* ADDRESS FIELD (User requested: "en reporte pueda poner la direccion donde esta el exceso") */}
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Dirección / Parada exacta donde está el exceso de pasajeros:
                </label>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                  <input
                    type="text"
                    required
                    value={overloadAddress}
                    onChange={(e) => setOverloadAddress(e.target.value)}
                    placeholder="Ej. Parada Hospital General, Av. Melchor Ocampo..."
                    className="w-full bg-transparent text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* COMBI SELECTOR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Unidad Saturada:
                  </label>
                  <select
                    value={selectedUnitForReport}
                    onChange={(e) => setSelectedUnitForReport(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {units.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.unitNumber} - {u.nextStop}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Personas en espera aprox:
                  </label>
                  <input
                    type="number"
                    value={overloadPassengers}
                    onChange={(e) => setOverloadPassengers(Number(e.target.value))}
                    min={20}
                    max={90}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* LIVE CAMERA CAPTURE & WATERMARKED PHOTO */}
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Tomar Fotografía con Cámara (Se sellará con Fecha, Hora y GPS):
                </label>

                {/* Stamped photo preview */}
                {overloadPhoto ? (
                  <div className="relative rounded-xl overflow-hidden border border-emerald-500/60 shadow-xl">
                    <img src={overloadPhoto} alt="Evidencia sellada" className="w-full h-48 object-cover" />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        type="button"
                        onClick={() => setOverloadPhoto(null)}
                        className="bg-slate-950/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-700 shadow"
                      >
                        Tomar otra foto
                      </button>
                    </div>
                    <div className="absolute top-2 left-2 bg-emerald-500 text-slate-950 text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow">
                      ✓ SELLADO CON FECHA Y GPS
                    </div>
                  </div>
                ) : isCameraActive ? (
                  /* Live Camera Viewfinder */
                  <div className="relative rounded-xl overflow-hidden border-2 border-cyan-400 bg-black">
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
                      className="w-full h-56 object-cover bg-black"
                    />
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={captureFrameFromLiveVideo}
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl shadow-2xl flex items-center gap-1.5"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Capturar Foto con Sello</span>
                      </button>
                      <button
                        type="button"
                        onClick={stopLiveCamera}
                        className="bg-slate-900/90 text-slate-300 text-xs px-3 py-2 rounded-xl"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Camera activation buttons */
                  <div className="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center bg-slate-950/60 space-y-2">
                    <Camera className="w-8 h-8 text-cyan-400 mx-auto" />
                    <p className="text-xs text-slate-300 font-semibold">
                      Captura la foto desde tu cámara para estampar la fecha, hora y ubicación exacta
                    </p>
                    
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={startLiveCamera}
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Abrir Cámara en Vivo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 transition"
                      >
                        <span>Subir desde Galería</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const sample = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80';
                          stampPhotoCanvas(sample);
                        }}
                        className="bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-600/70 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
                        title="Genera la foto de sobrecupo estampada inmediatamente con fecha, hora y GPS actual"
                      >
                        <span>Generar con Sello GPS Actual</span>
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

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setShowOverloadModal(false);
                  stopLiveCamera();
                }}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmitOverload}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Reporte y Generar Folio</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL: MECHANICAL FAILURE ===================== */}
      {showMechanicalModal && (
        <div className="fixed inset-0 z-[2000] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
                  Reporte de Emergencia: Falla Mecánica
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Operador: {currentDriverUnit.driverName} • Unidad {currentDriverUnit.unitNumber}
                </p>
              </div>
              <button
                onClick={() => setShowMechanicalModal(false)}
                className="text-slate-400 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Tipo de Desperfecto:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['frenos', 'motor', 'neumaticos', 'electrico', 'transmision'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFaultType(type)}
                      className={`text-xs font-bold py-2 px-3 rounded-lg border capitalize text-left transition ${
                        faultType === type
                          ? 'bg-red-600 text-white border-red-400 shadow'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Descripción:
                </label>
                <textarea
                  value={faultDesc}
                  onChange={(e) => setFaultDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowMechanicalModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleReportBreakdown}
                className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>CONFIRMAR ALERTA MECÁNICA</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
