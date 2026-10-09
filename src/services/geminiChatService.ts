import { GoogleGenAI } from '@google/genai';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: 'tab' | 'route' | 'offline_guide' | 'report_modal';
    targetTab?: 'movilidad' | 'turismo' | 'seguridad' | 'reportes';
    routeId?: string;
    label: string;
  };
}

const SYSTEM_INSTRUCTION = `
Eres "LC Nova Bot", el asistente de inteligencia artificial ciudadana oficial de "LC Nova" en el municipio portuario de Lázaro Cárdenas, Michoacán, México.
Tu misión es orientar con amabilidad, precisión y conocimiento local a ciudadanos, trabajadores portuarios y turistas sobre:

1. MOVILIDAD & COMBIS:
   - Ruta 1: Centro - Av. Melchor Ocampo - Las Guacamayas - Playa Azul ($11.00 - $12.00 MXN, frecuencia 6-8 min).
   - Ruta 2: Las Guacamayas - Corredor Industrial - Aduana - Puerto Interior ASIPONA ($12.00 MXN, paso continuo de 05:30 a 22:30).
   - Ruta 3: Playa Eréndira - Boulevar Playero - Barra de Pichi ($12.00 MXN, frecuencia 12-15 min).
   - Tarifas oficiales: $11 a $12 pesos con descuento de estudiante e INAPAM ($6).

2. INDUSTRIAS Y PUERTO:
   - ASIPONA (Administración del Sistema Portuario Nacional Lázaro Cárdenas).
   - Siderúrgica ArcelorMittal (mayor productor de acero).
   - Terminales especializadas: APM Terminals (Contenedores), Fertinal (Fertilizantes), Hutchinson Ports.
   - Parques industriales: Isla del Cayacal e Isla de la Palma.

3. TURISMO Y GASTRONOMÍA:
   - Malecón de la Cultura y las Artes (esculturas, fuentes danzantes y vista al canal de navegación).
   - Playa Azul (anidación de tortugas marinas, surf, hoteles y palapas).
   - Barra de Pichi (avistamiento ecológico en estero, manglares y cocodrilos en su hábitat protegido).
   - Playa Jardín y Playa Eréndira.
   - Gastronomía: Pescado a la talla estilo costa michoacana, mariscadas, tiritas de pescado y agua de coco.

4. SEGURIDAD Y PUNTOS NARANJA:
   - Monitoreo del C5i Lázaro Cárdenas, rondines de la SEMAR (Secretaría de Marina) y Policía Municipal.
   - Semáforo de seguridad por cuadrantes: Malecón/Puerto (Verde), Centro (Amarillo preventivo), Canal del Balsas (Rojo precautorio).
   - Puntos Naranja: Comercios y farmacias seguras para auxilio de mujeres y familias con botón de pánico directo.
   - Números de auxilio: 911 (Emergencias), (753) 537-1200 (Central Municipal), (753) 532-0196 (SEMAR).

5. REPORTES CIUDADANOS URBANOS:
   - Bacheo, luminarias apagadas, semáforos, basura clandestina y avistamiento de fauna (cocodrilos).
   - Se genera folio oficial tipo LC-2026-XXXX y ficha técnica oficial imprimible con QR y geolocalización.

6. MODO OFFLINE:
   - La plataforma guarda datos y mapas en memoria local (LocalStorage e IndexedDB). Si se corta la señal o viajas por la costa, puedes consultar rutas y enviar reportes; al reconectarse a internet se sincronizan automáticamente.

Responde siempre en español mexicano cordial, conciso (máximo 3 párrafos breves), claro y estructurado con viñetas cuando sea útil.
`;

