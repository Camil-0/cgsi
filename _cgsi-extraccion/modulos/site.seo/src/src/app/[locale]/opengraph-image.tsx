import { ImageResponse } from 'next/og';
import { documento } from '#contenido';
import { LienzoOg } from '@/components/seo/LienzoOg';
import { porTipo } from '@/lib/documento';
import { fuenteDeGoogle } from '@/lib/og';
import { ORGANIZACION } from '@/lib/seo';

/** Imagen OG de la portada (B.9): el título real del documento, en estilo Papel. */

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
// Se compone en el build, no por visita: el contenido no cambia entre despliegues.
export const dynamic = 'force-static';
export const alt = `${ORGANIZACION.razonSocial} · Ref. CSI-2026-WEB-001`;

export default async function ImagenOg() {
  const portada = porTipo(documento, 'portada')[0];
  const serif = await fuenteDeGoogle('Source Serif 4', 600);

  return new ImageResponse(
    (
      <LienzoOg
        titulo={portada?.titulo ?? ORGANIZACION.razonSocial}
        membrete={ORGANIZACION.nombre}
        referencia="Ref. CSI-2026-WEB-001"
        serif={serif ? 'Source Serif 4' : 'serif'}
      />
    ),
    {
      ...size,
      fonts: serif
        ? [{ name: 'Source Serif 4', data: serif, style: 'normal', weight: 600 }]
        : undefined,
    },
  );
}
