import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { useContent } from "./content";
import type { Category } from "../data/club";

const Ctx = createContext<{ id: string; setId: (v: string) => void }>({
  id: "primer-equipo",
  setId: () => {},
});

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState("primer-equipo");
  const value = useMemo(() => ({ id, setId }), [id]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** Categoría seleccionada actualmente (primer equipo por defecto) */
export function useCategory(): Category {
  const { id } = useContext(Ctx);
  const { content } = useContent();
  return content.categories.find((c) => c.id === id) ?? content.categories[0];
}

export function useCategorySelect() {
  const { id, setId } = useContext(Ctx);
  const { content } = useContent();
  return { id, setId, categories: content.categories };
}

/** Selector de categoría en pastillas */
export function CategoryPicker({ light = false }: { light?: boolean }) {
  const { id, setId, categories } = useCategorySelect();

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((c) => {
        const active = c.id === id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => setId(c.id)}
            className={`rounded-full border px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-wide transition ${
              active
                ? "border-gold-500 bg-gold-500 text-navy-950"
                : light
                  ? "border-white/20 text-white/70 hover:border-white/50 hover:text-white"
                  : "border-navy-900/15 text-navy-900/65 hover:border-navy-900/40 hover:bg-slate-50"
            }`}
          >
            <span className="mr-1.5">{c.icon}</span>
            {c.short}
          </button>
        );
      })}
    </div>
  );
}
