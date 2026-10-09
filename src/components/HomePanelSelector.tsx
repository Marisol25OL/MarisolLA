import React from 'react';
import { 
  Bus, 
  FileText, 
  Users, 
  MapPin, 
  ArrowRight, 
  Camera, 
  Compass, 
  CheckCircle2,
  HardDrive,
  Navigation,
  Mic,
  Shield,
  Clock,
  Sparkles,
  PhoneCall,
  Wrench,
  AlertTriangle,
  Waves,
  Building2,
  DollarSign,
  LocateFixed,
  Languages,
  ShieldCheck,
  HardHat,
  Search,
  Filter
} from 'lucide-react';
import { toneGenerator, voiceService } from '../services/voiceAssistant';

interface HomePanelSelectorProps {
  onSelectPanel: (panel: 'turista' | 'locatario' | 'chofer' | 'admin') => void;
  activePanel?: 'turista' | 'locatario' | 'chofer' | 'admin' | 'inicio';
  unitCount?: number;
  reportCount?: number;
}

export const HomePanelSelector: React.FC<HomePanelSelectorProps> = ({
  onSelectPanel,
  activePanel = 'inicio',
  unitCount = 5,
  reportCount = 8,
}) => {
  const handlePick = (panel: 'turista' | 'locatario' | 'chofer' | 'admin', title: string) => {
    toneGenerator.playSuccessBeep();
    voiceService.speak(`Abriendo ${title}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onSelectPanel(panel);
  };

  return (
    <div className="space-y-6 sm:space-y-8 py-2 animate-in fade-in duration-300">
      
      {/* ===================== HERO WELCOME BANNER ("Combi Vivo" Sticker Style) ===================== */}
      <div className="relative overflow-hidden rounded-[28px] bg-white border-[3px] border-[#0B2A3C] p-6 sm:p-9 shadow-[4px_4px_0_#0B2A3C] text-center space-y-4">
        {/* Decorative sun / waves */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-[#FFC21A]/25 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-[#14B8C4]/25 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-3">
          {/* Friendly pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFC21A] border-2 border-[#0B2A3C] text-[#0B2A3C] text-xs font-black shadow-[2px_2px_0_#0B2A3C]">
            <Sparkles className="w-4 h-4 text-[#0B2A3C]" />
            <span>CIUDAD INTELIGENTE • LÁZARO CÁRDENAS, MICHOACÁN</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0B2A3C] tracking-tight leading-tight font-['Bricolage_Grotesque']">
            Bienvenido a <span className="text-[#FF5A3C]">LC NOVA</span>
          </h1>

          <p className="text-sm sm:text-base text-[#0B2A3C]/80 leading-relaxed max-w-2xl mx-auto font-medium">
            Toca el panel que necesitas usar hoy. Todo está diseñado con <strong className="text-[#0B2A3C] font-bold">iconos y pasos sencillos</strong> para que cualquier persona lo use sin complicaciones.
          </p>

          {/* Quick 4-step visual guide */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-2 max-w-2xl mx-auto text-[11px] sm:text-xs">
            <div 
              onClick={() => handlePick('turista', 'Panel Turista')}
              className="bg-[#14B8C4]/15 hover:bg-[#14B8C4]/30 border-2 border-[#0B2A3C] rounded-2xl p-2.5 flex items-center justify-center gap-2 text-[#0B2A3C] font-black cursor-pointer transition shadow-[2px_2px_0_#0B2A3C] active:translate-y-0.5"
            >
              <span className="text-base">🏖️</span>
              <span>1. Turista</span>
            </div>
            <div 
              onClick={() => handlePick('locatario', 'Panel Locatario')}
              className="bg-[#FFC21A]/25 hover:bg-[#FFC21A]/40 border-2 border-[#0B2A3C] rounded-2xl p-2.5 flex items-center justify-center gap-2 text-[#0B2A3C] font-black cursor-pointer transition shadow-[2px_2px_0_#0B2A3C] active:translate-y-0.5"
            >
              <span className="text-base">🏡</span>
              <span>2. Locatario</span>
            </div>
            <div 
              onClick={() => handlePick('chofer', 'Panel Chofer')}
              className="bg-[#FF5A3C]/20 hover:bg-[#FF5A3C]/35 border-2 border-[#0B2A3C] rounded-2xl p-2.5 flex items-center justify-center gap-2 text-[#0B2A3C] font-black cursor-pointer transition shadow-[2px_2px_0_#0B2A3C] active:translate-y-0.5"
            >
              <span className="text-base">🚐</span>
              <span>3. Chofer</span>
            </div>
            <div 
              onClick={() => handlePick('admin', 'Panel Administrador')}
              className="bg-[#B779FF]/20 hover:bg-[#B779FF]/35 border-2 border-[#0B2A3C] rounded-2xl p-2.5 flex items-center justify-center gap-2 text-[#0B2A3C] font-black cursor-pointer transition shadow-[2px_2px_0_#0B2A3C] active:translate-y-0.5"
            >
              <span className="text-base">🛡️</span>
              <span>4. Admin</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== LOS 4 PANELES CON ESTILO "COMBI VIVO" ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        
        {/* ========================================================
            1. PANEL TURISTA / VISITANTE (Turquesa)
        ======================================================== */}
        <div 
          onClick={() => handlePick('turista', 'Panel Turista')}
          className="group relative flex flex-col justify-between bg-white border-[3px] border-[#0B2A3C] rounded-[28px] p-5 sm:p-6 shadow-[4px_4px_0_#0B2A3C] hover:shadow-[6px_6px_0_#0B2A3C] transition-all duration-200 hover:-translate-y-1 active:translate-y-0.5 cursor-pointer overflow-hidden"
        >
          {/* Top color accent strip */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-[#14B8C4]" />

          <div className="space-y-4 pt-1">
            {/* Header Icon + Role Pill */}
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-[#14B8C4]/20 border-2 border-[#0B2A3C] text-[#0B2A3C] flex items-center justify-center text-3xl shadow-[2px_2px_0_#0B2A3C] group-hover:scale-110 transition-transform">
                🏖️
              </div>
              <span className="text-[11px] font-black px-3 py-1 rounded-full bg-[#14B8C4] text-[#0B2A3C] border-2 border-[#0B2A3C] uppercase tracking-wide shadow-[1px_1px_0_#0B2A3C]">
                1 • Visitante
              </span>
            </div>

            {/* Title & Friendly Description */}
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#0B2A3C] group-hover:text-[#14B8C4] transition-colors font-['Bricolage_Grotesque']">
                Panel Turista
              </h2>
              <p className="text-[11px] font-black text-[#14B8C4] mt-0.5">
                Combis • Playas • 4 Idiomas
              </p>
              <p className="text-xs text-[#0B2A3C]/80 mt-2 leading-relaxed font-medium">
                Qué combi tomar, horarios, tarifa oficial de $12 pesos, lugares para comer y playas con traducción instantánea.
              </p>
            </div>

            {/* Visual Icon Features */}
            <div className="space-y-2 pt-2 border-t-2 border-[#0B2A3C]/10 text-xs">
              <div className="flex items-center gap-2 text-[#0B2A3C] bg-[#FFF6E5] p-2 rounded-xl border-2 border-[#0B2A3C]/30">
                <span className="text-base shrink-0">🚌</span>
                <span><strong>Rutas en vivo:</strong> Qué combi tomar</span>
              </div>
              <div className="flex items-center gap-2 text-[#0B2A3C] bg-[#FFF6E5] p-2 rounded-xl border-2 border-[#0B2A3C]/30">
                <span className="text-base shrink-0">💵</span>
                <span><strong>Tarifa:</strong> $12.00 MXN oficial</span>
              </div>
              <div className="flex items-center gap-2 text-[#0B2A3C] bg-[#FFF6E5] p-2 rounded-xl border-2 border-[#0B2A3C]/30">
                <span className="text-base shrink-0">🏖️</span>
                <span><strong>Playas:</strong> Playa Azul y enramadas</span>
              </div>
              <div className="flex items-center gap-2 text-[#0B2A3C] bg-[#FFF6E5] p-2 rounded-xl border-2 border-[#0B2A3C]/30">
                <span className="text-base shrink-0">🌐</span>
                <span><strong>Idiomas:</strong> ES, EN, FR y ZH</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 mt-4 border-t-2 border-[#0B2A3C]/10">
            <button
              type="button"
              className="w-full min-h-[44px] bg-[#14B8C4] hover:bg-[#119da7] text-[#0B2A3C] font-black text-xs py-3 px-3 rounded-xl flex items-center justify-center gap-2 border-2 border-[#0B2A3C] shadow-[2px_2px_0_#0B2A3C] transition duration-200 cursor-pointer active:translate-y-0.5"
            >
              <Navigation className="w-3.5 h-3.5 text-[#0B2A3C] stroke-[3]" />
              <span>USAR TURISTA</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* ========================================================
            2. PANEL LOCATARIO / CIUDADANO (Mango / Amarillo)
        ======================================================== */}
        <div 
          onClick={() => handlePick('locatario', 'Panel Locatario')}
          className="group relative flex flex-col justify-between bg-white border-[3px] border-[#0B2A3C] rounded-[28px] p-5 sm:p-6 shadow-[4px_4px_0_#0B2A3C] hover:shadow-[6px_6px_0_#0B2A3C] transition-all duration-200 hover:-translate-y-1 active:translate-y-0.5 cursor-pointer overflow-hidden"
        >
          {/* Top color accent strip */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-[#FFC21A]" />

          <div className="space-y-4 pt-1">
            {/* Header Icon + Role Pill */}
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-[#FFC21A]/25 border-2 border-[#0B2A3C] text-[#0B2A3C] flex items-center justify-center text-3xl shadow-[2px_2px_0_#0B2A3C] group-hover:scale-110 transition-transform">
                🏡
              </div>
              <span className="text-[11px] font-black px-3 py-1 rounded-full bg-[#FFC21A] text-[#0B2A3C] border-2 border-[#0B2A3C] uppercase tracking-wide shadow-[1px_1px_0_#0B2A3C]">
                2 • Ciudadano
              </span>
            </div>

            {/* Title & Friendly Description */}
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#0B2A3C] group-hover:text-[#d69e00] transition-colors font-['Bricolage_Grotesque']">
                Panel Locatario
              </h2>
              <p className="text-[11px] font-black text-[#d69e00] mt-0.5">
                Reportes • Sobrecupo de Combis
              </p>
              <p className="text-xs text-[#0B2A3C]/80 mt-2 leading-relaxed font-medium">
                Reporta baches, alumbrado, fugas y animales con tu voz y cámara sellada con GPS, o avisa cuando las combis vayan llenas.
              </p>
            </div>

            {/* Visual Icon Features */}
            <div className="space-y-2 pt-2 border-t-2 border-[#0B2A3C]/10 text-xs">
              <div className="flex items-center gap-2 text-[#0B2A3C] bg-[#FFF6E5] p-2 rounded-xl border-2 border-[#0B2A3C]/30">
                <span className="text-base shrink-0">🎙️</span>
                <span><strong>Por Voz:</strong> Habla y se escribe solo</span>
              </div>
              <div className="flex items-center gap-2 text-[#0B2A3C] bg-[#FFF6E5] p-2 rounded-xl border-2 border-[#0B2A3C]/30">
                <span className="text-base shrink-0">📸</span>
                <span><strong>Foto GPS:</strong> Sello de hora y fecha</span>
              </div>
              <div className="flex items-center gap-2 text-[#0B2A3C] bg-[#FFF6E5] p-2 rounded-xl border-2 border-[#0B2A3C]/30">
                <span className="text-base shrink-0">🚐</span>
                <span><strong>Sobrecupo:</strong> Pide apoyo de combi</span>
              </div>
              <div className="flex items-center gap-2 text-[#0B2A3C] bg-[#FFF6E5] p-2 rounded-xl border-2 border-[#0B2A3C]/30">
                <span className="text-base shrink-0">📋</span>
                <span><strong>Folio Oficial:</strong> Imprime tu reporte</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 mt-4 border-t-2 border-[#0B2A3C]/10">
            <button
              type="button"
              className="w-full min-h-[44px] bg-[#FFC21A] hover:bg-[#e0aa14] text-[#0B2A3C] font-black text-xs py-3 px-3 rounded-xl flex items-center justify-center gap-2 border-2 border-[#0B2A3C] shadow-[2px_2px_0_#0B2A3C] transition duration-200 cursor-pointer active:translate-y-0.5"
            >
              <FileText className="w-3.5 h-3.5 text-[#0B2A3C] stroke-[3]" />
              <span>USAR LOCATARIO</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* ========================================================
            3. PANEL CHOFER / OPERADOR (Coral / Naranja)
        ======================================================== */}
        <div 
          onClick={() => handlePick('chofer', 'Panel Chofer')}
          className="group relative flex flex-col justify-between bg-white border-[3px] border-[#0B2A3C] rounded-[28px] p-5 sm:p-6 shadow-[4px_4px_0_#0B2A3C] hover:shadow-[6px_6px_0_#0B2A3C] transition-all duration-200 hover:-translate-y-1 active:translate-y-0.5 cursor-pointer overflow-hidden"
        >
          {/* Top color accent strip */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-[#FF5A3C]" />

          <div className="space-y-4 pt-1">
            {/* Header Icon + Role Pill */}
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-[#FF5A3C]/20 border-2 border-[#0B2A3C] text-[#0B2A3C] flex items-center justify-center text-3xl shadow-[2px_2px_0_#0B2A3C] group-hover:scale-110 transition-transform">
                🚐
              </div>
              <span className="text-[11px] font-black px-3 py-1 rounded-full bg-[#FF5A3C] text-white border-2 border-[#0B2A3C] uppercase tracking-wide shadow-[1px_1px_0_#0B2A3C]">
                3 • Conductor
              </span>
            </div>

            {/* Title & Friendly Description */}
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#0B2A3C] group-hover:text-[#FF5A3C] transition-colors font-['Bricolage_Grotesque']">
                Panel Chofer
              </h2>
              <p className="text-[11px] font-black text-[#FF5A3C] mt-0.5">
                Consola • Asientos • Auxilio
              </p>
              <p className="text-xs text-[#0B2A3C]/80 mt-2 leading-relaxed font-medium">
                Herramienta de trabajo para choferes. Transmite GPS, cuenta pasajeros con botones grandes y pide grúa o refuerzo.
              </p>
            </div>

            {/* Visual Icon Features */}
            <div className="space-y-2 pt-2 border-t-2 border-[#0B2A3C]/10 text-xs">
              <div className="flex items-center gap-2 text-[#0B2A3C] bg-[#FFF6E5] p-2 rounded-xl border-2 border-[#0B2A3C]/30">
                <span className="text-base shrink-0">📍</span>
                <span><strong>Transmisión GPS:</strong> Los pasajeros te ven</span>
              </div>
              <div className="flex items-center gap-2 text-[#0B2A3C] bg-[#FFF6E5] p-2 rounded-xl border-2 border-[#0B2A3C]/30">
                <span className="text-base shrink-0">👥</span>
                <span><strong>Conteo:</strong> Botones rápidos + y -</span>
              </div>
              <div className="flex items-center gap-2 text-[#0B2A3C] bg-[#FFF6E5] p-2 rounded-xl border-2 border-[#0B2A3C]/30">
                <span className="text-base shrink-0">🔧</span>
                <span><strong>Falla Mecánica:</strong> Alerta de auxilio</span>
              </div>
              <div className="flex items-center gap-2 text-[#0B2A3C] bg-[#FFF6E5] p-2 rounded-xl border-2 border-[#0B2A3C]/30">
                <span className="text-base shrink-0">🚑</span>
                <span><strong>Refuerzo:</strong> Despacha combi de apoyo</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 mt-4 border-t-2 border-[#0B2A3C]/10">
            <button
              type="button"
              className="w-full min-h-[44px] bg-[#FF5A3C] hover:bg-[#e0482b] text-white font-black text-xs py-3 px-3 rounded-xl flex items-center justify-center gap-2 border-2 border-[#0B2A3C] shadow-[2px_2px_0_#0B2A3C] transition duration-200 cursor-pointer active:translate-y-0.5"
            >
              <Bus className="w-3.5 h-3.5 text-white stroke-[3]" />
              <span>USAR CHOFER</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* ========================================================
            4. PANEL ADMINISTRADOR (Orquídea / Morado)
        ======================================================== */}
        <div 
          onClick={() => handlePick('admin', 'Panel Administrador')}
          className="group relative flex flex-col justify-between bg-white border-[3px] border-[#0B2A3C] rounded-[28px] p-5 sm:p-6 shadow-[4px_4px_0_#0B2A3C] hover:shadow-[6px_6px_0_#0B2A3C] transition-all duration-200 hover:-translate-y-1 active:translate-y-0.5 cursor-pointer overflow-hidden"
        >
          {/* Top color accent strip */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-[#B779FF]" />

          <div className="space-y-4 pt-1">
            {/* Header Icon + Role Pill */}
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-[#B779FF]/20 border-2 border-[#0B2A3C] text-[#0B2A3C] flex items-center justify-center text-3xl shadow-[2px_2px_0_#0B2A3C] group-hover:scale-110 transition-transform">
                🛡️
              </div>
              <span className="text-[11px] font-black px-3 py-1 rounded-full bg-[#B779FF] text-white border-2 border-[#0B2A3C] uppercase tracking-wide shadow-[1px_1px_0_#0B2A3C]">
                4 • Admin Control
              </span>
            </div>

            {/* Title & Friendly Description */}
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#0B2A3C] group-hover:text-[#9b53e8] transition-colors font-['Bricolage_Grotesque']">
                Panel Administrador
              </h2>
              <p className="text-[11px] font-black text-[#9b53e8] mt-0.5">
                Control de Denuncias • Cuadrillas
              </p>
              <p className="text-xs text-[#0B2A3C]/80 mt-2 leading-relaxed font-medium">
                Monitorea todas las denuncias ciudadanas de baches, alumbrado, fauna y sobrecupo. Asigna cuadrillas y marca reparaciones.
              </p>
            </div>

            {/* Visual Icon Features */}
            <div className="space-y-2 pt-2 border-t-2 border-[#0B2A3C]/10 text-xs">
              <div className="flex items-center gap-2 text-[#0B2A3C] bg-[#FFF6E5] p-2 rounded-xl border-2 border-[#0B2A3C]/30">
                <span className="text-base shrink-0">📋</span>
                <span><strong>Todas las Denuncias:</strong> {reportCount} registradas</span>
              </div>
              <div className="flex items-center gap-2 text-[#0B2A3C] bg-[#FFF6E5] p-2 rounded-xl border-2 border-[#0B2A3C]/30">
                <span className="text-base shrink-0">🛠️</span>
                <span><strong>Cuadrillas:</strong> Bacheo, CAPALAC, Limpia</span>
              </div>
              <div className="flex items-center gap-2 text-[#0B2A3C] bg-[#FFF6E5] p-2 rounded-xl border-2 border-[#0B2A3C]/30">
                <span className="text-base shrink-0">🟢</span>
                <span><strong>Estados:</strong> Recibido ➔ En sitio ➔ Resuelto</span>
              </div>
              <div className="flex items-center gap-2 text-[#0B2A3C] bg-[#FFF6E5] p-2 rounded-xl border-2 border-[#0B2A3C]/30">
                <span className="text-base shrink-0">🖨️</span>
                <span><strong>Actas Oficiales:</strong> Impresión y evidencia GPS</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 mt-4 border-t-2 border-[#0B2A3C]/10">
            <button
              type="button"
              className="w-full min-h-[44px] bg-[#B779FF] hover:bg-[#a15ee6] text-white font-black text-xs py-3 px-3 rounded-xl flex items-center justify-center gap-2 border-2 border-[#0B2A3C] shadow-[2px_2px_0_#0B2A3C] transition duration-200 cursor-pointer active:translate-y-0.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-white stroke-[3]" />
              <span>USAR ADMINISTRADOR</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>

      {/* ===================== CUATRO TARJETAS DE GARANTÍA INCLUSIVA (Combi Vivo) ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs pt-1">
        <div className="bg-white border-2 border-[#0B2A3C] rounded-2xl p-4 flex items-center gap-3.5 shadow-[3px_3px_0_#0B2A3C]">
          <div className="w-10 h-10 rounded-xl bg-[#14B8C4]/20 border-2 border-[#0B2A3C] text-[#0B2A3C] flex items-center justify-center text-xl shrink-0 shadow-[1px_1px_0_#0B2A3C]">
            👌
          </div>
          <div>
            <p className="font-extrabold text-[#0B2A3C] text-xs font-['Bricolage_Grotesque']">Sin Registros ni Contraseñas</p>
            <p className="text-[#0B2A3C]/70 text-[11px] font-medium">Entra y usa cualquier función al instante.</p>
          </div>
        </div>

        <div className="bg-white border-2 border-[#0B2A3C] rounded-2xl p-4 flex items-center gap-3.5 shadow-[3px_3px_0_#0B2A3C]">
          <div className="w-10 h-10 rounded-xl bg-[#7BD84A]/30 border-2 border-[#0B2A3C] text-[#0B2A3C] flex items-center justify-center text-xl shrink-0 shadow-[1px_1px_0_#0B2A3C]">
            📶
          </div>
          <div>
            <p className="font-extrabold text-[#0B2A3C] text-xs font-['Bricolage_Grotesque']">Funciona También Sin Internet</p>
            <p className="text-[#0B2A3C]/70 text-[11px] font-medium">Guarda en tu celular y envía al volver la señal.</p>
          </div>
        </div>

        <div className="bg-white border-2 border-[#0B2A3C] rounded-2xl p-4 flex items-center gap-3.5 shadow-[3px_3px_0_#0B2A3C]">
          <div className="w-10 h-10 rounded-xl bg-[#B779FF]/20 border-2 border-[#0B2A3C] text-[#0B2A3C] flex items-center justify-center text-xl shrink-0 shadow-[1px_1px_0_#0B2A3C]">
            🛡️
          </div>
          <div>
            <p className="font-extrabold text-[#0B2A3C] text-xs font-['Bricolage_Grotesque']">Control Total de Denuncias</p>
            <p className="text-[#0B2A3C]/70 text-[11px] font-medium">Panel administrador para supervisar todas las obras.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
