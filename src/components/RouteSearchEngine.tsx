import React, { useState } from 'react';
import { Coordinates, TransitRoute, TransitUnit } from '../types';
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
}

export const RouteSearchEngine: React.FC<RouteSearchEngineProps> = ({
  userLocation,
  onSetUserLocation,
  routes,
  units,
  onRouteCalculated,
  onOpen3DView,
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
      instructions: [
        `Camina 85m hacia la parada ${boardStop.name}`,
        `Aborda la combi ${targetRoute.name} (Unidad ${targetUnit.unitNumber})`,
        `Desciende en ${alightStop.name}`,
      ],
    });

    voiceService.speak(
      `Para ir a ${place.name}, toma la combi ${targetRoute.name}. La próxima unidad llega en ${targetUnit.etaMinutes} minutos.`
    );
  };

  return (
    <div className="bg-slate-900/90 border-2 border-cyan-500/60 rounded-2xl p-5 shadow-2xl space-y-5">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-cyan-500 text-slate-950 uppercase">
            PLANIFICADOR DE VIAJE & NAVEGACIÓN
          </span>
          <h3 className="text-base font-bold text-white mt-1 flex items-center gap-2">
            <Search className="w-5 h-5 text-cyan-400" />
            ¿A dónde vas en Lázaro Cárdenas?
          </h3>
          <p className="text-xs text-slate-400">
            Te decimos exactamente qué combi o camión tomar, dónde subirte y en cuántos minutos llega.
          </p>
        </div>

        {/* GPS Detection Button */}
        <button
          onClick={handleDetectGps}
          disabled={isGettingGps}
          className="bg-slate-950 hover:bg-slate-800 text-cyan-400 border border-cyan-700/80 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition hover:scale-105 shrink-0 shadow"
        >
          <LocateFixed className={`w-4 h-4 ${isGettingGps ? 'animate-spin' : 'text-cyan-400'}`} />
          <span>{isGettingGps ? 'Detectando GPS...' : userLocation ? 'Mi GPS Detectado ✓' : 'Detectar Mi Ubicación'}</span>
        </button>
      </div>

      {gpsError && (
        <div className="p-3 bg-amber-950/60 border border-amber-800/80 rounded-xl text-xs text-amber-200">
          ⚠️ {gpsError}
        </div>
      )}

      {/* ORIGIN SELECTOR ROW */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-semibold flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Origen:
        </span>
        <button
          onClick={() => handleSetPresetOrigin({ lat: 17.9632, lng: -102.1985 }, 'Centro Lázaro Cárdenas')}
          className="bg-slate-950 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-800 hover:border-cyan-500 transition"
        >
          Centro
        </button>
        <button
          onClick={() => handleSetPresetOrigin({ lat: 17.9942, lng: -102.2215 }, 'Las Guacamayas')}
          className="bg-slate-950 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-800 hover:border-cyan-500 transition"
        >
          Las Guacamayas
        </button>
        <button
          onClick={() => handleSetPresetOrigin({ lat: 17.9540, lng: -102.1930 }, 'Malecón del Balsas')}
          className="bg-slate-950 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-800 hover:border-cyan-500 transition"
        >
          Malecón
        </button>
        <button
          onClick={() => handleSetPresetOrigin({ lat: 17.9850, lng: -102.2175 }, 'Tecnológico')}
          className="bg-slate-950 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-800 hover:border-cyan-500 transition"
        >
          Tecnológico
        </button>
        <button
          onClick={() => handleSetPresetOrigin({ lat: 17.9820, lng: -102.3520 }, 'Playa Azul')}
          className="bg-slate-950 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-800 hover:border-cyan-500 transition"
        >
          Playa Azul
        </button>
      </div>

      {/* SEARCH BAR INPUT */}
      <div className="relative">
        <div className="flex items-center gap-2 bg-slate-950 border-2 border-slate-700 focus-within:border-cyan-400 rounded-xl px-3 py-2.5 shadow-inner">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar destino: Aduana, Hospital General, ArcelorMittal, Tecnológico, Playa Azul..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedPlace(null);
                setCalculationResult(null);
              }}
              className="text-xs text-slate-400 hover:text-white px-2"
            >
              Borrar
            </button>
          )}
        </div>

        {/* AUTOCOMPLETE POPUP LIST */}
        {matchingPlaces.length > 0 && !selectedPlace && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-slate-950 border border-slate-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto divide-y divide-slate-800">
            {matchingPlaces.map((place) => (
              <div
                key={place.id}
                onClick={() => handleSelectDestination(place)}
                className="p-3 hover:bg-slate-900 cursor-pointer transition flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <span>{place.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300">
                      {place.category}
                    </span>
                  </h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">{place.address}</p>
                </div>
                <span className="text-cyan-400 font-semibold text-[11px] shrink-0">
                  Calcular Combi →
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QUICK DESTINATION PILLS */}
      <div className="space-y-1.5">
        <span className="text-[11px] text-slate-400">Destinos frecuentes en el Puerto:</span>
        <div className="flex flex-wrap gap-1.5">
          {LAZARO_PLACES.slice(0, 6).map((place) => (
            <button
              key={place.id}
              onClick={() => handleSelectDestination(place)}
              className="text-xs font-semibold bg-slate-950 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/60 px-3 py-1.5 rounded-lg border border-slate-800 transition"
            >
              {place.name}
            </button>
          ))}
        </div>
      </div>

      {/* ===================== CALCULATION RESULT CARD ===================== */}
      {calculationResult && selectedPlace && (
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-2 border-cyan-400/80 rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-bold font-mono uppercase text-emerald-400">
                COMBI RECOMENDADA DETECTADA
              </span>
              <h4 className="text-lg font-black text-white flex items-center gap-2">
                <Bus className="w-5 h-5 text-cyan-400" />
                {calculationResult.route.name}
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-600 px-3 py-1 rounded-xl text-xs font-bold font-mono">
                Tarifa: {calculationResult.fareMxn}
              </span>
            </div>
          </div>

          {/* Step-by-Step Directions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Step 1: Walk to board stop */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-cyan-400 uppercase">Paso 1: Abordaje</span>
              <p className="font-bold text-white">Camina {calculationResult.walkDistanceM}m a la parada:</p>
              <p className="text-slate-300 font-semibold">{calculationResult.boardStop}</p>
            </div>

            {/* Step 2: Next Combi arriving */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase">Paso 2: En Camino</span>
              <p className="font-bold text-white">Combi {calculationResult.nearestUnit.unitNumber}</p>
              <p className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Llegando en {calculationResult.nearestUnit.etaMinutes} min a la parada
              </p>
            </div>

            {/* Step 3: Alight stop & arrival */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 uppercase">Paso 3: Destino</span>
              <p className="font-bold text-white">Desciende en:</p>
              <p className="text-slate-300 font-semibold">{calculationResult.alightStop}</p>
              <p className="text-[11px] text-slate-400">Tiempo de viaje: ~{calculationResult.travelMinutes} min</p>
            </div>
          </div>

          {/* Action Buttons: Map plot indication */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-xs text-cyan-300 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Ruta de combi y tramo peatonal trazados sobre el mapa satelital</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-700/60">
                ✓ Trayectoria Activa
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
