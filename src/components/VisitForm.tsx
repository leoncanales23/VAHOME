'use client';
import { useState } from 'react';
import { firebaseReady, saveVisitRequest } from '@/lib/firebase';
import { SITE, waLink } from '@/lib/site';

const franjas = ['Mañana (9–13 h)', 'Tarde (14–18 h)', 'Indiferente'];
const today = () => new Date().toISOString().slice(0, 10);

export default function VisitForm({ slug, propRef, title }: { slug: string; propRef: string; title: string }) {
  const [f, setF] = useState({ nombre: '', telefono: '', fecha: '', franja: franjas[0], mensaje: '' });
  const [err, setErr] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  const wa = () => waLink(`Hola León, quiero coordinar una visita.\n\n${title} (${propRef})\nNombre: ${f.nombre}\nTeléfono: ${f.telefono}\nFecha: ${f.fecha || 'a convenir'} · ${f.franja}\n${f.mensaje}\n${SITE.url}/propiedades/${slug}/`);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.nombre.trim() || f.telefono.replace(/\D/g, '').length < 8) { setErr('Completa tu nombre y un teléfono válido.'); return; }
    if (f.fecha && f.fecha < today()) { setErr('Elige una fecha de hoy en adelante.'); return; }
    setErr('');
    if (!firebaseReady) { window.open(wa(), '_blank', 'noopener'); return; }
    setState('sending');
    try {
      await saveVisitRequest({ slug, ref: propRef, title, ...f, nombre: f.nombre.trim(), telefono: f.telefono.trim(), mensaje: f.mensaje.trim() });
      setState('sent');
    } catch {
      setState('idle');
      setErr('No pudimos registrar la solicitud. Reinténtalo o escríbenos por WhatsApp.');
    }
  };

  if (state === 'sent') {
    return (
      <div role="status" className="mt-6 rounded-xl border border-gold/40 bg-gold/10 p-4 text-sm">
        <p className="font-semibold text-gold">Solicitud recibida</p>
        <p className="mt-1 text-ivory/80">{SITE.advisor} te contactará para confirmar la visita. Si es urgente, <a href={wa()} target="_blank" rel="noopener" className="underline">escríbele por WhatsApp</a>.</p>
      </div>
    );
  }
  return (
    <form onSubmit={submit} noValidate className="mt-6 grid gap-3 border-t border-white/10 pt-6">
      <p className="text-xs uppercase tracking-wider text-steel">Solicitar visita</p>
      <label className="text-sm">Nombre<input className="field mt-1" value={f.nombre} onChange={set('nombre')} autoComplete="name" required /></label>
      <label className="text-sm">Teléfono<input className="field mt-1" value={f.telefono} onChange={set('telefono')} inputMode="tel" autoComplete="tel" placeholder="+56 9 ..." required /></label>
      <div className="grid gap-3">
        <label className="text-sm">Fecha<input type="date" min={today()} className="field mt-1" value={f.fecha} onChange={set('fecha')} /></label>
        <label className="text-sm">Horario<select className="field mt-1" value={f.franja} onChange={set('franja')}>{franjas.map((x) => <option key={x}>{x}</option>)}</select></label>
      </div>
      <label className="text-sm">Mensaje (opcional)<textarea className="field mt-1 min-h-20" maxLength={500} value={f.mensaje} onChange={set('mensaje')} /></label>
      {err && <p role="alert" className="text-sm text-red-300">{err}</p>}
      <button className="btn-gold" disabled={state === 'sending'}>{state === 'sending' ? 'Enviando…' : firebaseReady ? 'Solicitar visita' : 'Solicitar por WhatsApp'}</button>
      <p className="text-xs text-steel">Usamos tus datos solo para coordinar esta visita (<a href="/legal/privacidad/" className="underline">privacidad</a>).</p>
    </form>
  );
}
