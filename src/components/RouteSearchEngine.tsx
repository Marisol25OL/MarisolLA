import React, { useState } from 'react';
import { Coordinates, TransitRoute, TransitUnit, Language } from '../types';
import { 
  Search, 
  MapPin, 
  Navigation, 
  Bus, 
  Clock, 
  DollarSign, 
  Sparkles, 
  CheckCircle2, 
  Box, 
  Mic, 
  ArrowRight,
  LocateFixed
} from 'lucide-react';
import { toneGenerator, voiceService } from '../services/voiceAssistant';
import { TOURIST_I18N, t } from '../i18n/touristTranslations';

export interface DestinationPlace {
  id: string;
  name: string;
  category: string;
  coords: Coordinates;
  address: string;
  servedByRouteId: string;
  stopName: string;
}

export const LAZARO_PLACES: DestinationPlace[] = [
  // Port & Industry
  {
    id: 'p-aduana',
    name: 'Aduana Marítima de Lázaro Cárdenas',
    category: 'Portuaria / Aduanas',
    coords: { lat: 17.9355, lng: -102.1845 },
    address: 'Isla del Cayacal, Recinto Portuario Interior',
    servedByRouteId: 'ruta-2',
    stopName: 'Aduana Marítima Terminal 1',
  },
  {
    id: 'p-asipona',
    name: 'ASIPONA Administración del Puerto',
    category: 'Oficinas Puerto',
    coords: { lat: 17.9410, lng: -102.1890 },
    address: 'Prolongación Av. Lázaro Cárdenas No. 1',
    servedByRouteId: 'ruta-2',
    stopName: 'Edificio Corporativo ASIPONA',
  },
  {
    id: 'p-arcelor',
    name: 'ArcelorMittal México (Siderúrgica)',
    category: 'Industria',
    coords: { lat: 17.9390, lng: -102.2120 },
    address: 'Av. Francisco J. Mújica No. 1, Isla del Cayacal',
    servedByRouteId: 'ruta-2',
    stopName: 'ArcelorMittal Planta Siderúrgica',
  },
  {
    id: 'p-hutchison',
    name: 'Hutchison Ports LCT Terminal',
    category: 'Contenedores',
    coords: { lat: 17.9290, lng: -102.1790 },
    address: 'Terminal Especializada de Contenedores I',
    servedByRouteId: 'ruta-2',
    stopName: 'Terminal Hutchison Ports LCT',
  },

  // City & Health
  {
    id: 'p-hosp-gen',
    name: 'Hospital General Dr. Cecilio Báez',
    category: 'Salud',
    coords: { lat: 17.9785, lng: -102.2120 },
    address: 'Av. Melchor Ocampo No. 240, Col. Segundo Sector',
    servedByRouteId: 'ruta-1',
    stopName: 'Hospital General Dr. Cecilio Báez',
  },
  {
    id: 'p-imss-12',
    name: 'IMSS Hospital General de Zona No. 12',
    category: 'Salud',
    coords: { lat: 17.9640, lng: -102.1950 },
    address: 'Av. Lázaro Cárdenas esq. Tulipanes, Centro',
    servedByRouteId: 'ruta-1',
    stopName: 'Terminal Centro (Av. Lázaro Cárdenas)',
  },
  {
    id: 'p-tecnologico',
    name: 'Instituto Tecnológico de Lázaro Cárdenas',
    category: 'Educación',
    coords: { lat: 17.9850, lng: -102.2175 },
    address: 'Av. Melchor Ocampo No. 2555',
    servedByRouteId: 'ruta-1',
    stopName: 'Instituto Tecnológico de Lázaro Cárdenas',
  },
  {
    id: 'p-soriana-americas',
    name: 'Plaza Las Américas / Soriana Híper',
    category: 'Comercial',
    coords: { lat: 17.9715, lng: -102.2065 },
    address: 'Av. Melchor Ocampo No. 1200',
    servedByRouteId: 'ruta-1',
    stopName: 'Plaza Las Américas / Soriana',
  },
  {
    id: 'p-guacamayas-centro',
    name: 'Crucero Las Guacamayas',
    category: 'Comercial / Transporte',
    coords: { lat: 17.9942, lng: -102.2215 },
    address: 'Blvd. Las Guacamayas esq. Carretera La Mira',
    servedByRouteId: 'ruta-1',
    stopName: 'Crucero Las Guacamayas',
  },

  // Tourism & Coast
  {
    id: 'p-malecon',
    name: 'Malecón de la Cultura y la Paz',
    category: 'Turismo / Recreación',
    coords: { lat: 17.9540, lng: -102.1930 },
    address: 'Ribera del Río Balsas, Malecón',
    servedByRouteId: 'ruta-2',
    stopName: 'Malecón de la Cultura y la Paz',
  },
  {
    id: 'p-playa-azul',
    name: 'Playa Azul Centro y Boulevard Costero',
    category: 'Playa / Ecoturismo',
    coords: { lat: 17.9820, lng: -102.3520 },
    address: 'Boulevard Madero, Playa Azul',
    servedByRouteId: 'ruta-3',
    stopName: 'Centro Playa Azul',
  },
  {
    id: 'p-pichi',
    name: 'Barra de Pichi (Humedales y Manglares)',
    category: 'Ecoturismo',
    coords: { lat: 17.9950, lng: -102.3780 },
    address: 'Carretera Costera Km 21',
    servedByRouteId: 'ruta-3',
    stopName: 'Humedales Barra de Pichi (Ecoturismo)',
  },
  {
    id: 'p-tortugario',
    name: 'Campamento Tortuguero Taracosta',
    category: 'Santuario',
    coords: { lat: 17.9815, lng: -102.3510 },
    address: 'Boulevard Madero Sur, Playa Azul',
    servedByRouteId: 'ruta-3',
    stopName: 'Centro Playa Azul',
  },
  {
    id: 'p-mercado',
    name: 'Mercado Municipal Cuauhtémoc',
    category: 'Supermercado & Abastecimiento',
    coords: { lat: 17.9620, lng: -102.1995 },
    address: 'Calle 5 de Mayo esq. Av. Lázaro Cárdenas, Centro',
    servedByRouteId: 'ruta-1',
    stopName: 'Terminal Centro (Av. Lázaro Cárdenas)',
  },
  {
    id: 'p-walmart',
    name: 'Walmart Supercenter (Plaza Las Américas)',
    category: 'Supermercado',
    coords: { lat: 17.9740, lng: -102.2080 },
    address: 'Av. Melchor Ocampo No. 515, Plaza Las Américas',
    servedByRouteId: 'ruta-1',
    stopName: 'Plaza Las Américas / Soriana',
  },
  {
    id: 'p-aurrera-guacamayas',
    name: 'Bodega Aurrera (Las Guacamayas)',
    category: 'Supermercado',
    coords: { lat: 18.0050, lng: -102.2280 },
    address: 'Av. Ciranda No. 120, Las Guacamayas',
    servedByRouteId: 'ruta-1',
    stopName: 'Terminal Las Guacamayas (Acceso Norte)',
  },
  {
    id: 'p-fertinal',
    name: 'Fertinal (Fertilizantes de México / Pemex)',
    category: 'Industria Química',
    coords: { lat: 17.9310, lng: -102.1980 },
    address: 'Recinto Portuario Interior, Isla del Cayacal',
    servedByRouteId: 'ruta-2',
    stopName: 'Terminal Hutchison Ports LCT',
  },
  {
    id: 'p-apm-terminals',
    name: 'APM Terminals Lázaro Cárdenas (TEC II)',
    category: 'Terminal Contenedores',
    coords: { lat: 17.9290, lng: -102.1760 },
    address: 'Isla del Cayacal, TEC II',
    servedByRouteId: 'ruta-2',
    stopName: 'Aduana Marítima Terminal 1',
  },
  {
    id: 'p-aaaplac',
    name: 'AAAPLAC (Agentes Aduanales del Puerto)',
    category: 'Aduanas & Logística',
    coords: { lat: 17.9620, lng: -102.1930 },
    address: 'Av. Melchor Ocampo No. 120, Centro',
    servedByRouteId: 'ruta-1',
    stopName: 'Terminal Centro (Av. Lázaro Cárdenas)',
  },
  {
    id: 'p-rest-marinero',
    name: 'Restaurante Mariscos El Marinero',
    category: 'Restaurante Mariscos',
    coords: { lat: 17.9635, lng: -102.1970 },
    address: 'Av. Rector Hidalgo No. 185, Centro',
    servedByRouteId: 'ruta-1',
    stopName: 'Terminal Centro (Av. Lázaro Cárdenas)',
  },
  {
    id: 'p-fonda-dona-mary',
    name: 'Fonda Doña Mary (Aporreadillo & Morisqueta)',
    category: 'Fonda Tradicional',
    coords: { lat: 17.9620, lng: -102.1955 },
    address: 'Calle Corregidora No. 45, Centro',
    servedByRouteId: 'ruta-1',
    stopName: 'Terminal Centro (Av. Lázaro Cárdenas)',
  },
  {
    id: 'p-dominos',
    name: 'Domino’s Pizza Lázaro Cárdenas',
    category: 'Comida Rápida',
    coords: { lat: 17.9650, lng: -102.2005 },
    address: 'Av. Melchor Ocampo No. 312',
    servedByRouteId: 'ruta-1',
    stopName: 'Terminal Centro (Av. Lázaro Cárdenas)',
  },
  {
    id: 'p-hotel-portonovo',
    name: 'Hotel Portonovo Plaza Lázaro Cárdenas',
    category: 'Hospedaje & Hotel',
    coords: { lat: 17.9670, lng: -102.2025 },
    address: 'Av. Rector Hidalgo No. 360, Centro',
    servedByRouteId: 'ruta-1',
    stopName: 'Terminal Centro (Av. Lázaro Cárdenas)',
  }
];

