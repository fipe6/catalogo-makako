'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Product, WHATSAPP_NUMBER } from '@/data/products';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

function formatPrice(price: number) {
  return `$${price.toLocaleString('es-CL')}`;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [imgError, setImgError] = useState(false);

  const waMessage = `Hola! Me interesa ${product.name} (${formatPrice(product.price)}). ¿Está disponible? 💪`;
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `${product.name} — ${formatPrice(product.price)} en Makako Fit`,
          url: window.location.href,
        });
      } catch {
        // user cancelled
      }
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <div className="modal-sheet">
        <div className="modal-handle" />

        <button className="modal-close" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>

        <div className="modal-img">
          {!imgError ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              style={{ width: '100%', height: '100%', background: product.imageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <span style={{ fontFamily: 'var(--font-bebas-neue)', fontSize: '2rem', color: 'var(--gold)', opacity: 0.25, letterSpacing: '0.2em' }}>
                {product.brand}
              </span>
            </div>
          )}
        </div>

        <div className="modal-brand">{product.brand}</div>
        <div className="modal-name">{product.name}</div>
        <div className="modal-price">{formatPrice(product.price)}</div>
        <p className="modal-desc">{product.description}</p>

        <div className={`modal-stock${!product.inStock ? ' agotado' : ''}`}>
          <span className="modal-stock-dot" />
          {product.inStock ? 'Disponible' : 'Agotado'}
        </div>

        <div className="modal-actions">
          {product.inStock ? (
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-wa-full">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M11.99 2C6.476 2 2 6.477 2 11.99c0 1.76.464 3.409 1.276 4.838L2 22l5.308-1.256A9.95 9.95 0 0 0 11.99 22C17.505 22 22 17.522 22 12.01 22 6.477 17.505 2 11.99 2zm0 18.011a8 8 0 0 1-4.08-1.116l-.292-.173-3.152.747.766-3.07-.19-.315A8.001 8.001 0 0 1 3.989 12 8 8 0 0 1 12 4a8 8 0 0 1 8 8c0 4.411-3.588 8.011-8.01 8.011z" />
              </svg>
              PEDIR POR WHATSAPP
            </a>
          ) : (
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola! Quiero saber cuándo vuelve a estar disponible ${product.name} 💪`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa-full"
              style={{ background: '#555' }}
            >
              AVISAR CUANDO HAYA STOCK
            </a>
          )}
          <button className="btn-share" onClick={handleShare} aria-label="Compartir">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
