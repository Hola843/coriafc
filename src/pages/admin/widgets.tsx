import { useRef, useState, type ReactNode } from "react";
import { fileToDataUrl } from "../../store/content";

export function Card({
  title,
  desc,
  children,
  action,
}: {
  title: string;
  desc?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-navy-900/10 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl uppercase text-navy-900">{title}</h2>
          {desc && <p className="mt-1 text-sm text-navy-900/55">{desc}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  className = "",
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-[0.16em] text-navy-900/55">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-navy-900/15 bg-white px-3 py-2.5 text-sm text-navy-900 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
      />
    </label>
  );
}

export function Area({
  label,
  value,
  onChange,
  rows = 4,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-[0.16em] text-navy-900/55">
        {label}
      </span>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-y rounded-xl border border-navy-900/15 bg-white px-3 py-2.5 text-sm text-navy-900 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
      />
    </label>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-[0.16em] text-navy-900/55">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-navy-900/15 bg-white px-3 py-2.5 text-sm text-navy-900 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
        checked
          ? "border-emerald-500/40 bg-emerald-50 text-emerald-700"
          : "border-navy-900/15 bg-white text-navy-900/60"
      }`}
    >
      <span
        className={`relative h-5 w-9 shrink-0 rounded-full transition ${
          checked ? "bg-emerald-500" : "bg-navy-900/20"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
            checked ? "left-[1.1rem]" : "left-0.5"
          }`}
        />
      </span>
      {label}
    </button>
  );
}

export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const pick = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setErr(null);
    try {
      onChange(await fileToDataUrl(file));
    } catch {
      setErr("No se pudo procesar la imagen");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-[0.16em] text-navy-900/55">
        {label}
      </span>
      <div className="flex flex-wrap items-start gap-4 rounded-2xl border border-navy-900/10 bg-slate-50 p-3">
        <div className="h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-navy-900/5">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center text-[10px] text-navy-900/40">
              Sin imagen
            </div>
          )}
        </div>
        <div className="min-w-[12rem] flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="rounded-full bg-navy-900 px-4 py-2 text-[11px] font-extrabold uppercase tracking-wide text-white transition hover:bg-navy-800 disabled:opacity-50"
            >
              {busy ? "Procesando…" : "Subir imagen"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="rounded-full border border-rose-300 px-4 py-2 text-[11px] font-extrabold uppercase tracking-wide text-rose-600 transition hover:bg-rose-50"
              >
                Quitar
              </button>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => pick(e.target.files?.[0])}
          />
          <input
            type="text"
            value={value.startsWith("data:") ? "" : value}
            placeholder="o pega una URL de imagen"
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-xl border border-navy-900/15 bg-white px-3 py-2 text-xs text-navy-900 outline-none focus:border-gold-500"
          />
          {value.startsWith("data:") && (
            <p className="text-[10px] text-emerald-600">Imagen subida y guardada en el navegador.</p>
          )}
          {err && <p className="text-[10px] text-rose-600">{err}</p>}
        </div>
      </div>
    </div>
  );
}

export function ItemShell({
  title,
  subtitle,
  thumb,
  open,
  onToggle,
  onDelete,
  onUp,
  onDown,
  children,
}: {
  title: string;
  subtitle?: string;
  thumb?: string;
  open: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onUp?: () => void;
  onDown?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-navy-900/10 bg-slate-50">
      <div className="flex flex-wrap items-center gap-3 p-3">
        {thumb ? (
          <img src={thumb} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" />
        ) : null}
        <button type="button" onClick={onToggle} className="min-w-0 flex-1 text-left">
          <p className="truncate font-bold text-navy-950">{title || "(sin título)"}</p>
          {subtitle && <p className="truncate text-xs text-navy-900/50">{subtitle}</p>}
        </button>
        <div className="flex items-center gap-1">
          {onUp && (
            <button
              type="button"
              onClick={onUp}
              aria-label="Subir"
              className="grid h-8 w-8 place-items-center rounded-lg border border-navy-900/15 bg-white text-navy-900/60 transition hover:text-navy-900"
            >
              ↑
            </button>
          )}
          {onDown && (
            <button
              type="button"
              onClick={onDown}
              aria-label="Bajar"
              className="grid h-8 w-8 place-items-center rounded-lg border border-navy-900/15 bg-white text-navy-900/60 transition hover:text-navy-900"
            >
              ↓
            </button>
          )}
          <button
            type="button"
            onClick={onToggle}
            className="rounded-lg border border-navy-900/15 bg-white px-3 py-1.5 text-[11px] font-extrabold uppercase text-navy-900/70 transition hover:border-gold-500"
          >
            {open ? "Cerrar" : "Editar"}
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm("¿Eliminar este elemento? Esta acción no se puede deshacer.")) onDelete();
            }}
            className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-[11px] font-extrabold uppercase text-rose-600 transition hover:bg-rose-50"
          >
            Borrar
          </button>
        </div>
      </div>
      {open && <div className="space-y-4 border-t border-navy-900/10 bg-white p-4">{children}</div>}
    </div>
  );
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full bg-gold-500 px-5 py-2.5 text-[11px] font-extrabold uppercase tracking-wide text-navy-950 transition hover:bg-gold-400"
    >
      + {label}
    </button>
  );
}

/** Mueve un elemento dentro de un array */
export function move<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const copy = [...arr];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}
