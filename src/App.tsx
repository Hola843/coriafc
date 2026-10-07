import { useEffect, useState, type ReactNode } from "react";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Crest from "./components/Crest";
import { RouteProvider, useRouteContext } from "./routeContext";
import Home from "./pages/Home";
import Squad, { PlayerPage } from "./pages/Squad";
import Matches, { MatchCenter } from "./pages/Matches";
import Standings from "./pages/Standings";
import Stats from "./pages/Stats";
import Gallery from "./pages/Gallery";
import Fans from "./pages/Fans";
import Stadium from "./pages/Stadium";
import Admin from "./pages/Admin";
import { ContentProvider } from "./store/content";
import { CategoryProvider } from "./store/category";

function LoadingVeil({ show }: { show: boolean }) {
  return (
    <div
      aria-hidden={!show}
      className={`pointer-events-none fixed inset-0 z-[70] grid place-items-center bg-navy-950 transition-opacity duration-200 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        <Crest className="h-20 w-auto animate-pulse-soft" />
        <div className="h-1 w-32 overflow-hidden rounded-full bg-white/15">
          <div className="h-full w-1/2 animate-loading-bar rounded-full bg-gold-500" />
        </div>
      </div>
    </div>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Volver arriba"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full bg-gold-500 text-navy-950 shadow-xl shadow-navy-950/30 transition-all duration-300 hover:bg-gold-400 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-5 w-5">
        <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-44 text-center">
      <Crest className="mx-auto h-24 w-auto" />
      <h1 className="mt-6 font-display text-5xl uppercase text-navy-900">Página no encontrada</h1>
      <p className="mt-3 text-navy-900/60">
        El enlace que buscas no existe en la web del Coria C.F.
      </p>
      <a
        href="#/"
        className="mt-8 inline-flex rounded-full bg-navy-900 px-7 py-3.5 text-xs font-extrabold uppercase tracking-wide text-white transition hover:bg-navy-800"
      >
        Volver al inicio
      </a>
    </section>
  );
}

function resolve(parts: string[]): ReactNode {
  const [a, b] = parts;
  switch (a) {
    case undefined:
      return <Home />;
    case "plantilla":
      return <Squad />;
    case "jugador":
      return b ? <PlayerPage id={b} /> : <Squad />;
    case "partidos":
      return <Matches />;
    case "partido":
      return b ? <MatchCenter id={b} /> : <Matches />;
    case "clasificacion":
      return <Standings />;
    case "stats":
      return <Stats />;
    case "aficion":
      return <Fans />;
    case "galeria":
      return <Gallery />;
    case "estadio":
      return <Stadium />;
    case "admin":
      return <Admin />;
    default:
      return <NotFound />;
  }
}

function Shell() {
  const { path, parts, loading } = useRouteContext();
  const isAdmin = parts[0] === "admin";

  // Atajo de teclado para abrir el área privada: Ctrl/Cmd + Shift + A
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        window.location.hash = "/admin";
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {!isAdmin && <Nav />}
      <LoadingVeil show={loading} />
      <main
        key={path}
        className={`transition-opacity duration-300 ${loading ? "opacity-0" : "animate-page-in opacity-100"}`}
      >
        {resolve(parts)}
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <BackToTop />}
    </div>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <CategoryProvider>
        <RouteProvider>
          <Shell />
        </RouteProvider>
      </CategoryProvider>
    </ContentProvider>
  );
}
