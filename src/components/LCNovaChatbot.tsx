import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  User, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Mic, 
  MicOff
} from 'lucide-react';
import { LCNovaLogo } from './LCNovaLogo';
import { toneGenerator, voiceService } from '../services/voiceAssistant';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'bot',
    text: '¡Hola! Soy **LC Nova Bot**, tu asistente ciudadano y turístico de Lázaro Cárdenas, Michoacán.\n\nPuedo orientarte sobre:\n• 🚌 **Rutas de combis y tarifas** ($12.00 MXN)\n• 🏖️ **Turismo, playas y gastronomía**\n• 🛡️ **Semáforo de seguridad y Puntos Naranja**\n• 🐊 **Protocolo ante cocodrilos en el río**\n• 🛠️ **Reportes de baches y luminarias**\n• 📞 **Teléfonos de emergencia**\n\n¿Qué te gustaría consultar?',
    timestamp: 'Ahora',
  },
];

const QUICK_PROMPTS = [
  {
    label: '🚌 ¿Qué combi va a la Siderúrgica o ASIPONA?',
    prompt: '¿Qué combi o ruta me lleva a la Siderúrgica ArcelorMittal y al recinto portuario ASIPONA?',
  },
  {
    label: '🏖️ ¿Cuáles son las mejores playas y qué comer?',
    prompt: '¿Cuáles son las playas más recomendadas para visitar en Lázaro Cárdenas y qué platillos tradicionales ofrecen en las enramadas?',
  },
  {
    label: '🚨 ¿Qué hacer si veo un cocodrilo en el río o estero?',
    prompt: '¿Qué protocolo de seguridad debo seguir si avisto un cocodrilo cerca del Río Balsas o en la Barra de Pichi?',
  },
  {
    label: '🛠️ ¿Cómo reportar un bache o falla de luz?',
    prompt: '¿Cómo funciona el sistema de reportes ciudadanos de LC Nova para baches y alumbrado público y en cuánto tiempo atienden?',
  },
  {
    label: '💵 ¿Cuál es la tarifa oficial de las combis?',
    prompt: '¿Cuál es la tarifa autorizada oficial de las combis en Lázaro Cárdenas y cuáles son los horarios de servicio?',
  },
  {
    label: '🛡️ ¿Dónde están los Puntos Naranja de auxilio?',
    prompt: '¿Qué son los Puntos Naranja en Lázaro Cárdenas y cómo ayudan a mujeres o personas en situación de riesgo?',
  },
];

function getLocalExpertResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('tarifa') || q.includes('precio') || q.includes('costo') || q.includes('pasaje')) {
    return '💵 **Tarifa Oficial de Transporte:**\n- La tarifa autorizada en Lázaro Cárdenas es de **$12.00 MXN** por persona en todas las combis y camiones urbanos.\n- Horario de servicio: **05:30 a 22:30 hrs**.\n- Si un chofer te cobra de más, puedes registrar la unidad en el módulo de Reportes de LC Nova.';
  }

  if (q.includes('siderurgica') || q.includes('siderúrgica') || q.includes('asipona') || q.includes('arcelor') || q.includes('aduana') || q.includes('cayacal')) {
    return '🏭 **Ruta a Siderúrgica y ASIPONA:**\n- Toma la **Ruta 2 (Siderúrgica - Isla Cayacal - ASIPONA)**.\n- Recorre desde el Centro de Lázaro Cárdenas pasando por Av. Lázaro Cárdenas, el Puente Albatros, la Puerta 1 de ArcelorMittal y el Recinto Portuario de ASIPONA.\n- Pasan cada **6 a 8 minutos** con tarifa autorizada de **$12.00 MXN**.';
  }

  if (q.includes('guacamayas') || q.includes('ruta 1') || q.includes('hospital')) {
    return '🚏 **Ruta 1 (Centro - Las Guacamayas):**\n- Conecta el Centro / Palacio Municipal con Las Guacamayas, pasando por el Hospital General y el Crucero Ciranda.\n- Es la ruta de mayor flujo para estudiantes del Tecnológico y trabajadores del sector salud.';
  }

  if (q.includes('playa azul') || q.includes('ruta 3') || q.includes('costa') || q.includes('pichi')) {
    return '🏖️ **Ruta 3 (Playa Azul - Boulevard Costero):**\n- Conecta el centro urbano con la zona de enramadas de **Playa Azul** y el estero de **Barra de Pichi**.\n- Ideal para turismo de fin de semana, degustar pescado a la talla y presenciar la liberación de tortugas marinas.';
  }

  if (q.includes('playa') || q.includes('turismo') || q.includes('comer') || q.includes('marisco') || q.includes('malecon') || q.includes('malecón')) {
    return '🌊 **Turismo y Gastronomía en Lázaro Cárdenas:**\n- **Playa Azul:** A 25 km del centro, aguas templadas, oleaje para surf y más de 30 enramadas familiares.\n- **Barra de Pichi:** Estero ecológico con manglares y santuario tortuguero.\n- **Malecón de la Cultura y la Paz:** Parque lineal a orillas del Río Balsas con vista al canal portuario, ciclovía y Puntos Naranja.\n- **Platillos típicos:** Pescado a la talla, camarones al mojo de ajo, caldo michi y empanadas costeras.';
  }

  if (q.includes('cocodrilo') || q.includes('fauna') || q.includes('estero') || q.includes('animal')) {
    return '🐊 **Protocolo ante Avistamiento de Cocodrilos:**\n1. **Mantén distancia:** Permanece al menos a **20 metros** de la orilla del agua.\n2. **No alimentar:** Jamás les arrojes comida ni piedras.\n3. **Cuidado con mascotas y niños:** No los dejes acercarse a la ribera.\n4. **Reporta de inmediato:** Llama al **911** o a Protección Civil LC (**753-537-4000**) para que la brigada especializada de PROFEPA acuda.';
  }

  if (q.includes('naranja') || q.includes('punto naranja') || q.includes('mujer') || q.includes('acoso')) {
    return '🧡 **Puntos Naranja en Lázaro Cárdenas:**\n- Son comercios, hoteles y tiendas de conveniencia certificados como **espacios seguros de resguardo**.\n- Cuentan con personal capacitado y botón de enlace directo con el C5i Michoacán y la Policía Municipal en caso de acoso o riesgo.\n- Puedes ubicarlos en tiempo real en la pestaña **Seguridad** de LC Nova.';
  }

  if (q.includes('report') || q.includes('bache') || q.includes('luz') || q.includes('falla') || q.includes('lampara') || q.includes('lámpara') || q.includes('basura')) {
    return '📋 **Reportes Ciudadanos en LC Nova:**\n- Ve a la pestaña **Reportes** en el menú superior.\n- Puedes reportar baches, luminarias apagadas, semáforos o basura clandestina.\n- El sistema captura tu foto y coordenadas GPS exactas, otorgándote un folio oficial municipal (ej. `LC-2026-XXXX`).\n- Funciona **incluso sin internet (Modo Offline)** y se sincroniza al recuperar señal.';
  }

  if (q.includes('emergencia') || q.includes('telefono') || q.includes('teléfono') || q.includes('policia') || q.includes('bombero') || q.includes('ambulancia')) {
    return '📞 **Teléfonos de Emergencia LC:**\n- **Emergencias Nacionales:** 911\n- **Protección Civil y Bomberos:** 753-537-4000\n- **Cruz Roja Mexicana Delegación LC:** 753-537-2525\n- **Capitanía de Puerto:** 753-532-0196\n- **Denuncia Anónima:** 089';
  }

  return `🤖 **LC Nova Asistente:**\nGracias por tu consulta sobre "${query}".\n\nEn la plataforma LC Nova tienes acceso directo a:\n• **Movilidad:** Combis Rutas 1, 2 y 3 con tarifa autorizada de $12.00 MXN.\n• **Turismo:** Playa Azul, Barra de Pichi y Malecón del Río Balsas.\n• **Seguridad:** Semáforo por cuadrantes y Puntos Naranja vinculados al C5i.\n• **Reportes:** Atención de baches, luminarias y sobrecupo con folio digital.\n\n¿Te gustaría que te indique qué combi tomar para llegar a algún punto específico?`;
}

