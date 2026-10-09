import React, { useState, useMemo } from 'react';
import { 
  CatalogItem, 
  Language, 
  MainCategory,
  SubCategory,
  Coordinates,
  TransitRoute,
  TransitUnit 
} from '../types';
import { 
  Briefcase, 
  Compass, 
  HeartPulse, 
  Utensils, 
  Languages, 
  MapPin, 
  Navigation, 
  Phone, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Volume2,
  Search,
  ShoppingCart,
  BedDouble,
  X,
  Filter,
  Layers,
  ChevronRight,
  Bus,
  ExternalLink,
  LocateFixed,
  Route
} from 'lucide-react';
import { toneGenerator, voiceService } from '../services/voiceAssistant';

interface PortTourismModuleProps {
  catalogItems: CatalogItem[];
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  onSelectLocationOnMap: (coords: Coordinates) => void;
  userLocation?: Coordinates | null;
  routes?: TransitRoute[];
  units?: TransitUnit[];
  onTraceRoute?: (result: {
    origin: Coordinates;
    destination: Coordinates;
    route: TransitRoute;
    walkingPath: Coordinates[];
    transitPath: Coordinates[];
    destinationName: string;
    instructions: string[];
  }) => void;
}

export const PortTourismModule: React.FC<PortTourismModuleProps> = ({
  catalogItems,
  currentLanguage,
  onLanguageChange,
  onSelectLocationOnMap,
  userLocation,
  routes = [],
  units = [],
  onTraceRoute,
}) => {
  const [selectedMainCategory, setSelectedMainCategory] = useState<MainCategory | 'all'>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const mainCategories: Array<{ 
    id: MainCategory | 'all'; 
    label: Record<Language, string>; 
    icon: string;
    color: string;
  }> = [
    {
      id: 'all',
      label: { es: 'Todo el Directorio', en: 'All Directory', zh: '全部目录', fr: 'Tout le Répertoire' },
      icon: '✨',
      color: 'bg-[#14B8C4]',
    },
    {
      id: 'empleos_industrias',
      label: { es: 'Empleos e Industrias', en: 'Industries & Jobs', zh: '产业与就业基地', fr: 'Industries & Emplois' },
      icon: '⚙️',
      color: 'bg-[#FFC21A]',
    },
    {
      id: 'turismo',
      label: { es: 'Turismo & Playas', en: 'Tourism', zh: '城市与港口旅游', fr: 'Tourisme' },
      icon: '🏖️',
      color: 'bg-[#7BD84A]',
    },
    {
      id: 'atencion_medica',
      label: { es: 'Atención Médica', en: 'Medical Care', zh: '医疗救护与医院', fr: 'Soins Médicaux' },
      icon: '🏥',
      color: 'bg-[#E5233B]',
    },
    {
      id: 'donde_comer',
      label: { es: 'Dónde Comer', en: 'Dining & Groceries', zh: '美食餐饮与商超', fr: 'Restauration & Courses' },
      icon: '🐟',
      color: 'bg-[#FF5A3C]',
    },
    {
      id: 'hospedaje',
      label: { es: 'Hospedaje', en: 'Lodging & Hotels', zh: '住宿酒店', fr: 'Hébergement' },
      icon: '🏨',
      color: 'bg-[#B779FF]',
    },
  ];

  const subCategoriesConfig = useMemo(() => {
    return {
      turismo: [
        { id: 'all', label: { es: 'Todo el Turismo', en: 'All Tourism', zh: '全部旅游', fr: 'Tout le Tourisme' } },
        { id: 'ambiental_ecoturismo', label: { es: '🌿 Ecoturismo & Playas', en: '🌿 Eco-Tourism', zh: '🌿 生态环境旅游', fr: '🌿 Écotourisme' } },
        { id: 'industrial_portuario', label: { es: '🏗️ Turismo Industrial', en: '🏗️ Industrial Tours', zh: '🏗️ 港口工业观光', fr: '🏗️ Tourisme Industriel' } },
      ],
      donde_comer: [
        { id: 'all', label: { es: 'Todos los Comercios', en: 'All Eateries', zh: '全部餐饮商户', fr: 'Tous les Commerces' } },
        { id: 'restaurantes_mariscos', label: { es: '🐟 Mariscos & Playa', en: '🐟 Seafood', zh: '🐟 特色海鲜餐厅', fr: '🐟 Poissons' } },
        { id: 'supermercados', label: { es: '🛒 Supermercados', en: '🛒 Supermarkets', zh: '🛒 超市', fr: '🛒 Supermarchés' } },
      ],
      empleos_industrias: [
        { id: 'all', label: { es: 'Todas las Industrias', en: 'All Industries', zh: '全部产业板块', fr: 'Tous les Secteurs' } },
        { id: 'siderurgica_metal', label: { es: '⚙️ Siderurgia', en: '⚙️ Steel', zh: '⚙️ 钢铁', fr: '⚙️ Sidérurgie' } },
        { id: 'terminales_portuarias', label: { es: '🚢 Terminales Portuarias', en: '🚢 Port Terminals', zh: '🚢 码头', fr: '🚢 Terminaux' } },
      ],
      atencion_medica: [
        { id: 'all', label: { es: 'Todos los Centros', en: 'All Facilities', zh: '全部医疗', fr: 'Tous' } },
        { id: 'hospitales_generales', label: { es: '🏥 Hospitales', en: '🏥 Hospitals', zh: '🏥 医院', fr: '🏥 Hôpitaux' } },
      ],
      hospedaje: [
        { id: 'all', label: { es: 'Todos los Hoteles', en: 'All Hotels', zh: '全部酒店', fr: 'Tous' } },
      ],
    };
  }, []);

  const filteredItems = useMemo(() => {
    return catalogItems.filter((item) => {
      if (selectedMainCategory !== 'all' && item.mainCategory !== selectedMainCategory) return false;
      if (selectedSubCategory !== 'all' && item.subCategory !== selectedSubCategory) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = item.name[currentLanguage]?.toLowerCase().includes(q) || item.name.es.toLowerCase().includes(q);
        const descMatch = item.description[currentLanguage]?.toLowerCase().includes(q) || item.description.es.toLowerCase().includes(q);
        const addressMatch = item.address.toLowerCase().includes(q);
        if (!nameMatch && !descMatch && !addressMatch) return false;
      }
      return true;
    });
  }, [catalogItems, selectedMainCategory, selectedSubCategory, searchQuery, currentLanguage]);

  const currentSubCategories = selectedMainCategory !== 'all' 
    ? (subCategoriesConfig as any)[selectedMainCategory] || [] 
    : [];

  return (
    <div className="space-y-6">
      {/* Header Banner - Combi Vivo Style */}
      <div className="bg-white border-3 border-[#0B2A3C] rounded-3xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-[4px_4px_0_#0B2A3C]">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full bg-[#14B8C4] text-white border border-[#0B2A3C] uppercase">
              DIRECTORIO LÁZARO CÁRDENAS
            </span>
            <span className="text-xs text-[#0B2A3C]/70 font-bold">
              {catalogItems.length} Lugares & Conexión en Combi
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0B2A3C] font-['Bricolage_Grotesque']">
            Guía Portuaria, Turismo, Industrias & Servicios
          </h2>
          <p className="text-xs text-[#0B2A3C]/70 mt-1 max-w-2xl font-medium">
            Encuentra playas, industrias, hospitales y restaurantes con su ruta de transporte público asociada.
          </p>
        </div>

        {/* Language switcher */}
        <div className="flex items-center gap-2 bg-[#FFF6E5] p-2 rounded-2xl border-2 border-[#0B2A3C] shrink-0 self-start lg:self-auto shadow-[2px_2px_0_#0B2A3C]">
          <Languages className="w-4 h-4 text-[#0B2A3C] shrink-0 ml-1" />
          <div className="flex gap-1">
            {(['es', 'en', 'zh', 'fr'] as Language[]).map(lang => (
              <button
                key={lang}
                onClick={() => {
                  toneGenerator.playSuccessBeep();
                  onLanguageChange(lang);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition uppercase cursor-pointer border-2 ${
                  currentLanguage === lang
                    ? 'bg-[#FF5A3C] text-white border-[#0B2A3C] shadow-[1px_1px_0_#0B2A3C]'
                    : 'bg-white text-[#0B2A3C] border-transparent hover:border-[#0B2A3C]'
                }`}
              >
                {lang === 'zh' ? '中文' : lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Categories Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {mainCategories.map((cat) => {
          const isSelected = selectedMainCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedMainCategory(cat.id);
                setSelectedSubCategory('all');
                toneGenerator.playSuccessBeep();
              }}
              className={`sticker-btn px-4 py-3 rounded-2xl border-3 border-[#0B2A3C] font-black text-xs flex items-center gap-2 shrink-0 transition cursor-pointer shadow-[3px_3px_0_#0B2A3C] ${
                isSelected
                  ? 'bg-[#0B2A3C] text-white'
                  : 'bg-white text-[#0B2A3C] hover:bg-[#FFF6E5]'
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span className="font-['Bricolage_Grotesque']">{cat.label[currentLanguage] || cat.label.es}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Subcategories Bar */}
      <div className="bg-white border-3 border-[#0B2A3C] rounded-2xl p-4 shadow-[4px_4px_0_#0B2A3C] flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#0B2A3C]/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, colonia o ruta..."
            className="w-full bg-[#FFF6E5] text-[#0B2A3C] placeholder-[#0B2A3C]/50 text-xs font-bold pl-10 pr-4 py-3 rounded-xl border-2 border-[#0B2A3C] focus:outline-none focus:ring-2 focus:ring-[#14B8C4]"
          />
        </div>

        {currentSubCategories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
            {currentSubCategories.map((sub: any) => (
              <button
                key={sub.id}
                onClick={() => {
                  setSelectedSubCategory(sub.id);
                  toneGenerator.playSuccessBeep();
                }}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border-2 border-[#0B2A3C] shrink-0 cursor-pointer ${
                  selectedSubCategory === sub.id
                    ? 'bg-[#14B8C4] text-white shadow-[2px_2px_0_#0B2A3C]'
                    : 'bg-[#FFF6E5] text-[#0B2A3C] hover:bg-[#FFE5C0]'
                }`}
              >
                {sub.label[currentLanguage] || sub.label.es}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white border-3 border-[#0B2A3C] rounded-3xl p-5 shadow-[4px_4px_0_#0B2A3C] flex flex-col justify-between transition hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-black px-3 py-1 rounded-full bg-[#FFC21A] text-[#0B2A3C] border-2 border-[#0B2A3C]">
                  {item.mainCategory.replace('_', ' ').toUpperCase()}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    toneGenerator.playSuccessBeep();
                    const text = `${item.name[currentLanguage] || item.name.es}. ${item.description[currentLanguage] || item.description.es}. Dirección: ${item.address}. Combi sugerida: ${item.recommendedBusRoute}`;
                    voiceService.speak(text, currentLanguage === 'es' ? 'es-MX' : 'en-US');
                  }}
                  className="w-8 h-8 rounded-xl bg-[#FFF6E5] text-[#0B2A3C] border-2 border-[#0B2A3C] shadow-[1px_1px_0_#0B2A3C] flex items-center justify-center hover:bg-[#FFE5C0] cursor-pointer"
                  title="Escuchar audio"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-base font-black text-[#0B2A3C] font-['Bricolage_Grotesque'] mb-1.5">
                {item.name[currentLanguage] || item.name.es}
              </h3>

              <p className="text-xs text-[#0B2A3C]/80 font-medium mb-3 line-clamp-2">
                {item.description[currentLanguage] || item.description.es}
              </p>

              <div className="space-y-1.5 text-xs text-[#0B2A3C] mb-4 bg-[#FFF6E5] p-3 rounded-2xl border-2 border-[#0B2A3C]">
                <p className="flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-[#E5233B] shrink-0 mt-0.5" />
                  <span className="font-bold">{item.address}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Bus className="w-4 h-4 text-[#14B8C4] shrink-0" />
                  <span className="font-black text-[#14B8C4]">Combi: {item.recommendedBusRoute}</span>
                </p>
                <p className="flex items-center gap-1.5 text-[11px] text-[#0B2A3C]/70">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.schedule}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 pt-2.5 border-t-2 border-[#0B2A3C]/20">
              <button
                type="button"
                onClick={() => {
                  toneGenerator.playSuccessBeep();
                  onSelectLocationOnMap(item.coords);
                }}
                className="sticker-btn flex-1 bg-[#14B8C4] hover:bg-[#10a3af] text-white font-bold text-[11px] py-1.5 px-2.5 rounded-lg border-2 border-[#0B2A3C] shadow-[2px_2px_0_#0B2A3C] flex items-center justify-center gap-1 cursor-pointer"
              >
                <MapPin className="w-3 h-3" />
                <span>Ver Mapa</span>
              </button>

              {onTraceRoute && (
                <button
                  type="button"
                  onClick={() => {
                    toneGenerator.playSuccessBeep();
                    const r = routes.find(rt => rt.name.toLowerCase().includes(item.recommendedBusRoute.toLowerCase())) || routes[0];
                    const origin = userLocation || { lat: 17.9632, lng: -102.1985 };
                    onTraceRoute({
                      origin,
                      destination: item.coords,
                      route: r,
                      walkingPath: [origin, r.stops[0].coords],
                      transitPath: r.waypoints,
                      destinationName: item.name[currentLanguage] || item.name.es,
                      instructions: [
                        `Camina hacia la parada principal de la ruta ${r.name}`,
                        `Aborda la combi ${r.name}`,
                        `Bájate en la parada cercana a ${item.name.es}`,
                      ],
                    });
                    onSelectLocationOnMap(item.coords);
                    voiceService.speak(`Trazando ruta en combi hacia ${item.name.es}.`);
                  }}
                  className="sticker-btn bg-[#FFC21A] hover:bg-[#e6ad15] text-[#0B2A3C] font-black text-[11px] py-1.5 px-2.5 rounded-lg border-2 border-[#0B2A3C] shadow-[2px_2px_0_#0B2A3C] flex items-center justify-center gap-1 cursor-pointer"
                  title="Trazar ruta de combi"
                >
                  <Route className="w-3.5 h-3.5" />
                  <span>Ruta</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
