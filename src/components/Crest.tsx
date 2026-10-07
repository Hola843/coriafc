import { CREST_ALT } from "../crestSource";
import { useCrest } from "../store/crest";

/* ------------------------------------------------------------------
   Escudo oficial del Coria C.F.

   FUENTE ÚNICA: Supabase Storage → bucket «escudo» → «escudo.png».

   La URL es fija y pública, idéntica en todos los dispositivos:
     https://<proyecto>.supabase.co/storage/v1/object/public/escudo/escudo.png

   · No usa localStorage, sessionStorage ni IndexedDB.
   · No usa credenciales para mostrarse.
   · No depende del dispositivo desde el que se subió.

   La imagen se muestra tal cual: solo se escala conservando su
   relación de aspecto (object-contain).
------------------------------------------------------------------- */

type CrestProps = {
  className?: string;
  title?: string;
};

export default function Crest({ className = "", title = CREST_ALT }: CrestProps) {
  const { url } = useCrest();

  return (
    <img
      src={url}
      alt={title}
      title={title}
      draggable={false}
      decoding="async"
      className={`select-none object-contain ${className}`}
    />
  );
}
