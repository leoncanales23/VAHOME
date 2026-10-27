// Registro estructurado de propiedades.
// REGLA: solo `verified: true` para propiedades con datos confirmados por León.
// Las propiedades `demo` son ejemplos de interfaz y se muestran marcadas como DEMO.

export type Operation = 'arriendo' | 'venta';
export type PropertyType = 'casa' | 'departamento' | 'local' | 'oficina' | 'terreno';

export interface Property {
  slug: string;
  ref: string;
  verified: boolean;          // false = demo, nunca se presenta como real
  featured?: boolean;
  operation: Operation;
  type: PropertyType;
  title: string;
  headline: string;
  region: string;
  commune: string;
  addressPublic: string;      // dirección que se puede publicar
  price: number;              // CLP mensual (arriendo) o total (venta)
  priceBefore?: number;
  extraCosts?: { label: string; amount: number; before?: number }[];
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  areaM2?: number | null;     // null = pendiente de medición
  availability: 'disponible' | 'reservada' | 'arrendada';
  features: string[];
  conditions: string[];
  description: string;
  images: string[];
  mapQuery?: string;
}

export const properties: Property[] = [
  {
    slug: 'local-170-galeria-los-joyeros',
    ref: 'VAH-001',
    verified: true,
    featured: true,
    operation: 'arriendo',
    type: 'local',
    title: 'Local 170 · Galería Los Joyeros',
    headline: 'Vitrina en esquina a pasos de Plaza de Armas',
    region: 'Región Metropolitana',
    commune: 'Santiago Centro',
    addressPublic: '21 de Mayo 583, Local 170 (entrepiso)',
    price: 960000,
    priceBefore: 1200000,
    extraCosts: [
      { label: 'Derecho de llave', amount: 2000000, before: 10000000 },
      { label: 'Gastos comunes', amount: 50000 },
    ],
    bathrooms: 1,
    areaM2: null,
    availability: 'disponible',
    features: [
      'Vitrina en esquina con doble frente',
      'Cortina metálica de seguridad',
      'Iluminación LED en cielo',
      'Tablero eléctrico propio',
      'Baño privado para personal',
      'Galería comercial de joyerías',
      'Alto flujo peatonal (Paseo Ahumada / Plaza de Armas)',
    ],
    conditions: [
      'Arriendo mensual $960.000 (20% de descuento sobre $1.200.000)',
      'Derecho de llave $2.000.000 (80% de descuento sobre $10.000.000)',
      'Gastos comunes $50.000 mensuales',
      'Ingreso: 1 mes de garantía + 1 mes de arriendo',
    ],
    description:
      'Local comercial en el entrepiso de la Galería Los Joyeros, en pleno centro histórico de Santiago. Vitrina en esquina con doble frente, iluminación LED y tablero eléctrico propio. Cuenta con baño privado para el personal. El espacio se entrega para habilitar según el rubro del arrendatario.',
    images: ['01', '02', '03', '04', '05', '06', '07', '08'].map(
      (n) => `/propiedades/local-170-galeria-los-joyeros/${n}.jpg`,
    ),
    mapQuery: '21 de Mayo 583, Santiago, Chile',
  },
  // ---- DEMOS (no publicar como reales) ----
  {
    slug: 'demo-casa-buin', ref: 'DEMO-01', verified: false, operation: 'arriendo', type: 'casa',
    title: 'Casa familiar (ejemplo)', headline: 'Ficha de ejemplo para probar el catálogo',
    region: 'Región Metropolitana', commune: 'Buin', addressPublic: 'Dirección referencial',
    price: 650000, bedrooms: 3, bathrooms: 2, parking: 2, areaM2: 110, availability: 'disponible',
    features: ['Patio', 'Estacionamiento'], conditions: ['Condiciones de ejemplo'],
    description: 'Propiedad de demostración. Será reemplazada por inventario verificado.', images: [],
  },
  {
    slug: 'demo-departamento-rancagua', ref: 'DEMO-02', verified: false, operation: 'arriendo', type: 'departamento',
    title: 'Departamento céntrico (ejemplo)', headline: 'Ficha de ejemplo para probar el catálogo',
    region: "Región de O'Higgins", commune: 'Rancagua', addressPublic: 'Dirección referencial',
    price: 420000, bedrooms: 2, bathrooms: 1, parking: 1, areaM2: 55, availability: 'disponible',
    features: ['Ascensor', 'Bodega'], conditions: ['Condiciones de ejemplo'],
    description: 'Propiedad de demostración. Será reemplazada por inventario verificado.', images: [],
  },
  {
    slug: 'demo-local-paine', ref: 'DEMO-03', verified: false, operation: 'arriendo', type: 'local',
    title: 'Local de barrio (ejemplo)', headline: 'Ficha de ejemplo para probar el catálogo',
    region: 'Región Metropolitana', commune: 'Paine', addressPublic: 'Dirección referencial',
    price: 800000, bathrooms: 1, areaM2: 60, availability: 'disponible',
    features: ['Frente a avenida'], conditions: ['Condiciones de ejemplo'],
    description: 'Propiedad de demostración. Será reemplazada por inventario verificado.', images: [],
  },
];

export const typeLabel: Record<PropertyType, string> = {
  casa: 'Casa', departamento: 'Departamento', local: 'Local comercial', oficina: 'Oficina', terreno: 'Terreno',
};

export const getProperty = (slug: string) => properties.find((p) => p.slug === slug);
