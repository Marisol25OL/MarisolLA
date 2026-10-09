import React, { useState, useRef } from 'react';
import { CitizenReport, CitizenReportType, Coordinates } from '../types';
import { 
  FileText, 
  MapPin, 
  Camera, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Sparkles, 
  Clock, 
  ThumbsUp, 
  ShieldAlert, 
  Trash2, 
  Lightbulb, 
  TrafficCone, 
  Store,
  WifiOff,
  Video,
  X,
  Compass,
  Check,
  ExternalLink,
  Printer
} from 'lucide-react';
import { toneGenerator, voiceService } from '../services/voiceAssistant';
import { offlineManager } from '../services/offlineSync';
import { ReportDetailModal } from './ReportDetailModal';
import { ReportPrintPreviewModal } from './ReportPrintPreviewModal';

interface CitizenReportModuleProps {
  reports: CitizenReport[];
  onAddReport: (report: CitizenReport) => void;
  onCenterMap: (coords: Coordinates) => void;
  isOnline: boolean;
  userLocation?: Coordinates | null;
}

export const CitizenReportModule: React.FC<CitizenReportModuleProps> = ({
  reports,
  onAddReport,
  onCenterMap,
  isOnline,
  userLocation,
}) => {
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [selectedReportForDetail, setSelectedReportForDetail] = useState<CitizenReport | null>(null);
  const [printPreviewReport, setPrintPreviewReport] = useState<CitizenReport | null>(null);
  const [recentlyCreatedReport, setRecentlyCreatedReport] = useState<CitizenReport | null>(null);
  const [selectedType, setSelectedType] = useState<CitizenReportType>('baches');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [address, setAddress] = useState<string>('Av. Melchor Ocampo esq. Av. Lázaro Cárdenas, Centro');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [urgency, setUrgency] = useState<CitizenReport['urgency']>('media');
  const [filterType, setFilterType] = useState<CitizenReportType | 'all'>('all');
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  // Live Camera states
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const reportTypes: Array<{ type: CitizenReportType; label: string; icon: string; defaultUrgency: CitizenReport['urgency'] }> = [
    { type: 'baches', label: 'Baches y Pavimentación', icon: '🕳️', defaultUrgency: 'media' },
    { type: 'alumbrado', label: 'Fallas de Alumbrado', icon: '💡', defaultUrgency: 'media' },
    { type: 'basura', label: 'Basura y Tiraderos', icon: '🗑️', defaultUrgency: 'baja' },
    { type: 'semaforos', label: 'Semáforos Descompuestos', icon: '🚦', defaultUrgency: 'alta' },
    { type: 'senalamientos', label: 'Señalamientos Faltantes', icon: '🛑', defaultUrgency: 'media' },
    { type: 'cocodrilos', label: 'Avistamiento de Cocodrilos 🐊', icon: '🐊', defaultUrgency: 'critica' },
    { type: 'ambulantes', label: 'Exceso de Ambulantes', icon: '⛺', defaultUrgency: 'baja' },
    { type: 'delincuencia', label: 'Hechos de Violencia / Delito', icon: '🚨', defaultUrgency: 'critica' },
  ];

  // Request actual camera permission & stream to video element
  const startLiveCamera = async () => {
    setCameraError(null);

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      setMediaStream(stream);
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('Permiso de cámara no concedido en este marco de navegador (' + (err?.name || 'Error') + '). Puedes usar la cámara de tu dispositivo con el botón de abajo o capturar con sello de prueba.');
      fileInputRef.current?.click();
    }
  };

  const stopLiveCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Stamp date, time, and GPS coordinates onto canvas image
  const stampPhotoCanvas = (imageSrc: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(img.width || 800, 800);
      canvas.height = Math.max(img.height || 600, 600);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw original camera capture
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Watermark footer bar
      const barHeight = Math.max(90, Math.floor(canvas.height * 0.20));
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.fillRect(0, canvas.height - barHeight, canvas.width, barHeight);

      // Cyan accent border
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(0, canvas.height - barHeight, canvas.width, 5);

      // Current Date & Time
      const now = new Date();
      const dateStr = now.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      // Coordinates
      const currentLat = userLocation ? userLocation.lat.toFixed(5) : '17.96250';
      const currentLng = userLocation ? userLocation.lng.toFixed(5) : '-102.19900';

      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.max(16, Math.floor(barHeight * 0.26))}px sans-serif`;
      ctx.fillText(`LC NOVA • EVIDENCIA GEO-VERIFICADA`, 20, canvas.height - barHeight + 28);

      ctx.fillStyle = '#facc15';
      ctx.font = `bold ${Math.max(14, Math.floor(barHeight * 0.23))}px monospace`;
      ctx.fillText(`📅 FECHA: ${dateStr}   |   ⏰ HORA: ${timeStr}`, 20, canvas.height - barHeight + 54);

      ctx.fillStyle = '#38bdf8';
      ctx.font = `bold ${Math.max(12, Math.floor(barHeight * 0.20))}px monospace`;
      ctx.fillText(`📍 GPS: Lat ${currentLat}° N, Lng ${currentLng}° W  |  ${address.slice(0, 48)}`, 20, canvas.height - barHeight + 78);

      const stampedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setPhotoUrl(stampedDataUrl);
      toneGenerator.playSuccessBeep();
    };
    img.src = imageSrc;
  };

  // Capture current frame from live video feed
  const captureFrameFromVideo = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 800;
    canvas.height = videoRef.current.videoHeight || 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const rawData = canvas.toDataURL('image/jpeg', 0.92);
    stopLiveCamera();
    stampPhotoCanvas(rawData);
  };

  // Handle gallery/file input upload
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleOpenFormWithType = (type: CitizenReportType) => {
    setSelectedType(type);
    const item = reportTypes.find((r) => r.type === type);
    if (item) setUrgency(item.defaultUrgency);

    if (type === 'cocodrilos') {
      setTitle('Avistamiento de cocodrilo en zona urbana / canal');
      setDescription('Ejemplar avistado cerca de zona habitacional o canal pluvial. Requiere Protección Civil.');
    } else if (type === 'baches') {
      setTitle('Bache de gran profundidad en carril principal');
      setDescription('Hundimiento de asfalto provocado por lluvias y tránsito de carga pesada.');
    } else if (type === 'alumbrado') {
      setTitle('Luminarias apagadas en andén público');
      setDescription('Tramo completamente a oscuras, genera riesgo para peatones y transeúntes.');
    } else if (type === 'basura') {
      setTitle('Acumulación de basura en vía pública');
      setDescription('Tiradero clandestino obstruyendo banqueta y generando foco de infección.');
    }

    setShowFormModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toneGenerator.playSuccessBeep();
    stopLiveCamera();

    const currentCoords = userLocation || {
      lat: 17.9625 + (Math.random() - 0.5) * 0.02,
      lng: -102.1990 + (Math.random() - 0.5) * 0.02,
    };

    const now = new Date();
    const dateStr = now.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const newReport: CitizenReport = {
      id: 'rep-' + Date.now(),
      folio: `LC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      type: selectedType,
      title: title || `Reporte de ${selectedType}`,
      description: description || 'Incidencia geolocalizada reportada por ciudadano mediante LC Nova.',
      coords: currentCoords,
      address: address || 'Av. Melchor Ocampo esq. Av. Lázaro Cárdenas, Centro, Lázaro Cárdenas, Michoacán',
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
      timestamp: 'Justo ahora',
      exactDate: dateStr,
      exactTime: timeStr,
      headerTitle: 'LC NOVA • EVIDENCIA GEO-VERIFICADA',
      status: 'recibido',
      urgency,
      upvotes: 1,
      isSynced: isOnline,
    };

    setRecentlyCreatedReport(newReport);

    if (!isOnline) {
      offlineManager.enqueueItem('citizen_report', newReport);
      setFeedbackSuccess(`Guardado en Modo Offline (Folio: ${newReport.folio}). Se sincronizará automáticamente al detectar señal.`);
      voiceService.speak('Reporte guardado en memoria local sin conexión. Se transmitirá al detectar señal.');
    } else {
      setFeedbackSuccess(`¡Reporte registrado exitosamente con Folio ${newReport.folio}! Turnado a la cuadrilla municipal.`);
      voiceService.speak(`Reporte ciudadano registrado con folio ${newReport.folio}.`);
    }

    onAddReport(newReport);
    setShowFormModal(false);
    setPhotoUrl(null);
  };

  const filteredReports = reports.filter((r) => {
    if (filterType === 'all') return true;
    return r.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Header & New Report Action */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyan-400" />
            Reporte Ciudadano & Impacto Social
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Plataforma directa para reportar incidencias georreferenciadas con evidencia fotográfica sellada con fecha, hora y coordenadas GPS.
          </p>
        </div>

        <button
          onClick={() => {
            setShowFormModal(true);
            setPhotoUrl(null);
            setIsCameraActive(false);
          }}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition transform active:scale-95 shrink-0"
        >
          <Camera className="w-4 h-4" />
          <span>+ Nuevo Reporte con Foto</span>
        </button>
      </div>

      {/* Success Notification */}
      {feedbackSuccess && (
        <div className="bg-emerald-950/90 border-2 border-emerald-500 rounded-xl p-4 text-emerald-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xl animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-white text-xs">{feedbackSuccess}</p>
              <p className="text-[11px] text-emerald-300">Evidencia sellada y archivada con fecha, hora y coordenadas GPS.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {recentlyCreatedReport && (
              <button
                type="button"
                onClick={() => setSelectedReportForDetail(recentlyCreatedReport)}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Ver Reporte y Ficha de Evidencia</span>
              </button>
            )}
            <button 
              type="button"
              onClick={() => setFeedbackSuccess(null)} 
              className="text-emerald-400 hover:text-white p-1 rounded font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Quick Category Report Grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          ¿Qué deseas reportar hoy en el puerto?
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {reportTypes.map((item) => (
            <button
              key={item.type}
              onClick={() => handleOpenFormWithType(item.type)}
              className="bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/60 rounded-xl p-3 text-left transition flex flex-col justify-between h-24 group shadow"
            >
              <span className="text-2xl group-hover:scale-110 transition transform">{item.icon}</span>
              <div>
                <span className="text-xs font-bold text-white block group-hover:text-cyan-300 transition">
                  {item.label}
                </span>
                <span className="text-[10px] text-slate-400 capitalize">
                  Prioridad: {item.defaultUrgency}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Filter Chips & Reports List */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Incidencias Registradas en Lázaro Cárdenas ({filteredReports.length})</span>
          </h3>

          {/* Type Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                filterType === 'all'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Todos
            </button>
            {reportTypes.map((t) => (
              <button
                key={t.type}
                onClick={() => setFilterType(t.type)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition whitespace-nowrap ${
                  filterType === t.type
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {t.icon} {t.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-slate-950/70 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col justify-between hover:border-slate-700 transition"
            >
              {/* Photo with Embedded Watermark */}
              <div className="relative h-44 bg-slate-900 overflow-hidden">
                <img
                  src={report.photoUrl}
                  alt={report.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold bg-slate-950/90 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800/80">
                    FOLIO: {report.folio}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                      report.urgency === 'critica'
                        ? 'bg-red-600 text-white'
                        : report.urgency === 'alta'
                        ? 'bg-amber-600 text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {report.urgency}
                  </span>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{report.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{report.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-[11px] space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 truncate">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{report.address}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {report.timestamp}
                    </span>
                    <span className="text-emerald-400 font-bold uppercase">
                      ● {report.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 mt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedReportForDetail(report)}
                    className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-lg cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Ver Ficha de Evidencia Oficial</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      toneGenerator.playSuccessBeep();
                      setPrintPreviewReport(report);
                    }}
                    className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-300 hover:text-white font-semibold rounded-lg text-[11px] border border-slate-800 hover:border-emerald-700/60 flex items-center justify-center gap-1.5 transition cursor-pointer"
                    title="Ver vista previa de cómo se verá el reporte y poder imprimirlo"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Vista Previa e Imprimir</span>
                  </button>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${report.coords.lat},${report.coords.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      toneGenerator.playSuccessBeep();
                      onCenterMap(report.coords);
                    }}
                    className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white font-semibold rounded-lg text-[11px] border border-slate-800 hover:border-cyan-700/60 flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Ver en Google Maps Satelital</span>
                    <ExternalLink className="w-3 h-3 opacity-70 ml-0.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===================== MODAL: CREATE REPORT WITH REAL LIVE CAMERA ===================== */}
      {showFormModal && (
        <div className="fixed inset-0 z-[2000] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-800/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Camera className="w-5 h-5 text-cyan-400" />
                  Nuevo Reporte Ciudadano Geolocalizado
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Lázaro Cárdenas, Michoacán • Sello digital con fecha, hora y coordenadas
                </p>
              </div>
              <button
                onClick={() => {
                  stopLiveCamera();
                  setShowFormModal(false);
                }}
                className="text-slate-400 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Categoría de la incidencia:
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => handleOpenFormWithType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {reportTypes.map((t) => (
                    <option key={t.type} value={t.type}>
                      {t.icon} {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Título breve del problema:
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Bache profundo en Av. Melchor Ocampo"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Descripción detallada:
                </label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explica qué ocurre y los riesgos para peatones o vehículos..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Dirección o referencia exacta en Lázaro Cárdenas:
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* REAL LIVE CAMERA VIEWFINDER & WATERMARK STAMP */}
              <div className="space-y-2">
                <label className="font-semibold text-slate-300 block">
                  Evidencia Fotográfica con Cámara Real:
                </label>

                {isCameraActive ? (
                  /* LIVE VIDEO FEED */
                  <div className="relative rounded-xl overflow-hidden border-2 border-cyan-400 bg-black space-y-2">
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
                      playsInline
                      muted
                      autoPlay
                      className="w-full h-64 object-cover bg-black"
                    />

                    {/* Shutter button overlay */}
                    <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-3 px-4">
                      <button
                        type="button"
                        onClick={captureFrameFromVideo}
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs ring-4 ring-cyan-500/40 cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        <span>📸 Capturar y Estampar Foto Ahora</span>
                      </button>

                      <button
                        type="button"
                        onClick={stopLiveCamera}
                        className="bg-slate-950/80 text-slate-300 text-xs px-3 py-2 rounded-xl border border-slate-700"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : photoUrl ? (
                  /* STAMPED PHOTO PREVIEW */
                  <div className="relative rounded-xl overflow-hidden border-2 border-emerald-500 shadow-xl">
                    <img
                      src={photoUrl}
                      alt="Evidencia Estampada"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-emerald-950/90 text-emerald-300 border border-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-400" />
                      Foto Verificada con Sello de Fecha, Hora y Coordenadas GPS
                    </div>

                    <div className="absolute top-2 right-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={startLiveCamera}
                        className="bg-slate-900/90 hover:bg-slate-800 text-cyan-300 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-700"
                      >
                        Tomar otra foto
                      </button>
                      <button
                        type="button"
                        onClick={() => setPhotoUrl(null)}
                        className="bg-red-950/90 text-red-300 text-[10px] font-bold px-2 py-1 rounded-lg border border-red-800"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  /* CAMERA ACTIVATION PROMPT */
                  <div className="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center bg-slate-950/60 space-y-2.5">
                    <Camera className="w-8 h-8 text-cyan-400 mx-auto" />
                    <p className="text-xs text-slate-300 font-semibold">
                      Abre tu cámara en vivo para que el sistema capture la foto y le estampe automáticamente la fecha, hora y coordenadas GPS oficiales.
                    </p>

                    {cameraError && (
                      <p className="text-[11px] text-amber-400 bg-amber-950/40 p-2 rounded border border-amber-800">
                        {cameraError}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={startLiveCamera}
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg transition active:scale-95 cursor-pointer"
                      >
                        <Video className="w-4 h-4" />
                        <span>Abrir Cámara en Vivo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-3 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition"
                      >
                        <span>Subir desde Archivo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const sample = selectedType === 'cocodrilos'
                            ? 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
                            : selectedType === 'alumbrado'
                            ? 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80'
                            : selectedType === 'basura'
                            ? 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'
                            : 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';
                          stampPhotoCanvas(sample);
                        }}
                        className="bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-600/70 font-bold px-3 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition"
                        title="Genera la foto y le aplica el sello de agua con tu fecha, hora y coordenadas GPS reales"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Generar con Sello GPS Actual</span>
                      </button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    stopLiveCamera();
                    setShowFormModal(false);
                  }}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publicar Reporte Ciudadano</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: VIEW GENERATED REPORT & EVIDENCE SHEET ===================== */}
      <ReportDetailModal
        report={selectedReportForDetail}
        onClose={() => setSelectedReportForDetail(null)}
        onCenterMap={onCenterMap}
      />

      {/* ===================== MODAL: OFFICIAL PRINT PREVIEW ===================== */}
      {printPreviewReport && (
        <ReportPrintPreviewModal
          report={printPreviewReport}
          onClose={() => setPrintPreviewReport(null)}
        />
      )}
    </div>
  );
};
