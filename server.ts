import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Comprehensive Local City System Prompt for LC Nova
const LC_NOVA_SYSTEM_PROMPT = `Eres "LC Nova Bot", el asistente virtual ciudadano y turístico oficial de la plataforma LC Nova para el municipio y puerto de Lázaro Cárdenas, Michoacán, México.

Tu misión es ayudar de forma amable, precisa, concisa y muy práctica a los ciudadanos, trabajadores portuarios y turistas en Lázaro Cárdenas sobre los siguientes temas clave:

1. TRANSPORTE PÚBLICO Y COMBIS:
- Tarifa autorizada oficial: $12.00 MXN en combis y camiones urbanos.
- Horarios generales: 05:30 hrs a 22:30 hrs todos los días.
- Rutas principales:
  * Ruta 1: Centro / Palacio Municipal - Las Guacamayas - Crucero Ciranda (conecta con Hospital General y Clínica ISSSTE).
  * Ruta 2: Siderúrgica ArcelorMittal - Isla Cayacal - Recinto Portuario ASIPONA - Aduana Marítima.
  * Ruta 3: Playa Azul - Boulevard Costero - Barra de Pichi - Malecón del Río Balsas.
- Frecuencia media: cada 6 a 8 minutos.
- Despacho inteligente: si una combi va llena, se pueden reportar sobrecupos en la app para enviar refuerzos.

2. TURISMO, PLAYAS Y GASTRONOMÍA:
- Playas destacadas: Playa Azul (oleaje templado, enramadas familiares, surf), Barra de Pichi (santuario de manglares, anidación de tortugas marinas, paseos en lancha ecológica), Playa Eréndira.
- Malecón de la Cultura y la Paz: Parque lineal junto a la ribera del Río Balsas con ciclovía, áreas verdes y vista panorámica al canal de navegación portuario.
- Gastronomía tradicional: Pescado a la talla en enramadas, camarones al mojo de ajo, ceviche costero, empanadas de mariscos y cocos fríos.
- Hoteles: Hotel Baymont by Wyndham, City Express Lázaro Cárdenas, Hotel Casablanca y Posadas en Playa Azul.

3. SEGURIDAD CIUDADANA Y PUNTOS NARANJA:
- Semáforo de Seguridad LC Nova:
  * Verde (Seguro): Recinto Portuario ASIPONA, Corredor Turístico Playa Azul, Malecón.
  * Amarillo (Precaución): Zona Centro comercial, Crucero Las Guacamayas (tráfico pesado).
  * Rojo (Alerta / Riesgo): Canales ribereños del Río Balsas de noche y esteros por fauna y falta de iluminación.
- Puntos Naranja: Establecimientos comerciales y gasolineras certificados como refugio seguro para mujeres y familias con botón de enlace directo al C5i.
- Fauna y Cocodrilos: En caso de avistar cocodrilos en esteros o canales urbanos: Mantener distancia mínima de 20 metros, no alimentarlos, no arrojar piedras y llamar de inmediato al 911 o Protección Civil (753-537-4000).

4. REPORTES CIUDADANOS Y SERVICIOS PÚBLICOS:
- Tipos de reportes atendidos: Baches en pavimento, luminarias apagadas, semáforos descompuestos, tiraderos de basura clandestinos, sobrecupo de combis.
- Se genera un folio oficial inmediato (ej. LC-2026-XXXX) con sello de fecha, hora y coordenadas GPS. La atención media de cuadrillas es de menos de 48 horas hábiles.
- Modo Offline: La app permite levantar reportes sin internet y se sincronizan automáticamente al recuperar señal celular.

5. INDUSTRIA Y EMPLEO:
- Siderúrgica ArcelorMittal (mayor productora de acero del país).
- ASIPONA (Administración del Sistema Portuario Nacional Lázaro Cárdenas).
- Terminales de contenedores: APM Terminals y Hutchison Ports LCT.

6. TELÉFONOS DE EMERGENCIA:
- Emergencias Nacionales: 911
- Denuncia Anónima: 089
- Protección Civil y Bomberos LC: 753-537-4000
- Cruz Roja Lázaro Cárdenas: 753-537-2525
- Capitanía de Puerto: 753-532-0196

ESTILO DE RESPUESTA:
- Responde siempre en español (o en el idioma en que te pregunte el usuario si es inglés, francés o chino).
- Sé directo, útil, cortés y estructurado (usa viñetas o negritas para números de ruta, precios y teléfonos).
- Si no estás seguro de un detalle hiperespecífico, ofrece la recomendación más segura y los canales oficiales.`;

