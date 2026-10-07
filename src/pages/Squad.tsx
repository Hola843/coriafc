import { Link } from "../routeContext";
import { Counter, Reveal, SectionTitle, SourceNote, SourceTag } from "../components/ui";
import Crest from "../components/Crest";
import {
  CLUB,
  IMG,
  NA,
  POSITION_ORDER,
  SQUAD_CONCEDED,
  SQUAD_GOALS,
  SQUAD_HIGHLIGHTS,
  TRANSFERS_IN,
  TRANSFERS_OUT,
  type Player,
} from "../data/club";
import { useSite } from "../store/content";

export function PageHead({
  kicker,
  title,
  text,
  image,
}: {
  kicker: string;
  title: string;
  text?: string;
  image: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 pb-14 pt-32 sm:pb-20 sm:pt-40">
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-900/60" />
      <div className="diag-navy absolute inset-0" />
      <div className="relative mx-auto max-w-[88rem] px-4 sm:px-6">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.24em] text-gold-400">
            <span className="h-px w-8 bg-gold-400" />
            {kicker}
          </div>
          <h1 className="mt-3 font-display text-5xl uppercase leading-[0.92] text-white sm:text-7xl">
            {title}
          </h1>
          {text && <p className="mt-4 max-w-2xl text-white/70">{text}</p>}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-2 stripes-bg" />
    </section>
  );
}

