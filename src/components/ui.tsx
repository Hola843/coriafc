import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { LAST_UPDATE, NA, SOURCES, TEAMS, type SourceId } from "../data/club";

/* ---------------------- Preferencia de movimiento ---------------------- */

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/* ----------------------------- In view hook ---------------------------- */

export function useInView<T extends HTMLElement>(once = true) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) obs.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -40px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [once]);

  return { ref, inView };
}

/* ------------------------- Animación de entrada ------------------------ */

export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>();
  const show = reduced || inView;

  return (
    <Tag
      ref={ref as never}
      className={`transition-all duration-700 ease-out ${
        show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
      style={{ transitionDelay: show && !reduced ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}

/* --------------------------- Contador animado -------------------------- */

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function Counter({
  to,
  duration = 1400,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
}: {
  to: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [value, setValue] = useState(reduced ? to : 0);

  useEffect(() => {
    if (reduced) {
      setValue(to);
      return;
    }
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setValue(to * easeOut(p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration, reduced]);

  const text = value.toLocaleString("es-ES", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={className}>
      {prefix}
      {text}
      {suffix}
    </span>
  );
}

/* --------------------------- Barra de progreso ------------------------- */

export function ProgressBar({
  value,
  max = 100,
  color = "bg-gold-500",
  track = "bg-navy-900/10",
  height = "h-2",
  delay = 0,
}: {
  value: number;
  max?: number;
  color?: string;
  track?: string;
  height?: string;
  delay?: number;
}) {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>();
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const show = reduced || inView;

  return (
    <div ref={ref} className={`w-full overflow-hidden rounded-full ${track} ${height}`}>
      <div
        className={`${height} rounded-full ${color} transition-[width] duration-1000 ease-out`}
        style={{ width: show ? `${pct}%` : "0%", transitionDelay: `${reduced ? 0 : delay}ms` }}
      />
    </div>
  );
}

/* ------------------------------- Donut --------------------------------- */

export function Donut({
  segments,
  size = 168,
  thickness = 18,
  centerLabel,
  centerValue,
}: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: ReactNode;
}) {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>();
  const show = reduced || inView;

  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div ref={ref} className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(10,31,84,0.08)"
          strokeWidth={thickness}
        />
        {segments.map((s) => {
          const len = (s.value / total) * c;
          const dash = show ? `${len} ${c - len}` : `0 ${c}`;
          const el = (
            <circle
              key={s.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeDasharray={dash}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              className="transition-[stroke-dasharray] duration-1000 ease-out"
            />
          );
          offset += show ? len : 0;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-display text-3xl text-navy-900">{centerValue}</div>
        {centerLabel && (
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-navy-900/50">
            {centerLabel}
          </div>
        )}
      </div>
    </div>
  );
}

/* --------------------------- Radar de jugador -------------------------- */

export function RadarChart({ data }: { data: { label: string; value: number }[] }) {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>();
  const show = reduced || inView;

  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 92;
  const n = data.length;

  const point = (i: number, value: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = (radius * value) / 100;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)] as const;
  };

  const poly = data.map((d, i) => point(i, show ? d.value : 0).join(",")).join(" ");

  return (
    <div ref={ref} className="flex justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="max-w-full">
        {[25, 50, 75, 100].map((lvl) => (
          <polygon
            key={lvl}
            points={data.map((_, i) => point(i, lvl).join(",")).join(" ")}
            fill="none"
            stroke="rgba(10,31,84,0.12)"
            strokeWidth="1"
          />
        ))}
        {data.map((_, i) => {
          const [x, y] = point(i, 100);
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(10,31,84,0.12)" />;
        })}
        <polygon
          points={poly}
          fill="rgba(252,209,22,0.45)"
          stroke="#10307A"
          strokeWidth="2.5"
          className="transition-all duration-1000 ease-out"
        />
        {data.map((d, i) => {
          const [x, y] = point(i, 118);
          return (
            <text
              key={d.label}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="9"
              fontWeight="700"
              fill="#0a1f54"
            >
              {d.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

/* ----------------------------- Escudo rival ---------------------------- */

export function TeamBadge({
  teamKey,
  className = "h-10 w-10",
}: {
  teamKey: keyof typeof TEAMS;
  className?: string;
}) {
  const t = TEAMS[teamKey];
  const style: CSSProperties = {
    background: `linear-gradient(140deg, ${t.c1} 0%, ${t.c1} 48%, ${t.c2} 48%, ${t.c2} 100%)`,
  };
  return (
    <span
      className={`inline-grid shrink-0 place-items-center rounded-full border border-black/10 shadow-sm ${className}`}
      style={style}
      aria-hidden="true"
    >
      <span className="grid h-[68%] w-[68%] place-items-center rounded-full bg-white/90 text-[9px] font-extrabold tracking-tight text-navy-950">
        {t.abbr}
      </span>
    </span>
  );
}

/* ---------------------------- Título sección --------------------------- */

export function SectionTitle({
  kicker,
  title,
  description,
  light = false,
  center = false,
}: {
  kicker?: string;
  title: string;
  description?: string;
  light?: boolean;
  center?: boolean;
}) {
  return (
    <Reveal className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {kicker && (
        <div
          className={`inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.24em] ${
            light ? "text-gold-400" : "text-navy-700"
          }`}
        >
          <span className={`h-px w-8 ${light ? "bg-gold-400" : "bg-navy-700"}`} />
          {kicker}
        </div>
      )}
      <h2
        className={`mt-3 font-display text-4xl uppercase leading-[0.95] sm:text-5xl ${
          light ? "text-white" : "text-navy-900"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base leading-relaxed ${light ? "text-white/70" : "text-navy-900/70"}`}>
          {description}
        </p>
      )}
    </Reveal>
  );
}

/* ------------------------------ Pastilla ------------------------------- */

export function FormPill({ r }: { r: "V" | "E" | "D" }) {
  const map = {
    V: "bg-emerald-500 text-white",
    E: "bg-slate-300 text-navy-900",
    D: "bg-rose-500 text-white",
  } as const;
  return (
    <span className={`grid h-7 w-7 place-items-center rounded-lg text-xs font-extrabold ${map[r]}`}>
      {r}
    </span>
  );
}

/* ------------------------- Procedencia de los datos -------------------- */

export function SourceNote({
  className = "",
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <p
      className={`rounded-2xl border border-navy-900/10 bg-navy-900/[0.03] px-4 py-3 text-xs leading-relaxed text-navy-900/60 ${className}`}
    >
      <strong className="font-bold text-navy-900/80">Fuentes:</strong> {SOURCES}.{" "}
      {children ?? (
        <>
          La RFAF aporta clasificación, resultados y calendario; la plantilla y las estadísticas
          individuales proceden de las fichas del Coria C.F. de Coria del Río. Lo que la fuente
          correspondiente no publica se indica como «{NA}». Las fotografías son imágenes de recurso
          y no pertenecen al club.
        </>
      )}
    </p>
  );
}

/* ------------------------- Etiqueta de procedencia --------------------- */

const SRC_STYLE: Record<string, string> = {
  RFAF: "bg-emerald-100 text-emerald-800",
  LaPreferente: "bg-sky-100 text-sky-800",
  BeSoccer: "bg-violet-100 text-violet-800",
};

export function SourceTag({
  source,
  className = "",
}: {
  source?: SourceId | string;
  className?: string;
}) {
  if (!source) return null;
  const style = SRC_STYLE[source] ?? "bg-slate-100 text-navy-900/50";
  return (
    <span
      title={`Dato obtenido de: ${source}`}
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${style} ${className}`}
    >
      {source}
    </span>
  );
}

/* --------------------------- Última actualización ---------------------- */

export function UpdatedAt({ light = false }: { light?: boolean }) {
  return (
    <p
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
        light ? "bg-white/10 text-white/70" : "bg-navy-900/5 text-navy-900/60"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      Última actualización: {LAST_UPDATE}
    </p>
  );
}
