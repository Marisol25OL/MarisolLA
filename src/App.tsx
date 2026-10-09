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
import { AdminReportsPanel } from './components/AdminReportsPanel';
import { HomePanelSelector } from './components/HomePanelSelector';
import { TouristLanguageSelector } from './components/TouristLanguageSelector';
import { t } from './i18n/touristTranslations';
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
  Users,
  LayoutGrid,
  ArrowLeft,
  Lock,
  Radio,
  BellRing,
  HelpCircle
} from 'lucide-react';

export default function App() {
  const [mainPanel, setMainPanel] = useState<'inicio' | 'turista' | 'locatario' | 'chofer' | 'admin'>('inicio');
  const [activeTab, setActiveTab] = useState<'movilidad' | 'turismo' | 'seguridad'>('movilidad');
  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);
  const [showOfflineGuide, setShowOfflineGuide] = useState<boolean>(false);
  const [activeDetailReport, setActiveDetailReport] = useState<CitizenReport | null>(null);
  const [printPreviewReport, setPrintPreviewReport] = useState<CitizenReport | null>(null);

  const [currentLanguage, setCurrentLanguage] = useState<Language>('es');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(0);
  const [userLocation, setUserLocation] = useState<Coordinates>({ lat: 17.9632, lng: -102.1985 });

  const [routes] = useState<TransitRoute[]>(INITIAL_ROUTES);
  const [units, setUnits] = useState<TransitUnit[]>(INITIAL_UNITS);
  const [catalogItems] = useState<CatalogItem[]>(CATALOG_ITEMS);
  const [safetyZones] = useState<SafetyZone[]>(SAFETY_ZONES);
  const [safePoints] = useState<SafePoint[]>(SAFE_POINTS);
  const [reports, setReports] = useState<CitizenReport[]>(INITIAL_REPORTS);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [highlightCoords, setHighlightCoords] = useState<Coordinates | null>(null);
  const [activeLayers] = useState({
    routes: true,
    buses: true,
    safetySemaforo: true,
    safePoints: true,
    reports: true,
  });

  useEffect(() => {
    const unsubscribe = offlineManager.onStatusChange((status) => {
      setIsOnline(status);
      setOfflineQueueCount(offlineManager.getQueue().length);
    });

    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {},
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }

    return () => unsubscribe();
  }, []);

  // Live Unit Movement Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setUnits((prevUnits) =>
        prevUnits.map((u) => ({
          ...u,
          coords: {
            lat: u.coords.lat + (Math.random() - 0.5) * 0.0003,
            lng: u.coords.lng + (Math.random() - 0.5) * 0.0003,
          },
          lastUpdated: 'Justo ahora',
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleOfflineMode = () => {
    const newStatus = offlineManager.toggleSimulatedOffline();
    setIsOnline(newStatus);
    toneGenerator.playSuccessBeep();
    voiceService.speak(newStatus ? 'Conexión reestablecida.' : 'Modo sin conexión activado.');
  };

  const handleAddReport = (newReport: CitizenReport) => {
    setReports((prev) => [newReport, ...prev]);
    toneGenerator.playSuccessBeep();
  };

  const handleAutoReportVoice = (category: string, title?: string, desc?: string) => {
    const validCat = (category || 'baches') as CitizenReportType;
    const generatedFolio = `LC-VOZ-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const newReport: CitizenReport = {
      id: 'rep-voz-' + Date.now(),
      folio: generatedFolio,
      type: validCat,
      title: title || `Reporte de ${validCat} (Voz)`,
      description: desc || `Reporte generado por voz en Lázaro Cárdenas.`,
      coords: userLocation,
      address: 'Centro, Lázaro Cárdenas, Michoacán',
      photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
      timestamp: 'Justo ahora',
      exactDate: now.toLocaleDateString(),
      exactTime: now.toLocaleTimeString(),
      headerTitle: 'LC NOVA • EVIDENCIA VERIFICADA',
      status: 'recibido',
      urgency: 'media',
      upvotes: 1,
      isSynced: isOnline,
    };
    handleAddReport(newReport);
    setMainPanel('locatario');
    setActiveDetailReport(newReport);
    toneGenerator.playSuccessBeep();
  };

  return (
    <div className={`min-h-screen bg-[#FFF6E5] text-[#0B2A3C] flex flex-col w-full max-w-full overflow-x-hidden ${highContrast ? 'high-contrast' : ''}`}>
      
      {/* ===================== HEADER (Antenna, Logo & Admin Padlock) ===================== */}
      <header className="sticky top-0 z-[1200] bg-[#FFF6E5]/95 backdrop-blur-md border-b-3 border-[#0B2A3C] shadow-[0_4px_0_#0B2A3C]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setMainPanel('inicio')}>
            <div className="relative">
              <LCNovaLogo className="w-10 h-10 rounded-2xl bg-white border-2 border-[#0B2A3C] p-0.5 shadow-[2px_2px_0_#0B2A3C] shrink-0" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#7BD84A] border-2 border-[#0B2A3C] animate-ping"></span>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-[#0B2A3C] flex items-center gap-1.5 font-['Bricolage_Grotesque']">
                LC <span className="text-[#FF5A3C]">NOVA</span>
              </span>
              <p className="text-[10px] text-[#0B2A3C]/70 font-mono tracking-wider font-bold">
                LÁZARO CÁRDENAS, MICH.
              </p>
            </div>
          </div>

          {/* Header Controls: Antenna Network Badge & Discreet Admin Padlock */}
          <div className="flex items-center gap-2.5">
            {/* Antenna Status Badge */}
            <button
              onClick={handleToggleOfflineMode}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border-2 border-[#0B2A3C] shadow-[2px_2px_0_#0B2A3C] transition cursor-pointer ${
                isOnline ? 'bg-[#7BD84A] text-[#0B2A3C]' : 'bg-[#FFC21A] text-[#0B2A3C]'
              }`}
              title="Estado de conexión de red"
            >
              <Radio className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isOnline ? 'En línea' : 'Sin conexión · guardado'}</span>
            </button>

            {/* Discreet Admin Padlock */}
            <button
              onClick={() => {
                toneGenerator.playSuccessBeep();
                setMainPanel('admin');
              }}
              className="p-2 rounded-xl bg-white border-2 border-[#0B2A3C] shadow-[2px_2px_0_#0B2A3C] text-[#0B2A3C] hover:bg-[#FFC21A] transition cursor-pointer"
              title="Consola de Administrador"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ===================== DESKTOP SIDEBAR & MAIN BODY ===================== */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 py-6 gap-6">
        
        {/* Desktop Left Sidebar (Navigation) */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 space-y-3 sticky top-24 h-[calc(100vh-7rem)]">
          <div className="sticker-card p-4 space-y-3">
            <h3 className="font-['Bricolage_Grotesque'] text-sm font-bold uppercase tracking-wide text-[#0B2A3C]">Navegación Rápida</h3>
            
            <button
              onClick={() => { setMainPanel('turista'); setActiveTab('movilidad'); toneGenerator.playSuccessBeep(); }}
              className={`w-full sticker-btn p-3 flex items-center gap-3 text-left ${mainPanel === 'turista' && activeTab === 'movilidad' ? 'bg-[#14B8C4] text-white' : 'bg-white text-[#0B2A3C]'}`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#14B8C4] text-white flex items-center justify-center text-xl border-2 border-[#0B2A3C]">🚐</div>
              <div>
                <div className="font-bold">Mi combi</div>
                <div className="text-[11px] opacity-80">Mapa en vivo</div>
              </div>
            </button>

            <button
              onClick={() => { setMainPanel('locatario'); toneGenerator.playSuccessBeep(); }}
              className={`w-full sticker-btn p-3 flex items-center gap-3 text-left ${mainPanel === 'locatario' ? 'bg-[#FFC21A] text-[#0B2A3C]' : 'bg-white text-[#0B2A3C]'}`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#FFC21A] text-[#0B2A3C] flex items-center justify-center text-xl border-2 border-[#0B2A3C]">😵</div>
              <div>
                <div className="font-bold">Va llena</div>
                <div className="text-[11px] opacity-80">Reportar sobrecupo</div>
              </div>
            </button>

            <button
              onClick={() => { setMainPanel('locatario'); toneGenerator.playSuccessBeep(); }}
              className={`w-full sticker-btn p-3 flex items-center gap-3 text-left ${mainPanel === 'locatario' ? 'bg-[#B779FF] text-white' : 'bg-white text-[#0B2A3C]'}`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#B779FF] text-white flex items-center justify-center text-xl border-2 border-[#0B2A3C]">📣</div>
              <div>
                <div className="font-bold">Reportar</div>
                <div className="text-[11px] opacity-80">Incidencias urbanas</div>
              </div>
            </button>

            <button
              onClick={() => { setMainPanel('turista'); setActiveTab('seguridad'); toneGenerator.playAlertBeep(); }}
              className={`w-full sticker-btn p-3 flex items-center gap-3 text-left ${mainPanel === 'turista' && activeTab === 'seguridad' ? 'bg-[#E5233B] text-white' : 'bg-white text-[#0B2A3C]'}`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#E5233B] text-white flex items-center justify-center text-xl border-2 border-[#0B2A3C]">🆘</div>
              <div>
                <div className="font-bold">Ayuda</div>
                <div className="text-[11px] opacity-80">Emergencia SOS</div>
              </div>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 space-y-6 pb-28 sm:pb-32">
          
          {/* Breadcrumb / Return to start */}
          {mainPanel !== 'inicio' && (
            <div className="sticker-card p-3 flex items-center justify-between text-xs">
              <button
                onClick={() => { setMainPanel('inicio'); toneGenerator.playSuccessBeep(); }}
                className="font-bold flex items-center gap-2 cursor-pointer text-[#0B2A3C]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>← Volver al inicio</span>
              </button>
              <span className="font-mono uppercase font-bold px-2.5 py-1 rounded-lg bg-[#FFC21A] border-2 border-[#0B2A3C]">
                Panel: {mainPanel}
              </span>
            </div>
          )}

          {/* Panels Rendering */}
          {mainPanel === 'inicio' && (
            <div className="animate-in fade-in duration-300">
              <HomePanelSelector
                onSelectPanel={(panel) => { setMainPanel(panel); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                activePanel={mainPanel}
                unitCount={units.length}
                reportCount={reports.length}
              />
            </div>
          )}

          {mainPanel === 'chofer' && (
            <DriverPanel
              routes={routes}
              units={units}
              onUnitUpdate={(updated) => setUnits(prev => prev.map(u => u.id === updated.id ? updated : u))}
              onAddReinforcementUnit={() => {}}
              userLocation={userLocation}
            />
          )}

          {mainPanel === 'admin' && (
            <AdminReportsPanel
              reports={reports}
              onUpdateReport={(updated) => setReports(prev => prev.map(r => r.id === updated.id ? updated : r))}
              onViewReport={setActiveDetailReport}
              onPrintReport={setPrintPreviewReport}
              onCenterMap={setHighlightCoords}
              onBackToLocatario={() => setMainPanel('locatario')}
              onOpenFullScreen={() => setMainPanel('admin')}
            />
          )}

          {mainPanel === 'locatario' && (
            <LocatarioPanel
              reports={reports}
              routes={routes}
              units={units}
              onAddReport={handleAddReport}
              onCenterMap={setHighlightCoords}
              isOnline={isOnline}
              userLocation={userLocation}
              onAddReinforcementUnit={() => {}}
            />
          )}

          {mainPanel === 'turista' && (
            <div className="space-y-6">
              {/* Map Section */}
              <div className="sticker-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-['Bricolage_Grotesque'] text-lg font-bold flex items-center gap-2">
                    <span>🗺️ Mapa en Vivo - Lázaro Cárdenas</span>
                  </h2>
                  <button
                    onClick={() => setIsMapExpanded(!isMapExpanded)}
                    className="sticker-btn px-3 py-1 text-xs bg-[#FFC21A] text-[#0B2A3C]"
                  >
                    {isMapExpanded ? 'Reducir mapa' : 'Ampliar mapa'}
                  </button>
                </div>
                <div className={`${isMapExpanded ? 'h-[380px]' : 'h-[220px]'}`}>
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
                    onSelectMapLocation={setHighlightCoords}
                    onSelectSafePoint={(p) => setHighlightCoords(p.coords)}
                  />
                </div>
              </div>

              {/* Sub-modules */}
              <div>
                {activeTab === 'movilidad' && (
                  <MobilityModule
                    routes={routes}
                    units={units}
                    selectedRouteId={selectedRouteId}
                    userLocation={userLocation}
                    onSetUserLocation={setUserLocation}
                    onSelectRoute={setSelectedRouteId}
                    onCenterMap={setHighlightCoords}
                    onUnitUpdate={(updated) => setUnits(prev => prev.map(u => u.id === updated.id ? updated : u))}
                    onAddReinforcementUnit={() => {}}
                    onAddReport={handleAddReport}
                    currentLanguage={currentLanguage}
                  />
                )}
                {activeTab === 'turismo' && (
                  <PortTourismModule
                    catalogItems={catalogItems}
                    currentLanguage={currentLanguage}
                    onLanguageChange={setCurrentLanguage}
                    onSelectLocationOnMap={setHighlightCoords}
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
                    onActivateSos={() => setHighlightCoords(safePoints[0].coords)}
                    userLocation={userLocation}
                  />
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ===================== FIXED BOTTOM NAVIGATION BAR (Combi Vivo Style) ===================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-[1300] bg-[#FFF6E5] border-t-3 border-[#0B2A3C] shadow-[0_-4px_0_#0B2A3C] px-3 py-2 sm:hidden">
        <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
          
          {/* 1. Mi combi (Turquesa) */}
          <button
            onClick={() => {
              setMainPanel('turista');
              setActiveTab('movilidad');
              toneGenerator.playSuccessBeep();
            }}
            className={`sticker-btn flex flex-col items-center justify-center py-2 h-16 ${
              mainPanel === 'turista' && activeTab === 'movilidad'
                ? 'bg-[#14B8C4] text-white scale-105'
                : 'bg-white text-[#0B2A3C]'
            }`}
          >
            <span className="text-xl">🚐</span>
            <span className="text-[11px] font-bold font-['Bricolage_Grotesque']">Mi combi</span>
          </button>

          {/* 2. Va llena (Mango) */}
          <button
            onClick={() => {
              setMainPanel('locatario');
              toneGenerator.playSuccessBeep();
            }}
            className={`sticker-btn flex flex-col items-center justify-center py-2 h-16 ${
              mainPanel === 'locatario'
                ? 'bg-[#FFC21A] text-[#0B2A3C] scale-105'
                : 'bg-white text-[#0B2A3C]'
            }`}
          >
            <span className="text-xl">😵</span>
            <span className="text-[11px] font-bold font-['Bricolage_Grotesque']">Va llena</span>
          </button>

          {/* 3. Reportar (Orquídea) */}
          <button
            onClick={() => {
              setMainPanel('locatario');
              toneGenerator.playSuccessBeep();
            }}
            className={`sticker-btn flex flex-col items-center justify-center py-2 h-16 ${
              mainPanel === 'locatario'
                ? 'bg-[#B779FF] text-white scale-105'
                : 'bg-white text-[#0B2A3C]'
            }`}
          >
            <span className="text-xl">📣</span>
            <span className="text-[11px] font-bold font-['Bricolage_Grotesque']">Reportar</span>
          </button>

          {/* 4. Ayuda (Rojo) */}
          <button
            onClick={() => {
              setMainPanel('turista');
              setActiveTab('seguridad');
              toneGenerator.playAlertBeep();
            }}
            className={`sticker-btn flex flex-col items-center justify-center py-2 h-16 ${
              mainPanel === 'turista' && activeTab === 'seguridad'
                ? 'bg-[#E5233B] text-white scale-105'
                : 'bg-white text-[#0B2A3C]'
            }`}
          >
            <span className="text-xl">🆘</span>
            <span className="text-[11px] font-bold font-['Bricolage_Grotesque']">Ayuda</span>
          </button>

        </div>
      </nav>

      {/* Chatbot & Modals */}
      <LCNovaChatbot />
      <OfflineGuideModal isOpen={showOfflineGuide} onClose={() => setShowOfflineGuide(false)} isOnline={isOnline} onToggleOffline={handleToggleOfflineMode} />
      <ReportDetailModal report={activeDetailReport} onClose={() => setActiveDetailReport(null)} onCenterMap={setHighlightCoords} />
      <ReportPrintPreviewModal report={printPreviewReport} onClose={() => setPrintPreviewReport(null)} />
    </div>
  );
}
