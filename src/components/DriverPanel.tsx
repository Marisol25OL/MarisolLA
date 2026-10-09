import React, { useState } from 'react';
import { 
  TransitRoute, 
  TransitUnit, 
  MechanicalFailureAlert,
  Coordinates 
} from '../types';
import { 
  Bus, 
  Radio, 
  Users, 
  AlertTriangle, 
  Wrench, 
  ShieldAlert, 
  Sparkles, 
  RotateCcw, 
  Send, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Plus, 
  Minus, 
  Navigation,
  Gauge,
  PhoneCall,
  Activity
} from 'lucide-react';
import { SmartMap } from './SmartMap';
import { toneGenerator, voiceService } from '../services/voiceAssistant';
import { offlineManager } from '../services/offlineSync';

interface DriverPanelProps {
  routes: TransitRoute[];
  units: TransitUnit[];
  onUnitUpdate: (unit: TransitUnit) => void;
  onAddReinforcementUnit: (routeId: string) => void;
  userLocation: Coordinates;
}

export const DriverPanel: React.FC<DriverPanelProps> = ({
  routes,
  units,
  onUnitUpdate,
  onAddReinforcementUnit,
  userLocation,
}) => {
  // Selected driver unit (default to first unit LC-101)
  const [selectedUnitId, setSelectedUnitId] = useState<string>(units[0]?.id || 'u-101');
  const currentUnit = units.find(u => u.id === selectedUnitId) || units[0];
  const assignedRoute = routes.find(r => r.id === currentUnit?.routeId) || routes[0];

  // Driver operational states
  const [isGpsTransmitting, setIsGpsTransmitting] = useState<boolean>(true);
  const [shiftStatus, setShiftStatus] = useState<'activo' | 'terminal' | 'mantenimiento'>('activo');
  const [passengersCount, setPassengersCount] = useState<number>(24);
  const maxCapacity = 40;
  const occupancyPercent = Math.min(100, Math.round((passengersCount / maxCapacity) * 100));

  // Mechanical failure modal
  const [showMechanicalModal, setShowMechanicalModal] = useState<boolean>(false);
  const [faultType, setFaultType] = useState<MechanicalFailureAlert['faultType']>('frenos');
  const [faultDesc, setFaultDesc] = useState<string>('Pérdida de presión en frenos sobre Av. Melchor Ocampo');
  const [recentFailureAlert, setRecentFailureAlert] = useState<MechanicalFailureAlert | null>(null);

  // Reinforcement feedback
  const [reinforceFeedback, setReinforceFeedback] = useState<string | null>(null);

  // Passenger adjustment helpers
  const handleAdjustPassengers = (delta: number) => {
    const updated = Math.max(0, Math.min(maxCapacity + 10, passengersCount + delta));
    setPassengersCount(updated);
    toneGenerator.playSuccessBeep();

    if (currentUnit) {
      onUnitUpdate({
        ...currentUnit,
        occupancyPercent: Math.min(100, Math.round((updated / maxCapacity) * 100)),
        lastUpdated: 'Justo ahora',
      });
    }
  };

  // Submit Mechanical Failure Alert
  const handleReportBreakdown = () => {
    toneGenerator.playAlertBeep();
    const alert: MechanicalFailureAlert = {
      id: 'fail-' + Date.now(),
      unitId: currentUnit.id,
      driverName: currentUnit.driverName,
      routeId: currentUnit.routeId,
      faultType,
      description: faultDesc,
      coords: currentUnit.coords,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'dispatched_mechanic',
    };

    onUnitUpdate({
      ...currentUnit,
      status: 'breakdown',
      lastUpdated: 'ALERTA DE EMERGENCIA EMITIDA',
    });

    if (!offlineManager.isOnline()) {
      offlineManager.enqueueItem('mechanical_failure', alert);
    }

    setRecentFailureAlert(alert);
    setShowMechanicalModal(false);
    voiceService.speak(`Alerta mecánica de ${faultType} enviada a central de talleres de Lázaro Cárdenas.`);
  };

  // Request Route Reinforcement from dispatcher
  const handleRequestReinforcement = () => {
    onAddReinforcementUnit(assignedRoute.id);
    setReinforceFeedback(`¡Solicitud enviada! Central despachó unidad de apoyo a la ruta ${assignedRoute.code}.`);
    toneGenerator.playSuccessBeep();
    voiceService.speak('Unidad de refuerzo solicitada a central para desahogo de ruta.');
    setTimeout(() => setReinforceFeedback(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Driver Header & Unit Selector */}
      <div className="bg-slate-900 border border-cyan-800/80 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 flex items-center justify-center font-black shadow-lg">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  Panel de Control del Chofer & Operador
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  ● EN CABINA
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Consola oficial de telemetría GPS, control de aforo y auxilio vial de combis de Lázaro Cárdenas
              </p>
            </div>
          </div>

          {/* Unit Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Mi Unidad:</span>
            <select
              value={selectedUnitId}
              onChange={(e) => setSelectedUnitId(e.target.value)}
              className="bg-slate-950 border border-cyan-700/80 text-cyan-300 font-mono font-bold text-xs rounded-xl px-3 py-2 focus:outline-none"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.unitNumber} - {u.driverName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Unit Details Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800 text-xs">
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Ruta Asignada</span>
            <p className="font-bold text-white flex items-center gap-1.5 mt-0.5">
              <span 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: assignedRoute.color }} 
              />
              {assignedRoute.code}: {assignedRoute.name}
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Operador Oficial</span>
            <p className="font-bold text-slate-200 mt-0.5 truncate">{currentUnit.driverName}</p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Velocidad Actual</span>
            <p className="font-bold text-cyan-400 font-mono text-sm mt-0.5">
              {currentUnit.speedKmH} km/h
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Próxima Parada</span>
            <p className="font-bold text-emerald-400 truncate mt-0.5">{currentUnit.nextStop}</p>
          </div>
        </div>
      </div>

      {/* Main Operational Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Passenger Counter & Real-Time Aforo */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <Users className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-sm font-bold text-white">Contador de Pasaje & Aforo</h3>
                <p className="text-[11px] text-slate-400">Actualiza el conteo de pasajeros en tiempo real</p>
              </div>
            </div>

            <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${
              occupancyPercent >= 90
                ? 'bg-red-950 text-red-300 border-red-700 animate-pulse'
                : occupancyPercent >= 70
                ? 'bg-amber-950 text-amber-300 border-amber-700'
                : 'bg-emerald-950 text-emerald-300 border-emerald-700'
            }`}>
              {occupancyPercent}% OCUPACIÓN
            </span>
          </div>

          {/* Passenger Big Counter */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-center space-y-3">
            <span className="text-xs text-slate-400 font-semibold block">
              Pasajeros a bordo actualmente
            </span>
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => handleAdjustPassengers(-1)}
                className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xl flex items-center justify-center transition active:scale-95 shadow cursor-pointer"
                title="Bajar 1 pasajero"
              >
                <Minus className="w-5 h-5" />
              </button>

              <div className="font-mono font-black text-4xl sm:text-5xl text-white min-w-[100px]">
                {passengersCount}
                <span className="text-xs font-sans text-slate-400 block font-normal mt-1">
                  de {maxCapacity} asientos
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleAdjustPassengers(1)}
                className="w-12 h-12 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xl flex items-center justify-center transition active:scale-95 shadow cursor-pointer"
                title="Subir 1 pasajero"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Quick buttons */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleAdjustPassengers(-5)}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-700"
              >
                -5 Pasajeros
              </button>
              <button
                type="button"
                onClick={() => handleAdjustPassengers(5)}
                className="bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs px-3 py-1.5 rounded-lg border border-slate-700 font-bold"
              >
                +5 Pasajeros
              </button>
              <button
                type="button"
                onClick={() => setPassengersCount(0)}
                className="bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs px-3 py-1.5 rounded-lg border border-slate-700"
              >
                Vaciar (0)
              </button>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-850 h-2.5 rounded-full overflow-hidden mt-3">
              <div 
                className={`h-full transition-all duration-300 ${
                  occupancyPercent >= 90 
                    ? 'bg-red-500' 
                    : occupancyPercent >= 70 
                    ? 'bg-amber-400' 
                    : 'bg-cyan-400'
                }`}
                style={{ width: `${Math.min(100, occupancyPercent)}%` }}
              />
            </div>
          </div>

          {/* GPS Telemetry & Shift status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Radio className={`w-3.5 h-3.5 ${isGpsTransmitting ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
                  Transmisión GPS
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsGpsTransmitting(!isGpsTransmitting);
                    toneGenerator.playSuccessBeep();
                  }}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition ${
                    isGpsTransmitting 
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' 
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isGpsTransmitting ? 'TRANSMITIENDO' : 'PAUSADO'}
                </button>
              </div>
              <p className="text-[10px] text-slate-400">
                Los pasajeros en la app ven la combi acercándose en tiempo real.
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  Estado de Turno
                </span>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {shiftStatus.toUpperCase()}
                </span>
              </div>
              <div className="flex gap-1.5 pt-1">
                {(['activo', 'terminal', 'mantenimiento'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      setShiftStatus(st);
                      toneGenerator.playSuccessBeep();
                    }}
                    className={`text-[10px] flex-1 py-1 rounded font-bold transition capitalize ${
                      shiftStatus === st
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Emergency & Dispatch Actions */}
        <div className="space-y-4">
          {/* Mechanical Failure Card */}
          <div className="bg-gradient-to-br from-red-950/40 via-slate-900 to-slate-900 border-2 border-red-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 border border-red-500/40 flex items-center justify-center font-bold">
                  <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Alerta de Falla Mecánica / Auxilio Vial</h3>
                  <p className="text-xs text-slate-400">
                    Notifica de inmediato a taller y despacho si tu unidad presenta falla
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              En caso de falla de frenos, motor, neumáticos o sistema eléctrico sobre la marcha, emite una alerta con geolocalización automática para envío de grúa o unidad de relevo.
            </p>

            <button
              type="button"
              onClick={() => setShowMechanicalModal(true)}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition transform active:scale-98 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>EMITIR ALERTA MECÁNICA A TALLER</span>
            </button>

            {recentFailureAlert && (
              <div className="bg-red-950/80 border border-red-700 rounded-xl p-3 text-xs text-red-200 flex items-center justify-between">
                <div>
                  <span className="font-bold block">Alerta en curso: {recentFailureAlert.faultType.toUpperCase()}</span>
                  <span className="text-[10px] text-red-300">Hora: {recentFailureAlert.timestamp} • Estatus: Mecánico en camino</span>
                </div>
                <span className="bg-red-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded">
                  DESPACHADO
                </span>
              </div>
            )}
          </div>

          {/* Request Reinforcement Unit Card */}
          <div className="bg-slate-900 border border-cyan-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Solicitar Unidad de Refuerzo</h3>
                <p className="text-xs text-slate-400">
                  Si tu ruta presenta saturación o paradas llenas
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              Despacha automáticamente una unidad extra a la ruta <strong className="text-cyan-300">{assignedRoute.code}</strong> para desahogar la afluencia de trabajadores y turistas.
            </p>

            {reinforceFeedback && (
              <div className="bg-emerald-950/80 border border-emerald-700 rounded-xl p-3 text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{reinforceFeedback}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleRequestReinforcement}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
            >
              <Bus className="w-4 h-4" />
              <span>PEDIR UNIDAD DE REFUERZO A CENTRAL</span>
            </button>
          </div>
        </div>
      </div>

      {/* Driver Compact Satellite Map for Route Navigation */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              Navegación de Ruta en Tiempo Real: {assignedRoute.name}
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Paradas programadas: {assignedRoute.stops.length}
          </span>
        </div>

        <div className="h-[260px] rounded-xl overflow-hidden border border-slate-800">
          <SmartMap
            routes={routes}
            units={units}
            safetyZones={[]}
            safePoints={[]}
            reports={[]}
            selectedRouteId={assignedRoute.id}
            activeLayers={{
              routes: true,
              buses: true,
              safetySemaforo: false,
              safePoints: false,
              reports: false,
            }}
            highlightCoords={currentUnit.coords}
            userLocationCoords={userLocation}
          />
        </div>
      </div>

      {/* MODAL: MECHANICAL FAILURE FORM */}
      {showMechanicalModal && (
        <div className="fixed inset-0 z-[2000] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
                  Reporte Oficial de Falla Mecánica
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Operador: {currentUnit.driverName} • Unidad {currentUnit.unitNumber}
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
                  Descripción del problema:
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
                <span>CONFIRMAR Y SOLICITAR TALLER</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
