import { useEffect, useState } from "react";
import Crest from "./Crest";
import { Link, useRouteContext } from "../routeContext";

export const NAV_LINKS = [
  { to: "/", label: "Inicio" },
  { to: "/plantilla", label: "Plantilla" },
  { to: "/partidos", label: "Partidos" },
  { to: "/clasificacion", label: "Clasificación" },
  { to: "/stats", label: "Coria Stats" },
  { to: "/aficion", label: "Afición" },
  { to: "/galeria", label: "Galería" },
  { to: "/estadio", label: "Estadio" },
];

export default function Nav() {
  const { path } = useRouteContext();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  const isActive = (to: string) => (to === "/" ? path === "/" : path.startsWith(to));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-navy-950/95 shadow-lg shadow-navy-950/25 backdrop-blur-md"
          : "bg-gradient-to-b from-navy-950/90 via-navy-950/50 to-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[88rem] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <Crest
            className={`w-auto transition-all duration-300 ${scrolled ? "h-10" : "h-14"} drop-shadow`}
          />
          <span className="leading-none">
            <span className="block font-display text-lg text-white sm:text-2xl">CORIA C.F.</span>
            <span className="block text-[9px] font-semibold uppercase tracking-[0.25em] text-gold-400 sm:text-[10px]">
              Desde 1923
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`relative rounded-full px-3 py-2 text-[13px] font-bold uppercase tracking-wide transition ${
                isActive(l.to) ? "text-gold-400" : "text-white/75 hover:text-white"
              }`}
            >
              {l.label}
              <span
                className={`absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gold-500 transition-transform duration-300 ${
                  isActive(l.to) ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid h-11 w-11 place-items-center rounded-xl border border-white/20 text-white transition hover:bg-white/10 xl:hidden"
        >
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-5 bg-white transition ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-white transition ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-white transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </div>

      <div
        className={`overflow-hidden bg-navy-950/98 backdrop-blur xl:hidden ${
          open ? "max-h-[32rem] border-t border-white/10" : "max-h-0"
        } transition-[max-height] duration-300 ease-out`}
      >
        <nav className="mx-auto grid max-w-[88rem] grid-cols-2 gap-1 px-4 py-4 sm:px-6">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wide transition ${
                isActive(l.to) ? "bg-gold-500 text-navy-950" : "text-white/85 hover:bg-white/10"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="h-[3px] stripes-bg opacity-90" />
    </header>
  );
}
