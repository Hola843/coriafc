import { useEffect, useRef, useState } from "react";
import Crest from "../components/Crest";
import { Link } from "../routeContext";
import { SESSION_KEY, useContent } from "../store/content";
import { Card, Field } from "./admin/widgets";
import {
  ClubSection,
  CrestSection,
  FansSection,
  GallerySection,
  MatchesSection,
  NewsSection,
  PlayersSection,
  StandingsSection,
  TeamStatsSection,
} from "./admin/sections";

const TABS = [
  { key: "escudo", label: "Escudo", icon: "🛡️" },
  { key: "noticias", label: "Noticias", icon: "📰" },
  { key: "partidos", label: "Partidos", icon: "⚽" },
  { key: "plantilla", label: "Plantilla", icon: "👥" },
  { key: "clasificacion", label: "Clasificación", icon: "📊" },
  { key: "stats", label: "Estadísticas", icon: "📈" },
  { key: "galeria", label: "Galería", icon: "🖼️" },
  { key: "aficion", label: "Afición", icon: "🙌" },
  { key: "club", label: "Club y estadio", icon: "🏟️" },
  { key: "ajustes", label: "Ajustes", icon: "⚙️" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

/* --------------------------------- Login --------------------------------- */

function Login({ onOk }: { onOk: () => void }) {
  const { content } = useContent();
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === content.password) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onOk();
    } else {
      setError(true);
      setPass("");
    }
  };

  return (
    <section className="relative isolate grid min-h-screen place-items-center overflow-hidden bg-navy-950 px-4 py-32">
      <div className="diag-navy absolute inset-0" />
      <div className="absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-gold-500/10 blur-3xl" />
      <form
        onSubmit={submit}
        className="animate-fade-up relative w-full max-w-md rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur"
      >
        <Crest className="mx-auto h-20 w-auto" />
        <h1 className="mt-5 text-center font-display text-3xl uppercase text-white">
          Área privada
        </h1>
        <p className="mt-2 text-center text-sm text-white/55">
          Introduce la clave de acceso para gestionar el contenido de la web.
        </p>

        <label className="mt-6 block">
          <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-[0.18em] text-gold-400">
            Clave de acceso
          </span>
          <input
            type="password"
            autoFocus
            value={pass}
            onChange={(e) => {
              setPass(e.target.value);
              setError(false);
            }}
            className="w-full rounded-xl border border-white/20 bg-navy-950/50 px-4 py-3 text-white outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
            placeholder="••••••••"
          />
        </label>

        {error && (
          <p className="mt-3 rounded-xl bg-rose-500/15 px-4 py-2.5 text-sm font-semibold text-rose-200">
            Clave incorrecta. Inténtalo de nuevo.
          </p>
        )}

        <button
          type="submit"
          className="mt-5 w-full rounded-full bg-gold-500 px-6 py-3.5 text-sm font-extrabold uppercase tracking-wide text-navy-950 transition hover:bg-gold-400"
        >
          Entrar
        </button>

        <Link
          to="/"
          className="mt-4 block text-center text-xs font-semibold uppercase tracking-wide text-white/40 transition hover:text-white/70"
        >
          ← Volver a la web
        </Link>
      </form>
    </section>
  );
}

/* -------------------------------- Ajustes -------------------------------- */

