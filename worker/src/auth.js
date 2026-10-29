// Verifica un ID token de Firebase Auth (JWT RS256) con WebCrypto, sin dependencias.
// https://firebase.google.com/docs/auth/admin/verify-id-tokens#verify_id_tokens_using_a_third-party_jwt_library
export const JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

const b64url = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=')), (c) => c.charCodeAt(0));
const json = (s) => JSON.parse(new TextDecoder().decode(b64url(s)));

export async function fetchKeys() {
  const res = await fetch(JWKS_URL, { cf: { cacheTtl: 3600 } });
  if (!res.ok) throw new Error(`jwks ${res.status}`);
  return (await res.json()).keys;
}

export async function verifyIdToken(token, { projectId, getKeys = fetchKeys, now = Date.now() / 1000 }) {
  const parts = String(token).split('.');
  if (parts.length !== 3) throw new Error('token mal formado');
  const [h, p, sig] = parts;
  const header = json(h), payload = json(p);
  if (header.alg !== 'RS256') throw new Error('algoritmo no permitido');
  const jwk = (await getKeys()).find((k) => k.kid === header.kid);
  if (!jwk) throw new Error('clave desconocida');
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64url(sig), new TextEncoder().encode(`${h}.${p}`));
  if (!ok) throw new Error('firma inválida');
  if (payload.aud !== projectId || payload.iss !== `https://securetoken.google.com/${projectId}`) throw new Error('proyecto incorrecto');
  if (!(payload.exp > now) || !(payload.iat <= now + 60) || !payload.sub) throw new Error('token vencido o inválido');
  if (!payload.email || payload.email_verified !== true) throw new Error('correo no verificado');
  return payload;
}
