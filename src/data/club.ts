/* ------------------------------------------------------------------
   CORIA CLUB DE FÚTBOL — Coria del Río (Sevilla)
   Datos reales y verificados. Temporada actual: 2026/27.

   FUENTES:
   · RFAF (Real Federación Andaluza de Fútbol) — clasificación oficial
     del Grupo I de División de Honor Andaluza.
   · Wikipedia «División de Honor Andaluza 2026-27» (datos RFAF).
   · Wikipedia «Coria Club de Fútbol» (plantilla, historia, palmarés).
   · Futbolme — calendario y resultados del Grupo I.
   · Cuenta oficial del club @Coria_CF y coriacf.es.

   NOTA: este club NO es el C.D. Coria de Cáceres.
   Cuando un dato no ha podido verificarse se indica "No disponible".
------------------------------------------------------------------- */

export const NA = "No disponible";

/** Fecha de corte de los datos deportivos (clasificación y resultados RFAF) */
export const LAST_UPDATE = "4 de octubre de 2026, 20:00 h";

/* ----------------------- Registro de fuentes -------------------------
   Jerarquía aplicada en todo el sitio:
   RFAF  → datos de competición (clasificación, resultados, calendario).
   BeSoccer → plantilla, jugadores y estadísticas individuales.
   Si la fuente correspondiente no publica el dato → "No disponible".
   Cada dato guarda internamente de qué fuente procede para poder
   actualizarlo después sin revisar toda la web.
--------------------------------------------------------------------- */

export const SRC = {
  RFAF: "RFAF",
  LAPREFERENTE: "LaPreferente",
  BESOCCER: "BeSoccer",
  CLUB: "Club oficial (@Coria_CF / coriacf.es)",
  NONE: NA,
} as const;

export type SourceId = (typeof SRC)[keyof typeof SRC];

/** Competición → RFAF. Jugadores → BeSoccer. */
export const SOURCE_PRIORITY: SourceId[] = [SRC.RFAF, SRC.BESOCCER];

/* Reparto de fuentes:
   · RFAF   → exclusivamente datos de competición.
   · BeSoccer → exclusivamente jugadores y estadísticas individuales. */
export const SOURCE_USAGE: { area: string; source: SourceId; detail: string }[] = [
  { area: "Clasificación", source: SRC.RFAF, detail: "Grupo I de División de Honor Andaluza" },
  { area: "Resultados", source: SRC.RFAF, detail: "Marcadores oficiales de cada encuentro" },
  { area: "Próximos partidos y calendario", source: SRC.RFAF, detail: "36 encuentros de la temporada" },
  { area: "Jornadas y competición", source: SRC.RFAF, detail: "Sistema de ascensos y descensos" },
  { area: "Puntos, PJ, V/E/D y goles de los equipos", source: SRC.RFAF, detail: "Tabla del grupo" },
  {
    area: "Plantilla 2026/27",
    source: SRC.LAPREFERENTE,
    detail: "BeSoccer mantiene la plantilla de 2025/26; se usa la ficha 2026/27 verificada",
  },
  { area: "Posición, edad y procedencia", source: SRC.LAPREFERENTE, detail: "Datos individuales" },
  {
    area: "Goles, PJ, titularidades, minutos y tarjetas",
    source: SRC.LAPREFERENTE,
    detail: "Cuadran con los goles a favor y en contra de la RFAF",
  },
  { area: "Altas y bajas de jugadores", source: SRC.LAPREFERENTE, detail: "Mercado 2026/27" },
  { area: "Traspaso registrado", source: SRC.BESOCCER, detail: "Mercado de fichajes" },
  { area: "Trayectoria por temporadas", source: SRC.BESOCCER, detail: "Puntos y posición final" },
  { area: "Cuerpo técnico y directiva", source: SRC.BESOCCER, detail: "Ficha del club" },
  { area: "Noticias y campaña de abonos", source: SRC.CLUB, detail: "Comunicados oficiales" },
];

export const SOURCES = "RFAF (competición) · BeSoccer y LaPreferente (jugadores)";

export const CLUB = {
  name: "Coria Club de Fútbol",
  short: "Coria C.F.",
  founded: "25 de marzo de 1923",
  city: "Coria del Río, Sevilla",
  stadium: "Estadio Guadalquivir",
  capacity: 5000,
  league: "División de Honor Andaluza · Grupo I",
  season: "2026/27",
  nickname: "Coria del Río · Sevilla",
  colors: "Amarillo, blanco y azul marino",
  address: "C/ Carrascalejos, 16 · 41100 Coria del Río (Sevilla)",
  phone: "655 02 66 21",
  website: "coriacf.es",
  twitter: "@Coria_CF",
  president: "Tomás Alfaro Lama",
  coach: "Dioni Arroyo",
  kit: "Joma",
};

const P = "https://images.pexels.com/photos";
const Q = "?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200";

/** Imágenes genéricas de recurso. No son fotografías del Coria C.F. */
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
  training4: `${P}/34516565/pexels-photo-34516565.jpeg${Q}`,
  keeper1: `${P}/32205615/pexels-photo-32205615.jpeg${Q}`,
};

/* ------------------------------ Equipos ------------------------------ */

export type Team = { name: string; abbr: string; c1: string; c2: string };

