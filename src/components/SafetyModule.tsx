import React, { useState } from 'react';
import { SafetyZone, SafePoint, Coordinates, Language } from '../types';
import { 
  ShieldCheck, 
  ShieldAlert, 
  MapPin, 
  Phone, 
  Clock, 
  AlertOctagon, 
  Navigation, 
  ExternalLink, 
  CheckCircle2, 
  BellRing,
  Volume2,
  Radio,
  Camera,
  Activity,
  LocateFixed,
  AlertTriangle
} from 'lucide-react';
import { toneGenerator, voiceService } from '../services/voiceAssistant';
import { t } from '../i18n/touristTranslations';

interface SafetyModuleProps {
  safetyZones: SafetyZone[];
  safePoints: SafePoint[];
  currentLanguage: Language;
  onCenterMap: (coords: Coordinates) => void;
  onActivateSos: () => void;
  userLocation?: Coordinates | null;
}

export const SafetyModule: React.FC<SafetyModuleProps> = ({
  safetyZones,
  safePoints,
  currentLanguage,
  onCenterMap,
  onActivateSos,
  userLocation,
}) => {
  const [selectedZone, setSelectedZone] = useState<SafetyZone>(safetyZones[0]);
  const [sosModalOpen, setSosModalOpen] = useState<boolean>(false);
  const [evaluatingGps, setEvaluatingGps] = useState<boolean>(false);

  const handleTriggerSos = () => {
    toneGenerator.playAlertBeep();
    setSosModalOpen(true);
    onActivateSos();
    voiceService.speak('Alerta de seguridad activada. Te guiamos al Punto Naranja más cercano con resguardo y apoyo inmediato.');
  };

  const handleEvaluateMyGpsLocation = () => {
    setEvaluatingGps(true);
    toneGenerator.playSuccessBeep();

    if (!navigator.geolocation) {
      voiceService.speak('Tu navegador no soporta geolocalización.');
      setEvaluatingGps(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setEvaluatingGps(false);
        const myLat = pos.coords.latitude;
        const myLng = pos.coords.longitude;

        let closest = safetyZones[0];
        let minDist = Infinity;

        safetyZones.forEach((z) => {
          const zLat = z.polygon[0].lat;
          const zLng = z.polygon[0].lng;
          const d = Math.sqrt(Math.pow(myLat - zLat, 2) + Math.pow(myLng - zLng, 2));
          if (d < minDist) {
            minDist = d;
            closest = z;
          }
        });

        setSelectedZone(closest);
        onCenterMap(closest.polygon[0]);

        const riskWord = closest.riskLevel === 'green' ? 'VERDE, zona segura' : closest.riskLevel === 'yellow' ? 'AMARILLO, precaución comercial' : 'ROJO, zona de alerta';
        voiceService.speak(`Semáforo de seguridad para tu ubicación evaluado en ${closest.name}: Nivel ${riskWord}.`);
      },
      () => {
        setEvaluatingGps(false);
        const riskWord = selectedZone.riskLevel === 'green' ? 'VERDE, zona segura' : selectedZone.riskLevel === 'yellow' ? 'AMARILLO, precaución' : 'ROJO, alerta';
        voiceService.speak(`Evaluación en cuadrante ${selectedZone.name}: Nivel ${riskWord}.`);
      },
      { timeout: 7000 }
    );
  };

  const isGreen = selectedZone.riskLevel === 'green';
  const isYellow = selectedZone.riskLevel === 'yellow';
  const isRed = selectedZone.riskLevel === 'red';

  return (
    <div className="space-y-6">
      {/* SOS EMERGENCY HERO CARD */}
      <div className="bg-[#E5233B] border-3 border-[#0B2A3C] rounded-3xl p-6 shadow-[5px_5px_0_#0B2A3C] text-white relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#FFC21A] animate-ping"></span>
              <span className="text-xs font-black font-mono tracking-wider text-[#FFC21A] uppercase bg-[#0B2A3C] px-2.5 py-0.5 rounded-md border border-[#0B2A3C]">
                {t('sos_network_label', currentLanguage)}
              </span>
            </div>
            <h2 className="text-2xl font-black font-['Bricolage_Grotesque']">
              {t('sos_question', currentLanguage)}
            </h2>
            <p className="text-xs text-white/90 font-medium leading-relaxed">
              {t('sos_explanation', currentLanguage)}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={handleTriggerSos}
              className="sticker-btn bg-white text-[#E5233B] hover:bg-[#FFF6E5] font-black text-sm px-6 py-4 rounded-2xl border-3 border-[#0B2A3C] shadow-[3px_3px_0_#0B2A3C] flex items-center justify-center gap-2 transition active:scale-95 animate-pulse cursor-pointer"
            >
              <AlertOctagon className="w-5 h-5" />
              <span>{t('sos_button_cta', currentLanguage)}</span>
            </button>

            <a
              href="tel:911"
              className="sticker-btn bg-[#FFC21A] text-[#0B2A3C] font-black text-sm px-5 py-4 rounded-2xl border-3 border-[#0B2A3C] shadow-[3px_3px_0_#0B2A3C] flex items-center justify-center gap-2 transition"
            >
              <Phone className="w-4 h-4" />
              <span>911</span>
            </a>
          </div>
        </div>
      </div>

      {/* SEMÁFORO DE SEGURIDAD */}
      <div className="bg-white border-3 border-[#0B2A3C] rounded-3xl p-6 shadow-[4px_4px_0_#0B2A3C] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#0B2A3C]/20 pb-4">
          <div>
            <h3 className="text-lg font-black text-[#0B2A3C] font-['Bricolage_Grotesque'] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#14B8C4]" />
              Semáforo Ciudadano & Zonas Seguras Lázaro Cárdenas
            </h3>
            <p className="text-xs text-[#0B2A3C]/70">
              Evaluación en tiempo real de cuadrantes, rutas turísticas y puntos de resguardo naranja.
            </p>
          </div>

          <button
            onClick={handleEvaluateMyGpsLocation}
            disabled={evaluatingGps}
            className="sticker-btn bg-[#14B8C4] hover:bg-[#10a3af] text-white font-bold text-xs px-4 py-2.5 rounded-xl border-2 border-[#0B2A3C] shadow-[2px_2px_0_#0B2A3C] flex items-center gap-2 transition cursor-pointer"
          >
            <LocateFixed className="w-4 h-4 animate-spin-slow" />
            <span>{evaluatingGps ? 'Evaluando...' : 'Evaluar mi GPS actual'}</span>
          </button>
        </div>

        {/* Status card for selected zone */}
        <div className={`p-5 rounded-2xl border-3 border-[#0B2A3C] shadow-[3px_3px_0_#0B2A3C] ${
          isGreen ? 'bg-[#7BD84A]/20' : isYellow ? 'bg-[#FFC21A]/20' : 'bg-[#E5233B]/15'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {isGreen ? '🟢' : isYellow ? '🟡' : '🔴'}
              </span>
              <div>
                <span className="text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full bg-white text-[#0B2A3C] border-2 border-[#0B2A3C]">
                  Nivel: {selectedZone.riskLevel.toUpperCase()}
                </span>
                <h4 className="text-base font-black text-[#0B2A3C] font-['Bricolage_Grotesque'] mt-1">
                  {selectedZone.name}
                </h4>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onCenterMap(selectedZone.polygon[0])}
              className="sticker-btn bg-white hover:bg-[#FFF6E5] text-[#0B2A3C] font-bold text-xs px-3 py-2 rounded-xl border-2 border-[#0B2A3C] shadow-[2px_2px_0_#0B2A3C] flex items-center gap-1.5 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-[#E5233B]" />
              <span>Ver en Mapa</span>
            </button>
          </div>

          <p className="text-xs text-[#0B2A3C] font-medium leading-relaxed bg-white p-3.5 rounded-xl border-2 border-[#0B2A3C]">
            {selectedZone.cautions[currentLanguage] || selectedZone.cautions.es}
          </p>
        </div>

        {/* Zone grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {safetyZones.map((zone) => {
            const isSelected = selectedZone.id === zone.id;
            const zoneGreen = zone.riskLevel === 'green';
            const zoneYellow = zone.riskLevel === 'yellow';

            return (
              <div
                key={zone.id}
                onClick={() => {
                  setSelectedZone(zone);
                  toneGenerator.playSuccessBeep();
                  onCenterMap(zone.polygon[0]);
                }}
                className={`cursor-pointer p-4 rounded-2xl border-2 border-[#0B2A3C] transition shadow-[2px_2px_0_#0B2A3C] ${
                  isSelected ? 'bg-[#0B2A3C] text-white' : 'bg-[#FFF6E5] hover:bg-[#FFE5C0] text-[#0B2A3C]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black font-['Bricolage_Grotesque'] truncate">
                    {zone.name}
                  </span>
                  <span className="text-xs">
                    {zoneGreen ? '🟢' : zoneYellow ? '🟡' : '🔴'}
                  </span>
                </div>
                <p className={`text-[11px] line-clamp-2 ${isSelected ? 'text-white/80' : 'text-[#0B2A3C]/70'}`}>
                  {zone.cautions[currentLanguage] || zone.cautions.es}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safe Points (Puntos Naranja) */}
      <div className="bg-white border-3 border-[#0B2A3C] rounded-3xl p-6 shadow-[4px_4px_0_#0B2A3C] space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF5A3C] text-white border-2 border-[#0B2A3C] flex items-center justify-center font-bold">
            🛡️
          </div>
          <div>
            <h3 className="text-base font-black text-[#0B2A3C] font-['Bricolage_Grotesque']">
              Puntos Naranja y Refugio Seguro 24/7
            </h3>
            <p className="text-xs text-[#0B2A3C]/70">
              Establecimientos comerciales, gasolineras y dependencias con protocolo de protección civil y resguardo inmediato.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {safePoints.map((pt) => (
            <div
              key={pt.id}
              className="bg-[#FFF6E5] border-2 border-[#0B2A3C] rounded-2xl p-4 shadow-[2px_2px_0_#0B2A3C] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black text-[#0B2A3C] font-['Bricolage_Grotesque']">
                    {pt.name}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-[#7BD84A] text-[#0B2A3C] px-2 py-0.5 rounded-full border border-[#0B2A3C]">
                    24/7 Abierto
                  </span>
                </div>
                <p className="text-xs text-[#0B2A3C]/80 mb-3">{pt.address}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#0B2A3C]/20">
                <button
                  type="button"
                  onClick={() => {
                    toneGenerator.playSuccessBeep();
                    onCenterMap(pt.coords);
                  }}
                  className="sticker-btn bg-[#14B8C4] hover:bg-[#10a3af] text-white font-bold text-xs px-3 py-1.5 rounded-xl border-2 border-[#0B2A3C] shadow-[2px_2px_0_#0B2A3C] flex items-center gap-1.5 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Ver Parada / Refugio</span>
                </button>
                <a
                  href={`tel:${pt.phone}`}
                  className="sticker-btn bg-[#FFC21A] hover:bg-[#e6ad15] text-[#0B2A3C] font-bold text-xs px-3 py-1.5 rounded-xl border-2 border-[#0B2A3C] shadow-[2px_2px_0_#0B2A3C] flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{pt.phone}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
