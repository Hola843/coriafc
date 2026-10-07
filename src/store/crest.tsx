import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ASSETS_BUCKET,
  isSupabaseReady,
  onSupabaseConfigChange,
} from "../lib/supabase";
import {
  CREST_BASENAME,
  findCrestInBucket,
  listAllNames,
  publicUrlOf,
  removeFromBucket,
  resolvePublicCrestUrl,
  uploadToBucket,
  type StoredFile,
} from "../lib/storage";
import { CREST_SRC } from "../crestSource";

/* ------------------------------------------------------------------
   Escudo oficial del club — leído desde Supabase Storage

   El escudo se sube UNA SOLA VEZ, manualmente, desde
   Supabase → Storage → escudo.

   En cada arranque la web localiza el archivo del bucket y usa su URL
   pública permanente. No hay subida desde el Admin Site, no se guarda
   nada en el navegador y no depende del almacenamiento de Arena: la
   fuente de verdad es siempre el bucket.

   Orden de resolución:
     1. VITE_CREST_URL          (URL fija opcional)
     2. VITE_CREST_FILE_NAME    (nombre de archivo fijo dentro del bucket)
     3. Archivo más reciente encontrado en el bucket «escudo»
     4. public/escudo-coria-cf.png (respaldo local)
------------------------------------------------------------------- */

type Status = "idle" | "loading" | "ready" | "error";

type CrestState = {
  /** URL que debe mostrarse en la web */
  url: string;
  status: Status;
  /** Archivo localizado en el bucket */
  file: StoredFile | null;
  /** Cómo se ha resuelto la URL */
  origin: "env-url" | "env-name" | "bucket" | "fallback";
  error: string | null;
  /** true si hay credenciales de Supabase configuradas */
  ready: boolean;
  refresh: () => Promise<void>;
  /** Sube el escudo al bucket, sustituyendo el anterior */
  upload: (file: File) => Promise<{ ok: boolean; message: string }>;
  /** Elimina el escudo del bucket */
  remove: () => Promise<{ ok: boolean; message: string }>;
};

const Ctx = createContext<CrestState | null>(null);

export function useCrest() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCrest debe usarse dentro de CrestProvider");
  return ctx;
}

export function CrestProvider({ children }: { children: ReactNode }) {
  const envUrl = import.meta.env.VITE_CREST_URL?.trim();
  const envName = import.meta.env.VITE_CREST_FILE_NAME?.trim();

  const [url, setUrl] = useState("");
  const [file, setFile] = useState<StoredFile | null>(null);
  const [origin, setOrigin] = useState<CrestState["origin"]>("fallback");
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(() => isSupabaseReady());

  const refresh = useCallback(async () => {
    // 1. URL fija por variable de entorno
    if (envUrl) {
      setUrl(envUrl);
      setOrigin("env-url");
      setFile(null);
      setError(null);
      setStatus("ready");
      return;
    }

    // 2. Nombre fijo por variable de entorno
    if (envName) {
      setUrl(publicUrlOf(envName));
      setOrigin("env-name");
      setFile({ name: envName, size: null, type: null, updatedAt: null });
      setError(null);
      setStatus("ready");
      return;
    }

    setStatus("loading");

    /* 3. URL PÚBLICA DIRECTA — sin credenciales.
       Es el camino principal y el que hace que el escudo se vea igual
       en cualquier dispositivo: no depende de localStorage ni de que
       el navegador tenga la clave anon. */
    const direct = await resolvePublicCrestUrl();
    if (direct) {
      setUrl(direct.url);
      setFile({ name: direct.name, size: null, type: null, updatedAt: null });
      setOrigin("bucket");
      setError(null);
      setStatus("ready");
      return;
    }

    /* 4. Si no se encontró por nombre fijo y hay credenciales,
       se lista el bucket (cubre archivos subidos a mano con otro
       nombre desde el panel de Supabase). */
    if (isSupabaseReady()) {
      const { file: found, error: listError } = await findCrestInBucket();
      if (found) {
        setFile(found);
        setUrl(publicUrlOf(found.name));
        setOrigin("bucket");
        setError(null);
        setStatus("ready");
        return;
      }
      if (listError) {
        setError(listError);
        setUrl("");
        setFile(null);
        setOrigin("fallback");
        setStatus("error");
        return;
      }
    }

    setError(null);
    setUrl("");
    setFile(null);
    setOrigin("fallback");
    setStatus("ready");
  }, [envUrl, envName]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Si se cambian las credenciales desde el panel, recarga al instante
  useEffect(
    () =>
      onSupabaseConfigChange(() => {
        setReady(isSupabaseReady());
        void refresh();
      }),
    [refresh],
  );

  /* ---------------- Subir el escudo al bucket ---------------- */
  const upload = useCallback<CrestState["upload"]>(
    async (incoming) => {
      if (!isSupabaseReady()) {
        return {
          ok: false,
          message:
            "Falta la clave de Supabase. Define VITE_SUPABASE_ANON_KEY en Arena o introdúcela en el panel.",
        };
      }

      const ext = (incoming.name.split(".").pop() ?? "png").toLowerCase();
      // Nombre DETERMINISTA: «escudo.<ext>».
      // Así cualquier dispositivo puede construir la URL pública sin
      // credenciales y sin listar el bucket.
      const name = `${CREST_BASENAME}.${ext}`;

      // Archivos existentes, para sustituirlos tras subir el nuevo
      const previous = await listAllNames();

      const res = await uploadToBucket(name, incoming, {
        contentType: incoming.type || undefined,
        timeoutMs: 45000,
      });

      if (!res.ok) {
        return { ok: false, message: res.error ?? "Error desconocido al subir el archivo." };
      }

      // Sustituye el anterior
      const stale = previous.filter((n) => n !== name);
      if (stale.length > 0) await removeFromBucket(stale);

      await refresh();
      return {
        ok: true,
        message: `Escudo subido correctamente a Supabase → Storage → ${ASSETS_BUCKET} como «${name}».`,
      };
    },
    [refresh],
  );

  /* ---------------- Eliminar el escudo ---------------- */
  const remove = useCallback<CrestState["remove"]>(async () => {
    if (!isSupabaseReady()) return { ok: false, message: "Supabase no está configurado." };
    const names = await listAllNames();
    if (names.length === 0) {
      await refresh();
      return { ok: true, message: "El bucket ya estaba vacío." };
    }
    const res = await removeFromBucket(names);
    if (!res.ok) return { ok: false, message: res.error ?? "No se pudo eliminar." };
    await refresh();
    return { ok: true, message: "Escudo eliminado de Supabase." };
  }, [refresh]);

  const value = useMemo<CrestState>(
    () => ({
      url: url || CREST_SRC,
      status,
      file,
      origin,
      error,
      ready,
      refresh,
      upload,
      remove,
    }),
    [url, status, file, origin, error, ready, refresh, upload, remove],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export { ASSETS_BUCKET };