const N1 = "#334155";
const N2 = "#ffffff";

export const TEAMS: Record<string, Team> = {
  coria: { name: "Coria C.F.", abbr: "COR", c1: "#FCD116", c2: "#10307A" },
  arcos: { name: "Arcos C.F.", abbr: "ARC", c1: N1, c2: N2 },
  palmadelrio: { name: "Atlético Palma del Río C.F.", abbr: "APR", c1: N1, c2: N2 },
  montilla: { name: "Montilla C.F.", abbr: "MON", c1: N1, c2: N2 },
  lapalma: { name: "La Palma C.F.", abbr: "LPA", c1: N1, c2: N2 },
  almodovar: { name: "Almodóvar del Río C.F.", abbr: "ALM", c1: N1, c2: N2 },
  moguer: { name: "C.D. Moguer", abbr: "MOG", c1: N1, c2: N2 },
  castilleja: { name: "Castilleja C.F.", abbr: "CAS", c1: N1, c2: N2 },
  rinconada: { name: "U.D. Rinconada", abbr: "RIN", c1: N1, c2: N2 },
  islacristina: { name: "Isla Cristina F.C.", abbr: "ICR", c1: N1, c2: N2 },
  cabecense: { name: "C.D. Cabecense", abbr: "CAB", c1: N1, c2: N2 },
  montalbeno: { name: "C.D. Montalbeño", abbr: "MTB", c1: N1, c2: N2 },
  cadizc: { name: 'Cádiz C.F. "C"', abbr: "CAC", c1: N1, c2: N2 },
  lebrijana: { name: "U.B. Lebrijana", abbr: "LEB", c1: N1, c2: N2 },
  espeleno: { name: "Atlético Espeleño", abbr: "ESP", c1: N1, c2: N2 },
  rayosanluqueno: { name: "C.D. Rayo Sanluqueño", abbr: "RSA", c1: N1, c2: N2 },
  viso: { name: "U.P. Viso", abbr: "VIS", c1: N1, c2: N2 },
  aroche: { name: "Aroche C.F.", abbr: "ARO", c1: N1, c2: N2 },
  intersevilla: { name: "C.D. Inter de Sevilla", abbr: "INT", c1: N1, c2: N2 },
};

/* ----------------------------- Plantilla -----------------------------
   PLANTILLA REAL DEL CORIA C.F. (Coria del Río, Sevilla)
   Temporada 2026/27 · División de Honor Andaluza, Grupo 1.

   La ficha de plantilla de BeSoccer sigue mostrando el bloque de la
   temporada 2025/26 en Tercera Federación, por lo que los jugadores
   del curso actual se han tomado de la ficha de LaPreferente del
   Coria C.F. (equipo 581), que publica expresamente
   «2026/2027 · División Honor Andaluza Gr.1».

   VERIFICACIÓN CRUZADA CON LA RFAF:
   · Goles anotados por los jugadores: 8 → coinciden con los 8 GF RFAF.
   · Goles encajados por los porteros: 7 → coinciden con los 7 GC RFAF.
   · Partidos disputados: 5 → coinciden con los 5 PJ RFAF.

   Ningún jugador procede del C.D. Coria de Cáceres.
   Los dorsales no están publicados por ninguna de las dos fuentes:
   figuran como "No disponible".
---------------------------------------------------------------------- */

export type Position = "Portero" | "Defensa" | "Centrocampista" | "Delantero" | "Sin determinar";

export type Player = {
  id: string;
  /** Dorsal oficial; null si la fuente no lo publica */
  num: number | null;
  first: string;
  last: string;
  pos: Position;
  /** Demarcación detallada publicada por la fuente */
  role?: string;
  fullName?: string;
  nationality: string;
  age: number | null;
  height: number | null;
  /** Situación: renovado, nuevo fichaje y procedencia */
  note?: string;
  /* --- Estadísticas individuales de la temporada 2026/27 --- */
  /** Convocatorias */
  pc: number | null;
  /** Partidos jugados */
  pj: number | null;
  /** Titularidades */
  pt: number | null;
  /** Minutos disputados */
  min: number | null;
  goals: number | null;
  /** Goles encajados (solo porteros) */
  conceded?: number | null;
  yellow: number | null;
  red: number | null;
  source?: SourceId;
};

type Stats = {
  pc: number;
  pj: number;
  pt: number;
  min: number;
  goals: number;
  conceded?: number;
  yellow: number;
  red: number;
};

const mk = (
  id: string,
  first: string,
  last: string,
  pos: Position,
  age: number | null,
  stats: Stats,
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
  source: SRC.LAPREFERENTE,
  ...stats,
  ...extra,
});

/* Plantilla 2026/27 del Coria C.F. · División de Honor Andaluza Gr. 1.
   Los nombres se reproducen EXACTAMENTE como figuran en la ficha
   federativa: «alias» es el nombre deportivo publicado y «fullName»
   el nombre completo del jugador.
   PC = convocatorias · PJ = jugados · PT = titular · Min = minutos.
   En porteros, «conceded» son los goles encajados. */
