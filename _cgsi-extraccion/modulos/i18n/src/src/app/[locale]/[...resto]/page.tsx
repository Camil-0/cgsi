import { notFound } from 'next/navigation';

/**
 * Cualquier ruta que no exista cae aquí y dispara el folio no encontrado
 * (`[locale]/not-found.tsx`), con el layout y el cajetín del documento.
 *
 * Hace falta porque `proxy.ts` reescribe todo bajo `/[locale]`, y sin esta
 * ruta comodín Next mostraría su 404 genérico, sin idioma y sin documento.
 */
export default function RutaDesconocida() {
  notFound();
}
