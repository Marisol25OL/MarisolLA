import React, { useState, useEffect } from 'react';
import { 
  INITIAL_ROUTES, 
  INITIAL_UNITS, 
  CATALOG_ITEMS, 
  SAFETY_ZONES, 
  SAFE_POINTS, 
  INITIAL_REPORTS 
} from './data/mockData';
import { 
  TransitRoute, 
  TransitUnit, 
  CatalogItem, 
  SafetyZone, 
  SafePoint, 
  CitizenReport, 
  CitizenReportType,
  Language, 
  Coordinates 
} from './types';
import { SmartMap } from './components/SmartMap';
import { RouteSearchEngine } from './components/RouteSearchEngine';
import { MobilityModule } from './components/MobilityModule';
import { PortTourismModule } from './components/PortTourismModule';
import { SafetyModule } from './components/SafetyModule';
import { CitizenReportModule } from './components/CitizenReportModule';
import { OfflineGuideModal } from './components/OfflineGuideModal';
import { VoiceAssistantBar } from './components/VoiceAssistantBar';
import { ReportDetailModal } from './components/ReportDetailModal';
import { ReportPrintPreviewModal } from './components/ReportPrintPreviewModal';
import { LCNovaLogo } from './components/LCNovaLogo';
import { LCNovaChatbot } from './components/LCNovaChatbot';
import { DriverPanel } from './components/DriverPanel';
import { LocatarioPanel } from './components/LocatarioPanel';
import { offlineManager } from './services/offlineSync';
import { toneGenerator, voiceService } from './services/voiceAssistant';
import { 
  Bus, 
  Anchor, 
  Shield, 
  FileText, 
  HardDrive, 
  Wifi, 
  WifiOff, 
  AlertOctagon, 
  Sparkles,
  Users
} from 'lucide-react';

