# Integración con Supabase — escudo del club

**Proyecto:** `https://bqlnsfeybawnirkjpkni.supabase.co`
**Bucket:** `escudo`

El escudo se guarda de forma **permanente** en Supabase Storage. La web
lo resuelve en cada arranque, así que persiste aunque reinicies,
actualices o republiques. No depende del almacenamiento de Arena.

---

## 1. Variable de entorno en Arena

Solo necesitas **una**:

| Variable | Valor |
|---|---|
| `VITE_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → **anon public** |

La Project URL ya está configurada por defecto en el código
(`https://bqlnsfeybawnirkjpkni.supabase.co`). No es un secreto: viaja en
cada petición del navegador. Si quisieras cambiar de proyecto, define
también `VITE_SUPABASE_URL`.

> ⚠️ Usa **solo** la clave `anon public`. **Nunca** la `service_role`.
> No hay ninguna clave escrita en el código.

Tras añadirla, **vuelve a publicar** la web.

---

## 2. Bucket

Supabase → **Storage** → el bucket debe llamarse exactamente `escudo`
y estar marcado como **Public**.

---

## 3. SQL de políticas

Supabase → **SQL Editor** → ejecuta (es repetible):

```sql
-- El bucket debe ser público para que la imagen se vea
update storage.buckets set public = true where id = 'escudo';

drop policy if exists "escudo lectura" on storage.objects;
drop policy if exists "escudo subida"  on storage.objects;
drop policy if exists "escudo update"  on storage.objects;
drop policy if exists "escudo borrado" on storage.objects;

-- Leer y listar (la web localiza el archivo del bucket)
create policy "escudo lectura" on storage.objects
  for select to anon, authenticated
  using ( bucket_id = 'escudo' );

-- Subir desde el Admin Site
create policy "escudo subida" on storage.objects
  for insert to anon, authenticated
  with check ( bucket_id = 'escudo' );

-- Reemplazar
create policy "escudo update" on storage.objects
  for update to anon, authenticated
  using ( bucket_id = 'escudo' )
  with check ( bucket_id = 'escudo' );

-- Borrar el anterior al subir uno nuevo
create policy "escudo borrado" on storage.objects
  for delete to anon, authenticated
  using ( bucket_id = 'escudo' );
```

El Admin Site **no usa login de Supabase**: las peticiones viajan como
rol `anon`. Por eso las políticas deben incluir `anon`, no solo
`authenticated`.

---

## 4. Subir el escudo

**Desde el Admin Site:**

1. Área privada: punto discreto al final del pie, `Ctrl + Shift + A`, o `#/admin`.
2. Clave: `coria1923`.
3. Pestaña **🛡️ Escudo**.
4. *Seleccionar archivo* (o arrástralo) → pulsa **Subir**.

Estados que verás: **Subiendo…** → **✓ Escudo subido correctamente** o
**✕ Error al subir el escudo: <motivo real de Supabase>**.

La subida tiene un límite de 45 s y usa `AbortController`: nunca se
queda colgada. Al subir uno nuevo, el anterior se borra del bucket.

**Alternativa manual:** sube el archivo en Supabase → Storage → `escudo`
y pulsa *Recargar* en el panel.

---

## 5. Comprobación

En la pestaña Escudo pulsa **Ejecutar diagnóstico**. Verifica:

1. Credenciales.
2. Que el proyecto responde.
3. Lectura del bucket `escudo`.
4. Que hay un archivo de escudo.
5. Que su URL pública carga.

---

## 6. Problemas frecuentes

| Error | Causa | Solución |
|---|---|---|
| HTTP 401 | Clave anon ausente o incorrecta | Revisa `VITE_SUPABASE_ANON_KEY` y republica |
| HTTP 403 / *row-level security* | Políticas sin el rol `anon` | Ejecuta el SQL del punto 3 |
| HTTP 404 / *Bucket not found* | El bucket no se llama `escudo` | Renómbralo o créalo |
| La URL pública da 400 | Bucket no público | `update storage.buckets set public = true where id = 'escudo';` |
| Sin respuesta | Proyecto pausado | Reactívalo en el dashboard de Supabase |
