-- ==================================================================
--  BASE DE DATOS DEL CMS — Coria C.F. (Coria del Río, Sevilla)
--  Ejecutar en Supabase → SQL Editor → New query → Run
-- ==================================================================

-- ─────────────────────────────────────────────
--  1. Tabla principal de contenido
-- ─────────────────────────────────────────────
create table if not exists public.site_content (
  id          text primary key,
  content     jsonb        not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  updated_by  text
);

comment on table public.site_content is
  'Contenido editable del Admin Site: noticias, equipos, partidos, clasificacion, plantilla y entradas.';

-- ─────────────────────────────────────────────
--  2. Registro de publications (historial)
-- ─────────────────────────────────────────────
create table if not exists public.content_revisions (
  id          bigserial primary key,
  content_id  text        not null references public.site_content(id) on delete cascade,
  content     jsonb       not null,
  note        text,
  created_at  timestamptz not null default now()
);

create index if not exists content_revisions_content_id_idx
  on public.content_revisions (content_id, created_at desc);

-- ─────────────────────────────────────────────
--  3. Seguridad (RLS)
-- ─────────────────────────────────────────────
alter table public.site_content     enable row level security;
alter table public.content_revisions enable row level security;

-- La web publica solo LEE
drop policy if exists "site_content: lectura publica" on public.site_content;
create policy "site_content: lectura publica" on public.site_content
  for select to anon, authenticated using ( true );

-- El Admin Site escribe con la clave anon
drop policy if exists "site_content: escritura" on public.site_content;
create policy "site_content: escritura" on public.site_content
  for insert to anon, authenticated with check ( true );

drop policy if exists "site_content: actualizacion" on public.site_content;
create policy "site_content: actualizacion" on public.site_content
  for update to anon, authenticated using ( true ) with check ( true );

drop policy if exists "site_content: borrado" on public.site_content;
create policy "site_content: borrado" on public.site_content
  for delete to anon, authenticated using ( true );

-- Historial: insertar y leer
drop policy if exists "content_revisions: escritura" on public.content_revisions;
create policy "content_revisions: escritura" on public.content_revisions
  for insert to anon, authenticated with check ( true );

drop policy if exists "content_revisions: lectura" on public.content_revisions;
create policy "content_revisions: lectura" on public.content_revisions
  for select to anon, authenticated using ( true );

-- ─────────────────────────────────────────────
--  4. Fila inicial
-- ─────────────────────────────────────────────
insert into public.site_content (id, content)
values ('coria-cf', '{}'::jsonb)
on conflict (id) do nothing;

-- ─────────────────────────────────────────────
--  5. Verificacion
-- ─────────────────────────────────────────────
select * from public.site_content;