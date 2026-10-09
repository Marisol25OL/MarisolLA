import React, { useState, useEffect } from 'react';
import { TransitUnit, TransitRoute } from '../types';
import { 
  X, 
  Compass, 
  Gauge, 
  Users, 
  MapPin, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  Radio, 
  Sparkles,
  Camera
} from 'lucide-react';
import { toneGenerator } from '../services/voiceAssistant';

interface StreetView3DProps {
  unit: TransitUnit;
  route?: TransitRoute;
  allUnits: TransitUnit[];
  onSelectUnit: (unit: TransitUnit) => void;
  onClose: () => void;
}

export const StreetView3D: React.FC<StreetView3DProps> = ({
  unit,
  route,
  allUnits,
  onSelectUnit,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [cameraMode, setCameraMode] = useState<'cockpit' | 'chase' | 'window'>('chase');
  const [streetProgress, setStreetProgress] = useState<number>(45); // percent along segment
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);

  // Street names corresponding to Lázaro Cárdenas routes
  const currentStreet = unit.routeId === 'ruta-2' 
    ? 'Acceso Recinto Portuario - Isla del Cayacal' 
    : unit.routeId === 'ruta-3'
    ? 'Boulevard Costero Playa Azul - Lázaro Cárdenas'
    : 'Av. Melchor Ocampo esq. Av. Lázaro Cárdenas (Sector Centro)';

  // Animation ticker for driving perspective
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setStreetProgress((prev) => (prev >= 100 ? 0 : prev + 1.2));
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleHorn = () => {
    toneGenerator.playTone(480, 'sawtooth', 0.2, 0.2);
    setTimeout(() => toneGenerator.playTone(480, 'sawtooth', 0.25, 0.2), 150);
  };

  return (
    <div className="fixed inset-0 z-[3000] bg-slate-950/95 backdrop-blur-xl flex flex-col p-2 sm:p-5 overflow-hidden animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-2xl mb-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center font-bold text-lg">
            3D
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500 text-slate-950">
                VISTA 3D EN CALLES
              </span>
              <span className="text-xs text-slate-400 font-mono">Unidad: {unit.unitNumber}</span>
            </div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Recorrido en Tiempo Real: {currentStreet}
            </h2>
          </div>
        </div>

        {/* Switch combi selector */}
        <div className="flex items-center gap-2">
          <select
            value={unit.id}
            onChange={(e) => {
              const target = allUnits.find(u => u.id === e.target.value);
              if (target) onSelectUnit(target);
            }}
            className="hidden sm:block bg-slate-950 border border-slate-700 text-xs font-semibold text-white px-3 py-1.5 rounded-xl"
          >
            {allUnits.map(u => (
              <option key={u.id} value={u.id}>
                Combi {u.unitNumber} ({u.nextStop})
              </option>
            ))}
          </select>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3D SIMULATION CANVAS / VIEWPORT */}
      <div className="relative flex-1 rounded-2xl overflow-hidden border-2 border-slate-800 bg-slate-950 flex flex-col justify-between shadow-2xl">
        {/* Sky / Port Horizon Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/60 via-slate-900 to-slate-950 pointer-events-none" />

        {/* 3D Distant Port Cranes & Hills */}
        <div className="absolute top-12 left-0 right-0 h-40 pointer-events-none opacity-40 flex items-end justify-between px-10">
          <div className="text-slate-500 text-6xl">🏗️</div>
          <div className="text-slate-600 text-8xl">🚢</div>
          <div className="text-slate-500 text-6xl">🏗️</div>
          <div className="text-slate-600 text-7xl">🌴</div>
        </div>

        {/* 3D Road with Dynamic Perspective & Moving Markings */}
        <div className="absolute inset-x-0 bottom-0 top-28 flex items-end justify-center pointer-events-none overflow-hidden [perspective:800px]">
          {/* Street Road Surface */}
          <div 
            className="w-[120%] h-[75%] bg-gradient-to-t from-slate-900 via-neutral-900 to-slate-800 border-x-8 border-amber-500/80 shadow-2xl origin-bottom"
            style={{
              transform: 'rotateX(58deg)',
              boxShadow: '0 0 80px rgba(0,0,0,0.9) inset',
            }}
          >
            {/* Animated Dashed White Lanes */}
            <div 
              className="absolute inset-y-0 left-1/2 w-3 -ml-1.5 border-r-4 border-dashed border-white/80"
              style={{
                backgroundPosition: `0px ${streetProgress * 20}px`,
                animation: isPlaying ? 'dash-move 0.6s linear infinite' : 'none',
              }}
            />
            {/* Left & Right Curb Lines */}
            <div className="absolute inset-y-0 left-12 w-1 bg-yellow-400/80" />
            <div className="absolute inset-y-0 right-12 w-1 bg-yellow-400/80" />
          </div>

          {/* Palm Trees & Streetlights on the Sides of the Michoacan Coast */}
          <div className="absolute bottom-16 left-8 flex flex-col items-center animate-pulse">
            <span className="text-5xl">🌴</span>
            <div className="w-1.5 h-16 bg-amber-900/80 rounded-full" />
          </div>

          <div className="absolute bottom-28 right-12 flex flex-col items-center">
            <span className="text-6xl">🌴</span>
            <div className="w-2 h-20 bg-amber-900/80 rounded-full" />
          </div>

          {/* 3D VEHICLE MODEL (COMBI DE LÁZARO CÁRDENAS) */}
          {cameraMode === 'chase' && (
            <div 
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center transition-transform duration-300"
              style={{
                transform: `translateX(-50%) scale(${1 + Math.sin(streetProgress / 5) * 0.03})`,
              }}
            >
              {/* Combi Body */}
              <div className="relative w-48 h-32 bg-cyan-600 rounded-t-3xl border-4 border-slate-900 shadow-2xl flex flex-col items-center justify-between p-2">
                {/* Back Window */}
                <div className="w-40 h-14 bg-sky-950/80 rounded-t-xl border-2 border-slate-800 flex items-center justify-between px-3 text-[10px] font-bold text-cyan-300">
                  <span>R1-GUAC</span>
                  <span className="bg-slate-900/90 px-1.5 py-0.5 rounded text-white">LC-402</span>
                  <span>{unit.occupancyPercent}%</span>
                </div>

                {/* Combi License Plate & Rear Lights */}
                <div className="w-full flex items-center justify-between px-2">
                  <div className="w-5 h-7 bg-red-600 rounded border border-white shadow animate-pulse" />
                  <div className="bg-amber-400 text-slate-950 font-mono font-bold text-[10px] px-2 py-0.5 rounded border border-slate-800 shadow">
                    MICHOACÁN LC-402
                  </div>
                  <div className="w-5 h-7 bg-red-600 rounded border border-white shadow animate-pulse" />
                </div>

                {/* Tires */}
                <div className="absolute -bottom-3 left-4 w-8 h-6 bg-slate-950 rounded-md border border-slate-700" />
                <div className="absolute -bottom-3 right-4 w-8 h-6 bg-slate-950 rounded-md border border-slate-700" />
              </div>

              {/* Shadow on asphalt */}
              <div className="w-44 h-4 bg-black/70 blur-sm rounded-full -mt-1" />
            </div>
          )}

          {/* COCKPIT FIRST-PERSON WINDSHIELD */}
          {cameraMode === 'cockpit' && (
            <div className="absolute inset-0 border-[16px] border-slate-950/90 rounded-2xl pointer-events-none flex flex-col justify-end p-6">
              {/* Dashboard HUD & Steering Wheel */}
              <div className="relative w-full flex items-end justify-between">
                <div className="w-32 h-16 bg-slate-900/90 rounded-t-2xl border border-slate-700 p-2 flex flex-col items-center">
                  <span className="text-[10px] text-slate-400">VELOCÍMETRO</span>
                  <span className="text-xl font-bold font-mono text-cyan-400">{unit.speedKmH} km/h</span>
                </div>

                {/* Steering wheel */}
                <div className="w-36 h-36 rounded-full border-8 border-slate-800 bg-slate-950/40 shadow-2xl flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-cyan-400 flex items-center justify-center text-xs font-bold text-white">
                    LC
                  </div>
                </div>

                <div className="w-32 h-16 bg-slate-900/90 rounded-t-2xl border border-slate-700 p-2 flex flex-col items-center">
                  <span className="text-[10px] text-slate-400">PASAJEROS</span>
                  <span className="text-xl font-bold font-mono text-amber-400">{unit.occupancyPercent}%</span>
                </div>
              </div>
            </div>
          )}

          {/* PASSENGER WINDOW VIEW */}
          {cameraMode === 'window' && (
            <div className="absolute inset-0 border-[24px] border-slate-900/80 rounded-2xl pointer-events-none flex items-center justify-center">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-cyan-500/50 text-center">
                <span className="text-xs font-bold text-white">Vista Ventanilla de Pasajero</span>
                <p className="text-[11px] text-cyan-300">Observando comercios y palmeras sobre {currentStreet}</p>
              </div>
            </div>
          )}
        </div>

        {/* TOP FLOATING STREET SIGN & NEXT STOP TICKER */}
        <div className="relative z-20 m-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Official Green Highway Street Sign */}
          <div className="bg-emerald-700 border-2 border-white rounded-xl px-4 py-2 text-white shadow-2xl flex items-center gap-3">
            <span className="text-2xl font-bold">🛣️</span>
            <div>
              <span className="text-[9px] uppercase tracking-wider font-bold block text-emerald-200">
                CALLE ACTUAL (LÁZARO CÁRDENAS)
              </span>
              <h3 className="text-sm font-black text-white tracking-wide">
                {currentStreet}
              </h3>
            </div>
          </div>

          {/* Next Stop HUD */}
          <div className="bg-slate-900/90 backdrop-blur-md border border-cyan-500/60 rounded-xl px-4 py-2 text-white shadow-2xl flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping shrink-0" />
            <div>
              <span className="text-[9px] uppercase tracking-wider font-bold block text-cyan-400">
                PRÓXIMA PARADA DE LA COMBI
              </span>
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{unit.nextStop}</span>
                <span className="text-cyan-400 font-mono">({unit.etaMinutes} min)</span>
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM DASHBOARD CONTROLS */}
        <div className="relative z-20 m-4 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-2xl">
          {/* Camera Angles Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 px-2 font-semibold">CÁMARA:</span>
            <button
              onClick={() => setCameraMode('chase')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                cameraMode === 'chase' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Exterior 3D
            </button>
            <button
              onClick={() => setCameraMode('cockpit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                cameraMode === 'cockpit' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Cabina Chofer
            </button>
            <button
              onClick={() => setCameraMode('window')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                cameraMode === 'window' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Ventanilla
            </button>
          </div>

          {/* Drive Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-slate-800 hover:bg-slate-700 text-white p-2.5 rounded-xl border border-slate-700 transition flex items-center gap-1.5 text-xs font-bold"
            >
              {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
              <span>{isPlaying ? 'Pausar' : 'Avanzar'}</span>
            </button>

            <button
              onClick={handleHorn}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 transition shadow"
              title="Tocar claxon de la combi"
            >
              <span>📢 Claxon</span>
            </button>
          </div>

          {/* Telemetry Readout */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-sans">VELOCIDAD</span>
              <span className="text-cyan-400 font-bold text-sm">{unit.speedKmH} km/h</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-sans">AFORO</span>
              <span className="text-amber-400 font-bold text-sm">{unit.occupancyPercent}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
