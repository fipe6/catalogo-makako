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
  {
    id: 1,
    brand: 'Makako',
    name: 'Pre-Entreno Fuego 300g',
    price: 35990,
    category: 'Pre-Entreno',
    badge: 'hot',
    description:
      'Fórmula explosiva con 200mg de cafeína, beta-alanina y arginina. Máxima energía y enfoque para tus entrenamientos más intensos. 30 servicios.',
    inStock: true,
    image: '/images/pre-entreno-fuego.webp',
    imageBg: 'linear-gradient(135deg, #2a0a00 0%, #1a1a1a 100%)',
  },
  {
    id: 2,
    brand: 'C4',
    name: 'C4 Original 195g',
    price: 28990,
    category: 'Pre-Entreno',
    badge: null,
    description:
      'El pre-entreno más vendido del mundo. Con CarnoSyn® Beta-Alanina y Arginine AKG para aumentar tu rendimiento y resistencia.',
    inStock: true,
    image: '/images/c4-original.webp',
    imageBg: 'linear-gradient(135deg, #001a0d 0%, #1a1a1a 100%)',
  },
  {
    id: 3,
    brand: 'Makako',
    name: 'Hidra Pre-Entreno 250g',
    price: 29990,
    category: 'Pre-Entreno',
    badge: 'new',
    description:
      'Pre-entreno con electrolitos y complejo de hidratación. Ideal para entrenamientos de alta intensidad y resistencia. 25 servicios.',
    inStock: true,
    image: '/images/hidra-pre.webp',
    imageBg: 'linear-gradient(135deg, #00101a 0%, #1a1a1a 100%)',
  },
  {
    id: 4,
    brand: 'Optimum Nutrition',
    name: 'Creatina Monohidratada 600g',
    price: 22990,
    category: 'Creatina',
    badge: null,
    description:
      'Creatina micronizada de la más alta pureza. Aumenta fuerza, potencia muscular y rendimiento en ejercicios de alta intensidad. 120 servicios.',
    inStock: true,
    image: '/images/creatina-on.webp',
    imageBg: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a1a 100%)',
  },
  {
    id: 5,
    brand: 'Makako',
    name: 'Creatina HCL 120 cáps',
    price: 24990,
    category: 'Creatina',
    badge: 'new',
    description:
      'Creatina Hydrochloride de alta biodisponibilidad. Sin hinchazón ni retención de líquidos. Fórmula avanzada para máxima absorción.',
    inStock: true,
    image: '/images/creatina-hcl.webp',
    imageBg: 'linear-gradient(135deg, #1a001a 0%, #1a1a1a 100%)',
  },
  {
    id: 6,
    brand: 'Optimum Nutrition',
    name: 'Gold Standard Whey 2kg',
    price: 64990,
    category: 'Proteína',
    badge: 'hot',
    description:
      'El whey protein más reconocido del mundo. 24g de proteína por servicio con whey isolate como ingrediente principal. 67 servicios.',
    inStock: true,
    image: '/images/gold-standard-2kg.webp',
    imageBg: 'linear-gradient(135deg, #1a0d00 0%, #1a1a1a 100%)',
  },
  {
    id: 7,
    brand: 'Makako',
    name: 'Whey Premium 1.5kg',
    price: 48990,
    category: 'Proteína',
    badge: null,
    description:
      'Proteína de suero de leche premium con 25g por servicio. Mezcla de whey concentrado e isolate para máxima recuperación muscular.',
    inStock: true,
    image: '/images/whey-premium.webp',
    imageBg: 'linear-gradient(135deg, #0d1a00 0%, #1a1a1a 100%)',
  },
  {
    id: 8,
    brand: 'MuscleTech',
    name: 'Nitro Tech Isolate 1.8kg',
    price: 72990,
    category: 'Proteína',
    badge: null,
    description:
      'Proteína isolate ultra-filtrada con 30g de proteína por servicio. Con creatina y aminoácidos añadidos para máxima construcción muscular.',
    inStock: false,
    image: '/images/nitro-tech.webp',
    imageBg: 'linear-gradient(135deg, #1a1200 0%, #1a1a1a 100%)',
  },
  {
    id: 9,
    brand: 'Makako',
    name: 'Caseína Nocturna 1kg',
    price: 42990,
    category: 'Proteína',
    badge: null,
    description:
      'Proteína de liberación lenta para recuperación durante el sueño. 24g de proteína por servicio. Ideal tomarla antes de dormir.',
    inStock: true,
    image: '/images/caseina.webp',
    imageBg: 'linear-gradient(135deg, #001a1a 0%, #1a1a1a 100%)',
  },
  {
    id: 10,
    brand: 'Universal',
    name: 'Animal Pak 44 packs',
    price: 38990,
    category: 'Vitaminas',
    badge: null,
    description:
      'El multivitamínico deportivo más completo. Con vitaminas, minerales, aminoácidos y extractos de hierbas para atletas de alto rendimiento.',
    inStock: true,
    image: '/images/animal-pak.webp',
    imageBg: 'linear-gradient(135deg, #1a0000 0%, #1a1a1a 100%)',
  },
  {
    id: 11,
    brand: 'Makako',
    name: 'Vitamina C + Zinc 60 cáps',
    price: 9990,
    category: 'Vitaminas',
    badge: 'new',
    description:
      'Combinación de Vitamina C 1000mg y Zinc para fortalecer el sistema inmune. Antioxidante y apoyo en la recuperación muscular.',
    inStock: true,
    image: '/images/vitamina-c-zinc.webp',
    imageBg: 'linear-gradient(135deg, #001a0a 0%, #1a1a1a 100%)',
  },
  {
    id: 12,
    brand: 'Makako',
    name: 'Mass Gainer 3kg',
    price: 42990,
    category: 'Carbohidratos',
    badge: null,
    description:
      'Ganador de masa muscular con 1.250 calorías por servicio. Mezcla de proteínas, carbohidratos complejos y grasas saludables para subir de peso.',
    inStock: true,
    image: '/images/mass-gainer.webp',
    imageBg: 'linear-gradient(135deg, #150a00 0%, #1a1a1a 100%)',
  },
  {
    id: 13,
    brand: 'Makako',
    name: 'Carbohidratos Waxy Maize 1kg',
    price: 18990,
    category: 'Carbohidratos',
    badge: null,
    description:
      'Carbohidratos de absorción rápida para antes y después del entrenamiento. Recarga glucógeno muscular y acelera la recuperación. 40 servicios.',
    inStock: true,
    image: '/images/waxy-maize.webp',
    imageBg: 'linear-gradient(135deg, #0a0a00 0%, #1a1a1a 100%)',
  },
];
