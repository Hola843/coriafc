import { ASSETS_BUCKET, getSupabaseConfig } from "./supabase";
import { checkUrl, findCrestInBucket, publicUrlOf } from "./storage";

/* ------------------------------------------------------------------
   Diagnóstico de la lectura del escudo desde Supabase Storage.
   Solo comprueba lectura: la web nunca sube archivos.
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

  /* ---------------- 1. Credenciales ---------------- */
  const config = getSupabaseConfig();
  if (!config) {
    push({
      id: "config",
      label: "Credenciales de Supabase",
      state: "fail",
      detail: "No hay URL ni clave anónima configuradas.",
      fix: "Añade VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en Arena, o introdúcelas en el panel.",
    });
    return checks;
  }

  push({
    id: "config",
    label: "Credenciales de Supabase",
    state: "ok",
    detail: `Conectado a ${config.url}`,
  });

  /* ---------------- 2. El proyecto responde ---------------- */
  try {
    const controller = new AbortController();
    const t = window.setTimeout(() => controller.abort(), 10000);
    const res = await fetch(`${config.url}/auth/v1/health`, {
      headers: { apikey: config.anonKey },
      cache: "no-store",
      signal: controller.signal,
    });
    window.clearTimeout(t);
    push({
      id: "reachable",
      label: "El proyecto responde",
      state: res.ok ? "ok" : "fail",
      detail: res.ok
        ? "Supabase responde correctamente."
        : `HTTP ${res.status}. Si es 401, la clave anon no es válida.`,
      fix: res.ok ? undefined : "Revisa VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.",
    });
    if (!res.ok) return checks;
  } catch (e) {
    push({
      id: "reachable",
      label: "El proyecto responde",
      state: "fail",
      detail: "No se pudo contactar con el servidor.",
      raw: e instanceof Error ? e.message : String(e),
      fix: `Comprueba que la URL sea https://<id>.supabase.co sin barra final y que el proyecto esté activo. URL actual: ${config.url}`,
    });
    return checks;
  }

  /* ---------------- 3. Leer el bucket ---------------- */
  const { file, error } = await findCrestInBucket();

  if (error) {
    push({
      id: "bucket-list",
      label: `Lectura del bucket «${ASSETS_BUCKET}»`,
      state: "fail",
      detail: "No se pudo listar el contenido del bucket.",
      raw: error,
      fix: `Comprueba que el bucket se llama exactamente «${ASSETS_BUCKET}» y que existe la política de SELECT sobre storage.objects para el rol anon. Copia el SQL del panel.`,
    });
    return checks;
  }

  push({
    id: "bucket-list",
    label: `Lectura del bucket «${ASSETS_BUCKET}»`,
    state: "ok",
    detail: "El bucket responde correctamente.",
  });

  /* ---------------- 4. Hay un archivo de escudo ---------------- */
  if (!file) {
    push({
      id: "crest-file",
      label: "Archivo del escudo",
      state: "fail",
      detail: `El bucket «${ASSETS_BUCKET}» no contiene ninguna imagen.`,
      fix: `Sube el escudo manualmente en Supabase → Storage → ${ASSETS_BUCKET}. Formatos: PNG, JPG, SVG o WebP.`,
    });
    return checks;
  }

  push({
    id: "crest-file",
    label: "Archivo del escudo",
    state: "ok",
    detail: `Encontrado: «${file.name}»${file.size ? ` (${(file.size / 1024).toFixed(0)} KB)` : ""}.`,
  });

  /* ---------------- 5. La URL pública funciona ---------------- */
  const url = publicUrlOf(file.name);
  const res = await checkUrl(url);
  push({
    id: "public-url",
    label: "URL pública del escudo",
    state: res.ok ? "ok" : "fail",
    detail: res.ok
      ? "El escudo se carga correctamente en la web."
      : `La URL devuelve ${res.status ? `HTTP ${res.status}` : "error"}.`,
    raw: res.ok ? url : (res.error ?? url),
    fix: res.ok
      ? undefined
      : `Marca el bucket como público: en Supabase → Storage → ${ASSETS_BUCKET} → Settings → Public bucket, o ejecuta: update storage.buckets set public = true where id = '${ASSETS_BUCKET}';`,
  });

  return checks;
}
