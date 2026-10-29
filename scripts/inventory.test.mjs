import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fromValue } from './fetch-inventory.mjs';

test('convierte valores de Firestore REST a JSON', () => {
  const v = { mapValue: { fields: {
    ref: { stringValue: 'VAH-001' }, price: { integerValue: '960000' }, verified: { booleanValue: true },
    images: { arrayValue: { values: [{ stringValue: '/a.jpg' }] } }, dimensions: { mapValue: { fields: { widthM: { doubleValue: 2.3 } } } },
  } } };
  assert.deepEqual(fromValue(v), { ref: 'VAH-001', price: 960000, verified: true, images: ['/a.jpg'], dimensions: { widthM: 2.3 } });
});
