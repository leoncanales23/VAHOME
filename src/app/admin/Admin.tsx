'use client';
import { useCallback, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { firebaseReady, getFirebase, workerReady } from '@/lib/firebase';
import { seedProperties, typeLabel, type Property } from '@/data/properties';
import { clp } from '@/lib/site';

// Panel interno de VAHOME: solicitudes, métricas de eventos reales e inventario.
// Acceso: Firebase Auth (Google) + documento /admins/<correo> en Firestore. Las reglas validan cada escritura.

type Lead = { id: string; kind: 'visita' | 'propietario'; nombre: string; telefono: string; detalle: string; estado: string; responsable?: string; notas?: string; createdAt?: Date };
type Tab = 'solicitudes' | 'metricas' | 'inventario';
const ESTADOS = ['nueva', 'contactada', 'visita agendada', 'cerrada', 'descartada'];
const EVENTOS: Record<string, string> = {
  qr: 'Escaneos de QR (/hola/)', whatsapp: 'Clics en WhatsApp', llamada: 'Clics en llamar',
  formulario_visita: 'Solicitudes de visita', formulario_propietario: 'Captaciones de propietarios', contacto_guardado: 'Contactos guardados',
};
const RUBROS: Record<string, string> = { cafe: 'Café para llevar', joyeria: 'Joyería', barberia: 'Barbería', jugueteria: 'Juguetería', floreria: 'Florería', celulares: 'Celulares y servicio técnico', cajeros: 'Cajeros automáticos', defensa: 'Defensa personal' };
const workerUrl = (process.env.NEXT_PUBLIC_WORKER_URL ?? '').replace(/\/$/, '');
const clean = <T,>(o: T): T => JSON.parse(JSON.stringify(o));
const fmtDate = (d?: Date) => (d ? d.toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' }) : '—');

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>('solicitudes');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!firebaseReady) return;
    let off = () => {};
    (async () => {
      const { app, db, fs } = await getFirebase();
      const { getAuth, onAuthStateChanged } = await import('firebase/auth');
      off = onAuthStateChanged(getAuth(app), async (u) => {
        setUser(u);
        if (!u?.email) { setAllowed(null); return; }
        try { setAllowed((await fs.getDoc(fs.doc(db, 'admins', u.email))).exists()); } catch { setAllowed(false); }
      });
    })();
    return () => off();
  }, []);

  const login = async () => {
    const { app } = await getFirebase();
    const { getAuth, GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
    try { await signInWithPopup(getAuth(app), new GoogleAuthProvider()); } catch (e) { setMsg(`No se pudo iniciar sesión: ${(e as Error).message}`); }
  };
  const logout = async () => { const { app } = await getFirebase(); (await import('firebase/auth')).getAuth(app).signOut(); };

  if (!firebaseReady) return <Shell><p>Firebase no está configurado en este build (faltan las variables <code>NEXT_PUBLIC_FIREBASE_*</code>).</p></Shell>;
  if (!user) return <Shell><button onClick={login} className="btn-gold">Entrar con Google</button>{msg && <p className="mt-4 text-sm text-red-300">{msg}</p>}</Shell>;
  if (allowed === null) return <Shell><p className="text-steel">Verificando acceso…</p></Shell>;
  if (!allowed) return <Shell><p>La cuenta <b>{user.email}</b> no está autorizada. Pide que la agreguen en <code>/admins</code>.</p><button onClick={logout} className="btn-ghost mt-6">Salir</button></Shell>;

  return (
    <Shell>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <nav className="flex gap-2" aria-label="Secciones del panel">
          {(['solicitudes', 'metricas', 'inventario'] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider ${tab === t ? 'bg-gold text-obsidian' : 'border border-white/15 text-ivory/80 hover:border-gold'}`}>{t === 'metricas' ? 'Métricas' : t}</button>
          ))}
        </nav>
        <p className="text-sm text-steel">{user.email} · <button onClick={logout} className="underline hover:text-gold">salir</button></p>
      </div>
      <div className="mt-8">
        {tab === 'solicitudes' && <Leads email={user.email!} />}
        {tab === 'metricas' && <Metrics />}
        {tab === 'inventario' && <Inventory user={user} />}
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-va pb-24 pt-28">
      <p className="eyebrow">Panel interno</p>
      <h1 className="h-display mt-3 text-4xl md:text-5xl">VAHOME · Administración</h1>
      <div className="mt-8">{children}</div>
    </div>
  );
}

async function audit(by: string, action: string, target: string) {
  const { db, fs } = await getFirebase();
  await fs.addDoc(fs.collection(db, 'auditLog'), { by, action, target, at: fs.serverTimestamp() });
}

function Leads({ email }: { email: string }) {
  const [rows, setRows] = useState<Lead[] | null>(null);
  const [filter, setFilter] = useState('abiertas');
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    try {
      const { db, fs } = await getFirebase();
      const [v, o] = await Promise.all(['visits', 'owners'].map((c) => fs.getDocs(fs.query(fs.collection(db, c), fs.orderBy('createdAt', 'desc'), fs.limit(200)))));
      const map = (kind: Lead['kind']) => (d: { id: string; data: () => Record<string, unknown> }): Lead => {
        const x = d.data() as Record<string, string> & { createdAt?: { toDate: () => Date } };
        return {
          id: d.id, kind, nombre: x.nombre, telefono: x.telefono, estado: x.estado, responsable: x.responsable, notas: x.notas,
          detalle: kind === 'visita' ? `${x.title} (${x.ref}) · ${x.fecha || 'fecha a convenir'} · ${x.franja}${x.mensaje ? ` · «${x.mensaje}»` : ''}`
            : `${typeLabel[x.tipo as keyof typeof typeLabel] ?? x.tipo} en ${x.comuna}${x.precio ? ` · ${x.precio}` : ''}${x.descripcion ? ` · «${x.descripcion}»` : ''}`,
          createdAt: x.createdAt?.toDate(),
        };
      };
      setRows([...v.docs.map(map('visita')), ...o.docs.map(map('propietario'))].sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)));
    } catch (e) { setErr((e as Error).message); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const update = async (l: Lead, patch: Partial<Pick<Lead, 'estado' | 'responsable' | 'notas'>>) => {
    const { db, fs } = await getFirebase();
    await fs.updateDoc(fs.doc(db, l.kind === 'visita' ? 'visits' : 'owners', l.id), { ...patch, updatedAt: fs.serverTimestamp(), updatedBy: email });
    await audit(email, `seguimiento ${Object.keys(patch).join(', ')}`, `${l.kind}/${l.id}`);
    setRows((r) => r?.map((x) => (x.id === l.id ? { ...x, ...patch } : x)) ?? null);
  };

  if (err) return <p className="text-red-300">No se pudieron leer las solicitudes: {err}</p>;
  if (!rows) return <p className="text-steel">Cargando solicitudes…</p>;
  const shown = rows.filter((r) => filter === 'todas' || (filter === 'abiertas' ? !['cerrada', 'descartada'].includes(r.estado) : r.estado === filter));
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <select className="field max-w-xs" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filtrar por estado">
          <option value="abiertas">Abiertas</option><option value="todas">Todas</option>{ESTADOS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <p className="text-sm text-steel">{shown.length} de {rows.length} solicitudes</p>
        <button onClick={load} className="text-sm underline hover:text-gold">actualizar</button>
      </div>
      {shown.length === 0 && <p className="mt-8 text-ivory/70">No hay solicitudes con ese filtro.</p>}
      <ul className="mt-6 grid gap-4">
        {shown.map((l) => (
          <li key={l.id} className="card grid gap-4 p-5 md:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-gold">{l.kind} · {fmtDate(l.createdAt)}</p>
              <p className="mt-1 text-lg font-semibold">{l.nombre}</p>
              <p className="text-sm"><a href={`https://wa.me/${l.telefono.replace(/\D/g, '')}`} target="_blank" rel="noopener" className="underline hover:text-gold">{l.telefono}</a></p>
              <p className="mt-2 text-sm text-ivory/75">{l.detalle}</p>
            </div>
            <div className="grid gap-2">
              <select className="field" value={l.estado} onChange={(e) => update(l, { estado: e.target.value })} aria-label="Estado">{ESTADOS.map((s) => <option key={s}>{s}</option>)}</select>
              <input className="field" defaultValue={l.responsable ?? ''} placeholder="Responsable" onBlur={(e) => e.target.value !== (l.responsable ?? '') && update(l, { responsable: e.target.value.slice(0, 80) })} />
              <textarea className="field min-h-16" defaultValue={l.notas ?? ''} placeholder="Notas y siguiente paso" onBlur={(e) => e.target.value !== (l.notas ?? '') && update(l, { notas: e.target.value.slice(0, 1000) })} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Metrics() {
  const [days, setDays] = useState(30);
  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  const [rubros, setRubros] = useState<Record<string, number>>({});
  const [err, setErr] = useState('');
  useEffect(() => {
    (async () => {
      try {
        setCounts(null);
        const { db, fs } = await getFirebase();
        const since = fs.Timestamp.fromMillis(Date.now() - days * 864e5);
        const entries = await Promise.all(Object.keys(EVENTOS).map(async (t) => {
          const snap = await fs.getCountFromServer(fs.query(fs.collection(db, 'events'), fs.where('type', '==', t), fs.where('ts', '>=', since)));
          return [t, snap.data().count] as const;
        }));
        setCounts(Object.fromEntries(entries));
        const rub = await Promise.all(Object.keys(RUBROS).map(async (r) => {
          const snap = await fs.getCountFromServer(fs.query(fs.collection(db, 'events'), fs.where('type', '==', 'rubro'), fs.where('ref', '==', r), fs.where('ts', '>=', since)));
          return [r, snap.data().count] as const;
        }));
        setRubros(Object.fromEntries(rub));
      } catch (e) { setErr((e as Error).message); }
    })();
  }, [days]);
  if (err) return <p className="text-red-300">No se pudieron leer las métricas: {err}</p>;
  return (
    <div>
      <div className="flex items-center gap-3">
        <select className="field max-w-xs" value={days} onChange={(e) => setDays(Number(e.target.value))} aria-label="Período">
          <option value={7}>Últimos 7 días</option><option value={30}>Últimos 30 días</option><option value={90}>Últimos 90 días</option>
        </select>
        <p className="text-sm text-steel">Eventos reales registrados desde el sitio (sin cookies ni datos personales).</p>
      </div>
      {!counts ? <p className="mt-6 text-steel">Cargando…</p> : (
        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(EVENTOS).map(([k, label]) => (
            <div key={k} className="card p-5"><dt className="text-[11px] uppercase tracking-wider text-ivory/60">{label}</dt><dd className="mt-2 font-display text-4xl text-gold">{counts[k] ?? 0}</dd></div>
          ))}
        </dl>
      )}
      {counts && (
        <div className="mt-10">
          <p className="eyebrow">Qué negocio buscan para los locales</p>
          <p className="mt-1 text-sm text-steel">Clics en «Me interesa para …» por rubro, en el mismo período.</p>
          <ul className="mt-4 grid gap-2">
            {Object.entries(RUBROS).sort((a, b) => (rubros[b[0]] ?? 0) - (rubros[a[0]] ?? 0)).map(([k, label]) => {
              const max = Math.max(1, ...Object.values(rubros));
              return (
                <li key={k} className="grid grid-cols-[10rem_1fr_3rem] items-center gap-3 text-sm">
                  <span>{label}</span>
                  <span className="h-2 rounded-full bg-white/10"><span className="block h-2 rounded-full bg-gold" style={{ width: `${((rubros[k] ?? 0) / max) * 100}%` }} /></span>
                  <span className="text-right font-semibold">{rubros[k] ?? 0}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

const EMPTY: Property = {
  slug: '', ref: '', verified: false, operation: 'arriendo', type: 'local', title: '', headline: '', region: 'Región Metropolitana',
  commune: '', addressPublic: '', price: 0, availability: 'disponible', features: [], conditions: [], description: '', images: [], status: 'borrador',
};

function Inventory({ user }: { user: User }) {
  const [rows, setRows] = useState<Property[] | null>(null);
  const [edit, setEdit] = useState<Property | null>(null);
  const [note, setNote] = useState('');
  const email = user.email!;

  const load = useCallback(async () => {
    const { db, fs } = await getFirebase();
    const snap = await fs.getDocs(fs.collection(db, 'properties'));
    setRows(snap.docs.map((d) => d.data() as Property).sort((a, b) => a.ref.localeCompare(b.ref)));
  }, []);
  useEffect(() => { load().catch((e) => setNote(`Error al leer el inventario: ${e.message}`)); }, [load]);

  const save = async (p: Property) => {
    const { db, fs } = await getFirebase();
    const data = clean({ ...p, updatedAt: new Date().toISOString(), updatedBy: email });
    await fs.setDoc(fs.doc(db, 'properties', p.slug), data);
    await fs.addDoc(fs.collection(db, 'properties', p.slug, 'history'), { by: email, at: fs.serverTimestamp(), data });
    await audit(email, `guardar propiedad (${p.status})`, `properties/${p.slug}`);
  };

  const importSeed = async () => {
    const existing = new Set(rows?.map((r) => r.slug));
    const todo = seedProperties.filter((p) => !existing.has(p.slug));
    for (const p of todo) await save({ ...p, status: p.verified ? 'publicada' : 'borrador' });
    setNote(`${todo.length} propiedad(es) importada(s). Las demos quedan como borrador.`);
    load();
  };

  const publish = async () => {
    setNote('Pidiendo la publicación…');
    try {
      const res = await fetch(`${workerUrl}/rebuild`, { method: 'POST', headers: { Authorization: `Bearer ${await user.getIdToken()}` } });
      setNote(res.ok ? 'Publicación iniciada: la web se actualiza en 2–3 minutos.' : `El Worker respondió ${res.status}: ${await res.text()}`);
    } catch (e) { setNote(`No se pudo contactar al Worker: ${(e as Error).message}`); }
  };

  if (edit) return <PropertyForm initial={edit} onCancel={() => setEdit(null)} onSave={async (p) => { await save(p); setEdit(null); setNote(`«${p.title}» guardada como ${p.status}. Publica los cambios para verlos en la web.`); load(); }} />;
  if (!rows) return <p className="text-steel">{note || 'Cargando inventario…'}</p>;
  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <button onClick={() => setEdit({ ...EMPTY })} className="btn-gold">Nueva propiedad</button>
        {workerReady ? <button onClick={publish} className="btn-ghost">Publicar cambios en la web</button>
          : <p className="self-center text-sm text-steel">Para publicar desde aquí falta configurar el Worker (<code>NEXT_PUBLIC_WORKER_URL</code>); mientras, se publica en el próximo deploy.</p>}
        {rows.length === 0 && <button onClick={importSeed} className="btn-ghost">Importar inventario del sitio</button>}
      </div>
      {note && <p role="status" className="mt-4 text-sm text-gold">{note}</p>}
      <table className="mt-6 w-full text-left text-sm">
        <thead className="text-[11px] uppercase tracking-wider text-ivory/60"><tr><th className="py-2">Ref</th><th>Propiedad</th><th>Precio</th><th>Disponibilidad</th><th>Estado</th><th>Editada</th><th /></tr></thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.slug} className="border-t border-white/10">
              <td className="py-3">{p.ref}</td><td>{p.title}</td><td>{clp(p.price)}</td><td>{p.availability}</td>
              <td><span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${p.status === 'publicada' ? 'bg-gold text-obsidian' : 'bg-white/10'}`}>{p.status}</span></td>
              <td className="text-steel">{p.updatedAt ? `${new Date(p.updatedAt).toLocaleDateString('es-CL')} · ${p.updatedBy}` : '—'}</td>
              <td><button onClick={() => setEdit(p)} className="underline hover:text-gold">editar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const lines = (s: string) => s.split('\n').map((x) => x.trim()).filter(Boolean);
const num = (s: string) => (s.trim() === '' ? undefined : Number(s.replace(',', '.')));

function PropertyForm({ initial, onSave, onCancel }: { initial: Property; onSave: (p: Property) => Promise<void>; onCancel: () => void }) {
  const [p, setP] = useState<Property>(initial);
  const [text, setText] = useState(() => ({
    features: initial.features.join('\n'), conditions: initial.conditions.join('\n'), images: initial.images.join('\n'),
    costs: (initial.extraCosts ?? []).map((c) => [c.label, c.amount, c.before ?? ''].join(' | ')).join('\n'),
  }));
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const isNew = !initial.slug;
  const set = <K extends keyof Property>(k: K, v: Property[K]) => setP((x) => ({ ...x, [k]: v }));
  const field = (k: keyof Property, label: string, type = 'text') => (
    <label className="text-sm">{label}<input className="field mt-1" type={type} value={String(p[k] ?? '')} onChange={(e) => set(k, (type === 'number' ? num(e.target.value) : e.target.value) as never)} /></label>
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const out: Property = {
      ...p, features: lines(text.features), conditions: lines(text.conditions), images: lines(text.images),
      extraCosts: lines(text.costs).map((l) => { const [label, amount, before] = l.split('|').map((x) => x.trim()); return clean({ label, amount: Number(amount), before: before ? Number(before) : undefined }); }),
    };
    if (!/^[a-z0-9-]{3,120}$/.test(out.slug)) return setErr('El identificador (slug) usa solo minúsculas, números y guiones.');
    if (!out.ref || !out.title || !out.commune || !(out.price > 0)) return setErr('Completa referencia, título, comuna y un precio mayor que cero.');
    if (out.status === 'publicada' && !out.verified) return setErr('Solo se publican propiedades con datos verificados por León.');
    setBusy(true);
    try { await onSave(out); } catch (e2) { setErr((e2 as Error).message); setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="card grid gap-4 p-6 md:grid-cols-3">
      <h2 className="font-display text-2xl md:col-span-3">{isNew ? 'Nueva propiedad' : `Editar ${initial.ref}`}</h2>
      <label className="text-sm">Identificador (URL)<input className="field mt-1" value={p.slug} disabled={!isNew} onChange={(e) => set('slug', e.target.value.toLowerCase())} placeholder="local-170-galeria-los-joyeros" /></label>
      {field('ref', 'Referencia (VAH-002)')}
      {field('title', 'Título')}
      <label className="text-sm">Operación<select className="field mt-1" value={p.operation} onChange={(e) => set('operation', e.target.value as Property['operation'])}><option value="arriendo">Arriendo</option><option value="venta">Venta</option></select></label>
      <label className="text-sm">Tipo<select className="field mt-1" value={p.type} onChange={(e) => set('type', e.target.value as Property['type'])}>{Object.entries(typeLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
      {field('price', 'Precio (CLP)', 'number')}
      {field('priceBefore', 'Precio anterior (opcional)', 'number')}
      {field('commune', 'Comuna')}
      {field('region', 'Región')}
      {field('addressPublic', 'Dirección publicable')}
      {field('mapQuery', 'Dirección para el mapa')}
      <label className="text-sm">Disponibilidad<select className="field mt-1" value={p.availability} onChange={(e) => set('availability', e.target.value as Property['availability'])}><option>disponible</option><option>reservada</option><option>arrendada</option></select></label>
      {field('bedrooms', 'Dormitorios', 'number')}
      {field('bathrooms', 'Baños', 'number')}
      {field('parking', 'Estacionamientos', 'number')}
      <label className="text-sm">Medidas ancho × largo × alto (m)
        <span className="mt-1 grid grid-cols-3 gap-2">{(['widthM', 'lengthM', 'heightM'] as const).map((d) => (
          <input key={d} className="field" inputMode="decimal" value={p.dimensions?.[d] ?? ''} onChange={(e) => setP((x) => ({ ...x, dimensions: clean({ widthM: 0, lengthM: 0, ...x.dimensions, [d]: num(e.target.value) }) }))} />
        ))}</span>
      </label>
      {field('areaM2', 'Superficie m² (si no hay medidas)', 'number')}
      {field('headline', 'Frase destacada')}
      <label className="text-sm md:col-span-3">Descripción<textarea className="field mt-1 min-h-24" value={p.description} onChange={(e) => set('description', e.target.value)} /></label>
      <label className="text-sm">Características (una por línea)<textarea className="field mt-1 min-h-28" value={text.features} onChange={(e) => setText({ ...text, features: e.target.value })} /></label>
      <label className="text-sm">Condiciones (una por línea)<textarea className="field mt-1 min-h-28" value={text.conditions} onChange={(e) => setText({ ...text, conditions: e.target.value })} /></label>
      <label className="text-sm">Otros costos: nombre | monto | antes<textarea className="field mt-1 min-h-28" value={text.costs} onChange={(e) => setText({ ...text, costs: e.target.value })} placeholder="Gastos comunes | 50000" /></label>
      <label className="text-sm md:col-span-2">Fotos (una ruta o URL por línea)<textarea className="field mt-1 min-h-24" value={text.images} onChange={(e) => setText({ ...text, images: e.target.value })} placeholder="/propiedades/mi-propiedad/01.jpg" /></label>
      <div className="grid gap-3 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={p.verified} onChange={(e) => set('verified', e.target.checked)} className="accent-[#D9B26A]" /> Datos verificados por León</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={!!p.featured} onChange={(e) => set('featured', e.target.checked)} className="accent-[#D9B26A]" /> Destacada en portada</label>
        <label>Estado<select className="field mt-1" value={p.status ?? 'borrador'} onChange={(e) => set('status', e.target.value as Property['status'])}><option value="borrador">Borrador</option><option value="publicada">Publicada</option><option value="retirada">Retirada</option></select></label>
      </div>
      {err && <p role="alert" className="text-sm text-red-300 md:col-span-3">{err}</p>}
      <div className="flex gap-3 md:col-span-3">
        <button className="btn-gold" disabled={busy}>{busy ? 'Guardando…' : 'Guardar'}</button>
        <button type="button" onClick={onCancel} className="btn-ghost">Cancelar</button>
      </div>
    </form>
  );
}
