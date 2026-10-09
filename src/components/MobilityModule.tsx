import React, { useState } from 'react';
import { 
  TransitRoute, 
  TransitUnit, 
  Coordinates,
  CitizenReport,
  Language
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
import { t } from '../i18n/touristTranslations';

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
  currentLanguage?: Language;
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
  currentLanguage = 'es',
}) => {
  const [isRoutesOpen, setIsRoutesOpen] = useState<boolean>(false);

  return (
    <div className="space-y-6">
      {/* Mobility Header - Combi Vivo Style */}
      <div className="bg-white border-3 border-[#0B2A3C] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[4px_4px_0_#0B2A3C]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#14B8C4] text-white border-2 border-[#0B2A3C] shadow-[2px_2px_0_#0B2A3C] flex items-center justify-center font-bold text-xl">
            🚐
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-[#0B2A3C] font-['Bricolage_Grotesque']">
                {t('mobility_title', currentLanguage)}
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#7BD84A] text-[#0B2A3C] border-2 border-[#0B2A3C] font-extrabold">
                ● GPS ACTIVO
              </span>
            </div>
            <p className="text-xs text-[#0B2A3C]/70 font-medium">
              {t('mobility_subtitle', currentLanguage)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-[#FFF6E5] px-3 py-1.5 rounded-xl border-2 border-[#0B2A3C] font-mono text-xs font-bold text-[#0B2A3C] shadow-[2px_2px_0_#0B2A3C]">
            {units.length} {t('active_units_count', currentLanguage)}
          </span>
        </div>
      </div>

      {/* Main Content Pasajero */}
      <div className="space-y-5">
        {/* How to get there */}
        <div className="bg-white border-3 border-[#0B2A3C] rounded-2xl p-5 shadow-[4px_4px_0_#0B2A3C] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#14B8C4] text-white border-2 border-[#0B2A3C] flex items-center justify-center">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0B2A3C] font-['Bricolage_Grotesque'] flex items-center gap-2">
                  {t('how_to_get_there', currentLanguage)}
                  <span className="text-[10px] font-mono bg-[#FFC21A] text-[#0B2A3C] border border-[#0B2A3C] px-2 py-0.5 rounded-full font-bold">
                    {t('most_convenient_tag', currentLanguage)}
                  </span>
                </h4>
                <p className="text-xs text-[#0B2A3C]/70">
                  {t('how_to_desc', currentLanguage)}
                </p>
              </div>
            </div>

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
              className="sticker-btn bg-[#14B8C4] text-white text-xs font-bold px-3 py-2 rounded-xl border-2 border-[#0B2A3C] shadow-[2px_2px_0_#0B2A3C] flex items-center gap-1.5 transition cursor-pointer"
            >
              <LocateFixed className="w-3.5 h-3.5" />
              <span>{t('refresh_my_gps', currentLanguage)}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
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
                  voiceService.speak(`Trazando ruta hacia ${dest.name}.`);
                }}
                className="bg-[#FFF6E5] hover:bg-[#FFE5C0] p-3 rounded-2xl border-2 border-[#0B2A3C] shadow-[2px_2px_0_#0B2A3C] text-left transition cursor-pointer group flex flex-col justify-between"
              >
                <span className="font-bold text-[#0B2A3C] block group-hover:text-[#FF5A3C] text-xs leading-tight">
                  {dest.name}
                </span>
                <span className="text-[10px] text-[#14B8C4] font-mono font-bold flex items-center gap-1 mt-2">
                  <Route className="w-3 h-3" />
                  <span>{t('trace_combi_route', currentLanguage)}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Routes Dropdown */}
        <div className="bg-white border-3 border-[#0B2A3C] rounded-2xl overflow-hidden shadow-[4px_4px_0_#0B2A3C]">
          <button
            onClick={() => setIsRoutesOpen(!isRoutesOpen)}
            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#FFF6E5] transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#14B8C4] text-white border-2 border-[#0B2A3C] flex items-center justify-center font-bold">
                <Bus className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#0B2A3C] font-['Bricolage_Grotesque']">
                {t('routes_and_buses_header', currentLanguage)} ({routes.length})
              </span>
              {selectedRouteId && (
                <span className="text-[10px] font-mono bg-[#FFC21A] text-[#0B2A3C] px-2 py-0.5 rounded-full border border-[#0B2A3C] font-bold">
                  {routes.find(r => r.id === selectedRouteId)?.code}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-[#0B2A3C] font-bold">
              <span>{isRoutesOpen ? t('hide_breakdown', currentLanguage) : t('show_breakdown', currentLanguage)}</span>
              {isRoutesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {isRoutesOpen && (
            <div className="p-4 border-t-2 border-[#0B2A3C] bg-[#FFF6E5] grid grid-cols-1 md:grid-cols-3 gap-3">
              {routes.map((route) => {
                const isSelected = selectedRouteId === route.id;
                const routeUnits = units.filter(u => u.routeId === route.id);

                return (
                  <div
                    key={route.id}
                    onClick={() => onSelectRoute(isSelected ? null : route.id)}
                    className={`cursor-pointer rounded-2xl p-4 border-2 border-[#0B2A3C] transition shadow-[2px_2px_0_#0B2A3C] ${
                      isSelected
                        ? 'bg-[#14B8C4] text-white'
                        : 'bg-white hover:bg-[#FFE5C0] text-[#0B2A3C]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-[10px] font-mono font-black px-2.5 py-0.5 rounded-md text-white border border-[#0B2A3C]"
                        style={{ backgroundColor: route.color }}
                      >
                        {route.code}
                      </span>
                      <span className="text-[10px] font-mono font-bold opacity-80">
                        {t('every_minutes', currentLanguage)} {route.frequencyMinutes} min
                      </span>
                    </div>
                    <h4 className="text-xs font-bold mb-0.5 font-['Bricolage_Grotesque']">{route.name}</h4>
                    <p className="text-[11px] opacity-85 truncate">{route.destination}</p>
                    <div className="mt-3 pt-2 border-t border-[#0B2A3C]/20 flex items-center justify-between text-[10px] font-bold">
                      <span>{routeUnits.length} {t('combis_active_label', currentLanguage)}</span>
                      <span>{isSelected ? '✓ Seleccionada' : 'Seleccionar'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Real-time units monitor */}
        <div className="bg-white border-3 border-[#0B2A3C] rounded-2xl p-5 shadow-[4px_4px_0_#0B2A3C]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#7BD84A] text-[#0B2A3C] border-2 border-[#0B2A3C] flex items-center justify-center font-bold">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0B2A3C] font-['Bricolage_Grotesque']">
                  {t('live_monitoring_title', currentLanguage)}
                </h3>
                <p className="text-xs text-[#0B2A3C]/70">
                  {t('live_monitoring_desc', currentLanguage)}
                </p>
              </div>
            </div>

            <span className="text-xs font-mono text-[#0B2A3C] bg-[#FFF6E5] px-3 py-1.5 rounded-xl border-2 border-[#0B2A3C] font-bold shadow-[2px_2px_0_#0B2A3C]">
              {units.length} {t('combis_in_circulation', currentLanguage)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {units
              .filter(u => !selectedRouteId || u.routeId === selectedRouteId)
              .map((unit) => {
                const isHigh = unit.occupancyPercent >= 90;
                const isBroken = unit.status === 'breakdown';
                const isReinforce = unit.status === 'reinforcement';

                return (
                  <div
                    key={unit.id}
                    className={`rounded-2xl p-4 border-2 border-[#0B2A3C] transition-all shadow-[3px_3px_0_#0B2A3C] ${
                      isBroken
                        ? 'bg-[#E5233B]/10'
                        : isReinforce
                        ? 'bg-[#B779FF]/10'
                        : isHigh
                        ? 'bg-[#FFC21A]/20'
                        : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🚐</span>
                        <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded-lg bg-[#FFF6E5] text-[#0B2A3C] border-2 border-[#0B2A3C]">
                          {unit.unitNumber}
                        </span>
                        {isReinforce && (
                          <span className="text-[10px] bg-[#B779FF] text-white font-bold px-2 py-0.5 rounded-full border border-[#0B2A3C]">
                            {t('tag_reinforcement', currentLanguage)}
                          </span>
                        )}
                        {isBroken && (
                          <span className="text-[10px] bg-[#E5233B] text-white font-bold px-2 py-0.5 rounded-full animate-pulse border border-[#0B2A3C]">
                            {t('tag_breakdown', currentLanguage)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 bg-[#FFF6E5] px-2 py-1 rounded-lg border border-[#0B2A3C]">
                        <span className="text-xs">{isHigh ? '🔴' : unit.occupancyPercent >= 60 ? '🟡' : '🟢'}</span>
                        <span className="text-xs font-black text-[#0B2A3C]">
                          {unit.occupancyPercent}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-[#0B2A3C] mb-3 bg-[#FFF6E5] p-3 rounded-xl border-2 border-[#0B2A3C]">
                      <p className="flex items-center justify-between gap-1">
                        <span className="text-[#0B2A3C]/70 font-bold flex items-center gap-1.5">
                          <span>👨‍✈️</span>
                          <span>{t('driver_label', currentLanguage)}</span>
                        </span>
                        <span className="font-extrabold truncate">{unit.driverName}</span>
                      </p>
                      <p className="flex items-center justify-between gap-1">
                        <span className="text-[#0B2A3C]/70 font-bold flex items-center gap-1.5">
                          <span>📍</span>
                          <span>{t('next_stop_label', currentLanguage)}</span>
                        </span>
                        <span className="font-extrabold truncate max-w-[150px]">{unit.nextStop}</span>
                      </p>
                      <p className="flex items-center justify-between gap-1">
                        <span className="text-[#0B2A3C]/70 font-bold flex items-center gap-1.5">
                          <span>⏱️</span>
                          <span>{t('arrival_time_label', currentLanguage)}</span>
                        </span>
                        <span className="font-black text-[#FF5A3C] font-mono text-xs bg-white px-2 py-0.5 rounded border border-[#0B2A3C]">
                          ~{unit.etaMinutes} min
                        </span>
                      </p>
                    </div>

                    <div className="w-full bg-[#FFF6E5] h-3 rounded-full overflow-hidden border-2 border-[#0B2A3C] mb-3">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          isBroken ? 'bg-[#E5233B]' : isHigh ? 'bg-[#FFC21A]' : 'bg-[#7BD84A]'
                        }`}
                        style={{ width: `${Math.min(unit.occupancyPercent, 100)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t-2 border-[#0B2A3C]/20">
                      <button
                        type="button"
                        onClick={() => {
                          toneGenerator.playSuccessBeep();
                          onCenterMap(unit.coords);
                        }}
                        className="sticker-btn text-xs text-white font-bold flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-[#14B8C4] border-2 border-[#0B2A3C] shadow-[2px_2px_0_#0B2A3C] transition cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{t('locate_combi_btn', currentLanguage)}</span>
                      </button>

                      <span className="text-[11px] text-[#0B2A3C] font-mono font-bold">
                        ⚡ {unit.speedKmH} km/h
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
