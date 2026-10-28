# VA HOME by VibraAlto

Plataforma inmobiliaria de VA HOME (Vibra SpA) · **vahome.vibraalto.cl**
_Tu espacio. Tu próximo paso._

## Stack
Next.js 14 (App Router, export estático) · TypeScript · Tailwind CSS · Framer Motion · Firebase Hosting.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # genera out/
firebase deploy --only hosting
```
`firebase.json` apunta al sitio `va-home-d3708` del proyecto `va-home-d3708` (ver `.firebaserc`). El dominio `vahome.vibraalto.cl` se conecta en Firebase Hosting → "Agregar un dominio personalizado" y en Cloudflare (CNAME `vahome` → `va-home-d3708.web.app`, solo DNS).

## Estructura
- `src/data/properties.ts` — registro de propiedades. `verified: true` solo para datos confirmados; las `DEMO-*` se muestran marcadas y no se indexan.
- `src/lib/site.ts` — datos de contacto, empresa y mensajes de WhatsApp contextuales.
- `src/components/` — Header, Footer, Hero, buscador, tarjetas, monograma VA, retrato.
- `src/app/` — inicio, `/propiedades`, `/propiedades/[slug]`, `/propietarios`, `/leon-canales`, `/contacto`, `/legal/*`.

## Estado por fase
| Fase | Estado |
|---|---|
| 1. Marca y sistema de diseño | ✅ Colores, tipografías (Anton + Inter), monograma VA, componentes |
| 2. Frontend premium | ✅ Inicio cinematográfico, catálogo con filtros, ficha con galería/mapa/JSON-LD, propietarios, León, contacto, legales |
| 3. Plataforma funcional | ⏳ Favoritos, comparador, visitas en Firestore, subida de fotos |
| 4. Operaciones (admin, leads, visitas) | ⏳ |
| 5. VA HOME AI | ⏳ |
| 6. Producción | ⏳ |

## Pendientes antes de publicar
- [ ] Foto oficial autorizada de León → `public/leon/retrato.jpg` y pasar `src` a `<Portrait />`.
- [ ] Superficie (m²) del Local 170.
- [ ] Reemplazar demos por propiedades verificadas.
- [ ] Revisión legal de `/legal/*` (marcados como borrador).
- [ ] Confirmar tratamiento de IVA de la comisión.
- [ ] Formulario de propietarios: hoy envía por WhatsApp/correo; en fase 3 guardará en Firestore.
