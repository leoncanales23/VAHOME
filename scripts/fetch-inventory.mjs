// Descarga las propiedades publicadas en Firestore y las deja en src/data/inventory.json antes del build.
// Usa la API REST pública (las reglas solo dejan leer status == 'publicada'). Si falla, el sitio usa el inventario semilla.
import { writeFileSync } from 'node:fs';

const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const out = new URL('../src/data/inventory.json', import.meta.url);

// Convierte un Value de Firestore REST a JSON plano.
export function fromValue(v) {
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('timestampValue' in v) return v.timestampValue;
  if ('nullValue' in v) return null;
  if ('arrayValue' in v) return (v.arrayValue.values ?? []).map(fromValue);
  if ('mapValue' in v) return Object.fromEntries(Object.entries(v.mapValue.fields ?? {}).map(([k, x]) => [k, fromValue(x)]));
  return null;
}

async function main() {
  if (!project || !key) { console.log('[inventario] sin configuración de Firebase: se usa el inventario semilla'); return; }
  const res = await fetch(`https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents:runQuery?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ structuredQuery: {
      from: [{ collectionId: 'properties' }],
      where: { fieldFilter: { field: { fieldPath: 'status' }, op: 'EQUAL', value: { stringValue: 'publicada' } } },
    } }),
  });
  if (!res.ok) { console.warn(`[inventario] Firestore respondió ${res.status}: se usa el inventario semilla`); return; }
  const rows = (await res.json()).filter((r) => r.document).map((r) => fromValue({ mapValue: { fields: r.document.fields } }));
  rows.sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || String(a.ref).localeCompare(String(b.ref)));
  writeFileSync(out, JSON.stringify(rows, null, 2) + '\n');
  console.log(`[inventario] ${rows.length} propiedad(es) publicada(s) desde Firestore`);
}

if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => console.warn('[inventario] error:', e.message));
