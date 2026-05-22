/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  ServicePayment, 
  WeeklyContributor, 
  ShoppingItem, 
  StoreRecommendation, 
  Medicine, 
  BloodPressureReading, 
  FamilyBirthday, 
  FamilyContact,
  IsssteAppointment
} from './types';

export const INITIAL_SERVICES: ServicePayment[] = [
  {
    id: 's-1',
    name: 'Renta Mensual',
    amount: 7500,
    dueDate: '2026-06-05', // Due on the 5th of each month
    isPaid: false,
  },
  {
    id: 's-2',
    name: 'Izzi Internet y TV',
    amount: 345,
    dueDate: '2026-05-25', // Monthly
    isPaid: false,
  },
  {
    id: 's-3',
    name: 'Agua Potable (Bimestral)',
    amount: 400,
    dueDate: '2026-06-05', // Due on June 5
    isPaid: false,
  },
  {
    id: 's-4',
    name: 'Gas Doméstico',
    amount: 500,
    dueDate: '2026-05-30', // Approx monthly
    isPaid: false,
  },
  {
    id: 's-5',
    name: 'Luz (CFE Bimestral)',
    amount: 1500,
    dueDate: '2026-07-19', // Due before 19, paid recently on May 18
    isPaid: true,
    paymentDate: '2026-05-18',
  }
];

export const INITIAL_CONTRIBUTORS: WeeklyContributor[] = [
  { id: 'wc-1', name: 'Karla (Prima)', weeklyAmount: 1100, w1: true, w2: true, w3: true, w4: true },
  { id: 'wc-2', name: 'Hermano Carlos', weeklyAmount: 1200, w1: true, w2: true, w3: true, w4: false },
  { id: 'wc-3', name: 'Tía Elena', weeklyAmount: 1500, w1: true, w2: true, w3: false, w4: false },
  { id: 'wc-4', name: 'Tío Alberto', weeklyAmount: 1150, w1: true, w2: false, w3: false, w4: false }
];

