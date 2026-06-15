import { products } from '@/data/products';

export default function Hero() {
  const inStockCount = products.filter((p) => p.inStock).length;
  const categoryCount = new Set(products.map((p) => p.category)).size;

  return (
    <section className="hero">
      <span className="hero-tag">⚡ CATÁLOGO OFICIAL</span>
      <h1>
        SUPLEMENTOS <span>MAKAKO</span>
      </h1>
      <p>Los mejores suplementos al mejor precio. Envíos a todo Chile.</p>
      <div className="hero-stats">
        <div>
          <div className="stat-num">{products.length}</div>
          <div className="stat-label">Productos</div>
        </div>
        <div>
          <div className="stat-num">{categoryCount}</div>
          <div className="stat-label">Categorías</div>
        </div>
        <div>
          <div className="stat-num">{inStockCount}</div>
          <div className="stat-label">Disponibles</div>
        </div>
      </div>
    </section>
  );
}
