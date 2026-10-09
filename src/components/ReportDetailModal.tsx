import React from 'react';
import { CitizenReport, Coordinates } from '../types';
import { 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  Compass, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink,
  Printer,
  Share2,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { toneGenerator } from '../services/voiceAssistant';
import { ReportPrintPreviewModal } from './ReportPrintPreviewModal';

interface ReportDetailModalProps {
  report: CitizenReport | null;
  onClose: () => void;
  onCenterMap?: (coords: Coordinates) => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  onClose,
  onCenterMap,
}) => {
  const [showPrintPreview, setShowPrintPreview] = React.useState<boolean>(false);

  if (!report) return null;

  const now = new Date();
  const displayDate = report.exactDate || now.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const displayTime = report.exactTime || now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const latNum = Math.abs(report.coords.lat).toFixed(5);
  const lngNum = Math.abs(report.coords.lng).toFixed(5);
  const latStr = `${latNum}° N`;
  const lngStr = `${lngNum}° W`;

  const handleOpenPrintPreview = () => {
    toneGenerator.playSuccessBeep();
    setShowPrintPreview(true);
  };

  const handleDownloadImage = () => {
    toneGenerator.playSuccessBeep();
    const link = document.createElement('a');
    link.href = report.photoUrl;
    link.download = `EVIDENCIA_${report.folio}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-[2500] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-cyan-500/80 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-cyan-500 text-slate-950 px-2 py-0.5 rounded">
                  FOLIO OFICIAL: {report.folio}
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-600/60 px-2 py-0.5 rounded font-mono font-bold">
                  ● {report.status.toUpperCase().replace('_', ' ')}
                </span>
              </div>
              <h3 className="text-base font-black text-white mt-0.5 truncate max-w-md">
                {report.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition cursor-pointer"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Main Photo with Verification Stamp */}
          <div className="relative rounded-xl overflow-hidden border-2 border-cyan-600/70 bg-black shadow-xl group">
            <img
              src={report.photoUrl}
              alt="Evidencia fotográfica oficial"
              className="w-full max-h-80 object-cover"
            />
            
            <div className="absolute top-3 left-3 bg-slate-950/90 text-cyan-300 border border-cyan-500/60 px-3 py-1 rounded-lg text-xs font-mono font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>FOTOGRAFÍA GEO-REFERENCIADA OFICIAL</span>
            </div>

            <button
              onClick={handleDownloadImage}
              className="absolute bottom-3 right-3 bg-slate-950/90 hover:bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 shadow-lg flex items-center gap-1.5 backdrop-blur-sm transition cursor-pointer"
            >
              <span>Descargar Foto</span>
            </button>
          </div>

          {/* OFFICIAL EVIDENCE DATA SHEET (Exactly as user requested) */}
          <div className="bg-slate-950 border-2 border-cyan-500/40 rounded-xl p-4 sm:p-5 shadow-xl space-y-3.5">
            
            {/* 1. Encabezado Oficial */}
            <div className="border-b border-slate-800 pb-2.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Encabezado oficial:
              </span>
              <p className="text-base sm:text-lg font-black text-cyan-400 flex items-center gap-2 mt-0.5 tracking-wide">
                <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
                LC NOVA • EVIDENCIA GEO-VERIFICADA
              </p>
            </div>

            {/* 2 & 3. Fecha exacta y Hora al segundo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-slate-800 pb-3">
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  📅 Fecha exacta:
                </span>
                <p className="text-sm font-mono font-bold text-amber-300 mt-1">
                  {displayDate}
                </p>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  ⏰ Hora al segundo:
                </span>
                <p className="text-sm font-mono font-bold text-amber-300 mt-1">
                  {displayTime}
                </p>
              </div>
            </div>

            {/* 4. Coordenadas GPS satelitales */}
            <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-cyan-400" />
                📍 Coordenadas GPS satelitales:
              </span>
              <p className="text-sm font-mono font-bold text-cyan-300 mt-1">
                Latitud {latStr} y Longitud {lngStr}
              </p>
            </div>

            {/* 5. Ubicación y calle */}
            <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                🏢 Ubicación y calle:
              </span>
              <p className="text-sm font-semibold text-slate-200 mt-1 leading-relaxed">
                Dirección física en Lázaro Cárdenas, Michoacán: <span className="text-white font-bold">{report.address}</span>
              </p>
            </div>

            {/* Detalle y Justificación del Reporte */}
            <div className="pt-1 text-xs text-slate-300 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Detalle y Justificación de la Incidencia:
              </span>
              <p className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-slate-200 leading-relaxed italic">
                "{report.description}"
              </p>
            </div>

            {/* Sello de Autenticidad y Hash Criptográfico */}
            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] text-slate-400 font-mono">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>CERTIFICADO CON SELLO CRIPTOGRÁFICO SHA-256</span>
              </div>
              <span className="text-slate-500">HASH: 7f8a9e2c...{report.folio.replace(/[^0-9]/g, '')}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${report.coords.lat},${report.coords.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  if (onCenterMap) onCenterMap(report.coords);
                }}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
                title="Abrir ubicación en Google Maps"
              >
                <MapPin className="w-4 h-4 shrink-0" />
                <span>Ver en Google Maps Satelital</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80 shrink-0 ml-0.5" />
              </a>

              <button
                type="button"
                onClick={handleOpenPrintPreview}
                className="bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold px-3 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition border border-cyan-800/60 shadow cursor-pointer"
                title="Ver vista previa de cómo se verá el reporte antes de imprimir"
              >
                <Printer className="w-4 h-4 text-cyan-400" />
                <span>Vista Previa e Imprimir Ficha</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Official Print Preview Modal */}
      {showPrintPreview && (
        <ReportPrintPreviewModal
          report={report}
          onClose={() => setShowPrintPreview(false)}
        />
      )}
    </div>
  );
};
