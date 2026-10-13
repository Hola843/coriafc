/* ------------------------------------------------------------------
   CLUB DEPORTIVA MINERA — Cartagena (Región de Murcia)
   Datos reales y verificados. Temporada actual: 2026/27.

   NOTA SOBRE EL GRUPO:
   En la temporada 2025-26 la Deportiva Minera militó en el Grupo IV
   de Segunda Federación. En 2026-27 la RFEF reorganizó los grupos y
   el club compite en el GRUPO III (equipos de Murcia, Comunidad
   Valenciana y Baleares). El Grupo IV pasó a agrupar a los clubes de
   Andalucía, Extremadura y Canarias.

   FUENTES:
   · RFEF / AS.com — clasificación y resultados del Grupo III.
   · Wikipedia «Club Deportiva Minera» — plantilla y cuerpo técnico.
   · LaPreferente — demarcaciones y procedencia de los jugadores.
   · COPE Murcia y La Opinión de Murcia — crónicas de jornada.

   Los datos no verificables se indican como "No disponible".
------------------------------------------------------------------- */

export const NA = "No disponible";

/** Fecha de corte de los datos deportivos */
export const LAST_UPDATE = "12 de octubre de 2026, 20:00 h";

export const SRC = {
  RFAF: "RFEF",
  LAPREFERENTE: "LaPreferente",
  BESOCCER: "BeSoccer",
  CLUB: "Club oficial",
  NONE: NA,
} as const;

export type SourceId = (typeof SRC)[keyof typeof SRC];

export const SOURCE_PRIORITY: SourceId[] = [SRC.RFAF, SRC.BESOCCER];

export const SOURCE_USAGE: { area: string; source: SourceId; detail: string }[] = [
  { area: "Clasificación", source: SRC.RFAF, detail: "Grupo III de Segunda Federación" },
  { area: "Resultados", source: SRC.RFAF, detail: "Marcadores oficiales de cada jornada" },
  { area: "Calendario", source: SRC.RFAF, detail: "34 jornadas de la temporada" },
  { area: "Plantilla y cuerpo técnico", source: SRC.LAPREFERENTE, detail: "Ficha 2026/27" },
  { area: "Demarcaciones y procedencia", source: SRC.LAPREFERENTE, detail: "Datos individuales" },
  { area: "Trayectoria por temporadas", source: SRC.BESOCCER, detail: "Puntos y posición final" },
];

export const SOURCES = "RFEF (competición) · LaPreferente y BeSoccer (plantilla)";

export const CLUB = {
  name: "Club Deportiva Minera",
  short: "Dva. Minera",
  founded: "1949",
  city: "Llano del Beal, Cartagena (Región de Murcia)",
  stadium: "Estadio Ángel Celdrán",
  capacity: 2000,
  league: "Segunda Federación · Grupo III",
  season: "2026/27",
  nickname: "Los Mineros",
  colors: "Rojo y negro",
  address: "Estadio Ángel Celdrán · Llano del Beal, Cartagena (Murcia)",
  phone: NA,
  website: NA,
  twitter: "@DeportivaMinera",
  president: NA,
  coach: "Alejandro Sandroni",
  kit: NA,
};

const P = "https://images.pexels.com/photos";
const Q = "?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200";

/** Imágenes genéricas de recurso. No son fotografías del club. */
export const IMG = {
  hero: `${P}/33471345/pexels-photo-33471345.jpeg${Q}`,
  stadiumNight: `${P}/30651230/pexels-photo-30651230.jpeg${Q}`,
  stadiumAerial: `${P}/38443770/pexels-photo-38443770.jpeg${Q}`,
  fans1: `${P}/29348229/pexels-photo-29348229.jpeg${Q}`,
  fans2: `${P}/31514425/pexels-photo-31514425.jpeg${Q}`,
  fans3: `${P}/37294253/pexels-photo-37294253.jpeg${Q}`,
  fans4: `${P}/12074795/pexels-photo-12074795.jpeg${Q}`,
  action1: `${P}/9367717/pexels-photo-9367717.jpeg${Q}`,
  action2: `${P}/12917757/pexels-photo-12917757.jpeg${Q}`,
  action3: `${P}/13907448/pexels-photo-13907448.jpeg${Q}`,
  action5: `${P}/30040952/pexels-photo-30040952.jpeg${Q}`,
  action6: `${P}/39876203/pexels-photo-39876203.jpeg${Q}`,
  training1: `${P}/29783082/pexels-photo-29783082.jpeg${Q}`,
  training2: `${P}/9517922/pexels-photo-9517922.jpeg${Q}`,
  training3: `${P}/29034315/pexels-photo-29034315.jpeg${Q}`,
  training4: `${P}/34516565/pexels-photo-34516565.jpeg${Q}`,
  keeper1: `${P}/32205615/pexels-photo-32205615.jpeg${Q}`,
};

