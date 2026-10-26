import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SITE } from '@/lib/site';

const docs: Record<string, { title: string; body: string[] }> = {
  terminos: { title: 'Términos de servicio', body: [
    `VA HOME es una marca comercial de ${SITE.company} (RUT ${SITE.rut}) que presta servicios de corretaje de propiedades.`,
    'La información de cada propiedad es entregada por su propietario y se publica de buena fe. Las condiciones definitivas son las del contrato de arriendo firmado entre propietario y arrendatario.',
    'Las solicitudes de visita quedan pendientes hasta ser confirmadas expresamente por VA HOME.'] },
  privacidad: { title: 'Política de privacidad', body: [
    'Los datos personales que entregas (nombre, teléfono, correo y antecedentes) se usan solo para gestionar tu consulta o solicitud.',
    'No vendemos ni cedemos tus datos a terceros. Puedes pedir acceso, rectificación o eliminación escribiendo a ' + SITE.email + '.',
    'Esta política se ajustará a la normativa chilena de protección de datos personales vigente.'] },
  corretaje: { title: 'Condiciones de corretaje', body: [
    `${SITE.company} actúa como corredor y no es propietario de las propiedades publicadas, salvo que se indique expresamente.`,
    'El contrato de corretaje (entre VA HOME y el propietario) es distinto del contrato de arriendo (entre propietario y arrendatario).',
    'VA HOME no garantiza el arriendo de la propiedad ni la solvencia del arrendatario.'] },
  comisiones: { title: 'Comisiones', body: [
    'Comisión: 50% de un mes de arriendo a cargo del propietario y 50% de un mes de arriendo a cargo del arrendatario.',
    'La comisión es exigible al firmarse el contrato de arriendo. El tratamiento de impuestos se detalla en el contrato de corretaje.',
    'VA HOME no realiza cobros automáticos. Los datos para pago se entregan solo por escrito al momento de formalizar.'] },
  empresa: { title: 'Identificación de la empresa', body: [
    `Razón social: ${SITE.company}`, `RUT: ${SITE.rut}`, 'Marca comercial: VA HOME by VibraAlto',
    `Representante legal: ${SITE.representative}`, `Nombre comercial del asesor: ${SITE.advisor}`, `Contacto: ${SITE.email} · ${SITE.whatsappDisplay}`] },
};
export const generateStaticParams = () => Object.keys(docs).map((doc) => ({ doc }));
export function generateMetadata({ params }: { params: { doc: string } }): Metadata { return { title: docs[params.doc]?.title }; }
export default function Page({ params }: { params: { doc: string } }) {
  const d = docs[params.doc]; if (!d) notFound();
  return (
    <div className="container-va max-w-3xl pb-24 pt-32">
      <p className="eyebrow">Legal</p>
      <h1 className="h-display mt-3 text-5xl">{d.title}</h1>
      <p className="mt-6 rounded-xl border border-gold/40 bg-gold/10 p-4 text-sm text-ivory/90">Borrador. Debe ser revisado por un abogado antes de su uso en producción.</p>
      <div className="mt-8 space-y-4 text-ivory/80">{d.body.map((b) => <p key={b}>{b}</p>)}</div>
    </div>
  );
}
