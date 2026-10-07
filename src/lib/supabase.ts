import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/* ------------------------------------------------------------------
   Conexión con Supabase

   Credenciales mediante variables de entorno de Vite (NUNCA en código):

     VITE_SUPABASE_URL       https://xxxxxxxx.supabase.co
     VITE_SUPABASE_ANON_KEY  eyJhbGciOi...

   Ambas son credenciales PÚBLICAS de cliente (la clave «anon»),
   pensadas para usarse en el navegador. La clave service_role NO debe
   usarse aquí bajo ningún concepto.

   Como alternativa para pruebas, pueden introducirse desde el panel de
   administración: en ese caso se guarda únicamente la CONFIGURACIÓN de
   conexión. El escudo nunca se guarda en el navegador: vive en
   Supabase Storage y su URL en la base de datos.
------------------------------------------------------------------- */

/** Bucket de Supabase Storage donde se almacena el escudo del club */
export const ASSETS_BUCKET = "escudo";

/**
 * Carpeta dentro del bucket. Vacía: el archivo se guarda en la raíz
 * del bucket «escudo», de modo que aparece directamente en
 * Supabase → Storage → escudo.
 */
export const CREST_FOLDER = "";

/** Tabla donde se guarda la URL permanente del escudo */
export const CLUB_TABLE = "club_settings";

/** Identificador del club al que se asocian los ajustes */
export const CLUB_SLUG = "coria-cf";

const CONFIG_KEY = "coria-cf-supabase-config";

export type SupabaseConfig = { url: string; anonKey: string };

function readStoredConfig(): SupabaseConfig | null {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SupabaseConfig;
    if (parsed?.url && parsed?.anonKey) return parsed;
    return null;
  } catch {
    return null;
  }
}

/**
 * URL del proyecto de Supabase. No es un secreto (va en cada petición
 * del navegador), por eso puede figurar como valor por defecto.
 * Se puede sobreescribir con VITE_SUPABASE_URL.
 */
export const DEFAULT_PROJECT_URL = "https://bqlnsfeybawnirkjpkni.supabase.co";

export function getSupabaseConfig(): SupabaseConfig | null {
  const envUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

  // La clave SIEMPRE viene de variable de entorno o del panel.
  // Nunca se escribe en el código.
  if (envKey) {
    return { url: (envUrl || DEFAULT_PROJECT_URL).replace(/\/+$/, ""), anonKey: envKey };
  }

  const stored = readStoredConfig();
  if (stored) {
    return { url: (stored.url || DEFAULT_PROJECT_URL).replace(/\/+$/, ""), anonKey: stored.anonKey };
  }
  return null;
}

/** Suscriptores que deben reaccionar al cambiar las credenciales */
const listeners = new Set<() => void>();

export function onSupabaseConfigChange(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function notify() {
  listeners.forEach((fn) => fn());
}

export function saveSupabaseConfig(config: SupabaseConfig) {
  // Normaliza: quita espacios y la barra final de la URL
  const clean: SupabaseConfig = {
    url: config.url.trim().replace(/\/+$/, ""),
    anonKey: config.anonKey.trim(),
  };
  localStorage.setItem(CONFIG_KEY, JSON.stringify(clean));
  client = null; // fuerza recrear el cliente con las nuevas credenciales
  notify();
}

export function clearSupabaseConfig() {
  localStorage.removeItem(CONFIG_KEY);
  client = null;
  notify();
}

/** true si la clave procede de una variable de entorno */
export function configFromEnv() {
  return Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY);
}

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (client) return client;
  const config = getSupabaseConfig();
  if (!config) return null;
  client = createClient(config.url, config.anonKey, {
    auth: { persistSession: false },
  });
  return client;
}

export function isSupabaseReady() {
  return getSupabaseConfig() !== null;
}
