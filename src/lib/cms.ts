import { getSupabase, isSupabaseReady } from "./supabase";

/* ------------------------------------------------------------------
   Sincronización del contenido del Admin Site con Supabase.

   Flujo:
     · La web pública LEE de Supabase en cada carga.
     · El Admin Site GUARDA en Supabase con cada cambio.
     · Si Supabase no está disponible, se sigue funcionando con
       localStorage como respaldo, para no perder el trabajo.

   Solo se usa la clave anon; la seguridad depende de las políticas
   RLS de la tabla site_content.
------------------------------------------------------------------- */

export const CONTENT_TABLE = "site_content";
export const REVISIONS_TABLE = "content_revisions";
/** Identificador del sitio en la tabla */
export const CONTENT_ID = "coria-cf";

const SYNC_KEY = "coria-cf-sync-state";

/** true si hay credenciales de Supabase disponibles */
export function isSupabaseConfigured() {
  return isSupabaseReady();
}

export type SyncState =
  | "idle"
  | "loading"
  | "synced"
  /** Guardando cambios pendientes de subir */
  | "pending"
  /** Sin Supabase: se usa la copia del navegador */
  | "offline"
  /** Faltan las tablas en la base de datos */
  | "schema-missing"
  | "error";

export type SyncInfo = {
  state: SyncState;
  /** Última vez que se guardó en Supabase */
  lastSaved: string | null;
  /** Última vez que se descargó de Supabase */
  lastLoaded: string | null;
  error: string | null;
  /** Revisión disponible en la base de datos */
  revision: number | null;
};

/**
 * Crea las tablas del CMS si no existen.
 *
 * Requiere que la clave anon tenga permiso de DDL, algo que solo
 * ocurre con claves service_role. En un proyecto normal la API de
 * PostgREST no permite crear tablas, por lo que se informa con un
 * mensaje claro que remite al archivo SUPABASE-CMS.sql.
 */
export async function ensureSchema(): Promise<{ ok: boolean; message: string }> {
  const supabase = getSupabase();
  if (!supabase) return { ok: false, message: "Supabase no está configurado." };

  const probe = await supabase.from(CONTENT_TABLE).select("id").limit(1);
  if (!probe.error) return { ok: true, message: "El esquema ya existe." };

  return {
    ok: false,
    message:
      "Falta crear las tablas en Supabase. Abre el archivo SUPABASE-CMS.sql, cópialo en el SQL " +
      "Editor de tu proyecto y pulsa Run.",
  };
}

/** Descarga el contenido de Supabase. Devuelve null si no hay datos. */
export async function fetchRemoteContent(): Promise<{
  data: Record<string, unknown> | null;
  updatedAt: string | null;
  revision: number | null;
}> {
  const supabase = getSupabase();
  if (!supabase) return { data: null, updatedAt: null, revision: null };

  const { data, error } = await supabase
    .from(CONTENT_TABLE)
    .select("content, updated_at")
    .eq("id", CONTENT_ID)
    .maybeSingle();

  if (error) {
    const missing =
      error.code === "42P01" ||
      /schema cache|does not exist/i.test(error.message);
    if (missing) {
      throw new Error(
        "La tabla «site_content» no existe. Ejecuta SUPABASE-CMS.sql en el SQL Editor de Supabase.",
      );
    }
    throw new Error(error.message);
  }
  if (!data?.content) return { data: null, updatedAt: null, revision: null };

  const content = data.content as Record<string, unknown>;

  // Número de revisiones guardadas: sirve para detectar cambios externos
  let revision: number | null = null;
  try {
    const { count } = await supabase
      .from(REVISIONS_TABLE)
      .select("id", { count: "exact", head: true })
      .eq("content_id", CONTENT_ID);
    revision = count ?? null;
  } catch {
    revision = null;
  }

  return { data: content, updatedAt: data.updated_at ?? null, revision };
}

/** Sube el contenido a Supabase (upsert) y deja constancia en el historial. */
export async function pushRemoteContent(
  content: Record<string, unknown>,
  note?: string,
): Promise<{ updatedAt: string }> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase no está configurado.");

  const { error } = await supabase.from(CONTENT_TABLE).upsert(
    { id: CONTENT_ID, content, updated_at: new Date().toISOString() },
    { onConflict: "id" },
  );
  if (error) throw new Error(error.message);

  // Historial (si la tabla existe)
  try {
    await supabase.from(REVISIONS_TABLE).insert({
      content_id: CONTENT_ID,
      content,
      note: note ?? null,
    });
  } catch {
    /* el historial es opcional */
  }

  return { updatedAt: new Date().toISOString() };
}

/** Lista las revisiones guardadas (para restaurar versiones) */
export async function listRevisions(limit = 20) {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from(REVISIONS_TABLE)
    .select("id, note, created_at")
    .eq("content_id", CONTENT_ID)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

/* --------------------- Estado local de sincronización ---------------- */

export function readSyncState(): SyncInfo {
  try {
    const raw = localStorage.getItem(SYNC_KEY);
    if (raw) return JSON.parse(raw) as SyncInfo;
  } catch {
    /* sin almacenamiento */
  }
  return {
    state: "idle",
    lastSaved: null,
    lastLoaded: null,
    error: null,
    revision: null,
  };
}

export function writeSyncState(next: Partial<SyncInfo>) {
  try {
    const merged = { ...readSyncState(), ...next };
    localStorage.setItem(SYNC_KEY, JSON.stringify(merged));
  } catch {
    /* sin almacenamiento */
  }
}