/* ------------------------------ Equipos ------------------------------ */

export type Team = { name: string; abbr: string; c1: string; c2: string };

const N1 = "#334155";
const N2 = "#ffffff";

/** Equipos del Grupo III de Segunda Federación 2026/27 */
export const TEAMS: Record<string, Team> = {
  coria: { name: "Deportiva Minera", abbr: "DMI", c1: "#C8102E", c2: "#111827" },
  castellonense: { name: "U.D. Castellonense", abbr: "CTS", c1: N1, c2: N2 },
  alcoyano: { name: "C.D. Alcoyano", abbr: "ALC", c1: N1, c2: N2 },
  ucam: { name: "UCAM Murcia C.F.", abbr: "UCM", c1: N1, c2: N2 },
  intercity: { name: "C.F. Intercity", abbr: "ISJ", c1: N1, c2: N2 },
  yeclano: { name: "Yeclano Deportivo", abbr: "YCL", c1: N1, c2: N2 },
  cieza: { name: "C.D. Cieza", abbr: "CIE", c1: N1, c2: N2 },
  orihuela: { name: "Orihuela C.F.", abbr: "ORI", c1: N1, c2: N2 },
  mallorcab: { name: "R.C.D. Mallorca Atlético", abbr: "MLA", c1: N1, c2: N2 },
  penadeportiva: { name: "Peña Deportiva", abbr: "PÑD", c1: N1, c2: N2 },
  lanucia: { name: "C.F. La Nucía", abbr: "NUC", c1: N1, c2: N2 },
  castellonb: { name: "C.D. Castellón B", abbr: "CAB", c1: N1, c2: N2 },
  baleares: { name: "Atlético Baleares", abbr: "ATB", c1: N1, c2: N2 },
  valenciab: { name: "Valencia Mestalla", abbr: "VAM", c1: N1, c2: N2 },
  lorca: { name: "C.F. Lorca Deportiva", abbr: "LOR", c1: N1, c2: N2 },
  elcheb: { name: "Elche Ilicitano", abbr: "ELI", c1: N1, c2: N2 },
  imperial: { name: "Real Murcia Imperial", abbr: "RMI", c1: N1, c2: N2 },
  poblense: { name: "U.D. Poblense", abbr: "POB", c1: N1, c2: N2 },
};

/* ----------------------------- Plantilla -----------------------------
   Plantilla 2026/27 publicada por el club y recogida en LaPreferente.
   Los dorsales no están publicados en su mayoría: figuran como null.
   Las estadísticas individuales de la temporada en curso no están
   desglosadas públicamente y se muestran como "No disponible".
---------------------------------------------------------------------- */

export type Position = "Portero" | "Defensa" | "Centrocampista" | "Delantero" | "Sin determinar";

export type Player = {
  id: string;
  num: number | null;
  first: string;
  last: string;
  pos: Position;
  role?: string;
  fullName?: string;
  nationality: string;
  age: number | null;
  height: number | null;
  note?: string;
  pc: number | null;
  pj: number | null;
  pt: number | null;
  min: number | null;
  goals: number | null;
  conceded?: number | null;
  yellow: number | null;
  red: number | null;
  source?: SourceId;
};

const mk = (
  id: string,
  first: string,
  last: string,
  pos: Position,
  age: number | null,
  extra: Partial<Player> = {},
): Player => ({
  id,
  num: null,
  first,
  last,
  pos,
  nationality: "España",
  age,
  height: null,
  pc: null,
  pj: null,
  pt: null,
  min: null,
  goals: null,
  yellow: null,
  red: null,
  source: SRC.LAPREFERENTE,
  ...extra,
});