export default function App() {
  // Primary 3-Panel Structure: 'turista' vs 'locatario' vs 'chofer'
  const [mainPanel, setMainPanel] = useState<'turista' | 'locatario' | 'chofer'>('turista');

  // Sub-Navigation within Panel Turista: 3 modules
  const [activeTab, setActiveTab] = useState<'movilidad' | 'turismo' | 'seguridad'>('movilidad');

  // Compact satellite map state (default: false = vista compacta más pequeña para los 3)
  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);

  const [showOfflineGuide, setShowOfflineGuide] = useState<boolean>(false);
  const [activeDetailReport, setActiveDetailReport] = useState<CitizenReport | null>(null);
  const [printPreviewReport, setPrintPreviewReport] = useState<CitizenReport | null>(null);

  // Helper to trace route on the interactive map
  const handleTraceRoute = (calc: {
    origin: Coordinates;
    destination: Coordinates;
    route: TransitRoute;
    walkingPath: Coordinates[];
    transitPath: Coordinates[];
    destinationName: string;
    instructions: string[];
  }) => {
    setRoutePlannerCoords({
      origin: calc.origin,
      destination: calc.destination,
      walkingPath: calc.walkingPath,
      transitPath: calc.transitPath,
    });
    setHighlightCoords(calc.destination);
    setSelectedRouteId(calc.route.id);
  };

  // Google Maps Platform Quota Defense State
  const [quotaExceeded] = useState<boolean>(false);

  // Internationalization & Accessibility
  const [currentLanguage, setCurrentLanguage] = useState<Language>('es');
  const [highContrast, setHighContrast] = useState<boolean>(false);

  // Network & Offline Status
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(0);

  // User Live GPS Location (Default: Centro Lázaro Cárdenas)
  const [userLocation, setUserLocation] = useState<Coordinates>({ lat: 17.9632, lng: -102.1985 });

  // Route Planning Display on Map
  const [routePlannerCoords, setRoutePlannerCoords] = useState<{
    origin: Coordinates;
    destination: Coordinates;
    walkingPath?: Coordinates[];
    transitPath?: Coordinates[];
  } | null>(null);

  // Core Data State
  const [routes] = useState<TransitRoute[]>(INITIAL_ROUTES);
  const [units, setUnits] = useState<TransitUnit[]>(INITIAL_UNITS);
  const [catalogItems] = useState<CatalogItem[]>(CATALOG_ITEMS);
  const [safetyZones] = useState<SafetyZone[]>(SAFETY_ZONES);
  const [safePoints] = useState<SafePoint[]>(SAFE_POINTS);
  const [reports, setReports] = useState<CitizenReport[]>(INITIAL_REPORTS);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  // Map Controls & Highlight
  const [highlightCoords, setHighlightCoords] = useState<Coordinates | null>(null);
  const [activeLayers, setActiveLayers] = useState({
    routes: true,
    buses: true,
    safetySemaforo: true,
    safePoints: true,
    reports: true,
  });

  // Offline Sync and GPS Watcher
  useEffect(() => {
    const unsubscribe = offlineManager.onStatusChange((status) => {
      setIsOnline(status);
      setOfflineQueueCount(offlineManager.getQueue().length);
    });

    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          // Default to Lázaro Cárdenas coordinates
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }

    return () => {
      unsubscribe();
    };
  }, []);

  // Live Unit Movement Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setUnits((prevUnits) =>
        prevUnits.map((u) => {
          return {
            ...u,
            coords: {
              lat: u.coords.lat + (Math.random() - 0.5) * 0.0003,
              lng: u.coords.lng + (Math.random() - 0.5) * 0.0003,
            },
            lastUpdated: 'Justo ahora',
          };
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Handle Offline Mode Toggle
  const handleToggleOfflineMode = () => {
    const newStatus = offlineManager.toggleSimulatedOffline();
    setIsOnline(newStatus);
    toneGenerator.playSuccessBeep();
    voiceService.speak(
      newStatus
        ? 'Conexión reestablecida. Sincronización automática activada.'
        : 'Modo sin conexión activado. La aplicación opera con datos en memoria local.'
    );
  };

  // Add Citizen Report
  const handleAddReport = (newReport: CitizenReport) => {
    setReports((prev) => [newReport, ...prev]);
    toneGenerator.playSuccessBeep();
  };

  // Voice Search Destination Handler
  const handleSearchDestinationVoice = (dest: string) => {
    const matchedRoute = dest.includes('puerto') || dest.includes('aduana') || dest.includes('arcelor')
      ? routes[1]
      : dest.includes('playa') || dest.includes('pichi')
      ? routes[2]
      : routes[0];

    setSelectedRouteId(matchedRoute.id);
    setHighlightCoords(matchedRoute.stops[0].coords);
    voiceService.speak(`Mostrando la combi ${matchedRoute.name} para llegar a ${dest}.`);
  };

  // Automatic Voice Report Handler
  const handleAutoReportVoice = (category: string, title?: string, desc?: string) => {
    const validCat = (category || 'baches') as CitizenReportType;
    const generatedFolio = `LC-VOZ-${Math.floor(1000 + Math.random() * 9000)}`;

    const now = new Date();
    const dateStr = now.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const newReport: CitizenReport = {
      id: 'rep-voz-' + Date.now(),
      folio: generatedFolio,
      type: validCat,
      title: title || `Reporte de ${validCat} (Dictado por Voz)`,
      description: desc || `Reporte georreferenciado generado automáticamente por comando de voz en Lázaro Cárdenas.`,
      coords: {
        lat: userLocation ? userLocation.lat : 17.9625,
        lng: userLocation ? userLocation.lng : -102.1990,
      },
      address: 'Av. Melchor Ocampo esq. Av. Lázaro Cárdenas, Centro, Lázaro Cárdenas, Michoacán',
      photoUrl: validCat === 'cocodrilos'
        ? 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80'
        : validCat === 'alumbrado'
        ? 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
        : validCat === 'basura'
        ? 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80'
        : 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
      timestamp: 'Justo ahora (Por Voz)',
      exactDate: dateStr,
      exactTime: timeStr,
      headerTitle: 'LC NOVA • EVIDENCIA GEO-VERIFICADA',
      status: 'recibido',
      urgency: validCat === 'cocodrilos' || validCat === 'delincuencia' ? 'critica' : 'media',
      upvotes: 1,
      isSynced: isOnline,
    };

    handleAddReport(newReport);
    setMainPanel('locatario');
    setHighlightCoords(newReport.coords);
    setActiveDetailReport(newReport);
    toneGenerator.playSuccessBeep();
    voiceService.speak(`Reporte automático generado con folio ${generatedFolio}. Se turnó a la cuadrilla municipal de Lázaro Cárdenas.`);
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col ${highContrast ? 'high-contrast' : ''}`}>
      
      {/* ===================== TOP NAVIGATION BAR ===================== */}
      <header className="sticky top-0 z-[1200] bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          
          {/* Logo & LC Nova Identity */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <LCNovaLogo className="w-10 h-10 rounded-xl bg-white p-0.5 shadow-lg shadow-cyan-900/40 shrink-0" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-ping"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                  LC <span className="text-cyan-400">NOVA</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 hidden sm:inline-block">
                  Smart-City
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider">
                LÁZARO CÁRDENAS, MICHOACÁN
              </p>
            </div>
          </div>

          {/* Quick Controls: Offline Toggle, Offline Guide, Ver Ficha, SOS */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Offline Simulator Pill */}
            <button
              onClick={handleToggleOfflineMode}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                isOnline
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80 hover:bg-emerald-900/60'
                  : 'bg-amber-950/80 text-amber-300 border-amber-600 animate-pulse'
              }`}
              title="Simular pérdida de conexión para verificar modo offline"
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-amber-400" />}
              <span className="hidden md:inline">{isOnline ? 'En Línea' : 'Modo Offline'}</span>
              {offlineQueueCount > 0 && (
                <span className="bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px] font-mono">
                  {offlineQueueCount}
                </span>
              )}
            </button>

            {/* Offline Mode Guide Button */}
            <button
              onClick={() => {
                toneGenerator.playSuccessBeep();
                setShowOfflineGuide(true);
              }}
              className="bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-800/80 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow cursor-pointer"
              title="Explicación detallada y funcionamiento del modo offline"
            >
              <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden lg:inline">¿Cómo Funciona el Modo Offline?</span>
            </button>

            {/* Quick View Latest Official Report Button */}
            {reports.length > 0 && (
              <button
                onClick={() => {
                  toneGenerator.playSuccessBeep();
                  setActiveDetailReport(reports[0]);
                }}
                className="bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/60 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow cursor-pointer"
                title="Ver reporte oficial generado con evidencia fotográfica y GPS"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Ver Ficha Oficial</span>
              </button>
            )}

            {/* Fast Emergency SOS */}
            <button
              onClick={() => {
                setActiveTab('seguridad');
                toneGenerator.playAlertBeep();
                voiceService.speak('Módulo de Seguridad y Puntos Naranja activado.');
              }}
              className="bg-red-600 hover:bg-red-500 text-white font-black text-xs px-3.5 py-1.5 rounded-lg shadow-lg shadow-red-950/60 flex items-center gap-1.5 transition animate-pulse cursor-pointer"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>SOS</span>
            </button>
          </div>
        </div>

        {/* ===================== PRIMARY 3-PANEL NAVIGATION BAR ===================== */}
        <div className="border-t border-slate-800 bg-slate-950/80 px-4 sm:px-6 py-2.5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Main Panel Mode Switcher: 3 Panels */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Panel:
              </span>
              <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800 shadow-inner flex-wrap gap-1">
                {/* 1. Panel Turista */}
                <button
                  onClick={() => {
                    setMainPanel('turista');
                    toneGenerator.playSuccessBeep();
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
                    mainPanel === 'turista'
                      ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 shadow-md font-extrabold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Anchor className="w-4 h-4" />
                  <span>1. Panel Turista</span>
                </button>

                {/* 2. Panel Locatario (Ciudadano) */}
                <button
                  onClick={() => {
                    setMainPanel('locatario');
                    toneGenerator.playSuccessBeep();
                    voiceService.speak('Panel del Locatario y Ciudadano activado. Reportes e incidencias disponibles.');
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
                    mainPanel === 'locatario'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md font-extrabold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>2. Panel Locatario (Ciudadano)</span>
                </button>

                {/* 3. Panel Chofer */}
                <button
                  onClick={() => {
                    setMainPanel('chofer');
                    toneGenerator.playSuccessBeep();
                    voiceService.speak('Panel del chofer y operador de transporte activado.');
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
                    mainPanel === 'chofer'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-extrabold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Bus className="w-4 h-4" />
                  <span>3. Panel Chofer</span>
                </button>
              </div>
            </div>

            {/* Tourist Sub-tabs (Only when in Panel Turista: 3 modules) */}
            {mainPanel === 'turista' && (
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
                <button
                  onClick={() => setActiveTab('movilidad')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
                    activeTab === 'movilidad'
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'bg-slate-900/60 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  <Bus className="w-3.5 h-3.5" />
                  <span>1. Combis, Movilidad & Rutas</span>
                </button>

                <button
                  onClick={() => setActiveTab('turismo')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
                    activeTab === 'turismo'
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'bg-slate-900/60 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  <Anchor className="w-3.5 h-3.5" />
                  <span>2. Catálogo Industrias & Turismo</span>
                </button>

                <button
                  onClick={() => setActiveTab('seguridad')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
                    activeTab === 'seguridad'
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'bg-slate-900/60 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>3. Semáforo & Puntos Seguros</span>
                </button>
              </div>
            )}

            {/* Locatario indicator */}
            {mainPanel === 'locatario' && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-800/80 px-3 py-1.5 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="font-bold">MODO LOCATARIO: REPORTES CIUDADANOS, SOBRECUPO & VOZ</span>
              </div>
            )}

            {/* Driver active indicator */}
            {mainPanel === 'chofer' && (
              <div className="flex items-center gap-2 text-xs text-amber-400 font-mono bg-amber-950/40 border border-amber-800/80 px-3 py-1.5 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span className="font-bold">MODO CHOFER: TELEMETRÍA, AFORO & MECÁNICA</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ===================== MAIN CONTENT WRAPPER ===================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 space-y-6 pb-32">
        
        {/* ===================== PANEL 3: CHOFER & OPERADOR SEPARADO ===================== */}
        {mainPanel === 'chofer' && (
          <DriverPanel
            routes={routes}
            units={units}
            onUnitUpdate={(updated) => {
              setUnits((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
            }}
            onAddReinforcementUnit={(routeId) => {
              const newUnit: TransitUnit = {
                id: 'unit-rf-' + Date.now(),
                routeId,
                unitNumber: 'REI-' + Math.floor(10 + Math.random() * 90),
                driverName: 'Refuerzo Municipal',
                driverPhone: '753-532-1000',
                coords: { lat: 17.9625, lng: -102.1990 },
                speedKmH: 35,
                occupancyPercent: 10,
                status: 'reinforcement',
                nextStop: 'Terminal Centro',
                etaMinutes: 2,
                lastUpdated: 'Justo ahora',
              };
              setUnits((prev) => [...prev, newUnit]);
              voiceService.speak('Unidad de refuerzo despachada con éxito.');
            }}
            userLocation={userLocation}
          />
        )}

        {/* ===================== PANEL 2: LOCATARIO & CIUDADANO SEPARADO ===================== */}
        {mainPanel === 'locatario' && (
          <LocatarioPanel
            reports={reports}
            routes={routes}
            units={units}
            onAddReport={handleAddReport}
            onCenterMap={setHighlightCoords}
            isOnline={isOnline}
            userLocation={userLocation}
            onAddReinforcementUnit={(routeId) => {
              const newUnit: TransitUnit = {
                id: 'unit-rf-' + Date.now(),
                routeId,
                unitNumber: 'REI-' + Math.floor(10 + Math.random() * 90),
                driverName: 'Refuerzo Municipal',
                driverPhone: '753-532-1000',
                coords: { lat: 17.9625, lng: -102.1990 },
                speedKmH: 35,
                occupancyPercent: 10,
                status: 'reinforcement',
                nextStop: 'Terminal Centro',
                etaMinutes: 2,
                lastUpdated: 'Justo ahora',
              };
              setUnits((prev) => [...prev, newUnit]);
              voiceService.speak('Unidad de refuerzo municipal despachada con éxito.');
            }}
            onViewReport={(rep) => setActiveDetailReport(rep)}
          />
        )}

        {/* ===================== PANEL 1: TURISTA & MOVILIDAD ===================== */}
        {mainPanel === 'turista' && (
          <>
            {/* 1. PLANIFICADOR DE VIAJE EN LA PARTE SUPERIOR */}
            <section>
              <RouteSearchEngine
                userLocation={userLocation}
                onSetUserLocation={setUserLocation}
                routes={routes}
                units={units}
                onRouteCalculated={handleTraceRoute}
              />
            </section>

            {/* 2. MAPA INTERACTIVO COMPACTO (MÁS PEQUEÑA LA VISTA PARA LOS 3) */}
            <section className="bg-slate-900/60 p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <h2 className="font-extrabold text-sm sm:text-base text-white">
                      Vista Satelital en Tiempo Real (Compacta para Movilidad, Turismo y Seguridad)
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400">
                    Monitoreo GPS de combis, Puntos Naranja C5i y catálogo turístico
                  </p>
                </div>

                {/* Quick Layer Filter Chips & Compact/Expand Toggle */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setActiveLayers({ ...activeLayers, routes: !activeLayers.routes })}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                      activeLayers.routes
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                        : 'bg-slate-900 text-slate-500 border-slate-800'
                    }`}
                  >
                    Rutas
                  </button>

                  <button
                    onClick={() => setActiveLayers({ ...activeLayers, buses: !activeLayers.buses })}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                      activeLayers.buses
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                        : 'bg-slate-900 text-slate-500 border-slate-800'
                    }`}
                  >
                    Combis GPS
                  </button>

                  <button
                    onClick={() => setActiveLayers({ ...activeLayers, safetySemaforo: !activeLayers.safetySemaforo })}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                      activeLayers.safetySemaforo
                        ? 'bg-amber-950 text-amber-300 border-amber-700'
                        : 'bg-slate-900 text-slate-500 border-slate-800'
                    }`}
                  >
                    Semáforo
                  </button>

                  <button
                    onClick={() => setActiveLayers({ ...activeLayers, safePoints: !activeLayers.safePoints })}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                      activeLayers.safePoints
                        ? 'bg-orange-950 text-orange-300 border-orange-700'
                        : 'bg-slate-900 text-slate-500 border-slate-800'
                    }`}
                  >
                    Puntos Naranja
                  </button>

                  {/* Toggle button to expand/collapse satellite map */}
                  <button
                    onClick={() => setIsMapExpanded(!isMapExpanded)}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg border bg-slate-950 text-cyan-300 border-cyan-800 hover:border-cyan-600 transition cursor-pointer ml-1"
                  >
                    {isMapExpanded ? '▲ Vista Pequeña' : '▼ Expandir'}
                  </button>
                </div>
              </div>

              {/* Smaller/Compact Map View as requested */}
              <div className={`${isMapExpanded ? 'h-[440px] sm:h-[480px]' : 'h-[230px] sm:h-[260px]'} rounded-2xl overflow-hidden border border-slate-800 relative transition-all duration-300`}>
                <SmartMap
                  routes={routes}
                  units={units}
                  safetyZones={safetyZones}
                  safePoints={safePoints}
                  reports={reports}
                  selectedRouteId={selectedRouteId}
                  activeLayers={activeLayers}
                  highlightCoords={highlightCoords}
                  userLocationCoords={userLocation}
                  routePlannerCoords={routePlannerCoords}
                  onSelectMapLocation={(coords) => setHighlightCoords(coords)}
                  onSelectSafePoint={(point) => setHighlightCoords(point.coords)}
                />
              </div>
            </section>

            {/* 3. SUB-MODULE CONTENT FOR PANEL TURISTA (3 MODULES) */}
            <section>
              {activeTab === 'movilidad' && (
                <MobilityModule
                  routes={routes}
                  units={units}
                  selectedRouteId={selectedRouteId}
                  userLocation={userLocation}
                  onSetUserLocation={setUserLocation}
                  onSelectRoute={setSelectedRouteId}
                  onCenterMap={(coords) => setHighlightCoords(coords)}
                  onUnitUpdate={(updated) => {
                    setUnits((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
                  }}
                  onAddReinforcementUnit={(routeId) => {
                    const newUnit: TransitUnit = {
                      id: 'unit-rf-' + Date.now(),
                      routeId,
                      unitNumber: 'REI-' + Math.floor(10 + Math.random() * 90),
                      driverName: 'Refuerzo Municipal',
                      driverPhone: '753-532-1000',
                      coords: { lat: 17.9625, lng: -102.1990 },
                      speedKmH: 35,
                      occupancyPercent: 10,
                      status: 'reinforcement',
                      nextStop: 'Terminal Centro',
                      etaMinutes: 2,
                      lastUpdated: 'Justo ahora',
                    };
                    setUnits((prev) => [...prev, newUnit]);
                    voiceService.speak('Unidad de refuerzo despachada con éxito.');
                  }}
                  onAddReport={handleAddReport}
                />
              )}

              {activeTab === 'turismo' && (
                <PortTourismModule
                  catalogItems={catalogItems}
                  currentLanguage={currentLanguage}
                  onLanguageChange={setCurrentLanguage}
                  onSelectLocationOnMap={(coords) => setHighlightCoords(coords)}
                  userLocation={userLocation}
                  routes={routes}
                  units={units}
                />
              )}

              {activeTab === 'seguridad' && (
                <SafetyModule
                  safetyZones={safetyZones}
                  safePoints={safePoints}
                  currentLanguage={currentLanguage}
                  onCenterMap={setHighlightCoords}
                  onActivateSos={() => {
                    const nearest = safePoints[0];
                    setHighlightCoords(nearest.coords);
                  }}
                  userLocation={userLocation}
                />
              )}
            </section>
          </>
        )}
      </main>

      {/* ===================== VOICE ASSISTANT ONLY FOR CITIZEN REPORT (PANEL LOCATARIO) ===================== */}
      {mainPanel === 'locatario' && (
        <VoiceAssistantBar
          currentLanguage={currentLanguage}
          activeTab="reportes"
          onNavigateTab={(tab) => {
            if (['movilidad', 'turismo', 'seguridad', 'reportes'].includes(tab)) {
              if (tab === 'reportes') {
                setMainPanel('locatario');
              } else {
                setMainPanel('turista');
                setActiveTab(tab as any);
              }
            }
          }}
          onQuickAction={(action) => {
            if (action === 'trigger_sos') {
              const nearest = safePoints[0];
              setHighlightCoords(nearest.coords);
            }
          }}
          onAutoReportVoice={handleAutoReportVoice}
          onSearchDestinationVoice={handleSearchDestinationVoice}
          highContrast={highContrast}
          onToggleHighContrast={() => setHighContrast(!highContrast)}
        />
      )}

      {/* ===================== LC NOVA AI CHATBOT ===================== */}
      <LCNovaChatbot />

      {/* ===================== OFFLINE GUIDE & RESILIENCE MODAL ===================== */}
      <OfflineGuideModal
        isOpen={showOfflineGuide}
        onClose={() => setShowOfflineGuide(false)}
        isOnline={isOnline}
        onToggleOffline={handleToggleOfflineMode}
      />

      {/* ===================== REPORT EVIDENCE DETAIL MODAL ===================== */}
      <ReportDetailModal
        report={activeDetailReport}
        onClose={() => setActiveDetailReport(null)}
        onCenterMap={setHighlightCoords}
      />

      {/* ===================== REPORT PRINT PREVIEW MODAL ===================== */}
      <ReportPrintPreviewModal
        report={printPreviewReport}
        onClose={() => setPrintPreviewReport(null)}
      />
    </div>
  );
}
