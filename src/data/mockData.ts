import { 
  TransitRoute, 
  TransitUnit, 
  CatalogItem, 
  SafetyZone, 
  SafePoint, 
  CitizenReport 
} from '../types';

export const INITIAL_ROUTES: TransitRoute[] = [
  {
    id: 'ruta-1',
    code: 'R1-GUAC',
    name: 'Ruta 1: Centro - Las Guacamayas',
    color: '#06b6d4',
    frequencyMinutes: 8,
    schedule: '05:30 - 22:30',
    destination: 'Base Las Guacamayas Norte',
    stops: [
      { id: 's1', name: 'Terminal Centro (Av. Lázaro Cárdenas)', coords: { lat: 17.9632, lng: -102.1985 }, connections: ['R2', 'R3'] },
      { id: 's2', name: 'Plaza Las Américas / Soriana', coords: { lat: 17.9715, lng: -102.2065 }, connections: ['R3', 'R4'] },
      { id: 's3', name: 'Hospital General Dr. Cecilio Báez', coords: { lat: 17.9785, lng: -102.2120 }, connections: ['R4'] },
      { id: 's4', name: 'Instituto Tecnológico de Lázaro Cárdenas', coords: { lat: 17.9850, lng: -102.2175 }, connections: ['R1'] },
      { id: 's5', name: 'Crucero Las Guacamayas', coords: { lat: 17.9942, lng: -102.2215 }, connections: [] },
      { id: 's6', name: 'Col. Campamento Minero', coords: { lat: 18.0020, lng: -102.2280 }, connections: [] }
    ],
    waypoints: [
      { lat: 17.9632, lng: -102.1985 },
      { lat: 17.9680, lng: -102.2020 },
      { lat: 17.9715, lng: -102.2065 },
      { lat: 17.9785, lng: -102.2120 },
      { lat: 17.9850, lng: -102.2175 },
      { lat: 17.9942, lng: -102.2215 },
      { lat: 18.0020, lng: -102.2280 }
    ]
  },
  {
    id: 'ruta-2',
    code: 'R2-PUERTO',
    name: 'Ruta 2: Malecón - Isla del Cayacal / Puerto ASIPONA',
    color: '#3b82f6',
    frequencyMinutes: 10,
    schedule: '05:00 - 23:30 (Turnos Aduana)',
    destination: 'Puerta 1 Aduana Marítima / ArcelorMittal',
    stops: [
      { id: 's201', name: 'Malecón de la Cultura y la Paz', coords: { lat: 17.9540, lng: -102.1930 }, connections: ['R1'] },
      { id: 's202', name: 'Acceso Puente Isla del Cayacal', coords: { lat: 17.9480, lng: -102.1960 }, connections: [] },
      { id: 's203', name: 'Edificio Corporativo ASIPONA', coords: { lat: 17.9410, lng: -102.1890 }, connections: [] },
      { id: 's204', name: 'Aduana Marítima Terminal 1', coords: { lat: 17.9355, lng: -102.1845 }, connections: [] },
      { id: 's205', name: 'ArcelorMittal Planta Siderúrgica', coords: { lat: 17.9390, lng: -102.2120 }, connections: [] },
      { id: 's206', name: 'Terminal Hutchison Ports LCT', coords: { lat: 17.9290, lng: -102.1790 }, connections: [] }
    ],
    waypoints: [
      { lat: 17.9540, lng: -102.1930 },
      { lat: 17.9510, lng: -102.1945 },
      { lat: 17.9480, lng: -102.1960 },
      { lat: 17.9440, lng: -102.1920 },
      { lat: 17.9410, lng: -102.1890 },
      { lat: 17.9355, lng: -102.1845 },
      { lat: 17.9390, lng: -102.2120 },
      { lat: 17.9290, lng: -102.1790 }
    ]
  },
  {
    id: 'ruta-3',
    code: 'R3-COSTA',
    name: 'Ruta 3: Lázaro Centro - Playa Azul / Santuario',
    color: '#10b981',
    frequencyMinutes: 15,
    schedule: '06:00 - 21:00',
    destination: 'Playa Azul Boulevard Costero',
    stops: [
      { id: 's301', name: 'Centro Mercado Cuauhtémoc', coords: { lat: 17.9620, lng: -102.1995 }, connections: ['R1', 'R2'] },
      { id: 's302', name: 'Salida Autopista Siglo XXI / El Habillal', coords: { lat: 17.9750, lng: -102.2500 }, connections: [] },
      { id: 's303', name: 'Campamento Tortuguero El Habillal', coords: { lat: 17.9800, lng: -102.3000 }, connections: [] },
      { id: 's304', name: 'Centro Playa Azul', coords: { lat: 17.9820, lng: -102.3520 }, connections: [] },
      { id: 's305', name: 'Humedales Barra de Pichi (Ecoturismo)', coords: { lat: 17.9950, lng: -102.3780 }, connections: [] }
    ],
    waypoints: [
      { lat: 17.9620, lng: -102.1995 },
      { lat: 17.9700, lng: -102.2250 },
      { lat: 17.9750, lng: -102.2500 },
      { lat: 17.9800, lng: -102.3000 },
      { lat: 17.9820, lng: -102.3520 },
      { lat: 17.9950, lng: -102.3780 }
    ]
  }
];

export const INITIAL_UNITS: TransitUnit[] = [
  {
    id: 'u-101',
    routeId: 'ruta-1',
    unitNumber: 'LC-402',
    driverName: 'Roberto Mendoza Flores',
    driverPhone: '+52 753 102 3849',
    coords: { lat: 17.9720, lng: -102.2070 },
    speedKmH: 34,
    occupancyPercent: 88,
    status: 'active',
    nextStop: 'Hospital General Dr. Cecilio Báez',
    etaMinutes: 3,
    lastUpdated: 'Hace 12 seg'
  },
  {
    id: 'u-102',
    routeId: 'ruta-1',
    unitNumber: 'LC-418',
    driverName: 'Marcos Solorio Ruiz',
    driverPhone: '+52 753 118 7320',
    coords: { lat: 17.9890, lng: -102.2190 },
    speedKmH: 28,
    occupancyPercent: 95, // High occupancy to demonstrate overload report!
    status: 'active',
    nextStop: 'Crucero Las Guacamayas',
    etaMinutes: 5,
    lastUpdated: 'Hace 8 seg'
  },
  {
    id: 'u-201',
    routeId: 'ruta-2',
    unitNumber: 'PORT-88',
    driverName: 'Alejandro Tapia G.',
    driverPhone: '+52 753 145 9901',
    coords: { lat: 17.9460, lng: -102.1940 },
    speedKmH: 42,
    occupancyPercent: 62,
    status: 'active',
    nextStop: 'Edificio Corporativo ASIPONA',
    etaMinutes: 4,
    lastUpdated: 'Hace 5 seg'
  },
  {
    id: 'u-202',
    routeId: 'ruta-2',
    unitNumber: 'PORT-94',
    driverName: 'César Valencia Villa',
    driverPhone: '+52 753 122 4055',
    coords: { lat: 17.9370, lng: -102.1860 },
    speedKmH: 18,
    occupancyPercent: 40,
    status: 'active',
    nextStop: 'Aduana Marítima Terminal 1',
    etaMinutes: 2,
    lastUpdated: 'Hace 15 seg'
  },
  {
    id: 'u-301',
    routeId: 'ruta-3',
    unitNumber: 'COSTA-12',
    driverName: 'Juan Carlos Benítez',
    driverPhone: '+52 753 109 2314',
    coords: { lat: 17.9810, lng: -102.3200 },
    speedKmH: 55,
    occupancyPercent: 70,
    status: 'active',
    nextStop: 'Centro Playa Azul',
    etaMinutes: 6,
    lastUpdated: 'Hace 20 seg'
  }
];

