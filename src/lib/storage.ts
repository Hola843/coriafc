import { ASSETS_BUCKET, getSupabaseConfig } from "./supabase";

/* ------------------------------------------------------------------
   Lectura del escudo desde Supabase Storage (bucket «escudo»).

   La web NO sube archivos: el escudo se sube manualmente una sola vez
   desde Supabase → Storage → escudo. En cada arranque la web localiza
   el archivo del bucket y usa su URL pública permanente.

   Todas las peticiones usan fetch con AbortController, de modo que
   nunca pueden quedarse colgadas.

   Solo se usa la clave anon pública. Nunca la service_role.
------------------------------------------------------------------- */

export type StoredFile = {
  name: string;
  size: number | null;
  type: string | null;
  updatedAt: string | null;
};

const IMAGE_RE = /\.(png|jpe?g|svg|webp|gif|avif)$/i;

function base() {
  const config = getSupabaseConfig();
  if (!config) return null;
  return { url: config.url.replace(/\/+$/, ""), key: config.anonKey };
}

/** URL pública permanente de un archivo del bucket */
export function publicUrlOf(name: string): string {
  const b = base();
  if (!b) return "";
  return `${b.url}/storage/v1/object/public/${ASSETS_BUCKET}/${encodeURIComponent(name)}`;
}

async function withAbort<T>(
  run: (signal: AbortSignal) => Promise<T>,
  ms: number,
): Promise<{ ok: true; value: T } | { ok: false; error: string }> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), ms);
  try {
    return { ok: true, value: await run(controller.signal) };
  } catch (e) {
    const aborted = e instanceof DOMException && e.name === "AbortError";
    const raw = e instanceof Error ? e.message : String(e);
    return {
      ok: false,
      error: aborted
        ? `Sin respuesta tras ${ms / 1000}s. Revisa la URL del proyecto y que no esté pausado.`
        : /failed to fetch|networkerror|load failed/i.test(raw)
          ? `No se pudo contactar con Supabase (${raw}).`
          : raw,
    };
  } finally {
    window.clearTimeout(timer);
  }
}

/**
 * Lista las imágenes del bucket «escudo» y devuelve la más reciente.
 * Requiere una política SELECT sobre storage.objects para el rol anon.
 */