export const PLAYERS: Player[] = [
  /* ------------------------------ Porteros (3) --------------------------- */
  mk("dani-lopez", "Dani", "López", "Portero", 18,
    { pc: 2, pj: 0, pt: 0, min: 0, goals: 0, conceded: 0, yellow: 0, red: 0 },
    { fullName: "Daniel López Corchero", role: "Portero", note: "Renovado" }),
  mk("fernando-zamora", "", "Fernando", "Portero", 29,
    { pc: 3, pj: 3, pt: 3, min: 216, goals: 0, conceded: 4, yellow: 0, red: 0 },
    { fullName: "Fernando Zamora Rojas", role: "Portero", note: "Nuevo fichaje · Castilleja C.F." }),
  mk("pablo-suarez", "Pablo", "Suárez", "Portero", 23,
    { pc: 5, pj: 3, pt: 2, min: 234, goals: 0, conceded: 3, yellow: 0, red: 0 },
    { fullName: "Pablo Suárez Sarmiento", role: "Portero", note: "Nuevo fichaje · Puebla C.F." }),

  /* ------------------------------ Defensas (8) --------------------------- */
  mk("antonio-garrido", "Antonio", "Garrido", "Defensa", 19,
    { pc: 5, pj: 5, pt: 4, min: 223, goals: 0, yellow: 1, red: 0 },
    { fullName: "Antonio Garrido García", role: "Defensa", note: "Nuevo fichaje · Coria C.F." }),
  mk("cristian-toro", "Cristian", "Toro", "Defensa", 33,
    { pc: 3, pj: 3, pt: 2, min: 216, goals: 0, yellow: 1, red: 0 },
    { fullName: "Cristian Tomás del Toro", role: "Central", note: "Nuevo fichaje · Dos Hermanas CF 1971" }),
  mk("david-gil", "David", "Gil", "Defensa", null,
    { pc: 0, pj: 0, pt: 0, min: 0, goals: 0, yellow: 0, red: 0 },
    { fullName: "David Gil Suárez", role: "Defensa", note: "Nuevo fichaje · C.D. Inter Sevilla" }),
  mk("jesus-marin", "", "Jesús", "Defensa", 23,
    { pc: 5, pj: 5, pt: 5, min: 427, goals: 0, yellow: 0, red: 0 },
    { fullName: "Jesús Marín Barrios", role: "Lateral izquierdo", note: "Nuevo fichaje · Castilleja C.F." }),
  mk("jorge-arguedas", "", "Jorge", "Defensa", null,
    { pc: 5, pj: 5, pt: 5, min: 368, goals: 0, yellow: 1, red: 0 },
    { fullName: "Jorge Luis Arguedas Alberdi", role: "Defensa", note: "Nuevo fichaje · A.D. Mosqueo" }),
  mk("jose-luis-diaz", "Jose Luis", "Díaz", "Defensa", 19,
    { pc: 5, pj: 5, pt: 5, min: 440, goals: 0, yellow: 0, red: 1 },
    { fullName: "José Luis Díaz Díaz", role: "Defensa", note: "Renovado" }),
  mk("antonio-recio", "", "Recio", "Defensa", 36,
    { pc: 3, pj: 3, pt: 1, min: 116, goals: 0, yellow: 0, red: 0 },
    { fullName: "Antonio Recio Espinosa", role: "Lateral derecho", note: "Nuevo fichaje · U.B. Lebrijana" }),
  mk("rodney-woistchach", "", "Rodney", "Defensa", 26,
    { pc: 3, pj: 3, pt: 3, min: 248, goals: 0, yellow: 1, red: 0 },
    {
      fullName: "Rodney Gerald Woistchach Fornells",
      role: "Defensa",
      note: "Nuevo fichaje · C.D. Inter Sevilla",
    }),

  /* --------------------------- Centrocampistas (3) ----------------------- */
  mk("diego-arana", "Diego", "Arana", "Centrocampista", 27,
    { pc: 5, pj: 5, pt: 4, min: 322, goals: 0, yellow: 0, red: 0 },
    {
      fullName: "Diego Luis Arana Ors",
      role: "Mediocentro ofensivo",
      note: "Nuevo fichaje · U.B. Lebrijana",
    }),
  mk("julio-camacho", "Julio", "Camacho", "Centrocampista", 27,
    { pc: 5, pj: 5, pt: 5, min: 440, goals: 2, yellow: 2, red: 0 },
    {
      fullName: "Julio José Camacho Bonilla",
      role: "Interior izquierdo",
      note: "Nuevo fichaje · Dos Hermanas CF 1971",
    }),
  mk("carlos-rojas", "", "Rojas", "Centrocampista", 21,
    { pc: 5, pj: 5, pt: 3, min: 291, goals: 1, yellow: 2, red: 0 },
    {
      fullName: "Carlos Rojas López",
      role: "Mediocentro ofensivo",
      note: "Nuevo fichaje · C.D. Anguiano",
    }),

  /* ------------------------------ Delanteros (6) ------------------------- */
  mk("alvarito-fernandez", "Alvarito", "Fernández", "Delantero", 26,
    { pc: 5, pj: 5, pt: 4, min: 388, goals: 0, yellow: 0, red: 0 },
    { fullName: "Álvaro Fernández Suero", role: "Extremo izquierdo", note: "Renovado" }),
  mk("andres-teran", "Andrés", "Terán", "Delantero", 19,
    { pc: 5, pj: 5, pt: 4, min: 340, goals: 2, yellow: 3, red: 0 },
    { fullName: "Andrés Terán Solis", role: "Delantero", note: "Nuevo fichaje · Coria C.F." }),
  mk("angel-moreno", "Ángel", "Moreno", "Delantero", null,
    { pc: 4, pj: 4, pt: 0, min: 106, goals: 0, yellow: 0, red: 0 },
    {
      fullName: "Ángel Manuel Moreno Parra",
      role: "Extremo izquierdo",
      note: "Nuevo fichaje · Palomares C.F.",
    }),
  mk("fernando-herrera", "Fernando Jose", "Herrera", "Delantero", null,
    { pc: 1, pj: 1, pt: 0, min: 27, goals: 0, yellow: 0, red: 0 },
    {
      fullName: "Fernando Jose Herrera Ocampo",
      role: "Delantero",
      note: "Nuevo fichaje · C.D. Inter Sevilla",
    }),
  mk("gonzalo-carrascal", "Gonzalo", "Carrascal", "Delantero", 19,
    { pc: 5, pj: 5, pt: 4, min: 302, goals: 2, yellow: 0, red: 0 },
    { fullName: "Gonzalo Carrascal Jiménez", role: "Delantero", note: "Renovado" }),
  mk("rafa-toro", "Rafa", "Toro", "Delantero", null,
    { pc: 4, pj: 4, pt: 1, min: 123, goals: 1, yellow: 0, red: 0 },
    { fullName: "Rafael Toro Sosa", role: "Extremo izquierdo", note: "Nuevo fichaje · Camas C.F." }),

  /* ---------------------------- Sin determinar (2) ----------------------- */
  mk("pedro-soria", "Pedro", "Soria", "Sin determinar", null,
    { pc: 4, pj: 4, pt: 0, min: 78, goals: 0, yellow: 0, red: 0 },
    { fullName: "Pedro Soria Paniagua", note: "Nuevo fichaje" }),
  mk("soufiane-chadli", "Soufiane", "Chadli", "Sin determinar", null,
    { pc: 2, pj: 2, pt: 0, min: 23, goals: 0, yellow: 1, red: 0 },
    { fullName: "Soufiane Chadli Chadli", note: "Nuevo fichaje" }),
];

