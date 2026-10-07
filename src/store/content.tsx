import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as seed from "../data/club";
import type { Category, GalleryItem, Match, Player, Row } from "../data/club";

/* ------------------------------------------------------------------
   Almacén de contenido del sitio.
   Los datos por defecto viven en src/data/club.ts y el panel de
   administración los sobreescribe guardando en localStorage, de modo
   que los cambios persisten en el navegador tras publicar la web.
------------------------------------------------------------------- */

export type NewsItem = {
  id: string;
  tag: string;
  date: string;
  title: string;
  text: string;
  image: string;
  /** Fuente verificable de la noticia */
  source?: string;
};

export type Pena = { name: string; since: number; members: number };
export type FanMoment = { title: string; text: string; img: string };
export type TimelineItem = { year: string; title: string; text: string };
export type Honour = { title: string; detail: string };
export type StaffMember = {
  role: string;
  name: string;
  fullName?: string;
  /** Fuente de la que procede el dato (RFAF / LaPreferente / BeSoccer) */
  source?: string;
};
export type Fact = { k: string; v: string };
export type Area = { name: string; desc: string };
export type Arrive = { mode: string; detail: string };
export type FormResult = "V" | "E" | "D";

export type SiteContent = {
  version: number;
  password: string;
  /**
   * Escudo oficial subido desde el panel, guardado como data URL con los
   * BYTES ORIGINALES del archivo (sin recomprimir ni redimensionar).
   * Cadena vacía = se usa el archivo de public/escudo-coria-cf.png.
   */
  crest: string;
  /** Nombre y tamaño del archivo subido, solo informativo */
  crestInfo: { name: string; size: number; type: string } | null;
  club: typeof seed.CLUB;
  news: NewsItem[];
  /** Todas las categorías del club, cada una con sus partidos, tabla y estadísticas */
  categories: Category[];
  matches: Match[];
  players: Player[];
  standings: Row[];
  teamSeason: typeof seed.TEAM_SEASON;
  form: FormResult[];
  gallery: GalleryItem[];
  anthem: { title: string; subtitle: string; duration: string; lyrics: string[] };
  penas: Pena[];
  fanMoments: FanMoment[];
  timeline: TimelineItem[];
  honours: Honour[];
  staff: StaffMember[];
  stadiumFacts: Fact[];
  stadiumAreas: Area[];
  howToArrive: Arrive[];
};

/* La clave cambia al actualizar los datos reales para descartar
   contenidos antiguos guardados en el navegador. */
export const STORAGE_KEY = "coria-cf-cms-2026-27-v7";
export const SESSION_KEY = "coria-cf-admin-session";
export const CONTENT_VERSION = 7;

export function defaultContent(): SiteContent {
  return structuredClone({
    version: CONTENT_VERSION,
    password: "coria1923",
    crest: "",
    crestInfo: null,
    club: seed.CLUB,
    news: seed.NEWS as NewsItem[],
    categories: seed.CATEGORIES,
    matches: seed.MATCHES,
    players: seed.PLAYERS,
    standings: seed.STANDINGS,
    teamSeason: seed.TEAM_SEASON,
    form: seed.FORM as FormResult[],
    gallery: seed.GALLERY,
    anthem: seed.ANTHEM,
    penas: seed.PENAS,
    fanMoments: seed.FAN_MOMENTS,
    timeline: seed.TIMELINE,
    honours: seed.HONOURS,
    staff: seed.STAFF,
    stadiumFacts: seed.STADIUM_FACTS,
    stadiumAreas: seed.STADIUM_AREAS,
    howToArrive: seed.HOW_TO_ARRIVE,
  });
}

function load(): SiteContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultContent();
    const parsed = JSON.parse(raw) as Partial<SiteContent>;
    // Fusión defensiva: si falta algún bloque se completa con el original
    return { ...defaultContent(), ...parsed, version: CONTENT_VERSION };
  } catch {
    return defaultContent();
  }
}

type Ctx = {
  content: SiteContent;
  setContent: (next: SiteContent) => void;
  update: <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => void;
  /** Modifica una categoría concreta (partidos, clasificación, estadísticas…) */
  updateCategory: (index: number, patch: Partial<Category>) => void;
  reset: () => void;
  exportJson: () => string;
  importJson: (raw: string) => boolean;
  saveError: string | null;
  lastSaved: number | null;
};

const ContentCtx = createContext<Ctx | null>(null);

export function useContent() {
  const ctx = useContext(ContentCtx);
  if (!ctx) throw new Error("useContent debe usarse dentro de ContentProvider");
  return ctx;
}

/** Acceso directo a los datos (atajo de solo lectura). */
export function useSite() {
  return useContent().content;
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<SiteContent>(() => load());
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<number | null>(null);

  const persist = useCallback((next: SiteContent) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSaveError(null);
      setLastSaved(Date.now());
    } catch {
      setSaveError(
        "No se ha podido guardar: el almacenamiento del navegador está lleno. Usa imágenes más ligeras o exporta una copia.",
      );
    }
  }, []);

  const setContent = useCallback(
    (next: SiteContent) => {
      setContentState(next);
      persist(next);
    },
    [persist],
  );

  const update = useCallback<Ctx["update"]>(
    (key, value) => {
      setContentState((prev) => {
        const next = { ...prev, [key]: value };
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const updateCategory = useCallback<Ctx["updateCategory"]>(
    (index, patch) => {
      setContentState((prev) => {
        const categories = prev.categories.map((c, i) => (i === index ? { ...c, ...patch } : c));
        const next = { ...prev, categories };
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const reset = useCallback(() => {
    const fresh = defaultContent();
    setContentState(fresh);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
    setLastSaved(Date.now());
  }, []);

  const exportJson = useCallback(() => JSON.stringify(content, null, 2), [content]);

  const importJson = useCallback(
    (raw: string) => {
      try {
        const parsed = JSON.parse(raw) as Partial<SiteContent>;
        if (!parsed || typeof parsed !== "object") return false;
        setContent({ ...defaultContent(), ...parsed, version: CONTENT_VERSION });
        return true;
      } catch {
        return false;
      }
    },
    [setContent],
  );

  // Sincroniza entre pestañas abiertas
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setContentState(load());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      content,
      setContent,
      update,
      updateCategory,
      reset,
      exportJson,
      importJson,
      saveError,
      lastSaved,
    }),
    [content, setContent, update, updateCategory, reset, exportJson, importJson, saveError, lastSaved],
  );

  return <ContentCtx.Provider value={value}>{children}</ContentCtx.Provider>;
}

/* ----------------------------- Utilidades ----------------------------- */

export function uid(prefix = "id") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Lee un archivo y devuelve sus BYTES ORIGINALES como data URL.
 * No pasa por canvas, no recomprime, no redimensiona y no cambia el
 * formato: el resultado es una copia exacta del archivo subido.
 * Se usa para el escudo oficial, que no debe modificarse.
 */
export function fileToExactDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer el archivo"));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

/** Lee un archivo de imagen y lo redimensiona a un data URL ligero. */
export function fileToDataUrl(file: File, maxWidth = 1280, quality = 0.78): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer el archivo"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Archivo de imagen no válido"));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(String(reader.result));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

/** Derivados usados por varias páginas */
export function nextMatchOf(matches: Match[]) {
  return matches.find((m) => !m.played) ?? matches[matches.length - 1];
}

export function lastMatchOf(matches: Match[]) {
  return [...matches].reverse().find((m) => m.played) ?? matches[0];
}
