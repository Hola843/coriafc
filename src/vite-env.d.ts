/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  /** URL pública completa del escudo (opcional, tiene prioridad) */
  readonly VITE_CREST_URL?: string;
  /** Nombre exacto del archivo dentro del bucket «escudo» (opcional) */
  readonly VITE_CREST_FILE_NAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
