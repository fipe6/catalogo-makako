'use client';

import { useEffect, useState, FormEvent, CSSProperties } from 'react';
import Image from 'next/image';
import type { Product, Category, Badge } from '@/data/products';
import { CATEGORIES } from '@/data/products';

type FormState = {
  brand: string;
  name: string;
  price: string;
  category: Exclude<Category, 'Todos'>;
  badge: Exclude<Badge, null> | '';
  description: string;
  inStock: boolean;
};

const EMPTY_FORM: FormState = {
  brand: '',
  name: '',
  price: '',
  category: 'Pre-Entreno',
  badge: '',
  description: '',
  inStock: true,
};

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoadingList(true);
    const res = await fetch('/api/products');
    if (res.ok) {
      const data = await res.json();
      setProducts(data.products);
    }
    setLoadingList(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setImageFile(null);
    setEditingId(null);
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      brand: p.brand,
      name: p.name,
      price: String(p.price),
      category: p.category,
      badge: p.badge ?? '',
      description: p.description,
      inStock: p.inStock,
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingId && !imageFile) {
      setMessage('Selecciona una imagen');
      return;
    }
    setSubmitting(true);
    setMessage('');

    const fd = new FormData();
    fd.append('brand', form.brand);
    fd.append('name', form.name);
    fd.append('price', form.price);
    fd.append('category', form.category);
    fd.append('badge', form.badge ?? '');
    fd.append('description', form.description);
    fd.append('inStock', String(form.inStock));
    if (imageFile) fd.append('image', imageFile);

    const res = editingId
      ? await fetch(`/api/products/${editingId}`, { method: 'PUT', body: fd })
      : await fetch('/api/products', { method: 'POST', body: fd });

    setSubmitting(false);

    if (res.ok) {
      setMessage(editingId ? 'Producto actualizado.' : 'Producto agregado al catálogo.');
      resetForm();
      loadProducts();
    } else {
      const data = await res.json().catch(() => ({}));
      setMessage(data.error || 'Ocurrió un error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setMessage('Producto eliminado.');
      if (editingId === id) resetForm();
      loadProducts();
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.reload();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d0d', color: '#F0F0F0', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#F5A800', fontFamily: 'var(--font-bebas-neue), sans-serif', fontSize: '2rem' }}>
            MAKAKO FIT ADMIN
          </h1>
          <button onClick={handleLogout} style={ghostButtonStyle}>
            Salir
          </button>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>
            {editingId ? 'Editar producto' : 'Agregar producto nuevo'}
          </h2>
          <input
            placeholder="Marca"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            required
            style={inputStyle}
          />
          <input
            placeholder="Nombre del producto"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            style={inputStyle}
          />
          <input
            placeholder="Precio (CLP)"
            type="number"
            min="0"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
            style={inputStyle}
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as Exclude<Category, 'Todos'> })}
            style={inputStyle}
          >
            {CATEGORIES.filter((c) => c !== 'Todos').map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={form.badge}
            onChange={(e) => setForm({ ...form, badge: e.target.value as Exclude<Badge, null> | '' })}
            style={inputStyle}
          >
            <option value="">Sin etiqueta</option>
            <option value="new">Nuevo</option>
            <option value="hot">Hot</option>
            <option value="out">Agotado</option>
          </select>
          <textarea
            placeholder="Descripción"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' as const }}
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
            />
            En stock
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            required={!editingId}
            style={inputStyle}
          />
          {editingId && (
            <p style={{ color: '#888', fontSize: '0.8rem', margin: 0 }}>
              Deja la imagen vacía para mantener la actual.
            </p>
          )}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" disabled={submitting} style={primaryButtonStyle}>
              {submitting ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Agregar producto'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} style={ghostButtonStyle}>
                Cancelar
              </button>
            )}
          </div>
          {message && <p style={{ color: '#F5A800', fontSize: '0.85rem', margin: 0 }}>{message}</p>}
        </form>

        <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Catálogo actual ({products.length})</h2>
        {loadingList ? (
          <p>Cargando...</p>
        ) : (
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {products.map((p) => (
              <div key={p.id} style={productRowStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                  <div style={{ position: 'relative', width: 44, height: 44, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: p.imageBg }}>
                    <Image src={p.image} alt={p.name} fill style={{ objectFit: 'cover' }} sizes="44px" />
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <strong>{p.brand}</strong> — {p.name}{' '}
                    <span style={{ color: '#888' }}>({p.category})</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button onClick={() => startEdit(p)} style={editButtonStyle}>
                    Editar
                  </button>
                  <button onClick={() => handleDelete(p.id)} style={deleteButtonStyle}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle: CSSProperties = {
  background: '#0d0d0d',
  border: '1px solid #2e2e2e',
  borderRadius: '8px',
  padding: '0.6rem 0.75rem',
  color: '#F0F0F0',
  fontSize: '0.9rem',
  width: '100%',
  boxSizing: 'border-box',
};

const formStyle: CSSProperties = {
  background: '#1a1a1a',
  border: '1px solid #2e2e2e',
  borderRadius: '12px',
  padding: '1.5rem',
  marginBottom: '2rem',
  display: 'grid',
  gap: '0.75rem',
};

const primaryButtonStyle: CSSProperties = {
  background: '#F5A800',
  color: '#0d0d0d',
  fontWeight: 700,
  padding: '0.75rem 1.25rem',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
};

const ghostButtonStyle: CSSProperties = {
  background: 'transparent',
  border: '1px solid #2e2e2e',
  color: '#888',
  padding: '0.6rem 1rem',
  borderRadius: '6px',
  cursor: 'pointer',
};

const editButtonStyle: CSSProperties = {
  background: 'transparent',
  border: '1px solid #F5A800',
  color: '#F5A800',
  padding: '0.4rem 0.8rem',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.85rem',
};

const deleteButtonStyle: CSSProperties = {
  background: 'transparent',
  border: '1px solid #CC1F1F',
  color: '#CC1F1F',
  padding: '0.4rem 0.8rem',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.85rem',
};

const productRowStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: '#1a1a1a',
  border: '1px solid #2e2e2e',
  borderRadius: '8px',
  padding: '0.6rem 1rem',
  gap: '1rem',
};