export const POSITION_ORDER: Position[] = [
  "Portero",
  "Defensa",
  "Centrocampista",
  "Delantero",
  "Sin determinar",
];

/** Comprobación: los goles de la plantilla deben cuadrar con los GF de la RFAF */
export const SQUAD_GOALS = PLAYERS.reduce((a, p) => a + (p.goals ?? 0), 0);
export const SQUAD_CONCEDED = PLAYERS.reduce((a, p) => a + (p.conceded ?? 0), 0);

/* Cuerpo técnico y directiva.
   Fuente: BeSoccer. Los cargos que no publica quedan como "No disponible". */
export const STAFF: { role: string; name: string; fullName?: string; source: SourceId }[] = [
  { role: "Presidente", name: "Tomás Alfaro Lama", source: SRC.BESOCCER },
  {
    role: "Entrenador",
    name: "Dioni Arroyo",
    fullName: "Dionisio Arroyo Panea",
    source: SRC.LAPREFERENTE,
  },
  {
    role: "Delegado de campo",
    name: "Juan Carlos Rodríguez",
    fullName: "Juan Carlos Rodríguez Cordero",
    source: SRC.LAPREFERENTE,
  },
  { role: "Entrenador auxiliar", name: NA, source: SRC.NONE },
  { role: "Entrenador de porteros", name: NA, source: SRC.NONE },
  { role: "Preparador físico", name: NA, source: SRC.NONE },
];

/* -------------------- Altas y bajas 2026/27 --------------------------
   Altas anunciadas por el club; bajas según el apartado de
   mercado de fichajes de BeSoccer.
--------------------------------------------------------------------- */

/** Altas confirmadas en la plantilla 2026/27 */
export const TRANSFERS_IN: { name: string; pos: string; from: string; source: SourceId }[] = [
  { name: "Fernando Zamora", pos: "Portero", from: "Castilleja C.F.", source: SRC.LAPREFERENTE },
  { name: "Pablo Suárez", pos: "Portero", from: "Puebla C.F.", source: SRC.LAPREFERENTE },
  { name: "Antonio Garrido", pos: "Defensa", from: "Coria C.F.", source: SRC.LAPREFERENTE },
  { name: "Cristian del Toro", pos: "Central", from: "Dos Hermanas CF 1971", source: SRC.LAPREFERENTE },
  { name: "David Gil", pos: "Defensa", from: "C.D. Inter Sevilla", source: SRC.LAPREFERENTE },
  { name: "Jesús Marín", pos: "Lateral izquierdo", from: "Castilleja C.F.", source: SRC.LAPREFERENTE },
  { name: "Jorge Arguedas", pos: "Defensa", from: "A.D. Mosqueo", source: SRC.LAPREFERENTE },
  { name: "Antonio Recio", pos: "Lateral derecho", from: "U.B. Lebrijana", source: SRC.LAPREFERENTE },
  { name: "Rodney Woistchach", pos: "Defensa", from: "C.D. Inter Sevilla", source: SRC.LAPREFERENTE },
  { name: "Diego Arana", pos: "Mediocentro ofensivo", from: "U.B. Lebrijana", source: SRC.LAPREFERENTE },
  { name: "Julio Camacho", pos: "Interior izquierdo", from: "Dos Hermanas CF 1971", source: SRC.LAPREFERENTE },
  { name: "Carlos Rojas", pos: "Mediocentro ofensivo", from: "C.D. Anguiano", source: SRC.LAPREFERENTE },
  { name: "Andrés Terán", pos: "Delantero", from: "Coria C.F.", source: SRC.LAPREFERENTE },
  { name: "Ángel Moreno", pos: "Extremo izquierdo", from: "Palomares C.F.", source: SRC.LAPREFERENTE },
  { name: "Fernando J. Herrera", pos: "Delantero", from: "C.D. Inter Sevilla", source: SRC.LAPREFERENTE },
  { name: "Rafa Toro", pos: "Extremo izquierdo", from: "Camas C.F.", source: SRC.LAPREFERENTE },
];

