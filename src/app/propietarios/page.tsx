import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import OwnerForm from './OwnerForm';
export const metadata: Metadata = { title: 'Propietarios', description: 'Publica y arrienda tu propiedad con VA HOME.' };
const steps = ['Evaluamos la propiedad.', 'Preparamos su presentación.', 'Publicamos y promocionamos.', 'Coordinamos interesados y visitas.', 'Apoyamos la revisión de antecedentes.', 'Acompañamos la formalización del contrato.'];
export default function Page() {
  return (
    <div className="pb-24 pt-32">
      <section className="container-va">
        <p className="eyebrow">Propietarios</p>
        <h1 className="h-display mt-3 max-w-4xl text-5xl md:text-7xl">Tu propiedad vale más con una <span className="text-gold">buena estrategia.</span></h1>
        <p className="mt-6 max-w-2xl text-lg text-ivory/75">Publicación, presentación comercial, coordinación de visitas y acompañamiento durante el proceso de arriendo.</p>
      </section>
      <section className="container-va mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((s, i) => (
          <Reveal key={s} delay={i * 0.05}><div className="card h-full p-6"><span className="font-display text-5xl text-gold">{String(i + 1).padStart(2, '0')}</span><p className="mt-4 text-lg">{s}</p></div></Reveal>
        ))}
      </section>
      <section className="container-va mt-20 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="h-display text-4xl">Comisión transparente</h2>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="card p-6"><p className="font-display text-5xl text-gold">50%</p><p className="mt-2 text-sm text-ivory/80">de un mes de arriendo, pagado por el propietario.</p></div>
            <div className="card p-6"><p className="font-display text-5xl text-gold">50%</p><p className="mt-2 text-sm text-ivory/80">de un mes de arriendo, pagado por el arrendatario.</p></div>
          </div>
          <p className="mt-4 text-sm text-steel">La comisión se paga solo al firmarse el contrato de arriendo. El tratamiento de impuestos (incluido o adicional) se indica en el contrato de corretaje firmado. Nunca se realizan cobros automáticos. VA HOME no garantiza el arriendo ni la solvencia del arrendatario.</p>
        </div>
        <div>
          <h2 className="h-display text-4xl">Publica tu propiedad</h2>
          <div className="mt-6"><OwnerForm /></div>
        </div>
      </section>
    </div>
  );
}
