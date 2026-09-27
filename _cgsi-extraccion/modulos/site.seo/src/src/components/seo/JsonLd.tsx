/**
 * Datos estructurados (B.9). Va en el servidor y no lleva estado: es un
 * `<script>` con JSON, no JavaScript que se ejecute.
 */
export function JsonLd({ datos }: { datos: Record<string, unknown>[] }) {
  return (
    <>
      {datos.map((dato, indice) => (
        <script
          key={indice}
          type="application/ld+json"
          // El contenido es JSON generado por nosotros, nunca entrada de nadie.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(dato) }}
        />
      ))}
    </>
  );
}
