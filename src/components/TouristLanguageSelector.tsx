import React from 'react';
import { Language } from '../types';
import { SUPPORTED_LANGUAGES, t } from '../i18n/touristTranslations';
import { Languages, Check, Sparkles } from 'lucide-react';
import { toneGenerator, voiceService } from '../services/voiceAssistant';

interface TouristLanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  compact?: boolean;
}

const VOICE_CONFIRMATIONS: Record<Language, { text: string; langCode: string }> = {
  es: { text: 'Idioma del Panel Turista cambiado a español.', langCode: 'es-MX' },
  en: { text: 'Tourist Panel language switched to English.', langCode: 'en-US' },
  fr: { text: 'Langue du panneau touriste changée en français.', langCode: 'fr-FR' },
  zh: { text: '游客指南面板已切换为中文普通话。', langCode: 'zh-CN' },
};

export const TouristLanguageSelector: React.FC<TouristLanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
  compact = false,
}) => {
  const handleSelect = (lang: Language) => {
    if (lang === currentLanguage) return;
    toneGenerator.playSuccessBeep();
    onLanguageChange(lang);
    const feedback = VOICE_CONFIRMATIONS[lang];
    if (feedback) {
      voiceService.speak(feedback.text, feedback.langCode);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1 bg-slate-950/90 border border-slate-700/80 rounded-xl p-1 shadow-md">
        <Languages className="w-3.5 h-3.5 text-cyan-400 ml-1.5 mr-0.5 shrink-0" />
        <div className="flex items-center gap-1">
          {SUPPORTED_LANGUAGES.map((item) => {
            const isSelected = item.code === currentLanguage;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => handleSelect(item.code)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
                title={`Cambiar idioma a ${item.name}`}
              >
                <span className="text-sm">{item.flag}</span>
                <span className="text-[11px] font-mono font-bold uppercase">{item.code}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/95 border-2 border-cyan-500/50 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-3.5">
        {/* Header with Title and Active Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-bold shrink-0">
              <Languages className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white">
                  {t('lang_banner_title', currentLanguage)}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold uppercase">
                  {currentLanguage.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {t('lang_banner_desc', currentLanguage)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-cyan-900 self-start sm:self-auto shrink-0">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Multi-Language • 4 Idiomas</span>
          </div>
        </div>

        {/* 4 Language Buttons Grid (Mobile Friendly) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {SUPPORTED_LANGUAGES.map((item) => {
            const isSelected = item.code === currentLanguage;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => handleSelect(item.code)}
                className={`relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer text-center group active:scale-[0.98] ${
                  isSelected
                    ? 'bg-gradient-to-b from-cyan-950 via-slate-900 to-slate-900 border-cyan-400 shadow-lg shadow-cyan-950/60 ring-2 ring-cyan-400/40'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-300'
                }`}
              >
                {/* Check badge when selected */}
                {isSelected && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center text-[10px] font-black shadow">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}

                <span className="text-2xl sm:text-3xl mb-1.5 filter drop-shadow group-hover:scale-110 transition-transform">
                  {item.flag}
                </span>
                
                <span className={`text-xs font-black ${isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                  {item.nativeName}
                </span>

                <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                  {item.name}
                </span>

                {isSelected && (
                  <span className="mt-1.5 text-[9px] font-mono font-bold uppercase tracking-wider text-cyan-400 px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-800/60">
                    {t('lang_active_badge', currentLanguage)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
