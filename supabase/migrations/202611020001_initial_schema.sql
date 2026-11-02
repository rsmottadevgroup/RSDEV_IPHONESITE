create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create table public.categories (
  id text primary key,
  name text not null unique,
  description text not null default '',
  image_url text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  model text not null default '',
  category_id text not null references public.categories (id),
  brand text not null default 'Apple',
  price numeric(12, 2) not null check (price >= 0),
  compare_at_price numeric(12, 2) not null default 0 check (compare_at_price >= 0),
  storage_label text not null default '-',
  color_label text not null default 'Padrão',
  condition text not null default 'Novo',
  availability text not null default 'Em estoque',
  rating numeric(2, 1) not null default 5 check (rating between 0 and 5),
  reviews integer not null default 0 check (reviews >= 0),
  image_url text not null default '',
  images text[] not null default '{}',
  description text not null default '',
  specs jsonb not null default '{}',
  colors text[] not null default '{}',
  storages text[] not null default '{}',
  is_featured boolean not null default false,
  is_new boolean not null default false,
  discount_percent integer not null default 0 check (discount_percent between 0 and 100),
  inventory_count integer check (inventory_count is null or inventory_count >= 0),
  is_seeded boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_vector tsvector generated always as (
    to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(model, '') || ' ' || coalesce(description, ''))
  ) stored
);

create index products_category_id_idx on public.products (category_id);
create index products_active_price_idx on public.products (is_active, price);
create index products_search_idx on public.products using gin (search_vector);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  customer_name text not null,
  customer_email text,
  customer_whatsapp text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'processing', 'shipped', 'completed', 'cancelled')),
  subtotal numeric(12, 2) not null default 0 check (subtotal >= 0),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_user_created_idx on public.orders (user_id, created_at desc);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  product_name text not null,
  unit_price numeric(12, 2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  selected_color text not null default '',
  selected_storage text not null default '',
  created_at timestamptz not null default now()
);

create index order_items_order_id_idx on public.order_items (order_id);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'resolved', 'spam')),
  created_at timestamptz not null default now()
);

create table public.site_settings (
  key text primary key,
  value jsonb not null default '{}',
  is_public boolean not null default false,
  updated_at timestamptz not null default now()
);

insert into public.categories (id, name, description, image_url, sort_order) values
  ('iphone', 'iPhone', 'O smartphone que redefiniu o mercado', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80', 1),
  ('macbook', 'MacBook', 'Performance e elegância em um só dispositivo', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80', 2),
  ('ipad', 'iPad', 'Criatividade e produtividade em qualquer lugar', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80', 3),
  ('apple-watch', 'Apple Watch', 'Saúde e estilo no seu pulso', 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&q=80', 4),
  ('airpods', 'AirPods', 'Áudio imersivo sem fios', 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&q=80', 5),
  ('acessorios', 'Acessórios', 'Complementos para seus dispositivos', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80', 6)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order;

insert into public.site_settings (key, value, is_public) values
  ('store_name', '"Apple Premium"'::jsonb, true),
  ('whatsapp_number', '"5514998894962"'::jsonb, true)
on conflict (key) do nothing;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.create_customer_profile()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, role) values (new.id, 'customer');
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.create_customer_profile();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.contact_messages enable row level security;
alter table public.site_settings enable row level security;

create policy "Profiles are visible to their owner or admins"
on public.profiles for select to authenticated
using (id = (select auth.uid()) or (select public.is_admin()));

create policy "Categories are public"
on public.categories for select to anon, authenticated
using (true);

create policy "Admins manage categories"
on public.categories for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Active products are public"
on public.products for select to anon, authenticated
using (is_active or (select public.is_admin()));

create policy "Admins insert products"
on public.products for insert to authenticated
with check ((select public.is_admin()));

create policy "Admins update products"
on public.products for update to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Admins delete products"
on public.products for delete to authenticated
using ((select public.is_admin()));

create policy "Customers read their orders"
on public.orders for select to authenticated
using (user_id = (select auth.uid()) or (select public.is_admin()));

create policy "Customers create their own orders"
on public.orders for insert to authenticated
with check (user_id = (select auth.uid()));

create policy "Admins update orders"
on public.orders for update to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Order items are visible to the order owner or admins"
on public.order_items for select to authenticated
using (
  (select public.is_admin()) or exists (
    select 1 from public.orders
    where orders.id = order_items.order_id and orders.user_id = (select auth.uid())
  )
);

create policy "Customers add items to their own orders"
on public.order_items for insert to authenticated
with check (exists (
  select 1 from public.orders
  where orders.id = order_items.order_id and orders.user_id = (select auth.uid())
));

create policy "Admins manage order items"
on public.order_items for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Anyone can send a contact message"
on public.contact_messages for insert to anon, authenticated
with check (length(trim(name)) > 0 and length(trim(email)) > 3 and length(trim(message)) > 0);

create policy "Admins manage contact messages"
on public.contact_messages for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Public settings are readable"
on public.site_settings for select to anon, authenticated
using (is_public or (select public.is_admin()));

create policy "Admins manage site settings"
on public.site_settings for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

grant usage on schema public to anon, authenticated;
grant select on public.categories, public.products, public.site_settings to anon, authenticated;
grant select on public.profiles to authenticated;
grant insert, select, update on public.orders to authenticated;
grant insert, select on public.order_items to authenticated;
grant insert on public.contact_messages to anon, authenticated;
grant select, update on public.contact_messages to authenticated;
grant insert, update, delete on public.categories, public.products, public.site_settings to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Product images are publicly readable"
on storage.objects for select to anon, authenticated
using (bucket_id = 'product-images');

create policy "Admins upload product images"
on storage.objects for insert to authenticated
with check (bucket_id = 'product-images' and (select public.is_admin()));

create policy "Admins update product images"
on storage.objects for update to authenticated
using (bucket_id = 'product-images' and (select public.is_admin()))
with check (bucket_id = 'product-images' and (select public.is_admin()));

create policy "Admins delete product images"
on storage.objects for delete to authenticated
using (bucket_id = 'product-images' and (select public.is_admin()));