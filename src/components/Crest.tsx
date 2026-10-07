import escudo from "../assets/escudo-coria-cf.png";

/**
 * Escudo oficial del Coria C.F.
 * Se muestra la imagen tal cual, sin recortes, filtros ni alteraciones
 * de color: solo se escala manteniendo su proporción original.
 */

type CrestProps = {
  className?: string;
  title?: string;
};

export default function Crest({ className = "", title = "Escudo del Coria C.F." }: CrestProps) {
  return (
    <img
      src={escudo}
      alt={title}
      title={title}
      draggable={false}
      className={`select-none rounded-[14%] bg-white object-contain ${className}`}
    />
  );
}
