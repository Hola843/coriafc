/* ==================================================================
   Crea las tablas del CMS en Supabase.

   Uso:  node scripts/crear-tablas.mjs

   Lee las variables del archivo .env y ejecuta el SQL de
   SUPABASE-CMS.sql mediante la API de Supabase.

   Requiere la clave service_role SOLO en este script local.
   Nunca debe usarse en el frontend ni subirse al repositorio.
   ================================================================== */

import { readFileSync } from "node:fs";

/* ------------------------- Lee el .env ------------------------------ */
function loadEnv() {
  try {
    const raw = readFileSync(new URL("../.env", import.meta.url), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, "");
    }
  } catch {}
}
loadEnv();

const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "\n✗ Faltan credenciales.\n" +
      "  Añade a tu .env:\n" +
      "    VITE_SUPABASE_URL=https://xxxx.supabase.co\n" +
      "    SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...\n\n" +
      "  La service_role está en Supabase → Project Settings → API.\n" +
      "  NO la subas al repositorio ni la uses en el frontend.\n",
  );
  process.exit(1);
}

/* --------------------------- SQL ---------------------------------- */
const SQL = readFileSync(new URL("../SUPABASE-CMS.sql", import.meta.url), "utf8");

const statements = SQL.split("\n")
  .filter((l) => !l.trim().startsWith("--"))
  .join("\n")
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

console.log(`\n→ Ejecutando ${statements.length} sentencias en ${url}\n`);

for (const [i, stmt] of statements.entries()) {
  const label = stmt.split("\n")[0].slice(0, 56).replace(/\s+/g, " ");
  const res = await fetch(`${url}/rest/v1/rpc/exec_sql`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql: stmt }),
  });
  if (!res.ok) {
    console.error(`  ✗ [${i + 1}] ${label}`);
    console.error(`    ${(await res.text()).slice(0, 160)}`);
    console.error(
      "\n✗ No se pudo ejecutar automáticamente.\n" +
        "  Copia SUPABASE-CMS.sql en Supabase → SQL Editor → Run.\n",
    );
    process.exit(1);
  }
  console.log(`  ✓ [${i + 1}] ${label}`);
}

console.log("\n✓ Tablas creadas. El Admin Site ya sincroniza con Supabase.\n");
