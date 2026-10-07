import Crest from "./Crest";
import { Link } from "../routeContext";
import { useSite } from "../store/content";

const COLUMNS = [
  {
    title: "Fútbol",
    links: [
      { l: "Plantilla", to: "/plantilla" },
      { l: "Partidos", to: "/partidos" },
      { l: "Clasificación", to: "/clasificacion" },
      { l: "Coria Stats", to: "/stats" },
    ],
  },
  {
    title: "Club",
    links: [
      { l: "Estadio", to: "/estadio" },
      { l: "Historia", to: "/estadio" },
      { l: "Galería", to: "/galeria" },
      { l: "Afición", to: "/aficion" },
    ],
  },
];

function Social({ label, d }: { label: string; d: string }) {
  return (
    <a
      href="#/"
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/70 transition hover:-translate-y-0.5 hover:border-gold-500 hover:bg-gold-500 hover:text-navy-950"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d={d} />
      </svg>
    </a>
  );
}

export default function Footer() {
  const { club: CLUB } = useSite();
  return (
    <footer className="bg-navy-950 text-white">
      <div className="h-2 stripes-bg" />
      <div className="mx-auto max-w-[88rem] px-4 py-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1.8fr]">
          <div>
            <Link to="/" className="flex items-center gap-4">
              <Crest className="h-20 w-auto" />
              <div>
                <p className="font-display text-2xl uppercase leading-none">{CLUB.short}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
                  {CLUB.nickname}
                </p>
              </div>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
              {CLUB.name}. Fundado el {CLUB.founded} en {CLUB.city}. {CLUB.stadium}, aforo para{" "}
              {CLUB.capacity.toLocaleString("es-ES")} espectadores. Temporada {CLUB.season} en{" "}
              {CLUB.league}.
            </p>
            <div className="mt-6 flex gap-3">
              <Social
                label="X"
                d="M18.9 2H22l-7.3 8.3L23.3 22h-6.6l-5.2-6.8L5.6 22H2.4l7.8-8.9L1.3 2h6.8l4.7 6.2L18.9 2Zm-1.2 18h1.8L7.4 3.9H5.5L17.7 20Z"
              />
              <Social
                label="Instagram"
                d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.3-.1 1.7-.1 4.8-.1Zm0 5.3a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm0 7.4a2.9 2.9 0 1 1 0-5.8 2.9 2.9 0 0 1 0 5.8Zm5.7-7.6a1.1 1.1 0 1 1-2.1 0 1.1 1.1 0 0 1 2.1 0Z"
              />
              <Social
                label="Facebook"
                d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.7c0-.9.3-1.6 1.6-1.6h1.7V4.2c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3V14h2.8v8h3.4Z"
              />
              <Social
                label="YouTube"
                d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12c0 1.6.1 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.3-1.6.4-3.2.4-4.8s-.1-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z"
              />
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {COLUMNS.map((c) => (
              <div key={c.title}>
                <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold-400">
                  {c.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l.l}>
                      <Link
                        to={l.to}
                        className="text-sm text-white/60 transition hover:text-white"
                      >
                        {l.l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold-400">
                Oficinas
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-white/60">
                <li>
                  <span className="block font-semibold text-white">{CLUB.stadium}</span>
                  {CLUB.address}
                </li>
                <li>
                  <span className="block font-semibold text-white">Horario</span>
                  Lunes a viernes, 18:00 – 21:00 h
                </li>
                <li>
                  <span className="block font-semibold text-white">Teléfono</span>
                  {CLUB.phone}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {CLUB.name}. Todos los derechos reservados.
          </p>
          <p className="max-w-2xl sm:text-right">
            Sitio no oficial. Datos deportivos procedentes de la RFAF, Futbolium/Futbolme, Wikipedia
            y los canales oficiales del club. Los datos no verificables figuran como «No
            disponible». Las fotografías son imágenes de recurso.
          </p>
        </div>

        {/* Acceso discreto al panel de administración */}
        <div className="mt-6 flex justify-center">
          <Link
            to="/admin"
            ariaLabel="Acceso privado"
            className="group select-none rounded-full px-3 py-1 text-[10px] text-white/15 transition hover:bg-white/5 hover:text-white/60"
          >
            <span className="transition group-hover:hidden">·</span>
            <span className="hidden uppercase tracking-[0.2em] group-hover:inline">
              Acceso privado
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
