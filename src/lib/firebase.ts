// Firebase se carga bajo demanda (solo al enviar un formulario o abrir /admin) para no pesar en el resto del sitio.
// Configura las claves en .env.local (ver .env.example). Si faltan, los formularios usan WhatsApp.
const cfg = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
const workerUrl = (process.env.NEXT_PUBLIC_WORKER_URL ?? '').replace(/\/$/, '');

export const firebaseReady = Boolean(cfg.apiKey && cfg.projectId && cfg.appId);
export const workerReady = Boolean(workerUrl);

export async function getFirebase() {
  if (!firebaseReady) throw new Error('firebase-no-configurado');
  const [app, fs] = await Promise.all([import('firebase/app'), import('firebase/firestore')]);
  const instance = app.getApps().length ? app.getApp() : app.initializeApp(cfg);
  return { app: instance, db: fs.getFirestore(instance), fs };
}

export interface VisitRequest {
  slug: string; ref: string; title: string;
  nombre: string; telefono: string; fecha: string; franja: string; mensaje: string;
}

export interface OwnerRequest {
  nombre: string; telefono: string; tipo: string; comuna: string; precio: string; descripcion: string;
  canal: 'whatsapp' | 'correo'; consentimiento: true;
}

async function save(collection: 'visits' | 'owners', data: object) {
  const { db, fs } = await getFirebase();
  const doc = await fs.addDoc(fs.collection(db, collection), { ...data, estado: 'nueva', createdAt: fs.serverTimestamp() });
  return doc.id;
}

export async function saveVisitRequest(v: VisitRequest) {
  const id = await save('visits', v);
  notify('visita', id, v);
  logEvent('formulario_visita', v.ref);
}

export async function saveOwnerRequest(o: OwnerRequest) {
  const id = await save('owners', o);
  notify('propietario', id, o);
  logEvent('formulario_propietario');
}

// Aviso por correo a León vía el Worker de Cloudflare. Si falla, la solicitud ya quedó guardada en el panel.
function notify(kind: 'visita' | 'propietario', id: string, data: object) {
  if (!workerReady) return;
  fetch(`${workerUrl}/notify`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, keepalive: true,
    body: JSON.stringify({ kind, id, data }),
  }).catch(() => {});
}

export type EventType = 'whatsapp' | 'llamada' | 'qr' | 'formulario_visita' | 'formulario_propietario' | 'contacto_guardado' | 'rubro';

// Evento de medición anónimo (sin datos personales) por la API REST, sin cargar el SDK.
export function logEvent(type: EventType, ref = '') {
  if (!firebaseReady || typeof window === 'undefined') return;
  const path = window.location.pathname.slice(0, 200);
  fetch(`https://firestore.googleapis.com/v1/projects/${cfg.projectId}/databases/(default)/documents/events?key=${cfg.apiKey}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, keepalive: true,
    body: JSON.stringify({ fields: {
      type: { stringValue: type }, path: { stringValue: path }, ref: { stringValue: ref.slice(0, 20) },
      ts: { timestampValue: new Date().toISOString() },
    } }),
  }).catch(() => {});
}