export const PLAYERS: Player[] = [
  /* ------------------------------ Porteros ------------------------------ */
  mk("samu-casado", "Samu", "Casado", "Portero", 29, {
    fullName: "Samuel Casado Conde",
    role: "Portero",
    note: "Procede del Algeciras C.F.",
  }),
  mk("oliynyk", "Oleg", "Oliynyk", "Portero", 22, {
    fullName: "Oleg Oliynyk Nykonenko",
    role: "Portero",
    nationality: "Ucrania",
    note: "Procede del C.D. Numancia B",
  }),

  /* ------------------------------ Defensas ------------------------------ */
  mk("adri-crespo", "Adri", "Crespo", "Defensa", 33, {
    fullName: "Adrián Crespo Sánchez",
    role: "Central",
    note: "Procede del C.P. Cacereño",
  }),
  mk("angel-cano", "Ángel", "Cano", "Defensa", 31, {
    fullName: "Ángel Cano Moro",
    role: "Central",
    note: "Procede del C.D. Extremadura",
  }),
  mk("ceballos", "Diego", "Ceballos", "Defensa", 27, {
    fullName: "Diego Ceballos Galván",
    role: "Lateral derecho",
    note: "Procede de la S.D. Amorebieta",
  }),
  mk("isma-estevez", "Isma", "Estévez", "Defensa", 24, {
    fullName: "Ismael Estévez Más",
    role: "Defensa",
    note: "Procede del Terrassa F.C.",
  }),
  mk("morros", "", "Morros", "Defensa", 30, {
    fullName: "Juan Antonio Ruiz Guillén",
    role: "Lateral izquierdo",
    note: "Procede del C.F. Lorca Deportiva",
  }),
  mk("olarra", "Aimar", "Olarra", "Defensa", 21, {
    fullName: "Aimar Olarra Ayerdi",
    role: "Lateral izquierdo",
    note: "Sub-23 · Procede de la S.D. Logroñés",
  }),

  /* --------------------------- Centrocampistas -------------------------- */
  mk("alarcon", "Roberto", "Alarcón", "Centrocampista", 32, {
    fullName: "Roberto Alarcón González",
    role: "Interior izquierdo",
    note: "Procede del Real Avilés Industrial",
  }),
  mk("carlos-ramirez", "Carlos", "Ramírez", "Centrocampista", 26, {
    fullName: "Carlos Esteban Ramírez Guevara",
    role: "Medio centro",
    nationality: "Colombia",
    note: "Procede del Salerm Puente Genil",
  }),
  mk("david-ramos", "David", "Ramos", "Centrocampista", 29, {
    fullName: "David Ramos Guillén",
    role: "Medio centro",
  }),
  mk("fabian-cano", "Fabián", "Cano", "Centrocampista", null, {
    fullName: "Fabián Cano Zapata",
    role: "Centrocampista",
  }),
  mk("juan-carlos-real", "Juan Carlos", "Real", "Centrocampista", 35, {
    fullName: "Juan Carlos Real Ruiz",
    role: "Media punta",
  }),
  mk("kamal", "Mohamed", "Kamal", "Centrocampista", 34, {
    fullName: "Mohamed Kamal Abdeselam El Hamdi",
    role: "Medio centro",
    note: "Procede del Orihuela C.F.",
  }),
  mk("lazaro", "Lázaro", "Rubio", "Centrocampista", 22, {
    fullName: "Lázaro Rubio Nicolás",
    role: "Centrocampista",
    note: "Sub-23 · Procede del F.C. Cartagena B",
  }),
  mk("miguel-serrano", "Miguel", "Serrano", "Centrocampista", 24, {
    fullName: "Miguel Serrano Mateos",
    role: "Centrocampista",
  }),
  mk("vaquero", "Alberto", "Vaquero", "Centrocampista", 22, {
    fullName: "Alberto Vaquero Aguilar",
    role: "Medio centro",
    note: "Procede de la S.D. Tarazona",
  }),

  /* ------------------------------ Delanteros ---------------------------- */
  mk("aaron-pinan", "Aarón", "Piñán", "Delantero", 29, {
    fullName: "Aarón Piñán de la Fuente",
    role: "Extremo izquierdo",
    note: "Procede de Unionistas de Salamanca",
  }),
  mk("alex-martinez", "Álex", "Martínez", "Delantero", 20, {
    fullName: "Alejandro Martínez López",
    role: "Delantero centro",
    note: "Sub-23 · Procede del Recreativo Granada",
  }),
  mk("babacar", "", "Babacar", "Delantero", 23, {
    fullName: "Babacar Fedior",
    role: "Delantero",
    nationality: "Senegal",
    note: "Procede del Yeclano Deportivo",
  }),
  mk("boris", "Boris", "Kouassi", "Delantero", 27, {
    fullName: "Boris Alain Kouassi Zahui",
    role: "Delantero centro",
    nationality: "Costa de Marfil",
    note: "Procede del Águilas F.C.",
  }),
  mk("maikel", "", "Maikel", "Delantero", 27, {
    fullName: "Michael Villajos Expósito",
    role: "Delantero centro",
  }),
  mk("pipo", "", "Pipo", "Delantero", 29, {
    fullName: "Rafael Ramos Jiménez",
    role: "Extremo izquierdo",
    note: "Procede del Águilas F.C.",
  }),
  mk("simon-moreno", "Simón", "Moreno", "Delantero", 29, {
    fullName: "Simón Moreno",
    role: "Delantero",
    note: "Procede del C.D. Tudelano",
  }),
];

