import React, { useState } from 'react';
import { 
  TransitRoute, 
  TransitUnit, 
  Coordinates,
  CitizenReport
} from '../types';
import { 
  Bus, 
  Users, 
  Radio, 
  MapPin, 
  ChevronDown,
  ChevronUp,
  Navigation,
  Route,
  LocateFixed
} from 'lucide-react';
import { toneGenerator, voiceService } from '../services/voiceAssistant';

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
  // Collapsible Routes View State
  const [isRoutesOpen, setIsRoutesOpen] = useState<boolean>(false);

  return (
    <div className="space-y-6">
      {/* Mobility Header - Pasajero & Turista */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-white">
                Movilidad Urbana & Combis en Tiempo Real
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                ● GPS ACTIVO
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Rutas troncales Centro - Guacamayas, Siderúrgica / ASIPONA y Playa Azul • Tarifa oficial: $12.00 MXN
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 font-mono text-cyan-300">
            {units.length} unidades activas
          </span>
        </div>
      </div>

      {/* ===================== CONTENIDO PRINCIPAL PASAJERO ===================== */}
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

          {/* 2. REAL-TIME UNITS MONITOR */}
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

              <span className="text-xs font-mono text-cyan-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                {units.length} combis en circulación
              </span>
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
                          <span>Ubicar Combi en Mapa</span>
                        </button>

                        <span className="text-[10px] text-slate-400 font-mono">
                          {unit.speedKmH} km/h
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
    </div>
  );
};
