/**
 * Web Speech API & Accessibility Audio Engine for LC Nova
 * Immediate Voice Recognition Engine
 */

class AudioToneGenerator {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  playTone(frequency: number, type: OscillatorType, duration: number, volume: number = 0.15) {
    try {
      this.initCtx();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio fallback
    }
  }

  playSuccessBeep() {
    this.playTone(587.33, 'sine', 0.1, 0.1);
    setTimeout(() => this.playTone(880, 'sine', 0.2, 0.12), 100);
  }

  playAlertBeep() {
    this.playTone(440, 'triangle', 0.15, 0.2);
    setTimeout(() => this.playTone(330, 'sawtooth', 0.25, 0.2), 150);
  }

  playListeningChime() {
    this.playTone(523.25, 'sine', 0.12, 0.12);
    setTimeout(() => this.playTone(659.25, 'sine', 0.15, 0.12), 120);
  }
}

export const toneGenerator = new AudioToneGenerator();

export interface VoiceCommandResult {
  action: 'navigate' | 'report' | 'auto_report' | 'sos' | 'speak_status' | 'search_route' | 'unknown';
  targetTab?: string;
  category?: string;
  reportTitle?: string;
  reportDescription?: string;
  destinationQuery?: string;
  query?: string;
  message: string;
}

interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export class VoiceAssistant {
  private isSpeaking: boolean = false;
  private isListening: boolean = false;
  private activeRecognition: any = null;

  public hasNativeRecognition(): boolean {
    if (typeof window === 'undefined') return false;
    const win = window as unknown as IWindow;
    return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
  }

  public speak(text: string, lang: string = 'es-MX', onEnd?: () => void): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onEnd?.();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang.startsWith(lang.substring(0, 2)) || v.lang.includes('es'));
      if (voice) {
        utterance.voice = voice;
      }

      this.isSpeaking = true;
      utterance.onend = () => {
        this.isSpeaking = false;
        onEnd?.();
      };
      utterance.onerror = () => {
        this.isSpeaking = false;
        onEnd?.();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      this.isSpeaking = false;
      onEnd?.();
    }
  }

  public stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
  }

  /**
   * Starts native speech recognition IMMEDIATELY inside the user gesture.
   */
  public startListening(
    onInterim: (text: string) => void,
    onResult: (transcript: string, parsed: VoiceCommandResult) => void,
    onError: (err: string) => void,
    onEnd: () => void
  ): boolean {
    if (!this.hasNativeRecognition()) {
      onError('El navegador actual no soporta reconocimiento de voz nativo en este marco. Usa los botones rápidos o el teclado.');
      return false;
    }

    this.stopSpeaking();
    toneGenerator.playListeningChime();

    try {
      const win = window as unknown as IWindow;
      const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;
      const recognition = new SpeechRecognitionClass();

      // Configure for instant speech pickup
      recognition.continuous = false;
      recognition.interimResults = true; // Show words as spoken immediately!
      recognition.lang = 'es-MX';
      recognition.maxAlternatives = 1;

      this.isListening = true;
      this.activeRecognition = recognition;
      let debounceTimer: any = null;
      let lastSpokenText = '';

      recognition.onstart = () => {
        this.isListening = true;
      };

      recognition.onresult = (event: any) => {
        let interimText = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalText += event.results[i][0].transcript;
          } else {
            interimText += event.results[i][0].transcript;
          }
        }

        const recognizedText = finalText || interimText;
        if (recognizedText) {
          lastSpokenText = recognizedText;
          onInterim(recognizedText);
        }

        if (finalText) {
          if (debounceTimer) clearTimeout(debounceTimer);
          const parsed = this.parseCommand(finalText);
          toneGenerator.playSuccessBeep();
          onResult(finalText, parsed);
        } else if (interimText) {
          // Fallback debounce: execute after 1.2 seconds of silence on interim text
          if (debounceTimer) clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            if (lastSpokenText) {
              const parsed = this.parseCommand(lastSpokenText);
              toneGenerator.playSuccessBeep();
              onResult(lastSpokenText, parsed);
              try { recognition.stop(); } catch {}
            }
          }, 1200);
        }
      };

      recognition.onerror = (event: any) => {
        if (debounceTimer) clearTimeout(debounceTimer);
        this.isListening = false;
        const errType = event.error || 'error';
        let msg = 'Error de micrófono.';

        if (errType === 'not-allowed') {
          msg = 'Permiso de micrófono bloqueado. Oprime "Permitir" en la barra de tu navegador o pulsa los botones rápidos.';
        } else if (errType === 'no-speech') {
          msg = 'No se detectó audio. Pulsa el micrófono y habla de inmediato.';
        } else if (errType === 'network') {
          msg = 'Reconocimiento de voz de Google offline temporalmente. Usa los botones rápidos.';
        }
        onError(msg);
      };

      recognition.onend = () => {
        if (debounceTimer) clearTimeout(debounceTimer);
        this.isListening = false;
        this.activeRecognition = null;
        onEnd();
      };

      // Synchronous start to satisfy browser user gesture requirement
      recognition.start();
      return true;
    } catch (e: any) {
      this.isListening = false;
      onError('No se pudo iniciar el micrófono: ' + (e?.message || 'Intenta de nuevo'));
      return false;
    }
  }

  public stopListening(): void {
    if (this.activeRecognition && this.isListening) {
      try {
        this.activeRecognition.stop();
      } catch {
        // Ignore
      }
    }
    this.isListening = false;
  }

  public parseCommand(rawText: string): VoiceCommandResult {
    const text = rawText.toLowerCase().trim();

    // Emergency / SOS
    if (text.includes('auxilio') || text.includes('peligro') || text.includes('emergencia') || text.includes('socorro') || text.includes('ayuda') || text.includes('sos')) {
      return {
        action: 'sos',
        targetTab: 'seguridad',
        message: 'Activando modo de auxilio y buscando el Punto Naranja más cercano en Lázaro Cárdenas.'
      };
    }

    // Transit Route Search
    if (text.includes('cómo llego') || text.includes('quiero ir') || text.includes('dónde voy') || text.includes('combi para') || text.includes('camión para') || text.includes('llevarme a')) {
      let dest = text
        .replace('cómo llego a', '')
        .replace('cómo llego al', '')
        .replace('quiero ir a', '')
        .replace('quiero ir al', '')
        .replace('combi para el', '')
        .replace('combi para la', '')
        .replace('combi para', '')
        .replace('camión para el', '')
        .replace('camión para', '')
        .trim();

      return {
        action: 'search_route',
        targetTab: 'movilidad',
        destinationQuery: dest || 'aduana',
        message: `Buscando combis para llegar a ${dest || 'tu destino'}.`
      };
    }

    // Safety / Punto Naranja
    if (text.includes('punto seguro') || text.includes('punto naranja') || text.includes('seguridad') || text.includes('semáforo')) {
      return {
        action: 'navigate',
        targetTab: 'seguridad',
        message: 'Abriendo mapa de seguridad y Puntos Naranja verificados.'
      };
    }

    // Transit / Combis
    if (text.includes('camión') || text.includes('combi') || text.includes('transporte') || text.includes('chofer') || text.includes('ruta') || text.includes('parada')) {
      return {
        action: 'navigate',
        targetTab: 'movilidad',
        message: 'Abriendo mapa de rutas y tiempo estimado de llegada de combis en tiempo real.'
      };
    }

    // Instant Automatic Reports (User explicitly asked: "al momento de que detecte mi voz haga el reporte en automatico")
    if (
      text.includes('reportar') || 
      text.includes('reporte') || 
      text.includes('bache') || 
      text.includes('alumbrado') || 
      text.includes('luz') || 
      text.includes('basura') || 
      text.includes('cocodrilo') || 
      text.includes('semáforo') || 
      text.includes('semaforo') || 
      text.includes('ambulante') ||
      text.includes('delincuencia') ||
      text.includes('asalto') ||
      text.includes('sobrecupo')
    ) {
      let category = 'baches';
      let title = 'Bache o bacheo urgente en vialidad';
      let desc = 'Reporte de daño en carpeta asfáltica capturado por voz en Lázaro Cárdenas.';

      if (text.includes('cocodrilo')) {
        category = 'cocodrilos';
        title = 'Avistamiento de cocodrilo en zona urbana / canal';
        desc = 'Ejemplar reportado por voz cerca de vía pública. Requiere Protección Civil.';
      } else if (text.includes('luz') || text.includes('alumbrado')) {
        category = 'alumbrado';
        title = 'Falla de luminaria / alumbrado público';
        desc = 'Luminarias apagadas o intermitentes reportadas por voz.';
      } else if (text.includes('basura')) {
        category = 'basura';
        title = 'Acumulación de basura en vía pública';
        desc = 'Tiradero clandestino o exceso de residuos reportado por voz.';
      } else if (text.includes('semáforo') || text.includes('semaforo')) {
        category = 'semaforos';
        title = 'Semáforo descompuesto o intermitente';
        desc = 'Semáforo vial inoperante reportado por voz.';
      } else if (text.includes('ambulante')) {
        category = 'ambulantes';
        title = 'Obstrucción por puestos ambulantes';
        desc = 'Puestos informales bloqueando paso peatonal.';
      } else if (text.includes('delincuencia') || text.includes('asalto') || text.includes('robo')) {
        category = 'delincuencia';
        title = 'Incidencia de seguridad ciudadana';
        desc = 'Hecho delictivo reportado por voz para atención de seguridad pública.';
      }

      return {
        action: 'auto_report',
        targetTab: 'reportes',
        category,
        reportTitle: title,
        reportDescription: desc,
        message: `Generando reporte automático de ${category} con folio oficial de Lázaro Cárdenas.`
      };
    }

    // Tourism
    if (text.includes('aduana') || text.includes('puerto') || text.includes('arcelor') || text.includes('asipona') || text.includes('turismo') || text.includes('hospital') || text.includes('playa azul')) {
      return {
        action: 'navigate',
        targetTab: 'turismo',
        message: 'Mostrando catálogo portuario y turismo en Lázaro Cárdenas.'
      };
    }

    // Read screen
    if (text.includes('leer') || text.includes('escuchar') || text.includes('qué hay en pantalla')) {
      return {
        action: 'speak_status',
        message: 'Leyendo resumen de la pantalla actual.'
      };
    }

    return {
      action: 'unknown',
      query: text,
      message: `Comando detectado: "${text}". Puedes decir: "Cómo llego a la aduana", "Dónde está la combi", "Punto seguro" o "Reportar cocodrilo".`
    };
  }
}

export const voiceService = new VoiceAssistant();
