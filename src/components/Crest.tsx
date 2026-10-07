import { useState } from "react";
import { CREST_ALT, CREST_SRC } from "../crestSource";
import { useContent } from "../store/content";

/**
 * Escudo oficial del Coria C.F.
 *
 * Muestra EXACTAMENTE el archivo original del escudo, sin recrearlo,
 * vectorizarlo ni alterarlo. El componente solo lo escala conservando
 * sus proporciones (object-contain): no aplica filtros, recortes,
 * máscaras, bordes, fondos ni cambios de color.
 *
 * Origen de la imagen, por orden:
 *   1. Archivo subido desde el panel de administración (bytes originales).
 *   2. public/escudo-coria-cf.png
 */

type CrestProps = {
  className?: string;
  title?: string;
};

export default function Crest({ className = "", title = CREST_ALT }: CrestProps) {
  const { content } = useContent();
  const src = content.crest || CREST_SRC;
  const [missing, setMissing] = useState(false);

  // Si no hay escudo disponible se deja un hueco neutro del mismo tamaño.
  // Nunca se dibuja una recreación del escudo.
  if (missing && !content.crest) {
    return (
      <span
        role="img"
        aria-label={title}
        title={`${title} — súbelo desde el panel o colócalo en public/escudo-coria-cf.png`}
        className={`inline-block aspect-[3/4] rounded border border-dashed border-current/30 opacity-40 ${className}`}
      />
    );
  }

  return (
    <img
      key={src.slice(0, 48)}
      src={src}
      alt={title}
      title={title}
      draggable={false}
      onError={() => setMissing(true)}
      className={`select-none object-contain ${className}`}
    />
  );
}
