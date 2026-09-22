export const CLAVE_TEMA = 'cgsi-tema';

/**
 * Sin parpadeo al cargar (B.3): script de bloqueo que fija `data-tema` antes del
 * primer pintado. Va envuelto en try/catch porque `localStorage` puede estar
 * bloqueado, y va como primer hijo del `<body>` para ejecutarse antes del contenido.
 *
 * Si no hay nada guardado no se fija nada: manda `prefers-color-scheme`, que
 * `tokens.css` ya resuelve sin JavaScript.
 */
const CODIGO = `try{var t=localStorage.getItem(${JSON.stringify(CLAVE_TEMA)});if(t==="papel"||t==="plano"){document.documentElement.dataset.tema=t}}catch(e){}`;

export function ScriptTema() {
  return <script dangerouslySetInnerHTML={{ __html: CODIGO }} />;
}