export async function findCrestInBucket(
  timeoutMs = 12000,
): Promise<{ file: StoredFile | null; error: string | null }> {
  const b = base();
  if (!b) return { file: null, error: "Supabase no está configurado." };

  const res = await withAbort(async (signal) => {
    const r = await fetch(`${b.url}/storage/v1/object/list/${ASSETS_BUCKET}`, {
      method: "POST",
      headers: {
        apikey: b.key,
        Authorization: `Bearer ${b.key}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        prefix: "",
        limit: 100,
        sortBy: { column: "updated_at", order: "desc" },
      }),
      signal,
      cache: "no-store",
    });
    const text = await r.text();
    return { status: r.status, ok: r.ok, text };
  }, timeoutMs);

  if (!res.ok) return { file: null, error: res.error };

  const { status, ok, text } = res.value;
  if (!ok) {
    const hint =
      status === 400 || status === 404
        ? ` → El bucket «${ASSETS_BUCKET}» no existe o el nombre no coincide.`
        : status === 401 || status === 403
          ? ` → Falta la política de lectura (SELECT) sobre storage.objects para el rol anon.`
          : "";
    return { file: null, error: `HTTP ${status}${text ? ` · ${text.slice(0, 240)}` : ""}${hint}` };
  }

  type Row = {
    name: string;
    updated_at?: string | null;
    created_at?: string | null;
    metadata?: { size?: number; mimetype?: string } | null;
  };

  let rows: Row[] = [];
  try {
    rows = JSON.parse(text) as Row[];
  } catch {
    return { file: null, error: "Respuesta inesperada al listar el bucket." };
  }

  const images = rows.filter((o) => o.name && !o.name.startsWith(".") && IMAGE_RE.test(o.name));
  if (images.length === 0) {
    return {
      file: null,
      error: null, // el bucket responde bien, simplemente está vacío
    };
  }

  const latest = images[0];
  return {
    file: {
      name: latest.name,
      size: latest.metadata?.size ?? null,
      type: latest.metadata?.mimetype ?? null,
      updatedAt: latest.updated_at ?? latest.created_at ?? null,
    },
    error: null,
  };
}

/** Intenta extraer el error del cuerpo de la respuesta */
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

/** Traduce los fallos habituales a una indicación accionable */
function hintFor(status: number | undefined, raw: string): string {
  if (status === 404 || /bucket not found|not found/i.test(raw)) {
    return ` → El bucket «${ASSETS_BUCKET}» no existe o el nombre no coincide.`;
  }
  if (status === 401) return " → Clave anon no válida. Revisa VITE_SUPABASE_ANON_KEY.";
  if (status === 403 || /row-level security|policy|unauthorized/i.test(raw)) {
    return " → Falta la política de INSERT/UPDATE sobre storage.objects para el rol anon. Copia el SQL del panel.";
  }
  if (status === 413) return " → El archivo supera el límite de tamaño del bucket.";
  return "";
}

export type UploadResult = { ok: boolean; error?: string; status?: number };

/**
 * Sube un archivo al bucket con sus BYTES ORIGINALES.
 * Usa fetch + AbortController: nunca se queda colgado.
 */
export async function uploadToBucket(
  name: string,
  file: Blob,
  opts: { contentType?: string; timeoutMs?: number } = {},
): Promise<UploadResult> {
  const b = base();
  if (!b) return { ok: false, error: "Supabase no está configurado." };
  const ms = opts.timeoutMs ?? 45000;

  const res = await withAbort(async (signal) => {
    const r = await fetch(
      `${b.url}/storage/v1/object/${ASSETS_BUCKET}/${encodeURIComponent(name)}`,
      {
        method: "POST",
        headers: {
          apikey: b.key,
          Authorization: `Bearer ${b.key}`,
          "x-upsert": "true",
          "cache-control": "3600",
          ...(opts.contentType ? { "content-type": opts.contentType } : {}),
        },
        body: file,
        signal,
      },
    );
    if (r.ok) return { ok: true as const, status: r.status };
    return { ok: false as const, status: r.status, raw: await readError(r) };
  }, ms);

  if (!res.ok) return { ok: false, error: res.error };
  if (!res.value.ok) {
    const raw = res.value.raw ?? "";
    return { ok: false, status: res.value.status, error: raw + hintFor(res.value.status, raw) };
  }
  return { ok: true, status: res.value.status };
}

/** Elimina archivos del bucket */
export async function removeFromBucket(names: string[], timeoutMs = 15000): Promise<UploadResult> {
  const b = base();
  if (!b) return { ok: false, error: "Supabase no está configurado." };
  if (names.length === 0) return { ok: true };

  const res = await withAbort(async (signal) => {
    const r = await fetch(`${b.url}/storage/v1/object/${ASSETS_BUCKET}`, {
      method: "DELETE",
      headers: {
        apikey: b.key,
        Authorization: `Bearer ${b.key}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ prefixes: names }),
      signal,
    });
    if (r.ok) return { ok: true as const };
    return { ok: false as const, status: r.status, raw: await readError(r) };
  }, timeoutMs);

  if (!res.ok) return { ok: false, error: res.error };
  if (!res.value.ok) return { ok: false, status: res.value.status, error: res.value.raw };
  return { ok: true };
}

/** Lista todos los nombres de archivo del bucket */
export async function listAllNames(timeoutMs = 12000): Promise<string[]> {
  const b = base();
  if (!b) return [];
  const res = await withAbort(async (signal) => {
    const r = await fetch(`${b.url}/storage/v1/object/list/${ASSETS_BUCKET}`, {
      method: "POST",
      headers: {
        apikey: b.key,
        Authorization: `Bearer ${b.key}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ prefix: "", limit: 100 }),
      signal,
      cache: "no-store",
    });
    if (!r.ok) return [] as string[];
    const rows = (await r.json()) as { name: string }[];
    return rows.map((x) => x.name).filter((n) => n && !n.startsWith("."));
  }, timeoutMs);
  return res.ok ? res.value : [];
}

/** Comprueba que una URL pública responde correctamente */
export async function checkUrl(
  url: string,
  timeoutMs = 10000,
): Promise<{ ok: boolean; status?: number; error?: string }> {
  const res = await withAbort(async (signal) => {
    const r = await fetch(url, { signal, cache: "no-store" });
    return { ok: r.ok, status: r.status };
  }, timeoutMs);
  if (!res.ok) return { ok: false, error: res.error };
  return { ok: res.value.ok, status: res.value.status };
}
