'use client';

import { useState, useMemo } from 'react';
import { products, Product, Category, WHATSAPP_NUMBER } from '@/data/products';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import ProductGrid from '@/components/ProductGrid';
import ProductModal from '@/components/ProductModal';

type SortOption = 'default' | 'price-asc' | 'price-desc';

export default function CatalogPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return products
      .filter((p) => activeCategory === 'Todos' || p.category === activeCategory)
      .filter(
        (p) =>
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return a.id - b.id;
      });
  }, [activeCategory, searchQuery, sortBy]);

  const categoryLabel =
    activeCategory === 'Todos' ? 'Todos los productos' : activeCategory;

  return (
    <>
      <Header />
      <Hero />
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <CategoryFilter
        active={activeCategory}
        onSelect={setActiveCategory}
        count={filtered.length}
        sortBy={sortBy}
        onSort={setSortBy}
      />
      <main>
        <ProductGrid
          products={filtered}
          onProductClick={setSelectedProduct}
          categoryLabel={categoryLabel}
        />
      </main>

      <nav className="bottom-nav" aria-label="Navegación principal">
        <button className="nav-item active" aria-label="Catálogo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <span style={{ fontSize: '10px' }}>Catálogo</span>
        </button>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="nav-item"
          aria-label="WhatsApp"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span style={{ fontSize: '10px' }}>Consultas</span>
        </a>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola! ¿Cuál es el costo de envío? 📦')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="nav-item"
          aria-label="Envíos"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="1" y="3" width="15" height="13" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          <span style={{ fontSize: '10px' }}>Envíos</span>
        </a>
      </nav>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}
