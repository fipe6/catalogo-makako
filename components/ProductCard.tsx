'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  onClick: (product: Product) => void;
}

function formatPrice(price: number) {
  return `$${price.toLocaleString('es-CL')}`;
}

export default function ProductCard({ product, priority = false, onClick }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <article
      className={`product-card${!product.inStock ? ' out-of-stock' : ''}`}
      onClick={() => onClick(product)}
    >
      {product.badge === 'new' && <span className="badge badge-new">Nuevo</span>}
      {product.badge === 'hot' && <span className="badge badge-hot">🔥 Top</span>}
      {!product.inStock && <span className="badge badge-out">Agotado</span>}

      <div className="product-img-wrap">
        {!imgError ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-300"
            priority={priority}
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="product-img-placeholder"
            style={{ background: product.imageBg }}
          >
            <span className="product-img-label">{product.brand}</span>
          </div>
        )}
      </div>

      <div className="product-info">
        <div className="product-brand">{product.brand}</div>
        <div className="product-name">{product.name}</div>
        <div className="product-footer">
          {product.inStock ? (
            <>
              <span className="product-price">{formatPrice(product.price)}</span>
              <button className="btn-add" aria-label="Ver producto">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </>
          ) : (
            <>
              <span className="product-price">{formatPrice(product.price)}</span>
              <span className="out-of-stock-label">Agotado</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