export const CATALOG_ITEMS: CatalogItem[] = [
  // =========================================================================
  // 1. EMPLEOS E INDUSTRIAS (Para Trabajadores y Sector Productivo)
  // =========================================================================
  {
    id: 'ind-arcelormittal',
    name: {
      es: 'ArcelorMittal México (Complejo Siderúrgico)',
      en: 'ArcelorMittal Mexico (Integrated Steel Mill)',
      zh: '安赛乐米塔尔墨西哥钢铁基地',
      fr: 'ArcelorMittal Mexique Complexe Sidérurgique'
    },
    category: 'worker_industry',
    mainCategory: 'empleos_industrias',
    subCategory: 'siderurgica_metal',
    subCategoryLabel: {
      es: 'Siderurgia & Metalurgia',
      en: 'Steel & Metallurgy',
      zh: '钢铁与冶金',
      fr: 'Sidérurgie & Métallurgie'
    },
    description: {
      es: 'La acería más grande de México y Latinoamérica. Produce planchón, alambrón, varilla corrugada y perfiles de acero pesado con más de 8,000 empleos directos e indirectos.',
      en: 'Largest steel plant in Mexico producing slabs, wire rod, and rebar, employing over 8,000 workers.',
      zh: '墨西哥最大的综合钢铁厂，生产板坯、线材和螺纹钢，提供超8000个工作岗位。',
      fr: 'La plus grande aciérie du Mexique produisant brames et ronds à béton, employant plus de 8 000 salariés.'
    },
    coords: { lat: 17.9390, lng: -102.2120 },
    address: 'Av. Francisco J. Mújica No. 1, Isla del Cayacal, Lázaro Cárdenas',
    recommendedBusRoute: 'Ruta 2: Ramal Siderúrgica / Isla Cayacal',
    transitInstructions: {
      es: 'Ruta 2 desde Centro Lázaro Cárdenas. Pedir parada en Puerta 2 ArcelorMittal o Puerta de Contratistas.',
      en: 'Route 2 from Downtown. Stop at Gate 2 ArcelorMittal or Contractor Gate.',
      zh: '从市中心乘2号线，在安赛乐米塔尔2号门或承包商大门下车。',
      fr: 'Route 2 depuis le centre. Arrêt Porte 2 ArcelorMittal ou Porte Sous-traitants.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
    schedule: 'Operación continua 24/7 (3 turnos rotativos)',
    phone: '+52 753 533 1100',
    tags: ['Siderúrgica', 'Empleo', 'Isla Cayacal', 'Industria Pesada', 'Acería'],
    rntVerified: true
  },
  {
    id: 'ind-fertinal',
    name: {
      es: 'Fertinal (Fertilizantes Fosfatados de México / Pemex)',
      en: 'Fertinal (Phosphate Fertilizers Mexico)',
      zh: '费尔蒂纳尔化肥厂 (Fertinal / 墨西哥国家石油公司)',
      fr: 'Fertinal Engrais Phosphatés du Mexique'
    },
    category: 'worker_industry',
    mainCategory: 'empleos_industrias',
    subCategory: 'quimica_fertilizantes',
    subCategoryLabel: {
      es: 'Química & Fertilizantes',
      en: 'Chemicals & Fertilizers',
      zh: '化工与化肥',
      fr: 'Chimie & Engrais'
    },
    description: {
      es: 'Planta agroquímica productora de fertilizantes fosfatados y ácido sulfúrico para el campo nacional e internacional con muelles propios de descarga.',
      en: 'Major fertilizer complex producing phosphate fertilizers and sulfuric acid for agricultural export.',
      zh: '大型农化综合体，生产磷肥和硫酸，拥有独立装卸码头。',
      fr: 'Complexe agrochimique produisant des engrais phosphatés et de l’acide sulfurique.'
    },
    coords: { lat: 17.9310, lng: -102.1980 },
    address: 'Recinto Portuario Interior s/n, Isla del Cayacal',
    recommendedBusRoute: 'Ruta 2: Malecón - Isla del Cayacal',
    transitInstructions: {
      es: 'Ruta 2 hacia Isla del Cayacal. Parada frente a acceso principal de Fertinal.',
      en: 'Route 2 to Isla del Cayacal. Stop in front of Fertinal main gate.',
      zh: '乘2号线前往Isla del Cayacal，在Fertinal主入口下车。',
      fr: 'Route 2 vers Isla del Cayacal. Arrêt face à l’entrée principale.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    schedule: '24 horas / Operaciones industriales',
    phone: '+52 753 533 0300',
    tags: ['Fertilizantes', 'Petroquímica', 'Agroquímica', 'Empleos'],
    rntVerified: false
  },
  {
    id: 'ind-apm-terminals',
    name: {
      es: 'APM Terminals Lázaro Cárdenas (TEC II)',
      en: 'APM Terminals Lázaro Cárdenas (TEC II Container Hub)',
      zh: '马士基码头公司拉萨罗卡德纳斯 (TEC II 自动化集装箱码头)',
      fr: 'APM Terminals Lázaro Cárdenas (TEC II Conteneurs)'
    },
    category: 'worker_industry',
    mainCategory: 'empleos_industrias',
    subCategory: 'terminales_portuarias',
    subCategoryLabel: {
      es: 'Terminales de Contenedores',
      en: 'Container Terminals',
      zh: '集装箱码头',
      fr: 'Terminaux à Conteneurs'
    },
    description: {
      es: 'Primera terminal de contenedores semiautomatizada de México y Latinoamérica. Opera con grúas ecológicas y conexión ferroviaria directa con el centro del país y EE.UU.',
      en: 'First semi-automated container terminal in Latin America with eco-cranes and on-dock rail intermodal connectivity.',
      zh: '拉美首个半自动化集装箱码头，配备环保岸桥并与铁路直连。',
      fr: 'Premier terminal de conteneurs semi-automatisé d’Amérique latine avec liaison ferroviaire directe.'
    },
    coords: { lat: 17.9290, lng: -102.1760 },
    address: 'Terminal Especializada de Contenedores II, Isla del Cayacal',
    recommendedBusRoute: 'Ruta 2: Puerto Interior',
    transitInstructions: {
      es: 'Tomar Ruta 2. Identificarse en el filtro de seguridad ASIPONA y bajar en Garita APM Terminals.',
      en: 'Take Route 2. Check in at ASIPONA gate, stop at APM Terminals terminal gate.',
      zh: '乘2号线在ASIPONA安检处核验身份，在APM码头岗亭下车。',
      fr: 'Prendre la Route 2. Contrôle à la barrière ASIPONA puis arrêt au poste APM.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    schedule: 'Operación continua 24/7/365',
    phone: '+52 753 533 3000',
    tags: ['Contenedores', 'TEC II', 'Logística', 'Buques Portacontenedores'],
    rntVerified: true
  },
  {
    id: 'ind-hutchison-lct',
    name: {
      es: 'Hutchison Ports LCT (Terminal Especializada TEC I)',
      en: 'Hutchison Ports LCT (TEC I Container Terminal)',
      zh: '和记港口集团 LCT (TEC I 集装箱码头)',
      fr: 'Hutchison Ports LCT (Terminal de Conteneurs TEC I)'
    },
    category: 'worker_industry',
    mainCategory: 'empleos_industrias',
    subCategory: 'terminales_portuarias',
    subCategoryLabel: {
      es: 'Terminales de Contenedores',
      en: 'Container Terminals',
      zh: '集装箱码头',
      fr: 'Terminaux à Conteneurs'
    },
    description: {
      es: 'Pionera en el movimiento de contenedores de gran calado en Lázaro Cárdenas, con patios de maniobra intermodal y recepción de megabuques de Asia.',
      en: 'Deep-water container terminal receiving mega container vessels from Asia with intermodal rail yard.',
      zh: '深水集装箱码头，常年接靠来自亚洲的巨型集装箱班轮。',
      fr: 'Terminal conteneurs en eau profonde accueillant les porte-conteneurs géants d’Asie.'
    },
    coords: { lat: 17.9350, lng: -102.1810 },
    address: 'Terminal de Contenedores I, Recinto Portuario Isla del Cayacal',
    recommendedBusRoute: 'Ruta 2: Puerto - Isla del Cayacal',
    transitInstructions: {
      es: 'Ruta 2 con descenso en Garita LCT Hutchison Ports.',
      en: 'Route 2 with drop-off at Hutchison Ports LCT gate.',
      zh: '乘2号线在和记港口LCT大门下车。',
      fr: 'Route 2 avec arrêt à la porte d’entrée Hutchison Ports LCT.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
    schedule: '24/7 Operación Portuaria',
    phone: '+52 753 533 2100',
    tags: ['Hutchison Ports', 'TEC I', 'Comercio Exterior', 'Logística'],
    rntVerified: true
  },
  {
    id: 'ind-ssa-mexico',
    name: {
      es: 'SSA México (Terminal Especializada de Automóviles TEA)',
      en: 'SSA Mexico (Automobile & Roll-on/Roll-off Hub)',
      zh: 'SSA 墨西哥汽车专用码头 (滚装与整车枢纽)',
      fr: 'SSA Mexique (Terminal Automobile Roulier TEA)'
    },
    category: 'worker_industry',
    mainCategory: 'empleos_industrias',
    subCategory: 'terminales_portuarias',
    subCategoryLabel: {
      es: 'Automotriz & Ro-Ro',
      en: 'Automotive & Ro-Ro',
      zh: '滚装汽车物流',
      fr: 'Automobile & Roulier'
    },
    description: {
      es: 'Principal punto de exportación e importación de vehículos de las principales marcas mundiales (GM, Nissan, Mazda, Honda, Audi) en el Pacífico.',
      en: 'Pacific hub for automotive export and import handling over 600,000 finished vehicles annually.',
      zh: '太平洋主要整车进出口枢纽，每年装卸逾60万辆全新商品车。',
      fr: 'Plaque tournante du Pacifique pour l’import-export de véhicules finis.'
    },
    coords: { lat: 17.9420, lng: -102.1850 },
    address: 'Isla de Enmedio / Recinto Portuario Poniente',
    recommendedBusRoute: 'Ruta 2: Malecón - Recinto Portuario',
    transitInstructions: {
      es: 'Ruta 2, transbordo interno a Terminal de Autos SSA.',
      en: 'Route 2, internal connection to SSA Auto Terminal.',
      zh: '乘2号线至港区换乘进入SSA汽车码头。',
      fr: 'Route 2 puis navette interne vers le terminal auto SSA.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80',
    schedule: '24 horas en operaciones de embarque',
    phone: '+52 753 533 1900',
    tags: ['Automóviles', 'SSA México', 'Ro-Ro', 'Patios de Autos'],
    rntVerified: true
  },
  {
    id: 'ind-aaaplac',
    name: {
      es: 'AAAPLAC (Asoc. de Agentes Aduanales del Puerto)',
      en: 'AAAPLAC (Customs Brokers Association of Lázaro Cárdenas)',
      zh: '拉萨罗卡德纳斯报关行协会 (AAAPLAC)',
      fr: 'AAAPLAC Association des Déclarants en Douane'
    },
    category: 'worker_industry',
    mainCategory: 'empleos_industrias',
    subCategory: 'aduanas_logistica',
    subCategoryLabel: {
      es: 'Aduanas & Agencias',
      en: 'Customs & Logistics',
      zh: '海关与报关行',
      fr: 'Douanes & Logistique'
    },
    description: {
      es: 'Organismo que agrupa a más de 40 firmas aduanales y operadores logísticos internacionales para trámites de importación, pedimentos y asesoría arancelaria.',
      en: 'Hub uniting over 40 customs broker agencies for customs declarations, inspection, and trade compliance.',
      zh: '汇聚40余家国际报关行与物流代理企业的综合服务平台。',
      fr: 'Regroupe plus de 40 agences de douane pour le dédouanement et le fret.'
    },
    coords: { lat: 17.9620, lng: -102.1930 },
    address: 'Av. Melchor Ocampo No. 120, Col. Centro, Lázaro Cárdenas',
    recommendedBusRoute: 'Ruta 1 y Ruta 2: Parada Centro Av. Melchor Ocampo',
    transitInstructions: {
      es: 'Bajar en Av. Melchor Ocampo esq. Corregidora. Caminar media cuadra.',
      en: 'Stop at Melchor Ocampo and Corregidora. Walk half a block.',
      zh: '在Melchor Ocampo大道与Corregidora路口下车，步行半街区。',
      fr: 'Descendre avenue Melchor Ocampo angle Corregidora. Marcher 50m.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Viernes 08:30 - 18:30 / Sábados 09:00 - 13:00',
    phone: '+52 753 532 2320',
    tags: ['Agentes Aduanales', 'Pedimentos', 'AAAPLAC', 'Comercio Exterior'],
    rntVerified: true
  },
  {
    id: 'ind-cpkc',
    name: {
      es: 'CPKC Ferrocarril Intermodal (Patios de Maniobras)',
      en: 'CPKC Rail Intermodal Freight Terminal',
      zh: '加拿大太平洋堪萨斯城铁路 (CPKC 联运货运编组站)',
      fr: 'CPKC Terminal Ferroviaire Intermodal'
    },
    category: 'worker_industry',
    mainCategory: 'empleos_industrias',
    subCategory: 'aduanas_logistica',
    subCategoryLabel: {
      es: 'Ferrocarril & Intermodal',
      en: 'Rail & Intermodal',
      zh: '铁路物流',
      fr: 'Fret Ferroviaire'
    },
    description: {
      es: 'Terminal ferroviaria troncal transnacional que conecta Lázaro Cárdenas con Guadalajara, Monterrey, CDMX, Houston y Chicago sin transbordos.',
      en: 'Key rail hub connecting Lázaro Cárdenas seamlessly to Mexico City, Monterrey, Texas, and Canada.',
      zh: '直通墨西哥城、蒙特雷、美国及加拿大的跨国集装箱直达货运班列编组中心。',
      fr: 'Gare de triage stratégique reliant le port à Mexico, Monterrey et aux États-Unis.'
    },
    coords: { lat: 17.9480, lng: -102.1960 },
    address: 'Patios Ferroviarios Isla del Cayacal, acceso Puente Albatros',
    recommendedBusRoute: 'Ruta 2: Ramal Patios Ferroviarios',
    transitInstructions: {
      es: 'Ruta 2 con dirección a Isla del Cayacal, bajar en estación de control CPKC.',
      en: 'Route 2 towards Isla del Cayacal, get off at CPKC dispatch office.',
      zh: '乘2号线前往Isla del Cayacal，在CPKC调度中心下车。',
      fr: 'Route 2 vers Isla del Cayacal, arrêt au centre d’exploitation CPKC.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    schedule: '24/7 Coordinación Ferroviaria',
    phone: '+52 753 533 0880',
    tags: ['Ferrocarril', 'CPKC', 'Intermodal', 'Tren de Carga'],
    rntVerified: false
  },
  {
    id: 'ind-cfe-termoelectrica',
    name: {
      es: 'CFE Central Termoeléctrica "Plutarco Elías Calles" (Petacalco / LC)',
      en: 'CFE Megawatt Thermoelectric Power Station',
      zh: 'CFE 普卢塔尔科·埃利亚斯·卡列斯大型火力发电站',
      fr: 'CFE Centrale Thermoélectrique de Petacalco'
    },
    category: 'worker_industry',
    mainCategory: 'empleos_industrias',
    subCategory: 'energia_combustibles',
    subCategoryLabel: {
      es: 'Energía & Electricidad',
      en: 'Energy & Power',
      zh: '电力能源',
      fr: 'Énergie Électrique'
    },
    description: {
      es: 'Una de las plantas generadoras de electricidad más potentes de México (2,778 MW) que abastece energía a la red eléctrica nacional y a la industria siderúrgica.',
      en: 'One of Mexico’s largest power plants producing 2,778 MW supplying the national grid and port industries.',
      zh: '墨西哥装机容量最大的发电厂之一（2778兆瓦），为全国电网及港口重工业供电。',
      fr: 'Une des plus grandes centrales thermiques du Mexique (2 778 MW) alimentant le réseau national.'
    },
    coords: { lat: 17.9890, lng: -102.1150 },
    address: 'Carretera Costera Lázaro Cárdenas - Zihuatanejo Km 12',
    recommendedBusRoute: 'Ruta Especial Petacalco - Centro LC',
    transitInstructions: {
      es: 'Autobús suburbano Petacalco desde terminal Centro LC. Tiempo estimado: 22 min.',
      en: 'Suburban bus towards Petacalco from downtown terminal. Approx 22 mins.',
      zh: '从市中心客运站乘前往Petacalco的市郊客车，用时约22分钟。',
      fr: 'Bus suburbain vers Petacalco depuis le centre. Trajet: 22 min.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
    schedule: 'Operación ininterrumpida 24 horas',
    phone: '+52 753 533 4000',
    tags: ['CFE', 'Energía', 'Electricidad', 'Industria Energética'],
    rntVerified: false
  },
  {
    id: 'ind-pemex-tad',
    name: {
      es: 'Terminal de Almacenamiento y Despacho PEMEX Lázaro Cárdenas',
      en: 'PEMEX Marine Fuel Storage & Dispatch Terminal',
      zh: 'PEMEX 墨西哥国家石油公司燃油储运与分销码头',
      fr: 'Terminal de Stockage et Distribution Carburant PEMEX'
    },
    category: 'worker_industry',
    mainCategory: 'empleos_industrias',
    subCategory: 'energia_combustibles',
    subCategoryLabel: {
      es: 'Combustibles & Energía',
      en: 'Fuel & Energy',
      zh: '石化储运',
      fr: 'Carburants & Énergie'
    },
    description: {
      es: 'Terminal portuaria para descarga de buquetanques, almacenamiento de gasolinas, diésel marino y combustóleo para buques y el occidente del país.',
      en: 'Marine fuel depot supplying bunker fuel for container vessels and gasoline distribution for western Mexico.',
      zh: '为远洋货轮提供船用燃油加注并保障墨西哥西部地区成品油供应的海运油库。',
      fr: 'Dépôt de carburant maritime pour le soutage des navires et la distribution régionale.'
    },
    coords: { lat: 17.9370, lng: -102.1910 },
    address: 'Recinto Portuario Isla del Cayacal',
    recommendedBusRoute: 'Ruta 2: Malecón - Puerto',
    transitInstructions: {
      es: 'Ruta 2, parada en garita de distribución de combustible PEMEX.',
      en: 'Route 2, alight at PEMEX dispatch security gate.',
      zh: '乘2号线在PEMEX油库安保岗亭下车。',
      fr: 'Route 2, arrêt au poste de contrôle PEMEX.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1545231027-637d2f6210f8?auto=format&fit=crop&w=800&q=80',
    schedule: '24 horas / Despacho de autotanques',
    phone: '+52 753 533 0550',
    tags: ['PEMEX', 'Combustible', 'Bunker', 'Buquetanques'],
    rntVerified: false
  },
  {
    id: 'ind-astilleros-balsas',
    name: {
      es: 'Astillero y Varadero de Mantenimiento Naval del Balsas',
      en: 'Balsas Naval Shipyard & Marine Repair Yards',
      zh: '巴尔萨斯河造船修船厂及海事维护中心',
      fr: 'Chantier Naval & Réparation Maritime du Balsas'
    },
    category: 'worker_industry',
    mainCategory: 'empleos_industrias',
    subCategory: 'naval_pesca',
    subCategoryLabel: {
      es: 'Naval & Astilleros',
      en: 'Shipyard & Marine',
      zh: '船舶修造',
      fr: 'Construction & Réparation Navale'
    },
    description: {
      es: 'Centro de reparación naval, soldadura certificada, carenado de remolcadores portuarios, barcazas y embarcaciones pesqueras de altura.',
      en: 'Marine repair yard specialized in tugboats, pilot boats, and commercial fishing fleet maintenance.',
      zh: '专注于港口拖轮、引航艇和远洋渔船维护保养的专业修造船基地。',
      fr: 'Chantier de carénage et de maintenance pour remorqueurs et navires de pêche.'
    },
    coords: { lat: 17.9520, lng: -102.1890 },
    address: 'Ribera del Canal de Navegación s/n, Malecón Este',
    recommendedBusRoute: 'Ruta 1 y Ruta 2: Malecón',
    transitInstructions: {
      es: 'Tomar Ruta 1 o 2 hasta el Malecón. Caminar hacia el muelle de remolcadores.',
      en: 'Take Route 1 or 2 to Malecón. Walk towards the tugboat dock.',
      zh: '乘1号或2号线至Malecón，朝拖轮码头步行即到。',
      fr: 'Route 1 ou 2 jusqu’au Malecón, marcher vers le quai des remorqueurs.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Sábado 07:00 - 18:00',
    phone: '+52 753 532 9840',
    tags: ['Astillero', 'Soldadura Naval', 'Remolcadores', 'Mantenimiento'],
    rntVerified: false
  },
  {
    id: 'ind-saam-towage',
    name: {
      es: 'SAAM Towage México (Remolcadores Portuarios)',
      en: 'SAAM Towage Mexico (Port Tugboat Operations)',
      zh: 'SAAM 拖轮作业公司 (港口巨轮助泊引航)',
      fr: 'SAAM Towage Mexique (Opérations de Remorquage)'
    },
    category: 'worker_industry',
    mainCategory: 'empleos_industrias',
    subCategory: 'naval_pesca',
    subCategoryLabel: {
      es: 'Naval & Remolcadores',
      en: 'Marine & Tugboats',
      zh: '船舶海事与拖轮',
      fr: 'Maritime & Remorquage'
    },
    description: {
      es: 'Flota de remolcadores azimutales de más de 70 toneladas de tiro para maniobras de atraque, desatraque y escolta de buques portacontenedores de 400 metros de eslora en el canal principal.',
      en: 'Fleet of high-power azimuth tugboats assisting mega-container ships during dock maneuvers in the main channel.',
      zh: '拥有70吨以上拖力全回转拖轮船队，负责400米级超大型集装箱船在主航道的进出港助泊作业。',
      fr: 'Flotte de remorqueurs azimutaux pour l’amarrage et l’escorte des porte-conteneurs géants.'
    },
    coords: { lat: 17.9495, lng: -102.1880 },
    address: 'Muelle de Remolcadores, Recinto Portuario Interior',
    recommendedBusRoute: 'Ruta 2: Parada Malecón / Acceso Muelle',
    transitInstructions: {
      es: 'Ruta 2 hasta el Malecón de la Cultura y la Paz. Ingreso a muelle de operaciones marítimas.',
      en: 'Route 2 to Malecón. Access via maritime operations gate.',
      zh: '乘2号线至文化与和平滨海步道，经海事作业通道进入。',
      fr: 'Route 2 jusqu’au Malecón, accès par la porte des opérations maritimes.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    schedule: 'Operación continua 24/7/365',
    phone: '+52 753 533 1840',
    tags: ['Remolcadores', 'Maniobras Portuarias', 'SAAM', 'Navegación'],
    rntVerified: true
  },
  {
    id: 'ind-cooperativa-pesquera',
    name: {
      es: 'Sociedad Cooperativa Pesquera La Barra del Río Balsas',
      en: 'La Barra del Río Balsas Artisanal & Commercial Fishermen Co-op',
      zh: '巴尔萨斯河口渔业合作社 (海鲜捕捞与冰鲜基地)',
      fr: 'Coopérative de Pêche La Barra del Río Balsas'
    },
    category: 'worker_industry',
    mainCategory: 'empleos_industrias',
    subCategory: 'naval_pesca',
    subCategoryLabel: {
      es: 'Pesca & Acuacultura',
      en: 'Fisheries & Seafood',
      zh: '海事渔业与捕捞',
      fr: 'Pêche & Aquaculture'
    },
    description: {
      es: 'Organización de pescadores ribereños y de altamar. Muelles de descarga artesanal, cuartos fríos y comercialización directa de pargo, huachinango, robalo y langostilla de río.',
      en: 'Fishermen cooperative with dockside landing facilities, cold storage, and direct wholesale of Pacific red snapper and river prawns.',
      zh: '近海与远洋渔民合作社，设有海鲜装卸码头、冷库，直销太平洋红鲷鱼、石斑鱼及淡水巨虾。',
      fr: 'Coopérative de pêcheurs côtiers avec chambres froides et débarquement de poissons frais.'
    },
    coords: { lat: 17.9535, lng: -102.1810 },
    address: 'Muelle Pesquero Tradicional, Barra de San Jerónimo / Río Balsas',
    recommendedBusRoute: 'Ruta 2: Malecón Este',
    transitInstructions: {
      es: 'Ruta 2 hasta término de Malecón y camino a muelle de pescadores.',
      en: 'Route 2 to end of Malecón and pathway to fishing dock.',
      zh: '乘2号线至Malecón尽头，沿渔港栈道步行即达。',
      fr: 'Route 2 jusqu’au bout du Malecón puis chemin vers le quai de pêche.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    schedule: 'Llegada de lanchas 05:00 - 13:00 / Venta directa todo el día',
    phone: '+52 753 532 1888',
    tags: ['Pesca', 'Pescadores', 'Río Balsas', 'Mariscos Frescos', 'Empleo Local'],
    rntVerified: false
  },
  {
    id: 'ind-ica-coimsa',
    name: {
      es: 'COIMSA / Servicios Industriales y Metalmecánica del Balsas',
      en: 'COIMSA Heavy Industrial Maintenance & Steel Fabrication',
      zh: 'COIMSA 工业重型装备维保与重钢构件制造基地',
      fr: 'COIMSA Maintenance Industrielle & Métallurgie'
    },
    category: 'worker_industry',
    mainCategory: 'empleos_industrias',
    subCategory: 'metalmecanica_servicios',
    subCategoryLabel: {
      es: 'Metalmecánica & Mantenimiento',
      en: 'Mechanical & Fabrication',
      zh: '工业机械与维保',
      fr: 'Maintenance Industrielle'
    },
    description: {
      es: 'Complejo de pailería pesada, soldadura de alta presión bajo norma ASME, maquinados en torno y mantenimiento preventivo para plantas siderúrgicas, mineras y petroquímicas.',
      en: 'Industrial fabrication shop delivering ASME-grade welding, heavy piping, and mechanical overhaul for steel and petrochemical mills.',
      zh: '专业工业金属构件与高压焊接制造车间，为钢铁厂、矿业及石化厂提供机械大修和特种焊接。',
      fr: 'Atelier de chaudronnerie lourde, soudure haute pression et maintenance sidérurgique.'
    },
    coords: { lat: 17.9540, lng: -102.2150 },
    address: 'Parque Industrial La Isla, Lote 14, Isla del Cayacal',
    recommendedBusRoute: 'Ruta 2: Ramal Parque Industrial',
    transitInstructions: {
      es: 'Ruta 2 hacia Parque Industrial Isla del Cayacal, descender frente a talleres COIMSA.',
      en: 'Route 2 towards Industrial Park Cayacal, stop at COIMSA workshops.',
      zh: '乘2号线前往Isla del Cayacal工业园区，在COIMSA厂区大门下车。',
      fr: 'Route 2 vers le parc industriel, arrêt devant les ateliers COIMSA.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Sábado 07:30 - 18:00 (Turnos de emergencia 24h)',
    phone: '+52 753 533 2270',
    tags: ['Metalmecánica', 'Soldadura ASME', 'Pailería', 'Mantenimiento', 'Empleo Técnico'],
    rntVerified: false
  },

  // =========================================================================
  // 2. TURISMO (Ambiental, Industrial, Deportivo y Cívico)
  // =========================================================================
  {
    id: 'tur-pichi',
    name: {
      es: 'Estero y Manglares de Barra de Pichi',
      en: 'Barra de Pichi Estuary & Mangrove Eco-Reserve',
      zh: '巴拉德皮奇河口与红树林生态保护区',
      fr: 'Estuaire et Mangroves de Barra de Pichi'
    },
    category: 'environmental',
    mainCategory: 'turismo',
    subCategory: 'ambiental_ecoturismo',
    subCategoryLabel: {
      es: 'Turismo Ambiental / Ecoturismo',
      en: 'Eco-Tourism & Nature',
      zh: '生态环境旅游',
      fr: 'Écotourisme & Nature'
    },
    description: {
      es: 'Área natural protegida comunitaria con paseos en lancha ecológica entre manglares rojos y blancos, avistamiento de aves migratorias y cocodrilos en su hábitat natural.',
      en: 'Community protected wetland featuring guided eco-boat tours through mangrove channels and bird watching.',
      zh: '社区保护性湿地，提供穿行于红树林水道的生态乘船游览及观鸟。',
      fr: 'Zone humide protégée avec excursions en bateau écologique dans les mangroves.'
    },
    coords: { lat: 17.9950, lng: -102.3780 },
    address: 'Carretera Costera Km 21, Barra de Pichi, Playa Azul',
    recommendedBusRoute: 'Ruta 3: Lázaro Centro - Playa Azul - Barra de Pichi',
    transitInstructions: {
      es: 'Tomar Ruta 3 hasta la última parada en Barra de Pichi. Salidas cada 15 min.',
      en: 'Take Route 3 to final stop at Barra de Pichi. Departs every 15 mins.',
      zh: '乘坐3号线至Barra de Pichi终点站。每15分钟一班。',
      fr: 'Prendre la Route 3 jusqu’au terminus à Barra de Pichi. Toutes les 15 min.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Domingo 08:00 - 18:30',
    phone: '+52 753 535 0120',
    tags: ['Ecoturismo', 'Manglares', 'Paseos en Lancha', 'Aves', 'Cocodrilos'],
    rntVerified: true,
    priceRange: '$'
  },
  {
    id: 'tur-tortugario',
    name: {
      es: 'Campamento Tortuguero Taracosta (Playa Azul)',
      en: 'Taracosta Sea Turtle Sanctuary (Playa Azul)',
      zh: '塔拉科斯塔海龟保护繁育营地 (普拉亚阿苏尔)',
      fr: 'Sanctuaire de Tortues Marines Taracosta'
    },
    category: 'environmental',
    mainCategory: 'turismo',
    subCategory: 'ambiental_ecoturismo',
    subCategoryLabel: {
      es: 'Turismo Ambiental / Ecoturismo',
      en: 'Eco-Tourism & Nature',
      zh: '生态环境旅游',
      fr: 'Écotourisme & Nature'
    },
    description: {
      es: 'Centro de preservación de tortugas marinas Golfina, Negra y Laúd. Eventos vespertinos y nocturnos de liberación de crías y educación para la conservación.',
      en: 'Preservation sanctuary for Olive Ridley, Black, and Leatherback turtles with hatchling release events at sunset.',
      zh: '丽龟、黑龟和棱皮龟保护繁育基地，日落时分举办幼龟放生活动。',
      fr: 'Sanctuaire de préservation des tortues marines avec lâchers de bébés tortues au coucher du soleil.'
    },
    coords: { lat: 17.9815, lng: -102.3510 },
    address: 'Boulevard Madero Sur frente al mar, Playa Azul',
    recommendedBusRoute: 'Ruta 3: Lázaro Centro - Playa Azul',
    transitInstructions: {
      es: 'Ruta 3 con bajada en el Arco de Bienvenida de Playa Azul, caminar 200m hacia la playa.',
      en: 'Route 3, get off at Playa Azul Welcome Arch, walk 200m to the beach.',
      zh: '3号线在Playa Azul欢迎拱门下车，步行200米即到海滩。',
      fr: 'Route 3, descendre à l’arche de Playa Azul, 200m à pied vers la plage.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=800&q=80',
    schedule: 'Temporada de desove y liberación 17:00 - 21:00 (Octubre a Marzo)',
    phone: '+52 753 102 4433',
    tags: ['Tortugas', 'Playa Azul', 'Conservación', 'Sustentabilidad'],
    rntVerified: true,
    priceRange: '$'
  },
  {
    id: 'tur-cocodrilario',
    name: {
      es: 'Unidad de Manejo Ambiental Estero El Caimán',
      en: 'El Caimán Estuary Wildlife & Crocodile Sanctuary',
      zh: '埃尔凯曼河口生态与鳄鱼繁育保护区',
      fr: 'Sanctuaire Écologique & Crocodiles El Caimán'
    },
    category: 'environmental',
    mainCategory: 'turismo',
    subCategory: 'ambiental_ecoturismo',
    subCategoryLabel: {
      es: 'Turismo Ambiental / Ecoturismo',
      en: 'Eco-Tourism & Nature',
      zh: '生态环境旅游',
      fr: 'Écotourisme & Nature'
    },
    description: {
      es: 'Santuario ecológico y centro de rescate de cocodrilos de río (Crocodylus acutus). Visitas guiadas por biólogos para aprender sobre la cohabitación segura con la fauna local.',
      en: 'Wildlife rescue and research sanctuary for American Crocodiles with guided educational tours.',
      zh: '美洲鳄救援繁育保护基地，提供生物学家专业科普讲解与安全观赏游览。',
      fr: 'Centre de sauvetage et de protection des crocodiles avec visites éducatives encadrées.'
    },
    coords: { lat: 17.9730, lng: -102.2680 },
    address: 'Carretera a La Mira - Playa Eréndira Km 4',
    recommendedBusRoute: 'Ruta 1 (Conexión La Mira)',
    transitInstructions: {
      es: 'Ruta 1 con dirección a La Mira, descender en paradero de la reserva ecológica.',
      en: 'Route 1 towards La Mira, alight at wildlife reserve stop.',
      zh: '乘1号线前往La Mira，在野生动物保护区站下车。',
      fr: 'Route 1 vers La Mira, arrêt à la réserve faunique.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    schedule: 'Martes a Domingo 09:00 - 17:00',
    phone: '+52 753 537 9920',
    tags: ['Cocodrilos', 'Fauna Protegida', 'Biología', 'Ecoturismo'],
    rntVerified: true,
    priceRange: '$'
  },
  {
    id: 'tur-industrial-asipona',
    name: {
      es: 'Mirador de Grúas Super Post-Panamax & Recorrido RNT ASIPONA',
      en: 'Super Post-Panamax Cranes Lookout & Port Tour (RNT)',
      zh: '超巴拿马型岸桥观景台与港口工业观光 (RNT认证)',
      fr: 'Belvédère des Grues Post-Panamax & Visite Portuaire'
    },
    category: 'industrial',
    mainCategory: 'turismo',
    subCategory: 'industrial_portuario',
    subCategoryLabel: {
      es: 'Turismo Industrial Portuario',
      en: 'Industrial Port Tourism',
      zh: '港口工业旅游',
      fr: 'Tourisme Industriel Portuaire'
    },
    description: {
      es: 'Punto panorámico oficial con certificación RNT para contemplar la maniobra de buques portacontenedores gigantescos y grúas de 50 metros de elevación sobre el canal.',
      en: 'Official RNT-certified industrial viewpoint overlooking 24,000 TEU mega-ships and massive dock cranes.',
      zh: '国家官方RNT认证工业观光点，可俯瞰超大型集装箱船与码头巨型岸桥作业。',
      fr: 'Point de vue panoramique certifié RNT pour observer les navires géants et grues monumentales.'
    },
    coords: { lat: 17.9470, lng: -102.1860 },
    address: 'Paseo del Malecón Poniente, Malecón de la Cultura y la Paz',
    recommendedBusRoute: 'Ruta 2: Malecón - Puerto',
    transitInstructions: {
      es: 'Ruta 2 o Ruta 1 con parada directa en el mirador del Malecón.',
      en: 'Route 2 or Route 1, direct stop at Malecón lookout.',
      zh: '乘1号或2号线，直接在Malecón观景台站下车。',
      fr: 'Route 2 ou 1, arrêt direct au belvédère du Malecón.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    schedule: 'Acceso peatonal 06:00 - 22:00 (Paseos guiados fines de semana)',
    phone: '+52 753 533 0700',
    tags: ['Turismo Industrial', 'RNT Verificado', 'Buques', 'Grúas Puerto'],
    rntVerified: true,
    priceRange: '$'
  },
  {
    id: 'tur-ciclopista-balsas',
    name: {
      es: 'Ciclopista Ribereña y Corredor Deportivo Río Balsas',
      en: 'Balsas River Waterfront Cycling & Running Circuit',
      zh: '巴尔萨斯河畔自行车道与全民健身长廊',
      fr: 'Piste Cyclable du Fleuve Balsas & Circuit Sportif'
    },
    category: 'sports',
    mainCategory: 'turismo',
    subCategory: 'deportivo_aventura',
    subCategoryLabel: {
      es: 'Turismo Deportivo & Aventura',
      en: 'Sports & Adventure Tourism',
      zh: '体育健身与探险旅游',
      fr: 'Tourisme Sportif & Aventure'
    },
    description: {
      es: 'Circuito pavimentado de 7.5 km apto para ciclismo de ruta, patinaje y triatlón con iluminación solar, vigilancia y estaciones de hidratación gratuitas.',
      en: 'Lit 7.5 km paved circuit designed for road cycling, running, and triathlons with free hydration points.',
      zh: '全长7.5公里的平整路面照明骑行跑步道，适宜公路骑行与铁人三项训练。',
      fr: 'Circuit pavé de 7,5 km pour cyclisme, course et triathlon avec bornes d’hydratation.'
    },
    coords: { lat: 17.9570, lng: -102.1910 },
    address: 'Ribera del Río Balsas, Malecón Lázaro Cárdenas',
    recommendedBusRoute: 'Ruta 1 y Ruta 2: Estación Malecón',
    transitInstructions: {
      es: 'Cualquier combi hacia Centro/Malecón te deja al pie del acceso ciclista.',
      en: 'Any transit route to Downtown/Malecón drops off at the bike circuit entry.',
      zh: '前往市中心/Malecón的公交均可到达骑行道入口。',
      fr: 'Toutes les lignes vers le centre desservent l’accès cyclable.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=800&q=80',
    schedule: 'Abierto 24 horas (Iluminación inteligente 19:00 - 05:30)',
    tags: ['Ciclismo', 'Running', 'Triatlón', 'Río Balsas', 'Deporte'],
    rntVerified: true,
    priceRange: '$'
  },
  {
    id: 'tur-surf-caleta',
    name: {
      es: 'Bahía de Caleta de Campos & Playa La Soledad (Surf y Buceo)',
      en: 'Caleta de Campos Bay & La Soledad Beach (Surf & Scuba)',
      zh: '卡莱塔德坎波斯湾与拉索莱达海滩 (冲浪与潜水胜地)',
      fr: 'Baie de Caleta de Campos & Plage La Soledad (Surf)'
    },
    category: 'sports',
    mainCategory: 'turismo',
    subCategory: 'deportivo_aventura',
    subCategoryLabel: {
      es: 'Turismo Deportivo & Aventura',
      en: 'Sports & Adventure Tourism',
      zh: '体育健身与探险旅游',
      fr: 'Tourisme Sportif & Aventure'
    },
    description: {
      es: 'Bahía de aguas cristalinas y oleaje internacional ideal para surf, bodyboard, esnórquel y pesca deportiva en acantilados vírgenes de la costa michoacana.',
      en: 'Picturesque bay with world-class point break surf waves, cliff snorkeling, and deep-sea sport fishing.',
      zh: '风景如画的深水海湾，拥有世界级冲浪浪点与悬崖潜水、海钓资源。',
      fr: 'Baie aux eaux cristallines idéale pour le surf, le snorkeling et la pêche au gros.'
    },
    coords: { lat: 18.0750, lng: -102.7500 },
    address: 'Carretera Federal 200 Km 65, Caleta de Campos, Michoacán',
    recommendedBusRoute: 'Ruta 3 con conexión en Playa Azul hacia Caleta',
    transitInstructions: {
      es: 'Tomar Ruta 3 hasta Playa Azul y colectivo directo a Caleta de Campos.',
      en: 'Take Route 3 to Playa Azul and connect to regional shuttle to Caleta.',
      zh: '乘3号线至Playa Azul，换乘前往Caleta de Campos的区域客车。',
      fr: 'Route 3 jusqu’à Playa Azul puis correspondance navette vers Caleta.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80',
    schedule: 'Acceso natural libre todo el año',
    tags: ['Surf', 'Playas Vírgenes', 'Buceo', 'Costa Michoacana'],
    rntVerified: true,
    priceRange: '$'
  },
  {
    id: 'tur-puente-albatros',
    name: {
      es: 'Puente Basculante Albatros (Obra Maestra Portuaria)',
      en: 'Albatros Bascule Bridge (Iconic Port Engineering)',
      zh: '信天翁号立转开启式特大桥 (拉美唯一公铁水三用开启桥)',
      fr: 'Pont Basculant Albatros (Chef-d’œuvre Portuaire)'
    },
    category: 'industrial',
    mainCategory: 'turismo',
    subCategory: 'industrial_portuario',
    subCategoryLabel: {
      es: 'Turismo Industrial Portuario',
      en: 'Industrial Port Tourism',
      zh: '港口工业观光',
      fr: 'Tourisme Industriel Portuaire'
    },
    description: {
      es: 'El único puente basculante de su tipo en América Latina. Sus dos hojas de acero se abren majestuosamente para dar paso a buques de gran calado por el canal de navegación entre Isla del Cayacal e Isla de la Palma.',
      en: 'The only bascule bridge of its kind in Latin America, opening its massive counterweighted spans to let ocean vessels navigate through.',
      zh: '拉丁美洲唯一的双叶立转开启式桥梁，巨大钢桥面可抬起让巨轮通过连接内港航道。',
      fr: 'Unique pont basculant de son type en Amérique latine, s’ouvrant pour laisser passer les grands navires.'
    },
    coords: { lat: 17.9510, lng: -102.2025 },
    address: 'Canal Principal de Navegación, cruce Isla del Cayacal - Isla de la Palma',
    recommendedBusRoute: 'Ruta 2: Ramal Puente Albatros / Patios Portuarios',
    transitInstructions: {
      es: 'Ruta 2 te deja en el mirador peatonal previo al acceso al puente.',
      en: 'Route 2 drops at the pedestrian viewing esplanade before the bridge approach.',
      zh: '乘2号线在大桥引桥前的观景行人广场下车。',
      fr: 'Route 2 vous dépose sur l’esplanade piétonne avant le pont.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    schedule: 'Tránsito libre 24h / Maniobras de apertura según arribo de embarcaciones',
    phone: '+52 753 533 0700',
    tags: ['Puente Albatros', 'Ingeniería Naval', 'Canal de Navegación', 'Emblema Portuario'],
    rntVerified: true,
    priceRange: '$'
  },
  {
    id: 'tur-plaza-civica',
    name: {
      es: 'Monumento y Explanada Cívica General Lázaro Cárdenas',
      en: 'General Lázaro Cárdenas Civic Monument & Central Plaza',
      zh: '拉萨罗·卡德纳斯将军青铜纪念碑与市政市民广场',
      fr: 'Monument et Esplanade Civique Général Lázaro Cárdenas'
    },
    category: 'cultural_civico' as any,
    mainCategory: 'turismo',
    subCategory: 'cultural_civico',
    subCategoryLabel: {
      es: 'Turismo Cultural & Cívico',
      en: 'Cultural & Civic Heritage',
      zh: '文化与市民地标',
      fr: 'Tourisme Culturel & Civique'
    },
    description: {
      es: 'Plaza principal del puerto que rinde homenaje al General Lázaro Cárdenas del Río, artífice del desarrollo industrial y portuario. Espacio de convivencia con fuentes danzarinas, jardines y eventos cívicos.',
      en: 'Main city square honoring General Lázaro Cárdenas del Río, founder of the industrial harbor, featuring dancing fountains and tree-shaded gardens.',
      zh: '城市中央广场，矗立着开埠先驱拉萨罗·卡德纳斯将军巨型雕像，配音乐喷泉与休闲花园。',
      fr: 'Place centrale rendant hommage au général Lázaro Cárdenas, avec fontaines et jardins.'
    },
    coords: { lat: 17.9620, lng: -102.1990 },
    address: 'Av. Melchor Ocampo entre Hidalgo y Corregidora, Col. Centro',
    recommendedBusRoute: 'Ruta 1 y Ruta 2: Estación Central Plaza Cívica',
    transitInstructions: {
      es: 'Cualquier ruta urbana tiene parada sobre Av. Melchor Ocampo frente a la explanada.',
      en: 'All municipal bus routes stop along Av. Melchor Ocampo right in front of the plaza.',
      zh: '市中心所有公交路线均在Melchor Ocampo大道广场正前方设有经停站。',
      fr: 'Toutes les lignes urbaines s’arrêtent sur l’avenue devant la place.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=800&q=80',
    schedule: 'Abierto 24 horas todos los días',
    tags: ['Plaza Cívica', 'Monumento Histórico', 'Centro', 'Cultura', 'Fotografía'],
    rntVerified: true,
    priceRange: '$'
  },
  {
    id: 'tur-playa-jardin',
    name: {
      es: 'Corredor Turístico de Playa Jardín & Playa Eréndira',
      en: 'Playa Jardín & Playa Eréndira Pacific Beach Corridor',
      zh: '普拉亚哈尔丁与埃伦迪拉海滨休闲长廊 (传统海鲜排档与落日)',
      fr: 'Corridor Balnéaire Playa Jardín & Playa Eréndira'
    },
    category: 'environmental',
    mainCategory: 'turismo',
    subCategory: 'ambiental_ecoturismo',
    subCategoryLabel: {
      es: 'Turismo Ambiental / Ecoturismo',
      en: 'Eco-Tourism & Nature',
      zh: '生态环境旅游',
      fr: 'Écotourisme & Nature'
    },
    description: {
      es: 'Corredor de más de 4 kilómetros de playas frente a mar abierto, con enramadas típicas de palma de coco, cocina marinera tradicional, hamacas frente al oleaje y espectaculares puestas de sol costeñas.',
      en: 'Over 4 kilometers of open Pacific beach lined with palm thatched restaurants, fresh grilled fish, and sunset viewpoints.',
      zh: '绵延4公里的开阔太平洋沙滩，拥有茅草凉亭餐厅、地道烤海鱼与醉人金色日落。',
      fr: 'Plus de 4 kilomètres de plage du Pacifique bordée de paillotes traditionnelles et poissons grillés.'
    },
    coords: { lat: 17.9580, lng: -102.2350 },
    address: 'Boulevard Playero s/n, Lázaro Cárdenas',
    recommendedBusRoute: 'Ruta 2: Conexión Colectivo Playero',
    transitInstructions: {
      es: 'Ruta 2 hasta la glorieta de acceso a Playa Jardín o combi playera directa.',
      en: 'Route 2 to Playa Jardín entrance roundabout or direct beach shuttle.',
      zh: '乘2号线在Playa Jardín入口环岛下车，或乘坐直达海滩中巴。',
      fr: 'Route 2 jusqu’au rond-point de Playa Jardín ou minibus direct.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    schedule: 'Acceso a playa 24h / Enramadas de 09:00 a 20:00',
    tags: ['Playa Jardín', 'Playa Eréndira', 'Atardeceres', 'Enramadas', 'Mar Abierto'],
    rntVerified: true,
    priceRange: '$'
  },
  {
    id: 'tur-casa-cultura',
    name: {
      es: 'Casa de la Cultura "José Vasconcelos"',
      en: 'José Vasconcelos Cultural Center & Arts Academy',
      zh: '何塞·瓦斯科塞洛斯文化之家与艺术交流中心',
      fr: 'Maison de la Culture José Vasconcelos'
    },
    category: 'cultural_civico' as any,
    mainCategory: 'turismo',
    subCategory: 'cultural_civico',
    subCategoryLabel: {
      es: 'Turismo Cultural & Cívico',
      en: 'Cultural & Civic Heritage',
      zh: '文化与市民地标',
      fr: 'Tourisme Culturel & Civique'
    },
    description: {
      es: 'Recinto cultural con exposiciones fotográficas de la historia del puerto, talleres de arpa y danza de la Tierra Caliente, ballet folclórico costeño y teatro comunitario.',
      en: 'Hub for regional coastal folk arts, photo galleries tracing the history of the harbor, and traditional music concerts.',
      zh: '展示港口筑港历史照片、举办米却肯热土传统竖琴音乐会及沿海民间舞蹈演出的文化艺术殿堂。',
      fr: 'Centre culturel avec expositions sur l’histoire du port et danses traditionnelles.'
    },
    coords: { lat: 17.9670, lng: -102.2045 },
    address: 'Av. Melchor Ocampo No. 370 esq. Lucio Blanco, Segundo Sector',
    recommendedBusRoute: 'Ruta 1: Parada Casa de la Cultura',
    transitInstructions: {
      es: 'Ruta 1 te deja a media cuadra del recinto sobre Av. Melchor Ocampo.',
      en: 'Route 1 leaves you half a block away on Av. Melchor Ocampo.',
      zh: '乘1号线在Melchor Ocampo大道距文化中心半街区处下车。',
      fr: 'Route 1 à 50 mètres de l’entrée sur l’avenue Melchor Ocampo.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Viernes 08:00 - 20:00 / Sábados 09:00 - 14:00',
    phone: '+52 753 537 1919',
    tags: ['Casa de la Cultura', 'Historia Local', 'Música Tradicional', 'Talleres'],
    rntVerified: true,
    priceRange: '$'
  },

  // =========================================================================
  // 3. ATENCIÓN MÉDICA (Hospitales, Clínicas y Servicios de Urgencias)
  // =========================================================================
  {
    id: 'med-hosp-general',
    name: {
      es: 'Hospital General Dr. Cecilio Báez (Regional Lázaro Cárdenas)',
      en: 'Regional General Hospital Dr. Cecilio Báez',
      zh: '塞西里奥·巴埃斯医生区域公立综合医院',
      fr: 'Hôpital Général Régional Dr. Cecilio Báez'
    },
    category: 'medical',
    mainCategory: 'atencion_medica',
    subCategory: 'hospitales_generales',
    subCategoryLabel: {
      es: 'Hospitales Públicos Generales',
      en: 'Public General Hospitals',
      zh: '公立综合医院',
      fr: 'Hôpitaux Publics Généraux'
    },
    description: {
      es: 'Hospital de segundo nivel de la Secretaría de Salud con sala de choque, quirófanos, terapia intensiva, pediatría y trauma shock 24 horas para toda la región costera.',
      en: 'Major public hospital featuring 24/7 trauma emergency room, intensive care unit, and specialized medical clinics.',
      zh: '卫生部直属二级综合医院，设有24小时创伤急救中心、重症监护室与儿科。',
      fr: 'Hôpital public avec service d’urgences 24h/24, soins intensifs et blocs opératoires.'
    },
    coords: { lat: 17.9785, lng: -102.2120 },
    address: 'Av. Melchor Ocampo No. 240, Col. Segundo Sector, Lázaro Cárdenas',
    recommendedBusRoute: 'Ruta 1: Centro - Las Guacamayas',
    transitInstructions: {
      es: 'Ruta 1 para exactamente en la bahía de ambulancias y acceso peatonal de Urgencias.',
      en: 'Route 1 stops right at the ER pedestrian entrance and ambulance bay.',
      zh: '1号线直接停在急诊行人入口与救护车车道前。',
      fr: 'Route 1 s’arrête juste devant l’entrée des urgences.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    schedule: 'Urgencias 24 Horas / Consulta externa 07:00 - 20:00',
    phone: '+52 753 537 2020',
    tags: ['Hospital General', 'Urgencias 24h', 'Trauma Shock', 'Salud Pública'],
    rntVerified: false
  },
  {
    id: 'med-imss-12',
    name: {
      es: 'IMSS Hospital General de Zona No. 12',
      en: 'IMSS Zone General Hospital No. 12',
      zh: 'IMSS 国家社保第12区综合医院',
      fr: 'Hôpital Général de Zone IMSS No. 12'
    },
    category: 'medical',
    mainCategory: 'atencion_medica',
    subCategory: 'seguro_social_imss_issste',
    subCategoryLabel: {
      es: 'Seguro Social (IMSS / ISSSTE)',
      en: 'Social Security Healthcare',
      zh: '国家社保医疗',
      fr: 'Sécurité Sociale (IMSS)'
    },
    description: {
      es: 'Hospital del Seguro Social para trabajadores portuarios, siderúrgicos y sus familias. Cuenta con banco de sangre, hemodiálisis y especialistas médicos.',
      en: 'Social Security Hospital serving industrial and port workers with 24/7 emergency and blood bank.',
      zh: '为港区及钢铁产业工人和市民提供医疗服务的社保医院，设血库与透析中心。',
      fr: 'Hôpital de la sécurité sociale avec urgences 24h/24 et banque du sang.'
    },
    coords: { lat: 17.9640, lng: -102.1950 },
    address: 'Av. Lázaro Cárdenas esq. Tulipanes, Col. Centro',
    recommendedBusRoute: 'Ruta 1 y Ruta 2: Parada IMSS Centro',
    transitInstructions: {
      es: 'Caminar 50 metros desde el paradero del Centro. Accesible por Ruta 1 y Ruta 2.',
      en: '50-meter walk from Downtown stop. Accessible via Routes 1 and 2.',
      zh: '距市中心车站步行50米，1号线和2号线均可直达。',
      fr: 'À 50 mètres de l’arrêt central. Accessible par les Routes 1 et 2.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
    schedule: 'Urgencias 24 Horas / Especialidades Lunes a Viernes',
    phone: '+52 753 532 0212',
    tags: ['IMSS', 'Seguro Social', 'Urgencias 24h', 'Especialidades'],
    rntVerified: false
  },
  {
    id: 'med-issste-clinica',
    name: {
      es: 'Clínica-Hospital ISSSTE Lázaro Cárdenas',
      en: 'ISSSTE Clinic-Hospital Lázaro Cárdenas',
      zh: 'ISSSTE 国家公务员与公共卫生临床医院',
      fr: 'Clinique-Hôpital ISSSTE Lázaro Cárdenas'
    },
    category: 'medical',
    mainCategory: 'atencion_medica',
    subCategory: 'seguro_social_imss_issste',
    subCategoryLabel: {
      es: 'Seguro Social (IMSS / ISSSTE)',
      en: 'Social Security Healthcare',
      zh: '国家社保医疗',
      fr: 'Sécurité Sociale (ISSSTE)'
    },
    description: {
      es: 'Atención médica integral, farmacia de alta especialidad y urgencias para trabajadores de aduanas, educación y dependencias de gobierno.',
      en: 'Healthcare center for federal and customs workers with pharmacy and emergency ward.',
      zh: '为联邦公务人员及海关工作人员提供全天候门诊与急诊服务。',
      fr: 'Centre médical pour le personnel des douanes et de la fonction publique.'
    },
    coords: { lat: 17.9710, lng: -102.2030 },
    address: 'Av. Tariácuri s/n, Primer Sector, Lázaro Cárdenas',
    recommendedBusRoute: 'Ruta 1: Ramal Tariácuri',
    transitInstructions: {
      es: 'Ruta 1 con bajada frente a la glorieta de Tariácuri.',
      en: 'Route 1 with stop at Tariácuri roundabout.',
      zh: '乘1号线在Tariácuri环岛站下车即到。',
      fr: 'Route 1 avec arrêt au rond-point Tariácuri.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    schedule: 'Urgencias 24 Horas / Consulta 08:00 - 19:00',
    phone: '+52 753 532 1088',
    tags: ['ISSSTE', 'Urgencias', 'Farmacia', 'Consulta'],
    rntVerified: false
  },
  {
    id: 'med-cruz-roja',
    name: {
      es: 'Cruz Roja Mexicana Delegación Lázaro Cárdenas',
      en: 'Mexican Red Cross Lázaro Cárdenas Delegation',
      zh: '墨西哥红十字会拉萨罗卡德纳斯分会 (急救中心)',
      fr: 'Croix-Rouge Mexicaine Lázaro Cárdenas'
    },
    category: 'medical',
    mainCategory: 'atencion_medica',
    subCategory: 'urgencias_cruz_roja',
    subCategoryLabel: {
      es: 'Urgencias & Primeros Auxilios',
      en: 'Emergency & First Aid',
      zh: '紧急救护与急救',
      fr: 'Urgences & Secours'
    },
    description: {
      es: 'Base central de ambulancias prehospitalarias, atención de traumatismos por accidentes y primeros auxilios de emergencia 24/7.',
      en: 'Primary ambulance dispatch center providing 24/7 paramedic first responder medical aid.',
      zh: '救护车调度与院前急救指挥中心，提供全天候创伤急救与医疗服务。',
      fr: 'Centre de secours préhospitalier avec ambulances d’urgence 24h/24.'
    },
    coords: { lat: 17.9605, lng: -102.1995 },
    address: 'Av. Melchor Ocampo No. 85, Col. Centro',
    recommendedBusRoute: 'Ruta 1 y Ruta 2: Centro',
    transitInstructions: {
      es: 'Parada en Av. Melchor Ocampo, a 1 cuadra de la base de socorristas.',
      en: 'Stop at Av. Melchor Ocampo, 1 block from first aid station.',
      zh: '在Melchor Ocampo大道下车，距急救站仅一街区。',
      fr: 'Arrêt avenue Melchor Ocampo, à 1 bloc de la caserne de secours.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=800&q=80',
    schedule: 'Ambulancias y Urgencias 24 Horas / 365 Días',
    phone: '+52 753 532 0299',
    tags: ['Cruz Roja', 'Ambulancias 24h', 'Primeros Auxilios', 'Urgencias'],
    rntVerified: false
  },
  {
    id: 'med-sanatorio-santafe',
    name: {
      es: 'Sanatorio y Centro Quirúrgico Santa Fe',
      en: 'Santa Fe Private Surgical Center & Clinic',
      zh: '圣菲私立外科中心与微创专科医院',
      fr: 'Centre Chirurgical Privé Santa Fe'
    },
    category: 'medical',
    mainCategory: 'atencion_medica',
    subCategory: 'clinicas_especialidades',
    subCategoryLabel: {
      es: 'Clínicas & Especialidades Privadas',
      en: 'Private Clinics & Specialty',
      zh: '私立专科诊所',
      fr: 'Cliniques Privées & Spécialités'
    },
    description: {
      es: 'Clínica privada con laboratorio clínico automatizado, rayos X digital, ultrasonido 4D y quirófanos certificados para cirugía laparoscópica.',
      en: 'Certified private medical clinic offering diagnostic imaging, lab tests, and advanced surgery.',
      zh: '具备数字化影像与全自动检验设备的认证私立综合外科医疗中心。',
      fr: 'Clinique privée avec radiologie numérique, laboratoire et chirurgie.'
    },
    coords: { lat: 17.9660, lng: -102.2010 },
    address: 'Av. Heroica Escuela Naval Militar No. 112, Centro',
    recommendedBusRoute: 'Ruta 1: Parada Escuela Naval',
    transitInstructions: {
      es: 'Ruta 1 con descenso sobre Av. Heroica Escuela Naval Militar.',
      en: 'Route 1, stop along Heroica Escuela Naval Militar Avenue.',
      zh: '乘1号线在Heroica Escuela Naval Militar大道下车。',
      fr: 'Route 1, descente sur l’avenue Heroica Escuela Naval.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    schedule: 'Urgencias 24 Horas / Laboratorio 06:30 - 20:00',
    phone: '+52 753 537 4100',
    tags: ['Clínica Privada', 'Laboratorio', 'Rayos X', 'Cirugía'],
    rntVerified: false,
    priceRange: '$$'
  },
  {
    id: 'med-sanatorio-fatima',
    name: {
      es: 'Sanatorio Fátima (Clínica Médico Quirúrgica)',
      en: 'Fátima Medical & Surgical Center',
      zh: '法蒂玛综合外科医院与母婴专科中心',
      fr: 'Clinique Médico-Chirurgicale Fátima'
    },
    category: 'medical',
    mainCategory: 'atencion_medica',
    subCategory: 'clinicas_especialidades',
    subCategoryLabel: {
      es: 'Clínicas & Especialidades Privadas',
      en: 'Private Specialty Clinics',
      zh: '私立专科诊所',
      fr: 'Cliniques Privées & Spécialités'
    },
    description: {
      es: 'Sanatorio médico privado con atención de ginecología, obstetricia, traumatología, medicina interna, sala de partos, ultrasonido doppler y farmacia 24 horas.',
      en: 'Private hospital providing maternity, trauma orthopedics, internal medicine, and 24-hour pharmacy services.',
      zh: '全天候私立综合医院，设妇产科、骨科创伤、内科住院部及24小时平价药房。',
      fr: 'Clinique privée offrant maternité, traumatologie, médecine interne et pharmacie 24h.'
    },
    coords: { lat: 17.9650, lng: -102.1965 },
    address: 'Calle 5 de Febrero No. 78, Col. Centro, Lázaro Cárdenas',
    recommendedBusRoute: 'Ruta 1 y Ruta 2: Centro / Parada 5 de Febrero',
    transitInstructions: {
      es: 'Bajar en Av. Lázaro Cárdenas y caminar media cuadra por calle 5 de Febrero.',
      en: 'Alight at Av. Lázaro Cárdenas and walk half a block down 5 de Febrero street.',
      zh: '在Lázaro Cárdenas大道下车，沿5 de Febrero街步行半街区。',
      fr: 'Descendre avenue Lázaro Cárdenas et marcher 50 mètres rue 5 de Febrero.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    schedule: 'Urgencias 24 Horas / Consulta 08:00 - 21:00',
    phone: '+52 753 532 1630',
    tags: ['Sanatorio Fátima', 'Ginecología', 'Traumatología', 'Farmacia 24h', 'Hospital Privado'],
    rntVerified: false,
    priceRange: '$$'
  },
  {
    id: 'med-centro-salud-guacamayas',
    name: {
      es: 'Centro de Salud Urbano Las Guacamayas (SSM)',
      en: 'Las Guacamayas Urban Community Health Center',
      zh: '瓜卡马亚斯城市社区公立卫生服务中心 (SSM)',
      fr: 'Centre de Santé Urbain Las Guacamayas'
    },
    category: 'medical',
    mainCategory: 'atencion_medica',
    subCategory: 'hospitales_generales',
    subCategoryLabel: {
      es: 'Hospitales Públicos Generales',
      en: 'Public Health Centers',
      zh: '公立社区卫生中心',
      fr: 'Centres de Santé Publics'
    },
    description: {
      es: 'Centro de atención primaria de la Secretaría de Salud de Michoacán. Consulta médica general, odontología, medicina preventiva, vacunación universal y farmacia comunitaria.',
      en: 'Public community clinic delivering primary care, dental, preventive immunization, and maternal healthcare.',
      zh: '米却肯卫生厅社区门诊中心，提供全科医疗、口腔诊疗、疫苗接种及平价配药。',
      fr: 'Centre de soins de premier recours avec consultations générales, dentaires et vaccinations.'
    },
    coords: { lat: 18.0080, lng: -102.2260 },
    address: 'Av. Francisco I. Madero s/n, Tenencia de Las Guacamayas',
    recommendedBusRoute: 'Ruta 1: Las Guacamayas Centro',
    transitInstructions: {
      es: 'Ruta 1 con dirección a Guacamayas, parada directa frente al Centro de Salud.',
      en: 'Route 1 to Guacamayas, direct stop in front of Community Health Center.',
      zh: '乘1号线前往Guacamayas，在社区卫生服务中心正门口下车。',
      fr: 'Route 1 vers Guacamayas, arrêt direct devant le centre de santé.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Domingo 07:00 - 20:00 (Módulo continuo de urgencias)',
    phone: '+52 753 537 7820',
    tags: ['Centro de Salud', 'Guacamayas', 'Vacunación', 'Consulta General', 'Público'],
    rntVerified: false,
    priceRange: '$'
  },

  // =========================================================================
  // 4. DÓNDE COMER & ABASTECIMIENTO (Supermercados, Comida Rápida, Restaurantes, Fondas, Cafés)
  // =========================================================================
  // --- SUPERMERCADOS Y MERCADOS TRADICIONALES ---
  {
    id: 'com-soriana-hiper',
    name: {
      es: 'Soriana Híper Lázaro Cárdenas',
      en: 'Soriana Híper Supermarket',
      zh: '索里亚纳大型超市 (Soriana Híper)',
      fr: 'Supermarché Soriana Híper'
    },
    category: 'gastronomy',
    mainCategory: 'donde_comer',
    subCategory: 'supermercados',
    subCategoryLabel: {
      es: 'Supermercados & Mercados',
      en: 'Supermarkets & Groceries',
      zh: '大型超市与综合市场',
      fr: 'Supermarchés & Épiceries'
    },
    description: {
      es: 'Gran tienda de autoservicio con panadería fresca, carnes, mariscos, farmacia, abarrotes importados y cajeros de todos los bancos.',
      en: 'Comprehensive hypermarket with fresh bakery, seafood, produce, pharmacy, and banking ATMs.',
      zh: '大型一站式综合超市，设新鲜烘焙坊、生鲜水产、药房及各银行ATM机。',
      fr: 'Grand hypermarché avec boulangerie, poissons frais, pharmacie et distributeurs.'
    },
    coords: { lat: 17.9675, lng: -102.2035 },
    address: 'Av. Melchor Ocampo No. 450 esq. Av. Lázaro Cárdenas',
    recommendedBusRoute: 'Ruta 1 y Ruta 2: Parada Soriana Híper',
    transitInstructions: {
      es: 'Cualquier combi sobre Av. Melchor Ocampo te deja frente a la entrada principal.',
      en: 'Any transit along Melchor Ocampo stops right at the main entrance.',
      zh: 'Melchor Ocampo大道上的公交车均在大门口停靠。',
      fr: 'Tout minibus sur l’avenue Melchor Ocampo s’arrête devant l’entrée.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Domingo 07:00 - 23:00',
    phone: '+52 753 537 1800',
    tags: ['Supermercado', 'Abarrotes', 'Farmacia', 'Cajeros', 'Comida Preparada'],
    rntVerified: false,
    priceRange: '$$'
  },
  {
    id: 'com-walmart-supercenter',
    name: {
      es: 'Walmart Supercenter (Plaza Las Américas)',
      en: 'Walmart Supercenter (Plaza Las Américas Mall)',
      zh: '沃尔玛购物广场 (美洲商场店)',
      fr: 'Walmart Supercenter (Plaza Las Américas)'
    },
    category: 'gastronomy',
    mainCategory: 'donde_comer',
    subCategory: 'supermercados',
    subCategoryLabel: {
      es: 'Supermercados & Mercados',
      en: 'Supermarkets & Groceries',
      zh: '大型超市与综合市场',
      fr: 'Supermarchés & Épiceries'
    },
    description: {
      es: 'Supercenter ubicado en el centro comercial más importante del puerto, con amplia variedad de alimentos, deli, electrónica y farmacia.',
      en: 'Anchor hypermarket at Plaza Las Américas with full grocery, deli, and international goods.',
      zh: '港口主要商业中心核心超市，商品种类齐全，附设熟食外带区。',
      fr: 'Hypermarché du centre commercial Plaza Las Américas avec traiteur et épicerie.'
    },
    coords: { lat: 17.9740, lng: -102.2080 },
    address: 'Av. Melchor Ocampo No. 515, Plaza Las Américas, Lázaro Cárdenas',
    recommendedBusRoute: 'Ruta 1: Parada Plaza Las Américas',
    transitInstructions: {
      es: 'Ruta 1 te deja en la bahía de transporte de Plaza Las Américas.',
      en: 'Route 1 drops you at Plaza Las Américas transit terminal.',
      zh: '1号线直接停在Plaza Las Américas客运枢纽。',
      fr: 'Route 1 vous dépose au pôle bus de Plaza Las Américas.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Domingo 07:00 - 23:00',
    phone: '+52 753 537 6010',
    tags: ['Walmart', 'Supermercado', 'Plaza Las Américas', 'Abastecimiento'],
    rntVerified: false,
    priceRange: '$$'
  },
  {
    id: 'com-bodega-aurrera',
    name: {
      es: 'Bodega Aurrera (Las Guacamayas / Noyola)',
      en: 'Bodega Aurrera (Guacamayas)',
      zh: '奥雷拉平价大卖场 (瓜卡马亚斯分店)',
      fr: 'Bodega Aurrera (Las Guacamayas)'
    },
    category: 'gastronomy',
    mainCategory: 'donde_comer',
    subCategory: 'supermercados',
    subCategoryLabel: {
      es: 'Supermercados & Mercados',
      en: 'Supermarkets & Groceries',
      zh: '大型超市与综合市场',
      fr: 'Supermarchés & Épiceries'
    },
    description: {
      es: 'Supermercado de precios accesibles con abarrotes, frutas, verduras y artículos de primera necesidad para familias y trabajadores.',
      en: 'Value grocery supermarket providing fresh produce and daily essentials.',
      zh: '亲民平价综合超市，供应生鲜果蔬及各类日常生活物资。',
      fr: 'Supermarché discount avec fruits, légumes et produits de première nécessité.'
    },
    coords: { lat: 18.0050, lng: -102.2280 },
    address: 'Av. Ciranda No. 120, Tenencia de Las Guacamayas',
    recommendedBusRoute: 'Ruta 1: Terminal Las Guacamayas',
    transitInstructions: {
      es: 'Ruta 1 con dirección a Las Guacamayas, descenso directo frente a Aurrera.',
      en: 'Route 1 to Las Guacamayas, direct stop in front of Aurrera.',
      zh: '乘1号线前往Las Guacamayas，在Aurrera正门下车。',
      fr: 'Route 1 vers Las Guacamayas, arrêt direct devant Aurrera.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Domingo 07:30 - 22:00',
    phone: '+52 753 537 8890',
    tags: ['Supermercado', 'Económico', 'Guacamayas', 'Abarrotes'],
    rntVerified: false,
    priceRange: '$'
  },
  {
    id: 'com-mercado-cuauhtemoc',
    name: {
      es: 'Mercado Municipal Cuauhtémoc (Centro Tradicional)',
      en: 'Cuauhtémoc Municipal Market (Fresh Seafood & Local Produce)',
      zh: '夸乌特莫克市政传统综合市场 (海鲜与生鲜水果)',
      fr: 'Marché Municipal Cuauhtémoc'
    },
    category: 'gastronomy',
    mainCategory: 'donde_comer',
    subCategory: 'supermercados',
    subCategoryLabel: {
      es: 'Supermercados & Mercados',
      en: 'Supermarkets & Groceries',
      zh: '大型超市与综合市场',
      fr: 'Supermarchés & Épiceries'
    },
    description: {
      es: 'El corazón gastronómico y de abastecimiento de Lázaro Cárdenas. Venta directa de pescados y mariscos recién traídos del mar, frutas tropicales, quesos michoacanos y fondas con comida casera.',
      en: 'Traditional market famous for dock-fresh seafood, tropical produce, local artisan cheeses, and budget homemade eateries.',
      zh: '城市传统市场，直销当日抵港的新鲜海味水产、热带水果及地道平民小吃。',
      fr: 'Marché traditionnel réputé pour ses poissons frais, fruits tropicaux et cantines populaires.'
    },
    coords: { lat: 17.9615, lng: -102.1965 },
    address: 'Calle 5 de Mayo esq. Nicolás Bravo, Col. Centro',
    recommendedBusRoute: 'Ruta 1 y Ruta 2: Estación Centro',
    transitInstructions: {
      es: 'Todas las rutas de combis hacen base a 1 cuadra del mercado.',
      en: 'All transit combis terminate 1 block from the market entrance.',
      zh: '所有公交中巴均在距市场一街区处有停车总站。',
      fr: 'Toutes les combis s’arrêtent à 1 bloc de l’entrée du marché.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Domingo 06:00 - 18:00',
    tags: ['Mercado Local', 'Pescado Fresco', 'Mariscos', 'Fondas', 'Frutas'],
    rntVerified: true,
    priceRange: '$'
  },
  {
    id: 'com-sams-club',
    name: {
      es: 'Sam’s Club Lázaro Cárdenas',
      en: 'Sam’s Club Lázaro Cárdenas',
      zh: '山姆会员商店 (拉萨罗卡德纳斯店)',
      fr: 'Sam’s Club Lázaro Cárdenas'
    },
    category: 'gastronomy',
    mainCategory: 'donde_comer',
    subCategory: 'supermercados',
    subCategoryLabel: {
      es: 'Supermercados & Mercados',
      en: 'Supermarkets & Groceries',
      zh: '大型超市与批发仓储',
      fr: 'Supermarchés & Club-Entrepôt'
    },
    description: {
      es: 'Club de compras por mayoreo para abastecimiento de restaurantes, fondas, familias y tripulaciones de buques. Carnes premium, panadería gourmet y farmacia.',
      en: 'Wholesale membership club supplying local restaurants, ship crews, and families with bulk groceries and electronics.',
      zh: '大型仓储式会员制超市，为当地餐饮商户、远洋船员和市民提供大包装进口食品与生鲜。',
      fr: 'Club-entrepôt d’achats en gros approvisionnant restaurants et équipages de navires.'
    },
    coords: { lat: 17.9730, lng: -102.2070 },
    address: 'Av. Melchor Ocampo No. 500, frente a Plaza Las Américas',
    recommendedBusRoute: 'Ruta 1: Parada Sam’s Club',
    transitInstructions: {
      es: 'Ruta 1 sobre Av. Melchor Ocampo con bajada frente a la entrada de Sam’s Club.',
      en: 'Route 1 along Av. Melchor Ocampo, stop right at Sam’s Club entrance.',
      zh: '乘1号线在Sam’s Club正门口下车。',
      fr: 'Route 1, arrêt direct devant l’entrée de Sam’s Club.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Domingo 07:00 - 22:00',
    phone: '+52 753 537 5500',
    tags: ['Sam’s Club', 'Mayoreo', 'Supermercado', 'Abastecimiento Buques'],
    rntVerified: false,
    priceRange: '$$'
  },
  {
    id: 'com-mercado-hidalgo',
    name: {
      es: 'Mercado Municipal Miguel Hidalgo (Las Guacamayas)',
      en: 'Miguel Hidalgo Public Market (Las Guacamayas)',
      zh: '米格尔·伊达尔戈市政传统市场 (瓜卡马亚斯)',
      fr: 'Marché Public Miguel Hidalgo (Las Guacamayas)'
    },
    category: 'gastronomy',
    mainCategory: 'donde_comer',
    subCategory: 'supermercados',
    subCategoryLabel: {
      es: 'Supermercados & Mercados',
      en: 'Public & Fresh Markets',
      zh: '传统公立综合市场',
      fr: 'Marchés Publics Traditionnels'
    },
    description: {
      es: 'Centro popular de abasto en la mayor tenencia del municipio. Fruterías, carnicerías con corte de res fresca, venta de pescado de la presa La Villita y fondas tradicionales.',
      en: 'Vibrant local community market in Las Guacamayas offering fresh regional meats, dam freshwater fish, and fruit stalls.',
      zh: '瓜卡马亚斯主要平民蔬果生鲜集市，直销鲜切牛肉、拉维利塔水库淡水鱼及特色小吃。',
      fr: 'Marché de quartier à Las Guacamayas avec fruits frais, boucheries et poissons.'
    },
    coords: { lat: 18.0065, lng: -102.2275 },
    address: 'Av. Ciranda esq. Morelos, Col. Aníbal Ponce, Las Guacamayas',
    recommendedBusRoute: 'Ruta 1: Las Guacamayas Mercado',
    transitInstructions: {
      es: 'Ruta 1 te deja en la bahía de combis frente a la fachada del Mercado Hidalgo.',
      en: 'Route 1 terminates at the transit bay facing Mercado Hidalgo.',
      zh: '乘1号线在Mercado Hidalgo正门前的公交停靠站下车。',
      fr: 'Route 1 vous dépose devant la façade du marché Hidalgo.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Domingo 06:30 - 17:30',
    tags: ['Mercado Hidalgo', 'Guacamayas', 'Pescado de Presa', 'Frutas Frescas', 'Económico'],
    rntVerified: false,
    priceRange: '$'
  },
  {
    id: 'com-oxxo-malecon',
    name: {
      es: 'Tienda de Conveniencia OXXO Malecón del Río (24 Horas)',
      en: 'OXXO Convenience Store Waterfront (24/7)',
      zh: 'OXXO 全天候24小时便利店 (河畔滨海大道店)',
      fr: 'Supérette OXXO Malecón du Fleuve (24h/24)'
    },
    category: 'gastronomy',
    mainCategory: 'donde_comer',
    subCategory: 'supermercados',
    subCategoryLabel: {
      es: 'Supermercados & Mercados',
      en: 'Convenience Stores (24/7)',
      zh: '全天候便利超市',
      fr: 'Magasins de Proximité 24/7'
    },
    description: {
      es: 'Punto de abastecimiento continuo 24 horas: café Andatti caliente, agua embotellada, hielo en bolsa, recargas electrónicas, snacks y cajero automático accesible para trabajadores del puerto y visitantes del Malecón.',
      en: '24/7 convenience store with hot coffee, cold beverages, ice bags, phone top-ups, and ATM, ideal for port shift workers.',
      zh: '全天候24小时便利超市，供应热咖啡、冰块、饮用水、电子充值及ATM取款机。',
      fr: 'Supérette ouverte 24h/24 avec café chaud, boissons fraîches, glaçons et distributeur.'
    },
    coords: { lat: 17.9580, lng: -102.1930 },
    address: 'Av. Melchor Ocampo No. 10 esq. Malecón del Río',
    recommendedBusRoute: 'Ruta 1 y Ruta 2: Malecón',
    transitInstructions: {
      es: 'Parada en glorieta del Malecón sobre Av. Melchor Ocampo.',
      en: 'Stop at Malecón roundabout along Av. Melchor Ocampo.',
      zh: '在Melchor Ocampo大道Malecón环岛站下车。',
      fr: 'Arrêt au rond-point du Malecón sur l’avenue Melchor Ocampo.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    schedule: 'Abierto las 24 horas / 365 días del año',
    tags: ['OXXO', '24 Horas', 'Café', 'Hielo', 'Malecón', 'Cajero ATM'],
    rntVerified: false,
    priceRange: '$'
  },

  // --- RESTAURANTES Y MARISCOS ---
  {
    id: 'com-rest-marinero',
    name: {
      es: 'Restaurante Mariscos El Marinero',
      en: 'El Marinero Seafood Restaurant',
      zh: '水手海鲜特色餐厅 (El Marinero)',
      fr: 'Restaurant de Poissons El Marinero'
    },
    category: 'gastronomy',
    mainCategory: 'donde_comer',
    subCategory: 'restaurantes_mariscos',
    subCategoryLabel: {
      es: 'Restaurantes & Mariscos',
      en: 'Restaurants & Seafood',
      zh: '特色海鲜正餐',
      fr: 'Restaurants & Poissons'
    },
    description: {
      es: 'Famoso por su Huachinango a la Talla con adobo de chile guajillo, langostillas de río al mojo de ajo, pulpo a las brasas y cocteles de camarón estilo Pacífico.',
      en: 'Renowned for grilled red snapper, giant garlic river prawns, and Pacific style seafood cocktails.',
      zh: '以秘制红椒烤红鲷鱼、蒜香巨型河虾及太平洋风味鲜虾鸡尾酒闻名。',
      fr: 'Réputé pour son vivaneau grillé, gambas à l’ail et cocktails de crevettes.'
    },
    coords: { lat: 17.9635, lng: -102.1970 },
    address: 'Av. Rector Hidalgo No. 185, Col. Centro',
    recommendedBusRoute: 'Ruta 1 y Ruta 2: Parada Centro',
    transitInstructions: {
      es: 'Descenso en Av. Rector Hidalgo, a pasos de la plaza cívica.',
      en: 'Get off at Av. Rector Hidalgo, steps from civic plaza.',
      zh: '在Rector Hidalgo大道下车，紧邻市民广场。',
      fr: 'Arrêt avenue Rector Hidalgo, à quelques pas de la place civique.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Domingo 11:00 - 21:00',
    phone: '+52 753 532 1520',
    tags: ['Pescado a la Talla', 'Langostillas', 'Mariscos', 'Restaurante'],
    rntVerified: true,
    priceRange: '$$'
  },
  {
    id: 'com-palapa-pescador',
    name: {
      es: 'Mariscos La Palapa del Pescador (Playa Eréndira)',
      en: 'La Palapa del Pescador Oceanfront Seafood',
      zh: '渔夫海景凉亭海鲜馆 (埃伦迪拉海滩)',
      fr: 'La Palapa del Pescador Fruits de Mer'
    },
    category: 'gastronomy',
    mainCategory: 'donde_comer',
    subCategory: 'restaurantes_mariscos',
    subCategoryLabel: {
      es: 'Restaurantes & Mariscos',
      en: 'Restaurants & Seafood',
      zh: '特色海鲜正餐',
      fr: 'Restaurants & Poissons'
    },
    description: {
      es: 'Palapa frente al mar con vista a las olas del Pacífico. Especialidad en caldo de mariscos siete mares, filete relleno de mariscos y cocos fríos preparados.',
      en: 'Oceanfront thatched restaurant serving 7-seas seafood chowder, stuffed fish fillet, and fresh coconuts.',
      zh: '坐拥太平洋海景的茅草餐厅，招牌七海海鲜浓汤与特色酿海鲜鱼排。',
      fr: 'Restaurant paillote face à la mer servant soupe 7 mers et poissons farcis.'
    },
    coords: { lat: 17.9610, lng: -102.2290 },
    address: 'Paseo Costero Playa Eréndira s/n',
    recommendedBusRoute: 'Ruta 2: Malecón con conexión a Playa Eréndira',
    transitInstructions: {
      es: 'Ruta 2 o colectivo costero con parada en Playa Eréndira.',
      en: 'Route 2 or coastal shuttle stopping at Playa Eréndira.',
      zh: '乘2号线或海滨中巴在Playa Eréndira站下车。',
      fr: 'Route 2 ou navette côtière jusqu’à Playa Eréndira.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Domingo 10:00 - 20:00',
    phone: '+52 753 537 0910',
    tags: ['Playa Eréndira', 'Mariscos Frescos', 'Frente al Mar', 'Palapa'],
    rntVerified: true,
    priceRange: '$$'
  },
  {
    id: 'com-rest-langosta',
    name: {
      es: 'Restaurante & Bar La Langosta Portuaria',
      en: 'La Langosta Seafood & Steaks',
      zh: '港口龙虾海鲜牛排餐厅 (La Langosta)',
      fr: 'Restaurant La Langosta Portuaria'
    },
    category: 'gastronomy',
    mainCategory: 'donde_comer',
    subCategory: 'restaurantes_mariscos',
    subCategoryLabel: {
      es: 'Restaurantes & Mariscos',
      en: 'Restaurants & Seafood',
      zh: '特色海鲜正餐',
      fr: 'Restaurants & Poissons'
    },
    description: {
      es: 'Cocina gourmet de mar y tierra. Langosta termidor, cortes de carne Angus, coctelería internacional y ambiente climatizado para ejecutivos y familias.',
      en: 'Surf and turf dining featuring lobster thermidor, Angus steaks, and international cocktails.',
      zh: '高档海鲜牛排餐厅，主打法式焗龙虾、安格斯牛排与进口鸡尾酒。',
      fr: 'Restaurant surf & turf avec homard thermidor, viandes Angus et cocktails.'
    },
    coords: { lat: 17.9665, lng: -102.2020 },
    address: 'Av. Rector Hidalgo No. 340, Centro',
    recommendedBusRoute: 'Ruta 1: Parada Rector Hidalgo',
    transitInstructions: {
      es: 'Ruta 1, descender frente al hotel Portonovo.',
      en: 'Route 1, alight across from Portonovo Hotel.',
      zh: '乘1号线在Portonovo酒店对面下车。',
      fr: 'Route 1, descendre face à l’hôtel Portonovo.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Sábado 13:00 - 23:00 / Domingos 12:00 - 20:00',
    phone: '+52 753 532 4490',
    tags: ['Langosta', 'Cortes de Carne', 'Gourmet', 'Ejecutivo'],
    rntVerified: true,
    priceRange: '$$$'
  },
  {
    id: 'com-rest-timon',
    name: {
      es: 'Restaurante El Timón de la Costa',
      en: 'El Timón de la Costa Seafood & Grill',
      zh: '海滨舵手特色海鲜烧烤餐厅 (El Timón)',
      fr: 'Restaurant El Timón de la Costa'
    },
    category: 'gastronomy',
    mainCategory: 'donde_comer',
    subCategory: 'restaurantes_mariscos',
    subCategoryLabel: {
      es: 'Restaurantes & Mariscos',
      en: 'Restaurants & Seafood',
      zh: '特色海鲜餐厅',
      fr: 'Restaurants & Poissons'
    },
    description: {
      es: 'Restaurante tradicional con más de 30 años en Lázaro Cárdenas. Exquisito filete empapelado con mariscos, tiritas de pescado estilo Zihua-Costeño, aguachile verde y camarones al coco con salsa de mango.',
      en: 'Traditional dining institution known for foil-wrapped seafood fillet, lime cured fish tiritas, spicy green aguachile, and coconut shrimp.',
      zh: '拉萨罗卡德纳斯30年老字号海鲜名店，招牌锡纸锡烤海鲜鱼排、青柠腌生鱼条与芒果椰香虾。',
      fr: 'Institution locale réputée pour ses filets de poisson en papillote et crevettes à la noix de coco.'
    },
    coords: { lat: 17.9625, lng: -102.1975 },
    address: 'Av. Melchor Ocampo No. 56, Col. Centro',
    recommendedBusRoute: 'Ruta 1 y Ruta 2: Centro Histórico',
    transitInstructions: {
      es: 'Caminar 30 metros desde la parada central de Melchor Ocampo.',
      en: 'Walk 30 meters from Melchor Ocampo central bus stop.',
      zh: '从Melchor Ocampo市中心公交车站步行30米即达。',
      fr: 'Marcher 30 mètres depuis l’arrêt central de Melchor Ocampo.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Domingo 10:00 - 22:00',
    phone: '+52 753 532 0980',
    tags: ['El Timón', 'Tiritas de Pescado', 'Aguachile', 'Centro', 'Mariscos'],
    rntVerified: true,
    priceRange: '$$'
  },
  {
    id: 'com-mariscos-cangrejo',
    name: {
      es: 'Mariscos Don Cangrejo (Sabor Pacífico)',
      en: 'Don Cangrejo Pacific Seafood',
      zh: '唐·坎格雷霍太平洋海鲜餐厅 (Don Cangrejo)',
      fr: 'Fruits de Mer Don Cangrejo'
    },
    category: 'gastronomy',
    mainCategory: 'donde_comer',
    subCategory: 'restaurantes_mariscos',
    subCategoryLabel: {
      es: 'Restaurantes & Mariscos',
      en: 'Restaurants & Seafood',
      zh: '特色海鲜餐厅',
      fr: 'Restaurants & Poissons'
    },
    description: {
      es: 'Especialistas en jaiba rellena, tenazas de cangrejo al mojo de ajo, tostadas de ceviche de sierra fresco y cazuela de mariscos gratinada con queso michoacano.',
      en: 'Specialized in stuffed blue crabs, garlic crab claws, fresh mackerel ceviche, and melted cheese seafood casseroles.',
      zh: '以秘制焗填酿蓝蟹、蒜香蟹钳、新鲜青花鱼塞维切脆饼及芝士焗海鲜煲为特色。',
      fr: 'Spécialités de crabes farcis, pinces de crabe à l’ail et ceviche frais de maquereau.'
    },
    coords: { lat: 17.9660, lng: -102.2025 },
    address: 'Av. Heroica Escuela Naval Militar No. 88, Col. Segundo Sector',
    recommendedBusRoute: 'Ruta 1: Parada Escuela Naval',
    transitInstructions: {
      es: 'Ruta 1 con parada a media cuadra sobre Av. Heroica Escuela Naval.',
      en: 'Route 1, stop half a block away on Heroica Escuela Naval.',
      zh: '乘1号线在Heroica Escuela Naval大道半街区处下车。',
      fr: 'Route 1, arrêt à 50 mètres sur l’avenue Heroica Escuela Naval.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Domingo 10:30 - 20:30',
    phone: '+52 753 537 3220',
    tags: ['Jaiba Rellena', 'Cangrejo', 'Ceviche', 'Mariscos'],
    rntVerified: true,
    priceRange: '$$'
  },
  {
    id: 'com-enramada-oasis',
    name: {
      es: 'Enramada & Mariscos El Oasis (Playa Jardín)',
      en: 'El Oasis Thatched Beachfront Restaurant (Playa Jardín)',
      zh: '绿洲海滨茅草凉亭海鲜楼 (普拉亚哈尔丁)',
      fr: 'Paillote El Oasis (Playa Jardín)'
    },
    category: 'gastronomy',
    mainCategory: 'donde_comer',
    subCategory: 'restaurantes_mariscos',
    subCategoryLabel: {
      es: 'Restaurantes & Mariscos',
      en: 'Beachfront Palapas',
      zh: '海滨棕榈凉亭排档',
      fr: 'Paillotes de Plage'
    },
    description: {
      es: 'Tradicional enramada costeña de madera y palma frente al romper de las olas. Huachinango frito al mojo de ajo, cocos helados con ginebra o limón, y hamacas para reposar la comida.',
      en: 'Classic coastal beachfront open-air restaurant with hammocks, fried garlic red snapper, and ice-cold fresh coconuts.',
      zh: '坐落于海浪前沿的传统棕榈木排档，提供蒜香香酥炸红鲷鱼、新鲜冰镇椰汁与休憩吊床。',
      fr: 'Paillote traditionnelle en bord de mer avec hamacs, vivaneau frit et noix de coco fraîches.'
    },
    coords: { lat: 17.9575, lng: -102.2340 },
    address: 'Boulevard Costero s/n, Lote 12, Playa Jardín',
    recommendedBusRoute: 'Ruta 2: Colectivo Playa Jardín',
    transitInstructions: {
      es: 'Ruta 2 hasta la glorieta de playas y colectivo playero directo a la enramada.',
      en: 'Route 2 to beaches roundabout, connect to beachfront shuttle directly to El Oasis.',
      zh: '乘2号线至海滩环岛，转乘直达El Oasis排档的沿海中巴。',
      fr: 'Route 2 jusqu’au rond-point des plages puis navette directe vers la paillote.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Domingo 09:30 - 19:30',
    phone: '+52 753 112 0455',
    tags: ['Playa Jardín', 'Pescado Frito', 'Enramada', 'Frente al Mar', 'Hamacas'],
    rntVerified: true,
    priceRange: '$$'
  },
  {
    id: 'com-enramada-langosta-oro',
    name: {
      es: 'Enramada La Langosta de Oro (Playa Azul)',
      en: 'La Langosta de Oro Beachfront Seafood (Playa Azul)',
      zh: '金龙虾海滨排档 (普拉亚阿苏尔海滩)',
      fr: 'Paillote La Langosta de Oro (Playa Azul)'
    },
    category: 'gastronomy',
    mainCategory: 'donde_comer',
    subCategory: 'restaurantes_mariscos',
    subCategoryLabel: {
      es: 'Restaurantes & Mariscos',
      en: 'Beachfront Seafood',
      zh: '特色海滩排档',
      fr: 'Restaurants de Plage'
    },
    description: {
      es: 'La más famosa de Playa Azul: Pescado a la talla adobado al carbón sobre hojas de plátano, langostas de roca preparadas a la plancha, arroz costeño y tortillas recién hechas a mano en comal de leña.',
      en: 'Playa Azul’s most renowned beachfront eatery serving charcoal-grilled adobo fish on banana leaves and grilled rock lobsters.',
      zh: '普拉亚阿苏尔最负盛名的海鲜排档：芭蕉叶炭烤红椒胡椒鱼、现煎岩龙虾及木柴烙热玉米饼。',
      fr: 'La paillote la plus célèbre de Playa Azul: poisson grillé au charbon et langoustes fraîches.'
    },
    coords: { lat: 17.9825, lng: -102.3525 },
    address: 'Av. Venustiano Carranza s/n frente a la playa, Playa Azul',
    recommendedBusRoute: 'Ruta 3: Lázaro Cárdenas - Playa Azul',
    transitInstructions: {
      es: 'Ruta 3 hasta base Playa Azul, caminar 1 cuadra hacia el malecón playero.',
      en: 'Route 3 to Playa Azul main terminal, walk 1 block toward beach strip.',
      zh: '乘3号线至Playa Azul终点站，向海滨大道步行一街区。',
      fr: 'Route 3 jusqu’au terminus de Playa Azul, marcher 100 mètres vers la plage.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Domingo 09:00 - 20:00',
    phone: '+52 753 535 0220',
    tags: ['Playa Azul', 'Pescado a la Talla', 'Langosta', 'Tortillas a Mano', 'RNT Verificado'],
    rntVerified: true,
    priceRange: '$$'
  },

  // --- COMIDA RÁPIDA ---
  {
    id: 'com-dominos-pizza',
    name: {
      es: 'Domino’s Pizza Lázaro Cárdenas',
      en: 'Domino’s Pizza Lázaro Cárdenas',
      zh: '达美乐比萨 (拉萨罗卡德纳斯店)',
      fr: 'Domino’s Pizza Lázaro Cárdenas'
    },
    category: 'gastronomy',
    mainCategory: 'donde_comer',
    subCategory: 'comida_rapida',
    subCategoryLabel: {
      es: 'Comida Rápida',
      en: 'Fast Food',
      zh: '快餐轻食',
      fr: 'Restauration Rapide'
    },
    description: {
      es: 'Pizzas recién horneadas con masa artesanal, alitas de pollo, orilla rellena de queso y servicio rápido en comedor o para llevar.',
      en: 'Fast, fresh pizza delivery and dine-in with wings and stuffed cheesy crust.',
      zh: '新鲜现烤披萨、烤鸡翅、芝士夹心卷边，提供堂食与外送服务。',
      fr: 'Pizzas fraîches cuites au four, ailes de poulet et service rapide sur place ou à emporter.'
    },
    coords: { lat: 17.9650, lng: -102.2005 },
    address: 'Av. Melchor Ocampo No. 312, Col. Segundo Sector',
    recommendedBusRoute: 'Ruta 1 y Ruta 2: Melchor Ocampo',
    transitInstructions: {
      es: 'Bajar frente a la sucursal sobre Av. Melchor Ocampo.',
      en: 'Alight directly in front on Av. Melchor Ocampo.',
      zh: '在Melchor Ocampo大道分店正门口下车。',
      fr: 'Descendre directement devant sur l’avenue Melchor Ocampo.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Domingo 11:00 - 23:00',
    phone: '+52 753 537 9000',
    tags: ['Pizza', 'Comida Rápida', 'Alitas', 'Para Llevar'],
    rntVerified: false,
    priceRange: '$'
  },
  {
    id: 'com-little-caesars',
    name: {
      es: 'Little Caesars Pizza (Plaza Las Américas)',
      en: 'Little Caesars Pizza (Plaza Las Américas)',
      zh: '小凯撒比萨 Hot-N-Ready',
      fr: 'Little Caesars Pizza'
    },
    category: 'gastronomy',
    mainCategory: 'donde_comer',
    subCategory: 'comida_rapida',
    subCategoryLabel: {
      es: 'Comida Rápida',
      en: 'Fast Food',
      zh: '快餐轻食',
      fr: 'Restauration Rapide'
    },
    description: {
      es: 'Pizzas calientes Hot-N-Ready al instante, de pepperoni y queso, pan de ajo Crazy Bread y combos rápidos a precio muy económico.',
      en: 'Instant Hot-N-Ready pepperoni and cheese pizzas and garlic Crazy Bread at budget prices.',
      zh: '即买即走的Hot-N-Ready经典意式香肠比萨与蒜香面包条，经济实惠。',
      fr: 'Pizzas prêtes instantanément à emporter et Crazy Bread à prix très doux.'
    },
    coords: { lat: 17.9735, lng: -102.2075 },
    address: 'Av. Melchor Ocampo No. 515, Exterior Plaza Las Américas',
    recommendedBusRoute: 'Ruta 1: Plaza Las Américas',
    transitInstructions: {
      es: 'Parada Plaza Las Américas, ubicado en el área exterior de comida rápida.',
      en: 'Plaza Las Américas stop, situated in the outer fast-food strip.',
      zh: 'Plaza Las Américas站下车，位于商场外围快餐区。',
      fr: 'Arrêt Plaza Las Américas, situé dans la zone extérieure de restauration.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Domingo 10:30 - 22:30',
    phone: '+52 753 537 4500',
    tags: ['Pizza', 'Económico', 'Hot-N-Ready', 'Rápido'],
    rntVerified: false,
    priceRange: '$'
  },
  {
    id: 'com-burger-king',
    name: {
      es: 'Burger King Lázaro Cárdenas',
      en: 'Burger King Lázaro Cárdenas',
      zh: '汉堡王 (拉萨罗卡德纳斯店)',
      fr: 'Burger King Lázaro Cárdenas'
    },
    category: 'gastronomy',
    mainCategory: 'donde_comer',
    subCategory: 'comida_rapida',
    subCategoryLabel: {
      es: 'Comida Rápida',
      en: 'Fast Food',
      zh: '快餐轻食',
      fr: 'Restauration Rapide'
    },
    description: {
      es: 'Hamburguesas a la parrilla Whopper, papas a la francesa, nuggets de pollo y helados en sala climatizada con área infantil y Auto-King.',
      en: 'Flame-grilled burgers, crispy fries, chicken tenders, drive-thru, and kids play area.',
      zh: '招牌火烤皇堡、香脆薯条、麦乐鸡块，设儿童游乐区与汽车穿梭餐厅。',
      fr: 'Hamburgers grillés à la flamme Whopper, frites et service au volant.'
    },
    coords: { lat: 17.9690, lng: -102.2040 },
    address: 'Av. Melchor Ocampo No. 390 esq. Lucio Blanco',
    recommendedBusRoute: 'Ruta 1: Melchor Ocampo',
    transitInstructions: {
      es: 'Ruta 1, parada directa frente al tótem de Burger King.',
      en: 'Route 1, direct stop in front of Burger King totem sign.',
      zh: '乘1号线在汉堡王立标正下方下车。',
      fr: 'Route 1, arrêt direct devant l’enseigne Burger King.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Domingo 08:00 - 23:00 (Auto-King hasta las 00:00)',
    phone: '+52 753 537 3340',
    tags: ['Hamburguesas', 'Comida Rápida', 'AutoKing', 'Whopper'],
    rntVerified: false,
    priceRange: '$'
  },
  {
    id: 'com-pollo-feliz',
    name: {
      es: 'Pollo Feliz (Sucursal Centro & Noyola)',
      en: 'Pollo Feliz (Charcoal-Grilled Chicken)',
      zh: '快乐烤鸡 (炭火烤鸡专门店)',
      fr: 'Pollo Feliz Poulet Grillé au Charbon'
    },
    category: 'gastronomy',
    mainCategory: 'donde_comer',
    subCategory: 'comida_rapida',
    subCategoryLabel: {
      es: 'Comida Rápida',
      en: 'Fast Food',
      zh: '快餐轻食',
      fr: 'Restauration Rapide'
    },
    description: {
      es: 'Tradicional pollo asado al carbón marinado con especias secretas, acompañado de arroz rojo, frijoles charros, tortillas calientes y salsas caseras.',
      en: 'Charcoal grilled marinated whole chickens served with Mexican rice, beans, fresh tortillas, and hot salsas.',
      zh: '墨西哥传统炭火秘料烤鸡，配红米饭、查罗豆汤、现烙玉米饼与自制辣酱。',
      fr: 'Poulet mariné grillé au charbon de bois avec riz, haricots et tortillas chaudes.'
    },
    coords: { lat: 17.9625, lng: -102.1985 },
    address: 'Av. Melchor Ocampo No. 150, Centro',
    recommendedBusRoute: 'Ruta 1 y Ruta 2: Centro',
    transitInstructions: {
      es: 'Bajar en Av. Melchor Ocampo entre Hidalgo y Morelos.',
      en: 'Get off at Melchor Ocampo between Hidalgo and Morelos.',
      zh: '在Hidalgo与Morelos之间的Melchor Ocampo路段下车。',
      fr: 'Descendre avenue Melchor Ocampo entre Hidalgo et Morelos.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Domingo 09:30 - 19:30',
    phone: '+52 753 532 1199',
    tags: ['Pollo Asado', 'Comida Rápida', 'Tortillas', 'Para Llevar'],
    rntVerified: false,
    priceRange: '$'
  },
  {
    id: 'com-subway-melchor',
    name: {
      es: 'Subway Lázaro Cárdenas (Plaza Las Américas / Centro)',
      en: 'Subway Fresh Subs & Salads',
      zh: '赛百味新鲜潜水艇三明治 (美洲商场/市中心)',
      fr: 'Subway Sandwiches & Salades'
    },
    category: 'gastronomy',
    mainCategory: 'donde_comer',
    subCategory: 'comida_rapida',
    subCategoryLabel: {
      es: 'Comida Rápida',
      en: 'Fast Food',
      zh: '快餐轻食',
      fr: 'Restauration Rapide'
    },
    description: {
      es: 'Submarinos personalizados de 15 y 30 cm horneados al momento con pan de orégano parmesano o trigo, pechuga de pavo, atún, vegetales frescos, galletas con chispas y café.',
      en: 'Freshly baked subs customized with cold cuts, fresh greens, sauces, and fresh baked cookies.',
      zh: '现烤现选15厘米与30厘米潜水艇三明治，配自选新鲜果蔬、特调酱汁与曲奇饼干。',
      fr: 'Sandwiches personnalisés sur pain cuit sur place avec légumes frais et sauces.'
    },
    coords: { lat: 17.9738, lng: -102.2078 },
    address: 'Av. Melchor Ocampo No. 515, Área de Comida Plaza Las Américas',
    recommendedBusRoute: 'Ruta 1: Parada Plaza Las Américas',
    transitInstructions: {
      es: 'Ruta 1 hasta Plaza Las Américas, ubicado en el food court climatizado.',
      en: 'Route 1 to Plaza Las Américas, located in the air-conditioned food court.',
      zh: '乘1号线至Plaza Las Américas，位于冷气美食广场内。',
      fr: 'Route 1 jusqu’à Plaza Las Américas, situé dans l’aire de restauration.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Domingo 09:00 - 22:00',
    phone: '+52 753 537 6220',
    tags: ['Subway', 'Sandwich', 'Saludable', 'Comida Rápida'],
    rntVerified: false,
    priceRange: '$'
  },
  {
    id: 'com-pizza-hut',
    name: {
      es: 'Pizza Hut Lázaro Cárdenas',
      en: 'Pizza Hut Lázaro Cárdenas',
      zh: '必胜客 (拉萨罗卡德纳斯餐厅)',
      fr: 'Pizza Hut Lázaro Cárdenas'
    },
    category: 'gastronomy',
    mainCategory: 'donde_comer',
    subCategory: 'comida_rapida',
    subCategoryLabel: {
      es: 'Comida Rápida',
      en: 'Fast Food',
      zh: '快餐轻食',
      fr: 'Restauration Rapide'
    },
    description: {
      es: 'Pizzas estilo Pan Pizza de masa gruesa y dorada, orilla rellena Cheesy Pop, pastas horneadas, palitos de pan y alitas marinadas con entrega a domicilio en todo el puerto.',
      en: 'Pan Pizzas, stuffed cheesy crusts, wings, and fast delivery across Lázaro Cárdenas.',
      zh: '经典铁盘厚底金黄披萨、芝心卷边披萨、焗烤意面及香脆鸡翅，提供全市配送。',
      fr: 'Pan pizzas à pâte épaisse, croûte farcie au fromage et livraison rapide.'
    },
    coords: { lat: 17.9675, lng: -102.2030 },
    address: 'Av. Melchor Ocampo No. 340, Col. Segundo Sector',
    recommendedBusRoute: 'Ruta 1: Parada Melchor Ocampo',
    transitInstructions: {
      es: 'Ruta 1 con descenso directo sobre Av. Melchor Ocampo.',
      en: 'Route 1, direct stop along Av. Melchor Ocampo.',
      zh: '乘1号线在Melchor Ocampo大道直接下车。',
      fr: 'Route 1, arrêt direct sur l’avenue Melchor Ocampo.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Domingo 11:00 - 23:00',
    phone: '+52 753 537 8100',
    tags: ['Pizza Hut', 'Pan Pizza', 'Cheesy Pop', 'Comida Rápida'],
    rntVerified: false,
    priceRange: '$$'
  },
  {
    id: 'com-kfc-lc',
    name: {
      es: 'KFC Kentucky Fried Chicken Lázaro Cárdenas',
      en: 'KFC Kentucky Fried Chicken',
      zh: '肯德基 (拉萨罗卡德纳斯餐厅)',
      fr: 'KFC Kentucky Fried Chicken'
    },
    category: 'gastronomy',
    mainCategory: 'donde_comer',
    subCategory: 'comida_rapida',
    subCategoryLabel: {
      es: 'Comida Rápida',
      en: 'Fast Food',
      zh: '快餐轻食',
      fr: 'Restauration Rapide'
    },
    description: {
      es: 'Pollo frito receta secreta crujiente y original con 11 hierbas y especias, puré de papa con gravy especial, ensalada de col fresca, bísquets calientes con miel y tiras Ke-Tiras.',
      en: 'Original recipe and extra crispy fried chicken with mashed potatoes, gravy, coleslaw, and honey biscuits.',
      zh: '肯德基经典原味与香辣吮指原味鸡、秘制土豆泥、清脆卷心菜沙拉及现烤蜂蜜比司吉。',
      fr: 'Poulet frit recette originale, purée de pommes de terre avec sauce gravy et biscuits au miel.'
    },
    coords: { lat: 17.9685, lng: -102.2038 },
    address: 'Av. Melchor Ocampo No. 380, Col. Segundo Sector',
    recommendedBusRoute: 'Ruta 1: Parada Melchor Ocampo',
    transitInstructions: {
      es: 'Ruta 1 te deja justo frente a la sucursal de KFC.',
      en: 'Route 1 drops right in front of KFC restaurant.',
      zh: '乘1号线直接在肯德基门前停靠。',
      fr: 'Route 1 vous dépose juste devant le restaurant KFC.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Domingo 10:00 - 22:30',
    phone: '+52 753 537 9400',
    tags: ['KFC', 'Pollo Frito', 'Puré', 'Comida Rápida', 'Familiar'],
    rntVerified: false,
    priceRange: '$'
  },
  {
    id: 'com-tortas-chavo',
    name: {
      es: 'Tortas Gigantes El Chavo (Sabor Urbano Tradicional)',
      en: 'El Chavo Giant Mexican Tortas',
      zh: '查沃巨无霸热压墨西哥三明治 (老街传统名吃)',
      fr: 'Tortas Géantes El Chavo'
    },
    category: 'gastronomy',
    mainCategory: 'donde_comer',
    subCategory: 'comida_rapida',
    subCategoryLabel: {
      es: 'Comida Rápida',
      en: 'Fast Casual Street Subs',
      zh: '地方特色快餐',
      fr: 'Snack Mexicain Rapide'
    },
    description: {
      es: 'Tortería emblemática del centro de Lázaro Cárdenas: tortas gigantes en telera caliente con milanesa de res, pierna adobada, quesillo oaxaca, aguacate, jitomate y chiles en vinagre caseros.',
      en: 'Famous local sandwich spot for hot pressed giant tortas with breaded beef, spiced pork leg, melted Oaxaca cheese, and avocado.',
      zh: '拉萨罗卡德纳斯市中心标志性热压巨型三明治：金黄炸牛排、特制卤猪腿肉与瓦哈卡浓拉丝芝士。',
      fr: 'Sandwicherie locale emblématique servant d’immenses tortas chaudes à la milanaise et avocat.'
    },
    coords: { lat: 17.9635, lng: -102.1982 },
    address: 'Av. Lázaro Cárdenas No. 115, Col. Centro',
    recommendedBusRoute: 'Ruta 1 y Ruta 2: Centro',
    transitInstructions: {
      es: 'Descenso en Av. Lázaro Cárdenas esq. Melchor Ocampo, caminar 40 metros.',
      en: 'Get off at Av. Lázaro Cárdenas and Melchor Ocampo, walk 40 meters.',
      zh: '在Lázaro Cárdenas大道与Melchor Ocampo交叉口下车，步行40米。',
      fr: 'Descendre avenue Lázaro Cárdenas angle Melchor Ocampo, marcher 40m.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Domingo 08:30 - 23:00',
    phone: '+52 753 532 4118',
    tags: ['Tortas Gigantes', 'Milanesa', 'Pierna', 'Centro', 'Rápido', 'Económico'],
    rntVerified: false,
    priceRange: '$'
  },

  // --- FONDAS Y ANTOJITOS TRADICIONALES ---
  {
    id: 'com-fonda-dona-mary',
    name: {
      es: 'Fonda Tradicional Doña Mary (Comida Corrida)',
      en: 'Doña Mary Traditional Homestyle Eatery',
      zh: '玛丽大妈传统家庭风味小馆 (米却肯特色套餐)',
      fr: 'Fonda Familiale Doña Mary'
    },
    category: 'gastronomy',
    mainCategory: 'donde_comer',
    subCategory: 'fondas_antojitos',
    subCategoryLabel: {
      es: 'Fondas & Antojitos Tradicionales',
      en: 'Homestyle Fondas & Street Food',
      zh: '地道风味小馆与传统小吃',
      fr: 'Cantines Populaires & Encas'
    },
    description: {
      es: 'Auténtica sazón michoacana: Aporreadillo con cecina y huevo en salsa roja, morisqueta con espinazo de cerdo, caldo de res con verduras y aguas frescas de fruta natural.',
      en: 'Hearty local Michoacán cuisine featuring aporreadillo (shredded beef & eggs in salsa), morisqueta rice bowls, and fresh fruit waters.',
      zh: '正宗米却肯地道家常菜：特味辣汁碎牛肉炒蛋、米却肯猪肉拌饭及鲜榨热带果汁。',
      fr: 'Cuisine authentique du Michoacán: aporreadillo de bœuf, morisqueta et jus de fruits frais.'
    },
    coords: { lat: 17.9620, lng: -102.1955 },
    address: 'Calle Corregidora No. 45, Col. Centro (a espaldas del Mercado)',
    recommendedBusRoute: 'Ruta 1 y Ruta 2: Centro',
    transitInstructions: {
      es: 'Descenso en parada Mercado Centro, caminar media cuadra por Corregidora.',
      en: 'Stop at Mercado Centro, walk half a block along Corregidora street.',
      zh: '在中央市场站下车，沿Corregidora街步行半街区即到。',
      fr: 'Arrêt Mercado Centro, marcher 50 mètres rue Corregidora.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Sábado 07:30 - 17:00 (Desayunos y comidas corridas)',
    phone: '+52 753 118 7320',
    tags: ['Aporreadillo', 'Morisqueta', 'Comida Corrida', 'Fonda', 'Económico'],
    rntVerified: true,
    priceRange: '$'
  },
  {
    id: 'com-cenaduria-tradicion',
    name: {
      es: 'Cenaduría La Tradición Michoacana',
      en: 'La Tradición Michoacana Evening Diner',
      zh: '传统米却肯风味夜宵小吃店 (恩奇拉达与传统玉米粽)',
      fr: 'Cenaduría La Tradición Michoacana'
    },
    category: 'gastronomy',
    mainCategory: 'donde_comer',
    subCategory: 'fondas_antojitos',
    subCategoryLabel: {
      es: 'Fondas & Antojitos Tradicionales',
      en: 'Homestyle Fondas & Street Food',
      zh: '地道风味小馆与传统小吃',
      fr: 'Cantines Populaires & Encas'
    },
    description: {
      es: 'Especialidad nocturna: Enchiladas placeras michoacanas con pollo y cecina frita, uchepos de elote tierno con crema, corundas con salsa de carne y pozole verde y rojo.',
      en: 'Famous night dinner for Michoacán street enchiladas with fried chicken, sweet corn uchepos, and pozole hominy soup.',
      zh: '米却肯知名夜市餐馆：农夫辣酱鸡肉卷饼、香甜嫩玉米粽（Uchepos）与传统玉米肉汤。',
      fr: 'Spécialités du soir: enchiladas du Michoacán avec poulet frit, uchepos de maïs et pozole.'
    },
    coords: { lat: 17.9645, lng: -102.1980 },
    address: 'Av. Venustiano Carranza No. 60, Col. Centro',
    recommendedBusRoute: 'Ruta 1 y Ruta 2: Centro',
    transitInstructions: {
      es: 'Bajar en el parque central y caminar 100 metros hacia calle Carranza.',
      en: 'Stop at central park, walk 100 meters towards Carranza street.',
      zh: '在中央公园下车，朝Carranza街步行100米。',
      fr: 'Descendre au parc central et marcher 100m vers la rue Carranza.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Domingo 18:00 - 00:30 (Cenas y antojitos)',
    phone: '+52 753 532 5560',
    tags: ['Enchiladas Michoacanas', 'Corundas', 'Uchepos', 'Pozole', 'Cenaduría'],
    rntVerified: true,
    priceRange: '$'
  },
  {
    id: 'com-taqueria-paisa',
    name: {
      es: 'Taquería El Paisa (Tacos al Pastor y Asada)',
      en: 'Taquería El Paisa (Al Pastor & Carne Asada)',
      zh: '老乡塔克店 (传统转炉烤猪肉与炭烤牛肉卷饼)',
      fr: 'Taquería El Paisa'
    },
    category: 'gastronomy',
    mainCategory: 'donde_comer',
    subCategory: 'fondas_antojitos',
    subCategoryLabel: {
      es: 'Fondas & Antojitos Tradicionales',
      en: 'Homestyle Fondas & Street Food',
      zh: '地道风味小馆与传统小吃',
      fr: 'Cantines Populaires & Encas'
    },
    description: {
      es: 'Los tacos al pastor más populares del puerto, con piña asada, cebollitas cambray, gringas con queso oaxaca derretido y gran barra de salsas taqueras.',
      en: 'Local favorite for spit-roasted al pastor pork tacos, melted cheese gringas, and spicy salsa bar.',
      zh: '港口人气烤肉塔克店，供应烤菠萝猪肉卷饼、特浓芝士烤饼与多种自制辣椒酱。',
      fr: 'Les tacos al pastor les plus populaires de la ville, avec ananas rôti et sauces piquantes.'
    },
    coords: { lat: 17.9630, lng: -102.1990 },
    address: 'Av. Melchor Ocampo No. 210 frente a Plaza Cívica',
    recommendedBusRoute: 'Ruta 1 y Ruta 2: Centro Plaza',
    transitInstructions: {
      es: 'Parada en Plaza Cívica sobre Melchor Ocampo.',
      en: 'Stop at Civic Plaza along Melchor Ocampo.',
      zh: '在Melchor Ocampo大道的市政广场站下车。',
      fr: 'Arrêt sur la place civique le long de l’avenue Melchor Ocampo.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Domingo 17:00 - 02:00 (Servicio nocturno)',
    phone: '+52 753 532 9980',
    tags: ['Tacos al Pastor', 'Gringas', 'Antojitos', 'Nocturno'],
    rntVerified: false,
    priceRange: '$'
  },
  {
    id: 'com-carnitas-quiroga',
    name: {
      es: 'Carnitas Los Michoacanos (Estilo Quiroga)',
      en: 'Los Michoacanos Traditional Pork Carnitas',
      zh: '米却肯传统铜锅炖猪肉卷饼 (基罗加古法秘制)',
      fr: 'Carnitas Los Michoacanos Style Quiroga'
    },
    category: 'gastronomy',
    mainCategory: 'donde_comer',
    subCategory: 'fondas_antojitos',
    subCategoryLabel: {
      es: 'Fondas & Antojitos Tradicionales',
      en: 'Homestyle Fondas & Street Food',
      zh: '地道风味小馆与传统小吃',
      fr: 'Cantines Populaires & Encas'
    },
    description: {
      es: 'Carnitas cocinadas lentamente en cazo de cobre con manteca pura, maciza suave, costilla, cuerito, buche y chicharrón crujiente con cebolla morada curtida.',
      en: 'Authentic Michoacán slow-cooked pork carnitas made in copper cauldrons with crispy chicharrón.',
      zh: '选用传统纯铜大锅慢火焖炸的米却肯猪肉（Carnitas），配香脆炸猪皮与腌紫洋葱。',
      fr: 'Véritables carnitas de porc mijotées au chaudron de cuivre avec chicharrón croustillant.'
    },
    coords: { lat: 17.9670, lng: -102.2030 },
    address: 'Av. Melchor Ocampo No. 410, frente a Soriana',
    recommendedBusRoute: 'Ruta 1: Parada Soriana Melchor Ocampo',
    transitInstructions: {
      es: 'Ruta 1, bajar frente al centro comercial Soriana.',
      en: 'Route 1, stop across from Soriana shopping center.',
      zh: '乘1号线在Soriana商业中心对面下车。',
      fr: 'Route 1, descendre face au centre commercial Soriana.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    schedule: 'Miércoles a Domingo 08:30 - 16:30',
    phone: '+52 753 103 4410',
    tags: ['Carnitas', 'Michoacán', 'Chicharrón', 'Tacos'],
    rntVerified: true,
    priceRange: '$'
  },
  {
    id: 'com-fondas-mercado-18',
    name: {
      es: 'Fondas Tradicionales del Mercado Cuauhtémoc (Pasillo Gastronómico)',
      en: 'Cuauhtémoc Market Traditional Food Aisle',
      zh: '夸乌特莫克中央传统市场美食长廊 (地道米却肯快餐)',
      fr: 'Cantines Populaires du Marché Cuauhtémoc'
    },
    category: 'gastronomy',
    mainCategory: 'donde_comer',
    subCategory: 'fondas_antojitos',
    subCategoryLabel: {
      es: 'Fondas & Antojitos Tradicionales',
      en: 'Market Food Stalls',
      zh: '传统市集风味排档',
      fr: 'Cantines de Marché'
    },
    description: {
      es: 'El auténtico sabor del puerto: Caldo de pescado fresco de la presa, morisqueta con costilla de cerdo en adobo, bistec ranchero y aguas frescas de jamaica y horchata a precios populares.',
      en: 'Hearty authentic dock eats: fresh fish broth, morisqueta rice bowls with pork rib adobo, ranchero beef steaks, and cold aguas frescas.',
      zh: '港口最地道烟火气：鲜鱼浓汤、米却肯辣酱排骨拌米饭、牧场煎牛排及自制洛神花果饮。',
      fr: 'Cuisine populaire généreuse: bouillon de poisson frais, morisqueta et viandes rancheras.'
    },
    coords: { lat: 17.9618, lng: -102.1968 },
    address: 'Interior Mercado Municipal Cuauhtémoc, Locales 15 al 24, Centro',
    recommendedBusRoute: 'Ruta 1 y Ruta 2: Mercado Centro',
    transitInstructions: {
      es: 'Descenso en parada Mercado Centro, ingresar por el pasillo central de fondas.',
      en: 'Stop at Mercado Centro, enter via the main culinary corridor.',
      zh: '在中央市场站下车，从中央美食廊道步入。',
      fr: 'Arrêt Mercado Centro, entrer par l’allée centrale des restaurants.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Domingo 06:30 - 17:00',
    tags: ['Mercado Cuauhtémoc', 'Comida Corrida', 'Caldo de Pescado', 'Morisqueta', 'Económico'],
    rntVerified: true,
    priceRange: '$'
  },
  {
    id: 'com-cenaduria-chole',
    name: {
      es: 'Cenaduría Doña Chole (Antojitos y Sopes Costeños)',
      en: 'Doña Chole Traditional Evening Eatery',
      zh: '乔莱大妈传统夜市特色小吃馆 (滨海厚玉米饼与科伦达粽)',
      fr: 'Cenaduría Doña Chole'
    },
    category: 'gastronomy',
    mainCategory: 'donde_comer',
    subCategory: 'fondas_antojitos',
    subCategoryLabel: {
      es: 'Fondas & Antojitos Tradicionales',
      en: 'Night Diners & Street Eats',
      zh: '地道风味小吃小馆',
      fr: 'Cantines du Soir & Encas'
    },
    description: {
      es: 'Favorito nocturno de las familias de Lázaro Cárdenas: Sopes pellizcados con frijoles y cecina, tostadas de pata, pozole batido estilo costa y corundas calientes con crema de rancho.',
      en: 'Nightly family favorite for thick hand-pinched sopes, shredded beef, hot corundas tamales, and coastal style pozole hominy soup.',
      zh: '当地家庭钟爱的夜间小馆：手捏厚底豆泥牛排玉米饼、香脆猪蹄脆皮卷饼及热腾腾的米却肯农家玉米粽。',
      fr: 'Favori des familles le soir: sopes faits main, corundas chaudes et pozole côtier.'
    },
    coords: { lat: 17.9640, lng: -102.1960 },
    address: 'Calle 8 de Mayo No. 22, Col. Centro',
    recommendedBusRoute: 'Ruta 1 y Ruta 2: Centro',
    transitInstructions: {
      es: 'Ruta 1 te deja a 1 cuadra en calle 8 de Mayo.',
      en: 'Route 1 drops 1 block away on 8 de Mayo street.',
      zh: '乘1号线在距8 de Mayo街仅一街区处下车。',
      fr: 'Route 1 vous dépose à 1 bloc rue 8 de Mayo.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Domingo 18:30 - 00:30',
    phone: '+52 753 102 7890',
    tags: ['Sopes Costeños', 'Corundas', 'Pozole', 'Cenaduría', 'Cena Tradicional'],
    rntVerified: false,
    priceRange: '$'
  },
  {
    id: 'com-taqueria-tarascos',
    name: {
      es: 'Taquería Los Tarascos (Tacos al Carbón y Arrachera)',
      en: 'Los Tarascos Charcoal Grilled Tacos',
      zh: '塔拉斯科炭火烤肉塔克店 (优质安格斯牛排与牛眼肉卷饼)',
      fr: 'Taquería Los Tarascos'
    },
    category: 'gastronomy',
    mainCategory: 'donde_comer',
    subCategory: 'fondas_antojitos',
    subCategoryLabel: {
      es: 'Fondas & Antojitos Tradicionales',
      en: 'Taco Stands & Grills',
      zh: '炭火烧烤塔克专营店',
      fr: 'Taquería & Grillades'
    },
    description: {
      es: 'Tacos de arrachera marinada al carbón de mezquite, bistec, costilla, quesos fundidos en cazuela de barro, papas rellenas asadas y aguas de horchata artesanal.',
      en: 'Mesquite charcoal grilled skirt steak tacos, melted cheese clay pots, and loaded baked potatoes.',
      zh: '以牧豆木炭火慢烤特选牛里脊、牛肋条、陶罐热熔拉丝干酪及芝士焗土豆为招牌。',
      fr: 'Tacos de bœuf grillé au charbon de bois, fromage fondu et pommes de terre garnies.'
    },
    coords: { lat: 17.9655, lng: -102.2015 },
    address: 'Av. Melchor Ocampo No. 280, Col. Segundo Sector',
    recommendedBusRoute: 'Ruta 1: Parada Melchor Ocampo Segundo Sector',
    transitInstructions: {
      es: 'Ruta 1 te deja frente a la taquería sobre Av. Melchor Ocampo.',
      en: 'Route 1 drops right in front of the taquería along Av. Melchor Ocampo.',
      zh: '乘1号线在Melchor Ocampo大道的烤肉店正门下车。',
      fr: 'Route 1 vous dépose devant la taquería sur l’avenue Melchor Ocampo.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Domingo 17:30 - 01:30',
    phone: '+52 753 537 3880',
    tags: ['Tacos Arrachera', 'Al Carbón', 'Queso Fundido', 'Nocturno'],
    rntVerified: false,
    priceRange: '$$'
  },
  {
    id: 'com-birrieria-costena',
    name: {
      es: 'Birriería y Tacos El Chivo Costeño (Las Guacamayas)',
      en: 'El Chivo Costeño Coastal Goat Birria',
      zh: '沿海香浓慢炖山羊汤与烤羊肉塔克馆 (瓜卡马亚斯)',
      fr: 'Birriería El Chivo Costeño'
    },
    category: 'gastronomy',
    mainCategory: 'donde_comer',
    subCategory: 'fondas_antojitos',
    subCategoryLabel: {
      es: 'Fondas & Antojitos Tradicionales',
      en: 'Homestyle Birrierías',
      zh: '传统慢炖肉食名店',
      fr: 'Cantines Populaires'
    },
    description: {
      es: 'Birria tradicional de chivo tierno tatemado en pencas de maguey con especias costeñas. Consomé bien caliente con cilantro y cebolla picada, quesabirrias doradas y tortillas de comal.',
      en: 'Tender roasted goat birria slow cooked in maguey leaves, rich hot consommé broth, crispy quesabirrias, and fresh handmade tortillas.',
      zh: '龙舌兰叶包覆慢烤鲜嫩小山羊、特制原汁香辣羊汤、金黄酥脆拉丝羊肉煎饼（Quesabirrias）。',
      fr: 'Birria traditionnelle de chèvre mijotée dans des feuilles d’agave avec consommé brûlant.'
    },
    coords: { lat: 18.0075, lng: -102.2270 },
    address: 'Av. Francisco I. Madero No. 45, Tenencia de Las Guacamayas',
    recommendedBusRoute: 'Ruta 1: Las Guacamayas',
    transitInstructions: {
      es: 'Ruta 1 hasta Av. Madero en Las Guacamayas, descenso a unos pasos de la birriería.',
      en: 'Route 1 to Av. Madero in Las Guacamayas, alight steps from the restaurant.',
      zh: '乘1号线前往Las Guacamayas的Madero大道，步行几步即到。',
      fr: 'Route 1 jusqu’à l’avenue Madero à Las Guacamayas, arrêt à quelques pas.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Domingo 07:30 - 15:30 (Especialidad matutina)',
    phone: '+52 753 115 6740',
    tags: ['Birria de Chivo', 'Consomé', 'Quesabirrias', 'Guacamayas', 'Desayunos'],
    rntVerified: false,
    priceRange: '$'
  },

  // --- CAFETERÍAS Y PANADERÍAS ---
  {
    id: 'com-italian-coffee',
    name: {
      es: 'The Italian Coffee Company (Plaza Las Américas)',
      en: 'The Italian Coffee Company (Plaza Las Américas)',
      zh: '意式咖啡烘焙馆 (美洲商场店)',
      fr: 'The Italian Coffee Company'
    },
    category: 'gastronomy',
    mainCategory: 'donde_comer',
    subCategory: 'cafeterias_panaderias',
    subCategoryLabel: {
      es: 'Cafeterías & Panaderías',
      en: 'Cafes & Bakeries',
      zh: '咖啡馆与烘焙坊',
      fr: 'Cafés & Boulangeries'
    },
    description: {
      es: 'Café gourmet de grano mexicano, frappés, capuchinos, repostería fina, chapatas calientes y conexión Wi-Fi de alta velocidad para trabajo y reuniones.',
      en: 'Cozy café offering Mexican espresso, frappés, pastries, and high-speed Wi-Fi for remote work.',
      zh: '供应墨西哥精品咖啡豆现磨浓缩、冰沙、精致西点及高速Wi-Fi办公环境。',
      fr: 'Café convivial servant espressos mexicains, pâtisseries et Wi-Fi haut débit.'
    },
    coords: { lat: 17.9745, lng: -102.2085 },
    address: 'Interior Plaza Las Américas local 14',
    recommendedBusRoute: 'Ruta 1: Plaza Las Américas',
    transitInstructions: {
      es: 'Ruta 1 te deja en la entrada principal de la plaza.',
      en: 'Route 1 drops at the main shopping mall entrance.',
      zh: '乘1号线在商场主入口下车。',
      fr: 'Route 1 vous dépose à l’entrée principale du centre commercial.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Domingo 08:00 - 22:00',
    phone: '+52 753 537 6620',
    tags: ['Café', 'Frappé', 'Wi-Fi', 'Repostería', 'Reuniones'],
    rntVerified: false,
    priceRange: '$$'
  },
  {
    id: 'com-cafe-tierra-caliente',
    name: {
      es: 'Café & Panadería Tierra Caliente (Sazón Regional)',
      en: 'Tierra Caliente Regional Artisan Café',
      zh: '热土风味咖啡馆与手工烘焙坊 (Tierra Caliente)',
      fr: 'Café Régional Tierra Caliente'
    },
    category: 'gastronomy',
    mainCategory: 'donde_comer',
    subCategory: 'cafeterias_panaderias',
    subCategoryLabel: {
      es: 'Cafeterías & Panaderías',
      en: 'Regional Artisan Cafes',
      zh: '特色咖啡与烘焙坊',
      fr: 'Cafés Artisanaux'
    },
    description: {
      es: 'Café cosechado en la sierra michoacana preparado en cafetera de barro con piloncillo y canela (café de olla tradicional), uchepos dulces calientes, pan de nata y repostería artesanal.',
      en: 'Specialty coffee from the Michoacán mountains brewed with cinnamon and raw piloncillo sugar, served with sweet corn uchepos and cream pastries.',
      zh: '精选米却肯高山手工咖啡豆，瓦罐肉桂红糖传统冲泡，配温热香甜玉米粽与鲜奶油面包。',
      fr: 'Café des montagnes du Michoacán infusé à la cannelle et servi avec pâtisseries artisanales.'
    },
    coords: { lat: 17.9642, lng: -102.1992 },
    address: 'Av. Melchor Ocampo No. 165, Col. Centro',
    recommendedBusRoute: 'Ruta 1 y Ruta 2: Centro',
    transitInstructions: {
      es: 'Descenso en Av. Melchor Ocampo a pasos del parque central.',
      en: 'Alight on Av. Melchor Ocampo steps from central park.',
      zh: '在Melchor Ocampo大道下车，紧靠中央公园。',
      fr: 'Arrêt sur l’avenue Melchor Ocampo à deux pas du parc central.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Sábado 07:00 - 21:00 / Domingos 08:00 - 18:00',
    phone: '+52 753 532 6710',
    tags: ['Café de Olla', 'Uchepos', 'Pan de Nata', 'Centro', 'Cafetería'],
    rntVerified: true,
    priceRange: '$'
  },
  {
    id: 'com-pasteleria-fama',
    name: {
      es: 'Pastelería & Panadería La Fama Michoacana',
      en: 'La Fama Michoacana Bakery & Cakes',
      zh: '米却肯知名老字号西点蛋糕与面包工坊',
      fr: 'Pâtisserie & Boulangerie La Fama Michoacana'
    },
    category: 'gastronomy',
    mainCategory: 'donde_comer',
    subCategory: 'cafeterias_panaderias',
    subCategoryLabel: {
      es: 'Cafeterías & Panaderías',
      en: 'Bakeries & Cakes',
      zh: '烘焙西点专营店',
      fr: 'Pâtisseries & Gâteaux'
    },
    description: {
      es: 'Famosa por sus pasteles de tres leches con rompope, gelatinas artísticas, pays de queso con zarzamora de Michoacán, bocadillos finos y empanadas hojaldradas dulces y saladas.',
      en: 'Known for authentic Mexican tres leches liquor cakes, artistic fruit jellies, blackberry cheesecakes, and savory puff pastry turnovers.',
      zh: '以米却肯特产黑莓芝士派、三奶朗姆蛋糕、艺术果冻及香酥甜咸千层酥角而家喻户晓。',
      fr: 'Réputée pour ses gâteaux tres leches traditionnels, tartes aux mûres et feuilletés.'
    },
    coords: { lat: 17.9615, lng: -102.1980 },
    address: 'Calle Constitución de 1814 No. 34, Col. Centro',
    recommendedBusRoute: 'Ruta 1 y Ruta 2: Centro',
    transitInstructions: {
      es: 'Parada Centro Constitución, caminar media cuadra.',
      en: 'Constitución Downtown stop, walk half a block.',
      zh: '在Constitución市中心站下车，步行半街区即到。',
      fr: 'Arrêt Constitución au centre, marcher 50 mètres.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Domingo 08:00 - 21:00',
    phone: '+52 753 532 3315',
    tags: ['Pasteles', 'Tres Leches', 'Zarzamora', 'Pan Dulce', 'Centro'],
    rntVerified: true,
    priceRange: '$$'
  },
  {
    id: 'com-panaderia-espiga',
    name: {
      es: 'Panadería y Pastelería La Espiga de Oro (Bolillo Tradicional)',
      en: 'La Espiga de Oro Artisan Bakery',
      zh: '金穗传统手作烘焙坊与法式面包房',
      fr: 'Boulangerie Artisanale La Espiga de Oro'
    },
    category: 'gastronomy',
    mainCategory: 'donde_comer',
    subCategory: 'cafeterias_panaderias',
    subCategoryLabel: {
      es: 'Cafeterías & Panaderías',
      en: 'Cafes & Bakeries',
      zh: '咖啡馆与烘焙坊',
      fr: 'Cafés & Boulangeries'
    },
    description: {
      es: 'El horno de pan más tradicional de la ciudad: bolillo crujiente recién salido a las 06:00 y 18:00 hrs, conchas de mantequilla, empanadas de piña y pasteles personalizados.',
      en: 'Iconic local bakery famed for piping hot crusty bolillo bread rolls, sweet conchas, and custom cakes.',
      zh: '全城最悠久的手工面包坊，每日早晚定时出炉酥脆热法棍小面包与传统黄油甜面包。',
      fr: 'Boulangerie emblématique réputée pour ses petits pains chauds et viennoiseries.'
    },
    coords: { lat: 17.9628, lng: -102.1978 },
    address: 'Av. Lázaro Cárdenas No. 80, Col. Centro',
    recommendedBusRoute: 'Ruta 1 y Ruta 2: Centro',
    transitInstructions: {
      es: 'Descender en esquina con calle Hidalgo, centro histórico.',
      en: 'Stop at the corner with Hidalgo street, historic downtown.',
      zh: '在历史城区Hidalgo街路口下车。',
      fr: 'Arrêt à l’angle de la rue Hidalgo, centre historique.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lunes a Sábado 06:00 - 21:30 / Domingos 07:00 - 15:00',
    phone: '+52 753 532 0840',
    tags: ['Pan Caliente', 'Bolillo', 'Pan Dulce', 'Pastelería'],
    rntVerified: false,
    priceRange: '$'
  },

  // =========================================================================
  // 5. DÓNDE HOSPEDARSE (Hoteles Ejecutivos y de Playa)
  // =========================================================================
  {
    id: 'hos-portonovo',
    name: {
      es: 'Hotel Portonovo Plaza Lázaro Cárdenas',
      en: 'Hotel Portonovo Plaza Lázaro Cárdenas',
      zh: '拉萨罗卡德纳斯波尔托诺沃广场商务酒店',
      fr: 'Hôtel Portonovo Plaza Lázaro Cárdenas'
    },
    category: 'lodging',
    mainCategory: 'hospedaje',
    subCategory: 'hoteles_ejecutivos',
    subCategoryLabel: {
      es: 'Hoteles Ejecutivos & Urbanos',
      en: 'Executive & City Hotels',
      zh: '商务与市区酒店',
      fr: 'Hôtels d’Affaires'
    },
    description: {
      es: 'Hotel de 4 estrellas con alberca, restaurante buffet, centro de negocios, gimnasio y salones ejecutivos para tripulaciones navieras y directivos del puerto.',
      en: '4-star hotel featuring swimming pool, business center, gym, and meeting rooms for port executives and maritime crews.',
      zh: '四星级商务酒店，配游泳池、自助餐厅、商务中心及多功能会议室。',
      fr: 'Hôtel 4 étoiles avec piscine, restaurant buffet, salle de sport et centre d’affaires.'
    },
    coords: { lat: 17.9670, lng: -102.2025 },
    address: 'Av. Rector Hidalgo No. 360, Col. Centro, Lázaro Cárdenas',
    recommendedBusRoute: 'Ruta 1 y Ruta 2: Rector Hidalgo',
    transitInstructions: {
      es: 'Ruta 1 te deja en la puerta principal del hotel.',
      en: 'Route 1 stops right at the main hotel entrance.',
      zh: '乘1号线直接在酒店主门厅停靠。',
      fr: 'Route 1 s’arrête directement devant l’entrée principale.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    schedule: 'Recepción 24 Horas / Check-in 15:00',
    phone: '+52 753 537 0000',
    tags: ['Hotel 4 Estrellas', 'Alberca', 'Gimnasio', 'Ejecutivo', 'RNT Verificado'],
    rntVerified: true,
    priceRange: '$$$'
  },
  {
    id: 'hos-city-express',
    name: {
      es: 'Hotel City Express by Marriott Lázaro Cárdenas',
      en: 'City Express by Marriott Lázaro Cárdenas',
      zh: '万豪旗下城市便捷酒店 (City Express)',
      fr: 'Hôtel City Express by Marriott'
    },
    category: 'lodging',
    mainCategory: 'hospedaje',
    subCategory: 'hoteles_ejecutivos',
    subCategoryLabel: {
      es: 'Hoteles Ejecutivos & Urbanos',
      en: 'Executive & City Hotels',
      zh: '商务与市区酒店',
      fr: 'Hôtels d’Affaires'
    },
    description: {
      es: 'Hospedaje moderno con desayuno caliente de cortesía, transporte al recinto portuario, Wi-Fi veloz y certificación de sustentabilidad ambiental.',
      en: 'Modern eco-friendly business hotel with free hot breakfast, high-speed Wi-Fi, and shuttle to the port.',
      zh: '现代环保型商务酒店，提供免费热早餐、高速Wi-Fi及往返港区的接驳服务。',
      fr: 'Hôtel d’affaires moderne avec petit-déjeuner chaud offert et navette pour le port.'
    },
    coords: { lat: 17.9710, lng: -102.2055 },
    address: 'Av. Melchor Ocampo No. 490, Col. Segundo Sector',
    recommendedBusRoute: 'Ruta 1: Parada City Express',
    transitInstructions: {
      es: 'Descenso en bahía hotelera sobre Av. Melchor Ocampo.',
      en: 'Alight at the hotel bay on Av. Melchor Ocampo.',
      zh: '在Melchor Ocampo大道的酒店专属停靠湾下车。',
      fr: 'Descente à la zone hôtelière sur l’avenue Melchor Ocampo.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    schedule: 'Recepción 24 Horas / Desayuno 06:00 - 10:00',
    phone: '+52 753 533 9000',
    tags: ['City Express', 'Marriott', 'Desayuno Incluido', 'Sustentable', 'RNT Verificado'],
    rntVerified: true,
    priceRange: '$$'
  },
  {
    id: 'hos-maria-teresa',
    name: {
      es: 'Hotel & Cabañas María Teresa (Playa Azul)',
      en: 'Hotel & Beach Cabins María Teresa (Playa Azul)',
      zh: '玛丽亚·特蕾莎海滨木屋度假酒店 (普拉亚阿苏尔)',
      fr: 'Hôtel & Cabanes de Plage María Teresa'
    },
    category: 'lodging',
    mainCategory: 'hospedaje',
    subCategory: 'hoteles_playa',
    subCategoryLabel: {
      es: 'Hoteles de Playa & Cabañas',
      en: 'Beach Hotels & Cabins',
      zh: '海滨度假酒店与木屋',
      fr: 'Hôtels de Plage & Bungalows'
    },
    description: {
      es: 'Hotel playero con cabañas familiares frente al mar, alberca con tobogán, enramada con hamacas y acceso directo a la playa dorada de Playa Azul.',
      en: 'Beachfront resort featuring family cabins, swimming pool, hammock lounges, and direct beach access.',
      zh: '海滨家庭度假木屋酒店，设游泳池水滑梯、吊床休闲区，直通金色沙滩。',
      fr: 'Complexe en bord de mer avec bungalows, piscine, hamacs et accès direct à la plage.'
    },
    coords: { lat: 17.9820, lng: -102.3530 },
    address: 'Calle Venustiano Carranza s/n frente al mar, Playa Azul',
    recommendedBusRoute: 'Ruta 3: Lázaro Centro - Playa Azul',
    transitInstructions: {
      es: 'Tomar Ruta 3 hasta la parada central de Playa Azul. Caminar 1 cuadra hacia el mar.',
      en: 'Take Route 3 to Playa Azul central terminal. Walk 1 block towards the beach.',
      zh: '乘3号线至Playa Azul中央总站，朝海滩步行一街区即到。',
      fr: 'Route 3 jusqu’au terminus de Playa Azul, marcher 1 bloc vers la mer.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    schedule: 'Recepción 24 Horas / Check-in 14:00',
    phone: '+52 753 535 0101',
    tags: ['Playa Azul', 'Cabañas', 'Alberca', 'Frente al Mar', 'RNT Verificado'],
    rntVerified: true,
    priceRange: '$$'
  }
];

export const SAFETY_ZONES: SafetyZone[] = [
  {
    id: 'zone-malecon-puerto',
    name: 'Corredor Portuario & Malecón de la Paz',
    polygon: [
      { lat: 17.9600, lng: -102.2000 },
      { lat: 17.9500, lng: -102.1900 },
      { lat: 17.9350, lng: -102.1800 },
      { lat: 17.9300, lng: -102.1950 },
      { lat: 17.9450, lng: -102.2150 }
    ],
    riskLevel: 'green',
    score: 94,
    safeHours: '05:00 - 23:00 (Patrullaje naval y portuario permanente)',
    cautions: {
      es: 'Zona de alta seguridad y videovigilancia C5i. Respete los accesos con gafete ASIPONA.',
      en: 'High security area monitored by C5i. Respect ASIPONA badge checkpoint boundaries.',
      zh: '由C5i指挥中心全时监控的高安全区域。请佩戴港区出入证。',
      fr: 'Zone de haute sécurité surveillée par vidéo C5i. Badges ASIPONA obligatoires.'
    },
    recentIncidentsCount: 1
  },
  {
    id: 'zone-centro-comercial',
    name: 'Sector Centro Urbano & Zona Bancaria',
    polygon: [
      { lat: 17.9700, lng: -102.2050 },
      { lat: 17.9650, lng: -102.1920 },
      { lat: 17.9550, lng: -102.1940 },
      { lat: 17.9620, lng: -102.2080 }
    ],
    riskLevel: 'yellow',
    score: 76,
    safeHours: '07:00 - 20:30 (Mayor afluencia de transporte y comercio)',
    cautions: {
      es: 'Transite por avenidas iluminadas (Melchor Ocampo). Precaución en cajeros de noche.',
      en: 'Stick to well-lit avenues (Melchor Ocampo). Exercise caution at ATMs late night.',
      zh: '请走主要照明大道（Melchor Ocampo）。夜间使用ATM机注意随身财物。',
      fr: 'Privilégier les avenues éclairées. Attention aux distributeurs la nuit.'
    },
    recentIncidentsCount: 6
  },
  {
    id: 'zone-canal-balsas',
    name: 'Canales del Río Balsas & Marismas Periféricas',
    polygon: [
      { lat: 17.9850, lng: -102.2350 },
      { lat: 17.9950, lng: -102.2100 },
      { lat: 18.0100, lng: -102.2300 },
      { lat: 17.9950, lng: -102.2500 }
    ],
    riskLevel: 'red',
    score: 52,
    safeHours: '08:00 - 18:00 (Restricción por hábitat silvestre y falta de alumbrado)',
    cautions: {
      es: 'ALERTA FAUNA: Presencia documentada de cocodrilos en canales. Evite senderos no pavimentados de noche.',
      en: 'WILDLIFE ALERT: Documented presence of crocodiles in drainage channels. Avoid unpaved paths at night.',
      zh: '野生动物警报：水渠及湿地有鳄鱼出没纪录。夜间严禁在未铺装小道步行。',
      fr: 'ALERTE FAUNE: Présence de crocodiles dans les canaux. Évitez les sentiers non pavés la nuit.'
    },
    recentIncidentsCount: 14
  },
  {
    id: 'zone-playa-azul-costa',
    name: 'Corredor Turístico Playa Azul & Boulevard Costero',
    polygon: [
      { lat: 17.9800, lng: -102.3600 },
      { lat: 17.9900, lng: -102.3500 },
      { lat: 17.9750, lng: -102.3400 },
      { lat: 17.9650, lng: -102.3550 }
    ],
    riskLevel: 'green',
    score: 92,
    safeHours: '06:00 - 22:30 (Patrullaje turístico y campamentos tortugueros activos)',
    cautions: {
      es: 'Zona turística y familiar con salvavidas en temporada alta. Respete banderas marítimas en la playa.',
      en: 'Tourist and family zone with lifeguards. Respect ocean safety flags on the beach.',
      zh: '海滨旅游度假区，有救生员巡视。在海滩请注意海况警示旗。',
      fr: 'Zone touristique et familiale surveillée. Respectez les drapeaux de baignade.'
    },
    recentIncidentsCount: 2
  },
  {
    id: 'zone-guacamayas-comercial',
    name: 'Sector Las Guacamayas & Blvd. Ciranda',
    polygon: [
      { lat: 17.9900, lng: -102.2200 },
      { lat: 18.0100, lng: -102.2150 },
      { lat: 18.0150, lng: -102.2350 },
      { lat: 17.9950, lng: -102.2300 }
    ],
    riskLevel: 'yellow',
    score: 72,
    safeHours: '06:30 - 21:00 (Alto flujo de combis y comercios locales)',
    cautions: {
      es: 'Zona de alto tránsito de transporte público. Cruce en pasos peatonales y mantenga precaución en el crucero.',
      en: 'High public transit traffic area. Cross at designated crosswalks and exercise caution at intersections.',
      zh: '公交高密度中转区。请走人行横道，十字路口注意避让车辆。',
      fr: 'Zone de forte circulation de transports. Traversez sur les passages piétons.'
    },
    recentIncidentsCount: 7
  }
];

export const SAFE_POINTS: SafePoint[] = [
  {
    id: 'pn-1',
    name: 'Punto Naranja: Farmacia Guadalajara Suc. Centro 24H',
    type: 'punto_naranja',
    address: 'Av. Melchor Ocampo No. 112, Col. Centro',
    coords: { lat: 17.9645, lng: -102.1998 },
    phone: '753 532 1890',
    openHours: '24 Horas / Todos los días',
    is24Hours: true,
    features: ['Personal capacitado en auxilio a mujeres', 'Cámaras conectadas al C5i', 'Teléfono de emergencia libre', 'Botiquín de primeros auxilios']
  },
  {
    id: 'pn-2',
    name: 'Punto Seguro: Módulo Policía Turística Malecón',
    type: 'police_post',
    address: 'Malecón de la Cultura y la Paz, Módulo Central',
    coords: { lat: 17.9545, lng: -102.1925 },
    phone: '911 / 753 537 1414',
    openHours: '24 Horas',
    is24Hours: true,
    features: ['Oficiales bilingües', 'Unidad de reacción rápida', 'Resguardo seguro', 'Enlace directo con SEMAR']
  },
  {
    id: 'pn-3',
    name: 'Punto Naranja: Tienda Soriana Híper Las Guacamayas',
    type: 'punto_naranja',
    address: 'Blvd. Las Guacamayas No. 800',
    coords: { lat: 17.9930, lng: -102.2205 },
    phone: '753 537 9900',
    openHours: '07:00 - 23:00',
    is24Hours: false,
    features: ['Seguridad privada certificada', 'Zona de resguardo infantil', 'Acceso a parada de autobús segura']
  },
  {
    id: 'pn-4',
    name: 'Punto Seguro: Estación de Bomberos y Protección Civil Lázaro Cárdenas',
    type: 'shelter',
    address: 'Av. Heroica Escuela Naval Militar s/n',
    coords: { lat: 17.9690, lng: -102.2040 },
    phone: '753 532 2300',
    openHours: '24 Horas',
    is24Hours: true,
    features: ['Atención a mordeduras/rescate de fauna (cocodrilos)', 'Ambulancias de guardia', 'Albergue temporal']
  }
];

export const INITIAL_REPORTS: CitizenReport[] = [
  {
    id: 'rep-1',
    folio: 'LC-2026-0891',
    type: 'cocodrilos',
    title: 'Avistamiento de cocodrilo en canal pluvial Av. Río Balsas',
    description: 'Ejemplar de aprox. 2.2 metros asoleándose en el talud del canal pluvial cerca del puente peatonal. Se requiere inspección de Protección Civil para evitar riesgos a peatones y niños.',
    coords: { lat: 17.9740, lng: -102.2090 },
    address: 'Av. Río Balsas esq. Canal de desagüe, Col. Primer Sector',
    photoUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    timestamp: 'Hace 35 min',
    status: 'cuadrilla_asignada',
    urgency: 'critica',
    upvotes: 42,
    isSynced: true
  },
  {
    id: 'rep-2',
    folio: 'LC-2026-0885',
    type: 'baches',
    title: 'Baches profundos en carril de carga pesada hacia Isla Cayacal',
    description: 'Socavón de 1.5m de diámetro generado por el tránsito de tractocamiones con contenedores. Riesgo de ponchadura y volcadura.',
    coords: { lat: 17.9495, lng: -102.1955 },
    address: 'Acceso Puente Cayacal poniente',
    photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    timestamp: 'Hace 2 horas',
    status: 'en_revision',
    urgency: 'alta',
    upvotes: 28,
    isSynced: true
  },
  {
    id: 'rep-3',
    folio: 'LC-2026-0872',
    type: 'alumbrado',
    title: 'Luminarias apagadas en paradero del Hospital General',
    description: 'Circuito completo de 5 lámparas sin funcionar en el andén donde los usuarios esperan la Ruta 1 de noche.',
    coords: { lat: 17.9780, lng: -102.2115 },
    address: 'Av. Melchor Ocampo frente a entrada de Urgencias',
    photoUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80',
    timestamp: 'Ayer a las 21:10',
    status: 'recibido',
    urgency: 'media',
    upvotes: 19,
    isSynced: true
  },
  {
    id: 'rep-4',
    folio: 'LC-2026-0840',
    type: 'semaforos',
    title: 'Semáforo intermitente en Crucero Las Guacamayas',
    description: 'Semáforo en destello amarillo genera congestión vial en hora pico de entrada laboral a las siderúrgicas.',
    coords: { lat: 17.9940, lng: -102.2210 },
    address: 'Crucero Carretera a La Mira y Las Guacamayas',
    photoUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=600&q=80',
    timestamp: 'Hace 5 horas',
    status: 'cuadrilla_asignada',
    urgency: 'alta',
    upvotes: 31,
    isSynced: true
  },
  {
    id: 'rep-5',
    folio: 'LC-2026-0790',
    type: 'basura',
    title: 'Tiradero clandestino en camino a Barra de Pichi',
    description: 'Acumulación de residuos plásticos cerca de zona de anidación. Afecta imagen turística y sustentabilidad.',
    coords: { lat: 17.9890, lng: -102.3650 },
    address: 'Carretera Costera Km 18',
    photoUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=600&q=80',
    timestamp: 'Hace 1 día',
    status: 'resuelto',
    urgency: 'media',
    upvotes: 56,
    isSynced: true
  }
];
