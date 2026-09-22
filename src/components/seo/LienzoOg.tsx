/**
 * Lienzo de las imágenes OG (B.9): 1200×630 en estilo Papel, con membrete,
 * título y la referencia del documento.
 *
 * Esto lo compone satori, no el navegador: no hay hoja de estilos ni variables
 * CSS, así que los colores van explícitos. Son los mismos de `tokens.css` y la
 * prueba `tests/unit/og.test.ts` verifica que no se desincronicen.
 */
export const PAPEL_OG = {
  fondo: '#F5F0E8',
  tinta: '#0D1B2A',
  lapiz: '#5A6778',
  carbon: '#3D3D3D',
  firma: '#2340C8',
} as const;

type Props = {
  titulo: string;
  membrete: string;
  referencia: string;
  serif?: string;
};

export function LienzoOg({ titulo, membrete, referencia, serif = 'serif' }: Props) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: PAPEL_OG.fondo,
        padding: '64px 72px',
      }}
    >
      <div
        style={{
          fontSize: 22,
          letterSpacing: 10,
          textTransform: 'uppercase',
          color: PAPEL_OG.lapiz,
        }}
      >
        {membrete}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          fontFamily: serif,
          fontSize: 76,
          lineHeight: 1.08,
          color: PAPEL_OG.tinta,
          maxWidth: 940,
        }}
      >
        {titulo}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* El doble filete: grueso en tinta, fino en carbón. */}
        <div style={{ height: 6, backgroundColor: PAPEL_OG.tinta }} />
        <div style={{ height: 2, marginTop: 5, backgroundColor: PAPEL_OG.carbon }} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 20,
            fontSize: 20,
            letterSpacing: 1,
            color: PAPEL_OG.lapiz,
          }}
        >
          <span>{referencia}</span>
          <span style={{ color: PAPEL_OG.firma }}>cgsoftwareintegration</span>
        </div>
      </div>
    </div>
  );
}
