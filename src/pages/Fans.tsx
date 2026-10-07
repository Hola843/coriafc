import Crest from "../components/Crest";
import { Counter, Reveal, SectionTitle, SourceNote } from "../components/ui";
import { PageHead } from "./Squad";
import { CLUB, FAN_CAMPAIGN, IMG, NA } from "../data/club";
import { useSite } from "../store/content";

export default function Fans() {
  const { anthem, penas, fanMoments, club } = useSite();

  return (
    <>
      <PageHead
        kicker="El alma del club"
        title="Afición"
        text={`El ${club.name} apela al apoyo de la afición ribereña en su temporada ${club.season} en ${club.league}.`}
        image={IMG.fans3}
      />

      {/* Campaña oficial */}
      <section className="relative overflow-hidden bg-navy-950 py-16 sm:py-20">
        <div className="diag-navy absolute inset-0" />
        <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-[88rem] px-4 sm:px-6">
          <SectionTitle light kicker="Campaña oficial" title={FAN_CAMPAIGN.title} />
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <Reveal>
              <div className="rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur">
                <Crest className="h-20 w-auto" />
                <p className="mt-6 font-display text-4xl uppercase leading-none text-gold-400 sm:text-5xl">
                  «{FAN_CAMPAIGN.slogan}»
                </p>
                <p className="mt-4 text-white/70">{FAN_CAMPAIGN.text}</p>
                <p className="mt-6 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                  Fuente: {FAN_CAMPAIGN.source}
                </p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="overflow-hidden rounded-3xl border border-white/15">
                <img
                  src={IMG.fans1}
                  alt=""
                  loading="lazy"
                  className="h-80 w-full object-cover sm:h-full"
                />
              </div>
            </Reveal>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { l: "Año de fundación", v: 1923, num: true },
              { l: "Aforo del estadio", v: club.capacity, num: true },
              { l: "Temporada", v: club.season, num: false },
            ].map((s) => (
              <Reveal key={s.l}>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="font-display text-3xl text-gold-400">
                    {s.num ? <Counter to={Number(s.v)} /> : s.v}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-white/55">
                    {s.l}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Himno y peñas */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[88rem] px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-3xl border border-navy-900/10 bg-slate-50 p-6">
                <h3 className="font-display text-2xl uppercase text-navy-900">{anthem.title}</h3>
                <p className="mt-1 text-sm text-navy-900/55">{anthem.subtitle}</p>
                <dl className="mt-6 space-y-3">
                  {[
                    { k: "Audio oficial", v: NA },
                    { k: "Letra", v: anthem.lyrics.length > 0 ? "Disponible" : NA },
                    { k: "Duración", v: anthem.duration },
                    { k: "Autor", v: NA },
                  ].map((d) => (
                    <div
                      key={d.k}
                      className="flex items-center justify-between rounded-2xl border border-dashed border-navy-900/20 bg-white px-4 py-3"
                    >
                      <dt className="text-sm font-semibold text-navy-900/70">{d.k}</dt>
                      <dd
                        className={`text-sm font-bold ${d.v === NA ? "text-navy-900/35" : "text-navy-900"}`}
                      >
                        {d.v}
                      </dd>
                    </div>
                  ))}
                </dl>
                {anthem.lyrics.length > 0 && (
                  <div className="mt-6 space-y-1.5 text-sm text-navy-900/75">
                    {anthem.lyrics.map((l, i) => (
                      <p key={i}>{l}</p>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="h-full rounded-3xl border border-navy-900/10 bg-slate-50 p-6">
                <h3 className="font-display text-2xl uppercase text-navy-900">Peñas oficiales</h3>
                {penas.length === 0 ? (
                  <p className="mt-4 rounded-2xl border border-dashed border-navy-900/20 bg-white p-6 text-center text-sm text-navy-900/50">
                    Listado de peñas {NA.toLowerCase()} en fuentes públicas consultables.
                  </p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {penas.map((p) => (
                      <li
                        key={p.name}
                        className="flex items-center justify-between rounded-2xl bg-white px-4 py-3"
                      >
                        <span className="font-semibold text-navy-950">{p.name}</span>
                        <span className="text-xs text-navy-900/50">Desde {p.since}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <h3 className="mt-8 font-display text-2xl uppercase text-navy-900">Contacto</h3>
                <ul className="mt-4 space-y-3 text-sm text-navy-900/70">
                  <li className="rounded-2xl bg-white px-4 py-3">
                    <span className="block text-[10px] font-extrabold uppercase tracking-[0.16em] text-navy-700">
                      Estadio
                    </span>
                    {CLUB.address}
                  </li>
                  <li className="rounded-2xl bg-white px-4 py-3">
                    <span className="block text-[10px] font-extrabold uppercase tracking-[0.16em] text-navy-700">
                      Teléfono
                    </span>
                    {CLUB.phone}
                  </li>
                  <li className="rounded-2xl bg-white px-4 py-3">
                    <span className="block text-[10px] font-extrabold uppercase tracking-[0.16em] text-navy-700">
                      Web y redes
                    </span>
                    {CLUB.website} · {CLUB.twitter}
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>

          {fanMoments.length > 0 && (
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {fanMoments.map((f, i) => (
                <Reveal key={f.title} delay={i * 90}>
                  <article className="h-full overflow-hidden rounded-3xl border border-navy-900/10 bg-white">
                    <img src={f.img} alt="" loading="lazy" className="h-56 w-full object-cover" />
                    <div className="p-5">
                      <h3 className="font-display text-xl uppercase text-navy-950">{f.title}</h3>
                      <p className="mt-2 text-sm text-navy-900/65">{f.text}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}

          <SourceNote className="mt-10" />
        </div>
      </section>
    </>
  );
}
