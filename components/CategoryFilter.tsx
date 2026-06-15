'use client';

import { CATEGORIES, Category } from '@/data/products';

type SortOption = 'default' | 'price-asc' | 'price-desc';

interface CategoryFilterProps {
  active: Category;
  onSelect: (cat: Category) => void;
  count: number;
  sortBy: SortOption;
  onSort: (sort: SortOption) => void;
}

export default function CategoryFilter({
  active,
  onSelect,
  count,
  sortBy,
  onSort,
}: CategoryFilterProps) {
  return (
    <>
      <div className="categories">
        <div className="categories-scroll">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`cat-chip${active === cat ? ' active' : ''}`}
              onClick={() => onSelect(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="sort-bar">
        <span className="sort-label">
          <strong>{count}</strong> productos
        </span>
        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => onSort(e.target.value as SortOption)}
        >
          <option value="default">Destacados</option>
          <option value="price-asc">Menor precio</option>
          <option value="price-desc">Mayor precio</option>
        </select>
      </div>
    </>
  );
}
