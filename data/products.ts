export type Category = 'Todos' | 'Pre-Entreno' | 'Creatina' | 'Proteína' | 'Vitaminas' | 'Carbohidratos';
export type Badge = 'new' | 'hot' | 'out' | null;

export interface Product {
  id: number;
  brand: string;
  name: string;
  price: number;
  category: Exclude<Category, 'Todos'>;
  badge: Badge;
  description: string;
  inStock: boolean;
  image: string;
  imageBg: string;
}

export const CATEGORIES: Category[] = [
  'Todos',
  'Pre-Entreno',
  'Creatina',
  'Proteína',
  'Vitaminas',
  'Carbohidratos',
];

export const WHATSAPP_NUMBER = '56948674692';

export const products: Product[] = [
  // ── PRE-ENTRENO ──────────────────────────────────────────────────────────
  {
    id: 1,
    brand: 'Insane Labz',
    name: 'Psychopath 250g',
    price: 35990,
    category: 'Pre-Entreno',
    badge: 'hot',
    description:
      'Pre-entreno extremo con cafeína, AMPiberry y complejo de estimulantes. Sabor Blue Raspberry. 30 servicios de máxima intensidad.',
    inStock: true,
    image: '/images/psychopath.jpg',
    imageBg: 'linear-gradient(135deg, #0a0800 0%, #1a1a1a 100%)',
  },
  {
    id: 2,
    brand: 'Grizzly Bear',
    name: 'Masacre 303g',
    price: 32990,
    category: 'Pre-Entreno',
    badge: 'hot',
    description:
      'Pre-entreno potente con 300mg de cafeína, beta-alanina y citrulina malato. Sabor Cherry Bomb. 30 servicios de rendimiento explosivo.',
    inStock: true,
    image: '/images/masacre.jpg',
    imageBg: 'linear-gradient(135deg, #1a0000 0%, #0d0d0d 100%)',
  },
  {
    id: 3,
    brand: 'Psycho Pharma',
    name: 'Edge of Insanity 1000g',
    price: 38990,
    category: 'Pre-Entreno',
    badge: 'new',
    description:
      'Pre-entreno de alta dosis con fórmula de estimulantes de nueva generación. Sabor Blueberry. 35 servicios para atletas avanzados.',
    inStock: true,
    image: '/images/edge-insanity.jpg',
    imageBg: 'linear-gradient(135deg, #001a08 0%, #0d0d0d 100%)',
  },

  // ── CREATINA ─────────────────────────────────────────────────────────────
  {
    id: 4,
    brand: 'Inner Armour',
    name: 'Creatine Monohydrate 300g',
    price: 18990,
    category: 'Creatina',
    badge: null,
    description:
      'Creatina monohidratada certificada Creapure® de alta pureza. 100 servicios de 3g. Sin gluten, aumenta fuerza y potencia muscular.',
    inStock: true,
    image: '/images/creatine-inner-armour.jpg',
    imageBg: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
  },
  {
    id: 5,
    brand: 'Active',
    name: 'Creatine Gummy 360g',
    price: 24990,
    category: 'Creatina',
    badge: 'new',
    description:
      'Creatina monohidratada 100% en formato gomita. Sabor Blueberry. 90 servicios de 5g. Cómoda y deliciosa, ideal si no te gustan los polvos.',
    inStock: true,
    image: '/images/creatine-gummy.jpg',
    imageBg: 'linear-gradient(135deg, #001020 0%, #0d1a2a 100%)',
  },
  {
    id: 6,
    brand: 'Dragon Pharma',
    name: 'Creatine Monohydrate 300g',
    price: 22990,
    category: 'Creatina',
    badge: null,
    description:
      'Creatina monohidratada micronizada de grado farmacéutico. 60 servicios de 5g. Mejora la fuerza, resistencia y recuperación muscular.',
    inStock: true,
    image: '/images/creatine-dragon.jpg',
    imageBg: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a1a 100%)',
  },

  // ── PROTEÍNA ─────────────────────────────────────────────────────────────
  {
    id: 7,
    brand: 'Fit Protein',
    name: 'Grizzly Bear Whey 2lb',
    price: 39990,
    category: 'Proteína',
    badge: null,
    description:
      'Proteína 100% Whey de alta calidad. 25g de proteína por servicio con perfil completo de aminoácidos. Ideal para recuperación y masa muscular.',
    inStock: true,
    image: '/images/grizzly-protein.jpg',
    imageBg: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)',
  },

  // ── VITAMINAS ────────────────────────────────────────────────────────────
  {
    id: 8,
    brand: 'OstroVit',
    name: 'Collagen 90 tabs',
    price: 16990,
    category: 'Vitaminas',
    badge: null,
    description:
      'Suplemento diario de colágeno hidrolizado en tabletas. Apoya articulaciones, piel y tejido conectivo. 90 tabletas, una al día.',
    inStock: true,
    image: '/images/collagen.jpg',
    imageBg: 'linear-gradient(135deg, #0a0a14 0%, #1a1a1a 100%)',
  },
  {
    id: 9,
    brand: 'OstroVit',
    name: 'Magnesium Glycinate 90 tabs',
    price: 18990,
    category: 'Vitaminas',
    badge: null,
    description:
      'Glicinato de magnesio de alta biodisponibilidad. Apoya el sistema nervioso, reduce calambres y mejora la calidad del sueño. 90 tabletas.',
    inStock: true,
    image: '/images/magnesium-glycinate.jpg',
    imageBg: 'linear-gradient(135deg, #0a0a14 0%, #1a1a1a 100%)',
  },
  {
    id: 10,
    brand: 'OstroVit',
    name: 'Caffeine 200 (200 tabs)',
    price: 14990,
    category: 'Vitaminas',
    badge: null,
    description:
      'Cafeína pura 200mg por tableta. Fórmula 100% vegana. Aumenta el estado de alerta, energía y concentración. 200 tabletas.',
    inStock: true,
    image: '/images/caffeine-200.jpg',
    imageBg: 'linear-gradient(135deg, #001a0a 0%, #0d0d0d 100%)',
  },
  {
    id: 11,
    brand: 'Grizzly Bear',
    name: 'Ashwagandha 60 cáps',
    price: 19990,
    category: 'Vitaminas',
    badge: null,
    description:
      'Ashwagandha KSM-66 en cápsula vegetal. Reduce el cortisol, mejora el rendimiento físico y el equilibrio hormonal. 60 cápsulas.',
    inStock: true,
    image: '/images/ashwagandha.jpg',
    imageBg: 'linear-gradient(135deg, #001a00 0%, #0d0d0d 100%)',
  },

  // ── CARBOHIDRATOS ────────────────────────────────────────────────────────
  {
    id: 12,
    brand: 'Dragon Pharma',
    name: 'Creamy Rice Cereal 2.1lb',
    price: 28990,
    category: 'Carbohidratos',
    badge: 'new',
    description:
      'Cereal de arroz cremoso sabor Chocolate Brownie. 25g de carbohidratos por servicio, 130 calorías. 26 servicios para recarga de glucógeno.',
    inStock: true,
    image: '/images/creamy-rice-cereal.jpg',
    imageBg: 'linear-gradient(135deg, #1a0800 0%, #0d0d0d 100%)',
  },
];
