// Arma el aviso por correo de una solicitud nueva a partir de datos del formulario (validados aquí).
const clip = (v, n) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, n);
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function buildNotification(body) {
  const kind = body?.kind;
  if (kind !== 'visita' && kind !== 'propietario') throw new Error('tipo inválido');
  if (!/^[A-Za-z0-9]{10,40}$/.test(String(body.id ?? ''))) throw new Error('id inválido');
  const d = body.data ?? {};
  const nombre = clip(d.nombre, 120), telefono = clip(d.telefono, 30);
  if (!nombre || telefono.replace(/\D/g, '').length < 8) throw new Error('datos incompletos');
  const rows = kind === 'visita'
    ? [['Propiedad', `${clip(d.title, 200)} (${clip(d.ref, 20)})`], ['Fecha', clip(d.fecha, 10) || 'a convenir'], ['Horario', clip(d.franja, 40)], ['Mensaje', clip(d.mensaje, 500)]]
    : [['Tipo', clip(d.tipo, 20)], ['Comuna', clip(d.comuna, 80)], ['Precio estimado', clip(d.precio, 30)], ['Contacto preferido', clip(d.canal, 10)], ['Descripción', clip(d.descripcion, 2000)]];
  const all = [['Nombre', nombre], ['Teléfono', telefono], ...rows].filter(([, v]) => v);
  const subject = kind === 'visita' ? `Nueva solicitud de visita · ${clip(d.ref, 20)} · ${nombre}` : `Nuevo propietario · ${clip(d.comuna, 80)} · ${nombre}`;
  const wa = `https://wa.me/${telefono.replace(/\D/g, '')}`;
  const html = `<p>${kind === 'visita' ? 'Nueva solicitud de visita' : 'Nueva captación de propietario'} desde VAHOME.</p>
<table>${all.map(([k, v]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(v)}</td></tr>`).join('')}</table>
<p><a href="${wa}">Responder por WhatsApp</a> · <a href="https://vahome.vibraalto.cl/admin/">Abrir el panel</a></p>
<p style="color:#888">Solicitud ${esc(body.id)}</p>`;
  const text = `${all.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nWhatsApp: ${wa}\nPanel: https://vahome.vibraalto.cl/admin/`;
  return { subject, html, text };
}
