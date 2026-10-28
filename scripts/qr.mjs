// Genera los QR de los carteles en public/qr/ (SVG para imprenta y PNG de 2000 px).
// Uso: node scripts/qr.mjs [url-base]   (por defecto el dominio de SITE.url)
import QRCode from 'qrcode';
import { mkdirSync } from 'node:fs';

const base = (process.argv[2] ?? 'https://vahome.vibraalto.cl').replace(/\/$/, '');
const targets = { hola: '/hola/', 'hola-vah-001': '/hola/vah-001/' };
const opts = { errorCorrectionLevel: 'H', margin: 4, color: { dark: '#0B0D10', light: '#FFFFFF' } };

mkdirSync('public/qr', { recursive: true });
for (const [name, path] of Object.entries(targets)) {
  const url = base + path;
  await QRCode.toFile(`public/qr/${name}.svg`, url, { ...opts, type: 'svg' });
  await QRCode.toFile(`public/qr/${name}.png`, url, { ...opts, width: 2000 });
  console.log(`${name} → ${url}`);
}
