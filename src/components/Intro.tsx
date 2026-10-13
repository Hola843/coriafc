import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CREST_ALT } from "../crestSource";
import { useCrest } from "../store/crest";
import { usePrefersReducedMotion } from "./ui";

/* ------------------------------------------------------------------
   Intro cinematográfica del Club Deportiva Minera.

   El escudo se carga EXACTAMENTE desde su archivo original (bucket
   «escudo» de Supabase). No se redibuja ni se altera: todos los
   efectos —luces, destellos, humo, ondas— son capas CSS
   independientes que se superponen o se sitúan detrás de la imagen.

   Duración total ≈ 5,2 s. Se muestra una vez por sesión.
------------------------------------------------------------------- */

const DURATION = 5200;

/**
 * Marca de "ya vista" en memoria del módulo.
 *
 * Persiste mientras la aplicación está cargada, por lo que cambiar de
 * sección NO repite la intro. Se reinicia al recargar la página, que
 * es justo lo que se pide para poder volver a verla al probar.
 */
let seenThisLoad = false;

/** Partículas de polvo generadas una sola vez, con posiciones estables */
function useParticles(count: number) {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const seed = (n: number) => {
          const x = Math.sin(i * 374.761 + n * 112.37) * 43758.5453;
          return x - Math.floor(x);
        };
        return {
          id: i,
          left: seed(1) * 100,
          top: seed(2) * 100,
          size: 1 + seed(3) * 2.6,
          delay: seed(4) * 4,
          duration: 7 + seed(5) * 9,
          drift: -40 + seed(6) * 80,
          opacity: 0.15 + seed(7) * 0.45,
        };
      }),
    [count],
  );
}

export default function Intro({ onDone }: { onDone: () => void }) {
  const { url } = useCrest();
  const reduced = usePrefersReducedMotion();
  const particles = useParticles(34);

  const [closing, setClosing] = useState(false);
  const [crestFailed, setCrestFailed] = useState(false);
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    setClosing(true);
    // Espera al fundido de salida para desmontar sin dejar capas negras
    window.setTimeout(onDone, 620);
  }, [onDone]);

  // Fin automático
  useEffect(() => {
    const t = window.setTimeout(finish, reduced ? 1200 : DURATION);
    return () => window.clearTimeout(t);
  }, [finish, reduced]);

  // Saltar con Escape o Enter
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finish]);

  // Bloquea el scroll mientras dura la intro
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-label="Presentación del Club Deportiva Minera"
      className={`intro-root fixed inset-0 z-[100] overflow-hidden bg-black ${
        closing ? "intro-out" : ""
      }`}
    >
      {/* Capa 1 · Oscuridad con tono rojizo */}
      <div className="intro-ember absolute inset-0" />
      <div className="intro-vignette absolute inset-0" />

      {/* Capa 2 · Humo lento */}
      {!reduced && (
        <>
          <div className="intro-smoke intro-smoke-a absolute inset-0" />
          <div className="intro-smoke intro-smoke-b absolute inset-0" />
        </>
      )}

      {/* Capa 3 · Partículas de polvo */}
      {!reduced && (
        <div className="absolute inset-0">
          {particles.map((p) => (
            <span
              key={p.id}
              className="intro-dust absolute rounded-full bg-white"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                opacity: p.opacity,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                ["--drift" as string]: `${p.drift}px`,
              }}
            />
          ))}
        </div>
      )}

      {/* Capa 4 · Focos de estadio encendiéndose */}
      {!reduced && (
        <>
          <div className="intro-flood intro-flood-l absolute" />
          <div className="intro-flood intro-flood-r absolute" />
        </>
      )}

      {/* Capa 5 · Línea de luz roja que cruza la pantalla */}
      {!reduced && (
        <>
          <div className="intro-scanline absolute left-0 right-0" />
          <div className="intro-flash absolute inset-0" />
        </>
      )}

      {/* Composición central */}
      <div className="relative flex h-full w-full flex-col items-center justify-center px-6">
        {/* Halo tras el escudo */}
        {!reduced && <div className="intro-halo absolute" />}

        {/* Onda de energía roja */}
        {!reduced && (
          <>
            <span className="intro-ring absolute" />
            <span className="intro-ring intro-ring-2 absolute" />
          </>
        )}

        {/* ESCUDO ORIGINAL · sin modificar */}
        <div className={`intro-crest-wrap relative ${reduced ? "intro-static" : ""}`}>
          {url && !crestFailed ? (
            <img
              src={url}
              alt={CREST_ALT}
              className="intro-crest relative block h-auto w-[min(58vw,16rem)] select-none object-contain sm:w-[min(38vw,20rem)]"
              draggable={false}
              decoding="async"
              onError={() => setCrestFailed(true)}
            />
          ) : (
            // Si el archivo no está disponible, se deja un hueco con las
            // mismas proporciones. Nunca se dibuja una recreación.
            <div className="aspect-square w-[min(58vw,16rem)] sm:w-[min(38vw,20rem)]" />
          )}
          {/* Barrido de brillo sobre el escudo */}
          {!reduced && <span className="intro-sheen pointer-events-none absolute inset-0" />}
        </div>

        {/* Texto */}
        <div className="relative mt-8 text-center sm:mt-10">
          <h1
            className={`intro-name font-display text-[clamp(1.9rem,8vw,4.5rem)] uppercase leading-none tracking-[0.06em] text-white ${
              reduced ? "intro-static" : ""
            }`}
          >
            Deportiva Minera
          </h1>

          <div
            className={`intro-rule mx-auto mt-4 h-[2px] bg-gradient-to-r from-transparent via-[#e01829] to-transparent ${
              reduced ? "intro-static" : ""
            }`}
          />

          <p
            className={`intro-motto mt-4 text-[clamp(0.6rem,2.4vw,0.85rem)] font-extrabold uppercase tracking-[0.42em] text-white/70 ${
              reduced ? "intro-static" : ""
            }`}
          >
            Orgullo · Historia · Pasión
          </p>
        </div>
      </div>

      {/* Saltar intro */}
      <button
        type="button"
        onClick={finish}
        className="absolute right-4 top-4 z-10 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/60 backdrop-blur transition hover:border-white/50 hover:text-white sm:right-6 sm:top-6"
      >
        Saltar intro
      </button>
    </div>
  );
}

/** true si la intro ya se ha mostrado desde que se cargó la página */
export function introAlreadySeen() {
  return seenThisLoad;
}

export function markIntroSeen() {
  seenThisLoad = true;
}
