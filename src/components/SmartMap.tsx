import React, { useEffect, useState, useMemo } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  InfoWindow, 
  useMap 
} from '@vis.gl/react-google-maps';
import { 
  TransitRoute, 
  TransitUnit, 
  SafetyZone, 
  SafePoint, 
  CitizenReport, 
  Coordinates 
} from '../types';
import { 
  Bus, 
  ShieldCheck, 
  AlertTriangle, 
  MapPin, 
  Navigation, 
  Layers, 
  Sparkles,
  Users,
  Compass,
  Phone,
  Clock,
  Maximize2
} from 'lucide-react';

interface SmartMapProps {
  routes: TransitRoute[];
  units: TransitUnit[];
  safetyZones: SafetyZone[];
  safePoints: SafePoint[];
  reports: CitizenReport[];
  selectedRouteId: string | null;
  activeLayers: {
    routes: boolean;
    buses: boolean;
    safetySemaforo: boolean;
    safePoints: boolean;
    reports: boolean;
  };
  highlightCoords?: Coordinates | null;
  userLocationCoords?: Coordinates | null;
  routePlannerCoords?: { 
    origin: Coordinates; 
    destination: Coordinates; 
    walkingPath?: Coordinates[]; 
    transitPath?: Coordinates[] 
  } | null;
  onSelectMapLocation?: (coords: Coordinates) => void;
  onSelectSafePoint?: (point: SafePoint) => void;
  onSelectReport?: (report: CitizenReport) => void;
  onSelectUnit?: (unit: TransitUnit) => void;
}

// Custom Polyline Component for Google Maps
function GoogleMapPolyline({
  path,
  color = '#06b6d4',
  weight = 4,
  opacity = 0.85,
  isDashed = false,
}: {
  path: Coordinates[];
  color?: string;
  weight?: number;
  opacity?: number;
  isDashed?: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    const win = window as any;
    if (!map || !win.google?.maps || !path || path.length < 2) return;

    const lineSymbol = isDashed
      ? {
          path: 'M 0,-1 0,1',
          strokeOpacity: 1,
          scale: 3,
        }
      : undefined;

    const polyline = new win.google.maps.Polyline({
      path: path.map(p => ({ lat: p.lat, lng: p.lng })),
      geodesic: true,
      strokeColor: color,
      strokeOpacity: isDashed ? 0 : opacity,
      strokeWeight: weight,
      icons: isDashed && lineSymbol
        ? [
            {
              icon: lineSymbol,
              offset: '0',
              repeat: '12px',
            },
          ]
        : undefined,
      map,
    });

    return () => {
      polyline.setMap(null);
    };
  }, [map, path, color, weight, opacity, isDashed]);

  return null;
}

// Custom Polygon Component for Google Maps (Safety Zones Semáforo)
function GoogleMapPolygon({
  paths,
  strokeColor = '#10b981',
  strokeWeight = 3,
  fillColor = '#10b981',
  fillOpacity = 0.25,
  onClick,
}: {
  paths: Coordinates[];
  strokeColor?: string;
  strokeWeight?: number;
  fillColor?: string;
  fillOpacity?: number;
  onClick?: () => void;
}) {
  const map = useMap();

  useEffect(() => {
    const win = window as any;
    if (!map || !win.google?.maps || !paths || paths.length < 3) return;

    const polygon = new win.google.maps.Polygon({
      paths: paths.map(p => ({ lat: p.lat, lng: p.lng })),
      strokeColor,
      strokeOpacity: 0.9,
      strokeWeight,
      fillColor,
      fillOpacity,
      map,
    });

    if (onClick) {
      polygon.addListener('click', onClick);
    }

    return () => {
      polygon.setMap(null);
    };
  }, [map, paths, strokeColor, strokeWeight, fillColor, fillOpacity, onClick]);

  return null;
}

// Controller to smoothly pan to highlighted coordinates or center
function MapCameraController({
  highlightCoords,
  centerCoords,
}: {
  highlightCoords?: Coordinates | null;
  centerCoords: Coordinates;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (highlightCoords) {
      map.panTo({ lat: highlightCoords.lat, lng: highlightCoords.lng });
      map.setZoom(15);
    }
  }, [map, highlightCoords]);

  return null;
}

