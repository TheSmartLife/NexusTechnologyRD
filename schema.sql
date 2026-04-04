-- 1. Crear tabla de productos
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null,
  price numeric not null,
  precio_mayorista numeric,
  image text not null,
  images text[] default array[]::text[],
  available boolean default true,
  tags text[] default array[]::text[],
  specs jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Crear tabla de configuración (para el código mayorista)
create table if not exists public.config (
  id text primary key,
  value text not null
);

-- Insertar el código por defecto
insert into public.config (id, value) values ('wholesale_code', 'Nexusf1') on conflict (id) do nothing;

-- 3. Configurar la seguridad (RLS - Row Level Security)
-- Por ahora será público para que sea fácil
alter table public.products enable row level security;
alter table public.config enable row level security;

create policy "Public Access to Products"
  on public.products for all
  using (true)
  with check (true);

create policy "Public Access to Config"
  on public.config for all
  using (true)
  with check (true);

-- 4. Crear el cajón (bucket) para las imágenes de los productos
insert into storage.buckets (id, name, public) values ('images', 'images', true) on conflict (id) do nothing;

create policy "Public Access to Images"
  on storage.objects for all
  using ( bucket_id = 'images' )
  with check ( bucket_id = 'images' );
