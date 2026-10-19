import { useState } from "react";
import Crest from "../components/Crest";
import { Link } from "../routeContext";
import {
  Counter,
  Reveal,
  SectionTitle,
  SourceNote,
  SourceTag,
  TeamBadge,
  UpdatedAt,
} from "../components/ui";
import { PageHead } from "./Squad";
import { CLUB, IMG, NA, SRC, TEAMS, type Match } from "../data/club";
import { useSite } from "../store/content";
import { CategoryPicker, useCategory } from "../store/category";

function resultOf(m: Match): "V" | "E" | "D" | null {
  if (!m.played) return null;
  const coriaHome = m.home === "coria";
  const gf = coriaHome ? m.goalsHome! : m.goalsAway!;
  const ga = coriaHome ? m.goalsAway! : m.goalsHome!;
  return gf > ga ? "V" : gf === ga ? "E" : "D";
}

function MatchRow({ m, i }: { m: Match; i: number }) {
  const res = resultOf(m);
  const badge =
    res === "V"
      ? "bg-emerald-500 text-white"
      : res === "D"
        ? "bg-rose-500 text-white"
        : "bg-white/20 text-white";

  return (
    <Reveal delay={i * 40}>
      <Link to={`/partido/${m.id}`} className="group block">
        <div className="grid items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:-translate-y-1 hover:border-gold-500/60 hover:bg-white/10 sm:grid-cols-[auto_1fr_auto] sm:p-5">
          <div className="flex w-16 shrink-0 flex-col items-center rounded-xl bg-navy-950/70 py-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400">
              {m.dayShort}
            </span>
            <span className="font-display text-xl leading-none text-white">{m.dayNum}</span>
            <span className="text-[10px] uppercase text-white/50">{m.monthShort}</span>
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-400">
              {m.home === "coria" ? "Local" : "Visitante"} · {m.comp}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              {m.home === "coria" ? (
                <Crest className="h-9 w-auto shrink-0" />
              ) : (
                <TeamBadge teamKey={m.home} className="h-9 w-9" />
              )}
              <span className="text-sm font-bold text-white sm:text-base">
                {TEAMS[m.home]?.name ?? m.home}
              </span>
              <span className="text-white/35">—</span>
              {m.away === "coria" ? (
                <Crest className="h-9 w-auto shrink-0" />
              ) : (
                <TeamBadge teamKey={m.away} className="h-9 w-9" />
              )}
              <span className="text-sm font-bold text-white sm:text-base">
                {TEAMS[m.away]?.name ?? m.away}
              </span>
            </div>
            <p className="mt-1 text-xs text-white/50">
              {m.dateLabel}
              {m.venue !== NA ? ` · ${m.venue}` : ""}
            </p>
          </div>

          <div className="flex items-center gap-3 sm:justify-end">
            {m.played ? (
              <>
                <span className="font-display text-2xl text-white">
                  {m.goalsHome} - {m.goalsAway}
                </span>
                <span className={`rounded-full px-2.5 py-1 text-xs font-extrabold ${badge}`}>
                  {res}
                </span>
              </>
            ) : (
              <span className="rounded-full border border-white/20 px-4 py-2 font-display text-base text-white">
                {m.time === NA ? "Por confirmar" : m.time}
              </span>
            )}
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

export default function Matches() {
  const cat = useCategory();
  const MATCHES = cat.matches;
  const [tab, setTab] = useState<"próximos" | "resultados">("próximos");
  const played = MATCHES.filter((m) => m.played);
  const list = tab === "próximos" ? MATCHES.filter((m) => !m.played) : [...played].reverse();

  return (
    <>
      <PageHead
        kicker={`Calendario ${CLUB.season}`}
        title="Partidos"
        text="Calendario oficial y resultados publicados por la RFAF para el Grupo I de División de Honor Andaluza."
        image={IMG.action3}
      />

      <section className="relative overflow-hidden bg-navy-950 py-16 sm:py-20">
        <div className="diag-navy absolute inset-0" />
        <div className="relative mx-auto max-w-[88rem] px-4 sm:px-6">
          <div className="mb-8">
            <CategoryPicker light />
            <p className="mt-4 font-display text-2xl uppercase text-white">
              {cat.icon} {cat.name}
              <span className="ml-3 font-sans text-sm font-semibold normal-case text-gold-400">
                {cat.competition}
              </span>
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <UpdatedAt light />
              <SourceTag source={SRC.RFAF} />
            </div>
          </div>

          {MATCHES.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-white/20 p-8 text-center text-white/50">
              Calendario {NA.toLowerCase()} en fuentes públicas para esta categoría.
            </p>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="inline-flex rounded-full border border-white/15 bg-white/5 p-1">
                  {(["próximos", "resultados"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTab(t)}
                      className={`rounded-full px-6 py-2.5 text-xs font-extrabold uppercase tracking-wide transition ${
                        tab === t ? "bg-gold-500 text-navy-950" : "text-white/70 hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-white/45">
                  {played.length} disputados · {MATCHES.length - played.length} por disputar ·{" "}
                  {MATCHES.length} encuentros
                </p>
              </div>

              <div className="mt-8 space-y-4">
                {list.map((m, i) => (
                  <MatchRow key={m.id} m={m} i={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-[88rem] px-4 sm:px-6">
          <SourceNote />
        </div>
      </section>
    </>
  );
}

/* ------------------------------ Ficha del partido ------------------------ */

export function MatchCenter({ id }: { id: string }) {
  const { categories } = useSite();
  const all = categories.flatMap((c) => c.matches);
  const m = all.find((x) => x.id === id);

  if (!m) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-40 text-center">
        <h1 className="font-display text-4xl uppercase text-navy-900">Partido no encontrado</h1>
        <Link
          to="/partidos"
          className="mt-6 inline-flex rounded-full bg-navy-900 px-6 py-3 text-xs font-extrabold uppercase tracking-wide text-white"
        >
          Volver al calendario
        </Link>
      </section>
    );
  }

  const detalle = [
    { k: "Competición", v: m.comp },
    { k: "Fecha", v: m.dateLabel },
    { k: "Hora", v: m.time === NA ? NA : `${m.time} h` },
    { k: "Campo", v: m.venue },
    { k: "Condición", v: m.home === "coria" ? "Local" : "Visitante" },
    { k: "Estado", v: m.played ? "Finalizado" : "Por disputar" },
  ];

  const sinDatos = ["Goleadores", "Tarjetas", "Sustituciones", "Posesión", "Tiros", "Córners"];

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy-950 pb-14 pt-28 sm:pt-36">
        <img src={IMG.stadiumNight} alt="" className="absolute inset-0 h-full w-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/95 via-navy-950/90 to-navy-900/80" />
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
          <Link
            to="/partidos"
            className="text-xs font-extrabold uppercase tracking-wide text-gold-400 hover:text-gold-300"
          >
            ← Partidos
          </Link>
          <p className="mt-4 text-[11px] font-extrabold uppercase tracking-[0.24em] text-gold-400">
            {m.comp}
          </p>
          <p className="mt-1 text-sm text-white/60">{m.dateLabel}</p>

          <div className="mt-8 grid items-center gap-6 sm:grid-cols-[1fr_auto_1fr]">
            <div className="flex flex-col items-center gap-3">
              {m.home === "coria" ? (
                <Crest className="h-24 w-auto sm:h-28" />
              ) : (
                <TeamBadge teamKey={m.home} className="h-24 w-24 sm:h-28 sm:w-28" />
              )}
              <span className="font-display text-lg uppercase text-white">
                {TEAMS[m.home]?.name ?? m.home}
              </span>
            </div>

            <div>
              {m.played ? (
                <div className="font-display text-6xl text-gold-400 sm:text-7xl">
                  <Counter to={m.goalsHome ?? 0} duration={900} />
                  <span className="mx-3 text-white/35">—</span>
                  <Counter to={m.goalsAway ?? 0} duration={900} />
                </div>
              ) : (
                <div className="font-display text-4xl text-white sm:text-5xl">
                  {m.time === NA ? "—" : m.time}
                </div>
              )}
              <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-white/50">
                {m.played ? "Finalizado" : "Por disputar"}
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              {m.away === "coria" ? (
                <Crest className="h-24 w-auto sm:h-28" />
              ) : (
                <TeamBadge teamKey={m.away} className="h-24 w-24 sm:h-28 sm:w-28" />
              )}
              <span className="font-display text-lg uppercase text-white">
                {TEAMS[m.away]?.name ?? m.away}
              </span>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-2 stripes-bg" />
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-[88rem] px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <SectionTitle kicker="Datos del encuentro" title="Ficha" />
              <dl className="mt-8 grid gap-3 sm:grid-cols-2">
                {detalle.map((d) => (
                  <Reveal key={d.k}>
                    <div className="rounded-2xl border border-navy-900/10 bg-slate-50 p-4">
                      <dt className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-navy-700">
                        {d.k}
                      </dt>
                      <dd
                        className={`mt-1 font-bold ${d.v === NA ? "text-navy-900/40" : "text-navy-950"}`}
                      >
                        {d.v}
                      </dd>
                    </div>
                  </Reveal>
                ))}
              </dl>
            </div>

            <div>
              <SectionTitle
                kicker="Estadísticas"
                title="Detalle del partido"
                description="La RFAF publica el resultado oficial de los encuentros de División de Honor Andaluza, pero no el desglose estadístico ni las actas con goleadores."
              />
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {sinDatos.map((s, i) => (
                  <Reveal key={s} delay={i * 50}>
                    <div className="flex items-center justify-between rounded-2xl border border-dashed border-navy-900/20 bg-slate-50 px-4 py-3">
                      <span className="text-sm font-semibold text-navy-900/70">{s}</span>
                      <span className="text-sm font-bold text-navy-900/35">{NA}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          <SourceNote className="mt-10" />
        </div>
      </section>
    </>
  );
}