// Local intelligent fallback engine with rich local knowledge of Lázaro Cárdenas
const getLocalSmartResponse = (query: string): { text: string; action?: ChatMessage['suggestedAction'] } => {
  const q = query.toLowerCase().trim();

  // 1. Combis / Transporte / Rutas
  if (q.includes('combi') || q.includes('ruta') || q.includes('camion') || q.includes('transporte') || q.includes('llegar') || q.includes('parada') || q.includes('pasaje') || q.includes('tarifa') || q.includes('costo')) {
    if (q.includes('playa azul') || q.includes('playa') || q.includes('1')) {
      return {
        text: `🚐 **Para ir a Playa Azul** te conviene tomar la **Ruta 1 (Centro - Las Guacamayas - Playa Azul)**:\n\n• **Costo de pasaje:** $11.00 MXN general ($6.00 con tarjeta de estudiante/INAPAM).\n• **Frecuencia:** Pasa cada 6 a 8 minutos por Av. Melchor Ocampo.\n• **Tiempo estimado:** ~25 a 35 minutos según el tráfico.\n\nPuedes trazar tu punto de abordaje directamente desde tu ubicación actual en el módulo de Movilidad.`,
        action: {
          type: 'tab',
          targetTab: 'movilidad',
          label: 'Ver Combis y Trazar Ruta en el Mapa'
        }
      };
    }

    if (q.includes('puerto') || q.includes('asipona') || q.includes('arcelor') || q.includes('aduana') || q.includes('trabajo') || q.includes('2')) {
      return {
        text: `🏗️ **Para ir al Puerto Interior o Siderúrgica** la ruta indicada es la **Ruta 2 (Las Guacamayas - Corredor Industrial - ASIPONA)**:\n\n• **Costo:** $12.00 MXN.\n• **Horario:** De 05:30 hrs a 22:30 hrs con servicio reforzado en cambio de turnos de las acereras y terminales de contenedores.\n• **Paradas clave:** Puerta 1 ArcelorMittal, Aduana Marítima, Edificio Central ASIPONA.`,
        action: {
          type: 'tab',
          targetTab: 'movilidad',
          label: 'Ver Ruta 2 Portuaria en el Mapa'
        }
      };
    }

    if (q.includes('barra de pichi') || q.includes('erendira') || q.includes('pichi') || q.includes('3')) {
      return {
        text: `🌊 **Hacia Playa Eréndira y Barra de Pichi** opera la **Ruta 3**:\n\n• **Costo:** $12.00 MXN.\n• **Recorrido:** Corre a lo largo del Boulevard Playero conectando los restaurantes de palapas y el estero ecoturístico.\n• **Frecuencia:** Cada 12 a 15 minutos.`,
        action: {
          type: 'tab',
          targetTab: 'movilidad',
          label: 'Explorar Rutas de Playa'
        }
      };
    }

    return {
      text: `🚌 **En LC Nova monitoreamos 3 rutas troncales de transporte colectivo (Combis)** con GPS en vivo:\n\n1. **Ruta 1:** Centro ↔ Las Guacamayas ↔ Playa Azul ($11 MXN)\n2. **Ruta 2:** Las Guacamayas ↔ Corredor Industrial ↔ ASIPONA ($12 MXN)\n3. **Ruta 3:** Playa Eréndira ↔ Boulevard Playero ↔ Barra de Pichi ($12 MXN)\n\n¿A qué destino específico te gustaría viajar hoy?`,
      action: {
        type: 'tab',
        targetTab: 'movilidad',
        label: 'Abrir Módulo de Movilidad'
      }
    };
  }

  // 2. Reportes Ciudadanos / Baches / Luminarias / Basura / Cocodrilos
  if (q.includes('reporte') || q.includes('bache') || q.includes('luz') || q.includes('luminaria') || q.includes('alumbrado') || q.includes('semaforo') || q.includes('basura') || q.includes('cocodrilo') || q.includes('folio') || q.includes('imprimir')) {
    if (q.includes('cocodrilo') || q.includes('animal') || q.includes('fauna')) {
      return {
        text: `🐊 **¡Atención por Fauna Silvestre en Lázaro Cárdenas!**\n\nSi avistas un cocodrilo fuera de su estero o en drenes pluviales:\n• Mantén una distancia preventiva mínima de 15 metros.\n• No intentes alimentarlo ni capturarlo.\n• Puedes generar un **Reporte Ciudadano Urgente** con foto y GPS aquí en LC Nova o comunicarte a Protección Civil y Bomberos Municipales al 911.`,
        action: {
          type: 'tab',
          targetTab: 'reportes',
          label: 'Levantar Reporte de Fauna en Vivo'
        }
      };
    }

    return {
      text: `📋 **Cómo hacer un Reporte Ciudadano en LC Nova:**\n\n1. Entra a la pestaña **4. Reporte Ciudadano**.\n2. Elige el tipo de incidencia (Bacheo, Luminarias, Semáforos, Basura, Fuga de agua, Cocodrilos).\n3. La plataforma detecta tu **GPS exacto** y puedes adjuntar fotografía de evidencia.\n4. Se generará un **Folio Oficial con código de verificación QR** y podrás visualizar e **imprimir la Ficha Técnica Oficial**.`,
      action: {
        type: 'tab',
        targetTab: 'reportes',
        label: 'Ir a Reportes Ciudadanos'
      }
    };
  }

  // 3. Seguridad / Semáforo / Puntos Naranja / SOS
  if (q.includes('seguridad') || q.includes('semaforo') || q.includes('punto naranja') || q.includes('naranja') || q.includes('sos') || q.includes('policia') || q.includes('marina') || q.includes('semar') || q.includes('peligro') || q.includes('emergencia') || q.includes('911')) {
    return {
      text: `🛡️ **Seguridad Ciudadana y Puntos Naranja en Lázaro Cárdenas:**\n\n• **Semáforo en tiempo real:** Integra cámaras C5i, patrullajes de la Policía y la Secretaría de Marina (SEMAR).\n• **Puntos Naranja:** Red de negocios, farmacias y comercios aliados capacitados para dar resguardo inmediato y seguro a mujeres o personas en riesgo.\n• **Botón SOS:** Ubicado en la barra superior para alertar de inmediato a los cuadrantes.\n• **Teléfonos clave:** Emergencias 911 | SEMAR: (753) 532-0196 | Cruz Roja: (753) 537-2323.`,
      action: {
        type: 'tab',
        targetTab: 'seguridad',
        label: 'Ver Semáforo y Puntos Naranja'
      }
    };
  }

  // 4. Turismo / Playas / Qué visitar / Comida
  if (q.includes('turismo') || q.includes('playa') || q.includes('comer') || q.includes('visitar') || q.includes('mural') || q.includes('malecon') || q.includes('pescado') || q.includes('restaurante') || q.includes('atractivo') || q.includes('donde ir')) {
    return {
      text: `🌴 **Principales Atractivos y Gastronomía de Lázaro Cárdenas:**\n\n• **Malecón de la Cultura y las Artes:** Ideal para pasear al atardecer, ver barcos cargueros gigantes y disfrutar eventos culturales.\n• **Playa Azul:** El destino playero por excelencia con oleaje para surf, hoteles y santuarios de liberación de tortugas marinas.\n• **Barra de Pichi:** Paseos en lancha por manglares y avistamiento de aves y cocodrilos en su hábitat.\n• **Dónde Comer:** No te vayas sin probar el clásico **pescado a la talla**, tiritas de pescado costeñas y mariscadas en las enramadas de Playa Jardín y Playa Eréndira.`,
      action: {
        type: 'tab',
        targetTab: 'turismo',
        label: 'Ver Catálogo Turístico & Gastronómico'
      }
    };
  }

  // 5. Modo Offline
  if (q.includes('offline') || q.includes('sin internet') || q.includes('sin señal') || q.includes('datos') || q.includes('conexion') || q.includes('desconexion') || q.includes('guardar')) {
    return {
      text: `📴 **¿Cómo funciona el Modo Offline en LC Nova?**\n\n• **Caché Local Inteligente:** La cartografía, paradas de combis, directorios y puntos seguros se almacenan en el navegador (LocalStorage e IndexedDB).\n• **Reportes sin señal:** Si estás en una zona sin cobertura celular en la costa, puedes levantar un reporte y se encola localmente.\n• **Sincronización Automática:** En cuanto tu teléfono detecte WiFi o señal 4G/5G, los reportes se envían automáticamente al servidor municipal sin perder tu folio ni tus coordenadas.`,
      action: {
        type: 'offline_guide',
        label: 'Abrir Guía Completa del Modo Offline'
      }
    };
  }

  // 6. Puerto / Industrias / Empresas
  if (q.includes('industria') || q.includes('puerto') || q.includes('arcelor') || q.includes('asipona') || q.includes('fertinal') || q.includes('apm') || q.includes('empresa') || q.includes('empleo')) {
    return {
      text: `🚢 **Corredor Industrial y Portuario de Lázaro Cárdenas:**\n\nEl Puerto de Lázaro Cárdenas es uno de los más profundos e importantes del Pacífico Mexicano:\n• **ASIPONA:** Administra recintos y patios de trasvase intermodal.\n• **ArcelorMittal México:** Complejo siderúrgico productor de varilla, alambrón y planchón de acero.\n• **APM Terminals & Hutchison Ports:** Terminales semiautomatizadas de contenedores comerciales con Asia y América.\n• **Fertinal:** Productor nacional líder de fertilizantes fosfatados.`,
      action: {
        type: 'tab',
        targetTab: 'turismo',
        label: 'Ver Directorio Industrial y Portuario'
      }
    };
  }

  // 7. Saludo o consulta general
  return {
    text: `👋 ¡Hola! Soy el asistente virtual de **LC Nova**. Te puedo ayudar con información sobre:\n\n• 🚌 **Rutas de combi, paradas y tarifas** para moverte por Lázaro Cárdenas.\n• 📋 **Cómo levantar y consultar reportes urbanos** (baches, alumbrado, semáforos, cocodrilos) con folio oficial imprimible.\n• 🛡️ **Semáforo de seguridad, cuadrantes y Puntos Naranja** de auxilio.\n• 🏖️ **Turismo local, playas, malecón y dónde comer** pescado a la talla.\n• 📴 **Modo offline** y cómo usar la app sin conexión a internet.\n\n¿En qué te puedo apoyar el día de hoy?`
  };
};

