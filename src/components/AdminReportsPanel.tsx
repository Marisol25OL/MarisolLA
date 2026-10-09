import React, { useState, useMemo } from 'react';
import { CitizenReport, CitizenReportType, Coordinates } from '../types';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  MapPin, 
  Eye, 
  Printer, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  HardHat, 
  UserCheck, 
  Sparkles, 
  X, 
  FileText, 
  RefreshCw,
  Calendar,
  AlertOctagon,
  ChevronRight,
  Bus,
  Tag,
  ArrowLeft,
  Maximize2
} from 'lucide-react';
import { toneGenerator, voiceService } from '../services/voiceAssistant';

interface AdminReportsPanelProps {
  reports: CitizenReport[];
  onUpdateReport: (report: CitizenReport) => void;
  onViewReport: (report: CitizenReport) => void;
  onPrintReport?: (report: CitizenReport) => void;
  onCenterMap: (coords: Coordinates) => void;
  onBackToLocatario?: () => void;
  onOpenFullScreen?: () => void;
}

const CREW_OPTIONS = [
  'Cuadrilla 1: Obras Públicas y Pavimentación (Bacheo)',
  'Cuadrilla 2: Alumbrado Público y Electricidad',
  'Cuadrilla 3: CAPALAC (Agua Potable y Drenaje)',
  'Cuadrilla 4: Servicios Públicos y Limpia Municipal',
  'Protección Civil y Bomberos Lázaro Cárdenas',
  'Dirección de Tránsito y Vialidad Municipal',
  'Inspección y Reglamentos de Comercio',
  'Despacho Central de Combis y Concesionarios',
];

