export type Category = 'Todos' | 'Pre-Entreno' | 'Creatina' | 'Proteína' | 'Vitaminas' | 'Carbohidratos';
export type Badge = 'new' | 'hot' | 'out' | null;

export interface Product {
  id: string;
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
