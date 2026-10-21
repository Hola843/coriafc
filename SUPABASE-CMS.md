# Admin Site conectado a Supabase

El contenido del panel de administración ya no vive en el navegador:
se guarda en la base de datos de Supabase y se recupera en cada carga.

```
Admin Site ──guarda──▶ Supabase (tabla site_content)
                             ▲
             web pública ──lee┘
```

## Qué resuelve

- Los cambios se ven en **cualquier dispositivo**: móvil, otro ordenador,
  otra pestaña.
- No se pierden al **recargar, reiniciar o republicar** la web.
- El contenido queda **versionado** en la tabla `content_revisions`.
- Si Supabase no está disponible, la web sigue funcionando con una
  copia local como respaldo.

## Puesta en marcha

### 1. Crea las tablas

**Opción A — desde el SQL Editor (recomendado)**

Abre el archivo **`SUPABASE-CMS.sql`** de este proyecto, cópialo en
**Supabase → SQL Editor → New query** y pulsa *Run*.

**Opción B — desde tu ordenador**

Añade la clave `service_role` a tu `.env` (solo en local, nunca en el
repositorio) y ejecuta:

```bash
node scripts/crear-tablas.mjs
```

Cualquiera de las dos opciones crea las tablas `site_content` y
`content_revisions`, sus políticas RLS y la fila inicial.

> **¿Por qué el error de sincronización?** La conexión con Supabase
> siempre ha funcionado; lo que falta son las tablas. La API pública
> de PostgREST no permite crearlas, por eso hay que hacerlo una vez
> desde el SQL Editor.

### 2. Las variables de entorno

Ya están configuradas en `.env`:

```
VITE_SUPABASE_URL=https://bqlnsfeybawnirkjpkni.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

> La clave `anon public` está pensada para usarse en el navegador: su
> seguridad depende de las políticas RLS, no de ocultarla. Nunca uses
> `service_role` en el frontend.

### 3. Listo

Entra en el panel (`Ctrl+Shift+A` o `#/admin`, clave `coria1923`). En la
barra superior verás el estado de sincronización:

| Indicador | Significado |
|---|---|
| ☁ Sincronizado con Supabase | Todo correcto |
| ⟳ Sincronizando… | Descargando o guardando |
| Sin conexión (respaldo local) | Usando la copia del navegador |
| Error de sincronización | Revisa el mensaje en rojo |

Los botones **↓ Traer** y **↑ Guardar** permiten forzar la
sincronización manualmente.

## Cómo funciona el guardado

Cada cambio en el panel se guarda de dos formas:

1. **Inmediato en localStorage** — copia de respaldo, para no perder
   trabajo si se cierra el navegador sin conexión.
2. **Con 1,2 s de retardo en Supabase** — agrupar los cambios evita
   saturar la base de datos cuando editas varios campos seguidos.

## Tablas

### `site_content`
Una fila por sitio. La columna `content` es un `jsonb` con todo el
contenido: noticias, equipos, partidos, clasificación, plantilla,
entradas, Ticketing… El identificador `id` es `coria-cf`.

### `content_revisions`
Historial. Cada guardado añade una fila con el contenido completo, lo
que permite recuperar versiones anteriores.

## Resolución de conflictos

Si el contenido se ha modificado en la nube mientras alguien editaba
en local, al recargar la página **gana la versión de Supabase**: es la
fuente de verdad. Usa *Traer* para forzar la descarga y *Guardar* para
subir tu versión local.

## Variables del panel

| Dónde | Qué controla |
|---|---|
| `.env` | URL y clave de Supabase |
| `SUPABASE-CMS.sql` | Esquema y políticas de la base de datos |
| `src/lib/cms.ts` | Lectura y escritura en la nube |
| `src/store/content.tsx` | Estado y sincronización del contenido |

## Seguridad

Las políticas RLS de `SUPABASE-CMS.sql` permiten lectura pública y
escritura con la clave `anon`. Eso significa que **cualquiera que
conozca la clave anon puede modificar el contenido**.

Para producción es recomendable añadir autenticación de Supabase
(Supabase Auth) y cambiar las políticas de escritura a:

```sql
create policy "site_content: escritura" on public.site_content
  for insert to authenticated with check ( true );
```

Así solo los usuarios registrados en Supabase podrían modificar el
contenido.