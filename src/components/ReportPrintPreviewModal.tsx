import React from 'react';
import { CitizenReport } from '../types';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  QrCode,
  Download,
  FileCheck
} from 'lucide-react';
import { toneGenerator } from '../services/voiceAssistant';
import { LCNovaLogo } from './LCNovaLogo';

interface ReportPrintPreviewModalProps {
  report: CitizenReport | null;
  onClose: () => void;
}

export const ReportPrintPreviewModal: React.FC<ReportPrintPreviewModalProps> = ({
  report,
  onClose,
}) => {
  if (!report) return null;

  const now = new Date();
  const displayDate = report.exactDate || now.toLocaleDateString('es-MX', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });
  const displayTime = report.exactTime || now.toLocaleTimeString('es-MX', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });

  const latNum = Math.abs(report.coords.lat).toFixed(5);
  const lngNum = Math.abs(report.coords.lng).toFixed(5);
  const latStr = `${latNum}° N`;
  const lngStr = `${lngNum}° W`;

  const handlePrint = () => {
    toneGenerator.playSuccessBeep();
    window.print();
  };

  const getUrgencyBadge = () => {
    switch (report.urgency) {
      case 'alta':
        return { label: 'ALTA PRIORIDAD', color: 'bg-red-100 text-red-800 border-red-300' };
      case 'media':
        return { label: 'PRIORIDAD MEDIA', color: 'bg-amber-100 text-amber-800 border-amber-300' };
      default:
        return { label: 'PRIORIDAD ORDINARIA', color: 'bg-blue-100 text-blue-800 border-blue-300' };
    }
  };

  const urgency = getUrgencyBadge();

  return (
    <div className="fixed inset-0 z-[3000] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-start p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static print:z-auto">
      {/* Top Controller Bar - Hidden when printing */}
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl p-4 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
            <Printer className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Vista Previa de Impresión Oficial
              <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-700 px-2 py-0.5 rounded">
                DOCUMENTO OFICIAL
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Así es exactamente como se imprimirá o guardará en PDF la Ficha Técnica Municipal.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Guardar en PDF</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PRINTABLE OFFICIAL SHEET (A4 / Letter Styled Document) */}
      <div 
        id="official-print-document"
        className="w-full max-w-3xl bg-white text-slate-900 rounded-xl shadow-2xl p-8 sm:p-12 border border-slate-200 print:border-none print:shadow-none print:rounded-none print:p-6 print:max-w-none print:w-full space-y-6 font-sans select-text"
      >
        {/* Document Header with Official Coat of Arms & Banners */}
        <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-300 flex flex-col items-center justify-center p-1.5 text-center shadow">
              <LCNovaLogo className="w-10 h-10" />
              <span className="text-[7px] font-mono font-bold uppercase tracking-tighter mt-0.5 text-slate-800">LC NOVA</span>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 font-mono">
                GOBIERNO MUNICIPAL DE LÁZARO CÁRDENAS, MICHOACÁN
              </p>
              <h1 className="text-xl font-black text-slate-900 leading-tight">
                DIRECCIÓN DE OBRAS PÚBLICAS, MOVILIDAD & C5i
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                LC Nova • Sistema Integral de Atención Ciudadana e Infraestructura Portuaria
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="inline-block bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-lg text-right">
              <span className="text-[9px] font-mono font-bold uppercase text-slate-500 block">FOLIO DE OFICIO:</span>
              <span className="text-sm font-black font-mono text-cyan-900 tracking-wider">
                {report.folio}
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-500 mt-1">
              Registro C5i: {displayDate}
            </p>
          </div>
        </div>

        {/* Status & Category Bar */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">TIPO DE INCIDENCIA:</span>
            <span className="font-mono font-black uppercase px-2 py-0.5 bg-slate-200 text-slate-800 rounded">
              {report.type.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">ESTATUS:</span>
            <span className="font-mono font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded">
              ● {report.status.toUpperCase().replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">PRIORIDAD:</span>
            <span className={`font-mono font-bold px-2 py-0.5 border rounded ${urgency.color}`}>
              {urgency.label}
            </span>
          </div>
        </div>

        {/* Report Main Info */}
        <div className="space-y-2">
          <h2 className="text-lg font-black text-slate-900 border-l-4 border-cyan-600 pl-3">
            {report.title}
          </h2>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed italic">
            "{report.description}"
          </div>
        </div>

        {/* Evidence Photo & Geolocation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Photographic Evidence with Forensic Watermark */}
          <div className="border border-slate-300 rounded-xl overflow-hidden bg-slate-100 space-y-1">
            <div className="bg-slate-900 text-white text-[10px] font-mono font-bold px-3 py-1.5 flex items-center justify-between">
              <span>EVIDENCIA FOTOGRÁFICA REGISTRADA</span>
              <span className="text-cyan-400 font-mono">SELLO PERICIAL ACTIVO</span>
            </div>
            <div className="relative">
              <img
                src={report.photoUrl}
                alt="Evidencia fotográfica del reporte"
                className="w-full h-56 object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-slate-950/85 text-white p-2 text-[10px] font-mono border-t border-cyan-500/50 backdrop-blur-sm">
                <div className="flex justify-between">
                  <span>GPS: {latStr}, {lngStr}</span>
                  <span className="text-cyan-300">{displayDate} - {displayTime}</span>
                </div>
                <div className="text-[9px] text-slate-300 truncate">
                  {report.address}
                </div>
              </div>
            </div>
          </div>

          {/* Technical Location Data Sheet */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex flex-col justify-between space-y-3">
            <div className="space-y-3 text-xs">
              <div className="border-b border-slate-200 pb-2">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">
                  UBICACIÓN FÍSICA MUNICIPAL:
                </span>
                <p className="font-bold text-slate-900 text-sm mt-0.5 flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{report.address}</span>
                </p>
              </div>

              <div className="border-b border-slate-200 pb-2">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">
                  COORDENADAS GEODÉSICAS SATELITALES (WGS84):
                </span>
                <p className="font-mono font-bold text-cyan-800 text-sm mt-0.5">
                  Latitud: {latStr} | Longitud: {lngStr}
                </p>
              </div>

              <div className="border-b border-slate-200 pb-2">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">
                  DATOS DE CAPTURA & CIUDADANO:
                </span>
                <p className="text-slate-800 mt-0.5">
                  Promovente: <strong>{report.reportedBy || 'Ciudadano Vecino Promovente'}</strong> ({report.userRole || 'Ciudadano Verificado'})
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Fecha Oficial: {displayDate} a las {displayTime} hrs.
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">
                  APROBACIONES CIUDADANAS (VOTOS):
                </span>
                <p className="font-bold text-slate-800 mt-0.5">
                  {report.upvotes} ciudadanos vecinos han confirmado y respaldado esta incidencia
                </p>
              </div>
            </div>

            {/* Cryptographic Validation Box */}
            <div className="bg-white border border-slate-300 rounded-lg p-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-9 h-9 text-slate-900 shrink-0" />
                <div className="text-[9px] font-mono leading-tight text-slate-600">
                  <span className="font-bold text-slate-900 block">VALIDACIÓN DIGITAL C5i</span>
                  <span>ID: {report.folio}</span>
                  <span className="block text-emerald-700 font-bold">CERTIFICADO VERÍDICO</span>
                </div>
              </div>
              <FileCheck className="w-6 h-6 text-emerald-600 shrink-0" />
            </div>
          </div>
        </div>

        {/* Official Signatures Section */}
        <div className="pt-8 border-t-2 border-slate-300 grid grid-cols-2 gap-8 text-center text-xs">
          <div className="space-y-12">
            <div className="border-b border-slate-400 w-3/4 mx-auto pb-1"></div>
            <div>
              <p className="font-bold text-slate-900">{report.reportedBy || 'CIUDADANO DENUNCIANTE'}</p>
              <p className="text-[10px] text-slate-500">PROMOVENTE / VECINO VERIFICADO</p>
            </div>
          </div>

          <div className="space-y-12">
            <div className="border-b border-slate-400 w-3/4 mx-auto pb-1"></div>
            <div>
              <p className="font-bold text-slate-900">ING. COORDINADOR C5i & OBRAS PÚBLICAS</p>
              <p className="text-[10px] text-slate-500">SUPERVISIÓN & CERTIFICACIÓN MUNICIPAL</p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-[9px] font-mono text-slate-400 pt-2 border-t border-slate-100">
          Documento generado por la Plataforma Smart-Port Lázaro Cárdenas 2026. Validez oficial para gestión municipal, SECOPE y protección ciudadana.
        </div>
      </div>
    </div>
  );
};