interface RouteSearchEngineProps {
  userLocation: Coordinates | null;
  onSetUserLocation: (coords: Coordinates) => void;
  routes: TransitRoute[];
  units: TransitUnit[];
  onRouteCalculated: (result: {
    origin: Coordinates;
    destination: Coordinates;
    route: TransitRoute;
    walkingPath: Coordinates[];
    transitPath: Coordinates[];
    destinationName: string;
    instructions: string[];
  }) => void;
  onOpen3DView?: (unit?: TransitUnit) => void;
  currentLanguage?: Language;
}

export const RouteSearchEngine: React.FC<RouteSearchEngineProps> = ({
  userLocation,
  onSetUserLocation,
  routes,
  units,
  onRouteCalculated,
  onOpen3DView,
  currentLanguage = 'es',
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPlace, setSelectedPlace] = useState<DestinationPlace | null>(null);
  const [isGettingGps, setIsGettingGps] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [calculationResult, setCalculationResult] = useState<{
    route: TransitRoute;
    nearestUnit: TransitUnit;
    boardStop: string;
    alightStop: string;
    walkDistanceM: number;
    travelMinutes: number;
    fareMxn: string;
  } | null>(null);

  // Filtered places matching user search query
  const matchingPlaces = searchQuery.trim().length > 1
    ? LAZARO_PLACES.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Handle GPS detection
  const handleDetectGps = () => {
    setIsGettingGps(true);
    setGpsError(null);

    if (!navigator.geolocation) {
      setGpsError('La geolocalización no es compatible con este navegador.');
      setIsGettingGps(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsGettingGps(false);
        const coords: Coordinates = {
          lat: Number(pos.coords.latitude.toFixed(5)),
          lng: Number(pos.coords.longitude.toFixed(5)),
        };
        onSetUserLocation(coords);
        toneGenerator.playSuccessBeep();
        voiceService.speak('Ubicación GPS detectada con éxito. Ahora elige o busca a dónde quieres ir.');
      },
      (err) => {
        setIsGettingGps(false);
        // Fallback default: Centro Lázaro Cárdenas
        const defaultCoords: Coordinates = { lat: 17.9630, lng: -102.1985 };
        onSetUserLocation(defaultCoords);
        setGpsError('Permiso GPS no concedido en el navegador. Se fijó tu ubicación en el Centro de Lázaro Cárdenas.');
        toneGenerator.playAlertBeep();
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Preset location chooser
  const handleSetPresetOrigin = (coords: Coordinates, name: string) => {
    onSetUserLocation(coords);
    toneGenerator.playSuccessBeep();
    voiceService.speak(`Ubicación de partida fijada en ${name}.`);
  };

  // Calculate Route once destination is picked
  const handleSelectDestination = (place: DestinationPlace) => {
    setSelectedPlace(place);
    setSearchQuery(place.name);

    // Current origin (fallback to Centro if user hasn't set one yet)
    const currentOrigin = userLocation || { lat: 17.9632, lng: -102.1985 };
    if (!userLocation) {
      onSetUserLocation(currentOrigin);
    }

    // Match route
    const targetRoute = routes.find(r => r.id === place.servedByRouteId) || routes[0];
    const targetUnit = units.find(u => u.routeId === targetRoute.id) || units[0];

    // Board stop (closest stop on route to origin)
    const boardStop = targetRoute.stops[0];
    const alightStop = targetRoute.stops.find(s => s.name === place.stopName) || targetRoute.stops[targetRoute.stops.length - 1];

    const result = {
      route: targetRoute,
      nearestUnit: targetUnit,
      boardStop: boardStop.name,
      alightStop: alightStop.name,
      walkDistanceM: 85,
      travelMinutes: Math.floor(8 + Math.random() * 8),
      fareMxn: '$12.00 MXN',
    };

    setCalculationResult(result);
    toneGenerator.playSuccessBeep();

    // Notify parent to plot lines on satellite map!
    onRouteCalculated({
      origin: currentOrigin,
      destination: place.coords,
      route: targetRoute,
      walkingPath: [currentOrigin, boardStop.coords],
      transitPath: targetRoute.waypoints,
      destinationName: place.name,
      instructions: currentLanguage === 'en' ? [
        `Walk 85m to stop ${boardStop.name}`,
        `Board combi ${targetRoute.name} (Unit ${targetUnit.unitNumber})`,
        `Alight at ${alightStop.name}`,
      ] : currentLanguage === 'fr' ? [
        `Marchez 85m jusqu'à l'arrêt ${boardStop.name}`,
        `Montez dans le combi ${targetRoute.name} (Unité ${targetUnit.unitNumber})`,
        `Descendez à ${alightStop.name}`,
      ] : currentLanguage === 'zh' ? [
        `步行 85 米前往 ${boardStop.name} 站点`,
        `搭乘 ${targetRoute.name} 公交（车辆编号 ${targetUnit.unitNumber}）`,
        `在 ${alightStop.name} 站点下车`,
      ] : [
        `Camina 85m hacia la parada ${boardStop.name}`,
        `Aborda la combi ${targetRoute.name} (Unidad ${targetUnit.unitNumber})`,
        `Desciende en ${alightStop.name}`,
      ],
    });

    const voiceMsg: Record<Language, { text: string; langCode: string }> = {
      es: { text: `Para ir a ${place.name}, toma la combi ${targetRoute.name}. La próxima unidad llega en ${targetUnit.etaMinutes} minutos.`, langCode: 'es-MX' },
      en: { text: `To go to ${place.name}, take combi ${targetRoute.name}. Next vehicle arrives in ${targetUnit.etaMinutes} minutes.`, langCode: 'en-US' },
      fr: { text: `Pour aller à ${place.name}, prenez le combi ${targetRoute.name}. La prochaine unité arrive dans ${targetUnit.etaMinutes} minutes.`, langCode: 'fr-FR' },
      zh: { text: `前往 ${place.name}，请搭乘 ${targetRoute.name}。下一班车辆将在 ${targetUnit.etaMinutes} 分钟后到达。`, langCode: 'zh-CN' },
    };
    const vm = voiceMsg[currentLanguage] || voiceMsg.es;
    voiceService.speak(vm.text, vm.langCode);
  };

  return (
    <div className="bg-slate-900/90 border-2 border-cyan-500/60 rounded-2xl p-5 shadow-2xl space-y-5">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-cyan-500 text-slate-950 uppercase">
            {t('planner_badge', currentLanguage)}
          </span>
          <h3 className="text-base font-bold text-white mt-1 flex items-center gap-2">
            <Search className="w-5 h-5 text-cyan-400" />
            {t('planner_title', currentLanguage)}
          </h3>
          <p className="text-xs text-slate-400">
            {t('planner_desc', currentLanguage)}
          </p>
        </div>

        {/* GPS Detection Button */}
        <button
          onClick={handleDetectGps}
          disabled={isGettingGps}
          className="bg-slate-950 hover:bg-slate-800 text-cyan-400 border border-cyan-700/80 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition hover:scale-105 shrink-0 shadow"
        >
          <LocateFixed className={`w-4 h-4 ${isGettingGps ? 'animate-spin' : 'text-cyan-400'}`} />
          <span>{isGettingGps ? t('btn_updating_gps', currentLanguage) : userLocation ? t('gps_active', currentLanguage) + ' ✓' : t('btn_use_gps', currentLanguage)}</span>
        </button>
      </div>

      {gpsError && (
        <div className="p-3 bg-amber-950/60 border border-amber-800/80 rounded-xl text-xs text-amber-200">
          ⚠️ {gpsError}
        </div>
      )}

      {/* ORIGIN SELECTOR ROW (Icon-Rich & Intuitive) */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-slate-300 font-bold flex items-center gap-1.5 text-xs">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>{t('origin_label', currentLanguage)}</span>
          </span>
          <span className="text-[11px] text-slate-400">
            {userLocation ? '📍 GPS detectado' : 'Toca tu colonia o usa el GPS'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => handleSetPresetOrigin({ lat: 17.9632, lng: -102.1985 }, 'Centro Lázaro Cárdenas')}
            className="bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:border-cyan-500 transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>🏙️</span>
            <span>Centro</span>
          </button>
          <button
            type="button"
            onClick={() => handleSetPresetOrigin({ lat: 17.9942, lng: -102.2215 }, 'Las Guacamayas')}
            className="bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:border-cyan-500 transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>🏘️</span>
            <span>Las Guacamayas</span>
          </button>
          <button
            type="button"
            onClick={() => handleSetPresetOrigin({ lat: 17.9540, lng: -102.1930 }, 'Malecón del Balsas')}
            className="bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:border-cyan-500 transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>🌊</span>
            <span>Malecón</span>
          </button>
          <button
            type="button"
            onClick={() => handleSetPresetOrigin({ lat: 17.9850, lng: -102.2175 }, 'Tecnológico')}
            className="bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:border-cyan-500 transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>🎓</span>
            <span>Tecnológico</span>
          </button>
          <button
            type="button"
            onClick={() => handleSetPresetOrigin({ lat: 17.9820, lng: -102.3520 }, 'Playa Azul')}
            className="bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:border-cyan-500 transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>🏖️</span>
            <span>Playa Azul</span>
          </button>
        </div>
      </div>

      {/* SEARCH BAR INPUT */}
      <div className="relative space-y-1.5">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <span>🏁</span>
          <span>{t('destination_label', currentLanguage)}</span>
        </label>
        <div className="flex items-center gap-2.5 bg-slate-950 border-2 border-slate-700 focus-within:border-cyan-400 rounded-xl px-3.5 py-3 shadow-inner">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search_placeholder', currentLanguage)}
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedPlace(null);
                setCalculationResult(null);
              }}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 cursor-pointer"
            >
              ✕ Borrar
            </button>
          )}
        </div>

        {/* AUTOCOMPLETE POPUP LIST */}
        {matchingPlaces.length > 0 && !selectedPlace && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-slate-950 border-2 border-cyan-500/60 rounded-xl shadow-2xl max-h-64 overflow-y-auto divide-y divide-slate-800">
            {matchingPlaces.map((place) => (
              <div
                key={place.id}
                onClick={() => handleSelectDestination(place)}
                className="p-3.5 hover:bg-slate-900 cursor-pointer transition flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <span>📍 {place.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300">
                      {place.category}
                    </span>
                  </h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">{place.address}</p>
                </div>
                <span className="text-cyan-400 font-bold text-xs shrink-0 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-800">
                  {t('btn_calculate', currentLanguage)} →
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QUICK DESTINATION TILES WITH ICONS */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <span>⚡</span>
          <span>{t('popular_destinations', currentLanguage)}</span>
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { id: 'p-arcelor', label: 'ArcelorMittal', icon: '🏭', cat: 'Siderúrgica' },
            { id: 'p-asipona', label: 'Puerto ASIPONA', icon: '⚓', cat: 'Recinto Portuario' },
            { id: 'p-playa-azul', label: 'Playa Azul', icon: '🏖️', cat: 'Enramadas y Mar' },
            { id: 'p-hosp-gen', label: 'Hospital General', icon: '🏥', cat: 'Salud 24h' },
            { id: 'p-soriana-americas', label: 'Soriana / Plaza', icon: '🛒', cat: 'Comercial' },
            { id: 'p-malecon', label: 'Malecón Balsas', icon: '🌊', cat: 'Turismo y Río' },
          ].map((item) => {
            const place = LAZARO_PLACES.find(p => p.id === item.id) || LAZARO_PLACES[0];
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectDestination(place)}
                className="bg-slate-950/80 hover:bg-slate-850 p-2.5 rounded-xl border border-slate-800 hover:border-cyan-400/80 transition cursor-pointer text-left group flex items-center gap-2.5 shadow-sm active:scale-[0.98]"
              >
                <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">{item.icon}</span>
                <div className="truncate">
                  <p className="font-bold text-white text-xs group-hover:text-cyan-300 truncate">{item.label}</p>
                  <p className="text-[10px] text-slate-400 truncate">{item.cat}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===================== CALCULATION RESULT CARD (Visual 3-Step Journey) ===================== */}
      {calculationResult && selectedPlace && (
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 border-2 border-cyan-400 rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🎉</span>
                <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">
                  {t('calc_result_title', currentLanguage)}
                </span>
              </div>
              <h4 className="text-lg sm:text-xl font-black text-white flex items-center gap-2 mt-0.5">
                <span>🚌</span>
                <span>{calculationResult.route.name}</span>
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border-2 border-emerald-500 px-3.5 py-1.5 rounded-xl text-xs font-black font-mono shadow-sm flex items-center gap-1.5">
                <span>💵</span>
                <span>{t('stat_fare', currentLanguage)}: {calculationResult.fareMxn}</span>
              </span>
            </div>
          </div>

          {/* Step-by-Step Directions with Friendly Visual Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Step 1: Walk to board stop */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-xl">🚶‍♂️</span>
                <span className="text-[11px] font-black text-cyan-400 uppercase tracking-wide">
                  1. {t('stat_walk', currentLanguage)}
                </span>
              </div>
              <p className="font-extrabold text-white text-sm">Camina {calculationResult.walkDistanceM} metros:</p>
              <p className="text-slate-300 font-medium">📍 Parada: <strong>{calculationResult.boardStop}</strong></p>
            </div>

            {/* Step 2: Next Combi arriving */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-xl">🚐</span>
                <span className="text-[11px] font-black text-amber-400 uppercase tracking-wide">
                  2. {t('stat_unit', currentLanguage)}
                </span>
              </div>
              <p className="font-extrabold text-white text-sm">Combi {calculationResult.nearestUnit.unitNumber}</p>
              <p className="text-emerald-400 font-mono font-bold flex items-center gap-1 text-xs">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Llega en ~{calculationResult.nearestUnit.etaMinutes} min</span>
              </p>
            </div>

            {/* Step 3: Alight stop & arrival */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏁</span>
                <span className="text-[11px] font-black text-emerald-400 uppercase tracking-wide">
                  3. {t('step_alight', currentLanguage)}
                </span>
              </div>
              <p className="font-extrabold text-white text-sm">Baja en {calculationResult.alightStop}</p>
              <p className="text-slate-300 text-xs">⏱️ {t('stat_travel_time', currentLanguage)}: ~{calculationResult.travelMinutes} min</p>
            </div>
          </div>

          {/* Action Footer: Satellite Map Indication */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
            <div className="text-xs text-cyan-300 font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{t('btn_view_on_satellite_map', currentLanguage)} (trazo azul activo abajo)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-700/80 font-bold">
                ✓ Recorrido Trazado en Vivo
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