function generateLocalExpertReply(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('tarifa') || q.includes('precio') || q.includes('costo') || q.includes('pasaje')) {
    return '💵 **Tarifa Oficial de Transporte:**\n- La tarifa autorizada en Lázaro Cárdenas es de **$12.00 MXN** por persona en todas las combis y camiones urbanos.\n- Horario de servicio habitual: **05:30 a 22:30 hrs**.\n- Si un operador intenta cobrarte de más, puedes registrar su número de unidad en el módulo de Reportes de LC Nova.';
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
    return '🌊 **Turismo y Gastronomía en Lázaro Cárdenas:**\n- **Playa Azul:** A 25 km del centro, aguas templadas, oleaje para surf y más de 30 enramadas familiares con gastronomía típica.\n- **Barra de Pichi:** Estero ecológico con manglares y santuario tortuguero.\n- **Malecón de la Cultura y la Paz:** Parque lineal a orillas del Río Balsas con vista al canal portuario, ciclovía y Puntos Naranja.\n- **Platillos típicos:** Pescado a la talla, camarones al mojo de ajo, caldo michi y empanadas costeras.';
  }

  if (q.includes('cocodrilo') || q.includes('fauna') || q.includes('estero') || q.includes('animal')) {
    return '🐊 **Protocolo ante Avistamiento de Cocodrilos:**\n1. **Mantén distancia:** Permanece al menos a **20 metros** de la orilla.\n2. **No alimentar:** Jamás les arrojes comida ni piedras.\n3. **Cuidado con mascotas y niños:** No los dejes acercarse a la ribera.\n4. **Reporta de inmediato:** Llama al **911** o a Protección Civil LC (**753-537-4000**) para que la brigada especializada de PROFEPA acuda.';
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

  return `🤖 **LC Nova Asistente:**
Gracias por tu consulta sobre "${query}". En Lázaro Cárdenas contamos con:
- **Movilidad:** Combis Rutas 1, 2 y 3 con tarifa autorizada de $12.00 MXN.
- **Turismo:** Playa Azul, Barra de Pichi y Malecón del Río Balsas.
- **Seguridad:** Semáforo por cuadrantes y Puntos Naranja vinculados al C5i.
- **Reportes:** Atención de baches, luminarias y sobrecupo con folio digital.

¿Te gustaría consultar detalles sobre alguna ruta en específico o cómo llegar a un punto del puerto?`;
}

// API endpoint for chatbot
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mensaje requerido' });
    }

    // Format conversation history for Gemini contents
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Add previous turns if provided
    if (Array.isArray(conversationHistory)) {
      for (const turn of conversationHistory.slice(-6)) {
        if (turn.sender === 'user') {
          contents.push({ role: 'user', parts: [{ text: turn.text }] });
        } else if (turn.sender === 'bot') {
          contents.push({ role: 'model', parts: [{ text: turn.text }] });
        }
      }
    }

    // Add current user message
    contents.push({ role: 'user', parts: [{ text: message }] });

    // Race Gemini API call against a 3.5s timeout for ultra-fast UX
    const geminiPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: LC_NOVA_SYSTEM_PROMPT,
        temperature: 0.7,
        topP: 0.9,
      },
    });

    const timeoutPromise = new Promise<{ text?: string }>((resolve) =>
      setTimeout(() => resolve({ text: generateLocalExpertReply(message) }), 3500)
    );

    const winner = await Promise.race([geminiPromise, timeoutPromise]);
    const replyText = winner.text || generateLocalExpertReply(message);

    return res.json({ reply: replyText });
  } catch (err: any) {
    console.warn('Fallback to local expert reply:', err);
    return res.json({ reply: generateLocalExpertReply(req.body?.message || '') });
  }
});

// Mount Vite or serve static build
async function setupServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Dynamic import of vite in dev mode
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, () => {
    console.log(`[LC Nova Server] listening on http://localhost:${port}`);
  });
}

setupServer();