export const POSITION_ORDER: Position[] = [
  "Portero",
  "Defensa",
  "Centrocampista",
  "Delantero",
  "Sin determinar",
];

export const SQUAD_GOALS = PLAYERS.reduce((a, p) => a + (p.goals ?? 0), 0);
export const SQUAD_CONCEDED = PLAYERS.reduce((a, p) => a + (p.conceded ?? 0), 0);

export const STAFF: { role: string; name: string; fullName?: string; source: SourceId }[] = [
  { role: "Entrenador", name: "Alejandro Sandroni", source: SRC.LAPREFERENTE },
  { role: "Segundo entrenador", name: "Fernando Colina Cruz", source: SRC.LAPREFERENTE },
  { role: "Preparador físico", name: "Pedro Martínez García", source: SRC.LAPREFERENTE },
  {
    role: "Entrenador de porteros",
    name: "Alejandro Menchón",
    fullName: "Alejandro Menchón Albaladejo",
    source: SRC.LAPREFERENTE,
  },
  {
    role: "Fisioterapeuta",
    name: "David Bazán",
    fullName: "David Bazán Pacheco",
    source: SRC.LAPREFERENTE,
  },
  { role: "Médico", name: "José Jumilla Roca", source: SRC.LAPREFERENTE },
  { role: "Presidente", name: NA, source: SRC.NONE },
];

export const TRANSFERS_IN: { name: string; pos: string; from: string; source: SourceId }[] = [
  { name: "Samuel Casado", pos: "Portero", from: "Algeciras C.F.", source: SRC.LAPREFERENTE },
  { name: "Oleg Oliynyk", pos: "Portero", from: "C.D. Numancia B", source: SRC.LAPREFERENTE },
  { name: "Aimar Olarra", pos: "Defensa", from: "S.D. Logroñés", source: SRC.LAPREFERENTE },
  { name: "Diego Ceballos", pos: "Defensa", from: "S.D. Amorebieta", source: SRC.LAPREFERENTE },
  { name: "Ángel Cano", pos: "Defensa", from: "C.D. Extremadura", source: SRC.LAPREFERENTE },
  { name: "Adrián Crespo", pos: "Defensa", from: "C.P. Cacereño", source: SRC.LAPREFERENTE },
  { name: "Morros", pos: "Defensa", from: "C.F. Lorca Deportiva", source: SRC.LAPREFERENTE },
  { name: "Ismael Estévez", pos: "Defensa", from: "Terrassa F.C.", source: SRC.LAPREFERENTE },
  { name: "Carlos Ramírez", pos: "Centrocampista", from: "Salerm Puente Genil", source: SRC.LAPREFERENTE },
  { name: "Lázaro Rubio", pos: "Centrocampista", from: "F.C. Cartagena B", source: SRC.LAPREFERENTE },
  { name: "Alberto Vaquero", pos: "Centrocampista", from: "S.D. Tarazona", source: SRC.LAPREFERENTE },
  { name: "Alejandro Martínez", pos: "Delantero", from: "Recreativo Granada", source: SRC.LAPREFERENTE },
  { name: "Aarón Piñán", pos: "Delantero", from: "Unionistas de Salamanca", source: SRC.LAPREFERENTE },
  { name: "Simón Moreno", pos: "Delantero", from: "C.D. Tudelano", source: SRC.LAPREFERENTE },
  { name: "Babacar Fedior", pos: "Delantero", from: "Yeclano Deportivo", source: SRC.LAPREFERENTE },
  { name: "Pipo", pos: "Delantero", from: "Águilas F.C.", source: SRC.LAPREFERENTE },
  { name: "Boris Kouassi", pos: "Delantero", from: "Águilas F.C.", source: SRC.LAPREFERENTE },
];

export const TRANSFERS_OUT: { name: string; fullName?: string; to: string; source: SourceId }[] = [];

/* --------------------- Calendario 2026/27 · Grupo III ---------------- */

