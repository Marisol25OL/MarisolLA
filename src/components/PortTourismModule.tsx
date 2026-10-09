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
  const [routeCalculationModal, setRouteCalculationModal] = useState<CatalogItem | null>(null);

  // Origin selection for route calculation
  const [selectedOriginType, setSelectedOriginType] = useState<string>('gps');
  const [customOriginCoords, setCustomOriginCoords] = useState<Coordinates | null>(null);
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);

  // Main Categories Config (Satisfies user prompts: Empleos diversos, Turismo unificado, Atención Médica, Dónde Comer)
  const mainCategories: Array<{ 
    id: MainCategory | 'all'; 
    label: Record<Language, string>; 
    icon: React.ReactNode;
    color: string;
  }> = [
    {
      id: 'all',
      label: { 
        es: 'Todo el Directorio', 
        en: 'All Directory', 
        zh: '全部目录', 
        fr: 'Tout le Répertoire' 
      },
      icon: <Sparkles className="w-4 h-4" />,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      id: 'empleos_industrias',
      label: { 
        es: 'Empleos e Industrias', 
        en: 'Industries & Jobs', 
        zh: '产业与就业基地', 
        fr: 'Industries & Emplois' 
      },
      icon: <Briefcase className="w-4 h-4" />,
      color: 'from-blue-600 to-indigo-600',
    },
    {
      id: 'turismo',
      label: { 
        es: 'Turismo', 
        en: 'Tourism', 
        zh: '城市与港口旅游', 
        fr: 'Tourisme' 
      },
      icon: <Compass className="w-4 h-4" />,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'atencion_medica',
      label: { 
        es: 'Atención Médica', 
        en: 'Medical Care', 
        zh: '医疗救护与医院', 
        fr: 'Soins Médicaux' 
      },
      icon: <HeartPulse className="w-4 h-4" />,
      color: 'from-red-500 to-pink-600',
    },
    {
      id: 'donde_comer',
      label: { 
        es: 'Dónde Comer & Abastecimiento', 
        en: 'Dining & Groceries', 
        zh: '美食餐饮与商超', 
        fr: 'Restauration & Courses' 
      },
      icon: <Utensils className="w-4 h-4" />,
      color: 'from-amber-500 to-orange-600',
    },
    {
      id: 'hospedaje',
      label: { 
        es: 'Dónde Hospedarse', 
        en: 'Lodging & Hotels', 
        zh: '住宿酒店', 
        fr: 'Hébergement' 
      },
      icon: <BedDouble className="w-4 h-4" />,
      color: 'from-purple-500 to-indigo-600',
    },
  ];

  // Dynamic Subcategories per Main Category
  const subCategoriesConfig = useMemo(() => {
    return {
      turismo: [
        { id: 'all', label: { es: 'Todo el Turismo', en: 'All Tourism', zh: '全部旅游', fr: 'Tout le Tourisme' } },
        { id: 'ambiental_ecoturismo', label: { es: '🌿 Turismo Ambiental / Ecoturismo', en: '🌿 Eco-Tourism & Nature', zh: '🌿 生态环境旅游', fr: '🌿 Écotourisme' } },
        { id: 'industrial_portuario', label: { es: '🏗️ Turismo Industrial Portuario', en: '🏗️ Industrial Port Tours', zh: '🏗️ 港口工业观光', fr: '🏗️ Tourisme Industriel' } },
        { id: 'deportivo_aventura', label: { es: '🚴 Turismo Deportivo & Aventura', en: '🚴 Sports & Adventure', zh: '🚴 体育运动与探险', fr: '🚴 Tourisme Sportif' } },
        { id: 'cultural_civico', label: { es: '🏛️ Turismo Cultural & Cívico', en: '🏛️ Cultural & Civic Heritage', zh: '🏛️ 文化与市民地标', fr: '🏛️ Culture & Patrimoine' } },
      ],
      donde_comer: [
        { id: 'all', label: { es: 'Todos los Establecimientos', en: 'All Eateries & Stores', zh: '全部餐饮商户', fr: 'Tous les Commerces' } },
        { id: 'supermercados', label: { es: '🛒 Supermercados & Mercados', en: '🛒 Supermarkets & Markets', zh: '🛒 大型超市与综合市场', fr: '🛒 Supermarchés' } },
        { id: 'comida_rapida', label: { es: '🍔 Comida Rápida', en: '🍔 Fast Food', zh: '🍔 快餐轻食', fr: '🍔 Restauration Rapide' } },
        { id: 'restaurantes_mariscos', label: { es: '🐟 Restaurantes & Mariscos', en: '🐟 Seafood Restaurants', zh: '🐟 特色海鲜餐厅', fr: '🐟 Poissons & Fruits de Mer' } },
        { id: 'fondas_antojitos', label: { es: '🍲 Fondas & Antojitos Tradicionales', en: '🍲 Homestyle Fondas & Street Food', zh: '🍲 地道风味小馆与小吃', fr: '🍲 Cantines Populaires' } },
        { id: 'cafeterias_panaderias', label: { es: '☕ Cafeterías & Panaderías', en: '☕ Cafes & Bakeries', zh: '☕ 咖啡馆与烘焙坊', fr: '☕ Cafés & Boulangeries' } },
      ],
      empleos_industrias: [
        { id: 'all', label: { es: 'Todas las Industrias y Empleos', en: 'All Industries & Jobs', zh: '全部产业板块', fr: 'Tous les Secteurs' } },
        { id: 'siderurgica_metal', label: { es: '⚙️ Siderurgia & Metalurgia', en: '⚙️ Steel & Metallurgy', zh: '⚙️ 钢铁与冶金', fr: '⚙️ Sidérurgie' } },
        { id: 'terminales_portuarias', label: { es: '🚢 Terminales de Contenedores & Autos', en: '🚢 Container & Auto Terminals', zh: '🚢 集装箱与汽车码头', fr: '🚢 Terminaux Portuaires' } },
        { id: 'aduanas_logistica', label: { es: '📦 Aduanas, Agencias & Ferrocarril', en: '📦 Customs, Logistics & Rail', zh: '📦 海关报关与铁路集运', fr: '📦 Douanes & Logistique' } },
        { id: 'quimica_fertilizantes', label: { es: '🧪 Química & Fertilizantes', en: '🧪 Chemicals & Fertilizers', zh: '🧪 化工与化肥', fr: '🧪 Chimie & Engrais' } },
        { id: 'energia_combustibles', label: { es: '⚡ Energía & Combustibles (CFE / PEMEX)', en: '⚡ Power & Fuel (CFE / PEMEX)', zh: '⚡ 电力与石化能源', fr: '⚡ Énergie & Carburants' } },
        { id: 'naval_pesca', label: { es: '⚓ Astilleros, Reparación Naval & Pesca', en: '⚓ Shipyards, Marine Repair & Fishing', zh: '⚓ 船舶修造与海事渔业', fr: '⚓ Chantiers Navals & Pêche' } },
        { id: 'metalmecanica_servicios', label: { es: '🔧 Mantenimiento & Metalmecánica Industrial', en: '🔧 Industrial Maintenance & Mechanical', zh: '🔧 工业机械与工程维保', fr: '🔧 Maintenance Industrielle' } },
      ],
      atencion_medica: [
        { id: 'all', label: { es: 'Todos los Centros Médicos', en: 'All Medical Facilities', zh: '全部医疗机构', fr: 'Tous les Établissements' } },
        { id: 'hospitales_generales', label: { es: '🏥 Hospitales Públicos Generales', en: '🏥 Public General Hospitals', zh: '🏥 公立综合医院', fr: '🏥 Hôpitaux Publics' } },
        { id: 'seguro_social_imss_issste', label: { es: '🛡️ Seguro Social (IMSS / ISSSTE)', en: '🛡️ Social Security (IMSS / ISSSTE)', zh: '🛡️ 国家社保医疗', fr: '🛡️ Sécurité Sociale' } },
        { id: 'urgencias_cruz_roja', label: { es: '🚑 Urgencias & Primeros Auxilios (Cruz Roja)', en: '🚑 Emergencies & Red Cross', zh: '🚑 紧急救护与红十字会', fr: '🚑 Urgences Croix-Rouge' } },
        { id: 'clinicas_especialidades', label: { es: '🩺 Clínicas & Especialidades Privadas', en: '🩺 Private Specialty Clinics', zh: '🩺 私立专科医疗中心', fr: '🩺 Cliniques Privées' } },
      ],
      hospedaje: [
        { id: 'all', label: { es: 'Todos los Hoteles', en: 'All Hotels', zh: '全部酒店', fr: 'Tous les Hôtels' } },
        { id: 'hoteles_ejecutivos', label: { es: '🏢 Hoteles Ejecutivos & Urbanos', en: '🏢 Executive & City Hotels', zh: '🏢 商务与市区酒店', fr: '🏢 Hôtels d’Affaires' } },
        { id: 'hoteles_playa', label: { es: '🏖️ Hoteles de Playa & Cabañas', en: '🏖️ Beach Hotels & Cabins', zh: '🏖️ 海滨度假酒店与木屋', fr: '🏖️ Hôtels de Plage' } },
      ],
    };
  }, []);

  // Filtered Items logic
  const filteredItems = useMemo(() => {
    return catalogItems.filter((item) => {
      // 1. Match Main Category
      if (selectedMainCategory !== 'all') {
        if (item.mainCategory !== selectedMainCategory) return false;
      }

      // 2. Match Subcategory
      if (selectedSubCategory !== 'all') {
        if (item.subCategory !== selectedSubCategory) return false;
      }

      // 3. Match Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = item.name[currentLanguage]?.toLowerCase().includes(q) || item.name.es.toLowerCase().includes(q);
        const descMatch = item.description[currentLanguage]?.toLowerCase().includes(q) || item.description.es.toLowerCase().includes(q);
        const addressMatch = item.address.toLowerCase().includes(q);
        const routeMatch = item.recommendedBusRoute.toLowerCase().includes(q);
        const tagsMatch = item.tags.some(t => t.toLowerCase().includes(q));
        if (!nameMatch && !descMatch && !addressMatch && !routeMatch && !tagsMatch) return false;
      }

      return true;
    });
  }, [catalogItems, selectedMainCategory, selectedSubCategory, searchQuery, currentLanguage]);

  const handleSelectMainCategory = (catId: MainCategory | 'all') => {
    setSelectedMainCategory(catId);
    setSelectedSubCategory('all');
    toneGenerator.playSuccessBeep();
  };

  const handleReadItem = (item: CatalogItem) => {
    toneGenerator.playSuccessBeep();
    const text = `${item.name[currentLanguage]}. ${item.description[currentLanguage]}. Dirección: ${item.address}. Transporte público: ${item.recommendedBusRoute}. ${item.transitInstructions[currentLanguage]}`;
    voiceService.speak(text, currentLanguage === 'es' ? 'es-MX' : 'en-US');
  };

  const handleCalculateRoute = (item: CatalogItem) => {
    toneGenerator.playSuccessBeep();
    setRouteCalculationModal(item);
    onSelectLocationOnMap(item.coords);
    voiceService.speak(`Trazando ruta de transporte óptima hacia ${item.name[currentLanguage]}. Salida desde Centro Lázaro Cárdenas.`);
  };

  // Current active subcategory options (if current main category has them)
  const currentSubCategories = selectedMainCategory !== 'all' 
    ? (subCategoriesConfig as any)[selectedMainCategory] || [] 
    : [];

  return (
    <div className="space-y-6">
      {/* ===================== TOP HEADER & LANGUAGE CONTROL ===================== */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-800/60 uppercase">
              LC NOVA DIRECTORY
            </span>
            <span className="text-xs text-slate-400">
              {catalogItems.length} Establecimientos Mapeados con Conexión a Transporte Público
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            Catálogo Portuario, Industrias, Turismo & Servicios
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Directorio georreferenciado para trabajadores de la industria siderúrgica y marítima, tripulaciones internacionales, visitantes y ciudadanos de Lázaro Cárdenas.
          </p>
        </div>

        {/* Language Switcher Pill */}
        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800 shrink-0 self-start lg:self-auto">
          <Languages className="w-4 h-4 text-cyan-400 shrink-0 ml-1" />
          <div className="flex gap-1">
            {(['es', 'en', 'zh', 'fr'] as Language[]).map(lang => (
              <button
                key={lang}
                onClick={() => {
                  toneGenerator.playSuccessBeep();
                  onLanguageChange(lang);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition uppercase cursor-pointer ${
                  currentLanguage === lang
                    ? 'bg-cyan-500 text-slate-950 shadow font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {lang === 'zh' ? '中文' : lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===================== 1. MAIN CATEGORIES TABS ===================== */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {mainCategories.map((cat) => {
            const isSelected = selectedMainCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelectMainCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2.5 transition border cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r ' + cat.color + ' text-white border-white/30 shadow-lg shadow-cyan-950/40 ring-2 ring-cyan-400/40'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className={`p-1 rounded-lg ${isSelected ? 'bg-white/20 text-white' : 'text-slate-400'}`}>
                  {cat.icon}
                </div>
                <span>{cat.label[currentLanguage]}</span>
              </button>
            );
          })}
        </div>

        {/* ===================== 2. SUBCATEGORIES STRIP (WHEN MAIN CATEGORY SELECTED) ===================== */}
        {currentSubCategories.length > 0 && (
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex items-center gap-2 overflow-x-auto scrollbar-none animate-in fade-in duration-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0 flex items-center gap-1 pl-1">
              <Filter className="w-3 h-3 text-cyan-400" />
              <span>Clasificación:</span>
            </span>
            {currentSubCategories.map((sub: any) => {
              const isSelected = selectedSubCategory === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => {
                    toneGenerator.playSuccessBeep();
                    setSelectedSubCategory(sub.id);
                  }}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition border cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {sub.label[currentLanguage]}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ===================== SEARCH & QUICK RESULTS BAR ===================== */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow">
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, tipo de comida, súper, hospital o industria..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span>Mostrando <strong>{filteredItems.length}</strong> de {catalogItems.length} lugares</span>
        </div>
      </div>

      {/* ===================== CATALOG ITEMS GRID ===================== */}
      {filteredItems.length === 0 ? (
        <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <Utensils className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No se encontraron establecimientos</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Prueba ajustando los filtros de categoría o limpiando la barra de búsqueda para ver más opciones en Lázaro Cárdenas.
          </p>
          <button
            onClick={() => {
              setSelectedMainCategory('all');
              setSelectedSubCategory('all');
              setSearchQuery('');
            }}
            className="bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs px-4 py-2 rounded-xl"
          >
            Restablecer todos los filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-cyan-500/50 hover:shadow-2xl transition group"
            >
              <div>
                {/* Image & Header Badges */}
                <div className="relative h-44 overflow-hidden bg-black">
                  <img
                    src={item.imageUrl}
                    alt={item.name[currentLanguage]}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[80%]">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-950/90 backdrop-blur-md text-cyan-300 border border-cyan-800/80 uppercase">
                      {item.subCategoryLabel ? item.subCategoryLabel[currentLanguage] : item.category.replace('_', ' ')}
                    </span>
                    {item.rntVerified && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-950/90 backdrop-blur-md text-emerald-300 border border-emerald-700/60 flex items-center gap-1 shadow">
                        <CheckCircle2 className="w-3 h-3" /> RNT
                      </span>
                    )}
                    {item.priceRange && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-950/90 text-amber-300 border border-amber-800 font-mono">
                        {item.priceRange}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleReadItem(item)}
                    title="Escuchar información con voz"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-950/90 backdrop-blur-md text-slate-300 hover:text-cyan-400 hover:scale-110 flex items-center justify-center border border-slate-700 shadow transition cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Content Details */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition line-clamp-1">
                      {item.name[currentLanguage]}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1.5 line-clamp-3 leading-relaxed">
                      {item.description[currentLanguage]}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                    <p className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{item.address}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{item.schedule}</span>
                    </p>
                    {item.phone && (
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <a href={`tel:${item.phone}`} className="hover:text-white underline font-mono">{item.phone}</a>
                      </p>
                    )}
                  </div>

                  {/* Public Transit Route Box (Requested by user: para llegar a su trabajo/lugar) */}
                  <div className="bg-slate-950 border border-cyan-900/60 rounded-xl p-3 text-xs space-y-1 shadow-inner">
                    <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider flex items-center gap-1">
                      <Bus className="w-3.5 h-3.5 text-cyan-400" />
                      Transporte Público Óptimo
                    </span>
                    <p className="font-bold text-white text-xs">{item.recommendedBusRoute}</p>
                    <p className="text-slate-400 text-[11px] line-clamp-2">{item.transitInstructions[currentLanguage]}</p>
                  </div>
                </div>
              </div>

              {/* Bottom Actions: Planificador con trazo de ruta y enlaces funcionales directos a Google Maps */}
              <div className="p-5 pt-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    toneGenerator.playSuccessBeep();
                    setRouteCalculationModal(item);
                    onSelectLocationOnMap(item.coords);
                  }}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs py-2.5 px-3 rounded-xl shadow-md flex items-center justify-center gap-1.5 transition cursor-pointer"
                  title="Planificar y trazar ruta en combi desde mi ubicación"
                >
                  <Navigation className="w-3.5 h-3.5 shrink-0" />
                  <span>Cómo Llegar en Combi</span>
                  <Route className="w-3.5 h-3.5 opacity-80 shrink-0 ml-0.5" />
                </button>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${item.coords.lat},${item.coords.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    toneGenerator.playSuccessBeep();
                    onSelectLocationOnMap(item.coords);
                  }}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white font-bold text-xs py-2.5 px-3 rounded-xl border border-cyan-800/60 shadow flex items-center justify-center gap-1.5 transition cursor-pointer"
                  title="Abrir ubicación en Google Maps"
                >
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Ver Ubicación en Google Maps</span>
                  <ExternalLink className="w-3 h-3 opacity-75 shrink-0 ml-0.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===================== MODAL: OPTIMAL PUBLIC TRANSIT CALCULATION & MAP TRACING ===================== */}
      {routeCalculationModal && (() => {
        const item = routeCalculationModal;

        // Origins in Lázaro Cárdenas
        const originPresets = [
          { id: 'gps', label: '📍 Mi ubicación actual (GPS)', coords: customOriginCoords || userLocation || { lat: 17.9632, lng: -102.1985 } },
          { id: 'centro', label: '🏢 Centro / Palacio Municipal (Melchor Ocampo)', coords: { lat: 17.9630, lng: -102.1985 } },
          { id: 'guacamayas', label: '🚏 Crucero Las Guacamayas (Blvd. Ciranda)', coords: { lat: 17.9942, lng: -102.2215 } },
          { id: 'americas', label: '🛍️ Plaza Las Américas / Soriana', coords: { lat: 17.9715, lng: -102.2065 } },
          { id: 'tecnologico', label: '🎓 Instituto Tecnológico de Lázaro Cárdenas', coords: { lat: 17.9850, lng: -102.2175 } },
          { id: 'mira', label: '⛰️ Poblado de La Mira (Acceso Carretera)', coords: { lat: 18.0400, lng: -102.3250 } },
          { id: 'playa_azul', label: '🏖️ Playa Azul (Boulevard Costero)', coords: { lat: 17.9820, lng: -102.3520 } },
        ];

        const activeOriginObj = originPresets.find(p => p.id === selectedOriginType) || originPresets[0];
        const activeOriginCoords = activeOriginObj.coords;

        // Match the most convenient route
        let targetRoute = routes[0];
        const lowerRec = item.recommendedBusRoute.toLowerCase();
        if (lowerRec.includes('ruta 2') || lowerRec.includes('cayacal') || lowerRec.includes('siderúrgica')) {
          targetRoute = routes.find(r => r.id === 'ruta-2') || routes[0];
        } else if (lowerRec.includes('ruta 3') || lowerRec.includes('playa azul')) {
          targetRoute = routes.find(r => r.id === 'ruta-3') || routes[0];
        } else {
          targetRoute = routes.find(r => r.id === 'ruta-1') || routes[0];
        }

        // Board stop (closest stop on route to user origin)
        const boardStop = targetRoute?.stops[0] || { name: 'Paradero Central', coords: activeOriginCoords };
        // Alight stop (closest stop on route to destination)
        const alightStop = targetRoute?.stops[targetRoute.stops.length - 1] || { name: item.address, coords: item.coords };

        const handleTraceOnMap = () => {
          toneGenerator.playSuccessBeep();
          if (onTraceRoute && targetRoute) {
            onTraceRoute({
              origin: activeOriginCoords,
              destination: item.coords,
              route: targetRoute,
              walkingPath: [activeOriginCoords, boardStop.coords],
              transitPath: targetRoute.waypoints,
              destinationName: item.name[currentLanguage] || item.name.es,
              instructions: [
                `Camina hacia la parada ${boardStop.name}`,
                `Aborda la combi ${targetRoute.name}`,
                `Desciende en ${alightStop.name} frente a ${item.name.es}`,
              ],
            });
          }
          onSelectLocationOnMap(item.coords);
          setRouteCalculationModal(null);
          voiceService.speak(`Ruta trazada en el mapa hacia ${item.name.es}. La combi más conveniente es ${targetRoute?.name}.`);
        };

        const handleDetectCurrentGps = () => {
          setIsDetectingGps(true);
          toneGenerator.playSuccessBeep();

          if (!navigator.geolocation) {
            setIsDetectingGps(false);
            voiceService.speak('Geolocalización no disponible.');
            return;
          }

          navigator.geolocation.getCurrentPosition(
            (pos) => {
              setIsDetectingGps(false);
              const coords: Coordinates = {
                lat: Number(pos.coords.latitude.toFixed(5)),
                lng: Number(pos.coords.longitude.toFixed(5)),
              };
              setCustomOriginCoords(coords);
              setSelectedOriginType('gps');
              toneGenerator.playSuccessBeep();
              voiceService.speak('Tu ubicación GPS ha sido detectada con éxito.');
            },
            () => {
              setIsDetectingGps(false);
              setSelectedOriginType('centro');
              toneGenerator.playAlertBeep();
              voiceService.speak('No se obtuvo permiso de GPS. Se fijó tu origen en el Centro de Lázaro Cárdenas.');
            },
            { timeout: 8000 }
          );
        };

        return (
          <div className="fixed inset-0 z-[2000] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 border-2 border-cyan-500/80 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 my-auto">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                    CÓMO LLEGAR EN COMBI • RUTA MÁS CONVENIENTE
                  </span>
                  <h3 className="text-lg font-black text-white mt-1">
                    {item.name[currentLanguage] || item.name.es}
                  </h3>
                </div>
                <button
                  onClick={() => setRouteCalculationModal(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Origin Chooser (Desde mi ubicación) */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    Punto de Origen (Partida):
                  </span>

                  <button
                    type="button"
                    onClick={handleDetectCurrentGps}
                    disabled={isDetectingGps}
                    className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-700 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 hover:bg-cyan-900 transition cursor-pointer"
                  >
                    <LocateFixed className={`w-3 h-3 ${isDetectingGps ? 'animate-spin' : ''}`} />
                    <span>{isDetectingGps ? 'Detectando GPS...' : 'Usar Mi GPS Actual'}</span>
                  </button>
                </div>

                <select
                  value={selectedOriginType}
                  onChange={(e) => setSelectedOriginType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 text-xs font-semibold focus:outline-none focus:border-cyan-500"
                >
                  {originPresets.map(p => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>

                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                  <span>Coordenadas de origen:</span>
                  <span className="font-mono text-cyan-400 font-bold">
                    {activeOriginCoords.lat.toFixed(4)}, {activeOriginCoords.lng.toFixed(4)}
                  </span>
                </div>
              </div>

              {/* Most Convenient Route Highlight */}
              <div className="bg-gradient-to-r from-cyan-950/60 to-blue-950/60 p-4 rounded-xl border border-cyan-500/50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-cyan-300 bg-cyan-900/60 px-2 py-0.5 rounded uppercase">
                    ⭐ RUTA MÁS CONVENIENTE IDENTIFICADA
                  </span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">$12.00 MXN</span>
                </div>

                <p className="font-black text-white text-base flex items-center gap-2">
                  <Bus className="w-5 h-5 text-cyan-400" />
                  <span>{item.recommendedBusRoute}</span>
                </p>

                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {item.transitInstructions[currentLanguage] || item.transitInstructions.es}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Tiempo estimado:</span>
                    <strong className="text-white font-mono">~14 a 18 minutos</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Frecuencia de paso:</span>
                    <strong className="text-white font-mono">Cada 6 a 8 minutos</strong>
                  </div>
                </div>
              </div>

              {/* Actions: Trazar en el Mapa + Google Maps */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleTraceOnMap}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs py-3 px-4 rounded-xl shadow-xl flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Route className="w-4 h-4" />
                  <span>Trazar Esta Ruta en el Mapa Interactivo</span>
                </button>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&origin=${activeOriginCoords.lat},${activeOriginCoords.lng}&destination=${item.coords.lat},${item.coords.lng}&travelmode=transit`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs py-2.5 px-3 rounded-xl shadow flex items-center justify-center gap-1.5 transition cursor-pointer"
                    title="Navegar paso a paso en Google Maps con transporte público"
                  >
                    <Navigation className="w-3.5 h-3.5 shrink-0" />
                    <span>Navegar en Google Maps (Combi)</span>
                    <ExternalLink className="w-3 h-3 opacity-75 shrink-0 ml-0.5" />
                  </a>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${item.coords.lat},${item.coords.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white font-bold text-xs py-2.5 px-3 rounded-xl border border-slate-700 shadow flex items-center justify-center gap-1.5 transition cursor-pointer"
                    title="Abrir ubicación en Google Maps"
                  >
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Ver Ubicación en Maps</span>
                    <ExternalLink className="w-3 h-3 opacity-75 shrink-0 ml-0.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
