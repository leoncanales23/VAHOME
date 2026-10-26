'use client';
import { useState } from 'react';
import { SITE, waLink } from '@/lib/site';
import { typeLabel } from '@/data/properties';

// Fase 2: el formulario arma un mensaje y lo envía por WhatsApp o correo (destino real).
// Fase 3 (pendiente): guardar en Firestore + subida de fotos a Firebase Storage.
export default function OwnerForm() {
  const [f, setF] = useState({ nombre: '', telefono: '', tipo: 'casa', comuna: '', precio: '', descripcion: '', canal: 'whatsapp' });
  const [err, setErr] = useState('');
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  const msg = () => `Hola León, quiero publicar mi propiedad en VA HOME.\n\nNombre: ${f.nombre}\nTeléfono: ${f.telefono}\nTipo: ${typeLabel[f.tipo as keyof typeof typeLabel]}\nComuna: ${f.comuna}\nArriendo estimado: ${f.precio || 'por definir'}\nDescripción: ${f.descripcion}\nContacto preferido: ${f.canal}\n\n(Te envío las fotos por este medio.)`;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.nombre.trim() || f.telefono.replace(/\D/g, '').length < 8 || !f.comuna.trim()) { setErr('Completa nombre, un teléfono válido y la comuna.'); return; }
    setErr('');
    const url = f.canal === 'correo'
      ? `mailto:${SITE.email}?subject=${encodeURIComponent('Publicar propiedad en VA HOME')}&body=${encodeURIComponent(msg())}`
      : waLink(msg());
    window.open(url, '_blank', 'noopener');
  };
  return (
    <form onSubmit={submit} noValidate className="card grid gap-4 p-6 md:grid-cols-2">
      <label className="text-sm">Nombre completo<input className="field mt-1" value={f.nombre} onChange={set('nombre')} autoComplete="name" required /></label>
      <label className="text-sm">Teléfono<input className="field mt-1" value={f.telefono} onChange={set('telefono')} inputMode="tel" autoComplete="tel" placeholder="+56 9 ..." required /></label>
      <label className="text-sm">Tipo de propiedad
        <select className="field mt-1" value={f.tipo} onChange={set('tipo')}>{Object.entries(typeLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
      </label>
      <label className="text-sm">Comuna<input className="field mt-1" value={f.comuna} onChange={set('comuna')} required /></label>
      <label className="text-sm">Arriendo estimado (opcional)<input className="field mt-1" value={f.precio} onChange={set('precio')} placeholder="$" /></label>
      <label className="text-sm">Contacto preferido
        <select className="field mt-1" value={f.canal} onChange={set('canal')}><option value="whatsapp">WhatsApp</option><option value="correo">Correo</option></select>
      </label>
      <label className="text-sm md:col-span-2">Descripción<textarea className="field mt-1 min-h-28" value={f.descripcion} onChange={set('descripcion')} placeholder="Metros, dormitorios, estado, disponibilidad..." /></label>
      <p className="text-xs text-steel md:col-span-2">Las fotos se envían en la conversación de WhatsApp o adjuntas al correo. Tus datos se usan solo para contactarte por esta solicitud (ver <a href="/legal/privacidad/" className="underline">privacidad</a>).</p>
      {err && <p role="alert" className="text-sm text-red-300 md:col-span-2">{err}</p>}
      <button className="btn-gold md:col-span-2">Enviar solicitud</button>
    </form>
  );
}