function PlayerCard({ p, i }: { p: Player; i: number }) {
  return (
    <Reveal delay={i * 45}>
      <Link to={`/jugador/${p.id}`} className="group block h-full">
        <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-navy-900/10 bg-white transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-navy-900/15">
          <div className="relative flex h-24 items-center justify-between bg-navy-900 px-5">
            <div className="stripes-bg absolute inset-0 opacity-10" />
            <Crest className="relative h-12 w-auto" />
            <span className="relative font-display text-4xl leading-none text-white/85">
              {p.num ?? "—"}
            </span>
          </div>
          <div className="flex flex-1 flex-col p-5">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-navy-700">
              {p.role ?? p.pos}
            </p>
            <h3 className="mt-1 font-display text-xl uppercase leading-tight text-navy-950">
              {p.first}
              <br />
              <span className="text-2xl">{p.last}</span>
            </h3>
            {p.fullName && (
              <p className="mt-1 text-[11px] leading-snug text-navy-900/50">{p.fullName}</p>
            )}
            <p className="mt-2 text-xs text-navy-900/50">
              {p.nationality}
              {p.age !== null ? ` · ${p.age} años` : ` · edad ${NA.toLowerCase()}`}
            </p>
            {p.note && <p className="mt-2 text-[11px] font-semibold text-navy-700">{p.note}</p>}

            <div className="mt-4 grid grid-cols-4 gap-1 border-t border-navy-900/10 pt-3 text-center">
              {[
                { l: "PJ", v: p.pj },
                { l: "Min", v: p.min },
                { l: p.conceded !== undefined ? "Enc." : "Goles", v: p.conceded ?? p.goals },
                { l: "TA", v: p.yellow },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-base text-navy-800">
                    {s.v === null ? "—" : <Counter to={s.v} duration={900} />}
                  </div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-navy-900/45">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex justify-end">
              <SourceTag source={p.source} />
            </div>
          </div>
          <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gold-500 transition-transform duration-300 group-hover:scale-x-100" />
        </article>
      </Link>
    </Reveal>
  );
}

export default function Squad() {
  const { players: PLAYERS, staff: STAFF } = useSite();

  return (
    <>
      <PageHead
        kicker={`Temporada ${CLUB.season}`}
        title="Plantilla"
        text={`Plantilla del primer equipo del ${CLUB.name} (Coria del Río, Sevilla) para la temporada ${CLUB.season} en ${CLUB.league}.`}
        image={IMG.action2}
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[88rem] space-y-16 px-4 sm:px-6">
          <SourceNote>
            Plantilla y estadísticas individuales de la temporada {CLUB.season}. Los goles de los
            jugadores ({SQUAD_GOALS}) y los encajados por los porteros ({SQUAD_CONCEDED}) coinciden
            con los goles a favor y en contra que publica la RFAF, lo que confirma que los registros
            corresponden al Coria C.F. de Coria del Río. Los dorsales no han sido publicados:
            figuran como «{NA}».
          </SourceNote>

          {/* Destacados */}
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { l: "Máximo goleador", v: SQUAD_HIGHLIGHTS.topScorer, icon: "🥇" },
              { l: "Más minutos", v: SQUAD_HIGHLIGHTS.mostMinutes, icon: "⏱️" },
              { l: "Más amonestado", v: SQUAD_HIGHLIGHTS.mostBooked, icon: "🟨" },
            ].map((s, i) => (
              <Reveal key={s.l} delay={i * 70}>
                <div className="rounded-2xl bg-navy-900 p-5 text-white">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-gold-400">
                    {s.icon} {s.l}
                  </p>
                  <p className="mt-1 font-display text-xl uppercase">{s.v.name}</p>
                  <p className="text-xs text-white/55">{s.v.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {POSITION_ORDER.map((pos) => {
            const group = PLAYERS.filter((p) => p.pos === pos);
            if (group.length === 0) return null;
            return (
              <div key={pos}>
                <div className="flex items-center gap-4">
                  <h2 className="font-display text-3xl uppercase text-navy-900 sm:text-4xl">
                    {pos === "Sin determinar" ? "Sin demarcación" : `${pos}s`}
                  </h2>
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-gold-500 text-xs font-extrabold text-navy-950">
                    {group.length}
                  </span>
                  <span className="h-px flex-1 bg-navy-900/10" />
                </div>
                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {group.map((p, i) => (
                    <PlayerCard key={p.id} p={p} i={i} />
                  ))}
                </div>
              </div>
            );
          })}

          {/* Tabla completa de estadísticas */}
          <div>
            <SectionTitle
              kicker={`Estadísticas ${CLUB.season}`}
              title="Registro individual"
              description="PC = convocatorias · PJ = partidos jugados · PT = titularidades · Min = minutos disputados."
            />
            <Reveal className="mt-6 overflow-hidden rounded-3xl border border-navy-900/10 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-left text-sm">
                  <thead>
                    <tr className="bg-navy-900 text-[11px] uppercase tracking-wider text-white/80">
                      <th className="px-4 py-3 font-bold">Jugador</th>
                      <th className="px-3 py-3 font-bold">Demarcación</th>
                      {["PC", "PJ", "PT", "Min", "Goles", "TA", "TR"].map((h) => (
                        <th key={h} className="px-3 py-3 text-center font-bold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PLAYERS.map((p) => (
                      <tr key={p.id} className="border-b border-navy-900/5 last:border-0 hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <p className="font-bold text-navy-950">
                            {`${p.first} ${p.last}`.trim()}
                          </p>
                          {p.fullName && (
                            <p className="text-[11px] text-navy-900/50">{p.fullName}</p>
                          )}
                        </td>
                        <td className="px-3 py-3 text-navy-900/70">{p.role ?? p.pos}</td>
                        {[p.pc, p.pj, p.pt, p.min].map((v, i) => (
                          <td key={i} className="px-3 py-3 text-center text-navy-900/70">
                            {v === null ? "—" : v.toLocaleString("es-ES")}
                          </td>
                        ))}
                        <td className="px-3 py-3 text-center font-bold text-navy-900">
                          {p.conceded !== undefined && p.conceded !== null
                            ? `${p.conceded} enc.`
                            : (p.goals ?? "—")}
                        </td>
                        <td className="px-3 py-3 text-center text-navy-900/70">{p.yellow ?? "—"}</td>
                        <td className="px-3 py-3 text-center text-navy-900/70">{p.red ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-navy-900/10 bg-slate-50 px-4 py-3 text-xs text-navy-900/55">
                <span>
                  {PLAYERS.length} jugadores en la plantilla {CLUB.season} · {SQUAD_GOALS} goles
                  anotados · {SQUAD_CONCEDED} encajados
                </span>
                <SourceTag source={SQUAD_HIGHLIGHTS.source} />
              </div>
            </Reveal>
          </div>

          {/* Cuerpo técnico */}
          <div>
            <SectionTitle
              kicker="Organigrama"
              title="Cuerpo técnico y directiva"
              description="Los cargos que las fuentes no detallan figuran como «No disponible»."
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {STAFF.map((s, i) => (
                <Reveal key={s.role} delay={i * 50}>
                  <div className="flex h-full items-center gap-4 rounded-2xl border border-navy-900/10 bg-slate-50 p-4 transition hover:border-gold-500">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-navy-900 font-display text-base text-gold-400">
                      {s.name === NA
                        ? "—"
                        : s.name
                            .split(" ")
                            .slice(0, 2)
                            .map((w) => w[0])
                            .join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-navy-700">
                        {s.role}
                      </p>
                      <p
                        className={`font-bold ${s.name === NA ? "text-navy-900/40" : "text-navy-950"}`}
                      >
                        {s.name}
                      </p>
                      {s.fullName && s.fullName !== s.name && (
                        <p className="truncate text-[11px] text-navy-900/50">{s.fullName}</p>
                      )}
                    </div>
                    <SourceTag source={s.source === NA ? undefined : s.source} />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Altas y bajas */}
          <div>
            <SectionTitle
              kicker={`Mercado ${CLUB.season}`}
              title="Altas y bajas"
              description="Incorporaciones registradas en la plantilla del curso actual y jugadores que han abandonado el club."
            />
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <Reveal>
                <div className="h-full rounded-3xl border border-navy-900/10 bg-slate-50 p-6">
                  <h3 className="font-display text-xl uppercase text-emerald-700">
                    Altas ({TRANSFERS_IN.length})
                  </h3>
                  <ul className="mt-4 space-y-2">
                    {TRANSFERS_IN.map((t) => (
                      <li
                        key={t.name}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white px-4 py-3"
                      >
                        <div>
                          <p className="font-bold text-navy-950">{t.name}</p>
                          <p className="text-xs text-navy-900/55">
                            {t.pos} · procede de {t.from}
                          </p>
                        </div>
                        <SourceTag source={t.source} />
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <div className="h-full rounded-3xl border border-navy-900/10 bg-slate-50 p-6">
                  <h3 className="font-display text-xl uppercase text-rose-700">
                    Bajas ({TRANSFERS_OUT.length})
                  </h3>
                  <ul className="mt-4 space-y-2">
                    {TRANSFERS_OUT.map((t) => (
                      <li
                        key={t.name}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white px-4 py-3"
                      >
                        <div>
                          <p className="font-bold text-navy-950">{t.fullName ?? t.name}</p>
                          <p className="text-xs text-navy-900/55">Destino: {t.to}</p>
                        </div>
                        <SourceTag source={t.source} />
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------------------------- Ficha de jugador --------------------------- */

export function PlayerPage({ id }: { id: string }) {
  const { players } = useSite();
  const p = players.find((x) => x.id === id);

  if (!p) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-40 text-center">
        <h1 className="font-display text-4xl uppercase text-navy-900">Jugador no encontrado</h1>
        <Link
          to="/plantilla"
          className="mt-6 inline-flex rounded-full bg-navy-900 px-6 py-3 text-xs font-extrabold uppercase tracking-wide text-white"
        >
          Volver a la plantilla
        </Link>
      </section>
    );
  }

  const data = [
    { k: "Dorsal", v: p.num !== null ? String(p.num) : NA },
    { k: "Demarcación", v: p.role ?? p.pos },
    { k: "Edad", v: p.age !== null ? `${p.age} años` : NA },
    { k: "Nacionalidad", v: p.nationality },
    { k: "Nombre completo", v: p.fullName ?? `${p.first} ${p.last}`.trim() },
    { k: "Situación", v: p.note ?? NA },
  ];

  const stats = [
    { l: "Convocatorias", v: p.pc },
    { l: "Partidos jugados", v: p.pj },
    { l: "Titularidades", v: p.pt },
    { l: "Minutos", v: p.min },
    { l: p.conceded !== undefined ? "Goles encajados" : "Goles", v: p.conceded ?? p.goals },
    { l: "T. amarillas", v: p.yellow },
    { l: "T. rojas", v: p.red },
  ];

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy-950 pb-16 pt-28 sm:pt-36">
        <img src={IMG.hero} alt="" className="absolute inset-0 h-full w-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/92 to-navy-900/70" />
        <div className="diag-navy absolute inset-0" />
        <div className="relative mx-auto grid max-w-[88rem] items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.6fr_1.4fr]">
          <div className="animate-fade-up">
            <div className="relative grid h-72 place-items-center overflow-hidden rounded-[2rem] border border-white/15 bg-navy-900">
              <div className="stripes-bg absolute inset-0 opacity-10" />
              <Crest className="relative h-32 w-auto" />
              <span className="absolute bottom-4 right-6 font-display text-7xl leading-none text-white/80">
                {p.num ?? "—"}
              </span>
            </div>
          </div>

          <div className="animate-fade-up [animation-delay:120ms]">
            <Link
              to="/plantilla"
              className="text-xs font-extrabold uppercase tracking-wide text-gold-400 hover:text-gold-300"
            >
              ← Plantilla
            </Link>
            <p className="mt-4 text-[11px] font-extrabold uppercase tracking-[0.24em] text-gold-400">
              {p.role ?? p.pos} · {CLUB.short} · {CLUB.season}
            </p>
            <h1 className="mt-2 font-display text-5xl uppercase leading-[0.9] text-white sm:text-7xl">
              {p.first} <span className="text-gold-400">{p.last}</span>
            </h1>

            <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {data.map((d) => (
                <div key={d.k} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-400">
                    {d.k}
                  </dt>
                  <dd
                    className={`mt-1 text-sm font-bold ${d.v === NA ? "text-white/35" : "text-white"}`}
                  >
                    {d.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-2 stripes-bg" />
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[88rem] px-4 sm:px-6">
          <SectionTitle
            kicker={`Temporada ${CLUB.season}`}
            title="Estadísticas individuales"
            description={`Registro del jugador en ${CLUB.league}.`}
          />
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
            {stats.map((s, i) => (
              <Reveal key={s.l} delay={i * 50}>
                <div className="rounded-2xl border border-navy-900/10 bg-slate-50 p-5">
                  <div className="font-display text-3xl text-navy-800">
                    {s.v === null || s.v === undefined ? (
                      <span className="text-xl text-navy-900/35">{NA}</span>
                    ) : (
                      <Counter to={s.v} />
                    )}
                  </div>
                  <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-navy-900/50">
                    {s.l}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <SourceNote className="mt-8" />
        </div>
      </section>
    </>
  );
}