export const SmartMap: React.FC<SmartMapProps> = ({
  routes,
  units,
  safetyZones,
  safePoints,
  reports,
  selectedRouteId,
  activeLayers,
  highlightCoords,
  userLocationCoords,
  routePlannerCoords,
  onSelectMapLocation,
  onSelectSafePoint,
  onSelectReport,
  onSelectUnit,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Initial center: Centro Lázaro Cárdenas, Michoacán
  const initialCenter = useMemo(() => ({ lat: 17.9625, lng: -102.1990 }), []);

  // Map Type state (Satellite Hybrid by default as user requested real satellite view)
  const [mapTypeId, setMapTypeId] = useState<'hybrid' | 'roadmap' | 'satellite' | 'terrain'>('hybrid');

  // Selected item for InfoWindow
  const [selectedItem, setSelectedItem] = useState<{
    type: 'unit' | 'safepoint' | 'report' | 'planner' | 'user';
    position: Coordinates;
    data: any;
  } | null>(null);

  // Active route filtered
  const activeRoutesToRender = useMemo(() => {
    if (selectedRouteId) {
      return routes.filter(r => r.id === selectedRouteId);
    }
    return routes;
  }, [routes, selectedRouteId]);

  return (
    <div className="relative w-full h-full min-h-[440px] rounded-xl overflow-hidden shadow-2xl bg-slate-950">
      {/* Top Map Type Toolbar */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 shadow-lg text-xs">
        <span className="text-slate-400 font-bold px-1.5 flex items-center gap-1 text-[11px]">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          Vista Google Maps:
        </span>
        <button
          onClick={() => setMapTypeId('hybrid')}
          className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${
            mapTypeId === 'hybrid'
              ? 'bg-cyan-500 text-slate-950 shadow'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          Satelital Híbrido
        </button>
        <button
          onClick={() => setMapTypeId('roadmap')}
          className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${
            mapTypeId === 'roadmap'
              ? 'bg-cyan-500 text-slate-950 shadow'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          Calles
        </button>
        <button
          onClick={() => setMapTypeId('terrain')}
          className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${
            mapTypeId === 'terrain'
              ? 'bg-cyan-500 text-slate-950 shadow'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          Relieve
        </button>
      </div>

      {/* Live Status Badge */}
      <div className="absolute bottom-3 left-3 z-10 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-800/80 text-[11px] font-mono text-cyan-300 flex items-center gap-2 shadow-lg">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span>Google Maps Satelital Oficial • Lázaro Cárdenas, Mich.</span>
      </div>

      <APIProvider apiKey={apiKey} language="es" region="MX">
        <Map
          defaultCenter={initialCenter}
          defaultZoom={13}
          mapId="DEMO_MAP_ID"
          mapTypeId={mapTypeId}
          gestureHandling="greedy"
          disableDefaultUI={false}
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          onClick={(e) => {
            if (e.detail?.latLng && onSelectMapLocation) {
              onSelectMapLocation({
                lat: Number(e.detail.latLng.lat.toFixed(5)),
                lng: Number(e.detail.latLng.lng.toFixed(5)),
              });
            }
          }}
        >
          {/* Map Camera Controller */}
          <MapCameraController highlightCoords={highlightCoords} centerCoords={initialCenter} />

          {/* 1. ROUTE POLYLINES */}
          {activeLayers.routes &&
            activeRoutesToRender.map((route) => {
              const fullPath: Coordinates[] = route.stops.map((s) => s.coords);
              return (
                <GoogleMapPolyline
                  key={route.id}
                  path={fullPath}
                  color={route.color || '#06b6d4'}
                  weight={selectedRouteId === route.id ? 6 : 4}
                  opacity={selectedRouteId === route.id ? 0.95 : 0.75}
                />
              );
            })}

          {/* 2. ROUTE PLANNER WALKING & TRANSIT POLYLINES */}
          {routePlannerCoords && (
            <>
              {routePlannerCoords.walkingPath && (
                <GoogleMapPolyline
                  path={routePlannerCoords.walkingPath}
                  color="#94a3b8"
                  weight={4}
                  isDashed={true}
                />
              )}
              {routePlannerCoords.transitPath && (
                <GoogleMapPolyline
                  path={routePlannerCoords.transitPath}
                  color="#3b82f6"
                  weight={6}
                  opacity={0.95}
                />
              )}
              <AdvancedMarker position={routePlannerCoords.origin}>
                <div className="bg-emerald-500 text-slate-950 p-1.5 rounded-full border-2 border-white shadow-xl flex items-center justify-center">
                  <Navigation className="w-4 h-4 text-slate-950 font-bold" />
                </div>
              </AdvancedMarker>
              <AdvancedMarker position={routePlannerCoords.destination}>
                <div className="bg-red-500 text-white p-1.5 rounded-full border-2 border-white shadow-xl flex items-center justify-center animate-bounce">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
              </AdvancedMarker>
            </>
          )}

          {/* 3. USER CURRENT LOCATION PIN */}
          {userLocationCoords && (
            <AdvancedMarker position={userLocationCoords}>
              <div className="relative flex items-center justify-center cursor-pointer">
                <span className="absolute w-8 h-8 rounded-full bg-cyan-400/30 animate-ping"></span>
                <div className="w-6 h-6 rounded-full bg-cyan-500 border-2 border-white shadow-xl flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                </div>
              </div>
            </AdvancedMarker>
          )}

          {/* 3.1. SEMÁFORO DE SEGURIDAD ZONAL (POLÍGONOS Y ETIQUETAS ULTRA-CLARAS) */}
          {activeLayers.safetySemaforo &&
            safetyZones.map((zone) => {
              const color = zone.riskLevel === 'green' ? '#10b981' : zone.riskLevel === 'yellow' ? '#f59e0b' : '#ef4444';
              const center = zone.polygon[0];

              return (
                <React.Fragment key={zone.id}>
                  <GoogleMapPolygon
                    paths={zone.polygon}
                    strokeColor={color}
                    strokeWeight={3}
                    fillColor={color}
                    fillOpacity={0.25}
                  />
                  <AdvancedMarker position={center}>
                    <div className="cursor-pointer select-none">
                      <div className={`px-2 py-1 rounded-full text-slate-950 font-black text-[10px] font-mono shadow-2xl border-2 border-white flex items-center gap-1 ${
                        zone.riskLevel === 'green' 
                          ? 'bg-emerald-400' 
                          : zone.riskLevel === 'yellow' 
                          ? 'bg-amber-400' 
                          : 'bg-red-500 text-white'
                      }`}>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>SEMÁFORO {zone.riskLevel.toUpperCase()}: {zone.score}/100</span>
                      </div>
                    </div>
                  </AdvancedMarker>
                </React.Fragment>
              );
            })}

          {/* 4. TRANSIT UNITS (COMBIS & CAMIONES EN VIVO) */}
          {activeLayers.buses &&
            units.map((unit) => {
              const isBreakdown = unit.status === 'breakdown';
              const isReinforcement = unit.status === 'reinforcement';

              return (
                <AdvancedMarker
                  key={unit.id}
                  position={unit.coords}
                  title={`Unidad ${unit.unitNumber}`}
                  onClick={() => {
                    setSelectedItem({
                      type: 'unit',
                      position: unit.coords,
                      data: unit,
                    });
                    onSelectUnit?.(unit);
                  }}
                >
                  <div className="cursor-pointer group select-none">
                    <div
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-white font-bold text-xs shadow-2xl border-2 transition transform group-hover:scale-110 ${
                        isBreakdown
                          ? 'bg-red-600 border-red-300 animate-pulse'
                          : isReinforcement
                          ? 'bg-purple-600 border-purple-300'
                          : 'bg-slate-900 border-cyan-400'
                      }`}
                    >
                      <Bus className="w-3.5 h-3.5 text-cyan-300" />
                      <span>{unit.unitNumber}</span>
                      <span className="text-[10px] bg-cyan-500/30 text-cyan-200 px-1 rounded font-mono">
                        {unit.speedKmH} km/h
                      </span>
                    </div>
                  </div>
                </AdvancedMarker>
              );
            })}

          {/* 5. SAFE POINTS (PUNTOS NARANJA) */}
          {activeLayers.safePoints &&
            safePoints.map((pt) => (
              <AdvancedMarker
                key={pt.id}
                position={pt.coords}
                title={pt.name}
                onClick={() => {
                  setSelectedItem({
                    type: 'safepoint',
                    position: pt.coords,
                    data: pt,
                  });
                  onSelectSafePoint?.(pt);
                }}
              >
                <div className="cursor-pointer group select-none">
                  <div className="bg-amber-500 text-slate-950 p-1.5 rounded-full border-2 border-white shadow-xl flex items-center justify-center transition transform group-hover:scale-125">
                    <ShieldCheck className="w-4 h-4 text-slate-950 font-bold" />
                  </div>
                </div>
              </AdvancedMarker>
            ))}

          {/* 6. CITIZEN REPORTS */}
          {activeLayers.reports &&
            reports.map((rep) => (
              <AdvancedMarker
                key={rep.id}
                position={rep.coords}
                title={rep.title}
                onClick={() => {
                  setSelectedItem({
                    type: 'report',
                    position: rep.coords,
                    data: rep,
                  });
                  onSelectReport?.(rep);
                }}
              >
                <div className="cursor-pointer group select-none">
                  <div
                    className={`p-1.5 rounded-full border-2 border-white shadow-xl flex items-center justify-center transition transform group-hover:scale-125 ${
                      rep.type === 'cocodrilos'
                        ? 'bg-emerald-600 text-white'
                        : rep.type === 'baches'
                        ? 'bg-amber-600 text-white'
                        : rep.type === 'delincuencia'
                        ? 'bg-red-600 text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                </div>
              </AdvancedMarker>
            ))}

          {/* 7. POPUP / INFO WINDOW */}
          {selectedItem && (
            <InfoWindow
              position={selectedItem.position}
              onCloseClick={() => setSelectedItem(null)}
            >
              <div className="text-slate-900 p-2 max-w-xs text-xs font-sans">
                {selectedItem.type === 'unit' && (
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-sm text-cyan-900 border-b pb-1 mb-1.5">
                      <Bus className="w-4 h-4 text-cyan-600" />
                      <span>Combi / Unidad {selectedItem.data.unitNumber}</span>
                    </div>
                    <p className="text-slate-700 font-semibold mb-1">
                      Chofer: {selectedItem.data.driverName}
                    </p>
                    <p className="text-slate-600">
                      Próxima parada: <strong>{selectedItem.data.nextStop}</strong>
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-1 border-t text-[11px]">
                      <span className="text-slate-600 font-mono">
                        ETA: <strong>{selectedItem.data.etaMinutes} min</strong>
                      </span>
                      <span className="text-slate-600 font-mono">
                        Ocupación: <strong>{selectedItem.data.occupancyPercent}%</strong>
                      </span>
                    </div>
                  </div>
                )}

                {selectedItem.type === 'safepoint' && (
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-sm text-amber-800 border-b pb-1 mb-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      <span>{selectedItem.data.name}</span>
                    </div>
                    <p className="text-slate-700 mb-1">{selectedItem.data.description}</p>
                    <p className="text-slate-600 text-[11px] mb-1">
                      📍 {selectedItem.data.address}
                    </p>
                    <div className="mt-2 bg-amber-50 p-1.5 rounded border border-amber-200 text-amber-900 font-bold text-[11px]">
                      Línea Directa: {selectedItem.data.phone}
                    </div>
                  </div>
                )}

                {selectedItem.type === 'report' && (
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-sm text-red-800 border-b pb-1 mb-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span>Reporte #{selectedItem.data.folio}</span>
                    </div>
                    <p className="font-semibold text-slate-800">{selectedItem.data.title}</p>
                    <p className="text-slate-600 text-[11px] mt-1">{selectedItem.data.description}</p>
                    <div className="mt-2 text-[10px] text-slate-500 font-mono">
                      Estado: {selectedItem.data.status.toUpperCase()}
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectReport?.(selectedItem.data)}
                      className="mt-2.5 w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-1.5 px-2.5 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow transition cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Ver Ficha de Evidencia Geo-Verificada</span>
                    </button>
                  </div>
                )}
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
};
