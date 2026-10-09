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
    label: '🚌 ¿Qué combi va a la Siderúrgica?',
    prompt: '¿Qué combi o ruta me lleva a la Siderúrgica ArcelorMittal y al recinto portuario ASIPONA?',
  },
  {
    label: '🏖️ ¿Cuáles son las mejores playas?',
    prompt: '¿Cuáles son las playas más recomendadas para visitar en Lázaro Cárdenas y qué platillos tradicionales ofrecen?',
  },
  {
    label: '🚨 ¿Qué hacer si veo un cocodrilo?',
    prompt: '¿Qué protocolo de seguridad debo seguir si avisto un cocodrilo cerca del Río Balsas o en la Barra de Pichi?',
  },
  {
    label: '🛠️ ¿Cómo reportar un bache o luz?',
    prompt: '¿Cómo funciona el sistema de reportes ciudadanos de LC Nova para baches y alumbrado público?',
  },
];

function getLocalExpertResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('tarifa') || q.includes('precio') || q.includes('costo') || q.includes('pasaje')) {
    return '💵 **Tarifa Oficial de Transporte:**\n- La tarifa autorizada en Lázaro Cárdenas es de **$12.00 MXN** por persona en todas las combis y camiones urbanos.\n- Horario de servicio: **05:30 a 22:30 hrs**.';
  }

  if (q.includes('siderurgica') || q.includes('siderúrgica') || q.includes('asipona') || q.includes('arcelor')) {
    return '🏭 **Ruta a Siderúrgica y ASIPONA:**\n- Toma la **Ruta 2 (Siderúrgica - Isla Cayacal - ASIPONA)**.\n- Pasan cada **6 a 8 minutos** con tarifa autorizada de **$12.00 MXN**.';
  }

  if (q.includes('guacamayas') || q.includes('ruta 1') || q.includes('hospital')) {
    return '🚏 **Ruta 1 (Centro - Las Guacamayas):**\n- Conecta el Centro con Las Guacamayas, pasando por el Hospital General.';
  }

  if (q.includes('playa azul') || q.includes('ruta 3') || q.includes('costa') || q.includes('pichi')) {
    return '🏖️ **Ruta 3 (Playa Azul - Boulevard Costero):**\n- Conecta el centro urbano con la zona de enramadas de **Playa Azul** y el estero de **Barra de Pichi**.';
  }

  if (q.includes('playa') || q.includes('turismo') || q.includes('comer') || q.includes('marisco')) {
    return '🌊 **Turismo y Gastronomía en Lázaro Cárdenas:**\n- **Playa Azul:** Aguas templadas, surf y enramadas familiares.\n- **Barra de Pichi:** Estero ecológico y santuario tortuguero.\n- **Platillos:** Pescado a la talla y camarones.';
  }

  if (q.includes('cocodrilo') || q.includes('fauna') || q.includes('estero')) {
    return '🐊 **Protocolo ante Cocodrilos:**\n1. Mantén distancia (20 metros).\n2. No alimentar.\n3. Reporta al 911 o Protección Civil.';
  }

  if (q.includes('naranja') || q.includes('punto naranja')) {
    return '🧡 **Puntos Naranja:**\n- Comercios y hoteles certificados como espacios seguros de resguardo con botón de auxilio.';
  }

  if (q.includes('report') || q.includes('bache') || q.includes('luz')) {
    return '📋 **Reportes Ciudadanos:**\n- Genera folios oficiales con foto sellada y GPS en la pestaña Reportes.';
  }

  return `🤖 **LC Nova Asistente:**\nTengo información completa sobre combis, playas, seguridad y reportes en Lázaro Cárdenas. ¿En qué te puedo ayudar hoy?`;
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
      voiceService.stopSpeaking();
      setIsSpeakingId(msg.id);
      toneGenerator.playSuccessBeep();
      voiceService.speak(msg.text.replace(/[*#•_-]/g, ''), 'es-MX', () => {
        setIsSpeakingId(null);
      });
    }
  };

  const handleToggleVoiceDictation = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      voiceService.speak('Tu navegador no soporta reconocimiento de voz nativo.');
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'es-MX';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      toneGenerator.playListeningChime();
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsListening(false);
      toneGenerator.playSuccessBeep();
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <>
      {/* Floating Chat Trigger - Combi Vivo Style */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            toneGenerator.playSuccessBeep();
          }}
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-[1400] sticker-btn bg-[#FFC21A] hover:bg-[#e6ad15] text-[#0B2A3C] font-black p-3.5 sm:px-5 sm:py-3.5 rounded-2xl border-3 border-[#0B2A3C] shadow-[4px_4px_0_#0B2A3C] flex items-center gap-2.5 transition animate-bounce cursor-pointer"
        >
          <span className="text-2xl">🤖</span>
          <span className="text-xs font-black font-['Bricolage_Grotesque'] hidden sm:inline">LC Nova Bot</span>
        </button>
      )}

      {/* Chat Window Popup */}
      {isOpen && (
        <div className="fixed bottom-20 right-3 sm:bottom-6 sm:right-6 z-[1500] w-[92vw] sm:w-[410px] h-[550px] bg-white border-3 border-[#0B2A3C] rounded-3xl shadow-[6px_6px_0_#0B2A3C] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-[#0B2A3C] text-white px-5 py-4 flex items-center justify-between border-b-3 border-[#0B2A3C]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#FFC21A] text-[#0B2A3C] border-2 border-[#0B2A3C] flex items-center justify-center font-bold text-lg shadow-[2px_2px_0_#0B2A3C]">
                🤖
              </div>
              <div>
                <h3 className="text-sm font-black font-['Bricolage_Grotesque']">LC Nova Asistente</h3>
                <span className="text-[10px] font-mono text-[#7BD84A] font-bold">● En Línea (Lázaro Cárdenas)</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsOpen(false);
                toneGenerator.playSuccessBeep();
              }}
              className="w-8 h-8 rounded-xl bg-white text-[#0B2A3C] border-2 border-[#0B2A3C] flex items-center justify-center hover:bg-[#FFF6E5] cursor-pointer font-bold shadow-[2px_2px_0_#0B2A3C]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#FFF6E5]">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  {!isUser && (
                    <div className="w-8 h-8 rounded-2xl bg-[#14B8C4] text-white border-2 border-[#0B2A3C] flex items-center justify-center shrink-0 shadow-[2px_2px_0_#0B2A3C]">
                      🤖
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl p-3.5 leading-relaxed border-2 border-[#0B2A3C] shadow-[3px_3px_0_#0B2A3C] text-xs ${
                      isUser
                        ? 'bg-[#FF5A3C] text-white rounded-tr-none'
                        : 'bg-white text-[#0B2A3C] rounded-tl-none font-medium'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans text-xs">
                      {msg.text}
                    </div>

                    <div className={`flex items-center justify-between gap-3 mt-2 pt-1 border-t text-[10px] font-mono ${
                      isUser ? 'border-white/20 text-white/80' : 'border-[#0B2A3C]/20 text-[#0B2A3C]/70'
                    }`}>
                      <span>{msg.timestamp}</span>

                      {!isUser && (
                        <button
                          type="button"
                          onClick={() => handleSpeak(msg)}
                          className="hover:text-[#FF5A3C] text-[#0B2A3C] flex items-center gap-1 transition cursor-pointer font-bold"
                          title="Escuchar respuesta"
                        >
                          {isSpeakingId === msg.id ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-[#E5233B] animate-pulse" />
                              <span>Detener</span>
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
              <div className="flex items-center gap-2.5 text-[#0B2A3C] text-xs">
                <div className="w-7 h-7 rounded-full bg-[#14B8C4] text-white border-2 border-[#0B2A3C] flex items-center justify-center animate-spin">
                  ⏳
                </div>
                <div className="bg-white border-2 border-[#0B2A3C] px-3.5 py-2 rounded-2xl rounded-tl-none shadow-[2px_2px_0_#0B2A3C]">
                  <span className="text-[11px] text-[#0B2A3C] font-bold">
                    Consultando información...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-3 bg-white border-t-2 border-[#0B2A3C] shrink-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#0B2A3C] block mb-1.5">
              💡 Preguntas Frecuentes:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {QUICK_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(item.prompt)}
                  disabled={isLoading}
                  className="shrink-0 bg-[#FFF6E5] hover:bg-[#FFE5C0] text-[#0B2A3C] border-2 border-[#0B2A3C] rounded-xl px-3 py-1.5 text-[11px] font-bold transition cursor-pointer shadow-[2px_2px_0_#0B2A3C] truncate max-w-[220px]"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t-2 border-[#0B2A3C] shrink-0">
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
                className={`p-2.5 rounded-xl border-2 border-[#0B2A3C] transition cursor-pointer shadow-[2px_2px_0_#0B2A3C] ${
                  isListening
                    ? 'bg-[#E5233B] text-white animate-pulse'
                    : 'bg-[#FFF6E5] text-[#0B2A3C] hover:bg-[#FFE5C0]'
                }`}
                title="Dictar por voz"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escribe tu duda sobre combis o playas..."
                disabled={isLoading}
                className="flex-1 bg-[#FFF6E5] border-2 border-[#0B2A3C] text-[#0B2A3C] rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#14B8C4] placeholder:text-[#0B2A3C]/50"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="sticker-btn bg-[#14B8C4] hover:bg-[#10a3af] disabled:opacity-40 text-white font-black p-2.5 rounded-xl border-2 border-[#0B2A3C] shadow-[2px_2px_0_#0B2A3C] transition cursor-pointer"
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