export const INITIAL_SHOPPING: ShoppingItem[] = [
  // --- DESPENSA COMIDA (PDF DIET & INGREDIENTS) ---
  { id: 'sh-p1', name: 'Pollo fresco entero / pechuga deshebrada', qty: '12 kg', price: 900, category: 'comida', isBought: false },
  { id: 'sh-p2', name: 'Carne molida de res económica', qty: '3 kg', price: 360, category: 'comida', isBought: false },
  { id: 'sh-p3', name: 'Maciza / Carne de cerdo limpia', qty: '2 kg', price: 220, category: 'comida', isBought: false },
  { id: 'sh-p4', name: 'Huevo blanco económico (Aproximadamente 90 pzs)', qty: '5 kg', price: 195, category: 'comida', isBought: true },
  { id: 'sh-p5', name: 'Queso panela fresco', qty: '3 kg', price: 240, category: 'comida', isBought: false },
  { id: 'sh-p6', name: 'Atún en agua económico (Bodega Aurrerá)', qty: '6 latas', price: 96, category: 'comida', isBought: true },

  { id: 'sh-c1', name: 'Tortillas de maíz (De tortillería local)', qty: '25 kg', price: 500, category: 'comida', isBought: false },
  { id: 'sh-c2', name: 'Frijol pinto o negro a granel', qty: '4 kg', price: 140, category: 'comida', isBought: true },
  { id: 'sh-c3', name: 'Arroz súper extra blanco', qty: '5 kg', price: 125, category: 'comida', isBought: true },
  { id: 'sh-c4', name: 'Pasta para sopa de letra/fideo/moñito', qty: '4 kg', price: 64, category: 'comida', isBought: true },
  { id: 'sh-c5', name: 'Pan de caja integral', qty: '4 bolsas', price: 160, category: 'comida', isBought: false },
  { id: 'sh-c6', name: 'Avena natural entera', qty: '3 kg', price: 75, category: 'comida', isBought: true },
  { id: 'sh-c7', name: 'Tostadas de maíz horneadas', qty: '2 paquetes', price: 56, category: 'comida', isBought: false },
  { id: 'sh-c8', name: 'Cereal de hojuelas económicas grande', qty: '1 caja grande', price: 42, category: 'comida', isBought: false },
  { id: 'sh-c9', name: 'Lentejas secas', qty: '2 kg', price: 68, category: 'comida', isBought: true },
  { id: 'sh-c10', name: 'Garbanzos secos', qty: '1 kg', price: 34, category: 'comida', isBought: true },

  // Frutas (rotación económica)
  { id: 'sh-f1', name: 'Plátano Tabasco maduro', qty: '5 kg', price: 95, category: 'comida', isBought: false },
  { id: 'sh-f2', name: 'Manzana roja o Golden económica', qty: '4 kg', price: 110, category: 'comida', isBought: false },
  { id: 'sh-f3', name: 'Papaya Maradol fresca', qty: '6 kg', price: 130, category: 'comida', isBought: false },
  { id: 'sh-f4', name: 'Naranja dulce para jugo', qty: '8 kg', price: 104, category: 'comida', isBought: false },
  { id: 'sh-f5', name: 'Sandía fresca rebanada', qty: '10 kg', price: 110, category: 'comida', isBought: false },
  { id: 'sh-f6', name: 'Guayaba de temporada', qty: '3 kg', price: 80, category: 'comida', isBought: false },

  // Verduras base
  { id: 'sh-v1', name: 'Jitomate Saladet maduro', qty: '8 kg', price: 160, category: 'comida', isBought: false },
  { id: 'sh-v2', name: 'Cebolla blanca fresca', qty: '4 kg', price: 85, category: 'comida', isBought: false },
  { id: 'sh-v3', name: 'Papa blanca lisa', qty: '5 kg', price: 125, category: 'comida', isBought: false },
  { id: 'sh-v4', name: 'Zanahoria fresca mediana', qty: '4 kg', price: 64, category: 'comida', isBought: false },
  { id: 'sh-v5', name: 'Calabacita italiana tierna', qty: '4 kg', price: 90, category: 'comida', isBought: false },
  { id: 'sh-v6', name: 'Nopal limpio fresco', qty: '3 kg', price: 60, category: 'comida', isBought: false },
  { id: 'sh-v7', name: 'Lechuga romana u orejona desinfectada', qty: '4 piezas', price: 76, category: 'comida', isBought: false },
  { id: 'sh-v8', name: 'Espinacas / acelgas lavadas', qty: '4 manojos', price: 48, category: 'comida', isBought: false },
  { id: 'sh-v9', name: 'Chile serrano / jalapeño para guisados', qty: '1.5 kg', price: 45, category: 'comida', isBought: false },
  { id: 'sh-v10', name: 'Brócoli fresco para cremas y sopa', qty: '2 kg', price: 60, category: 'comida', isBought: false },

  // Lácteos
  { id: 'sh-l1', name: 'Leche entera o descremada en polvo (Rinde más)', qty: '3 bolsas', price: 190, category: 'comida', isBought: true },
  { id: 'sh-l2', name: 'Yogur natural grande sin azúcar', qty: '4 botes grandes', price: 155, category: 'comida', isBought: false },

  // --- DESPENSA HOGAR (LOS BÁSICOS SOLICITADOS) ---
  { id: 'sh-h1', name: 'Papel higiénico económico (Bodega Aurrerá)', qty: 'Paquete de 16 rollos', price: 82, category: 'hogar', isBought: true },
  { id: 'sh-h2', name: 'Jabón en polvo económico para ropa (Aurrera)', qty: 'Bolsa grande', price: 95, category: 'hogar', isBought: true },
  { id: 'sh-h3', name: 'Detergente líquido económico para ropa', qty: 'Galón', price: 115, category: 'hogar', isBought: true },
  { id: 'sh-h4', name: 'Aceite vegetal de cocina barato (Aurrera)', qty: '2 botellas', price: 76, category: 'hogar', isBought: true },
  { id: 'sh-h5', name: 'Servilletas de papel económicas', qty: 'Paquete grande', price: 28, category: 'hogar', isBought: true },
  { id: 'sh-h6', name: 'Azúcar estándar para endulzar', qty: '2 kg', price: 54, category: 'hogar', isBought: true },
  { id: 'sh-h7', name: 'Suavizante de ropa económico (Aurrera)', qty: 'Botella grande', price: 44, category: 'hogar', isBought: false },
  { id: 'sh-h8', name: 'Cloro / blanqueador líquido de ropa', qty: 'Botella', price: 21, category: 'hogar', isBought: true },
  { id: 'sh-h9', name: 'Lavatrastes líquido eficaz-económico', qty: 'Botella', price: 38, category: 'hogar', isBought: true },
  { id: 'sh-h10', name: 'Jabón de tocador en barra más económico', qty: 'Paquete de 6', price: 46, category: 'hogar', isBought: true },
  { id: 'sh-h11', name: 'Sal de mesa fina', qty: '1 bolsa', price: 12, category: 'hogar', isBought: true },
  { id: 'sh-h12', name: 'Bolsas para basura biodegradables', qty: 'Rollo', price: 30, category: 'hogar', isBought: false }
];

export const INITIAL_STORES: StoreRecommendation[] = [
  {
    id: 'st-1',
    storeName: 'Bodega Aurrerá 🟢 (Compra Fuerte - 80% Super)',
    bestFor: 'Granos, Papel higiénico, Detergentes, Leche en polvo, Aceite, Azúcar, Cereal económico, Limpieza, Enlatados, Tostadas, Frijol, Arroz, Pasta.',
    avoidFor: 'Carnes de corte premium, frutas fuera de temporada.',
    notes: 'Es el súper más barato de la zona para productos de aseo, despensa seca y productos marca Aurrerá. Compra quincenal o mensual.',
  },
  {
    id: 'st-2',
    storeName: 'La Comer 🟡 (Compra Fresca y Ofertas)',
    bestFor: 'Fruta de temporada, verduras frescas, Pollo fresco en oferta, Queso panela, Aguacate y Nopales del día.',
    avoidFor: 'Higiene de marca premium sin oferta, abarrotes básicos.',
    notes: 'Ideal para frutas, verduras frescas y proteínas en ofertas específicas de mitad de semana. Compra semanal.',
  },
  {
    id: 'st-3',
    storeName: 'Similares / Guadalajara',
    bestFor: 'Medicamentos genéricos de la abuela Esperanza.',
    avoidFor: 'Despensa en general.',
    notes: 'Lunes de descuento en Farmacias Similares del 25%. Ahorro enorme en recetas mensuales.',
  }
];

