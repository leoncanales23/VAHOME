// Firebase se carga bajo demanda (solo al enviar un formulario) para no pesar en el resto del sitio.
// Configura las claves en .env.local (ver .env.example). Si faltan, los formularios usan WhatsApp.
const cfg = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseReady = Boolean(cfg.apiKey && cfg.projectId && cfg.appId);

export interface VisitRequest {
  slug: string; ref: string; title: string;
  nombre: string; telefono: string; fecha: string; franja: string; mensaje: string;
}

export async function saveVisitRequest(v: VisitRequest) {
  if (!firebaseReady) throw new Error('firebase-no-configurado');
  const [{ getApp, getApps, initializeApp }, { addDoc, collection, getFirestore, serverTimestamp }] = await Promise.all([
    import('firebase/app'),
    import('firebase/firestore'),
  ]);
  const app = getApps().length ? getApp() : initializeApp(cfg);
  await addDoc(collection(getFirestore(app), 'visits'), { ...v, estado: 'nueva', createdAt: serverTimestamp() });
}
