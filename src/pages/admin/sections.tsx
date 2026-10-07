import { useRef, useState } from "react";
import { TEAMS, type GalleryItem, type Match, type Player, type Position } from "../../data/club";
import { CREST_SRC } from "../../crestSource";
import {
  fileToExactDataUrl,
  uid,
  useContent,
  type FormResult,
  type NewsItem,
} from "../../store/content";
import { AddButton, Area, Card, Field, ImageField, ItemShell, Select, Toggle, move } from "./widgets";

/* ------------------------------ Escudo oficial ------------------------- */

export function CrestSection() {
  const { content, setContent } = useContent();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const kb = (n: number) => `${(n / 1024).toFixed(0)} KB`;

  const upload = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMsg({ type: "err", text: "El archivo debe ser una imagen (PNG, JPG o SVG)." });
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setMsg({
        type: "err",
        text: "El archivo supera los 3 MB y no cabría en el almacenamiento del navegador. Usa el mismo escudo en un archivo más ligero.",
      });
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      // Bytes originales: sin canvas, sin recomprimir, sin redimensionar.
      const dataUrl = await fileToExactDataUrl(file);
      setContent({
        ...content,
        crest: dataUrl,
        crestInfo: { name: file.name, size: file.size, type: file.type },
      });
      setMsg({
        type: "ok",
        text: `Escudo actualizado. Se ha guardado «${file.name}» (${kb(file.size)}) sin ninguna modificación.`,
      });
    } catch {
      setMsg({ type: "err", text: "No se pudo leer el archivo. Inténtalo de nuevo." });
    } finally {
      setBusy(false);
    }
  };

  const remove = () => {
    setContent({ ...content, crest: "", crestInfo: null });
    setMsg({ type: "ok", text: `Escudo subido eliminado. Se vuelve a usar ${CREST_SRC}.` });
  };

  const current = content.crest || CREST_SRC;

  return (
    <Card
      title="Escudo oficial"
      desc="Sube aquí el archivo del escudo del Coria C.F. Se guarda tal cual, sin recomprimir, redimensionar ni cambiar formato, y aparecerá en toda la web."
    >
      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        {/* Vista previa */}
        <div className="space-y-3">
          <div className="grid h-56 w-56 place-items-center rounded-3xl border border-navy-900/10 bg-[linear-gradient(45deg,#f1f5f9_25%,transparent_25%,transparent_75%,#f1f5f9_75%),linear-gradient(45deg,#f1f5f9_25%,transparent_25%,transparent_75%,#f1f5f9_75%)] bg-white [background-position:0_0,10px_10px] [background-size:20px_20px]">
            <img
              key={current.slice(0, 48)}
              src={current}
              alt="Escudo oficial del Coria C.F."
              className="max-h-48 max-w-48 object-contain"
            />
          </div>
          <p className="text-center text-[10px] font-bold uppercase tracking-wider text-navy-900/45">
            Vista previa real
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-navy-900/10 bg-slate-50 p-4">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-navy-900/60">
              Archivo en uso
            </h4>
            {content.crestInfo ? (
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-navy-900/45">
                    Nombre
                  </dt>
                  <dd className="truncate font-semibold text-navy-950">
                    {content.crestInfo.name}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-navy-900/45">
                    Tamaño
                  </dt>
                  <dd className="font-semibold text-navy-950">{kb(content.crestInfo.size)}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-navy-900/45">
                    Formato
                  </dt>
                  <dd className="font-semibold text-navy-950">{content.crestInfo.type}</dd>
                </div>
              </dl>
            ) : (
              <p className="mt-2 text-sm text-navy-900/60">
                Ninguno subido. La web está usando{" "}
                <code className="rounded bg-white px-1.5 py-0.5 text-xs">{CREST_SRC}</code>.
              </p>
            )}
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              upload(e.dataTransfer.files?.[0]);
            }}
            className="rounded-2xl border-2 border-dashed border-navy-900/20 bg-white p-6 text-center transition hover:border-gold-500"
          >
            <p className="text-sm font-semibold text-navy-900/70">
              Arrastra aquí el archivo del escudo
            </p>
            <p className="mt-1 text-xs text-navy-900/45">PNG, JPG o SVG · máximo 3 MB</p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="mt-4 rounded-full bg-gold-500 px-6 py-3 text-[11px] font-extrabold uppercase tracking-wide text-navy-950 transition hover:bg-gold-400 disabled:opacity-50"
            >
              {busy ? "Procesando…" : "Seleccionar archivo"}
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              className="hidden"
              onChange={(e) => upload(e.target.files?.[0])}
            />
          </div>

          {content.crest && (
            <button
              type="button"
              onClick={remove}
              className="rounded-full border border-rose-200 px-6 py-3 text-[11px] font-extrabold uppercase tracking-wide text-rose-600 transition hover:bg-rose-50"
            >
              Quitar escudo subido
            </button>
          )}

          {msg && (
            <p
              className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                msg.type === "ok"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700"
              }`}
            >
              {msg.text}
            </p>
          )}

          <p className="rounded-2xl border border-navy-900/10 bg-navy-900/[0.03] px-4 py-3 text-xs leading-relaxed text-navy-900/60">
            <strong className="font-bold text-navy-900/80">Sin modificaciones.</strong> El archivo
            se guarda con sus bytes originales: no se rediseña, no se vectoriza, no se recorta y no
            se cambian colores, formas, texto ni proporciones. En la web solo se escala
            manteniendo su relación de aspecto. Aparecerá en el menú, la portada, las tarjetas de
            partido, la clasificación, las fichas de jugador, el pie de página y el favicon.
          </p>
        </div>
      </div>
    </Card>
  );
}

const teamOptions = Object.entries(TEAMS).map(([k, t]) => ({ value: k, label: t.name }));

/* -------------------------------- Noticias -------------------------------- */

export function NewsSection() {
  const { content, update } = useContent();
  const [open, setOpen] = useState<string | null>(null);
  const list = content.news;

  const set = (i: number, patch: Partial<NewsItem>) =>
    update("news", list.map((n, idx) => (idx === i ? { ...n, ...patch } : n)));

  const add = () => {
    const item: NewsItem = {
      id: uid("news"),
      tag: "Primer equipo",
      date: new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }),
      title: "Nueva noticia",
      text: "Escribe aquí el contenido de la noticia.",
      image: "",
    };
    update("news", [item, ...list]);
    setOpen(item.id);
  };

  return (
    <Card
      title="Noticias"
      desc="Crea, edita, reordena y elimina las noticias que aparecen en la portada."
      action={<AddButton label="Nueva noticia" onClick={add} />}
    >
      <div className="space-y-3">
        {list.length === 0 && (
          <p className="rounded-2xl border border-dashed border-navy-900/20 p-6 text-center text-sm text-navy-900/50">
            No hay noticias. Pulsa «Nueva noticia» para crear la primera.
          </p>
        )}
        {list.map((n, i) => (
          <ItemShell
            key={n.id}
            title={n.title}
            subtitle={`${n.tag} · ${n.date}`}
            thumb={n.image}
            open={open === n.id}
            onToggle={() => setOpen(open === n.id ? null : n.id)}
            onDelete={() => update("news", list.filter((x) => x.id !== n.id))}
            onUp={i > 0 ? () => update("news", move(list, i, i - 1)) : undefined}
            onDown={i < list.length - 1 ? () => update("news", move(list, i, i + 1)) : undefined}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Título" value={n.title} onChange={(v) => set(i, { title: v })} />
              <Field label="Categoría" value={n.tag} onChange={(v) => set(i, { tag: v })} />
              <Field label="Fecha" value={n.date} onChange={(v) => set(i, { date: v })} />
            </div>
            <Area label="Texto" value={n.text} onChange={(v) => set(i, { text: v })} />
            <ImageField label="Imagen" value={n.image} onChange={(v) => set(i, { image: v })} />
          </ItemShell>
        ))}
      </div>
    </Card>
  );
}

/* -------------------------------- Partidos -------------------------------- */

/** Selector de categoría reutilizado por las secciones del panel */
function CatTabs({ idx, setIdx }: { idx: number; setIdx: (v: number) => void }) {
  const { content } = useContent();
  return (
    <div className="mb-5 flex flex-wrap gap-2 rounded-2xl bg-slate-100 p-2">
      {content.categories.map((c, i) => (
        <button
          key={c.id}
          type="button"
          onClick={() => setIdx(i)}
          className={`rounded-full px-4 py-2 text-[11px] font-extrabold uppercase tracking-wide transition ${
            idx === i ? "bg-navy-900 text-white" : "text-navy-900/60 hover:bg-white"
          }`}
        >
          <span className="mr-1.5">{c.icon}</span>
          {c.short}
        </button>
      ))}
    </div>
  );
}

export function MatchesSection() {
  const { content, updateCategory } = useContent();
  const [catIdx, setCatIdx] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  const cat = content.categories[catIdx];
  const list = cat.matches;
  const update = (_k: "matches", v: Match[]) => updateCategory(catIdx, { matches: v });

  const set = (i: number, patch: Partial<Match>) =>
    update("matches", list.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));

  const add = () => {
    const m: Match = {
      id: uid("match"),
      comp: "Tercera Federación",
      round: `Jornada ${list.length + 1}`,
      dateLabel: "Domingo",
      dayShort: "Dom",
      dayNum: "01",
      monthShort: "Ene",
      time: "12:00",
      home: "coria",
      away: "sanroque",
      venue: "Estadio Guadalquivir",
      played: false,
    };
    update("matches", [...list, m]);
    setOpen(m.id);
  };

  return (
    <Card
      title="Partidos y resultados"
      desc="Cada categoría tiene su propio calendario: marcadores, goles, tarjetas, estadísticas, MVP y galería."
      action={<AddButton label="Nuevo partido" onClick={add} />}
    >
      <CatTabs idx={catIdx} setIdx={setCatIdx} />
      <div className="space-y-3">
        {list.map((m, i) => (
          <ItemShell
            key={m.id}
            title={`${TEAMS[m.home]?.name ?? m.home} ${m.played ? `${m.goalsHome ?? 0}-${m.goalsAway ?? 0}` : "vs"} ${TEAMS[m.away]?.name ?? m.away}`}
            subtitle={`${m.round} · ${m.dateLabel} · ${m.played ? "Jugado" : "Pendiente"}`}
            open={open === m.id}
            onToggle={() => setOpen(open === m.id ? null : m.id)}
            onDelete={() => update("matches", list.filter((x) => x.id !== m.id))}
            onUp={i > 0 ? () => update("matches", move(list, i, i - 1)) : undefined}
            onDown={i < list.length - 1 ? () => update("matches", move(list, i, i + 1)) : undefined}
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Competición" value={m.comp} onChange={(v) => set(i, { comp: v })} />
              <Field label="Jornada" value={m.round} onChange={(v) => set(i, { round: v })} />
              <Field label="Hora" value={m.time} onChange={(v) => set(i, { time: v })} />
              <Select
                label="Local"
                value={m.home}
                onChange={(v) => set(i, { home: v as Match["home"] })}
                options={teamOptions}
              />
              <Select
                label="Visitante"
                value={m.away}
                onChange={(v) => set(i, { away: v as Match["away"] })}
                options={teamOptions}
              />
              <Field label="Estadio" value={m.venue} onChange={(v) => set(i, { venue: v })} />
              <Field
                label="Fecha completa"
                value={m.dateLabel}
                onChange={(v) => set(i, { dateLabel: v })}
                className="sm:col-span-2"
              />
              <div className="grid grid-cols-3 gap-2">
                <Field label="Día" value={m.dayShort} onChange={(v) => set(i, { dayShort: v })} />
                <Field label="Nº" value={m.dayNum} onChange={(v) => set(i, { dayNum: v })} />
                <Field label="Mes" value={m.monthShort} onChange={(v) => set(i, { monthShort: v })} />
              </div>
            </div>

            <div className="flex flex-wrap items-end gap-4 rounded-2xl bg-slate-50 p-4">
              <Toggle
                label="Partido disputado"
                checked={m.played}
                onChange={(v) => set(i, { played: v })}
              />
              {m.played && (
                <>
                  <Field
                    label="Goles local"
                    type="number"
                    value={m.goalsHome ?? 0}
                    onChange={(v) => set(i, { goalsHome: Number(v) })}
                    className="w-28"
                  />
                  <Field
                    label="Goles visitante"
                    type="number"
                    value={m.goalsAway ?? 0}
                    onChange={(v) => set(i, { goalsAway: Number(v) })}
                    className="w-28"
                  />
                  <Select
                    label="MVP"
                    value={m.mvp ?? ""}
                    onChange={(v) => set(i, { mvp: v || undefined })}
                    options={[
                      { value: "", label: "— Sin MVP —" },
                      ...content.players.map((p) => ({
                        value: p.id,
                        label: `${p.first} ${p.last}`,
                      })),
                    ]}
                    className="min-w-[12rem] flex-1"
                  />
                </>
              )}
            </div>

            {m.played && (
              <>
                {/* Eventos */}
                <div className="rounded-2xl border border-navy-900/10 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-navy-900/60">
                      Goles, tarjetas y cambios
                    </h4>
                    <AddButton
                      label="Evento"
                      onClick={() =>
                        set(i, {
                          events: [
                            ...(m.events ?? []),
                            { minute: 1, type: "goal", side: "home", player: "Jugador" },
                          ],
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    {(m.events ?? []).map((e, ei) => (
                      <div
                        key={ei}
                        className="grid gap-2 rounded-xl bg-slate-50 p-3 sm:grid-cols-[5rem_8rem_8rem_1fr_1fr_auto]"
                      >
                        <Field
                          label="Min"
                          type="number"
                          value={e.minute}
                          onChange={(v) =>
                            set(i, {
                              events: (m.events ?? []).map((x, xi) =>
                                xi === ei ? { ...x, minute: Number(v) } : x,
                              ),
                            })
                          }
                        />
                        <Select
                          label="Tipo"
                          value={e.type}
                          onChange={(v) =>
                            set(i, {
                              events: (m.events ?? []).map((x, xi) =>
                                xi === ei ? { ...x, type: v as typeof x.type } : x,
                              ),
                            })
                          }
                          options={[
                            { value: "goal", label: "⚽ Gol" },
                            { value: "yellow", label: "🟨 Amarilla" },
                            { value: "red", label: "🟥 Roja" },
                            { value: "sub", label: "🔁 Cambio" },
                          ]}
                        />
                        <Select
                          label="Equipo"
                          value={e.side}
                          onChange={(v) =>
                            set(i, {
                              events: (m.events ?? []).map((x, xi) =>
                                xi === ei ? { ...x, side: v as typeof x.side } : x,
                              ),
                            })
                          }
                          options={[
                            { value: "home", label: "Local" },
                            { value: "away", label: "Visitante" },
                          ]}
                        />
                        <Field
                          label="Jugador"
                          value={e.player}
                          onChange={(v) =>
                            set(i, {
                              events: (m.events ?? []).map((x, xi) =>
                                xi === ei ? { ...x, player: v } : x,
                              ),
                            })
                          }
                        />
                        <Field
                          label="Detalle"
                          value={e.detail ?? ""}
                          onChange={(v) =>
                            set(i, {
                              events: (m.events ?? []).map((x, xi) =>
                                xi === ei ? { ...x, detail: v } : x,
                              ),
                            })
                          }
                        />
                        <button
                          type="button"
                          onClick={() =>
                            set(i, { events: (m.events ?? []).filter((_, xi) => xi !== ei) })
                          }
                          className="self-end rounded-xl border border-rose-200 px-3 py-2.5 text-[11px] font-extrabold uppercase text-rose-600 transition hover:bg-rose-50"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Estadísticas */}
                <div className="rounded-2xl border border-navy-900/10 p-4">
                  <h4 className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-navy-900/60">
                    Estadísticas del encuentro
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {(
                      [
                        ["possession", "Posesión %"],
                        ["shots", "Tiros"],
                        ["shotsOn", "Tiros a puerta"],
                        ["corners", "Córners"],
                        ["fouls", "Faltas"],
                        ["offsides", "Fuera de juego"],
                      ] as const
                    ).map(([key, label]) => {
                      const base = m.stats ?? {
                        possession: [50, 50],
                        shots: [0, 0],
                        shotsOn: [0, 0],
                        corners: [0, 0],
                        fouls: [0, 0],
                        offsides: [0, 0],
                      };
                      const pair = base[key];
                      return (
                        <div key={key} className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-2">
                          <Field
                            label={`${label} (L)`}
                            type="number"
                            value={pair[0]}
                            onChange={(v) =>
                              set(i, {
                                stats: { ...base, [key]: [Number(v), pair[1]] },
                              })
                            }
                          />
                          <Field
                            label={`${label} (V)`}
                            type="number"
                            value={pair[1]}
                            onChange={(v) =>
                              set(i, {
                                stats: { ...base, [key]: [pair[0], Number(v)] },
                              })
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Galería del partido */}
                <div className="rounded-2xl border border-navy-900/10 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-navy-900/60">
                      Galería del partido
                    </h4>
                    <AddButton
                      label="Foto"
                      onClick={() => set(i, { gallery: [...(m.gallery ?? []), ""] })}
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(m.gallery ?? []).map((src, gi) => (
                      <div key={gi} className="space-y-2">
                        <ImageField
                          label={`Foto ${gi + 1}`}
                          value={src}
                          onChange={(v) =>
                            set(i, {
                              gallery: (m.gallery ?? []).map((x, xi) => (xi === gi ? v : x)),
                            })
                          }
                        />
                        <button
                          type="button"
                          onClick={() =>
                            set(i, { gallery: (m.gallery ?? []).filter((_, xi) => xi !== gi) })
                          }
                          className="text-[11px] font-extrabold uppercase text-rose-600 hover:underline"
                        >
                          Quitar foto
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </ItemShell>
        ))}
      </div>
    </Card>
  );
}

/* -------------------------------- Plantilla ------------------------------- */

const POSITIONS: Position[] = ["Portero", "Defensa", "Centrocampista", "Delantero"];

export function PlayersSection() {
  const { content, update } = useContent();
  const [open, setOpen] = useState<string | null>(null);
  const list = content.players;

  const set = (i: number, patch: Partial<Player>) =>
    update("players", list.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));

  const add = () => {
    const p: Player = {
      id: uid("player"),
      num: null,
      first: "Nombre",
      last: "Apellido",
      pos: "Centrocampista",
      nationality: "España",
      age: null,
      height: null,
      pc: null,
      pj: null,
      pt: null,
      min: null,
      goals: null,
      yellow: null,
      red: null,
      source: "LaPreferente",
    };
    update("players", [...list, p]);
    setOpen(p.id);
  };

  return (
    <Card
      title="Plantilla"
      desc="Altas, bajas y edición de jugadores. Deja el dorsal vacío si todavía no se ha publicado."
      action={<AddButton label="Nuevo jugador" onClick={add} />}
    >
      <div className="space-y-3">
        {list.map((p, i) => (
          <ItemShell
            key={p.id}
            title={`${p.num ?? "—"} · ${p.first} ${p.last}`}
            subtitle={`${p.pos} · ${p.nationality}`}
            open={open === p.id}
            onToggle={() => setOpen(open === p.id ? null : p.id)}
            onDelete={() => update("players", list.filter((x) => x.id !== p.id))}
            onUp={i > 0 ? () => update("players", move(list, i, i - 1)) : undefined}
            onDown={i < list.length - 1 ? () => update("players", move(list, i, i + 1)) : undefined}
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field
                label="Dorsal (vacío = no disponible)"
                type="number"
                value={p.num ?? ""}
                onChange={(v) => set(i, { num: v === "" ? null : Number(v) })}
              />
              <Field label="Nombre" value={p.first} onChange={(v) => set(i, { first: v })} />
              <Field label="Apellido" value={p.last} onChange={(v) => set(i, { last: v })} />
              <Select
                label="Posición"
                value={p.pos}
                onChange={(v) => set(i, { pos: v as Position })}
                options={POSITIONS.map((x) => ({ value: x, label: x }))}
              />
              <Field
                label="Nacionalidad"
                value={p.nationality}
                onChange={(v) => set(i, { nationality: v })}
              />
              <Field
                label="Edad (vacío = no disponible)"
                type="number"
                value={p.age ?? ""}
                onChange={(v) => set(i, { age: v === "" ? null : Number(v) })}
              />
              <Field
                label="Demarcación detallada"
                value={p.role ?? ""}
                onChange={(v) => set(i, { role: v || undefined })}
              />
              <Field
                label="Nombre completo"
                value={p.fullName ?? ""}
                onChange={(v) => set(i, { fullName: v || undefined })}
                className="sm:col-span-2"
              />
              <Field
                label="Situación / procedencia"
                value={p.note ?? ""}
                onChange={(v) => set(i, { note: v || undefined })}
              />
              <Select
                label="Fuente del dato"
                value={p.source ?? ""}
                onChange={(v) => set(i, { source: (v || undefined) as Player["source"] })}
                options={[
                  { value: "", label: "— Sin indicar —" },
                  { value: "RFAF", label: "RFAF" },
                  { value: "LaPreferente", label: "LaPreferente" },
                  { value: "BeSoccer", label: "BeSoccer" },
                  { value: "Club oficial (@Coria_CF / coriacf.es)", label: "Club oficial" },
                ]}
              />
            </div>

            <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-4 lg:grid-cols-7">
              {(
                [
                  ["pc", "Convocatorias"],
                  ["pj", "Partidos"],
                  ["pt", "Titular"],
                  ["min", "Minutos"],
                  ["goals", "Goles"],
                  ["yellow", "Amarillas"],
                  ["red", "Rojas"],
                ] as const
              ).map(([key, label]) => (
                <Field
                  key={key}
                  label={label}
                  type="number"
                  value={p[key] ?? ""}
                  onChange={(v) => set(i, { [key]: v === "" ? null : Number(v) })}
                />
              ))}
            </div>

            {p.pos === "Portero" && (
              <Field
                label="Goles encajados"
                type="number"
                value={p.conceded ?? ""}
                onChange={(v) => set(i, { conceded: v === "" ? null : Number(v) })}
                className="max-w-[14rem]"
              />
            )}
          </ItemShell>
        ))}
      </div>
    </Card>
  );
}

/* ------------------------------ Clasificación ----------------------------- */

export function StandingsSection() {
  const { content, updateCategory } = useContent();
  const [catIdx, setCatIdx] = useState(0);
  const rows = content.categories[catIdx].standings;
  const update = (_k: "standings", v: typeof rows) => updateCategory(catIdx, { standings: v });

  const set = (i: number, patch: Partial<(typeof rows)[number]>) =>
    update("standings", rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  return (
    <Card
      title="Clasificación"
      desc="Tabla propia de cada categoría. Los puntos y la diferencia de goles se calculan automáticamente."
      action={
        <AddButton
          label="Equipo"
          onClick={() =>
            update("standings", [
              ...rows,
              { pos: rows.length + 1, key: "utrera", pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0 },
            ])
          }
        />
      }
    >
      <CatTabs idx={catIdx} setIdx={setCatIdx} />
      <div className="space-y-2">
        {rows.map((r, i) => (
          <div
            key={`${r.key}-${i}`}
            className="grid items-end gap-2 rounded-xl bg-slate-50 p-3 sm:grid-cols-[1fr_repeat(6,4.5rem)_auto]"
          >
            <Select
              label="Equipo"
              value={r.key}
              onChange={(v) => set(i, { key: v as typeof r.key })}
              options={teamOptions}
            />
            <Field label="PJ" type="number" value={r.pj} onChange={(v) => set(i, { pj: Number(v) })} />
            <Field label="PG" type="number" value={r.pg} onChange={(v) => set(i, { pg: Number(v) })} />
            <Field label="PE" type="number" value={r.pe} onChange={(v) => set(i, { pe: Number(v) })} />
            <Field label="PP" type="number" value={r.pp} onChange={(v) => set(i, { pp: Number(v) })} />
            <Field label="GF" type="number" value={r.gf} onChange={(v) => set(i, { gf: Number(v) })} />
            <Field label="GC" type="number" value={r.gc} onChange={(v) => set(i, { gc: Number(v) })} />
            <button
              type="button"
              onClick={() => update("standings", rows.filter((_, xi) => xi !== i))}
              className="rounded-xl border border-rose-200 px-3 py-2.5 text-[11px] font-extrabold uppercase text-rose-600 transition hover:bg-rose-50"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* --------------------------- Estadísticas equipo -------------------------- */

export function TeamStatsSection() {
  const { content, updateCategory } = useContent();
  const [catIdx, setCatIdx] = useState(0);
  const cat = content.categories[catIdx];
  const t = cat.totals;
  const set = (patch: Partial<typeof t>) => updateCategory(catIdx, { totals: { ...t, ...patch } });

  return (
    <Card
      title="Estadísticas por categoría"
      desc="Datos de temporada, racha y goleadores de cada equipo del club."
    >
      <CatTabs idx={catIdx} setIdx={setCatIdx} />

      <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field
          label="Nombre del equipo"
          value={cat.name}
          onChange={(v) => updateCategory(catIdx, { name: v })}
        />
        <Field
          label="Competición"
          value={cat.competition}
          onChange={(v) => updateCategory(catIdx, { competition: v })}
        />
        <Field
          label="Entrenador"
          value={cat.coach}
          onChange={(v) => updateCategory(catIdx, { coach: v })}
        />
        <Field
          label="Jugadores en plantilla"
          type="number"
          value={cat.squadSize ?? ""}
          onChange={(v) => updateCategory(catIdx, { squadSize: v === "" ? null : Number(v) })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <Field label="Partidos" type="number" value={t.pj} onChange={(v) => set({ pj: Number(v) })} />
        <Field label="Victorias" type="number" value={t.pg} onChange={(v) => set({ pg: Number(v) })} />
        <Field label="Empates" type="number" value={t.pe} onChange={(v) => set({ pe: Number(v) })} />
        <Field label="Derrotas" type="number" value={t.pp} onChange={(v) => set({ pp: Number(v) })} />
        <Field label="Goles a favor" type="number" value={t.gf} onChange={(v) => set({ gf: Number(v) })} />
        <Field label="Goles en contra" type="number" value={t.gc} onChange={(v) => set({ gc: Number(v) })} />
        <Field label="Puntos" type="number" value={t.pts} onChange={(v) => set({ pts: Number(v) })} />
        <Field
          label="Porterías a cero"
          type="number"
          value={t.cleanSheets}
          onChange={(v) => set({ cleanSheets: Number(v) })}
        />
        <Field
          label="Amarillas"
          type="number"
          value={t.yellow ?? ""}
          onChange={(v) => set({ yellow: v === "" ? null : Number(v) })}
        />
        <Field
          label="Rojas"
          type="number"
          value={t.red ?? ""}
          onChange={(v) => set({ red: v === "" ? null : Number(v) })}
        />
        <Field
          label="Goles/partido"
          type="number"
          value={t.avgFor}
          onChange={(v) => set({ avgFor: Number(v) })}
        />
        <Field
          label="Encajados/partido"
          type="number"
          value={t.avgAgainst}
          onChange={(v) => set({ avgAgainst: Number(v) })}
        />
        <Field
          label="Posesión %"
          type="number"
          value={t.possession ?? ""}
          onChange={(v) => set({ possession: v === "" ? null : Number(v) })}
        />
        <Field
          label="Acierto tiro %"
          type="number"
          value={t.shotAccuracy ?? ""}
          onChange={(v) => set({ shotAccuracy: v === "" ? null : Number(v) })}
        />
      </div>

      <div className="mt-6">
        <h4 className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-navy-900/60">
          Racha (últimos 5)
        </h4>
        <div className="flex flex-wrap gap-2">
          {cat.form.map((f, i) => (
            <select
              key={i}
              value={f}
              onChange={(e) =>
                updateCategory(catIdx, {
                  form: cat.form.map((x, xi) => (xi === i ? (e.target.value as FormResult) : x)),
                })
              }
              className="rounded-xl border border-navy-900/15 px-3 py-2 text-sm font-bold"
            >
              <option value="V">Victoria</option>
              <option value="E">Empate</option>
              <option value="D">Derrota</option>
            </select>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-navy-900/60">
            Goleadores de la categoría
          </h4>
          <AddButton
            label="Jugador"
            onClick={() =>
              updateCategory(catIdx, {
                scorers: [...cat.scorers, { name: "Nombre", goals: 0, assists: 0 }],
              })
            }
          />
        </div>
        <div className="space-y-2">
          {cat.scorers.map((s, i) => (
            <div key={i} className="grid items-end gap-2 rounded-xl bg-slate-50 p-3 sm:grid-cols-[1fr_7rem_7rem_auto]">
              <Field
                label="Nombre"
                value={s.name}
                onChange={(v) =>
                  updateCategory(catIdx, {
                    scorers: cat.scorers.map((x, xi) => (xi === i ? { ...x, name: v } : x)),
                  })
                }
              />
              <Field
                label="Goles"
                type="number"
                value={s.goals}
                onChange={(v) =>
                  updateCategory(catIdx, {
                    scorers: cat.scorers.map((x, xi) =>
                      xi === i ? { ...x, goals: Number(v) } : x,
                    ),
                  })
                }
              />
              <Field
                label="Asist."
                type="number"
                value={s.assists}
                onChange={(v) =>
                  updateCategory(catIdx, {
                    scorers: cat.scorers.map((x, xi) =>
                      xi === i ? { ...x, assists: Number(v) } : x,
                    ),
                  })
                }
              />
              <button
                type="button"
                onClick={() =>
                  updateCategory(catIdx, { scorers: cat.scorers.filter((_, xi) => xi !== i) })
                }
                className="rounded-xl border border-rose-200 px-3 py-2.5 text-[11px] font-extrabold uppercase text-rose-600 transition hover:bg-rose-50"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* --------------------------------- Galería -------------------------------- */

const CATS: GalleryItem["cat"][] = ["Partidos", "Estadio", "Entrenamientos", "Afición"];

export function GallerySection() {
  const { content, update } = useContent();
  const [open, setOpen] = useState<string | null>(null);
  const list = content.gallery;

  const set = (i: number, patch: Partial<GalleryItem>) =>
    update("gallery", list.map((g, idx) => (idx === i ? { ...g, ...patch } : g)));

  const add = () => {
    const item: GalleryItem = { id: uid("img"), cat: "Partidos", src: "", title: "Nueva imagen" };
    update("gallery", [item, ...list]);
    setOpen(item.id);
  };

  return (
    <Card
      title="Galería"
      desc="Sube y organiza las imágenes por categoría."
      action={<AddButton label="Nueva imagen" onClick={add} />}
    >
      <div className="space-y-3">
        {list.map((g, i) => (
          <ItemShell
            key={g.id}
            title={g.title}
            subtitle={g.cat}
            thumb={g.src}
            open={open === g.id}
            onToggle={() => setOpen(open === g.id ? null : g.id)}
            onDelete={() => update("gallery", list.filter((x) => x.id !== g.id))}
            onUp={i > 0 ? () => update("gallery", move(list, i, i - 1)) : undefined}
            onDown={i < list.length - 1 ? () => update("gallery", move(list, i, i + 1)) : undefined}
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Título" value={g.title} onChange={(v) => set(i, { title: v })} />
              <Select
                label="Categoría"
                value={g.cat}
                onChange={(v) => set(i, { cat: v as GalleryItem["cat"] })}
                options={CATS.map((c) => ({ value: c, label: c }))}
              />
              <div className="flex items-end">
                <Toggle
                  label="Destacada (doble alto)"
                  checked={!!g.tall}
                  onChange={(v) => set(i, { tall: v })}
                />
              </div>
            </div>
            <ImageField label="Imagen" value={g.src} onChange={(v) => set(i, { src: v })} />
          </ItemShell>
        ))}
      </div>
    </Card>
  );
}

/* --------------------------------- Afición -------------------------------- */

export function FansSection() {
  const { content, update } = useContent();
  const a = content.anthem;

  return (
    <>
      <Card title="Himno" desc="Título, duración y letra que se muestran en la sección Afición.">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Título" value={a.title} onChange={(v) => update("anthem", { ...a, title: v })} />
          <Field
            label="Subtítulo"
            value={a.subtitle}
            onChange={(v) => update("anthem", { ...a, subtitle: v })}
          />
          <Field
            label="Duración"
            value={a.duration}
            onChange={(v) => update("anthem", { ...a, duration: v })}
          />
        </div>
        <Area
          label="Letra (una línea por verso, deja una línea en blanco para separar estrofas)"
          value={a.lyrics.join("\n")}
          onChange={(v) => update("anthem", { ...a, lyrics: v.split("\n") })}
          rows={12}
          className="mt-4"
        />
      </Card>

      <Card
        title="Momentos de la afición"
        desc="Tarjetas destacadas de la grada."
        action={
          <AddButton
            label="Momento"
            onClick={() =>
              update("fanMoments", [
                ...content.fanMoments,
                { title: "Nuevo momento", text: "Descripción", img: "" },
              ])
            }
          />
        }
      >
        <div className="space-y-4">
          {content.fanMoments.map((f, i) => (
            <div key={i} className="space-y-3 rounded-2xl bg-slate-50 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Título"
                  value={f.title}
                  onChange={(v) =>
                    update(
                      "fanMoments",
                      content.fanMoments.map((x, xi) => (xi === i ? { ...x, title: v } : x)),
                    )
                  }
                />
                <Field
                  label="Texto"
                  value={f.text}
                  onChange={(v) =>
                    update(
                      "fanMoments",
                      content.fanMoments.map((x, xi) => (xi === i ? { ...x, text: v } : x)),
                    )
                  }
                />
              </div>
              <ImageField
                label="Imagen"
                value={f.img}
                onChange={(v) =>
                  update(
                    "fanMoments",
                    content.fanMoments.map((x, xi) => (xi === i ? { ...x, img: v } : x)),
                  )
                }
              />
              <button
                type="button"
                onClick={() => update("fanMoments", content.fanMoments.filter((_, xi) => xi !== i))}
                className="text-[11px] font-extrabold uppercase text-rose-600 hover:underline"
              >
                Eliminar momento
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card
        title="Peñas"
        desc="Listado de peñas oficiales."
        action={
          <AddButton
            label="Peña"
            onClick={() =>
              update("penas", [...content.penas, { name: "Nueva peña", since: 2026, members: 0 }])
            }
          />
        }
      >
        <div className="space-y-2">
          {content.penas.map((p, i) => (
            <div key={i} className="grid items-end gap-2 rounded-xl bg-slate-50 p-3 sm:grid-cols-[1fr_8rem_8rem_auto]">
              <Field
                label="Nombre"
                value={p.name}
                onChange={(v) =>
                  update("penas", content.penas.map((x, xi) => (xi === i ? { ...x, name: v } : x)))
                }
              />
              <Field
                label="Desde"
                type="number"
                value={p.since}
                onChange={(v) =>
                  update(
                    "penas",
                    content.penas.map((x, xi) => (xi === i ? { ...x, since: Number(v) } : x)),
                  )
                }
              />
              <Field
                label="Peñistas"
                type="number"
                value={p.members}
                onChange={(v) =>
                  update(
                    "penas",
                    content.penas.map((x, xi) => (xi === i ? { ...x, members: Number(v) } : x)),
                  )
                }
              />
              <button
                type="button"
                onClick={() => update("penas", content.penas.filter((_, xi) => xi !== i))}
                className="rounded-xl border border-rose-200 px-3 py-2.5 text-[11px] font-extrabold uppercase text-rose-600 transition hover:bg-rose-50"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

/* ------------------------------ Club y estadio ---------------------------- */

export function ClubSection() {
  const { content, update } = useContent();
  const c = content.club;
  const set = (patch: Partial<typeof c>) => update("club", { ...c, ...patch });

  return (
    <>
      <Card title="Datos del club" desc="Información general que aparece en la portada, el estadio y el pie.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Nombre completo" value={c.name} onChange={(v) => set({ name: v })} />
          <Field label="Nombre corto" value={c.short} onChange={(v) => set({ short: v })} />
          <Field label="Apodo" value={c.nickname} onChange={(v) => set({ nickname: v })} />
          <Field label="Fundación" value={c.founded} onChange={(v) => set({ founded: v })} />
          <Field label="Localidad" value={c.city} onChange={(v) => set({ city: v })} />
          <Field label="Estadio" value={c.stadium} onChange={(v) => set({ stadium: v })} />
          <Field
            label="Aforo"
            type="number"
            value={c.capacity}
            onChange={(v) => set({ capacity: Number(v) })}
          />
          <Field label="Competición" value={c.league} onChange={(v) => set({ league: v })} />
          <Field label="Teléfono" value={c.phone} onChange={(v) => set({ phone: v })} />
          <Field
            label="Dirección"
            value={c.address}
            onChange={(v) => set({ address: v })}
            className="sm:col-span-2"
          />
        </div>
      </Card>

      <Card
        title="Cuerpo técnico"
        action={
          <AddButton
            label="Miembro"
            onClick={() => update("staff", [...content.staff, { role: "Cargo", name: "Nombre" }])}
          />
        }
      >
        <div className="space-y-2">
          {content.staff.map((s, i) => (
            <div
              key={i}
              className="grid items-end gap-2 rounded-xl bg-slate-50 p-3 sm:grid-cols-[1fr_1fr_1fr_auto]"
            >
              <Field
                label="Cargo"
                value={s.role}
                onChange={(v) =>
                  update("staff", content.staff.map((x, xi) => (xi === i ? { ...x, role: v } : x)))
                }
              />
              <Field
                label="Nombre"
                value={s.name}
                onChange={(v) =>
                  update("staff", content.staff.map((x, xi) => (xi === i ? { ...x, name: v } : x)))
                }
              />
              <Field
                label="Nombre completo"
                value={s.fullName ?? ""}
                onChange={(v) =>
                  update(
                    "staff",
                    content.staff.map((x, xi) =>
                      xi === i ? { ...x, fullName: v || undefined } : x,
                    ),
                  )
                }
              />
              <button
                type="button"
                onClick={() => update("staff", content.staff.filter((_, xi) => xi !== i))}
                className="rounded-xl border border-rose-200 px-3 py-2.5 text-[11px] font-extrabold uppercase text-rose-600 transition hover:bg-rose-50"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card
        title="Historia del club"
        action={
          <AddButton
            label="Hito"
            onClick={() =>
              update("timeline", [
                ...content.timeline,
                { year: "2026", title: "Nuevo hito", text: "Descripción" },
              ])
            }
          />
        }
      >
        <div className="space-y-2">
          {content.timeline.map((t, i) => (
            <div key={i} className="grid items-end gap-2 rounded-xl bg-slate-50 p-3 sm:grid-cols-[6rem_1fr_2fr_auto]">
              <Field
                label="Año"
                value={t.year}
                onChange={(v) =>
                  update("timeline", content.timeline.map((x, xi) => (xi === i ? { ...x, year: v } : x)))
                }
              />
              <Field
                label="Título"
                value={t.title}
                onChange={(v) =>
                  update("timeline", content.timeline.map((x, xi) => (xi === i ? { ...x, title: v } : x)))
                }
              />
              <Field
                label="Texto"
                value={t.text}
                onChange={(v) =>
                  update("timeline", content.timeline.map((x, xi) => (xi === i ? { ...x, text: v } : x)))
                }
              />
              <button
                type="button"
                onClick={() => update("timeline", content.timeline.filter((_, xi) => xi !== i))}
                className="rounded-xl border border-rose-200 px-3 py-2.5 text-[11px] font-extrabold uppercase text-rose-600 transition hover:bg-rose-50"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card
        title="Palmarés"
        action={
          <AddButton
            label="Título"
            onClick={() => update("honours", [...content.honours, { title: "Competición", detail: "Año" }])}
          />
        }
      >
        <div className="space-y-2">
          {content.honours.map((h, i) => (
            <div key={i} className="grid items-end gap-2 rounded-xl bg-slate-50 p-3 sm:grid-cols-[2fr_1fr_auto]">
              <Field
                label="Competición"
                value={h.title}
                onChange={(v) =>
                  update("honours", content.honours.map((x, xi) => (xi === i ? { ...x, title: v } : x)))
                }
              />
              <Field
                label="Detalle"
                value={h.detail}
                onChange={(v) =>
                  update("honours", content.honours.map((x, xi) => (xi === i ? { ...x, detail: v } : x)))
                }
              />
              <button
                type="button"
                onClick={() => update("honours", content.honours.filter((_, xi) => xi !== i))}
                className="rounded-xl border border-rose-200 px-3 py-2.5 text-[11px] font-extrabold uppercase text-rose-600 transition hover:bg-rose-50"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Estadio" desc="Fichas, zonas y accesos del Estadio Guadalquivir.">
        <h4 className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-navy-900/60">
          Datos destacados
        </h4>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {content.stadiumFacts.map((f, i) => (
            <div key={i} className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-2">
              <Field
                label="Etiqueta"
                value={f.k}
                onChange={(v) =>
                  update(
                    "stadiumFacts",
                    content.stadiumFacts.map((x, xi) => (xi === i ? { ...x, k: v } : x)),
                  )
                }
              />
              <Field
                label="Valor"
                value={f.v}
                onChange={(v) =>
                  update(
                    "stadiumFacts",
                    content.stadiumFacts.map((x, xi) => (xi === i ? { ...x, v } : x)),
                  )
                }
              />
            </div>
          ))}
        </div>

        <h4 className="mb-2 mt-6 text-[11px] font-extrabold uppercase tracking-[0.16em] text-navy-900/60">
          Zonas del estadio
        </h4>
        <div className="space-y-2">
          {content.stadiumAreas.map((a, i) => (
            <div key={i} className="grid gap-2 rounded-xl bg-slate-50 p-3 sm:grid-cols-[1fr_2fr]">
              <Field
                label="Zona"
                value={a.name}
                onChange={(v) =>
                  update(
                    "stadiumAreas",
                    content.stadiumAreas.map((x, xi) => (xi === i ? { ...x, name: v } : x)),
                  )
                }
              />
              <Field
                label="Descripción"
                value={a.desc}
                onChange={(v) =>
                  update(
                    "stadiumAreas",
                    content.stadiumAreas.map((x, xi) => (xi === i ? { ...x, desc: v } : x)),
                  )
                }
              />
            </div>
          ))}
        </div>

        <h4 className="mb-2 mt-6 text-[11px] font-extrabold uppercase tracking-[0.16em] text-navy-900/60">
          Cómo llegar
        </h4>
        <div className="space-y-2">
          {content.howToArrive.map((h, i) => (
            <div key={i} className="grid gap-2 rounded-xl bg-slate-50 p-3 sm:grid-cols-[1fr_2fr]">
              <Field
                label="Medio"
                value={h.mode}
                onChange={(v) =>
                  update(
                    "howToArrive",
                    content.howToArrive.map((x, xi) => (xi === i ? { ...x, mode: v } : x)),
                  )
                }
              />
              <Field
                label="Detalle"
                value={h.detail}
                onChange={(v) =>
                  update(
                    "howToArrive",
                    content.howToArrive.map((x, xi) => (xi === i ? { ...x, detail: v } : x)),
                  )
                }
              />
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
