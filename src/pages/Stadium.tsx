import Crest from "../components/Crest";
import { Counter, Reveal, SectionTitle, SourceNote } from "../components/ui";
import { PageHead } from "./Squad";
import {
  CLUB_RECORDS,
  IMG,
  LAST_SEASON_DETAIL,
  PAST_SEASONS,
  SOURCE_USAGE,
} from "../data/club";
import { SourceTag } from "../components/ui";
import { useSite } from "../store/content";

export default function Stadium() {
  const {
    club,
    honours,
    howToArrive,
    stadiumAreas,
    stadiumFacts,
    timeline,
  } = useSite();

  return (
    <>
      <PageHead
        kicker={`${club.city} · desde 1923`}
        title="Estadio e historia"
        text={`El ${club.name} disputa sus encuentros en el ${club.stadium}, en uso desde 1923.`}
        image={IMG.stadiumNight}
      />

      {/* Estadio */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[88rem] px-4 sm:px-6">
          <Reveal className="relative overflow-hidden rounded-[2rem]">
            <img
              src={IMG.stadiumAerial}
              alt=""
              className="h-80 w-full object-cover sm:h-[28rem]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 flex flex-wrap items-end gap-6 p-6 sm:p-10">
              <Crest className="h-20 w-auto drop-shadow-xl sm:h-24" />
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold-400">
                  {club.city}
                </p>
                <p className="font-display text-3xl uppercase text-white sm:text-5xl">
                  {club.stadium}
                </p>
              </div>
            </div>
            <p className="absolute right-4 top-4 rounded-full bg-navy-950/70 px-3 py-1.5 text-[10px] text-white/70 backdrop-blur">
              Imagen de recurso
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {stadiumFacts.map((f, i) => (
              <Reveal key={f.k} delay={i * 50}>
                <div className="h-full rounded-2xl border border-navy-900/10 bg-slate-50 p-5 transition hover:border-gold-500 hover:bg-white hover:shadow-lg">
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-navy-700">
                    {f.k}
                  </div>
                  <div className="mt-1 font-display text-xl text-navy-900">{f.v}</div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <SectionTitle
                kicker="Información general"
                title="Un campo junto al Guadalquivir"
                description="El Estadio Guadalquivir acoge fútbol desde marzo de 1923, lo que lo convierte en uno de los recintos más antiguos de España que continúan en activo. Está situado a escasos metros de la orilla del río, en el sureste de Coria del Río."
              />

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {stadiumAreas.map((a, i) => (
                  <Reveal key={a.name} delay={i * 60}>
                    <div className="h-full rounded-2xl border border-navy-900/10 bg-white p-5 shadow-sm">
                      <h3 className="font-display text-lg uppercase text-navy-900">{a.name}</h3>
                      <p className="mt-1.5 text-sm text-navy-900/60">{a.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { l: "Aforo", v: club.capacity },
                  { l: "Año de apertura", v: 1923 },
                  { l: "Temporadas en 3ª", v: 43 },
                ].map((s) => (
                  <Reveal key={s.l}>
                    <div className="rounded-2xl bg-navy-900 p-5 text-white">
                      <div className="font-display text-3xl text-gold-400">
                        <Counter to={s.v} />
                      </div>
                      <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-white/55">
                        {s.l}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <div>
              <Reveal className="rounded-3xl border border-navy-900/10 bg-slate-50 p-6">
                <h3 className="font-display text-2xl uppercase text-navy-900">
                  Contacto y localización
                </h3>
                <ul className="mt-5 space-y-3">
                  {howToArrive.map((h) => (
                    <li
                      key={h.mode}
                      className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm"
                    >
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold-500" />
                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-navy-700">
                          {h.mode}
                        </p>
                        <p className="text-sm text-navy-900/70">{h.detail}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 rounded-2xl bg-navy-900 p-5 text-white">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-gold-400">
                    Datos del club
                  </p>
                  <p className="mt-1 text-sm text-white/75">
                    Presidente: {club.president} · Entrenador: {club.coach} · Equipación:{" "}
                    {club.kit}
                  </p>
                </div>
              </Reveal>

              <Reveal delay={120} className="mt-6 rounded-3xl border border-navy-900/10 p-6">
                <h3 className="font-display text-2xl uppercase text-navy-900">Datos históricos</h3>
                <ul className="mt-4 space-y-2.5">
                  {CLUB_RECORDS.map((r) => (
                    <li
                      key={r.k}
                      className="flex items-center justify-between gap-4 border-b border-navy-900/10 pb-2.5 text-sm last:border-0 last:pb-0"
                    >
                      <span className="text-navy-900/65">{r.k}</span>
                      <span className="font-bold text-navy-950">{r.v}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Historia */}
      <section className="relative overflow-hidden bg-navy-950 py-16 sm:py-24">
        <div className="diag-navy absolute inset-0" />
        <div className="relative mx-auto max-w-[88rem] px-4 sm:px-6">
          <SectionTitle light kicker="El club" title="Historia del Coria C.F." />
          <div className="mt-10 grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="relative">
              <div className="absolute bottom-4 left-[11px] top-3 w-0.5 bg-gradient-to-b from-gold-500 via-navy-600 to-transparent" />
              <ol className="space-y-7">
                {timeline.map((t, i) => (
                  <Reveal key={t.year} delay={i * 50} as="li" className="relative pl-12">
                    <span className="absolute left-0 top-1 grid h-6 w-6 place-items-center rounded-full border-2 border-gold-500 bg-navy-950">
                      <span className="h-2 w-2 rounded-full bg-gold-500" />
                    </span>
                    <div className="font-display text-xl text-gold-400">{t.year}</div>
                    <h3 className="mt-0.5 text-lg font-bold text-white">{t.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/60">{t.text}</p>
                  </Reveal>
                ))}
              </ol>
            </div>

            <div className="space-y-6">
              <Reveal delay={150}>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center gap-4">
                    <Crest className="h-16 w-auto" />
                    <div>
                      <h3 className="font-display text-2xl uppercase text-gold-400">Palmarés</h3>
                      <p className="text-sm text-white/55">Títulos oficiales del club</p>
                    </div>
                  </div>
                  <ul className="mt-5 space-y-3">
                    {honours.map((h) => (
                      <li
                        key={h.title}
                        className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 text-white last:border-0 last:pb-0"
                      >
                        <span className="text-sm font-semibold">{h.title}</span>
                        <span className="shrink-0 text-xs font-extrabold uppercase text-gold-400">
                          {h.detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={200}>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <h3 className="font-display text-xl uppercase text-white">
                    Últimas temporadas
                  </h3>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[20rem] text-left text-xs">
                      <thead>
                        <tr className="text-[10px] uppercase tracking-wider text-gold-400">
                          <th className="pb-2 font-bold">Temp.</th>
                          <th className="pb-2 font-bold">Competición</th>
                          <th className="pb-2 text-center font-bold">Pts</th>
                          <th className="pb-2 text-center font-bold">Pos.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {PAST_SEASONS.map((s) => (
                          <tr key={s.season} className="border-t border-white/10 text-white/75">
                            <td className="py-2 font-bold text-white">{s.season}</td>
                            <td className="py-2">{s.comp}</td>
                            <td className="py-2 text-center">{s.pts}</td>
                            <td className="py-2 text-center font-bold text-gold-400">{s.pos}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Balance de la última temporada y procedencia de los datos */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-[88rem] px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <SectionTitle
                kicker="Bloque histórico"
                title={`Balance ${LAST_SEASON_DETAIL.season}`}
                description={`Resultado final del primer equipo en ${LAST_SEASON_DETAIL.comp}, temporada que terminó con el descenso a División de Honor Andaluza.`}
              />
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { l: "Partidos", v: LAST_SEASON_DETAIL.pj },
                  { l: "Victorias", v: LAST_SEASON_DETAIL.pg },
                  { l: "Empates", v: LAST_SEASON_DETAIL.pe },
                  { l: "Derrotas", v: LAST_SEASON_DETAIL.pp },
                  { l: "Goles a favor", v: LAST_SEASON_DETAIL.gf },
                  { l: "Goles en contra", v: LAST_SEASON_DETAIL.gc },
                  { l: "Puntos", v: LAST_SEASON_DETAIL.pts },
                ].map((s, i) => (
                  <Reveal key={s.l} delay={i * 50}>
                    <div className="rounded-2xl border border-navy-900/10 bg-slate-50 p-4">
                      <div className="font-display text-3xl text-navy-800">
                        <Counter to={s.v} />
                      </div>
                      <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-navy-900/50">
                        {s.l}
                      </div>
                    </div>
                  </Reveal>
                ))}
                <Reveal delay={350}>
                  <div className="rounded-2xl bg-rose-50 p-4">
                    <div className="font-display text-3xl text-rose-700">
                      {LAST_SEASON_DETAIL.pos}
                    </div>
                    <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-rose-700/70">
                      Clasificación final
                    </div>
                  </div>
                </Reveal>
              </div>
              <div className="mt-4">
                <SourceTag source={LAST_SEASON_DETAIL.source} />
              </div>
            </div>

            <div>
              <SectionTitle
                kicker="Transparencia"
                title="Procedencia de los datos"
                description="Reparto aplicado en toda la web: la RFAF aporta los datos de competición (clasificación, resultados y calendario) y BeSoccer la plantilla, los jugadores y las estadísticas individuales. Si la fuente correspondiente no publica el dato, se muestra «No disponible»."
              />
              <ul className="mt-8 space-y-2">
                {SOURCE_USAGE.map((s, i) => (
                  <Reveal key={s.area} delay={i * 40} as="li">
                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-navy-900/10 bg-slate-50 px-4 py-3">
                      <div className="min-w-0">
                        <p className="font-bold text-navy-950">{s.area}</p>
                        <p className="text-xs text-navy-900/55">{s.detail}</p>
                      </div>
                      <SourceTag source={s.source} />
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>

          <SourceNote className="mt-10" />
        </div>
      </section>
    </>
  );
}