export type MatchEvent = {
  minute: number;
  type: "goal" | "yellow" | "red" | "sub";
  side: "home" | "away";
  player: string;
  detail?: string;
};

export type Match = {
  id: string;
  comp: string;
  round: string;
  dateLabel: string;
  dayShort: string;
  dayNum: string;
  monthShort: string;
  time: string;
  home: string;
  away: string;
  venue: string;
  played: boolean;
  goalsHome?: number;
  goalsAway?: number;
  events?: MatchEvent[];
  stats?: {
    possession: [number, number];
    shots: [number, number];
    shotsOn: [number, number];
    corners: [number, number];
    fouls: [number, number];
    offsides: [number, number];
  };
  mvp?: string;
  gallery?: string[];
};

const HOME = "Estadio Ángel Celdrán";
const COMP = "Segunda Federación · Grupo III";

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

/** [jornada, ISO, hora|null, rival, local?, golesMinera|null, golesRival|null] */
type Fx = [number, string, string | null, string, boolean, number | null, number | null];

const FIXTURES: Fx[] = [
  [1, "2026-09-06", null, "penadeportiva", true, 1, 0],
  [2, "2026-09-13", null, "mallorcab", false, 0, 0],
  [3, "2026-09-20", null, "orihuela", true, null, null],
  [4, "2026-09-27", "18:00", "alcoyano", false, null, null],
  [5, "2026-10-04", null, "lanucia", true, 2, 0],
  [6, "2026-10-11", "11:30", "castellonense", true, null, null],
  [7, "2026-10-18", "17:00", "yeclano", true, null, null],
  [8, "2026-10-25", null, "cieza", false, null, null],
  [9, "2026-11-01", null, "intercity", true, null, null],
  [10, "2026-11-08", null, "baleares", false, null, null],
  [11, "2026-11-15", null, "valenciab", true, null, null],
  [12, "2026-11-22", null, "lorca", false, null, null],
  [13, "2026-11-29", null, "elcheb", true, null, null],
  [14, "2026-12-06", null, "imperial", false, null, null],
  [15, "2026-12-13", null, "poblense", true, null, null],
  [16, "2026-12-20", null, "ucam", false, null, null],
  [17, "2027-01-10", null, "castellonb", true, null, null],
];

