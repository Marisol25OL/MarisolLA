export type Language = 'es' | 'en' | 'zh' | 'fr';

export type UserRole = 'citizen' | 'driver' | 'admin';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface TransitStop {
  id: string;
  name: string;
  coords: Coordinates;
  connections: string[];
}

export interface TransitRoute {
  id: string;
  name: string;
  code: string;
  color: string;
  frequencyMinutes: number;
  stops: TransitStop[];
  waypoints: Coordinates[];
  schedule: string;
  destination: string;
}

export interface TransitUnit {
  id: string;
  routeId: string;
  unitNumber: string;
  driverName: string;
  driverPhone: string;
  coords: Coordinates;
  speedKmH: number;
  occupancyPercent: number; // 0-100%
  status: 'active' | 'breakdown' | 'delayed' | 'depot' | 'reinforcement';
  nextStop: string;
  etaMinutes: number;
  lastUpdated: string;
}

export interface OverloadAlert {
  id: string;
  unitId: string;
  routeId: string;
  timestamp: string;
  photoUrl: string;
  passengersReported: number;
  status: 'pending' | 'dispatched' | 'resolved';
  reinforcementUnitId?: string;
}

export interface MechanicalFailureAlert {
  id: string;
  unitId: string;
  driverName: string;
  routeId: string;
  faultType: 'motor' | 'frenos' | 'neumaticos' | 'electrico' | 'transmision';
  description: string;
  coords: Coordinates;
  timestamp: string;
  status: 'open' | 'dispatched_mechanic' | 'resolved';
}

export type MainCategory = 
  | 'empleos_industrias'
  | 'turismo'
  | 'atencion_medica'
  | 'donde_comer'
  | 'hospedaje';

export type SubCategory = 
  // Empleos e Industrias
  | 'siderurgica_metal'
  | 'terminales_portuarias'
  | 'aduanas_logistica'
  | 'quimica_fertilizantes'
  | 'energia_combustibles'
  | 'naval_pesca'
  | 'metalmecanica_servicios'
  // Turismo
  | 'ambiental_ecoturismo'
  | 'industrial_portuario'
  | 'deportivo_aventura'
  | 'cultural_civico'
  // Atención Médica
  | 'hospitales_generales'
  | 'seguro_social_imss_issste'
  | 'urgencias_cruz_roja'
  | 'clinicas_especialidades'
  // Dónde Comer
  | 'supermercados'
  | 'comida_rapida'
  | 'restaurantes_mariscos'
  | 'fondas_antojitos'
  | 'cafeterias_panaderias'
  // Hospedaje
  | 'hoteles_ejecutivos'
  | 'hoteles_playa';

export type TourismCategory = 
  | MainCategory
  | 'worker_industry'
  | 'environmental'
  | 'industrial'
  | 'sports'
  | 'medical'
  | 'gastronomy'
  | 'lodging';

export interface CatalogItem {
  id: string;
  name: Record<Language, string>;
  category: TourismCategory;
  mainCategory: MainCategory;
  subCategory: SubCategory;
  subCategoryLabel: Record<Language, string>;
  description: Record<Language, string>;
  coords: Coordinates;
  address: string;
  recommendedBusRoute: string;
  transitInstructions: Record<Language, string>;
  imageUrl: string;
  schedule: string;
  phone?: string;
  tags: string[];
  rntVerified?: boolean; // Registro Nacional de Turismo
  priceRange?: '$' | '$$' | '$$$';
}

export interface SafetyZone {
  id: string;
  name: string;
  polygon: Coordinates[];
  riskLevel: 'green' | 'yellow' | 'red'; // Verde, Amarillo, Rojo
  score: number; // 0-100
  safeHours: string;
  cautions: Record<Language, string>;
  recentIncidentsCount: number;
}

export interface SafePoint {
  id: string;
  name: string;
  type: 'punto_naranja' | 'police_post' | 'hospital' | 'verified_business' | 'shelter';
  address: string;
  coords: Coordinates;
  phone: string;
  openHours: string;
  is24Hours: boolean;
  features: string[];
  distanceMeters?: number;
}

export type CitizenReportType = 
  | 'baches'
  | 'alumbrado'
  | 'basura'
  | 'semaforos'
  | 'senalamientos'
  | 'cocodrilos'
  | 'ambulantes'
  | 'delincuencia'
  | 'sobrecupo';

export interface CitizenReport {
  id: string;
  folio: string;
  type: CitizenReportType;
  title: string;
  description: string;
  coords: Coordinates;
  address: string;
  photoUrl: string;
  timestamp: string;
  exactDate?: string;
  exactTime?: string;
  headerTitle?: string;
  status: 'recibido' | 'en_revision' | 'cuadrilla_asignada' | 'resuelto';
  urgency: 'baja' | 'media' | 'alta' | 'critica';
  upvotes: number;
  isSynced: boolean; // For offline support
  reportedBy?: string;
  userRole?: string;
  assignedCrew?: string;
  adminNotes?: string;
  resolutionDate?: string;
}

