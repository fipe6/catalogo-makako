-- Makako Fit Catálogo — esquema Supabase
-- Ejecutar completo en: Supabase Dashboard > SQL Editor > New query > Run
-- Proyecto: jmvbdjahitdhbvrfblnh (compartido con Macaco OS)

create extension if not exists "pgcrypto";

-- ── CATEGORIES ──────────────────────────────────────────────────────────
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

insert into categories (name, sort_order) values
  ('Pre-Entreno', 1),
  ('Creatina', 2),
  ('Proteína', 3),
  ('Vitaminas', 4),
  ('Carbohidratos', 5)
on conflict (name) do nothing;

-- ── PRODUCTS ────────────────────────────────────────────────────────────
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  name text not null,
  price integer not null check (price >= 0),
  category text not null references categories(name) on update cascade,
  badge text check (badge in ('new', 'hot', 'out')),
  description text not null default '',
  in_stock boolean not null default true,
  image_url text not null,
  image_bg text not null default 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on products (category);

-- ── ROW LEVEL SECURITY ─────────────────────────────────────────────────
-- Lectura pública (la tienda la necesita). Las escrituras (insert/update/delete)
-- se hacen solo desde las API routes del panel admin usando la service_role key,
-- que ignora RLS — por eso no se necesitan policies de escritura.
alter table categories enable row level security;
alter table products enable row level security;

drop policy if exists "categories_public_read" on categories;
create policy "categories_public_read" on categories for select using (true);

drop policy if exists "products_public_read" on products;
create policy "products_public_read" on products for select using (true);

-- ── STORAGE: bucket público para imágenes de productos ────────────────
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product_images_public_read" on storage.objects;
create policy "product_images_public_read" on storage.objects
  for select using (bucket_id = 'product-images');
