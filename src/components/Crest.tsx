import { useState } from "react";
import { CREST_ALT } from "../crestSource";
import { useCrest } from "../store/crest";

/**
 * Escudo oficial del Coria C.F.
 *
 * Muestra EXACTAMENTE el archivo original alojado en Supabase Storage
 * (bucket «escudo»), sin recrearlo, vectorizarlo ni alterarlo.
 * El componente solo lo escala conservando sus proporciones
 * (object-contain): no aplica filtros, recortes, máscaras, bordes,
 * fondos ni cambios de color.
 */

type CrestProps = {
  className?: string;
  title?: string;
};

export default function Crest({ className = "", title = CREST_ALT }: CrestProps) {
  const { url } = useCrest();
  const [failed, setFailed] = useState("");

  // Hueco neutro mientras no haya escudo disponible.
  // Nunca se dibuja una recreación del escudo.
  if (!url || failed === url) {
    return (
      <span
        role="img"
        aria-label={title}
        title={`${title} — súbelo desde el panel de administración`}
        className={`inline-block aspect-[3/4] rounded border border-dashed border-current/30 opacity-40 ${className}`}
      />
    );
  }

  return (
    <img
      key={url}
      src={url}
      alt={title}
      title={title}
      draggable={false}
      onError={() => setFailed(url)}
      className={`select-none object-contain ${className}`}
    />
  );
}