/** Ex-jugadores del club registrados en la temporada 2026/27 */
export const TRANSFERS_OUT: { name: string; fullName?: string; to: string; source: SourceId }[] = [
  {
    name: "Ale Bejarano",
    fullName: "Alejandro Jiménez Bejarano",
    to: "Sin equipo",
    source: SRC.LAPREFERENTE,
  },
  {
    name: "Arias",
    fullName: "José María Arias Jiménez",
    to: "Sin equipo",
    source: SRC.LAPREFERENTE,
  },
  {
    name: "Barea",
    fullName: "Miguel Barea Fernández",
    to: "A.D. Mosqueo",
    source: SRC.LAPREFERENTE,
  },
  {
    name: "José Joaquín",
    fullName: "José Joaquín González Moya",
    to: "Sin equipo",
    source: SRC.LAPREFERENTE,
  },
  { name: "Alex Cortijo", to: "Real Giulianova", source: SRC.BESOCCER },
];

/* ----------------- Calendario 2026/27 · Grupo I (36 jornadas) ---------
   Fuente: Futbolme / RFAF. Resultados reales disputados hasta el
   4 de octubre de 2026.
---------------------------------------------------------------------- */

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

const HOME = "Estadio Guadalquivir";
const COMP = "División de Honor Andaluza · Grupo I";

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

/** [fecha ISO, hora o null, rival, local?, goles Coria|null, goles rival|null] */
type Fx = [string, string | null, string, boolean, number | null, number | null];

const FIXTURES: Fx[] = [
  ["2026-09-13", null, "palmadelrio", true, 2, 1],
  ["2026-09-20", null, "viso", false, 3, 0],
  ["2026-09-27", null, "montilla", false, 1, 3],
  ["2026-09-30", null, "cabecense", true, 1, 1],
  ["2026-10-04", null, "arcos", false, 1, 2],
  ["2026-10-11", "12:00", "espeleno", true, null, null],
  ["2026-10-18", null, "cadizc", false, null, null],
  ["2026-10-25", null, "moguer", true, null, null],
  ["2026-11-08", null, "castilleja", true, null, null],
  ["2026-11-15", null, "rinconada", false, null, null],
  ["2026-11-22", null, "lapalma", true, null, null],
  ["2026-11-29", null, "montalbeno", false, null, null],
  ["2026-12-06", null, "almodovar", true, null, null],
  ["2026-12-08", null, "aroche", false, null, null],
  ["2026-12-13", null, "rayosanluqueno", true, null, null],
  ["2026-12-20", null, "islacristina", false, null, null],
  ["2027-01-03", null, "intersevilla", true, null, null],
  ["2027-01-10", null, "lebrijana", false, null, null],
  ["2027-01-17", null, "palmadelrio", false, null, null],
  ["2027-01-20", null, "viso", true, null, null],
  ["2027-01-24", null, "montilla", true, null, null],
  ["2027-01-31", null, "cabecense", false, null, null],
  ["2027-02-07", null, "arcos", true, null, null],
  ["2027-02-14", null, "espeleno", false, null, null],
  ["2027-02-21", null, "cadizc", true, null, null],
  ["2027-02-28", null, "moguer", false, null, null],
  ["2027-03-07", null, "castilleja", false, null, null],
  ["2027-03-14", null, "rinconada", true, null, null],
  ["2027-03-21", null, "lapalma", false, null, null],
  ["2027-03-28", null, "montalbeno", true, null, null],
  ["2027-04-04", null, "almodovar", false, null, null],
  ["2027-04-11", null, "aroche", true, null, null],
  ["2027-04-18", null, "rayosanluqueno", false, null, null],
  ["2027-04-25", null, "islacristina", true, null, null],
  ["2027-05-02", null, "intersevilla", false, null, null],
  ["2027-05-09", null, "lebrijana", true, null, null],
];

