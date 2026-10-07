import { ASSETS_BUCKET, getSupabaseConfig } from "./supabase";
import { CREST_FILE, checkCrest, crestBaseUrl } from "./storage";

/* ------------------------------------------------------------------
   Diagnóstico del escudo en Supabase Storage.
------------------------------------------------------------------- */

export type CheckState = "ok" | "fail" | "warn" | "skip";

export type Check = {
  id: string;
  label: string;
  state: CheckState;
  detail: string;
  raw?: string;
  fix?: string;
};

export async function runDiagnostics(): Promise<Check[]> {
  const checks: Check[] = [];
  const push = (c: Check) => checks.push(c);

  const config = getSupabaseConfig();

  /* -------- 1. La URL pública del escudo (lo que ve todo el mundo) ------- */
  const url = crestBaseUrl();
  const res = await checkCrest();

  push({
    id: "public-url",
    label: "Escudo accesible públicamente",
    state: res.ok ? "ok" : "fail",
    detail: res.ok
      ? "El escudo se carga correctamente. Se verá en móvil y en cualquier dispositivo."
      : res.status === 400 || res.status === 404
        ? `No existe «${CREST_FILE}» en el bucket «${ASSETS_BUCKET}», o el bucket no es público.`
        : res.error
          ? "No se pudo contactar con Supabase."
          : `La URL respondió HTTP ${res.status}.`,
    raw: res.error ?? url,
    fix: res.ok
      ? undefined
      : `1) Sube el escudo desde este panel. 2) Marca el bucket como público: update storage.buckets set public = true where id = '${ASSETS_BUCKET}';`,
  });

  /* ------------------- 2. Clave para poder subir ------------------------ */
  if (!config?.anonKey) {
    push({
      id: "config",
      label: "Clave para subir archivos",
      state: "warn",
      detail:
        "No hay clave anon configurada: se puede VER el escudo pero no subirlo desde este dispositivo.",
      fix: "Define VITE_SUPABASE_ANON_KEY en Arena (recomendado) o introdúcela en el panel.",
    });
    return checks;
  }

  push({
    id: "config",
    label: "Clave para subir archivos",
    state: "ok",
    detail: `Configurada. Proyecto: ${config.url}`,
  });

  /* --------------------- 3. El proyecto responde ------------------------ */
  try {
    const r = await fetch(`${config.url}/auth/v1/health`, {
      headers: { apikey: config.anonKey },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    push({
      id: "reachable",
      label: "El proyecto responde",
      state: r.ok ? "ok" : "fail",
      detail: r.ok
        ? "Supabase responde correctamente."
        : `HTTP ${r.status}. Si es 401, la clave anon no es válida.`,
      fix: r.ok ? undefined : "Revisa VITE_SUPABASE_ANON_KEY.",
    });
  } catch (e) {
    push({
      id: "reachable",
      label: "El proyecto responde",
      state: "fail",
      detail: "No se pudo contactar con el servidor.",
      raw: e instanceof Error ? e.message : String(e),
      fix: `Comprueba que la URL sea https://<id>.supabase.co y que el proyecto no esté pausado. URL actual: ${config.url}`,
    });
  }

  return checks;
}
