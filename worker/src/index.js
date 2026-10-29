// Worker de VAHOME (Cloudflare, plan Free):
//   POST /notify  → aviso por correo a León de cada solicitud nueva (vía Resend)
//   POST /rebuild → el panel /admin pide publicar el inventario: dispara el workflow de GitHub
// Secretos (wrangler secret put): RESEND_API_KEY, GITHUB_TOKEN, ADMIN_EMAILS. Variables en wrangler.toml.
import { verifyIdToken } from './auth.js';
import { buildNotification } from './notify.js';

const hits = new Map(); // límite simple por IP y por instancia (complementa las reglas de Firestore)
function limited(ip, max = 10, windowMs = 60_000) {
  const now = Date.now(), list = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  list.push(now); hits.set(ip, list);
  return list.length > max;
}

export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') ?? '';
    const allowed = env.ALLOWED_ORIGINS.split(',').map((s) => s.trim());
    const cors = { 'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : allowed[0], 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', Vary: 'Origin' };
    const reply = (status, body) => new Response(body, { status, headers: { ...cors, 'Content-Type': 'text/plain; charset=utf-8' } });
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (req.method !== 'POST') return reply(405, 'método no permitido');
    if (!allowed.includes(origin)) return reply(403, 'origen no permitido');
    const path = new URL(req.url).pathname;

    if (path === '/notify') {
      if (limited(req.headers.get('CF-Connecting-IP') ?? '?')) return reply(429, 'demasiadas solicitudes');
      let mail;
      try { mail = buildNotification(await req.json()); } catch (e) { return reply(400, e.message); }
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: env.NOTIFY_FROM, to: env.NOTIFY_TO.split(','), ...mail }),
      });
      return res.ok ? reply(200, 'ok') : reply(502, `resend ${res.status}`);
    }

    if (path === '/rebuild') {
      let user;
      try { user = await verifyIdToken((req.headers.get('Authorization') ?? '').replace(/^Bearer /, ''), { projectId: env.FIREBASE_PROJECT_ID }); }
      catch (e) { return reply(401, `no autorizado: ${e.message}`); }
      if (!env.ADMIN_EMAILS.split(',').map((s) => s.trim().toLowerCase()).includes(user.email.toLowerCase())) return reply(403, 'correo sin permiso para publicar');
      const res = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/actions/workflows/deploy.yml/dispatches`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.GITHUB_TOKEN}`, Accept: 'application/vnd.github+json', 'User-Agent': 'vahome-worker', 'X-GitHub-Api-Version': '2022-11-28' },
        body: JSON.stringify({ ref: 'main' }),
      });
      return res.status === 204 ? reply(200, `publicación iniciada por ${user.email}`) : reply(502, `github ${res.status}`);
    }

    return reply(404, 'no encontrado');
  },
};
