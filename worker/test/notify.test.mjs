import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildNotification } from '../src/notify.js';

const visita = { kind: 'visita', id: 'AbCdEf1234567890', data: { nombre: 'Ana', telefono: '+56 9 1234 5678', title: 'Local 170', ref: 'VAH-001', fecha: '2026-11-02', franja: 'Mañana', mensaje: 'Hola' } };

test('arma el aviso de una visita', () => {
  const m = buildNotification(visita);
  assert.match(m.subject, /VAH-001 · Ana/);
  assert.match(m.html, /wa\.me\/56912345678/);
});
test('escapa HTML del formulario', () => {
  const m = buildNotification({ ...visita, data: { ...visita.data, mensaje: '<script>x</script>' } });
  assert.ok(!m.html.includes('<script>'));
});
test('rechaza tipo, id o teléfono inválidos', () => {
  assert.throws(() => buildNotification({ ...visita, kind: 'otro' }), /tipo/);
  assert.throws(() => buildNotification({ ...visita, id: '../x' }), /id/);
  assert.throws(() => buildNotification({ ...visita, data: { nombre: 'Ana', telefono: '123' } }), /incompletos/);
});
test('arma el aviso de un propietario', () => {
  const m = buildNotification({ kind: 'propietario', id: 'AbCdEf1234567890', data: { nombre: 'Luis', telefono: '987654321', tipo: 'casa', comuna: 'Buin', canal: 'whatsapp' } });
  assert.match(m.subject, /Buin · Luis/);
});