function SettingsSection({ onLogout }: { onLogout: () => void }) {
  const { content, update, reset, exportJson, importJson, lastSaved } = useContent();
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const download = () => {
    const blob = new Blob([exportJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `coria-cf-contenido-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const upload = async (file?: File) => {
    if (!file) return;
    const text = await file.text();
    setMsg(importJson(text) ? "Copia restaurada correctamente." : "El archivo no es válido.");
  };

  return (
    <>
      <Card title="Clave de acceso" desc="Cambia la contraseña del panel de administración.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nueva clave" type="password" value={pass1} onChange={setPass1} />
          <Field label="Repetir clave" type="password" value={pass2} onChange={setPass2} />
        </div>
        <button
          type="button"
          onClick={() => {
            if (pass1.length < 4) return setMsg("La clave debe tener al menos 4 caracteres.");
            if (pass1 !== pass2) return setMsg("Las claves no coinciden.");
            update("password", pass1);
            setPass1("");
            setPass2("");
            setMsg("Clave actualizada.");
          }}
          className="mt-4 rounded-full bg-navy-900 px-6 py-3 text-[11px] font-extrabold uppercase tracking-wide text-white transition hover:bg-navy-800"
        >
          Guardar clave
        </button>
      </Card>

      <Card
        title="Copias de seguridad"
        desc="Los cambios se guardan automáticamente en este navegador. Descarga una copia para llevarte el contenido a otro dispositivo o restaurarlo tras publicar."
      >
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={download}
            className="rounded-full bg-gold-500 px-6 py-3 text-[11px] font-extrabold uppercase tracking-wide text-navy-950 transition hover:bg-gold-400"
          >
            Descargar copia (.json)
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-full border border-navy-900/20 px-6 py-3 text-[11px] font-extrabold uppercase tracking-wide text-navy-900 transition hover:bg-slate-50"
          >
            Restaurar copia
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => upload(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => {
              if (
                confirm(
                  "¿Restaurar todo el contenido original? Se perderán tus cambios, incluido el escudo que hayas subido.",
                )
              ) {
                reset();
                setMsg("Contenido restaurado a los valores originales.");
              }
            }}
            className="rounded-full border border-rose-200 px-6 py-3 text-[11px] font-extrabold uppercase tracking-wide text-rose-600 transition hover:bg-rose-50"
          >
            Restaurar contenido original
          </button>
        </div>

        <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-xs leading-relaxed text-navy-900/60">
          <p>
            <strong className="text-navy-900/80">Resumen del contenido:</strong>{" "}
            {content.news.length} noticias · {content.categories.length} categorías ·{" "}
            {content.categories.reduce((a, c) => a + c.matches.length, 0)} partidos ·{" "}
            {content.players.length} jugadores del primer equipo · {content.gallery.length} imágenes.
          </p>
          <p className="mt-1">
            <strong className="text-navy-900/80">Escudo:</strong>{" "}
            {content.crestInfo
              ? `${content.crestInfo.name} (${(content.crestInfo.size / 1024).toFixed(0)} KB), subido desde el panel`
              : "usando el archivo de public/escudo-coria-cf.png"}
          </p>
          <ul className="mt-2 space-y-0.5">
            {content.categories.map((c) => (
              <li key={c.id}>
                {c.icon} <strong className="text-navy-900/70">{c.name}</strong> —{" "}
                {c.matches.length} partidos · {c.standings.length} equipos · {c.totals.pts} pts
              </li>
            ))}
          </ul>
          {lastSaved && (
            <p className="mt-1">
              Último guardado: {new Date(lastSaved).toLocaleTimeString("es-ES")}.
            </p>
          )}
        </div>
      </Card>

      <Card title="Sesión">
        <button
          type="button"
          onClick={onLogout}
          className="rounded-full bg-navy-900 px-6 py-3 text-[11px] font-extrabold uppercase tracking-wide text-white transition hover:bg-navy-800"
        >
          Cerrar sesión
        </button>
      </Card>

      {msg && (
        <div className="rounded-2xl bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700">
          {msg}
        </div>
      )}
    </>
  );
}

/* --------------------------------- Panel --------------------------------- */

export default function Admin() {
  const { saveError, lastSaved } = useContent();
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  const [tab, setTab] = useState<TabKey>("escudo");
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    if (!lastSaved) return;
    setSavedFlash(true);
    const id = window.setTimeout(() => setSavedFlash(false), 1600);
    return () => window.clearTimeout(id);
  }, [lastSaved]);

  if (!authed) return <Login onOk={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      {/* Barra del panel */}
      <div className="sticky top-0 z-40 border-b border-navy-900/10 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto max-w-[88rem] px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Crest className="h-10 w-auto" />
              <div>
                <p className="font-display text-xl uppercase leading-none text-navy-900">
                  Panel de contenido
                </p>
                <p className="text-[11px] text-navy-900/50">Coria C.F. · Área privada</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide transition ${
                  savedFlash ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-navy-900/40"
                }`}
              >
                {savedFlash ? "✓ Guardado" : "Guardado automático"}
              </span>
              <Link
                to="/"
                className="rounded-full border border-navy-900/20 px-4 py-2 text-[11px] font-extrabold uppercase tracking-wide text-navy-900 transition hover:bg-slate-50"
              >
                Ver web
              </Link>
              <button
                type="button"
                onClick={() => {
                  sessionStorage.removeItem(SESSION_KEY);
                  setAuthed(false);
                }}
                className="rounded-full bg-navy-900 px-4 py-2 text-[11px] font-extrabold uppercase tracking-wide text-white transition hover:bg-navy-800"
              >
                Salir
              </button>
            </div>
          </div>

          <nav className="-mx-1 mt-3 flex gap-1 overflow-x-auto pb-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`shrink-0 rounded-full px-4 py-2 text-[11px] font-extrabold uppercase tracking-wide transition ${
                  tab === t.key
                    ? "bg-gold-500 text-navy-950"
                    : "text-navy-900/60 hover:bg-slate-100 hover:text-navy-900"
                }`}
              >
                <span className="mr-1.5">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {saveError && (
        <div className="mx-auto mt-4 max-w-[88rem] px-4 sm:px-6">
          <p className="rounded-2xl bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700">
            {saveError}
          </p>
        </div>
      )}

      <main className="mx-auto mt-6 max-w-[88rem] space-y-6 px-4 pb-10 sm:px-6">
        {tab === "escudo" && <CrestSection />}
        {tab === "noticias" && <NewsSection />}
        {tab === "partidos" && <MatchesSection />}
        {tab === "plantilla" && <PlayersSection />}
        {tab === "clasificacion" && <StandingsSection />}
        {tab === "stats" && <TeamStatsSection />}
        {tab === "galeria" && <GallerySection />}
        {tab === "aficion" && <FansSection />}
        {tab === "club" && <ClubSection />}
        {tab === "ajustes" && (
          <SettingsSection
            onLogout={() => {
              sessionStorage.removeItem(SESSION_KEY);
              setAuthed(false);
            }}
          />
        )}
      </main>
    </div>
  );
}