export async function askLCNovaBot(
  userQuery: string,
  history: Array<{ sender: 'user' | 'bot'; text: string }> = []
): Promise<{ text: string; suggestedAction?: ChatMessage['suggestedAction'] }> {
  // Always prepare our smart local answer as base / fallback
  const localAnswer = getLocalSmartResponse(userQuery);

  // Check if Gemini API can be invoked
  const apiKey = typeof process !== 'undefined' && process.env?.GEMINI_API_KEY
    ? process.env.GEMINI_API_KEY
    : (import.meta as any).env?.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    // Return high quality local reasoning
    return localAnswer;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Build short context from history
    const recentHistory = history.slice(-4).map(h => `${h.sender === 'user' ? 'Usuario' : 'Asistente'}: ${h.text}`).join('\n');
    const prompt = `${SYSTEM_INSTRUCTION}\n\nHistorial reciente:\n${recentHistory}\n\nPregunta actual del ciudadano:\n${userQuery}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const botText = response.text?.trim();
    if (botText && botText.length > 20) {
      return {
        text: botText,
        suggestedAction: localAnswer.action, // preserve actionable deep link
      };
    }
  } catch (err) {
    console.warn('Gemini API call skipped or errored, using smart local knowledge fallback:', err);
  }

  return localAnswer;
}
