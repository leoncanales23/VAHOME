'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { properties, typeLabel } from '@/data/properties';

export default function QuickSearch() {
  const router = useRouter();
  const [op, setOp] = useState('arriendo');
  const [tipo, setTipo] = useState('');
  const [comuna, setComuna] = useState('');
  const comunas = Array.from(new Set(properties.map((p) => p.commune))).sort();
  const go = (e: React.FormEvent) => {
    e.preventDefault();
    const q = new URLSearchParams({ op, ...(tipo && { tipo }), ...(comuna && { comuna }) });
    router.push(`/propiedades/?${q.toString()}`);
  };
  return (
    <form onSubmit={go} className="grid gap-3 rounded-2xl border border-white/10 bg-obsidian/70 p-3 backdrop-blur md:grid-cols-[auto_1fr_1fr_auto]" role="search" aria-label="Buscar propiedades">
      <div className="flex rounded-xl bg-charcoal p-1" role="radiogroup" aria-label="Operación">
        {['arriendo', 'venta'].map((o) => (
          <button type="button" key={o} role="radio" aria-checked={op === o} onClick={() => setOp(o)}
            className={`rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${op === o ? 'bg-gold text-obsidian' : 'text-steel hover:text-ivory'}`}>{o}</button>
        ))}
      </div>
      <label className="sr-only" htmlFor="qs-tipo">Tipo</label>
      <select id="qs-tipo" className="field" value={tipo} onChange={(e) => setTipo(e.target.value)}>
        <option value="">Todo tipo de propiedad</option>
        {Object.entries(typeLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
      <label className="sr-only" htmlFor="qs-comuna">Comuna</label>
      <select id="qs-comuna" className="field" value={comuna} onChange={(e) => setComuna(e.target.value)}>
        <option value="">Todas las comunas</option>
        {comunas.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <button className="btn-gold py-3">Buscar</button>
    </form>
  );
}
