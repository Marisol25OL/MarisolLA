import React, { useState } from 'react';
import { 
  TransitUnit, 
  TransitRoute, 
  MechanicalFailureAlert 
} from '../types';
import { 
  Radio, 
  Gauge, 
  Users, 
  Clock, 
  Wrench, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Send, 
  Bus,
  RefreshCw,
  Phone,
  MapPin
} from 'lucide-react';
import { toneGenerator, voiceService } from '../services/voiceAssistant';

interface DriverConsoleModuleProps {
  units: TransitUnit[];
  routes: TransitRoute[];
  onUnitUpdate: (unit: TransitUnit) => void;
  onAddReinforcementUnit: (routeId: string) => void;
}

export const DriverConsoleModule: React.FC<DriverConsoleModuleProps> = ({
  units,
  routes,
  onUnitUpdate,
  onAddReinforcementUnit,
}) => {
  const [driverUnitId, setDriverUnitId] = useState<string>(units[0]?.id || 'u-101');
  const [isGpsSharing, setIsGpsSharing] = useState<boolean>(true);
  const [driverPassengerCount, setDriverPassengerCount] = useState<number>(34);
  const [showMechanicalModal, setShowMechanicalModal] = useState<boolean>(false);
  const [faultType, setFaultType] = useState<MechanicalFailureAlert['faultType']>('frenos');
  const [faultDesc, setFaultDesc] = useState<string>('Pérdida de presión en línea de frenos sobre Av. Melchor Ocampo');
  const [recentFailureAlert, setRecentFailureAlert] = useState<MechanicalFailureAlert | null>(null);
  const [requestReinforcementSuccess, setRequestReinforcementSuccess] = useState<boolean>(false);

  const currentDriverUnit = units.find(u => u.id === driverUnitId) || units[0];
  const currentRoute = routes.find(r => r.id === currentDriverUnit?.routeId);

  const handleToggleGpsSharing = () => {
    const nextState = !isGpsSharing;
    setIsGpsSharing(nextState);
    toneGenerator.playSuccessBeep();
    voiceService.speak(
      nextState
        ? 'Transmisión GPS de unidad activada. Visible en tiempo real para usuarios.'
        : 'Transmisión GPS detenida.'
    );
  };

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
      timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      status: 'open',
    };

    setRecentFailureAlert(alert);
    setShowMechanicalModal(false);

    onUnitUpdate({
      ...currentDriverUnit,
      status: 'breakdown',
    });

    voiceService.speak(`Alerta mecánica de ${faultType} enviada a talleres y mesa de control.`);
  };

  const handleRequestBackupUnit = () => {
    toneGenerator.playSuccessBeep();
    if (currentRoute) {
      onAddReinforcementUnit(currentRoute.id);
    }
    setRequestReinforcementSuccess(true);
    setTimeout(() => setRequestReinforcementSuccess(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner - Driver Mode */}
      <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-950 border-2 border-amber-500/70 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-900/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shadow-amber-900/40 shrink-0">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500 text-slate-950 uppercase">
                  CONSOLA EXCLUSIVA DE OPERADOR
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  ENLACE ACTIVO
                </span>
              </div>
              <h3 className="text-xl font-black text-white mt-0.5">
                Panel de Control de Chofer de Combi
              </h3>
              <p className="text-xs text-slate-400">
                Monitoreo de odometría, aforo de pasaje y despacho de asistencia mecánica
              </p>
            </div>
          </div>

          {/* Unit Selector */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold text-slate-400 pl-2">Unidad:</span>
            <select
              value={driverUnitId}
              onChange={(e) => {
                setDriverUnitId(e.target.value);
                toneGenerator.playSuccessBeep();
              }}
              className="bg-slate-900 text-amber-300 font-mono font-bold text-xs px-3 py-2 rounded-xl border border-amber-900/60 focus:outline-none cursor-pointer"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.unitNumber} — {u.driverName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* GPS Broadcasting Toggle Switch */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isGpsSharing ? 'bg-emerald-400 animate-ping' : 'bg-red-500'}`} />
            <div>
              <span className="text-xs font-bold text-white block">
                Transmisión de Coordenadas Satelitales GPS
              </span>
              <p className="text-[11px] text-slate-400">
                {isGpsSharing 
                  ? 'Tu combi es visible para los pasajeros en el mapa satelital de Lázaro Cárdenas.' 
                  : 'Ubicación oculta temporalmente.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleGpsSharing}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
              isGpsSharing 
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40' 
                : 'bg-slate-800 text-slate-300 border border-slate-700'
            }`}
          >
            <span>{isGpsSharing ? '● Transmitiendo GPS (Activo)' : '○ Pausado'}</span>
          </button>
        </div>

        {/* Real-time Telemetry Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Speed */}
          <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Velocímetro Actual</span>
              <Gauge className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-3xl font-mono font-black text-cyan-400">
              {currentDriverUnit.speedKmH} <span className="text-sm font-normal text-slate-400">km/h</span>
            </p>
            <span className="text-[10px] text-emerald-400 font-mono">
              ✓ Límite urbano respetado (máx 45 km/h)
            </span>
          </div>

          {/* Passenger Aforo Control */}
          <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Pasajeros a Bordo</span>
              <Users className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-mono font-black text-amber-400">
                {driverPassengerCount} <span className="text-sm font-normal text-slate-400">/ 40</span>
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const next = Math.max(0, driverPassengerCount - 1);
                    setDriverPassengerCount(next);
                    onUnitUpdate({ ...currentDriverUnit, occupancyPercent: Math.round((next / 40) * 100) });
                  }}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-base flex items-center justify-center transition cursor-pointer"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const next = Math.min(50, driverPassengerCount + 1);
                    setDriverPassengerCount(next);
                    onUnitUpdate({ ...currentDriverUnit, occupancyPercent: Math.round((next / 40) * 100) });
                  }}
                  className="w-8 h-8 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base flex items-center justify-center transition cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
              <div 
                className={`h-full transition-all ${
                  driverPassengerCount > 38 ? 'bg-red-500' : driverPassengerCount > 30 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${Math.min(100, (driverPassengerCount / 40) * 100)}%` }}
              />
            </div>
          </div>

          {/* Route and ETA info */}
          <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Siguiente Parada</span>
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-base font-extrabold text-white truncate">
              {currentDriverUnit.nextStop}
            </p>
            <p className="text-xs font-mono text-purple-300">
              ETA: ~{currentDriverUnit.etaMinutes} minutos
            </p>
          </div>
        </div>

        {/* Route Details and Actions */}
        {currentRoute && (
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">Ruta Asignada:</span>
              <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: currentRoute.color }} />
                <span>{currentRoute.name}</span>
                <span className="text-xs text-cyan-300 font-mono">({currentRoute.code})</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Destino Base: {currentRoute.destination} • Frecuencia: cada {currentRoute.frequencyMinutes} min
              </p>
            </div>

            {/* Request Reinforcement Unit */}
            <button
              type="button"
              onClick={handleRequestBackupUnit}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition cursor-pointer"
            >
              <Bus className="w-4 h-4" />
              <span>Solicitar Combi de Refuerzo</span>
            </button>
          </div>
        )}

        {/* Success notification for reinforcement */}
        {requestReinforcementSuccess && (
          <div className="bg-emerald-950/80 border border-emerald-500 text-emerald-200 p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              Solicitud recibida: Se ha despachado una unidad de refuerzo para desahogar el pasaje de la ruta.
            </span>
          </div>
        )}

        {/* Emergency Mechanical Failure Box */}
        <div className="bg-red-950/40 border-2 border-red-800/80 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-red-400 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500 animate-bounce" />
              Botón de Emergencia: Reporte de Falla Mecánica
            </h4>
            <p className="text-xs text-red-200/80 max-w-xl">
              Emite una alerta inmediata con coordenadas GPS a la mesa de talleres mecánicos de ASIPONA y Protección Civil para asistencia vial en el puerto.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowMechanicalModal(true)}
            className="bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer shrink-0"
          >
            <Wrench className="w-4 h-4" />
            <span>Reportar Falla Mecánica</span>
          </button>
        </div>

        {/* Active Breakdown Alert Card if any */}
        {recentFailureAlert && (
          <div className="bg-slate-900 border border-red-500/60 rounded-2xl p-4 text-xs space-y-2">
            <div className="flex items-center justify-between text-red-400 font-bold">
              <span>ALERTA MECÁNICA EN CURSO: {recentFailureAlert.faultType.toUpperCase()}</span>
              <span>{recentFailureAlert.timestamp}</span>
            </div>
            <p className="text-slate-300 italic">"{recentFailureAlert.description}"</p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Taller mecánico municipal notificado · Unidad en estado de auxilio</span>
            </div>
          </div>
        )}
      </div>

      {/* ===================== MODAL: MECHANICAL FAILURE FORM ===================== */}
      {showMechanicalModal && (
        <div className="fixed inset-0 z-[2800] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-red-600/80 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-black text-red-400 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
                  Alerta de Falla Mecánica en Ruta
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Operador: {currentDriverUnit.driverName} • Unidad {currentDriverUnit.unitNumber}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowMechanicalModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1.5">
                  Selecciona el tipo de falla detectada:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['frenos', 'motor', 'neumaticos', 'electrico', 'transmision'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFaultType(type)}
                      className={`text-xs font-bold py-2.5 px-3 rounded-xl border capitalize text-left transition cursor-pointer ${
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
                <label className="font-bold text-slate-300 block mb-1">
                  Descripción del problema y punto de varamiento:
                </label>
                <textarea
                  value={faultDesc}
                  onChange={(e) => setFaultDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
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
                className="bg-red-600 hover:bg-red-500 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>CONFIRMAR Y DESPACHAR TALLER</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
