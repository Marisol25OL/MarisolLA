import React, { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Eye, 
  Send,
  X,
  ChevronDown,
  Radio,
  CheckCircle2,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { voiceService, VoiceCommandResult, toneGenerator } from '../services/voiceAssistant';
import { Language } from '../types';

interface VoiceAssistantBarProps {
  currentLanguage: Language;
  activeTab: string;
  onNavigateTab: (tab: string) => void;
  onQuickAction: (action: string, param?: string) => void;
  onAutoReportVoice: (category: string, title?: string, desc?: string) => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  onSearchDestinationVoice?: (dest: string) => void;
}

export const VoiceAssistantBar: React.FC<VoiceAssistantBarProps> = ({
  currentLanguage,
  activeTab,
  onNavigateTab,
  onQuickAction,
  onAutoReportVoice,
  highContrast,
  onToggleHighContrast,
  onSearchDestinationVoice,
}) => {
  // Ultra-compact state: ONLY show microphone button by default
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState<string>('');

  const toggleMicAndExpand = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      startVoiceListening();
    } else {
      if (isListening) {
        voiceService.stopListening();
        setIsListening(false);
      } else {
        startVoiceListening();
      }
    }
  };

  const startVoiceListening = () => {
    setTranscript('Escuchando tu voz... Habla ahora.');
    setFeedbackMessage(null);
    setIsListening(true);

    const started = voiceService.startListening(
      (interim) => {
        setTranscript(`"${interim}"`);
      },
      (finalText, result) => {
        setTranscript(`"${finalText}"`);
        setIsListening(false);
        handleExecuteVoiceCommand(result);
      },
      (err) => {
        setIsListening(false);
        setFeedbackMessage(err);
      },
      () => {
        setIsListening(false);
      }
    );

    if (!started) {
      setIsListening(false);
    }
  };

  const handleExecuteVoiceCommand = (result: VoiceCommandResult) => {
    setFeedbackMessage(result.message);

    // AUTO-REPORT EXECUTION (User requested: "al momento de que detecte mi voz haga el reporte en automatico")
    if (result.action === 'auto_report' && result.category) {
      onAutoReportVoice(result.category, result.reportTitle, result.reportDescription);
      return;
    }

    voiceService.speak(result.message);

    if (result.action === 'navigate' && result.targetTab) {
      onNavigateTab(result.targetTab);
    } else if (result.action === 'search_route' && result.destinationQuery) {
      onNavigateTab('movilidad');
      onSearchDestinationVoice?.(result.destinationQuery);
    } else if (result.action === 'report' && result.category) {
      onAutoReportVoice(result.category);
    } else if (result.action === 'sos') {
      onNavigateTab('seguridad');
      onQuickAction('trigger_sos');
    } else if (result.action === 'speak_status') {
      readCurrentScreen();
    }
  };

  const readCurrentScreen = () => {
    setIsSpeaking(true);
    toneGenerator.playSuccessBeep();

    let textToRead = '';
    if (activeTab === 'movilidad') {
      textToRead = 'Estás en Movilidad. Arriba tienes el Planificador de Viaje para buscar qué combi tomar y el mapa satelital de Google Maps.';
    } else if (activeTab === 'turismo') {
      textToRead = 'Estás en Catálogo Portuario y Turismo: Aduanas, ASIPONA, ArcelorMittal, playas, campamentos tortugueros y hospitales.';
    } else if (activeTab === 'seguridad') {
      textToRead = 'Estás en Seguridad: Semáforo y Puntos Naranja verificados de auxilio.';
    } else if (activeTab === 'reportes') {
      textToRead = 'Estás en Reporte Ciudadano: Baches, luminarias, basura, cocodrilos y semáforos.';
    }

    voiceService.speak(textToRead, 'es-MX', () => {
      setIsSpeaking(false);
    });
  };

  const handleQuickCommand = (phrase: string) => {
    setTranscript(`"${phrase}"`);
    const parsed = voiceService.parseCommand(phrase);
    handleExecuteVoiceCommand(parsed);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    const phrase = manualInput.trim();
    setManualInput('');
    handleQuickCommand(phrase);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-[1500] flex flex-col items-end max-w-[calc(100vw-2rem)]">
      {/* ===================== EXPANDED VOICE ASSISTANT MODAL / PANEL ===================== */}
      {isExpanded && (
        <div className="mb-3 w-[calc(100vw-2rem)] sm:w-96 max-w-sm bg-slate-900/95 border-2 border-cyan-500/90 rounded-2xl p-3.5 sm:p-4 shadow-2xl backdrop-blur-2xl text-xs space-y-3 animate-in fade-in slide-from-bottom-4 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${isListening ? 'bg-red-500 animate-ping' : 'bg-cyan-400'}`}></span>
              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                  Asistente de Voz Inteligente
                  <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800 font-mono">
                    {isListening ? 'ESCUCHANDO' : 'ACTIVO'}
                  </span>
                </h4>
                <p className="text-[10px] text-slate-400">
                  Detección inmediata y reportes automáticos
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                voiceService.stopListening();
                setIsListening(false);
                setIsExpanded(false);
              }}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              title="Minimizar botón"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Transcript / Listening Visualizer */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400">
                {isListening ? '🎙️ Habla ahora (reporta o pide una ruta):' : 'Última instrucción:'}
              </span>
              <button
                onClick={startVoiceListening}
                className="text-[10px] font-bold text-cyan-400 hover:underline flex items-center gap-1"
              >
                <Radio className="w-3 h-3" /> Reiniciar escucha
              </button>
            </div>
            <p className="text-white font-mono text-xs italic bg-slate-900 p-2 rounded-lg border border-slate-800/80 min-h-[36px] flex items-center">
              {transcript || 'Di algo como: "Reportar bache", "Vi un cocodrilo", "Combi a la aduana"...'}
            </p>
          </div>

          {/* Quick 1-Click Auto-Report Pills (Requested: Automatic Reports) */}
          <div>
            <span className="text-[11px] font-bold text-slate-300 block mb-1.5">
              ⚡ Reportes Automáticos por Voz (1 Toque):
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleQuickCommand('reportar bache')}
                className="text-[11px] font-semibold bg-slate-950 hover:bg-amber-950/40 text-amber-300 hover:border-amber-500/80 p-2 rounded-lg border border-slate-800 text-left transition flex items-center gap-1.5"
              >
                <span>🕳️</span>
                <span className="truncate">Auto-Reportar Bache</span>
              </button>

              <button
                onClick={() => handleQuickCommand('reportar cocodrilo')}
                className="text-[11px] font-semibold bg-slate-950 hover:bg-emerald-950/40 text-emerald-300 hover:border-emerald-500/80 p-2 rounded-lg border border-slate-800 text-left transition flex items-center gap-1.5"
              >
                <span>🐊</span>
                <span className="truncate">Auto-Reportar Cocodrilo</span>
              </button>

              <button
                onClick={() => handleQuickCommand('reportar alumbrado')}
                className="text-[11px] font-semibold bg-slate-950 hover:bg-blue-950/40 text-blue-300 hover:border-blue-500/80 p-2 rounded-lg border border-slate-800 text-left transition flex items-center gap-1.5"
              >
                <span>💡</span>
                <span className="truncate">Auto-Reportar Alumbrado</span>
              </button>

              <button
                onClick={() => handleQuickCommand('reportar basura')}
                className="text-[11px] font-semibold bg-slate-950 hover:bg-cyan-950/40 text-cyan-300 hover:border-cyan-500/80 p-2 rounded-lg border border-slate-800 text-left transition flex items-center gap-1.5"
              >
                <span>🗑️</span>
                <span className="truncate">Auto-Reportar Basura</span>
              </button>
            </div>
          </div>

          {/* Navigation & Safety Quick Commands */}
          <div>
            <span className="text-[11px] font-bold text-slate-300 block mb-1.5">
              🗺️ Consultas Rápidas de Movilidad y Seguridad:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => handleQuickCommand('Cómo llego a la aduana')}
                className="text-[11px] bg-slate-950 text-slate-300 hover:text-cyan-400 px-2.5 py-1.5 rounded-lg border border-slate-800 transition cursor-pointer"
              >
                "Combi a la Aduana"
              </button>
              <button
                onClick={() => handleQuickCommand('Cómo llego a ArcelorMittal')}
                className="text-[11px] bg-slate-950 text-slate-300 hover:text-cyan-400 px-2.5 py-1.5 rounded-lg border border-slate-800 transition cursor-pointer"
              >
                "Combi a Siderúrgica"
              </button>
              <button
                onClick={() => handleQuickCommand('Cómo llego al hospital')}
                className="text-[11px] bg-slate-950 text-slate-300 hover:text-cyan-400 px-2.5 py-1.5 rounded-lg border border-slate-800 transition cursor-pointer"
              >
                "Combi a Atención Médica"
              </button>
              <button
                onClick={() => handleQuickCommand('Cómo llego a Soriana')}
                className="text-[11px] bg-slate-950 text-slate-300 hover:text-amber-400 px-2.5 py-1.5 rounded-lg border border-slate-800 transition cursor-pointer"
              >
                "Combi a Soriana / Súper"
              </button>
              <button
                onClick={() => handleQuickCommand('punto seguro')}
                className="text-[11px] bg-slate-950 text-amber-300 hover:border-amber-500/50 px-2.5 py-1.5 rounded-lg border border-slate-800 transition cursor-pointer"
              >
                "Puntos Naranja"
              </button>
            </div>
          </div>

          {/* Accessibility: Read Screen & High Contrast */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={isSpeaking ? () => voiceService.stopSpeaking() : readCurrentScreen}
              className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                isSpeaking
                  ? 'bg-purple-600 text-white border-purple-400 animate-pulse'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-purple-400" />}
              <span>{isSpeaking ? 'Detener Voz' : 'Leer Pantalla'}</span>
            </button>

            <button
              onClick={onToggleHighContrast}
              className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                highContrast
                  ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Contraste</span>
            </button>
          </div>

          {/* Text Command Fallback */}
          <form onSubmit={handleManualSubmit} className="flex items-center gap-1.5 pt-1">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="O escribe una orden (ej. 'reportar bache')..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1"
            >
              <Send className="w-3 h-3" />
            </button>
          </form>

          {feedbackMessage && (
            <div className="bg-slate-950 border border-cyan-800/80 text-cyan-300 text-[11px] p-2 rounded-xl flex items-center justify-between">
              <span>{feedbackMessage}</span>
              <button onClick={() => setFeedbackMessage(null)} className="text-cyan-400 ml-2">✕</button>
            </div>
          )}
        </div>
      )}

      {/* ===================== ULTRA-COMPACT FLOATING MICROPHONE BUTTON ===================== */}
      {/* (User requested: "has aun mas pequeño el boton de la voz casi que solo se ve el microfono") */}
      <button
        onClick={toggleMicAndExpand}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 cursor-pointer ${
          isListening
            ? 'bg-red-500 ring-4 ring-red-500/60 scale-110 animate-pulse shadow-red-950/80'
            : isExpanded
            ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-400/40 shadow-cyan-900/50'
            : 'bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 hover:scale-110 active:scale-95 ring-4 ring-cyan-500/20 shadow-cyan-950/80'
        }`}
        title={isListening ? 'Escuchando tu voz...' : 'Asistente de Voz (Toca para hablar)'}
      >
        {isListening ? (
          <MicOff className="w-6 h-6 animate-bounce" />
        ) : (
          <Mic className="w-6 h-6" />
        )}

        {/* Live indicator dot */}
        <span
          className={`absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${
            isListening ? 'bg-red-400 animate-ping' : 'bg-emerald-400'
          }`}
        ></span>
      </button>
    </div>
  );
};
