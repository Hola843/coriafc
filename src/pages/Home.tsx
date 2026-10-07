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
import { IMG, NA, TEAMS } from "../data/club";
import { lastMatchOf, nextMatchOf, useSite } from "../store/content";

/* --------------------------------- Hero --------------------------------- */

function Hero() {
  const { club, categories } = useSite();
  const matches = categories[0].matches;
  const next = nextMatchOf(matches);

  return (
    <section className="relative isolate overflow-hidden bg-navy-950">
      <img
        src={IMG.hero}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-950/92 to-navy-800/70" />
      <div className="diag-navy absolute inset-0" />
      <div className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-gold-500/15 blur-3xl" />

      <div className="relative mx-auto grid max-w-[88rem] gap-12 px-4 pb-20 pt-32 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pb-28 lg:pt-40">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-gold-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-400" />
            {club.league} · {club.season}
          </div>

          <h1 className="mt-6 font-display text-6xl uppercase leading-[0.88] text-white sm:text-8xl">
            Coria<span className="text-gold-400"> C.F.</span>
          </h1>
          <p className="mt-4 font-display text-2xl uppercase tracking-wide text-white/80 sm:text-3xl">
            Coria del Río · desde 1923
          </p>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65">
            El {club.name} fue fundado el {club.founded} y disputa sus encuentros en el{" "}
            {club.stadium}. Presidente: {club.president}. Entrenador: {club.coach}.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/partidos"
              className="rounded-full bg-gold-500 px-7 py-3.5 text-sm font-extrabold uppercase tracking-wide text-navy-950 shadow-lg shadow-gold-500/20 transition hover:-translate-y-0.5 hover:bg-gold-400"
            >
              Calendario
            </Link>
            <Link
              to="/clasificacion"
              className="rounded-full border border-white/25 px-7 py-3.5 text-sm font-extrabold uppercase tracking-wide text-white transition hover:border-white/60 hover:bg-white/10"
            >
              Clasificación
            </Link>
          </div>

          <dl className="mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-white/10 pt-6">
            <div>
              <dt className="font-display text-4xl text-white">
                <Counter to={1923} duration={1600} />
              </dt>
              <dd className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
                Fundación
              </dd>
            </div>
            <div>
              <dt className="font-display text-4xl text-white">
                <Counter to={club.capacity} duration={1600} />
              </dt>
              <dd className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
                Aforo
              </dd>
            </div>
            <div>
              <dt className="font-display text-4xl text-white">
                <Counter to={43} duration={1400} />
              </dt>
              <dd className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
                Temp. en 3ª
              </dd>
            </div>
          </dl>
        </div>

        {next && (
          <div className="animate-fade-up [animation-delay:140ms]">
            <div className="mx-auto max-w-md overflow-hidden rounded-3xl border border-white/15 bg-white/[0.06] shadow-2xl shadow-navy-950/50 backdrop-blur">
              <div className="flex items-center justify-between bg-gold-500 px-5 py-2.5">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-navy-950">
                  Próximo partido
                </span>
                <span className="text-[11px] font-bold uppercase text-navy-900">
                  {next.dayNum} {next.monthShort}
                </span>
              </div>

              <div className="px-5 py-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 text-center">
                    {next.home === "coria" ? (
                      <Crest className="mx-auto h-14 w-auto" />
                    ) : (
                      <TeamBadge teamKey={next.home} className="mx-auto h-14 w-14" />
                    )}
                    <p className="mt-2 text-xs font-bold text-white">{TEAMS[next.home]?.name}</p>
                  </div>
                  <div className="font-display text-xl text-gold-400">VS</div>
                  <div className="flex-1 text-center">
                    {next.away === "coria" ? (
                      <Crest className="mx-auto h-14 w-auto" />
                    ) : (
                      <TeamBadge teamKey={next.away} className="mx-auto h-14 w-14" />
                    )}
                    <p className="mt-2 text-xs font-bold text-white">{TEAMS[next.away]?.name}</p>
                  </div>
                </div>

                <div className="mt-5 space-y-1 text-center text-sm text-white/70">
                  <p>{next.dateLabel}</p>
                  <p className="font-bold text-white">
                    {next.time === NA ? "Horario por confirmar" : `${next.time} h`}
                  </p>
                  <p className="text-xs text-white/50">
                    {next.venue === NA ? "Campo del rival" : next.venue}
                  </p>
                </div>

                <Link
                  to={`/partido/${next.id}`}
                  className="mt-5 block rounded-full bg-white px-5 py-3 text-center text-sm font-extrabold uppercase tracking-wide text-navy-900 transition hover:bg-gold-300"
                >
                  Ver partido
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="relative h-3 stripes-bg" />
    </section>
  );
}

/* ------------------------------ Último resultado ------------------------ */

function LastResult() {
  const { categories, players } = useSite();
  const first = categories[0];
  const m = lastMatchOf(first.matches);
  const topScorers = [...players]
    .filter((p) => (p.goals ?? 0) > 0)
    .sort((a, b) => (b.goals ?? 0) - (a.goals ?? 0));
  if (!m) return null;

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[88rem] px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="overflow-hidden rounded-3xl bg-navy-900 text-white">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-6 py-3">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold-400">
                Último resultado
              </span>
              <span className="text-[11px] font-semibold text-white/60">{m.comp}</span>
            </div>
            <div className="grid items-center gap-4 px-6 py-8 sm:grid-cols-[1fr_auto_1fr]">
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-end">
                <span className="order-2 text-center font-display text-lg uppercase sm:order-1 sm:text-right">
                  {TEAMS[m.home]?.name}
                </span>
                {m.home === "coria" ? (
                  <Crest className="order-1 h-16 w-auto sm:order-2" />
                ) : (
                  <TeamBadge teamKey={m.home} className="order-1 h-16 w-16 sm:order-2" />
                )}
              </div>
              <div className="text-center">
                <div className="font-display text-5xl text-gold-400 sm:text-6xl">
                  <Counter to={m.goalsHome ?? 0} duration={900} />
                  <span className="mx-2 text-white/40">—</span>
                  <Counter to={m.goalsAway ?? 0} duration={900} />
                </div>
                <p className="mt-1 text-[11px] uppercase tracking-wider text-white/50">
                  {m.dateLabel}
                </p>
              </div>
              <div className="flex flex-col items-center gap-3 sm:flex-row">
                {m.away === "coria" ? (
                  <Crest className="h-16 w-auto" />
                ) : (
                  <TeamBadge teamKey={m.away} className="h-16 w-16" />
                )}
                <span className="text-center font-display text-lg uppercase sm:text-left">
                  {TEAMS[m.away]?.name}
                </span>
              </div>
            </div>
            <div className="border-t border-white/10 px-6 py-4 text-sm text-white/70">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-gold-400">
                Goleadores del equipo
              </span>
              <span className="ml-3">
                {topScorers.length > 0
                  ? topScorers
                      .map((p) => `${`${p.first} ${p.last}`.trim()} (${p.goals})`)
                      .join(" · ")
                  : NA}
              </span>
            </div>
            <div className="px-6 pb-6">
              <Link
                to={`/partido/${m.id}`}
                className="inline-flex rounded-full border border-white/25 px-6 py-2.5 text-xs font-extrabold uppercase tracking-wide text-white transition hover:bg-white/10"
              >
                Ficha del partido
              </Link>
            </div>
          </Reveal>

          <Reveal delay={120} className="rounded-3xl border border-navy-900/10 bg-slate-50 p-6">
            <h3 className="font-display text-2xl uppercase text-navy-900">
              Encuentros disputados
            </h3>
            <div className="mt-4 flex gap-2">
              {first.form.map((f, i) => (
                <FormPill key={i} r={f} />
              ))}
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-4">
              {[
                { l: "Goles a favor", v: first.totals.gf },
                { l: "Goles en contra", v: first.totals.gc },
                { l: "Puntos", v: first.totals.pts },
                { l: "Partidos", v: first.totals.pj },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl bg-white p-4 shadow-sm">
                  <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-navy-900/50">
                    {s.l}
                  </dt>
                  <dd className="font-display text-3xl text-navy-800">
                    <Counter to={s.v} />
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-6">
              <UpdatedAt />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Noticias ------------------------------ */

function NewsBlock() {
  const { news } = useSite();
  if (news.length === 0) return null;

  return (
    <section className="bg-slate-50 py-16 sm:py-24">
      <div className="mx-auto max-w-[88rem] px-4 sm:px-6">
        <SectionTitle
          kicker="Actualidad"
          title="Noticias del club"
          description="Comunicados publicados por el Coria C.F. en sus canales oficiales."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {news.map((n, i) => (
            <Reveal key={n.id} delay={i * 80} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-navy-900/10 bg-white transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-navy-900/10">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={n.image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-gold-500 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-navy-950">
                    {n.tag}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <time className="text-[11px] font-semibold uppercase tracking-wider text-navy-900/45">
                    {n.date}
                  </time>
                  <h3 className="mt-2 text-base font-bold leading-snug text-navy-950">{n.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-900/60">{n.text}</p>
                  {n.source && (
                    <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-navy-900/40">
                      Fuente: {n.source}
                    </p>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Mini tabla ------------------------------- */

function MiniTable() {
  const { categories } = useSite();
  const standings = categories[0].standings;
  const coria = standings.find((r) => r.key === "coria");
  const around = coria
    ? standings.filter((r) => Math.abs(r.pos - coria.pos) <= 3)
    : standings.slice(0, 7);

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-[88rem] px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle kicker="Competición" title="Clasificación" />
          <UpdatedAt />
        </div>
        <Reveal className="mt-8 overflow-hidden rounded-3xl border border-navy-900/10 shadow-xl shadow-navy-900/5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="bg-navy-900 text-[11px] uppercase tracking-wider text-white/80">
                  {["POS", "Equipo", "PJ", "PG", "PE", "PP", "GF", "GC", "DG", "PTS"].map((h) => (
                    <th
                      key={h}
                      className={`px-3 py-3 font-bold ${h === "Equipo" ? "text-left" : "text-center"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {around.map((r) => {
                  const isCoria = r.key === "coria";
                  const pts = r.pg * 3 + r.pe;
                  return (
                    <tr
                      key={r.key}
                      className={`border-b border-navy-900/5 last:border-0 ${
                        isCoria ? "bg-gold-500/20" : "bg-white hover:bg-slate-50"
                      }`}
                    >
                      <td className="px-3 py-3 text-center font-bold text-navy-900/70">{r.pos}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          {isCoria ? (
                            <Crest className="h-8 w-auto" />
                          ) : (
                            <TeamBadge teamKey={r.key} className="h-8 w-8" />
                          )}
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
                        {r.gf - r.gc > 0 ? `+${r.gf - r.gc}` : r.gf - r.gc}
                      </td>
                      <td className="px-3 py-3 text-center font-display text-lg text-navy-900">
                        {pts}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Reveal>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link
            to="/clasificacion"
            className="rounded-full bg-navy-900 px-7 py-3 text-xs font-extrabold uppercase tracking-wide text-white transition hover:bg-navy-800"
          >
            Ver clasificación completa
          </Link>
          <SourceNote className="min-w-[18rem] flex-1" />
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- El club en cifras ------------------------- */

function ClubFacts() {
  const { club } = useSite();
  return (
    <section className="relative overflow-hidden bg-navy-950 py-16 sm:py-24">
      <div className="diag-navy absolute inset-0" />
      <div className="relative mx-auto max-w-[88rem] px-4 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionTitle light kicker="El club" title="Coria Club de Fútbol" />
          <Link
            to="/estadio"
            className="w-fit rounded-full border border-white/25 px-6 py-3 text-xs font-extrabold uppercase tracking-wide text-white transition hover:bg-white/10"
          >
            Historia y estadio
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { l: "Fundación", v: club.founded },
            { l: "Localidad", v: club.city },
            { l: "Estadio", v: club.stadium },
            { l: "Presidente", v: club.president },
            { l: "Entrenador", v: club.coach },
            { l: "Competición", v: club.league },
            { l: "Equipación", v: club.kit },
            { l: "Web oficial", v: club.website },
          ].map((f, i) => (
            <Reveal key={f.l} delay={i * 60}>
              <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-gold-500/60 hover:bg-white/10">
                <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-gold-400">
                  {f.l}
                </div>
                <div className="mt-2 font-bold text-white">{f.v}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <LastResult />
      <NewsBlock />
      <MiniTable />
      <ClubFacts />
    </>
  );
}
