import Crest from "../components/Crest";
import { Link } from "../routeContext";
import {
  Counter,
  FormPill,
  Reveal,
  SectionTitle,
  SourceNote,
  TeamBadge,
  UpdatedAt,
} from "../components/ui";
import { PageHead } from "./Squad";
import { CLUB, IMG, NA, TEAMS, type Category, type Match } from "../data/club";
import { lastMatchOf, nextMatchOf, useSite } from "../store/content";

function resultOf(m: Match): "V" | "E" | "D" | null {
  if (!m.played) return null;
  const home = m.home === "coria";
  const gf = home ? m.goalsHome! : m.goalsAway!;
  const ga = home ? m.goalsAway! : m.goalsHome!;
  return gf > ga ? "V" : gf === ga ? "E" : "D";
}

function TeamLine({ k }: { k: string }) {
  return k === "coria" ? (
    <Crest className="h-9 w-auto shrink-0" />
  ) : (
    <TeamBadge teamKey={k} className="h-9 w-9" />
  );
}

/** Aviso cuando una sección aún no tiene datos cargados */
function Empty({ what }: { what: string }) {
  return (
    <p className="rounded-2xl border border-dashed border-navy-900/20 bg-slate-50 p-6 text-center text-sm text-navy-900/50">
      {what} · {NA}. Puede introducirse desde el panel de administración.
    </p>
  );
}

