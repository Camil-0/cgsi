type Linea = {
  signo: 'quita' | 'agrega';
  texto: string;
};

type Props = {
  lineas: Linea[];
  /** Título accesible de la lista, p. ej. «Diff del proceso de pedidos» */
  titulo: string;
};

/**
 * Diff de procesos (B.5 y Parte A §4.3).
 *
 * Nunca comunica solo con color: cada línea lleva su signo «−» o «+» visible,
 * las que se quitan van tachadas, y la semántica de `<del>`/`<ins>` se conserva.
 */
export function Diff({ lineas, titulo }: Props) {
  return (
    <ul className="diff my-8 list-none space-y-2 p-0" aria-label={titulo}>
      {lineas.map((linea, indice) => {
        const quita = linea.signo === 'quita';
        const Contenido = quita ? 'del' : 'ins';

        return (
          <li
            key={`${linea.signo}-${indice}`}
            className="grid grid-cols-[1.25rem_1fr] gap-x-2 font-mono text-[0.9375rem] leading-relaxed"
          >
            <span aria-hidden="true" className={quita ? 'text-tachado' : 'text-agregado'}>
              {quita ? '−' : '+'}
            </span>
            <Contenido
              className={
                quita ? 'text-tachado line-through decoration-tachado' : 'text-agregado no-underline'
              }
            >
              {linea.texto}
            </Contenido>
          </li>
        );
      })}
    </ul>
  );
}
