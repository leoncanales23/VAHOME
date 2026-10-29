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

Cada merge a `main` publica solo con `.github/workflows/deploy.yml` (también se puede lanzar a mano en Actions → *Deploy Firebase Hosting* → *Run workflow*). Necesita el secret `FIREBASE_SERVICE_ACCOUNT` en GitHub con el JSON de una cuenta de servicio del proyecto `va-home-d3708` con rol *Firebase Hosting Admin*.

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
- [x] Foto de León retocada → `public/leon/leon-canales-costanera-v13.jpg` (portada y /hola/) y `leon-canales-retrato-v13.jpg` (4:5, `<Portrait />`).
- [ ] Superficie (m²) del Local 170.
- [ ] Reemplazar demos por propiedades verificadas.
- [ ] Revisión legal de `/legal/*` (marcados como borrador).
- [ ] Confirmar tratamiento de IVA de la comisión.
- [ ] Formulario de propietarios: hoy envía por WhatsApp/correo; en fase 3 guardará en Firestore.

## Fase 1 · Plataforma operativa

Inventario en Firestore, solicitudes registradas, panel `/admin`, métricas de eventos reales y avisos por correo.

| Pieza | Dónde |
| --- | --- |
| Reglas de seguridad e índices | `firestore.rules`, `firestore.indexes.json` (se publican en cada deploy) |
| Inventario publicado → sitio | `scripts/fetch-inventory.mjs` escribe `src/data/inventory.json` en el build; si está vacío se usa `seedProperties` |
| Solicitudes | Colecciones `visits` y `owners` (con consentimiento); eventos anónimos en `events` |
| Panel | `/admin/` (Google + documento en `/admins/<correo>`); toda acción queda en `auditLog` y cada edición de propiedad en `properties/<slug>/history` |
| Avisos y publicación | `worker/` (Cloudflare Workers Free): `POST /notify` (Resend) y `POST /rebuild` (dispara este workflow) |
| Pruebas | `npm test` (verificación de tokens, avisos, conversión de inventario) |

### Configuración pendiente (una vez)

1. **Firebase Auth:** Consola → Authentication → Sign-in method → habilitar **Google**; en *Authorized domains* agregar `vahome.vibraalto.cl`.
2. **Administradores:** Firestore → colección `admins` → documento con ID = el correo (p. ej. `leon_canales@vibraalto.cl`), con cualquier campo (`rol: "admin"`).
3. **Cuenta de servicio del deploy:** si el paso «Publicar reglas e índices» falla con 403, agregarle los roles *Administrador de reglas de Firebase* y *Administrador de índices de Cloud Datastore*.
4. **Worker de Cloudflare** (desde `worker/`):
   ```bash
   npx wrangler login
   npx wrangler secret put RESEND_API_KEY   # cuenta gratuita en resend.com, dominio vibraalto.cl verificado
   npx wrangler secret put GITHUB_TOKEN     # token fino del repo VAHOME con permiso Actions: read & write
   npx wrangler secret put ADMIN_EMAILS     # correos que pueden publicar, separados por coma
   npx wrangler deploy
   ```
   Luego GitHub → Settings → Secrets and variables → Actions → *Variables* → `WORKER_URL` = la URL que entrega `wrangler deploy`.
5. **Inventario:** entrar a `/admin/` → Inventario → «Importar inventario del sitio» → «Publicar cambios en la web».