export default function TeamPage({ id }: { id: string }) {
  const { categories, players } = useSite();
  const cat: Category | undefined = categories.find((c) => c.id === id);

  if (!cat) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-40 text-center">
        <h1 className="font-display text-4xl uppercase text-navy-900">Equipo no encontrado</h1>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-navy-900 px-6 py-3 text-xs font-extrabold uppercase tracking-wide text-white"
        >
          Volver al inicio
        </Link>
      </section>
    );
  }

  const next = nextMatchOf(cat.matches);
  const last = lastMatchOf(cat.matches);
  const t = cat.totals;
  const row = cat.standings.find((r) => r.key === "coria");
  const squad = cat.linksPlayers ? players : [];
  const scorers = cat.linksPlayers
    ? [...players].filter((p) => (p.goals ?? 0) > 0).sort((a, b) => (b.goals ?? 0) - (a.goals ?? 0))
    : [...cat.scorers].sort((a, b) => b.goals - a.goals);

  return (
    <>
      <PageHead
        kicker={`${cat.group ?? "Equipo"} · ${CLUB.season}`}
        title={cat.name}
        text={cat.competition}
        image={cat.image ?? IMG.action2}
      />

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-[88rem] space-y-12 px-4 sm:px-6">
          {/* Ficha */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { l: "Categoría", v: cat.group ?? NA },
              { l: "Competición", v: cat.competition },
              { l: "Entrenador", v: cat.coach },
              { l: "Campo", v: cat.venue },
            ].map((d, i) => (
              <Reveal key={d.l} delay={i * 50}>
                <div className="h-full rounded-2xl border border-navy-900/10 bg-slate-50 p-5">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-navy-700">
                    {d.l}
                  </p>
                  <p
                    className={`mt-1 font-bold ${d.v === NA ? "text-navy-900/40" : "text-navy-950"}`}
                  >
                    {d.v}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Próximo partido y último resultado */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="h-full overflow-hidden rounded-3xl border border-navy-900/10">
                <div className="bg-gold-500 px-5 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-navy-950">
                  Próximo partido
                </div>
                {next && !next.played ? (
                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <TeamLine k={next.home} />
                      <span className="font-bold text-navy-950">
                        {TEAMS[next.home]?.name ?? next.home}
                      </span>
                      <span className="text-navy-900/35">vs</span>
                      <TeamLine k={next.away} />
                      <span className="font-bold text-navy-950">
                        {TEAMS[next.away]?.name ?? next.away}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-navy-900/65">
                      {next.dateLabel} · {next.time === NA ? "Hora por confirmar" : `${next.time} h`}
                    </p>
                    <p className="text-sm text-navy-900/50">{next.venue}</p>
                    <Link
                      to={`/partido/${next.id}`}
                      className="mt-4 inline-flex rounded-full bg-navy-900 px-5 py-2.5 text-[11px] font-extrabold uppercase tracking-wide text-white transition hover:bg-navy-800"
                    >
                      Ver partido
                    </Link>
                  </div>
                ) : (
                  <div className="p-6">
                    <Empty what="Próximo partido" />
                  </div>
                )}
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="h-full overflow-hidden rounded-3xl bg-navy-900 text-white">
                <div className="border-b border-white/10 px-5 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold-400">
                  Último resultado
                </div>
                {last && last.played ? (
                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <TeamLine k={last.home} />
                      <span className="font-bold">{TEAMS[last.home]?.name ?? last.home}</span>
                      <span className="font-display text-2xl text-gold-400">
                        {last.goalsHome} - {last.goalsAway}
                      </span>
                      <TeamLine k={last.away} />
                      <span className="font-bold">{TEAMS[last.away]?.name ?? last.away}</span>
                    </div>
                    <p className="mt-3 text-sm text-white/60">{last.dateLabel}</p>
                    <Link
                      to={`/partido/${last.id}`}
                      className="mt-4 inline-flex rounded-full border border-white/25 px-5 py-2.5 text-[11px] font-extrabold uppercase tracking-wide text-white transition hover:bg-white/10"
                    >
                      Ficha del partido
                    </Link>
                  </div>
                ) : (
                  <div className="p-6">
                    <p className="rounded-2xl border border-dashed border-white/20 p-6 text-center text-sm text-white/45">
                      Último resultado · {NA}
                    </p>
                  </div>
                )}
              </div>
            </Reveal>
          </div>

          {/* Estadísticas */}
          <div>
            <SectionTitle kicker="Temporada" title="Estadísticas del equipo" />
            {t.pj > 0 ? (
              <>
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
                  {[
                    { l: "Puntos", v: t.pts },
                    { l: "Jugados", v: t.pj },
                    { l: "Victorias", v: t.pg },
                    { l: "Empates", v: t.pe },
                    { l: "Derrotas", v: t.pp },
                    { l: "Goles a favor", v: t.gf },
                    { l: "Goles en contra", v: t.gc },
                  ].map((s, i) => (
                    <Reveal key={s.l} delay={i * 45}>
                      <div className="rounded-2xl border border-navy-900/10 bg-slate-50 p-4">
                        <div className="font-display text-3xl text-navy-800">
                          <Counter to={s.v} />
                        </div>
                        <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-navy-900/50">
                          {s.l}
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
                {cat.form.length > 0 && (
                  <div className="mt-5 flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-navy-900/50">
                      Racha
                    </span>
                    {cat.form.map((f, i) => (
                      <FormPill key={i} r={f} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="mt-6">
                <Empty what="Estadísticas" />
              </div>
            )}
          </div>

          {/* Clasificación */}
          <div>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionTitle kicker="Competición" title="Clasificación" />
              {cat.standings.length > 0 && <UpdatedAt />}
            </div>
            {cat.standings.length === 0 ? (
              <div className="mt-6">
                <Empty what="Clasificación" />
              </div>
            ) : (
              <Reveal className="mt-6 overflow-hidden rounded-3xl border border-navy-900/10 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left text-sm">
                    <thead>
                      <tr className="bg-navy-900 text-[11px] uppercase tracking-wider text-white/80">
                        {["POS", "Equipo", "PJ", "PG", "PE", "PP", "GF", "GC", "DG", "PTS"].map(
                          (h) => (
                            <th
                              key={h}
                              className={`px-3 py-3 font-bold ${h === "Equipo" ? "text-left" : "text-center"}`}
                            >
                              {h}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {cat.standings.map((r) => {
                        const isCoria = r.key === "coria";
                        const dg = r.gf - r.gc;
                        return (
                          <tr
                            key={r.key}
                            className={`border-b border-navy-900/5 last:border-0 ${
                              isCoria ? "bg-gold-500/25" : "hover:bg-slate-50"
                            }`}
                          >
                            <td className="px-3 py-3 text-center font-bold text-navy-900/70">
                              {r.pos}
                            </td>
                            <td className="px-3 py-3">
                              <div className="flex items-center gap-3">
                                <TeamLine k={r.key} />
                                <span
                                  className={`font-semibold ${isCoria ? "text-navy-950" : "text-navy-900/85"}`}
                                >
                                  {TEAMS[r.key]?.name ?? r.key}
                                </span>
                              </div>
                            </td>
                            {[r.pj, r.pg, r.pe, r.pp, r.gf, r.gc].map((v, i) => (
                              <td key={i} className="px-3 py-3 text-center text-navy-900/70">
                                {v}
                              </td>
                            ))}
                            <td className="px-3 py-3 text-center font-semibold text-navy-900/80">
                              {dg > 0 ? `+${dg}` : dg}
                            </td>
                            <td className="px-3 py-3 text-center font-display text-lg text-navy-900">
                              {r.pg * 3 + r.pe}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Reveal>
            )}
            {row && (
              <p className="mt-3 text-sm font-semibold text-navy-900/60">
                Posición actual: {row.pos}º
              </p>
            )}
          </div>

          {/* Calendario */}
          <div>
            <SectionTitle kicker="Temporada" title="Calendario y resultados" />
            {cat.matches.length === 0 ? (
              <div className="mt-6">
                <Empty what="Calendario" />
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {cat.matches.map((m, i) => {
                  const res = resultOf(m);
                  return (
                    <Reveal key={m.id} delay={Math.min(i, 10) * 40}>
                      <Link
                        to={`/partido/${m.id}`}
                        className="flex flex-wrap items-center gap-4 rounded-2xl border border-navy-900/10 bg-slate-50 p-4 transition hover:border-gold-500 hover:bg-white"
                      >
                        <div className="w-14 shrink-0 rounded-xl bg-navy-900 py-2 text-center text-white">
                          <div className="text-[10px] font-bold uppercase text-gold-400">
                            {m.dayShort}
                          </div>
                          <div className="font-display text-lg leading-none">{m.dayNum}</div>
                          <div className="text-[9px] uppercase text-white/50">{m.monthShort}</div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-navy-950">
                            {TEAMS[m.home]?.name ?? m.home} — {TEAMS[m.away]?.name ?? m.away}
                          </p>
                          <p className="text-xs text-navy-900/50">{m.venue}</p>
                        </div>
                        {m.played ? (
                          <span className="flex items-center gap-2">
                            <span className="font-display text-xl text-navy-900">
                              {m.goalsHome} - {m.goalsAway}
                            </span>
                            {res && <FormPill r={res} />}
                          </span>
                        ) : (
                          <span className="rounded-full border border-navy-900/20 px-4 py-1.5 text-xs font-bold text-navy-900/70">
                            {m.time === NA ? "Por confirmar" : m.time}
                          </span>
                        )}
                      </Link>
                    </Reveal>
                  );
                })}
              </div>
            )}
          </div>

          {/* Plantilla y goleadores */}
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <SectionTitle kicker="Equipo" title="Plantilla" />
              {squad.length === 0 ? (
                <div className="mt-6">
                  <Empty what="Plantilla" />
                </div>
              ) : (
                <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                  {squad.map((p) => (
                    <li key={p.id}>
                      <Link
                        to={`/jugador/${p.id}`}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-navy-900/10 bg-slate-50 px-4 py-3 transition hover:border-gold-500 hover:bg-white"
                      >
                        <span className="min-w-0">
                          <span className="block truncate font-bold text-navy-950">
                            {`${p.first} ${p.last}`.trim()}
                          </span>
                          <span className="text-xs text-navy-900/50">{p.role ?? p.pos}</span>
                        </span>
                        <span className="font-display text-lg text-navy-800">{p.num ?? "—"}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <SectionTitle kicker="Rankings" title="Goleadores" />
              {scorers.length === 0 ? (
                <div className="mt-6">
                  <Empty what="Goleadores" />
                </div>
              ) : (
                <ul className="mt-6 space-y-2">
                  {scorers.map((s, i) => {
                    const name =
                      "first" in s ? `${s.first} ${s.last}`.trim() : (s as { name: string }).name;
                    const goals = s.goals ?? 0;
                    return (
                      <li
                        key={name}
                        className="flex items-center justify-between rounded-2xl border border-navy-900/10 bg-slate-50 px-4 py-3"
                      >
                        <span className="font-semibold text-navy-950">
                          <span className="mr-2 text-navy-900/40">{i + 1}.</span>
                          {i === 0 && <span className="mr-1">🥇</span>}
                          {name}
                        </span>
                        <span className="font-display text-lg text-navy-800">
                          <Counter to={goals} />
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          <SourceNote />
        </div>
      </section>
    </>
  );
}
