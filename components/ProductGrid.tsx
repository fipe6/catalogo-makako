'use client';

import { Product } from '@/data/products';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  categoryLabel: string;
}

export default function ProductGrid({ products, onProductClick, categoryLabel }: ProductGridProps) {
  return (
    <section className="products-section">
      <div className="section-title">{categoryLabel}</div>

      <div className="products-grid">
        {products.length === 0 ? (
          <div className="empty-state">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <p>No se encontraron productos</p>
          </div>
        ) : (
          products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < 4}
              onClick={onProductClick}
            />
          ))
        )}
      </div>
    </section>
  );
}