function build(): Match[] {
  return FIXTURES.map(([iso, time, rival, atHome, gf, ga], i) => {
    const d = new Date(`${iso}T12:00:00`);
    const label = new Intl.DateTimeFormat("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
    const played = gf !== null && ga !== null;
    return {
      id: `dh-${iso}-${rival}`,
      comp: COMP,
      round: `Encuentro ${i + 1} de ${FIXTURES.length}`,
      dateLabel: label.charAt(0).toUpperCase() + label.slice(1),
      dayShort: DIAS[d.getDay()],
      dayNum: String(d.getDate()).padStart(2, "0"),
      monthShort: MESES[d.getMonth()],
      time: time ?? NA,
      home: atHome ? "coria" : rival,
      away: atHome ? rival : "coria",
      venue: atHome ? HOME : NA,
      played,
      ...(played
        ? {
            goalsHome: atHome ? gf! : ga!,
            goalsAway: atHome ? ga! : gf!,
          }
        : {}),
    } satisfies Match;
  });
}

export const MATCHES: Match[] = build();

export const NEXT_MATCH = MATCHES.find((m) => !m.played) ?? MATCHES[MATCHES.length - 1];
export const LAST_MATCH = [...MATCHES].reverse().find((m) => m.played) ?? MATCHES[0];

/* -------------- Clasificación oficial RFAF · 4 de octubre de 2026 ------ */

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
  { pos: 1, key: "arcos", pj: 5, pg: 3, pe: 2, pp: 0, gf: 11, gc: 4 },
  { pos: 2, key: "palmadelrio", pj: 5, pg: 3, pe: 1, pp: 1, gf: 12, gc: 5 },
  { pos: 3, key: "montilla", pj: 5, pg: 3, pe: 1, pp: 1, gf: 9, gc: 7 },
  { pos: 4, key: "lapalma", pj: 5, pg: 3, pe: 0, pp: 2, gf: 11, gc: 6 },
  { pos: 5, key: "almodovar", pj: 4, pg: 2, pe: 2, pp: 0, gf: 7, gc: 4 },
  { pos: 6, key: "moguer", pj: 4, pg: 2, pe: 1, pp: 1, gf: 12, gc: 8 },
  { pos: 7, key: "coria", pj: 5, pg: 2, pe: 1, pp: 2, gf: 8, gc: 7 },
  { pos: 8, key: "castilleja", pj: 5, pg: 1, pe: 4, pp: 0, gf: 7, gc: 6 },
  { pos: 9, key: "rinconada", pj: 5, pg: 2, pe: 1, pp: 2, gf: 7, gc: 8 },
  { pos: 10, key: "islacristina", pj: 4, pg: 1, pe: 3, pp: 0, gf: 6, gc: 5 },
  { pos: 11, key: "cabecense", pj: 5, pg: 1, pe: 3, pp: 1, gf: 8, gc: 8 },
  { pos: 12, key: "montalbeno", pj: 5, pg: 1, pe: 2, pp: 2, gf: 7, gc: 7 },
  { pos: 13, key: "cadizc", pj: 5, pg: 1, pe: 2, pp: 2, gf: 7, gc: 11 },
  { pos: 14, key: "lebrijana", pj: 3, pg: 1, pe: 1, pp: 1, gf: 5, gc: 4 },
  { pos: 15, key: "espeleno", pj: 4, pg: 1, pe: 1, pp: 2, gf: 6, gc: 7 },
  { pos: 16, key: "rayosanluqueno", pj: 4, pg: 1, pe: 1, pp: 2, gf: 4, gc: 5 },
  { pos: 17, key: "viso", pj: 5, pg: 0, pe: 2, pp: 3, gf: 5, gc: 10 },
  { pos: 18, key: "aroche", pj: 4, pg: 0, pe: 1, pp: 3, gf: 6, gc: 15 },
  { pos: 19, key: "intersevilla", pj: 4, pg: 0, pe: 1, pp: 3, gf: 4, gc: 15 },
];

/** Ascienden los dos primeros; del 3º al 6º disputan promoción; descienden los tres últimos. */
export const PROMO_DIRECT = 2;
export const PROMO_PLAYOFF = 6;
export const RELEGATION_FROM = 17;

export const TEAM_SEASON = {
  pj: 5,
  pg: 2,
  pe: 1,
  pp: 2,
  gf: 8,
  gc: 7,
  pts: 7,
  cleanSheets: 1,
  yellow: null as number | null,
  red: null as number | null,
  avgFor: 1.6,
  avgAgainst: 1.4,
  possession: null as number | null,
  shotAccuracy: null as number | null,
};

/** Resultados en orden cronológico de los encuentros disputados */
export const FORM: ("V" | "E" | "D")[] = ["V", "V", "D", "E", "D"];

/** No hay estadísticas individuales públicas de la temporada 2026/27 */
export const SCORERS: { name: string; goals: number }[] = [];

/* ------------------------------ Noticias ------------------------------
   Comunicados publicados por el club en su cuenta oficial @Coria_CF.
---------------------------------------------------------------------- */

