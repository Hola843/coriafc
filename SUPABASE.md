# Escudo del club en Supabase

**Proyecto:** `https://bqlnsfeybawnirkjpkni.supabase.co`
**Bucket:** `escudo`
**Archivo:** `escudo.png` ← nombre fijo, siempre el mismo

```
Admin Site → seleccionar escudo → Supabase Storage / escudo / escudo.png
          → la web pública lee esa URL → funciona en PC, móvil y cualquier dispositivo
```

La URL del escudo es **siempre la misma** y se construye con la URL del
proyecto, que está compilada en el JavaScript de la web:

```
https://bqlnsfeybawnirkjpkni.supabase.co/storage/v1/object/public/escudo/escudo.png
```

Por eso es idéntica en todos los dispositivos. **No se usa
localStorage, sessionStorage ni IndexedDB** para el escudo ni para su
referencia, y no hacen falta credenciales para mostrarlo.

---

## 1. Variable de entorno en Arena

| Variable | Valor |
|---|---|
| `VITE_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → **anon public** |

Solo hace falta para **subir** el escudo desde el Admin. Para **verlo**
no se necesita ninguna credencial.

> ⚠️ Nunca uses la clave `service_role`. No hay claves en el código.

Opcional: `VITE_SUPABASE_URL` si cambias de proyecto, y
`VITE_CREST_URL` si prefieres fijar una URL concreta.

---

## 2. Bucket

Supabase → **Storage** → bucket `escudo` → **Public bucket activado**.

---

## 3. SQL de políticas

```sql
-- El bucket DEBE ser público para que la imagen se vea
update storage.buckets set public = true where id = 'escudo';

drop policy if exists "escudo select" on storage.objects;
drop policy if exists "escudo insert" on storage.objects;
drop policy if exists "escudo update" on storage.objects;
drop policy if exists "escudo delete" on storage.objects;

-- SELECT: ver y listar
create policy "escudo select" on storage.objects
  for select to public
  using ( bucket_id = 'escudo' );

-- INSERT: subir desde el Admin Site
create policy "escudo insert" on storage.objects
  for insert to anon, authenticated
  with check ( bucket_id = 'escudo' );

-- UPDATE: reemplazar escudo.png (upsert)
create policy "escudo update" on storage.objects
  for update to anon, authenticated
  using ( bucket_id = 'escudo' )
  with check ( bucket_id = 'escudo' );

-- DELETE: limpiar versiones antiguas
create policy "escudo delete" on storage.objects
  for delete to anon, authenticated
  using ( bucket_id = 'escudo' );
```

El Admin **no usa login de Supabase**: las peticiones van como rol
`anon`. Las políticas deben incluirlo.

---

## 4. Subir el escudo

1. `#/admin` → clave `coria1923` → pestaña **🛡️ Escudo**.
2. *Seleccionar archivo* → **Subir**.

Se sube con `x-upsert: true` al nombre fijo `escudo.png`, reemplazando
el anterior. Estados: **Subiendo…** → **✓ Escudo subido correctamente**
o **✕ Error al subir el escudo: <error real>**.

Límite de 45 s con `AbortController`: nunca se queda colgado.

---

## 5. Anti-caché

La web pide la imagen con `?v=<minuto actual>`. Ese valor se deriva del
reloj, es igual para todos los dispositivos y cambia cada minuto:
dentro del mismo minuto se aprovecha la caché, y tras sustituir el
escudo todos lo ven como mucho en 1 minuto. El archivo se sube además
con `cache-control: 60`.

---

## 6. Prueba final

1. Sube el escudo desde el Admin en el ordenador.
2. En el panel, abre el enlace **URL pública**. Debe verse la imagen.
3. Copia esa URL y ábrela **en el móvil**. Debe verse igual.
4. Abre la web en el móvil y en otro navegador → mismo escudo.

Si el paso 3 falla, el bucket no es público: ejecuta
`update storage.buckets set public = true where id = 'escudo';`
