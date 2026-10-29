import { test } from 'node:test';
import assert from 'node:assert/strict';
import { verifyIdToken } from '../src/auth.js';

const enc = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const { publicKey, privateKey } = await crypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify']);
const jwk = { ...(await crypto.subtle.exportKey('jwk', publicKey)), kid: 'k1' };
const getKeys = async () => [jwk];
const now = 1_800_000_000;
const base = { aud: 'va-home-d3708', iss: 'https://securetoken.google.com/va-home-d3708', sub: 'u1', iat: now - 10, exp: now + 3600, email: 'leon@example.com', email_verified: true };

async function sign(payload, header = { alg: 'RS256', kid: 'k1' }) {
  const data = `${enc(header)}.${enc(payload)}`;
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', privateKey, new TextEncoder().encode(data));
  return `${data}.${Buffer.from(sig).toString('base64url')}`;
}
const opts = { projectId: 'va-home-d3708', getKeys, now };

test('acepta un token válido', async () => {
  assert.equal((await verifyIdToken(await sign(base), opts)).email, 'leon@example.com');
});
test('rechaza otro proyecto', async () => {
  await assert.rejects(verifyIdToken(await sign({ ...base, aud: 'otro' }), opts), /proyecto/);
});
test('rechaza token vencido', async () => {
  await assert.rejects(verifyIdToken(await sign({ ...base, exp: now - 1 }), opts), /vencido/);
});
test('rechaza correo no verificado', async () => {
  await assert.rejects(verifyIdToken(await sign({ ...base, email_verified: false }), opts), /verificado/);
});
test('rechaza firma alterada', async () => {
  const t = await sign(base);
  const forged = `${t.split('.')[0]}.${enc({ ...base, email: 'otro@example.com' })}.${t.split('.')[2]}`;
  await assert.rejects(verifyIdToken(forged, opts), /firma/);
});
test('rechaza alg distinto de RS256', async () => {
  await assert.rejects(verifyIdToken(await sign(base, { alg: 'HS256', kid: 'k1' }), opts), /algoritmo/);
});
