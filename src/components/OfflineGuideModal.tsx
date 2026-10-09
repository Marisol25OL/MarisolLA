import React, { useState, useEffect } from 'react';
import { 
  X, 
  Wifi, 
  WifiOff, 
  HardDrive, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Radio, 
  Send, 
  ShieldCheck, 
  HelpCircle,
  Database
} from 'lucide-react';
import { offlineManager, QueuedSyncItem } from '../services/offlineSync';
import { toneGenerator, voiceService } from '../services/voiceAssistant';

interface OfflineGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  isOnline: boolean;
  onToggleOffline: () => void;
}

export const OfflineGuideModal: React.FC<OfflineGuideModalProps> = ({
  isOpen,
  onClose,
  isOnline,
  onToggleOffline,
}) => {
  const [queue, setQueue] = useState<QueuedSyncItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      setQueue(offlineManager.getQueue());
    }
  }, [isOpen, isOnline]);

  if (!isOpen) return null;

  const handleSimulateSync = () => {
    toneGenerator.playSuccessBeep();
    offlineManager.clearQueue();
    setQueue([]);
    voiceService.speak('Sincronización completada. Todos los datos fueron transmitidos al servidor municipal.');
  };

  return (
    <div className="fixed inset-0 z-[2800] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-cyan-500/80 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
              {isOnline ? <Wifi className="w-5 h-5 text-emerald-400" /> : <WifiOff className="w-5 h-5 text-amber-400" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  isOnline 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-700' 
                    : 'bg-amber-500/20 text-amber-300 border-amber-600'
                }`}>
                  {isOnline ? 'CONEXIÓN ACTIVA (ONLINE)' : 'MODO SIN CONEXIÓN (OFFLINE)'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">PWA Cache-First v2.4</span>
              </div>
              <h2 className="text-lg font-black text-white mt-0.5">
                ¿Cómo funciona el Modo Offline de LC Nova?
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Quick Interactive Simulator Bar */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-2">
                <span>Estado de Red Actual:</span>
                <strong className={isOnline ? 'text-emerald-400 font-mono' : 'text-amber-400 font-mono'}>
                  {isOnline ? 'En Línea (Conectado a Red 4G/5G)' : 'Simulación Offline (Sin señal celular)'}
                </strong>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Puedes probar levantar reportes ciudadanos o alertas en zonas costeras sin cobertura.
              </p>
            </div>

            <button
              type="button"
              onClick={onToggleOffline}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition cursor-pointer shrink-0 ${
                isOnline
                  ? 'bg-amber-950/70 hover:bg-amber-900 text-amber-300 border-amber-700'
                  : 'bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border-emerald-700'
              }`}
            >
              {isOnline ? <WifiOff className="w-4 h-4 text-amber-400" /> : <Wifi className="w-4 h-4 text-emerald-400" />}
              <span>{isOnline ? 'Simular Modo Offline' : 'Restablecer Conexión'}</span>
            </button>
          </div>

          {/* 4 Pillars of Offline Mode */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              Funcionamiento y Resiliencia en 4 Pasos:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Step 1 */}
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center text-[10px] font-mono">1</span>
                  <span>Caché Local de Datos Esenciales</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Todos los mapas, catálogos de industrias, rutas de combis, teléfonos de emergencia (911/C5i) y Puntos Naranja están previamente precargados en tu dispositivo mediante CacheStorage. Puedes consultarlos sin gastar datos ni tener internet.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center text-[10px] font-mono">2</span>
                  <span>Captura de Evidencias y GPS Local</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  El GPS de tu teléfono celular funciona vía satélite (no depende de internet). Cuando tomas una foto de un bache o socavón en la Isla del Cayacal, se estampa con fecha, hora y coordenadas geodésicas en el navegador.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center text-[10px] font-mono">3</span>
                  <span>Cola de Espera Segura (LocalStorage)</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Si no hay señal, el reporte no se pierde ni da error. Se almacena de inmediato en una cola encriptada local con folio asignado (ej. <code className="text-cyan-300">LC-2026-...</code>) garantizando que ninguna denuncia ciudadana sea descartada.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center text-[10px] font-mono">4</span>
                  <span>Sincronización Silenciosa Automática</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  El sistema detecta automáticamente cuando sales de la zona sin señal y tu celular recupera cobertura 4G/Wi-Fi. En ese milisegundo, la cola se vacía y se transmiten todas las evidencias al servidor municipal sin intervención del usuario.
                </p>
              </div>
            </div>
          </div>

          {/* Pending Queue Inspector */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Elementos pendientes en cola de sincronización ({queue.length})
                </h4>
              </div>

              {queue.length > 0 && isOnline && (
                <button
                  type="button"
                  onClick={handleSimulateSync}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-3 py-1 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sincronizar Ahora</span>
                </button>
              )}
            </div>

            {queue.length === 0 ? (
              <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400 flex flex-col items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Todo está al día. No hay reportes pendientes de subir.</span>
              </div>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto text-xs">
                {queue.map((item) => (
                  <div key={item.id} className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-cyan-300">
                        {item.type.toUpperCase()}: {item.payload?.folio || item.id}
                      </span>
                      <p className="text-[11px] text-slate-400 truncate max-w-sm">
                        {item.payload?.title || 'Elemento registrado en modo offline'}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                      En cola local
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
