import { Language } from '../types';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'es', name: 'Español', nativeName: 'Español', flag: '🇲🇽' },
  { code: 'en', name: 'Inglés', nativeName: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Francés', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'zh', name: 'Chino Mandarín', nativeName: '中文 (普通话)', flag: '🇨🇳' },
];

export const TOURIST_I18N = {
  // Tourist Header & Sub-Tabs
  langSelectorTitle: {
    es: 'Idioma del Panel Turista:',
    en: 'Tourist Panel Language:',
    fr: 'Langue du Panneau Touriste :',
    zh: '游客指南语言选择：',
  },
  subtab_mobility: {
    es: '1. Combis, Movilidad & Rutas',
    en: '1. Combis, Mobility & Routes',
    fr: '1. Combis, Mobilité & Trajets',
    zh: '1. 公交、出行与路线',
  },
  subtab_tourism: {
    es: '2. Catálogo Industrias & Turismo',
    en: '2. Industries & Tourism Catalog',
    fr: '2. Catalogue Industries & Tourisme',
    zh: '2. 港口工业与旅游地标',
  },
  subtab_safety: {
    es: '3. Semáforo & Puntos Seguros',
    en: '3. Safety Quadrants & Safe Points',
    fr: '3. Sécurité & Points Sécurisés',
    zh: '3. 安全指示与平安驿站',
  },
  return_to_start: {
    es: 'Elegir otro panel',
    en: 'Switch panel',
    fr: 'Changer de panneau',
    zh: '切换面板',
  },
  breadcrumb_back: {
    es: '← Volver al Inicio / Cambiar de Panel',
    en: '← Return to Home / Switch Panel',
    fr: "← Retour à l'accueil / Changer de panneau",
    zh: '← 返回首页 / 切换面板',
  },
  breadcrumb_active: {
    es: 'Panel activo: 1. Turista',
    en: 'Active panel: 1. Tourist',
    fr: 'Panneau actif : 1. Touriste',
    zh: '当前面板：1. 游客指南',
  },

  // Satellite Map Section
  map_satellite_title: {
    es: 'Vista Satelital en Tiempo Real (Movilidad, Turismo y Seguridad)',
    en: 'Real-Time Satellite View (Mobility, Tourism & Safety)',
    fr: 'Vue Satellite en Temps Réel (Mobilité, Tourisme & Sécurité)',
    zh: '实时卫星地图监控（公交出行、旅游与安全）',
  },
  map_satellite_desc: {
    es: 'Monitoreo GPS de combis, Puntos Naranja C5i y catálogo turístico',
    en: 'Live GPS combi tracking, C5i Orange Safe Points & tourist catalog',
    fr: 'Suivi GPS des combis en direct, Points Orange C5i et catalogue touristique',
    zh: '公交车实时GPS追踪、C5i平安驿站及旅游工业地标',
  },
  map_layer_routes: {
    es: 'Rutas',
    en: 'Routes',
    fr: 'Lignes',
    zh: '公交路线',
  },
  map_layer_buses: {
    es: 'Combis GPS',
    en: 'GPS Combis',
    fr: 'Combis GPS',
    zh: '公交车 GPS',
  },
  map_layer_safety: {
    es: 'Semáforo',
    en: 'Safety Lights',
    fr: 'Feu Sécurité',
    zh: '治安信号灯',
  },
  map_layer_safepoints: {
    es: 'Puntos Naranja',
    en: 'Orange Safe Points',
    fr: 'Points Orange',
    zh: '平安驿站',
  },
  map_expand: {
    es: '▼ Expandir',
    en: '▼ Expand Map',
    fr: '▼ Agrandir',
    zh: '▼ 展开地图',
  },
  map_collapse: {
    es: '▲ Vista Pequeña',
    en: '▲ Compact View',
    fr: '▲ Vue Compacte',
    zh: '▲ 收起地图',
  },

  // Tourist Language Selector Banner
  lang_banner_title: {
    es: 'Idioma del Panel Turista',
    en: 'Tourist Panel Language',
    fr: 'Langue du Panneau Touriste',
    zh: '游客指南语言选择',
  },
  lang_banner_desc: {
    es: 'Traduce de forma completa rutas de combis, planificador de viajes, mapa satelital, catálogo de turismo y zonas de seguridad.',
    en: 'Completely translate combi routes, trip planner, satellite map, tourism catalog and safety zones.',
    fr: 'Traduisez intégralement les lignes de combis, le planificateur, la carte satellite, le répertoire touristique et la sécurité.',
    zh: '全面翻译公交路线、出行规划、卫星地图、旅游产业目录以及安全防护区域。',
  },
  lang_active_badge: {
    es: 'IDIOMA ACTIVO',
    en: 'ACTIVE LANGUAGE',
    fr: 'LANGUE ACTIVE',
    zh: '当前语言',
  },
  step_alight: {
    es: 'Descenso y Llegada',
    en: 'Alight and Arrival',
    fr: 'Descente et Arrivée',
    zh: '下车与到达',
  },

  // Trip Planner (RouteSearchEngine)
  planner_title: {
    es: 'Planificador de Viaje en Combi (Lázaro Cárdenas)',
    en: 'Combi Transit Trip Planner (Lázaro Cárdenas)',
    fr: 'Planificateur de Trajet en Combi (Lázaro Cárdenas)',
    zh: '公交出行路线规划助手（拉萨罗卡德纳斯）',
  },
  planner_badge: {
    es: 'GPS INTELIGENTE',
    en: 'SMART GPS',
    fr: 'GPS INTELLIGENT',
    zh: '智能GPS导航',
  },
  planner_desc: {
    es: 'Calcula qué combi tomar desde tu ubicación GPS y la parada exacta para subir y bajar.',
    en: 'Calculate which combi to take from your GPS location and the exact stops to board and alight.',
    fr: 'Calculez quel combi emprunter depuis votre position GPS et les arrêts exacts pour monter et descendre.',
    zh: '根据您的GPS位置，精准计算推荐搭乘的公交车及最近的上下车站。',
  },
  origin_label: {
    es: 'Tu Origen Actual:',
    en: 'Your Current Origin:',
    fr: 'Votre Départ Actuel :',
    zh: '当前出发点：',
  },
  gps_active: {
    es: 'GPS Detectado',
    en: 'GPS Detected',
    fr: 'GPS Détecté',
    zh: '已定位GPS',
  },
  btn_use_gps: {
    es: 'Usar Mi GPS',
    en: 'Use My GPS',
    fr: 'Mon GPS',
    zh: '使用我的GPS',
  },
  btn_updating_gps: {
    es: 'Obteniendo GPS...',
    en: 'Getting GPS...',
    fr: 'Recherche GPS...',
    zh: '正在获取GPS...',
  },
  destination_label: {
    es: '¿A dónde deseas ir en Lázaro Cárdenas?',
    en: 'Where do you want to go in Lázaro Cárdenas?',
    fr: 'Où souhaitez-vous aller à Lázaro Cárdenas ?',
    zh: '您想前往拉萨罗卡德纳斯的哪里？',
  },
  search_placeholder: {
    es: 'Escribe tu destino (ej. Arcelor, Aduana, Soriana, Playa Azul, IMSS, Mercado)...',
    en: 'Type your destination (e.g., Arcelor, Customs, Soriana, Playa Azul, Hospital, Market)...',
    fr: 'Tapez votre destination (ex. Arcelor, Douane, Soriana, Playa Azul, Marché)...',
    zh: '输入目的地（例如：阿塞洛米塔尔、海关、超市、蓝海滩、医院、市场）...',
  },
  btn_calculate: {
    es: 'Calcular Ruta Más Rápida',
    en: 'Calculate Fastest Route',
    fr: "Calculer l'Itinéraire le Plus Rapide",
    zh: '计算最快捷路线',
  },
  popular_destinations: {
    es: 'Destinos Populares Rápidos (Toca para calcular):',
    en: 'Popular Quick Destinations (Tap to calculate):',
    fr: 'Destinations Populaires Rapides (Touchez pour calculer) :',
    zh: '热门快捷目的地（点击即刻规划）：',
  },
  calc_result_title: {
    es: '¡Ruta Recomendada Calculada!',
    en: 'Recommended Route Calculated!',
    fr: 'Itinéraire Recommandé Calculé !',
    zh: '已为您计算出推荐路线！',
  },
  calc_result_subtitle: {
    es: 'La opción de combi más rápida y directa desde tu ubicación.',
    en: 'The fastest and most direct combi option from your location.',
    fr: 'Le trajet en combi le plus rapide et direct depuis votre position.',
    zh: '从您当前位置出发最快、最直达的公交方案。',
  },
  stat_travel_time: {
    es: 'Tiempo de Viaje',
    en: 'Travel Time',
    fr: 'Temps de Trajet',
    zh: '预估行程时间',
  },
  stat_fare: {
    es: 'Tarifa Oficial',
    en: 'Official Fare',
    fr: 'Tarif Officiel',
    zh: '官方标准票价',
  },
  stat_walk: {
    es: 'Caminata a Parada',
    en: 'Walk to Stop',
    fr: 'Marche vers Arrêt',
    zh: '步行至站点',
  },
  stat_unit: {
    es: 'Unidad Más Próxima',
    en: 'Nearest Combi',
    fr: 'Combi le Plus Proche',
    zh: '最近车辆',
  },
  step_by_step: {
    es: 'Pasos a seguir para tu viaje:',
    en: 'Step-by-step travel instructions:',
    fr: 'Étapes à suivre pour votre trajet :',
    zh: '乘车指引步骤：',
  },
  btn_view_on_satellite_map: {
    es: 'Ver Trazo en Mapa Satelital',
    en: 'View Route on Satellite Map',
    fr: "Voir l'Itinéraire sur la Carte Satellite",
    zh: '在卫星地图上查看路线轨迹',
  },

  // Mobility Module
  mobility_title: {
    es: 'Movilidad Urbana & Combis en Tiempo Real',
    en: 'Urban Mobility & Live Combis in Real Time',
    fr: 'Mobilité Urbaine & Combis en Temps Réel',
    zh: '城市出行与实时公交路线',
  },
  mobility_subtitle: {
    es: 'Rutas troncales Centro - Guacamayas, Siderúrgica / ASIPONA y Playa Azul • Tarifa oficial: $12.00 MXN',
    en: 'Trunk routes Centro - Guacamayas, Steel Plant / ASIPONA and Playa Azul • Official Fare: $12.00 MXN',
    fr: 'Lignes principales Centre - Guacamayas, Sidérurgie / ASIPONA et Playa Azul • Tarif officiel : 12.00 MXN',
    zh: '主干路线：市中心 - 瓜卡马亚斯、港区工业基地及蓝海滩 • 统一票价：12.00 墨西哥比索',
  },
  active_units_count: {
    es: 'unidades activas',
    en: 'active units',
    fr: 'unités actives',
    zh: '辆车辆在途',
  },
  how_to_get_there: {
    es: '¿Cómo llegar en combi desde mi ubicación?',
    en: 'How to get there by combi from my location?',
    fr: 'Comment se déplacer en combi depuis ma position ?',
    zh: '如何从我所在位置搭乘公交前往？',
  },
  most_convenient_tag: {
    es: 'Ruta Más Conveniente',
    en: 'Most Convenient Route',
    fr: 'Itinéraire Recommandé',
    zh: '最便捷推荐路线',
  },
  how_to_desc: {
    es: 'Traza la combi óptima hacia cualquier colonia o centro de trabajo en Lázaro Cárdenas',
    en: 'Trace the optimal combi to any neighborhood or employment center in Lázaro Cárdenas',
    fr: 'Trouvez le combi optimal vers chaque quartier ou lieu de travail à Lázaro Cárdenas',
    zh: '快速规划前往拉萨罗卡德纳斯各社区、商圈或工业园区的最佳公交',
  },
  refresh_my_gps: {
    es: 'Actualizar Mi GPS',
    en: 'Refresh My GPS',
    fr: 'Actualiser mon GPS',
    zh: '刷新我的GPS位置',
  },
  trace_combi_route: {
    es: 'Trazar Ruta en Combi',
    en: 'Trace Combi Route',
    fr: "Tracer l'Itinéraire en Combi",
    zh: '规划公交路线',
  },
  routes_and_buses_header: {
    es: 'Rutas de Combis y Camiones en Lázaro Cárdenas',
    en: 'Combi & Bus Routes in Lázaro Cárdenas',
    fr: 'Lignes de Combis et Bus à Lázaro Cárdenas',
    zh: '拉萨罗卡德纳斯公交线路网络',
  },
  hide_breakdown: {
    es: 'Ocultar desglose',
    en: 'Hide details',
    fr: 'Masquer les détails',
    zh: '收起详情',
  },
  show_breakdown: {
    es: 'Ver desglose',
    en: 'Show details',
    fr: 'Afficher les détails',
    zh: '查看详情',
  },
  every_minutes: {
    es: 'Cada',
    en: 'Every',
    fr: 'Toutes les',
    zh: '每',
  },
  combis_active_label: {
    es: 'combis activas',
    en: 'active combis',
    fr: 'combis en service',
    zh: '辆活跃车辆',
  },
  live_monitoring_title: {
    es: 'Monitoreo de Combis en Tiempo Real y ETA',
    en: 'Live Combi Tracking & Arrival Times (ETA)',
    fr: "Suivi des Combis en Temps Réel & Heure d'Arrivée (ETA)",
    zh: '公交实时位置监控与预计到达时间 (ETA)',
  },
  live_monitoring_desc: {
    es: 'Ubicación vía telemetría GPS directa sobre el mapa satelital.',
    en: 'Live location via direct GPS telemetry on the satellite map.',
    fr: 'Localisation par télémétrie GPS directe sur la carte satellite.',
    zh: '通过直接GPS遥测在卫星地图上实时定位。',
  },
  combis_in_circulation: {
    es: 'combis en circulación',
    en: 'combis in transit',
    fr: 'combis en circulation',
    zh: '辆公交车在途',
  },
  driver_label: {
    es: 'Operador:',
    en: 'Driver:',
    fr: 'Chauffeur :',
    zh: '驾驶员：',
  },
  next_stop_label: {
    es: 'Próxima Parada:',
    en: 'Next Stop:',
    fr: 'Prochain Arrêt :',
    zh: '下一站：',
  },
  arrival_time_label: {
    es: 'Tiempo de Llegada (ETA):',
    en: 'Arrival Time (ETA):',
    fr: "Temps d'Arrivée (ETA) :",
    zh: '到达时间 (ETA)：',
  },
  locate_combi_btn: {
    es: 'Ubicar Combi en Mapa',
    en: 'Locate Combi on Map',
    fr: 'Localiser sur la Carte',
    zh: '在地图上标示此车辆',
  },
  occupied_label: {
    es: 'Ocupado',
    en: 'Occupied',
    fr: 'Occupé',
    zh: '载客率',
  },
  tag_reinforcement: {
    es: 'REFUERZO',
    en: 'REINFORCEMENT',
    fr: 'RENFORT',
    zh: '支援车辆',
  },
  tag_breakdown: {
    es: 'FALLA MECÁNICA',
    en: 'MECHANICAL FAULT',
    fr: 'PANNE MÉCANIQUE',
    zh: '机械故障',
  },

  // Safety Module
  sos_question: {
    es: '¿Te sientes en peligro o necesitas refugio inmediato?',
    en: 'Do you feel in danger or need immediate shelter?',
    fr: "Vous sentez-vous en danger ou avez-vous besoin d'un abri immédiat ?",
    zh: '您是否感到身处险境或需要紧急庇护？',
  },
  sos_network_label: {
    es: 'Red Municipal de Puntos Naranja & Auxilio C5i',
    en: 'Municipal Orange Safe Points & C5i Emergency Network',
    fr: 'Réseau Municipal de Points Orange & Secours C5i',
    zh: '拉萨罗卡德纳斯市平安驿站网络与C5i应急指挥中心',
  },
  sos_explanation: {
    es: 'Presiona el botón SOS para localizar el Punto Naranja más cercano con resguardo y enlace directo a Seguridad Pública y Cruz Roja.',
    en: 'Press the SOS button to locate the nearest Orange Safe Point with immediate shelter and direct connection to Police and Red Cross.',
    fr: "Appuyez sur le bouton SOS pour localiser le Point Orange le plus proche avec abri immédiat et liaison directe avec la Police et la Croix-Rouge.",
    zh: '按下紧急求助 (SOS) 按钮，系统将立即引导您前往最近的平安驿站，并直联公安与红十字救援力量。',
  },
  sos_button_cta: {
    es: '🚨 ACTIVAR PROTOCOLO SOS',
    en: '🚨 ACTIVATE SOS PROTOCOL',
    fr: '🚨 ACTIVER LE PROTOCOLE SOS',
    zh: '🚨 启动紧急求助协议 (SOS)',
  },
  crime_quadrants_title: {
    es: 'Semáforo Delictivo y Cuadrantes de Seguridad',
    en: 'Crime Traffic Light & Security Quadrants',
    fr: 'Feu Tricolore de Sécurité & Quadrants Municipaux',
    zh: '治安风险红绿灯与城市安全片区',
  },
  crime_quadrants_desc: {
    es: 'Monitoreo oficial de colonias y zonas comerciales coordinado con C5i Michoacán.',
    en: 'Official neighborhood and commercial sector monitoring coordinated with Michoacán C5i.',
    fr: 'Surveillance officielle des quartiers et zones commerciales coordonnée avec le C5i Michoacán.',
    zh: '由米却肯州C5i联合监控的官方社区及商业区安全指引。',
  },
  evaluate_gps_btn: {
    es: 'Evaluar Mi Cuadrante Actual (GPS)',
    en: 'Evaluate My Current Quadrant (GPS)',
    fr: 'Évaluer mon Quadrant Actuel (GPS)',
    zh: '通过GPS评估我当前所在区域',
  },
  safe_points_section_title: {
    es: 'Red de Puntos Naranja Verificados',
    en: 'Verified Orange Safe Points Network',
    fr: 'Réseau de Points Orange Vérifiés',
    zh: '官方认证平安驿站网络',
  },
  safe_points_section_desc: {
    es: 'Comercios, farmacias 24h y edificios públicos capacitados como refugio seguro ante situaciones de acoso o riesgo.',
    en: 'Businesses, 24h pharmacies, and public buildings certified as safe shelters against harassment or emergencies.',
    fr: 'Commerces, pharmacies 24h et bâtiments publics certifiés comme refuges sûrs en cas de harcèlement ou de danger.',
    zh: '全天候药房、签约商户及公共设施，为女性及受困游客提供安全庇护与保护。',
  },
  emergency_phones_title: {
    es: 'Directorio Telefónico de Emergencias 24 Horas',
    en: '24-Hour Emergency Telephone Directory',
    fr: "Répertoire Téléphonique d'Urgence 24h/24",
    zh: '24小时紧急救援电话名录',
  },
  btn_call: {
    es: 'Llamar',
    en: 'Call',
    fr: 'Appeler',
    zh: '拨打',
  },
  btn_directions: {
    es: 'Cómo llegar',
    en: 'Directions',
    fr: 'Itinéraire',
    zh: '路线指引',
  },
} as const;

export function t(key: keyof typeof TOURIST_I18N, lang: Language): string {
  const entry = TOURIST_I18N[key];
  if (!entry) return '';
  return entry[lang] || entry['es'] || '';
}
