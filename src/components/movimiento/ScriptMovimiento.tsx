/**
 * Marca en `<html>` que habrá movimiento, antes del primer pintado.
 *
 * Sirve para una sola cosa: que el doble filete de la portada, que está sobre
 * el pliegue, arranque sin trazo en vez de aparecer dibujado, borrarse y volver
 * a dibujarse cuando llegue el trozo de GSAP (que va en diferido).
 *
 * Sin JavaScript, o con movimiento reducido, el atributo no se pone y los filetes
 * se ven completos desde el primer momento, que es su estado final (B.6.3).
 * Si el módulo de movimiento no carga, `Movimiento` quita el atributo.
 */
const CODIGO = `try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.dataset.movimiento="si"}}catch(e){}`;

export function ScriptMovimiento() {
  return <script dangerouslySetInnerHTML={{ __html: CODIGO }} />;
}
