import Crest from "../components/Crest";
import {
  Counter,
  FormPill,
  Reveal,
  SourceNote,
  SourceTag,
  TeamBadge,
  UpdatedAt,
} from "../components/ui";
import { SRC } from "../data/club";
import { PageHead } from "./Squad";
import { CLUB, IMG, NA, PROMO_DIRECT, PROMO_PLAYOFF, RELEGATION_FROM, TEAMS } from "../data/club";
import { CategoryPicker, useCategory } from "../store/category";

export default function Standings() {
  const cat = useCategory();
  const rows = cat.standings;
  const FORM = cat.form;
  const coria = rows.find((r) => r.key === "coria");
  const coriaPts = coria ? coria.pg * 3 + coria.pe : 0;

  return (
    <>
      <PageHead
        kicker={`Competición ${CLUB.season}`}
        title="Clasificación"
        text="Clasificación oficial publicada por la Real Federación Andaluza de Fútbol para el Grupo I de División de Honor Andaluza."
        image={IMG.action5}
      />

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-[88rem] px-4 sm:px-6">
          <div className="mb-8">
            <CategoryPicker />
            <p className="mt-4 font-display text-2xl uppercase text-navy-900">
              {cat.icon} {cat.name}
              <span className="ml-3 font-sans text-sm font-semibold normal-case text-navy-700">
                {cat.competition}
              </span>
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <UpdatedAt />
              <SourceTag source={SRC.RFAF} />
            </div>
          </div>

          {/* Resumen del Coria */}
          {coria && (
          <Reveal className="mb-8 grid gap-4 rounded-3xl bg-navy-900 p-6 text-white sm:grid-cols-[auto_1fr_auto] sm:items-center">
            <Crest className="h-16 w-auto" />
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold-400">
                Posición actual
              </p>
              <p className="font-display text-3xl uppercase">
                {coria.pos}º · {cat.short} · <Counter to={coriaPts} /> puntos
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/55">
                  Racha
                </span>
                {FORM.map((f, i) => (
                  <FormPill key={i} r={f} />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { l: "PJ", v: coria.pj },
                { l: "GF", v: coria.gf },
                { l: "GC", v: coria.gc },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl bg-navy-950/60 px-5 py-3">
                  <div className="font-display text-2xl text-gold-400">
                    <Counter to={s.v} />
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-white/55">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          )}

          {rows.length === 0 && (
            <p className="rounded-2xl border border-dashed border-navy-900/20 bg-white p-8 text-center text-navy-900/50">
              Clasificación {NA.toLowerCase()} en fuentes públicas para esta categoría.
            </p>
          )}

          <Reveal
            className={`overflow-hidden rounded-3xl border border-navy-900/10 bg-white shadow-xl shadow-navy-900/5 ${rows.length === 0 ? "hidden" : ""}`}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] text-left text-sm">
                <thead>
                  <tr className="bg-navy-900 text-[11px] uppercase tracking-wider text-white/80">
                    {["POS", "Equipo", "PJ", "PG", "PE", "PP", "GF", "GC", "DG", "PTS"].map((h) => (
                      <th
                        key={h}
                        className={`px-3 py-3.5 font-bold ${h === "Equipo" ? "text-left" : "text-center"}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const isCoria = r.key === "coria";
                    const pos = r.pos;
                    const pts = r.pg * 3 + r.pe;
                    const dg = r.gf - r.gc;
                    return (
                      <tr
                        key={r.key}
                        className={`border-b border-navy-900/5 transition last:border-0 ${
                          isCoria ? "bg-gold-500/25" : "hover:bg-slate-50"
                        }`}
                      >
                        <td className="px-3 py-3">
                          <span
                            className={`inline-grid h-7 w-7 place-items-center rounded-lg text-xs font-extrabold ${
                              pos <= PROMO_DIRECT
                                ? "bg-emerald-600 text-white"
                                : pos <= PROMO_PLAYOFF
                                  ? "bg-navy-800 text-white"
                                  : pos >= RELEGATION_FROM
                                    ? "bg-rose-100 text-rose-700"
                                    : "bg-slate-100 text-navy-900"
                            }`}
                          >
                            {pos}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-3">
                            {isCoria ? (
                              <Crest className="h-9 w-auto" />
                            ) : (
                              <TeamBadge teamKey={r.key} className="h-8 w-8" />
                            )}
                            <span
                              className={`font-semibold ${isCoria ? "font-extrabold text-navy-950" : "text-navy-900/85"}`}
                            >
                              {TEAMS[r.key].name}
                            </span>
                          </div>
                        </td>
                        {[r.pj, r.pg, r.pe, r.pp, r.gf, r.gc].map((v, i) => (
                          <td key={i} className="px-3 py-3 text-center text-navy-900/70">
                            {v}
                          </td>
                        ))}
                        <td
                          className={`px-3 py-3 text-center font-semibold ${
                            dg > 0 ? "text-emerald-600" : dg < 0 ? "text-rose-600" : "text-navy-900/70"
                          }`}
                        >
                          {dg > 0 ? `+${dg}` : dg}
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
            <div className="flex flex-wrap items-center gap-5 border-t border-navy-900/10 bg-slate-50 px-4 py-3 text-xs text-navy-900/60">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-emerald-600" /> Ascenso directo a Tercera
                Federación
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-navy-800" /> Promoción de ascenso
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-rose-200" /> Descenso a Primera Andaluza
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-gold-500" /> Coria C.F.
              </span>
            </div>
          </Reveal>

          <SourceNote className="mt-8" />
        </div>
      </section>
    </>
  );
}
