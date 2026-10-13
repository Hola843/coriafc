import { useMemo, useState } from "react";
import Crest from "../components/Crest";
import { Link } from "../routeContext";
import { Reveal, SectionTitle, SourceNote, TeamBadge } from "../components/ui";
import { PageHead } from "./Squad";
import { IMG, NA, TEAMS } from "../data/club";
import { nextMatchOf, useSite } from "../store/content";

/* ------------------------------------------------------------------
   Venta de entradas del primer equipo.

   Precios, tipos, disponibilidad y enlace de venta se gestionan desde
   el panel de administración: aquí no se inventa ningún importe.
   La página queda preparada para integrar una pasarela de pago segura;
   no simula pagos ni confirmaciones de compra.
------------------------------------------------------------------- */

export default function Tickets() {
  const { categories, ticketing, club } = useSite();
  const match = nextMatchOf(categories[0].matches);

  const available = ticketing.types.filter((t) => t.available && t.price !== null);
  const [qty, setQty] = useState<Record<string, number>>({});

  const total = useMemo(
    () =>
      available.reduce((sum, t) => sum + (t.price ?? 0) * (qty[t.id] ?? 0), 0),
    [available, qty],
  );
  const count = useMemo(
    () => available.reduce((sum, t) => sum + (qty[t.id] ?? 0), 0),
    [available, qty],
  );

  const set = (id: string, delta: number) =>
    setQty((q) => ({ ...q, [id]: Math.max(0, Math.min(10, (q[id] ?? 0) + delta)) }));

  const euro = (n: number) =>
    n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });

  return (
    <>
      <PageHead
        kicker={`${club.short} · ${club.season}`}
        title="Entradas"
        text={`Entradas para los encuentros del primer equipo en el ${club.stadium}.`}
        image={IMG.fans1}
      />

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-[88rem] px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            {/* Partido */}
            <div className="space-y-6">
              <SectionTitle kicker="Encuentro" title="Partido seleccionado" />

              {match ? (
                <Reveal>
                  <div className="overflow-hidden rounded-3xl border border-navy-900/10">
                    <div className="bg-navy-900 px-6 py-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold-400">
                      {match.comp}
                    </div>
                    <div className="grid items-center gap-6 p-6 sm:grid-cols-[1fr_auto_1fr]">
                      <div className="flex flex-col items-center gap-3">
                        {match.home === "coria" ? (
                          <Crest className="h-20 w-auto" />
                        ) : (
                          <TeamBadge teamKey={match.home} className="h-20 w-20" />
                        )}
                        <span className="text-center font-display text-lg uppercase text-navy-950">
                          {TEAMS[match.home]?.name ?? match.home}
                        </span>
                      </div>
                      <span className="text-center font-display text-2xl text-navy-900/40">VS</span>
                      <div className="flex flex-col items-center gap-3">
                        {match.away === "coria" ? (
                          <Crest className="h-20 w-auto" />
                        ) : (
                          <TeamBadge teamKey={match.away} className="h-20 w-20" />
                        )}
                        <span className="text-center font-display text-lg uppercase text-navy-950">
                          {TEAMS[match.away]?.name ?? match.away}
                        </span>
                      </div>
                    </div>
                    <dl className="grid gap-3 border-t border-navy-900/10 bg-slate-50 p-6 sm:grid-cols-3">
                      {[
                        { k: "Fecha", v: match.dateLabel },
                        { k: "Hora", v: match.time === NA ? NA : `${match.time} h` },
                        { k: "Estadio", v: match.venue },
                      ].map((d) => (
                        <div key={d.k} className="min-w-0">
                          <dt className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-navy-700">
                            {d.k}
                          </dt>
                          <dd
                            className={`mt-1 font-bold ${d.v === NA ? "text-navy-900/40" : "text-navy-950"}`}
                          >
                            {d.v}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </Reveal>
              ) : (
                <p className="rounded-2xl border border-dashed border-navy-900/20 bg-slate-50 p-6 text-center text-sm text-navy-900/50">
                  No hay ningún partido programado.
                </p>
              )}

              {/* Tipos de entrada */}
              <SectionTitle kicker="Selección" title="Tipos de entrada" />

              {!ticketing.enabled || available.length === 0 ? (
                <Reveal>
                  <div className="rounded-3xl border border-amber-300/60 bg-amber-50 p-6">
                    <p className="font-display text-xl uppercase text-amber-900">
                      Venta online no disponible
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-amber-900/80">
                      {ticketing.notice}
                    </p>
                    {ticketing.externalUrl && (
                      <a
                        href={ticketing.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex rounded-full bg-navy-900 px-6 py-3 text-[11px] font-extrabold uppercase tracking-wide text-white transition hover:bg-navy-800"
                      >
                        Ir a la plataforma de venta
                      </a>
                    )}
                    <div className="mt-5 border-t border-amber-300/60 pt-4 text-sm text-amber-900/80">
                      <p className="font-bold">Oficinas del club</p>
                      <p>{club.address}</p>
                      <p>Teléfono {club.phone}</p>
                    </div>
                  </div>
                </Reveal>
              ) : (
                <div className="space-y-3">
                  {available.map((t, i) => (
                    <Reveal key={t.id} delay={i * 60}>
                      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-navy-900/10 bg-slate-50 p-5">
                        <div className="min-w-0">
                          <p className="font-display text-lg uppercase text-navy-950">{t.name}</p>
                          <p className="text-sm text-navy-900/60">{t.description}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-display text-2xl text-navy-800">
                            {euro(t.price ?? 0)}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => set(t.id, -1)}
                              aria-label={`Quitar ${t.name}`}
                              className="grid h-9 w-9 place-items-center rounded-full border border-navy-900/20 bg-white font-bold text-navy-900 transition hover:border-gold-500"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-display text-xl text-navy-950">
                              {qty[t.id] ?? 0}
                            </span>
                            <button
                              type="button"
                              onClick={() => set(t.id, 1)}
                              aria-label={`Añadir ${t.name}`}
                              className="grid h-9 w-9 place-items-center rounded-full border border-navy-900/20 bg-white font-bold text-navy-900 transition hover:border-gold-500"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              )}
            </div>

            {/* Resumen */}
            <div>
              <Reveal delay={120}>
                <div className="sticky top-24 overflow-hidden rounded-3xl border border-navy-900/10">
                  <div className="bg-gold-500 px-6 py-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-navy-950">
                    Resumen de la compra
                  </div>
                  <div className="space-y-4 p-6">
                    {count === 0 ? (
                      <p className="text-sm text-navy-900/55">
                        No has seleccionado ninguna entrada.
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {available
                          .filter((t) => (qty[t.id] ?? 0) > 0)
                          .map((t) => (
                            <li
                              key={t.id}
                              className="flex items-center justify-between text-sm text-navy-900/75"
                            >
                              <span>
                                {qty[t.id]} × {t.name}
                              </span>
                              <span className="font-semibold text-navy-950">
                                {euro((t.price ?? 0) * (qty[t.id] ?? 0))}
                              </span>
                            </li>
                          ))}
                      </ul>
                    )}

                    <div className="flex items-end justify-between border-t border-navy-900/10 pt-4">
                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-navy-700">
                          Número de entradas
                        </p>
                        <p className="font-display text-2xl text-navy-950">{count}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-navy-700">
                          Precio total
                        </p>
                        <p className="font-display text-4xl text-navy-800">{euro(total)}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={count === 0 || !ticketing.enabled}
                      className="w-full rounded-full bg-navy-900 px-6 py-4 text-sm font-extrabold uppercase tracking-wide text-white transition hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Continuar con la compra
                    </button>

                    <p className="text-[11px] leading-relaxed text-navy-900/50">
                      El pago se realizará mediante una pasarela segura. Esta web no almacena datos
                      bancarios. La integración de pago todavía no está activada.
                    </p>

                    <Link
                      to="/partidos"
                      className="block text-center text-xs font-extrabold uppercase tracking-wide text-navy-800 underline decoration-gold-500 decoration-2 underline-offset-4"
                    >
                      Ver todos los partidos
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          <SourceNote className="mt-10">
            Precios, tipos de entrada, disponibilidad y enlaces de venta se gestionan desde el
            panel de administración del club. Los datos del partido proceden de la RFEF.
          </SourceNote>
        </div>
      </section>
    </>
  );
}
