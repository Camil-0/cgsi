/**
 * Firma de movimiento del sitio (Parte A §2.4): un filete grueso en `--tinta`
 * y uno fino en `--carbon`.
 *
 * En F1 es estático. En F3, GSAP lo dibuja con DrawSVG al entrar la sección
 * (inventario B.6, animaciones 1 y 2) y se queda estático con movimiento reducido.
 */
export function DobleFilete({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`h-[6px] w-full ${className}`}
      viewBox="0 0 100 6"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      data-filete
    >
      <line
        x1="0"
        y1="1.5"
        x2="100"
        y2="1.5"
        className="stroke-tinta"
        strokeWidth="3"
        vectorEffect="non-scaling-stroke"
        data-filete-grueso
      />
      <line
        x1="0"
        y1="5.5"
        x2="100"
        y2="5.5"
        className="stroke-carbon"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        data-filete-fino
      />
    </svg>
  );
}
