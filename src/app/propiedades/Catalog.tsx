'use client';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PropertyCard from '@/components/PropertyCard';
import { properties, typeLabel } from '@/data/properties';

export default function Catalog() {
  const sp = useSearchParams();
  const [op, setOp] = useState(sp.get('op') ?? 'arriendo');
  const [tipo, setTipo] = useState(sp.get('tipo') ?? '');
  const [comuna, setComuna] = useState(sp.get('comuna') ?? '');
  const [max, setMax] = useState('');
  const [sort, setSort] = useState('destacadas');
  const [showDemo, setShowDemo] = useState(true);
  const comunas = Array.from(new Set(properties.map((p) => p.commune))).sort();

  const list = useMemo(() => {
    let r = properties.filter((p) => p.operation === op && (!tipo || p.type === tipo) && (!comuna || p.commune === comuna)
      && (!max || p.price <= Number(max)) && (showDemo || p.verified));
    if (sort === 'precio-asc') r = [...r].sort((a, b) => a.price - b.price);
    else if (sort === 'precio-desc') r = [...r].sort((a, b) => b.price - a.price);
    else r = [...r].sort((a, b) => Number(b.verified) - Number(a.verified) || Number(!!b.featured) - Number(!!a.featured));
    return r;
  }, [op, tipo, comuna, max, sort, showDemo]);

  return (
    <>
      <div className="card mt-10 grid gap-3 p-4 md:grid-cols-6">
        <select aria-label="Operación" className="field" value={op} onChange={(e) => setOp(e.target.value)}>
          <option value="arriendo">Arriendo</option><option value="venta">Venta</option>
        </select>
        <select aria-label="Tipo" className="field" value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="">Todo tipo</option>
          {Object.entries(typeLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select aria-label="Comuna" className="field" value={comuna} onChange={(e) => setComuna(e.target.value)}>
          <option value="">Todas las comunas</option>
          {comunas.map((c) => <option key={c}>{c}</option>)}
        </select>
        <input aria-label="Precio máximo" className="field" inputMode="numeric" placeholder="Precio máx. ($)" value={max} onChange={(e) => setMax(e.target.value.replace(/\D/g, ''))} />
        <select aria-label="Ordenar" className="field" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="destacadas">Destacadas</option><option value="precio-asc">Menor precio</option><option value="precio-desc">Mayor precio</option>
        </select>
        <label className="flex items-center gap-2 px-2 text-sm text-ivory/80">
          <input type="checkbox" checked={showDemo} onChange={(e) => setShowDemo(e.target.checked)} className="accent-[#D9B26A]" /> Mostrar demos
        </label>
      </div>
      <p className="mt-6 text-sm text-steel" aria-live="polite">{list.length} propiedad{list.length !== 1 ? 'es' : ''}</p>
      <motion.div layout className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((p) => (
            <motion.div key={p.slug} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.35 }}>
              <PropertyCard p={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {list.length === 0 && <p className="mt-10 text-ivory/70">No hay propiedades con esos filtros. Escríbenos y te avisamos cuando aparezca una.</p>}
    </>
  );
}