export const LCNovaChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    toneGenerator.playSuccessBeep();

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    setTimeout(() => {
      const botReply = getLocalExpertResponse(query);
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
      toneGenerator.playSuccessBeep();
    }, 400);
  };

  const handleSpeak = (msg: ChatMessage) => {
    if (isSpeakingId === msg.id) {
      voiceService.stopSpeaking();
      setIsSpeakingId(null);
    } else {
      setIsSpeakingId(msg.id);
      const cleanText = msg.text
        .replace(/\*\*/g, '')
        .replace(/#/g, '')
        .replace(/- /g, '')
        .replace(/• /g, '')
        .replace(/\[.*?\]/g, '');

      voiceService.speak(cleanText, 'es-MX', () => {
        setIsSpeakingId(null);
      });
    }
  };

  const handleToggleVoiceDictation = () => {
    const win = window as any;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toneGenerator.playAlertBeep();
      voiceService.speak('Reconocimiento de voz no disponible en este navegador.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-MX';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        toneGenerator.playSuccessBeep();
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        handleSendMessage(transcript);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleClearHistory = () => {
    setMessages(INITIAL_MESSAGES);
    toneGenerator.playSuccessBeep();
    voiceService.speak('Historial del chat reiniciado.');
  };

  return (
    <>
      {/* FLOATING TRIGGER BUTTON */}
      {!isOpen && (
        <button
          onClick={() => {
            toneGenerator.playSuccessBeep();
            setIsOpen(true);
          }}
          aria-label="Abrir Asistente LC Nova"
          className="fixed bottom-24 right-5 z-[1500] group flex items-center gap-2.5 bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 p-2.5 sm:px-4 sm:py-3 rounded-full shadow-2xl border-2 border-white/90 transition-all duration-300 hover:scale-105 cursor-pointer active:scale-95"
        >
          <div className="relative">
            <LCNovaLogo className="w-8 h-8 rounded-full bg-white p-0.5 shadow" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-950 rounded-full animate-pulse"></span>
          </div>
          <div className="hidden sm:block text-left pr-1">
            <span className="block font-black text-xs uppercase tracking-wider leading-none">
              LC Nova Bot
            </span>
            <span className="text-[10px] text-slate-900 font-medium">
              Asistente de Preguntas Locales
            </span>
          </div>
        </button>
      )}

      {/* CHATBOT DRAWER MODAL */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[2100] w-[95vw] sm:w-[440px] max-h-[88vh] h-[640px] bg-slate-950 border-2 border-cyan-500/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300 backdrop-blur-xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950 p-4 border-b border-cyan-800/60 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <LCNovaLogo className="w-10 h-10 rounded-xl bg-white p-0.5 shadow-md" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-950 rounded-full"></span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-sm text-white tracking-wide">
                    LC Nova Asistente
                  </h3>
                  <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-700">
                    IA Local
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Lázaro Cárdenas • Movilidad, Turismo y Seguridad
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearHistory}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
                title="Reiniciar chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
                title="Cerrar chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className="shrink-0 mt-0.5">
                    {isUser ? (
                      <div className="w-7 h-7 rounded-full bg-cyan-600 text-slate-950 font-bold flex items-center justify-center shadow">
                        <User className="w-4 h-4" />
                      </div>
                    ) : (
                      <LCNovaLogo className="w-7 h-7 rounded-full bg-white p-0.5 shadow" />
                    )}
                  </div>

                  <div
                    className={`max-w-[82%] rounded-2xl p-3.5 leading-relaxed shadow-lg ${
                      isUser
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans text-xs">
                      {msg.text}
                    </div>

                    <div className="flex items-center justify-between gap-3 mt-2 pt-1 border-t border-white/10 text-[10px] text-slate-400">
                      <span>{msg.timestamp}</span>

                      {!isUser && (
                        <button
                          type="button"
                          onClick={() => handleSpeak(msg)}
                          className="hover:text-cyan-400 text-slate-400 flex items-center gap-1 transition cursor-pointer"
                          title="Escuchar respuesta"
                        >
                          {isSpeakingId === msg.id ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                              <span className="text-cyan-300 font-mono">Detener</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>Escuchar</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2.5 text-slate-400 text-xs">
                <LCNovaLogo className="w-7 h-7 rounded-full bg-white p-0.5 animate-spin" />
                <div className="bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  <span className="text-[11px] text-cyan-300 font-medium">
                    Consultando información de Lázaro Cárdenas...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Pills */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-800 shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              💡 Preguntas Frecuentes de la Ciudad:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {QUICK_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(item.prompt)}
                  disabled={isLoading}
                  className="shrink-0 bg-slate-950 hover:bg-slate-850 text-cyan-300 hover:text-white border border-cyan-900/80 hover:border-cyan-500 rounded-lg px-2.5 py-1 text-[11px] font-medium transition cursor-pointer truncate max-w-[240px]"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-slate-950 border-t border-cyan-900/60 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={handleToggleVoiceDictation}
                className={`p-2.5 rounded-xl border transition cursor-pointer ${
                  isListening
                    ? 'bg-red-500/20 text-red-400 border-red-500 animate-pulse'
                    : 'bg-slate-900 text-slate-400 hover:text-cyan-400 border-slate-800 hover:border-cyan-700'
                }`}
                title="Dictar por voz"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escribe tu duda sobre combis, playas o seguridad..."
                disabled={isLoading}
                className="flex-1 bg-slate-900 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-cyan-500 placeholder:text-slate-500"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-slate-950 font-black p-2.5 rounded-xl shadow-lg transition cursor-pointer"
                title="Enviar mensaje"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
