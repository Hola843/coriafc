import { ASSETS_BUCKET, DEFAULT_PROJECT_URL, getSupabaseConfig } from "./supabase";

/* ------------------------------------------------------------------
   Escudo en Supabase Storage — sistema de nombre fijo

   · Bucket:  escudo
   · Archivo: escudo.png   (SIEMPRE el mismo nombre)
   · URL:     <proyecto>/storage/v1/object/public/escudo/escudo.png

   Al tener nombre fijo, la URL es idéntica en todos los dispositivos y
   se puede construir sin credenciales, sin listar el bucket y sin
   guardar nada en el navegador.

   NO se usa localStorage, sessionStorage ni IndexedDB para el escudo.
------------------------------------------------------------------- */

/** Nombre fijo del archivo dentro del bucket */
export const CREST_FILE = "escudo.png";

/** URL del proyecto. Pública: viaja en cada petición del navegador. */
function projectUrl(): string {
  const cfg = getSupabaseConfig();
  return (cfg?.url ?? DEFAULT_PROJECT_URL).replace(/\/+$/, "");
}

/** URL pública base del escudo, sin parámetros */
export function crestBaseUrl(): string {
  const override = import.meta.env.VITE_CREST_URL?.trim();
  if (override) return override;
  return `${projectUrl()}/storage/v1/object/public/${ASSETS_BUCKET}/${CREST_FILE}`;
}

/**
 * URL del escudo con anti-caché.
 *
 * El parámetro cambia cada minuto y es IGUAL para todos los
 * dispositivos (se deriva del reloj, no de nada almacenado). Así:
 *   · dentro del mismo minuto el navegador reutiliza su caché,
 *   · tras sustituir el escudo, todos lo ven como mucho en 1 minuto.
 */
export function crestUrl(): string {
  const bucketMinute = Math.floor(Date.now() / 60000);
  const base = crestBaseUrl();
  return `${base}${base.includes("?") ? "&" : "?"}v=${bucketMinute}`;
}

/* ----------------------------- Subida ------------------------------ */

function auth() {
  const cfg = getSupabaseConfig();
  if (!cfg?.anonKey) return null;
  return {
    url: cfg.url.replace(/\/+$/, ""),
    headers: {
      apikey: cfg.anonKey,
      Authorization: `Bearer ${cfg.anonKey}`,
    },
  };
}

async function readError(res: Response): Promise<string> {
  let body = "";
  try {
    body = await res.text();
  } catch {
    /* sin cuerpo */
  }
  try {
    const json = JSON.parse(body) as Record<string, unknown>;
    const parts: string[] = [];
    for (const k of ["error", "message", "statusCode", "code", "hint"]) {
      if (json[k]) parts.push(`${k}=${String(json[k])}`);
    }
    if (parts.length > 0) return `HTTP ${res.status} · ${parts.join(" · ")}`;
  } catch {
    /* no era JSON */
  }
  return `HTTP ${res.status} ${res.statusText}${body ? ` · ${body.slice(0, 300)}` : ""}`;
}

function hintFor(status: number | undefined, raw: string): string {
  if (status === 404 || /bucket not found|not found/i.test(raw)) {
    return ` → El bucket «${ASSETS_BUCKET}» no existe o el nombre no coincide.`;
  }
  if (status === 401) return " → Clave anon no válida. Revisa VITE_SUPABASE_ANON_KEY.";
  if (status === 403 || /row-level security|policy|unauthorized/i.test(raw)) {
    return " → Faltan políticas INSERT/UPDATE sobre storage.objects para el rol anon. Copia el SQL del panel.";
  }
  if (status === 413) return " → El archivo supera el límite de tamaño del bucket.";
  return "";
}

export type UploadResult = { ok: boolean; error?: string; status?: number };

/**
 * Sube (o reemplaza) el escudo con sus BYTES ORIGINALES.
 * Siempre al mismo nombre: escudo.png, con upsert.
 * fetch + AbortController: nunca se queda colgado.
 */
export async function uploadCrest(file: Blob, timeoutMs = 45000): Promise<UploadResult> {
  const a = auth();
  if (!a) {
    return {
      ok: false,
      error:
        "Falta la clave de Supabase. Define VITE_SUPABASE_ANON_KEY en Arena o introdúcela en el panel.",
    };
  }

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${a.url}/storage/v1/object/${ASSETS_BUCKET}/${CREST_FILE}`, {
      method: "POST",
      headers: {
        ...a.headers,
        "x-upsert": "true", // reemplaza el archivo existente
        "cache-control": "60",
        ...(file.type ? { "content-type": file.type } : {}),
      },
      body: file,
      signal: controller.signal,
    });

    if (!res.ok) {
      const raw = await readError(res);
      return { ok: false, status: res.status, error: raw + hintFor(res.status, raw) };
    }
    return { ok: true, status: res.status };
  } catch (e) {
    const aborted = e instanceof DOMException && e.name === "AbortError";
    const raw = e instanceof Error ? e.message : String(e);
    return {
      ok: false,
      error: aborted
        ? `La subida no respondió en ${timeoutMs / 1000}s. Comprueba la URL del proyecto, que el bucket «${ASSETS_BUCKET}» exista y que el proyecto no esté pausado.`
        : /failed to fetch|networkerror|load failed/i.test(raw)
          ? `No se pudo contactar con Supabase (${raw}). Revisa la URL del proyecto.`
          : raw,
    };
  } finally {
    window.clearTimeout(timer);
  }
}

/** Elimina el escudo del bucket */
export async function deleteCrest(timeoutMs = 15000): Promise<UploadResult> {
  const a = auth();
  if (!a) return { ok: false, error: "Supabase no está configurado." };

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${a.url}/storage/v1/object/${ASSETS_BUCKET}/${CREST_FILE}`, {
      method: "DELETE",
      headers: a.headers,
      signal: controller.signal,
    });
    if (!res.ok) {
      const raw = await readError(res);
      return { ok: false, status: res.status, error: raw + hintFor(res.status, raw) };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  } finally {
    window.clearTimeout(timer);
  }
}

/** Limpia archivos antiguos que no sean escudo.png */
export async function cleanOldFiles(timeoutMs = 15000): Promise<string[]> {
  const a = auth();
  if (!a) return [];
  try {
    const list = await fetch(`${a.url}/storage/v1/object/list/${ASSETS_BUCKET}`, {
      method: "POST",
      headers: { ...a.headers, "content-type": "application/json" },
      body: JSON.stringify({ prefix: "", limit: 100 }),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!list.ok) return [];
    const rows = (await list.json()) as { name: string }[];
    const stale = rows
      .map((r) => r.name)
      .filter((n) => n && !n.startsWith(".") && n !== CREST_FILE);
    if (stale.length === 0) return [];

    await fetch(`${a.url}/storage/v1/object/${ASSETS_BUCKET}`, {
      method: "DELETE",
      headers: { ...a.headers, "content-type": "application/json" },
      body: JSON.stringify({ prefixes: stale }),
      signal: AbortSignal.timeout(timeoutMs),
    });
    return stale;
  } catch {
    return [];
  }
}

/** Comprueba si el escudo existe y es accesible públicamente */
export async function checkCrest(
  timeoutMs = 10000,
): Promise<{ ok: boolean; status?: number; error?: string }> {
  try {
    const res = await fetch(crestUrl(), {
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
    });
    return { ok: res.ok, status: res.status };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