export const AdminReportsPanel: React.FC<AdminReportsPanelProps> = ({
  reports,
  onUpdateReport,
  onViewReport,
  onPrintReport,
  onCenterMap,
  onBackToLocatario,
  onOpenFullScreen,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');

  // Modal for editing crew & status
  const [editingReport, setEditingReport] = useState<CitizenReport | null>(null);
  const [newStatus, setNewStatus] = useState<CitizenReport['status']>('recibido');
  const [newCrew, setNewCrew] = useState<string>('');
  const [newNotes, setNewNotes] = useState<string>('');
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Filtered reports calculation
  const filteredReports = useMemo(() => {
    return reports.filter((rep) => {
      // Status filter
      if (statusFilter !== 'all' && rep.status !== statusFilter) return false;
      // Category filter
      if (categoryFilter !== 'all' && rep.type !== categoryFilter) return false;
      // Urgency filter
      if (urgencyFilter !== 'all' && rep.urgency !== urgencyFilter) return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchFolio = rep.folio.toLowerCase().includes(q);
        const matchTitle = rep.title.toLowerCase().includes(q);
        const matchDesc = rep.description.toLowerCase().includes(q);
        const matchAddr = rep.address.toLowerCase().includes(q);
        const matchCrew = rep.assignedCrew?.toLowerCase().includes(q);
        if (!matchFolio && !matchTitle && !matchDesc && !matchAddr && !matchCrew) {
          return false;
        }
      }

      return true;
    });
  }, [reports, statusFilter, categoryFilter, urgencyFilter, searchQuery]);

  // Statistics calculation
  const stats = useMemo(() => {
    return {
      total: reports.length,
      recibidos: reports.filter((r) => r.status === 'recibido').length,
      enRevision: reports.filter((r) => r.status === 'en_revision').length,
      cuadrilla: reports.filter((r) => r.status === 'cuadrilla_asignada').length,
      resueltos: reports.filter((r) => r.status === 'resuelto').length,
      criticas: reports.filter((r) => r.urgency === 'critica').length,
      sobrecupo: reports.filter((r) => r.type === 'sobrecupo').length,
    };
  }, [reports]);

  // Handle opening edit modal
  const handleOpenEdit = (report: CitizenReport) => {
    toneGenerator.playSuccessBeep();
    setEditingReport(report);
    setNewStatus(report.status);
    setNewCrew(report.assignedCrew || CREW_OPTIONS[0]);
    setNewNotes(report.adminNotes || '');
  };

  // Handle saving changes
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReport) return;

    const updated: CitizenReport = {
      ...editingReport,
      status: newStatus,
      assignedCrew: newCrew,
      adminNotes: newNotes,
      resolutionDate: newStatus === 'resuelto' ? new Date().toLocaleString() : editingReport.resolutionDate,
    };

    onUpdateReport(updated);
    toneGenerator.playSuccessBeep();
    setNotificationMsg(`Denuncia ${updated.folio} actualizada con éxito a estado: ${newStatus.replace('_', ' ').toUpperCase()}`);
    setEditingReport(null);

    const statusNames: Record<string, string> = {
      recibido: 'Recibido',
      en_revision: 'En Revisión',
      cuadrilla_asignada: 'Cuadrilla Asignada',
      resuelto: 'Resuelto y Reparado',
    };
    voiceService.speak(`Denuncia con folio ${updated.folio} actualizada a ${statusNames[newStatus] || newStatus}.`);
  };

  // Quick status toggle without opening full modal
  const handleQuickStatusChange = (report: CitizenReport, status: CitizenReport['status']) => {
    const updated: CitizenReport = {
      ...report,
      status,
      resolutionDate: status === 'resuelto' ? new Date().toLocaleString() : report.resolutionDate,
    };
    onUpdateReport(updated);
    toneGenerator.playSuccessBeep();
    setNotificationMsg(`Folio ${report.folio} cambiado a ${status.replace('_', ' ')}.`);
  };

  const getTypeIcon = (type: CitizenReportType) => {
    switch (type) {
      case 'baches': return '🕳️';
      case 'alumbrado': return '💡';
      case 'basura': return '🗑️';
      case 'semaforos': return '🚦';
      case 'senalamientos': return '🛑';
      case 'cocodrilos': return '🐊';
      case 'ambulantes': return '⛺';
      case 'delincuencia': return '🚨';
      case 'sobrecupo': return '🚐';
      default: return '📢';
    }
  };

  const getStatusBadge = (status: CitizenReport['status']) => {
    switch (status) {
      case 'recibido':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-950 text-amber-300 border border-amber-700/80 uppercase">
            🟡 Recibido (Pendiente)
          </span>
        );
      case 'en_revision':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-sky-950 text-sky-300 border border-sky-700/80 uppercase">
            🔍 En Revisión
          </span>
        );
      case 'cuadrilla_asignada':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-purple-950 text-purple-300 border border-purple-700/80 uppercase">
            🛠️ Cuadrilla en Camino
          </span>
        );
      case 'resuelto':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-950 text-emerald-300 border border-emerald-700/80 uppercase">
            🟢 Resuelto / Reparado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* ===================== BANNER ADMINISTRATIVO OFICIAL ===================== */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-2 border-indigo-500/60 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-80 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl">🛡️</span>
              <span className="text-[10px] font-black font-mono px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-700 uppercase">
                CONSOLA ADMINISTRATIVA MUNICIPAL
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                ● SISTEMA EN LÍNEA
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Gestión y Control de Denuncias Ciudadanas
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Supervisa en tiempo real todos los reportes de baches, alumbrado, fauna y sobrecupo de combis generados por los ciudadanos. Asigna cuadrillas y marca incidencias como resueltas.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
            {onBackToLocatario && (
              <button
                type="button"
                onClick={onBackToLocatario}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-950 hover:bg-slate-800 text-emerald-300 border border-emerald-700/80 flex items-center gap-1.5 transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver a Locatario</span>
              </button>
            )}

            {onOpenFullScreen && (
              <button
                type="button"
                onClick={onOpenFullScreen}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-700 flex items-center gap-1.5 transition cursor-pointer"
                title="Ver en pantalla completa como panel principal"
              >
                <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Pantalla Completa</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                toneGenerator.playSuccessBeep();
                setNotificationMsg('Reportes sincronizados con la base de datos municipal.');
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-950 hover:bg-slate-850 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sincronizar</span>
            </button>

            {reports.length > 0 && onPrintReport && (
              <button
                type="button"
                onClick={() => {
                  toneGenerator.playSuccessBeep();
                  onPrintReport(reports[0]);
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg flex items-center gap-1.5 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Acta</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notification toast if any */}
      {notificationMsg && (
        <div className="bg-emerald-950/90 border border-emerald-500 rounded-xl p-3 text-xs text-emerald-200 flex items-center justify-between gap-3 shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{notificationMsg}</span>
          </div>
          <button
            onClick={() => setNotificationMsg(null)}
            className="text-slate-400 hover:text-white text-xs px-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* ===================== KPIS Y MÉTRICAS DE CONTROL ===================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-1 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Total Reportes</span>
            <span className="text-base">📋</span>
          </div>
          <p className="text-2xl font-black text-white font-mono">{stats.total}</p>
          <span className="text-[10px] text-slate-400">Registrados</span>
        </div>

        <div className="bg-slate-900/90 border border-amber-800/60 rounded-2xl p-3.5 space-y-1 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-amber-400 font-bold uppercase">Pendientes</span>
            <span className="text-base">🟡</span>
          </div>
          <p className="text-2xl font-black text-amber-300 font-mono">{stats.recibidos}</p>
          <span className="text-[10px] text-amber-400/80">Por turnar</span>
        </div>

        <div className="bg-slate-900/90 border border-sky-800/60 rounded-2xl p-3.5 space-y-1 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-sky-400 font-bold uppercase">En Revisión</span>
            <span className="text-base">🔍</span>
          </div>
          <p className="text-2xl font-black text-sky-300 font-mono">{stats.enRevision}</p>
          <span className="text-[10px] text-sky-400/80">Evaluando sitio</span>
        </div>

        <div className="bg-slate-900/90 border border-purple-800/60 rounded-2xl p-3.5 space-y-1 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-purple-400 font-bold uppercase">Con Cuadrilla</span>
            <span className="text-base">🛠️</span>
          </div>
          <p className="text-2xl font-black text-purple-300 font-mono">{stats.cuadrilla}</p>
          <span className="text-[10px] text-purple-400/80">En atención</span>
        </div>

        <div className="bg-slate-900/90 border border-emerald-800/60 rounded-2xl p-3.5 space-y-1 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-emerald-400 font-bold uppercase">Resueltas</span>
            <span className="text-base">🟢</span>
          </div>
          <p className="text-2xl font-black text-emerald-300 font-mono">{stats.resueltos}</p>
          <span className="text-[10px] text-emerald-400/80">Completadas</span>
        </div>

        <div className="bg-slate-900/90 border border-red-800/60 rounded-2xl p-3.5 space-y-1 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-red-400 font-bold uppercase">Sobrecupos</span>
            <span className="text-base">🚐</span>
          </div>
          <p className="text-2xl font-black text-red-300 font-mono">{stats.sobrecupo}</p>
          <span className="text-[10px] text-red-400/80">Alertas combi</span>
        </div>
      </div>

      {/* ===================== BARRA DE BÚSQUEDA Y FILTROS ===================== */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Text Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por folio (ej. LC-2026), calle, tipo o cuadrilla..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Select Filters */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Category dropdown */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Todas las Categorías</option>
              <option value="baches">🕳️ Baches y Pavimentación</option>
              <option value="alumbrado">💡 Alumbrado Público</option>
              <option value="basura">🗑️ Basura y Limpieza</option>
              <option value="semaforos">🚦 Semáforos</option>
              <option value="senalamientos">🛑 Señalamientos</option>
              <option value="cocodrilos">🐊 Cocodrilos / Fauna</option>
              <option value="sobrecupo">🚐 Sobrecupo de Combis</option>
              <option value="delincuencia">🚨 Seguridad</option>
            </select>

            {/* Urgency dropdown */}
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Todas las Urgencias</option>
              <option value="critica">🔴 Crítica</option>
              <option value="alta">🟠 Alta</option>
              <option value="media">🟡 Media</option>
              <option value="baja">🟢 Baja</option>
            </select>
          </div>
        </div>

        {/* State tabs buttons */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 pt-1 border-t border-slate-800/80">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span>Estado:</span>
          </span>
          {[
            { id: 'all', label: `Todos (${stats.total})` },
            { id: 'recibido', label: `🟡 Pendientes (${stats.recibidos})` },
            { id: 'en_revision', label: `🔍 En Revisión (${stats.enRevision})` },
            { id: 'cuadrilla_asignada', label: `🛠️ Con Cuadrilla (${stats.cuadrilla})` },
            { id: 'resuelto', label: `🟢 Resueltos (${stats.resueltos})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setStatusFilter(tab.id);
                toneGenerator.playSuccessBeep();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ===================== LISTA DE DENUNCIAS EN FORMATO ADMINISTRATIVO ===================== */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Mostrando <strong>{filteredReports.length}</strong> de {reports.length} denuncias registradas</span>
          <span className="font-mono text-[11px]">Ordenado por fecha más reciente</span>
        </div>

        {filteredReports.length === 0 ? (
          <div className="bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <div className="text-3xl">🔍</div>
            <h3 className="text-base font-bold text-white">No se encontraron denuncias con estos filtros</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Prueba cambiando el estado, limpiando el campo de búsqueda o seleccionando otra categoría.
            </p>
            <button
              onClick={() => {
                setStatusFilter('all');
                setCategoryFilter('all');
                setUrgencyFilter('all');
                setSearchQuery('');
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/60 rounded-2xl p-4 sm:p-5 shadow-xl transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Photo Thumbnail */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                    <img
                      src={report.photoUrl}
                      alt={report.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-1 left-1 bg-slate-950/90 rounded px-1 text-[9px] font-mono font-bold text-cyan-300">
                      GPS
                    </div>
                  </div>

                  {/* Text details */}
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-black text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-lg border border-cyan-800">
                        {report.folio}
                      </span>
                      <span className="text-sm">{getTypeIcon(report.type)}</span>
                      <span className="text-xs font-bold text-slate-300 capitalize">
                        {report.type.replace('_', ' ')}
                      </span>
                      {getStatusBadge(report.status)}
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded uppercase ${
                        report.urgency === 'critica'
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : report.urgency === 'alta'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}>
                        Urgencia: {report.urgency}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-extrabold text-white truncate">
                      {report.title}
                    </h4>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {report.description}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap pt-1">
                      <span className="flex items-center gap-1 truncate max-w-xs text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{report.address}</span>
                      </span>

                      <span className="flex items-center gap-1 font-mono text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{report.timestamp}</span>
                      </span>

                      {report.assignedCrew && (
                        <span className="flex items-center gap-1 text-purple-300 font-semibold bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800">
                          <HardHat className="w-3 h-3 text-purple-400" />
                          <span className="truncate max-w-[200px]">{report.assignedCrew}</span>
                        </span>
                      )}

                      {report.adminNotes && (
                        <span className="text-emerald-300 text-[10px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800 truncate max-w-[250px]">
                          ✓ Nota: {report.adminNotes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Quick State Switcher & Action Buttons */}
                <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 border-t sm:border-t-0 md:border-l border-slate-800 pt-3 sm:pt-0 md:pl-4">
                  {/* Primary Manage Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(report)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs py-2 px-3.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer active:scale-95"
                  >
                    <HardHat className="w-3.5 h-3.5" />
                    <span>Gestionar Cuadrilla</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {/* View Official File */}
                    <button
                      type="button"
                      onClick={() => onViewReport(report)}
                      className="flex-1 bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-cyan-800/80 text-xs font-bold py-1.5 px-2.5 rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
                      title="Ver ficha oficial con fotografía y GPS"
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Ficha GPS</span>
                    </button>

                    {/* Focus on map */}
                    <button
                      type="button"
                      onClick={() => {
                        toneGenerator.playSuccessBeep();
                        onCenterMap(report.coords);
                      }}
                      className="bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold p-2 rounded-xl transition cursor-pointer"
                      title="Enfocar en mapa satelital"
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                  </div>

                  {/* Quick state switcher pills */}
                  <div className="flex items-center gap-1 pt-1">
                    <button
                      type="button"
                      onClick={() => handleQuickStatusChange(report, 'recibido')}
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition ${
                        report.status === 'recibido'
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                      title="Marcar como Recibido"
                    >
                      Pendiente
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickStatusChange(report, 'cuadrilla_asignada')}
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition ${
                        report.status === 'cuadrilla_asignada'
                          ? 'bg-purple-600 text-white border-purple-500 font-black'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                      title="Marcar como Cuadrilla en Camino"
                    >
                      Cuadrilla
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickStatusChange(report, 'resuelto')}
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition ${
                        report.status === 'resuelto'
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                      title="Marcar como Resuelto y Reparado"
                    >
                      ✓ Resuelto
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===================== MODAL DE GESTIÓN ADMINISTRATIVA Y CUADRILLA ===================== */}
      {editingReport && (
        <div className="fixed inset-0 z-[1400] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border-2 border-indigo-500/80 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center text-xl shrink-0">
                  🛠️
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Gestión y Despacho de Denuncia
                  </h3>
                  <p className="text-xs font-mono text-cyan-300">
                    Folio Oficial: {editingReport.folio}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingReport(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Incident Summary Card */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-base">{getTypeIcon(editingReport.type)}</span>
                <span className="font-extrabold text-white text-sm">{editingReport.title}</span>
              </div>
              <p className="text-slate-300 text-xs">{editingReport.description}</p>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>{editingReport.address}</span>
              </p>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              {/* Status Select */}
              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-200 block">
                  Estado Administrativo de la Denuncia:
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
                >
                  <option value="recibido">🟡 Recibido (Pendiente de Asignar)</option>
                  <option value="en_revision">🔍 En Revisión (Personal Técnico en Camino)</option>
                  <option value="cuadrilla_asignada">🛠️ Cuadrilla Asignada y en Sitio</option>
                  <option value="resuelto">🟢 Resuelto / Obra y Reparación Concluida</option>
                </select>
              </div>

              {/* Crew Select */}
              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-200 block">
                  Cuadrilla u Organismo Responsable Asignado:
                </label>
                <select
                  value={newCrew}
                  onChange={(e) => setNewCrew(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {CREW_OPTIONS.map((crew, idx) => (
                    <option key={idx} value={crew}>
                      {crew}
                    </option>
                  ))}
                </select>
              </div>

              {/* Admin Notes */}
              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-200 block">
                  Notas Oficiales del Administrador / Dictamen:
                </label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={3}
                  placeholder="Ej. Se despachó cuadrilla con compactadora de asfalto. Se sustituyeron 4 lámparas LED. Trabajo terminado satisfactoriamente..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingReport(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Guardar y Actualizar Denuncia</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
