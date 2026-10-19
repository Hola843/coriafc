import { useEffect, useState } from "react";
import { Reveal, SourceNote } from "../components/ui";
import { PageHead } from "./Squad";
import { GALLERY_CATS, IMG, type GalleryItem } from "../data/club";
import { useSite } from "../store/content";

export default function Gallery() {
  const { gallery } = useSite();
  const [cat, setCat] = useState<string>("Todas");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const items = cat === "Todas" ? gallery : gallery.filter((g) => g.cat === cat);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <PageHead
        kicker="Multimedia"
        title="Galería"
        text="Esta sección está preparada para alojar las fotografías oficiales del club. Las imágenes mostradas son genéricas de recurso."
        image={IMG.fans1}
      />

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-[88rem] px-4 sm:px-6">
          <p className="mb-8 rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
            <strong className="font-bold">Aviso:</strong> el Coria C.F. no publica un archivo
            fotográfico abierto. Las imágenes de esta galería son fotografías genéricas de banco de
            imágenes y <strong>no corresponden al club, a su estadio ni a sus jugadores</strong>.
          </p>

          <div className="flex flex-wrap gap-2">
            {GALLERY_CATS.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setCat(c.key)}
                className={`rounded-full border px-4 py-2.5 text-xs font-extrabold uppercase tracking-wide transition ${
                  cat === c.key
                    ? "border-navy-900 bg-navy-900 text-white"
                    : "border-navy-900/15 text-navy-900/70 hover:border-navy-900/40 hover:bg-slate-50"
                }`}
              >
                <span className="mr-1.5">{c.icon}</span>
                {c.key}
              </button>
            ))}
          </div>

          <div className="mt-8 grid auto-rows-[180px] grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((g, i) => (
              <Reveal
                key={g.id}
                delay={(i % 8) * 60}
                className={g.tall ? "row-span-2" : "row-span-1"}
              >
                <button
                  type="button"
                  onClick={() => setLightbox(g)}
                  className="group relative h-full w-full overflow-hidden rounded-2xl text-left"
                >
                  <img
                    src={g.src}
                    alt={g.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent opacity-70 transition group-hover:opacity-95" />
                  <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-gold-400">
                      {g.cat}
                    </span>
                    <p className="text-sm font-bold leading-tight text-white">{g.title}</p>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>

          <SourceNote className="mt-10" />
        </div>
      </section>

      {lightbox && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-950/92 p-4 backdrop-blur"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="animate-fade-up max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightbox.src}
              alt={lightbox.title}
              className="max-h-[75vh] w-full rounded-2xl object-contain"
            />
            <div className="mt-4 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gold-400">
                  {lightbox.cat}
                </span>
                <p className="font-display text-xl uppercase text-white">{lightbox.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="rounded-full bg-white/10 px-5 py-2.5 text-xs font-extrabold uppercase tracking-wide text-white transition hover:bg-white/20"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