function build(): Match[] {
  return FIXTURES.map(([j, iso, time, rival, atHome, gf, ga]) => {
    const d = new Date(`${iso}T12:00:00`);
    const label = new Intl.DateTimeFormat("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
    const played = gf !== null && ga !== null;
    return {
      id: `g3-j${j}-${rival}`,
      comp: COMP,
      round: `Jornada ${j}`,
      dateLabel: label.charAt(0).toUpperCase() + label.slice(1),
      dayShort: DIAS[d.getDay()],
      dayNum: String(d.getDate()).padStart(2, "0"),
      monthShort: MESES[d.getMonth()],
      time: time ?? NA,
      home: atHome ? "coria" : rival,
      away: atHome ? rival : "coria",
      venue: atHome ? HOME : NA,
      played,
      ...(played ? { goalsHome: atHome ? gf! : ga!, goalsAway: atHome ? ga! : gf! } : {}),
    } satisfies Match;
  });
}

export const MATCHES: Match[] = build();

export const NEXT_MATCH = MATCHES.find((m) => !m.played) ?? MATCHES[MATCHES.length - 1];
export const LAST_MATCH = [...MATCHES].reverse().find((m) => m.played) ?? MATCHES[0];

/* ------- Clasificación del Grupo III · tras la jornada 6 ------------
   Fuente: RFEF, contrastada con Futbolme, Sport y Siguetuliga
   (datos coincidentes a 12 de octubre de 2026).
-------------------------------------------------------------------- */

export type Row = {
  pos: number;
  key: string;
  pj: number;
  pg: number;
  pe: number;
  pp: number;
  gf: number;
  gc: number;
};

export const STANDINGS: Row[] = [
  { pos: 1, key: "ucam", pj: 6, pg: 4, pe: 0, pp: 2, gf: 14, gc: 6 },
  { pos: 2, key: "castellonb", pj: 6, pg: 4, pe: 0, pp: 2, gf: 13, gc: 7 },
  { pos: 3, key: "lanucia", pj: 6, pg: 4, pe: 0, pp: 2, gf: 10, gc: 6 },
  { pos: 4, key: "castellonense", pj: 6, pg: 4, pe: 0, pp: 2, gf: 10, gc: 6 },
  { pos: 5, key: "cieza", pj: 6, pg: 3, pe: 2, pp: 1, gf: 10, gc: 4 },
  { pos: 6, key: "coria", pj: 6, pg: 3, pe: 2, pp: 1, gf: 8, gc: 6 },
  { pos: 7, key: "alcoyano", pj: 6, pg: 3, pe: 1, pp: 2, gf: 6, gc: 5 },
  { pos: 8, key: "yeclano", pj: 6, pg: 2, pe: 3, pp: 1, gf: 5, gc: 2 },
  { pos: 9, key: "intercity", pj: 6, pg: 2, pe: 3, pp: 1, gf: 8, gc: 8 },
  { pos: 10, key: "lorca", pj: 6, pg: 2, pe: 2, pp: 2, gf: 6, gc: 5 },
  { pos: 11, key: "elcheb", pj: 6, pg: 2, pe: 1, pp: 3, gf: 7, gc: 9 },
  { pos: 12, key: "poblense", pj: 6, pg: 2, pe: 1, pp: 3, gf: 5, gc: 8 },
  { pos: 13, key: "orihuela", pj: 6, pg: 2, pe: 1, pp: 3, gf: 7, gc: 14 },
  { pos: 14, key: "mallorcab", pj: 6, pg: 1, pe: 3, pp: 2, gf: 4, gc: 6 },
  { pos: 15, key: "baleares", pj: 6, pg: 1, pe: 3, pp: 2, gf: 8, gc: 11 },
  { pos: 16, key: "penadeportiva", pj: 6, pg: 1, pe: 1, pp: 4, gf: 6, gc: 9 },
  { pos: 17, key: "valenciab", pj: 6, pg: 1, pe: 1, pp: 4, gf: 6, gc: 11 },
  { pos: 18, key: "imperial", pj: 6, pg: 1, pe: 1, pp: 4, gf: 5, gc: 12 },
];

/** Asciende directo el campeón; del 2º al 5º juegan la promoción. */
export const PROMO_DIRECT = 1;
export const PROMO_PLAYOFF = 5;
/** Descienden los cuatro últimos de un grupo de 18. */
export const RELEGATION_FROM = 15;

export const TEAM_SEASON = {
  pj: 6,
  pg: 3,
  pe: 2,
  pp: 1,
  gf: 8,
  gc: 6,
  pts: 11,
  cleanSheets: 3,
  yellow: null as number | null,
  red: null as number | null,
  avgFor: 1.3,
  avgAgainst: 1,
  possession: null as number | null,
  shotAccuracy: null as number | null,
};

export const FORM: ("V" | "E" | "D")[] = ["V", "E", "E", "D", "V", "V"];

export const SCORERS: { name: string; goals: number }[] = [];

/* ------------------------------ Noticias ------------------------------ */

export const NEWS = [
  {
    id: "j6-castellonense",
    tag: "Primer equipo",
    date: "11 de octubre de 2026",
    title: "La Minera recibe al Castellonense en el Ángel Celdrán",
    text: "El equipo de Alejandro Sandroni, octavo con ocho puntos tras superar 2-0 al C.F. La Nucía, se mide al tercer clasificado en la sexta jornada del Grupo III.",
    image: IMG.action2,
    source: "COPE Región de Murcia",
  },
  {
    id: "j5-lanucia",
    tag: "Resultados",
    date: "4 de octubre de 2026",
    title: "Victoria por 2-0 ante el C.F. La Nucía",
    text: "Los mineros se imponen en casa y encadenan una nueva jornada sumando de tres en el Estadio Ángel Celdrán.",
    image: IMG.action5,
    source: "RFEF",
  },
  {
    id: "invicto",
    tag: "Primer equipo",
    date: "27 de septiembre de 2026",
    title: "La Minera visita El Collao sin conocer la derrota",
    text: "Tras ganar a la Peña Deportiva y empatar ante el Mallorca Atlético y el Orihuela, el conjunto cartagenero afronta su primera salida exigente de la temporada.",
    image: IMG.action3,
    source: "La Opinión de Murcia",
  },
  {
    id: "j1-victoria",
    tag: "Resultados",
    date: "6 de septiembre de 2026",
    title: "Arranque con victoria ante la Peña Deportiva",
    text: "La Deportiva Minera estrena la temporada 2026/27 con un triunfo por 1-0 en el Estadio Ángel Celdrán.",
    image: IMG.fans1,
    source: "RFEF",
  },
];

/* ------------------------------ Historia ------------------------------ */

export const TIMELINE = [
  {
    year: "1949",
    title: "Fundación del Club Deportiva Minera",
    text: "El club nace de la unión de tres poblaciones del municipio de Cartagena: El Estrecho de San Ginés, Llano del Beal y El Beal, en plena comarca minera.",
  },
  {
    year: "2024-25",
    title: "Consolidación en Segunda Federación",
    text: "El equipo se asienta en la cuarta categoría del fútbol español dentro del Grupo IV.",
  },
  {
    year: "2025-26",
    title: "Subcampeón del Grupo IV",
    text: "La Minera firma la mejor temporada de su historia: 63 puntos, 19 victorias, 50 goles a favor y 33 en contra. Accede a la promoción de ascenso a Primera Federación y se clasifica para la Copa del Rey.",
  },
  {
    year: "2026-27",
    title: "Nueva etapa en el Grupo III",
    text: "Tras la reorganización de grupos de la RFEF, el club pasa a competir en el Grupo III junto a los equipos de Murcia, Comunidad Valenciana y Baleares.",
  },
];

export const HONOURS = [
  { title: "Subcampeón Segunda Federación · Grupo IV", detail: "2025-26" },
  { title: "Clasificación para la Copa del Rey", detail: "2026-27" },
];

export const CLUB_RECORDS = [
  { k: "Fundación", v: "1949" },
  { k: "Categoría actual", v: "Segunda Federación" },
  { k: "Mejor puesto", v: "2º (2ª Fed., 2025-26)" },
  { k: "Mejor puntuación", v: "63 puntos (2025-26)" },
];

export const PAST_SEASONS = [
  { season: "2025-26", comp: "Segunda Federación · Grupo IV", pj: 34, pts: 63, pos: "2º" },
];
export const PAST_SEASONS_SOURCE: SourceId = SRC.RFAF;

export const LAST_SEASON_DETAIL = {
  season: "2025-26",
  comp: "Segunda Federación · Grupo IV",
  pj: 34,
  pg: 19,
  pe: 6,
  pp: 9,
  gf: 50,
  gc: 33,
  pts: 63,
  pos: "2º",
  source: SRC.RFAF as SourceId,
};

export const SQUAD_HIGHLIGHTS = {
  season: "2026/27",
  comp: COMP,
  topScorer: { name: NA, detail: "" },
  mostMinutes: { name: NA, detail: "" },
  mostBooked: { name: NA, detail: "" },
  squadSize: PLAYERS.length,
  source: SRC.LAPREFERENTE as SourceId,
};

/* ------------------------------- Galería ------------------------------ */

export type GalleryItem = {
  id: string;
  cat: "Partidos" | "Estadio" | "Entrenamientos" | "Afición";
  src: string;
  title: string;
  tall?: boolean;
};

export const GALLERY: GalleryItem[] = [
  { id: "g1", cat: "Partidos", src: IMG.action1, title: "Imagen de recurso · fútbol", tall: true },
  { id: "g2", cat: "Afición", src: IMG.fans1, title: "Imagen de recurso · grada" },
  { id: "g3", cat: "Estadio", src: IMG.stadiumNight, title: "Imagen de recurso · estadio" },
  { id: "g4", cat: "Entrenamientos", src: IMG.training1, title: "Imagen de recurso · entrenamiento" },
  { id: "g5", cat: "Partidos", src: IMG.action5, title: "Imagen de recurso · fútbol" },
  { id: "g6", cat: "Afición", src: IMG.fans2, title: "Imagen de recurso · grada" },
  { id: "g7", cat: "Estadio", src: IMG.stadiumAerial, title: "Imagen de recurso · vista aérea" },
  { id: "g8", cat: "Partidos", src: IMG.keeper1, title: "Imagen de recurso · portero" },
  { id: "g9", cat: "Entrenamientos", src: IMG.training4, title: "Imagen de recurso · cantera" },
  { id: "g10", cat: "Afición", src: IMG.fans3, title: "Imagen de recurso · afición" },
  { id: "g11", cat: "Partidos", src: IMG.action6, title: "Imagen de recurso · fútbol" },
  { id: "g12", cat: "Estadio", src: IMG.hero, title: "Imagen de recurso · césped" },
];

export const GALLERY_CATS = [
  { key: "Todas", icon: "🗂️" },
  { key: "Partidos", icon: "📸" },
  { key: "Estadio", icon: "🏟️" },
  { key: "Entrenamientos", icon: "🏃" },
  { key: "Afición", icon: "🙌" },
] as const;

/* -------------------------------- Afición ------------------------------ */

export const ANTHEM = {
  title: "Himno del Club Deportiva Minera",
  subtitle: "Letra y audio no publicados en fuentes consultables",
  duration: NA,
  lyrics: [] as string[],
};

export const FAN_CAMPAIGN = {
  title: "Abonos 2026/27",
  slogan: "",
  text: "Información de abonos y entradas en las oficinas del club y en el Estadio Ángel Celdrán de Llano del Beal.",
  source: NA,
};

export const PENAS: { name: string; since: number; members: number }[] = [];
export const FAN_MOMENTS: { title: string; text: string; img: string }[] = [];

/* -------------------------------- Estadio ------------------------------ */

export const STADIUM_FACTS = [
  { k: "Nombre", v: "Ángel Celdrán" },
  { k: "Localidad", v: "Llano del Beal" },
  { k: "Municipio", v: "Cartagena" },
  { k: "Aforo", v: "2.000 aprox." },
  { k: "Superficie", v: NA },
  { k: "Titularidad", v: NA },
];

export const STADIUM_AREAS = [
  {
    name: "Ubicación",
    desc: "En Llano del Beal, una de las tres poblaciones de la comarca minera de Cartagena que dieron origen al club.",
  },
  {
    name: "Comarca minera",
    desc: "El club representa a El Estrecho de San Ginés, Llano del Beal y El Beal, de donde toma su nombre.",
  },
];

export const HOW_TO_ARRIVE = [
  { mode: "Dirección", detail: "Estadio Ángel Celdrán · Llano del Beal, Cartagena (Murcia)" },
  { mode: "Teléfono", detail: NA },
  { mode: "Web oficial", detail: NA },
];

/* ------------------------------ Categorías ----------------------------- */

export type Scorer = { name: string; goals: number; assists?: number };
export type Totals = typeof TEAM_SEASON;

export type Category = {
  id: string;
  name: string;
  short: string;
  icon: string;
  competition: string;
  coach: string;
  venue: string;
  squadSize: number | null;
  linksPlayers?: boolean;
  group?: string;
  image?: string;
  matches: Match[];
  standings: Row[];
  totals: Totals;
  form: ("V" | "E" | "D")[];
  scorers: Scorer[];
};

const EMPTY_TOTALS: Totals = {
  pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0,
  cleanSheets: 0, yellow: null, red: null,
  avgFor: 0, avgAgainst: 0, possession: null, shotAccuracy: null,
};

function team(
  id: string,
  name: string,
  short: string,
  icon: string,
  competition: string,
  group: string,
  image: string,
): Category {
  return {
    id, name, short, icon, competition, group, image,
    coach: NA,
    venue: CLUB.stadium,
    squadSize: null,
    matches: [],
    standings: [],
    totals: { ...EMPTY_TOTALS },
    form: [],
    scorers: [],
  };
}

const FIRST_TEAM: Category = {
  id: "primer-equipo",
  name: "Primer Equipo",
  short: "1er Equipo",
  icon: "🏆",
  competition: CLUB.league,
  coach: CLUB.coach,
  venue: CLUB.stadium,
  squadSize: PLAYERS.length,
  linksPlayers: true,
  group: "Sénior",
  image: IMG.action2,
  matches: MATCHES,
  standings: STANDINGS,
  totals: TEAM_SEASON,
  form: FORM,
  scorers: [],
};

export const CATEGORIES: Category[] = [
  FIRST_TEAM,
  team("juvenil", "Juvenil", "Juvenil", "🎓", "Liga Nacional Juvenil", "Juvenil", IMG.training4),
];

/* --------------------------- Entradas ------------------------------ */

export type TicketType = {
  id: string;
  name: string;
  price: number | null;
  description: string;
  available: boolean;
};

export type Ticketing = {
  enabled: boolean;
  externalUrl: string;
  notice: string;
  types: TicketType[];
};

export const TICKETING: Ticketing = {
  enabled: false,
  externalUrl: "",
  notice:
    "La venta de entradas online todavía no está habilitada. Las entradas pueden adquirirse en las taquillas del Estadio Ángel Celdrán el día del encuentro.",
  types: [
    { id: "general", name: "Entrada general", price: null, description: "Acceso general al estadio", available: false },
    { id: "reducida", name: "Entrada reducida", price: null, description: "Menores, estudiantes y mayores de 65 años", available: false },
    { id: "socio", name: "Abonado", price: null, description: "Acceso incluido en el abono de temporada", available: false },
  ],
};