export const INITIAL_MEDICINES: Medicine[] = [
  {
    id: 'm-1',
    name: 'Losartán (Presión Arterial)',
    dose: '1 tableta (50 mg)',
    frequency: 'Cada 24 horas',
    timeOfDay: 'Mañana',
    notes: 'Tomarse antes de desayunar con medio vaso de agua.'
  },
  {
    id: 'm-2',
    name: 'Aspirina Protec',
    dose: '1 tableta (100 mg)',
    frequency: 'Cada 24 horas',
    timeOfDay: 'Tarde',
    notes: 'Tomarse justo después de la comida para proteger el estómago.'
  },
  {
    id: 'm-3',
    name: 'Metformina (Control Azúcar)',
    dose: '1 tableta (850 mg)',
    frequency: 'Cada 12 horas',
    timeOfDay: 'Noche',
    notes: 'Tomar junto con la cena ligera. No saltarse comidas.'
  }
];

export const INITIAL_READINGS: BloodPressureReading[] = [
  {
    id: 'r-1',
    date: '2026-05-19',
    period: 'AM',
    systolic: 122,
    diastolic: 79,
    pulse: 71,
    notes: 'Presión excelente por la mañana, desayunó avena.'
  },
  {
    id: 'r-2',
    date: '2026-05-19',
    period: 'PM',
    systolic: 125,
    diastolic: 81,
    pulse: 74,
    notes: 'Dijo que se sentía un poco pesada, descansó un rato.'
  },
  {
    id: 'r-3',
    date: '2026-05-20',
    period: 'AM',
    systolic: 119,
    diastolic: 78,
    pulse: 69,
    notes: 'Muy relajada, durmió muy bien.'
  },
  {
    id: 'r-4',
    date: '2026-05-20',
    period: 'PM',
    systolic: 121,
    diastolic: 80,
    pulse: 70,
    notes: 'Presión estable antes de tomar su cena.'
  },
  {
    id: 'r-5',
    date: '2026-05-21',
    period: 'AM',
    systolic: 120,
    diastolic: 78,
    pulse: 72,
    notes: 'Lectura tomada hoy temprano.'
  }
];

export const INITIAL_BIRTHDAYS: FamilyBirthday[] = [
  { id: 'b-1', name: 'Abuela Esperanza', date: '2026-08-05', relationship: 'Nuestra abuelita querida Esperanza ❤️' },
  { id: 'b-2', name: 'Karla (Prima)', date: '2026-05-25', relationship: 'Prima consentida' },
  { id: 'b-3', name: 'Hermano Carlos', date: '2026-06-12', relationship: 'Hermano' },
  { id: 'b-4', name: 'Leticia Rodríguez (Madre 🕊️)', date: '2026-11-12', relationship: 'Mamá Lety siempre presente' },
];

export const INITIAL_CONTACTS: FamilyContact[] = [
  { id: 'co-1', name: 'Dr. Salvador Romero', phone: '5567891234', relationship: 'Geriatra de la Abuela Esperanza' },
  { id: 'co-2', name: 'Tía Elena', phone: '5523456789', relationship: 'Cuidado y apoyo con medicamentos' },
  { id: 'co-3', name: 'Tío Alberto', phone: '5512345678', relationship: 'Ayuda financiera y traslados de emergencia' }
];

export const MOM_ADVICES = [
  "Tómate la pastilla",
  "Toma agua",
  "Qué rica coca",
  "Bien que lo decía Pérez Chowel",
  "¿Crees que yo tengo tu dinero sembrado en una maceta?",
  "Encuentro el cargador o voy y lo busco yo?",
  "Porque lo digo yo y punto"
];

export const INITIAL_APPOINTMENTS: IsssteAppointment[] = [
  {
    id: 'a-1',
    date: '2026-06-15',
    time: '08:30',
    specialty: 'Geriatría (Control Anual)',
    doctor: 'Dra. Patricia Martínez',
    notes: 'Llevar los registros de presión arterial del último mes impresos o en el celular.',
    isCompleted: false
  },
  {
    id: 'a-2',
    date: '2026-07-02',
    time: '11:00',
    specialty: 'Análisis Clínicos (Sangre y Orina)',
    doctor: 'Laboratorio Clínica ISSSTE Sur',
    notes: 'Presentarse con 12 horas de ayuno absoluto. Llevar carnet vigente.',
    isCompleted: false
  }
];