export const NEWS = [
  {
    id: "abonos-2627",
    tag: "Club",
    date: "Julio de 2026",
    title: 'Campaña de abonos 26/27: «Contigo volveremos»',
    text: "El Coria CF lanza su campaña de abonos con el lema «Contigo volveremos». El objetivo declarado por el club es lograr el regreso a Tercera Federación contando con el apoyo de la afición.",
    image: IMG.fans1,
    source: "Cuenta oficial @Coria_CF",
  },
  {
    id: "carlos-rojas",
    tag: "Fichajes",
    date: "21 de julio de 2026",
    title: "Carlos Rojas, nuevo jugador del Coria CF",
    text: "El club se hace con los servicios de Carlos Rojas, un joven mediocentro ofensivo que destaca por su calidad, su posicionamiento táctico y su despliegue físico.",
    image: IMG.action1,
    source: "Cuenta oficial @Coria_CF",
  },
  {
    id: "david-gil",
    tag: "Fichajes",
    date: "17 de julio de 2026",
    title: "David Gil refuerza la defensa ribereña",
    text: "Central onubense con experiencia tanto en Tercera como en División de Honor, formado en la cantera del C.D. Siempre Alegres.",
    image: IMG.action2,
    source: "Cuenta oficial @Coria_CF",
  },
  {
    id: "pretemporada",
    tag: "Primer equipo",
    date: "3 de agosto de 2026",
    title: "Arranque de la pretemporada 26/27 en el Guadalquivir",
    text: "La escuadra de Dioni Arroyo inició la pretemporada a las 20:30 en el Estadio Guadalquivir, en el primer entrenamiento de la nueva temporada.",
    image: IMG.training1,
    source: "Cuenta oficial @Coria_CF",
  },
];

/* ------------------------------ Historia ------------------------------ */

export const TIMELINE = [
  {
    year: "1923",
    title: "Fundación del Coria C.F.",
    text: "El club nace el 25 de marzo de 1923 y disputa ese mismo día su primer partido, con victoria ante el Fabié de Sevilla.",
  },
  {
    year: "1925",
    title: "El club se federa",
    text: "Debuta en las divisiones regionales con una directiva unificada y Florencio Peña Luna como primer presidente.",
  },
  {
    year: "1931",
    title: "Campeón de la Liga Regional Andaluza",
    text: "Primer título del club, que se consolida como cantera de jóvenes talentos para Sevilla F.C. y Real Betis en los años cuarenta.",
  },
  {
    year: "1943",
    title: "Primer ascenso a Tercera División",
    text: "El Coria alcanza por primera vez la categoría nacional, donde permanece hasta 1948.",
  },
  {
    year: "1955–1968",
    title: "Trece temporadas en Tercera",
    text: "Nueva etapa en la categoría nacional, oscilando en las posiciones altas de la tabla.",
  },
  {
    year: "1980",
    title: "Regreso a Tercera División",
    text: "El club vuelve a la categoría y se mantiene en ella de forma ininterrumpida durante dos décadas.",
  },
  {
    year: "1999",
    title: "Ascenso a Segunda División B",
    text: "Tras finalizar tercero en la liga regular, el Coria gana su grupo de promoción ante Tomelloso, Mérida Promesas y Polideportivo Ejido, y asciende por primera vez al bronce del fútbol español.",
  },
  {
    year: "2000-01",
    title: "Mejor clasificación histórica",
    text: "Sexto puesto en Segunda División B, el mejor resultado del club en toda su historia.",
  },
  {
    year: "2013",
    title: "Copa RFEF andaluza",
    text: "El club conquista la fase autonómica de Andalucía Occidental y Ceuta de la Copa Federación en la temporada 2012-13.",
  },
  {
    year: "2022",
    title: "Campeón de la División de Honor Andaluza",
    text: "El Coria se proclama campeón en la temporada 2021-22 y regresa a la Tercera Federación.",
  },
  {
    year: "2023",
    title: "Centenario del club",
    text: "El Coria C.F. y el Estadio Guadalquivir celebran sus cien años con un programa de actos centrado en el fútbol base.",
  },
  {
    year: "2026",
    title: "Descenso a División de Honor",
    text: "Tras finalizar 18º en el Grupo X de Tercera Federación en la temporada 2025-26, el club desciende y afronta el curso 2026/27 en División de Honor Andaluza.",
  },
];

export const HONOURS = [
  { title: "División de Honor Andaluza", detail: "2021-22" },
  { title: "Copa RFEF · Fase Andalucía Occidental y Ceuta", detail: "2012-13" },
  { title: "Liga Regional Andaluza", detail: "1931" },
];

export const CLUB_RECORDS = [
  { k: "Temporadas en 2ª División", v: "0" },
  { k: "Temporadas en 2ª División B", v: "3" },
  { k: "Temporadas en 3ª División", v: "43" },
  { k: "Mejor puesto en liga", v: "6º (2ªB, 2000-01)" },
  { k: "Peor puesto en liga", v: "19º (3ª, 2005-06)" },
];

/** Trayectoria del primer equipo por temporadas. Fuente: BeSoccer. */
export const PAST_SEASONS = [
  { season: "2025-26", comp: "Tercera Federación · Grupo X", pj: 34, pts: 21, pos: "18º" },
  { season: "2024-25", comp: "Tercera Federación · Grupo X", pj: 34, pts: 36, pos: "14º" },
  { season: "2023-24", comp: "Tercera Federación · Grupo X", pj: 34, pts: 36, pos: "15º" },
  { season: "2022-23", comp: "Tercera Federación · Grupo X", pj: 30, pts: 24, pos: "15º" },
  { season: "2021-22", comp: "División de Honor Andaluza", pj: 38, pts: 75, pos: "Campeón" },
  { season: "2020-21", comp: "Tercera División", pj: 20, pts: 15, pos: "16º" },
  { season: "2019-20", comp: "Tercera División", pj: 27, pts: 36, pos: "10º" },
];
export const PAST_SEASONS_SOURCE: SourceId = SRC.BESOCCER;

