import {
  Counter,
  Donut,
  ProgressBar,
  Reveal,
  SectionTitle,
  SourceNote,
  UpdatedAt,
} from "../components/ui";
import { PageHead } from "./Squad";
import { CLUB, IMG, NA } from "../data/club";
import { CategoryPicker, useCategory } from "../store/category";
import { useSite } from "../store/content";

export default function Stats() {
  const cat = useCategory();
  const { players } = useSite();
  const t = cat.totals;
  const hasData = t.pj > 0;
  const row = cat.standings.find((r) => r.key === "coria");
  const isFirstTeam = Boolean(cat.linksPlayers);

  const scorers = isFirstTeam
    ? [...players].filter((p) => (p.goals ?? 0) > 0).sort((a, b) => (b.goals ?? 0) - (a.goals ?? 0))
    : [];
  const minutes = isFirstTeam
    ? [...players].sort((a, b) => (b.min ?? 0) - (a.min ?? 0)).slice(0, 8)
    : [];

  const pctPoints = hasData ? Math.round((t.pts / (t.pj * 3)) * 100) : 0;
  const pctClean = hasData ? Math.round((t.cleanSheets / t.pj) * 100) : 0;
  const pctWins = hasData ? Math.round((t.pg / t.pj) * 100) : 0;

  return (
    <>
      <PageHead
        kicker={`Temporada ${CLUB.season}`}
        title="Coria Stats"
        text="Estadísticas del equipo calculadas a partir de los resultados oficiales publicados por la RFAF."
        image={IMG.action6}
      />

      <section className="bg-white pt-12">
        <div className="mx-auto max-w-[88rem] px-4 sm:px-6">
          <CategoryPicker />
          <p className="mt-4 font-display text-2xl uppercase text-navy-900">
            {cat.icon} {cat.name}
            <span className="ml-3 font-sans text-sm font-semibold normal-case text-navy-700">
              {cat.competition}
            </span>
          </p>
          <div className="mt-3">
            <UpdatedAt />
          </div>
        </div>
      </section>

      {!hasData ? (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-[88rem] px-4 sm:px-6">
            <p className="rounded-2xl border border-dashed border-navy-900/20 bg-slate-50 p-8 text-center text-navy-900/50">
              Estadísticas {NA.toLowerCase()}s en fuentes públicas para esta categoría.
            </p>
            <SourceNote className="mt-8" />
          </div>
        </section>
      ) : (
        <>
          {/* Cifras del equipo */}
          <section className="relative overflow-hidden bg-navy-950 py-16 sm:py-24">
            <div className="diag-navy absolute inset-0" />
            <div className="relative mx-auto max-w-[88rem] px-4 sm:px-6">
              <SectionTitle light kicker="Equipo" title={`Balance · ${cat.name}`} />

              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { l: "Partidos jugados", v: t.pj },
                  { l: "Victorias", v: t.pg },
                  { l: "Empates", v: t.pe },
                  { l: "Derrotas", v: t.pp },
                  { l: "Goles a favor", v: t.gf },
                  { l: "Goles en contra", v: t.gc },
                  { l: "Porterías a cero", v: t.cleanSheets },
                  { l: "Puntos", v: t.pts },
                ].map((s, i) => (
                  <Reveal key={s.l} delay={i * 50}>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-gold-500/60 hover:bg-white/10">
                      <div className="font-display text-5xl text-gold-400">
                        <Counter to={s.v} duration={1400} />
                      </div>
                      <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/60">
                        {s.l}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              <div className="mt-10 grid gap-6 lg:grid-cols-[auto_1fr]">
                <Reveal className="rounded-3xl bg-white p-8 text-center">
                  <h3 className="font-display text-xl uppercase text-navy-900">Resultados</h3>
                  <div className="mt-4">
                    <Donut
                      segments={[
                        { label: "Victorias", value: t.pg, color: "#10b981" },
                        { label: "Empates", value: t.pe, color: "#FCD116" },
                        { label: "Derrotas", value: t.pp, color: "#f43f5e" },
                      ]}
                      centerValue={<Counter to={t.pj} />}
                      centerLabel="Partidos"
                    />
                  </div>
                  <div className="mt-4 flex justify-center gap-4 text-xs font-semibold text-navy-900/70">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> V
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-gold-500" /> E
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> D
                    </span>
                  </div>
                </Reveal>

                <Reveal delay={120} className="rounded-3xl border border-white/10 bg-white/5 p-8">
                  <h3 className="font-display text-xl uppercase text-white">
                    Promedios y porcentajes
                  </h3>
                  <p className="mt-1 text-xs text-white/45">
                    Calculados sobre los resultados oficiales de la temporada {CLUB.season}.
                  </p>
                  <div className="mt-6 space-y-6">
                    {[
                      { l: "Puntos sobre disputados", v: pctPoints, color: "bg-gold-500" },
                      { l: "Porcentaje de victorias", v: pctWins, color: "bg-emerald-500" },
                      { l: "Partidos con portería a cero", v: pctClean, color: "bg-sky-400" },
                    ].map((s, i) => (
                      <div key={s.l}>
                        <div className="flex items-center justify-between text-sm font-semibold text-white">
                          <span>{s.l}</span>
                          <span className="font-display text-xl text-gold-400">
                            <Counter to={s.v} suffix="%" />
                          </span>
                        </div>
                        <ProgressBar
                          value={s.v}
                          color={s.color}
                          track="bg-white/10"
                          height="h-2.5"
                          delay={i * 90}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 sm:grid-cols-4">
                    {[
                      { l: "Goles / partido", v: t.avgFor, dec: 1 },
                      { l: "Encajados / partido", v: t.avgAgainst, dec: 1 },
                      { l: "Diferencia de goles", v: t.gf - t.gc, dec: 0 },
                      { l: "Posición", v: row?.pos ?? 0, dec: 0 },
                    ].map((s) => (
                      <div key={s.l}>
                        <div className="font-display text-3xl text-white">
                          <Counter to={s.v} decimals={s.dec} />
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-white/55">
                          {s.l}
                        </div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          {/* Rankings individuales reales */}
          {isFirstTeam && (
            <section className="bg-white py-16 sm:py-20">
              <div className="mx-auto max-w-[88rem] px-4 sm:px-6">
                <SectionTitle
                  kicker="Rankings"
                  title="Goleadores y minutos"
                  description={`Registro individual de la plantilla en ${CLUB.league}. La suma de goles coincide con los goles a favor que publica la RFAF.`}
                />
                <div className="mt-10 grid gap-6 lg:grid-cols-2">
                  <Reveal className="rounded-3xl border border-navy-900/10 bg-slate-50 p-6">
                    <h3 className="font-display text-2xl uppercase text-navy-900">Goleadores</h3>
                    {scorers.length === 0 ? (
                      <p className="mt-4 text-sm text-navy-900/50">{NA}</p>
                    ) : (
                      <ul className="mt-5 space-y-4">
                        {scorers.map((p, i) => (
                          <li key={p.id}>
                            <div className="flex items-center justify-between text-sm font-semibold text-navy-900">
                              <span className="truncate">
                                <span className="mr-2 text-navy-900/40">{i + 1}.</span>
                                {i === 0 && <span className="mr-1">🥇</span>}
                                {`${p.first} ${p.last}`.trim()}
                              </span>
                              <span className="font-display text-lg">
                                <Counter to={p.goals ?? 0} />
                              </span>
                            </div>
                            <ProgressBar
                              value={p.goals ?? 0}
                              max={scorers[0].goals ?? 1}
                              delay={i * 70}
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                  </Reveal>

                  <Reveal delay={120} className="rounded-3xl border border-navy-900/10 bg-slate-50 p-6">
                    <h3 className="font-display text-2xl uppercase text-navy-900">
                      Minutos disputados
                    </h3>
                    <ul className="mt-5 space-y-4">
                      {minutes.map((p, i) => (
                        <li key={p.id}>
                          <div className="flex items-center justify-between text-sm font-semibold text-navy-900">
                            <span className="truncate">
                              <span className="mr-2 text-navy-900/40">{i + 1}.</span>
                              {`${p.first} ${p.last}`.trim()}
                            </span>
                            <span className="font-display text-lg">
                              <Counter to={p.min ?? 0} />
                            </span>
                          </div>
                          <ProgressBar
                            value={p.min ?? 0}
                            max={minutes[0].min ?? 1}
                            color="bg-navy-800"
                            delay={i * 70}
                          />
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                </div>
                <SourceNote className="mt-8" />
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
