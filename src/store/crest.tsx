import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ASSETS_BUCKET, isSupabaseReady, onSupabaseConfigChange } from "../lib/supabase";
import {
  CREST_FILE,
  checkCrest,
  cleanOldFiles,
  crestBaseUrl,
  crestUrl,
  deleteCrest,
  uploadCrest,
} from "../lib/storage";

/* ------------------------------------------------------------------
   Escudo oficial — fuente única: Supabase Storage

     bucket «escudo»  →  archivo «escudo.png»

   La URL es fija y se construye con la URL del proyecto, que está
   compilada en el bundle. Es por tanto IDÉNTICA en todos los
   dispositivos y no requiere credenciales para mostrarse.

   NO se usa localStorage, sessionStorage ni IndexedDB para el escudo
   ni para su referencia. Nada depende del dispositivo que lo subió.
------------------------------------------------------------------- */

type Status = "idle" | "checking" | "ready" | "missing";

type CrestState = {
  /** URL del escudo, con anti-caché */
  url: string;
  /** URL limpia, sin parámetros */
  baseUrl: string;
  status: Status;
  /** true si el archivo responde públicamente */
  exists: boolean;
  /** true si hay clave de Supabase para poder subir */
  ready: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  upload: (file: File) => Promise<{ ok: boolean; message: string }>;
  remove: () => Promise<{ ok: boolean; message: string }>;
};

const Ctx = createContext<CrestState | null>(null);

export function useCrest() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCrest debe usarse dentro de CrestProvider");
  return ctx;
}

export function CrestProvider({ children }: { children: ReactNode }) {
  const [version, setVersion] = useState(0);
  const [status, setStatus] = useState<Status>("checking");
  const [exists, setExists] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(() => isSupabaseReady());

  // La URL se recalcula al cambiar «version» (tras subir o eliminar)
  const url = useMemo(() => crestUrl(), [version]);
  const baseUrl = useMemo(() => crestBaseUrl(), [version]);

  /** Comprueba si el archivo existe públicamente. Solo informativo. */
  const refresh = useCallback(async () => {
    setStatus("checking");
    const res = await checkCrest();
    setExists(res.ok);
    setStatus(res.ok ? "ready" : "missing");
    setError(
      res.ok
        ? null
        : res.error
          ? `No se pudo comprobar el escudo: ${res.error}`
          : res.status === 400 || res.status === 404
            ? `El archivo «${CREST_FILE}» no existe en el bucket «${ASSETS_BUCKET}», o el bucket no es público.`
            : `El archivo respondió HTTP ${res.status}.`,
    );
    setVersion((v) => v + 1);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(
    () =>
      onSupabaseConfigChange(() => {
        setReady(isSupabaseReady());
        void refresh();
      }),
    [refresh],
  );

  /* ------------------------- Subir / reemplazar ------------------------ */
  const upload = useCallback<CrestState["upload"]>(
    async (incoming) => {
      const res = await uploadCrest(incoming);
      if (!res.ok) {
        return { ok: false, message: res.error ?? "Error desconocido al subir el archivo." };
      }
      // Elimina restos de versiones anteriores con otro nombre
      await cleanOldFiles();
      await refresh();
      return {
        ok: true,
        message: `Escudo subido correctamente a Supabase → Storage → ${ASSETS_BUCKET}/${CREST_FILE}. Ya es visible en todos los dispositivos.`,
      };
    },
    [refresh],
  );

  /* ------------------------------ Eliminar ----------------------------- */
  const remove = useCallback<CrestState["remove"]>(async () => {
    const res = await deleteCrest();
    if (!res.ok) return { ok: false, message: res.error ?? "No se pudo eliminar." };
    await cleanOldFiles();
    await refresh();
    return { ok: true, message: "Escudo eliminado de Supabase." };
  }, [refresh]);

  const value = useMemo<CrestState>(
    () => ({ url, baseUrl, status, exists, ready, error, refresh, upload, remove }),
    [url, baseUrl, status, exists, ready, error, refresh, upload, remove],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export { ASSETS_BUCKET, CREST_FILE };