/* -------- Balance detallado de la última temporada (BeSoccer) -------- */
export const LAST_SEASON_DETAIL = {
  season: "2025-26",
  comp: "Tercera Federación · Grupo X",
  pj: 34,
  pg: 4,
  pe: 9,
  pp: 21,
  gf: 24,
  gc: 59,
  pts: 21,
  pos: "18º",
  source: SRC.BESOCCER as SourceId,
};

/* --------- Destacados individuales de la temporada 2026/27 -----------
   Calculados a partir de las estadísticas reales de la plantilla.
--------------------------------------------------------------------- */

const byGoals = [...PLAYERS].sort((a, b) => (b.goals ?? 0) - (a.goals ?? 0));
const byMinutes = [...PLAYERS].sort((a, b) => (b.min ?? 0) - (a.min ?? 0));
const byCards = [...PLAYERS].sort((a, b) => (b.yellow ?? 0) - (a.yellow ?? 0));

export const SQUAD_HIGHLIGHTS = {
  season: "2026/27",
  comp: "División de Honor Andaluza · Grupo I",
  topScorer: {
    name: `${byGoals[0].first} ${byGoals[0].last}`.trim(),
    detail: `${byGoals[0].goals} goles`,
  },
  mostMinutes: {
    name: `${byMinutes[0].first} ${byMinutes[0].last}`.trim(),
    detail: `${byMinutes[0].min} minutos`,
  },
  mostBooked: {
    name: `${byCards[0].first} ${byCards[0].last}`.trim(),
    detail: `${byCards[0].yellow} tarjetas amarillas`,
  },
  squadSize: PLAYERS.length,
  source: SRC.LAPREFERENTE as SourceId,
};



/* ------------------------------- Galería -------------------------------
   Imágenes genéricas de recurso: no son fotografías del Coria C.F.
---------------------------------------------------------------------- */

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
  title: "Himno del Coria C.F.",
  subtitle: "Letra y audio no publicados en fuentes consultables",
  duration: NA,
  lyrics: [] as string[],
};

export const FAN_CAMPAIGN = {
  title: "Campaña de abonos 2026/27",
  slogan: "Contigo volveremos",
  text: "El club afronta la temporada con el objetivo declarado de regresar a Tercera Federación y apela al apoyo de la afición ribereña. Información y altas en las oficinas del Estadio Guadalquivir.",
  source: "Cuenta oficial @Coria_CF",
};

export const PENAS: { name: string; since: number; members: number }[] = [];

export const FAN_MOMENTS: { title: string; text: string; img: string }[] = [];

/* -------------------------------- Estadio ------------------------------ */

export const STADIUM_FACTS = [
  { k: "Inauguración", v: "1923" },
  { k: "Aforo", v: "5.000" },
  { k: "Superficie", v: "Césped natural" },
  { k: "Medidas", v: "101 × 67 m" },
  { k: "Titularidad", v: "Municipal" },
  { k: "Dirección", v: "C/ Carrascalejos, 16" },
];

export const STADIUM_AREAS = [
  {
    name: "Ubicación",
    desc: "A escasos metros de la orilla del río Guadalquivir, en el sureste de Coria del Río.",
  },
  {
    name: "Tribuna principal",
    desc: "Levantada a mediados de los años ochenta, se extiende unos 55 metros sobre la línea de medio campo.",
  },
  {
    name: "Antigüedad",
    desc: "En uso desde marzo de 1923, es uno de los estadios de fútbol más antiguos de España que siguen en activo.",
  },
  {
    name: "Visitas ilustres",
    desc: "La cercanía con Sevilla ha propiciado visitas de pretemporada de Sevilla F.C. y Real Betis, además de la Juventus en 2009.",
  },
];

export const HOW_TO_ARRIVE = [
  { mode: "Dirección", detail: "C/ Carrascalejos, 16 · 41100 Coria del Río (Sevilla)" },
  { mode: "Teléfono", detail: "655 02 66 21" },
  { mode: "Web oficial", detail: "coriacf.es" },
];

/* ------------------------------ Categorías ----------------------------- */

export type Scorer = { name: string; goals: number; assists: number };
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
  matches: Match[];
  standings: Row[];
  totals: Totals;
  form: ("V" | "E" | "D")[];
  scorers: Scorer[];
};

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
  matches: MATCHES,
  standings: STANDINGS,
  totals: TEAM_SEASON,
  form: FORM,
  scorers: [],
};

/** Equipo juvenil: compite en Liga Nacional Juvenil. Datos sin verificar. */
const JUVENIL: Category = {
  id: "juvenil",
  name: "Coria C.F. Juvenil",
  short: "Juvenil",
  icon: "🎓",
  competition: "Liga Nacional Juvenil · Grupo IV",
  coach: NA,
  venue: CLUB.stadium,
  squadSize: null,
  matches: [],
  standings: [],
  totals: {
    ...TEAM_SEASON,
    pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0, cleanSheets: 0,
    avgFor: 0, avgAgainst: 0,
  },
  form: [],
  scorers: [],
};

export const CATEGORIES: Category[] = [FIRST_TEAM, JUVENIL];
