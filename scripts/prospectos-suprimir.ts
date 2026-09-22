/**
 * Supresión a petición del titular (Ley 1581 de 2012, art. 15; B.10).
 *
 * Borra los datos personales y deja una constancia **sin datos personales**, para
 * poder probar que la supresión ocurrió sin conservar lo que se pidió borrar.
 *
 *   pnpm exec tsx scripts/prospectos-suprimir.ts --correo alguien@ejemplo.com
 *   pnpm exec tsx scripts/prospectos-suprimir.ts --correo alguien@ejemplo.com --confirmar
 */
import { createHash } from 'node:crypto';
import { COLECCION } from '../src/lib/prospectos';
import { firestore } from '../src/lib/firebase-admin';

function argumento(nombre: string): string | undefined {
  const indice = process.argv.indexOf(`--${nombre}`);
  return indice === -1 ? undefined : process.argv[indice + 1];
}

/** Huella para poder demostrar «este correo fue suprimido» sin guardar el correo. */
function huella(correo: string): string {
  return createHash('sha256').update(correo.trim().toLowerCase()).digest('hex').slice(0, 16);
}

async function principal(): Promise<void> {
  const correo = argumento('correo');
  const confirmar = process.argv.includes('--confirmar');

  if (!correo) {
    console.error('Falta --correo. Ejemplo: --correo alguien@ejemplo.com');
    process.exit(1);
  }

  const db = firestore();
  const encontrados = await db.collection(COLECCION).where('correo', '==', correo).get();

  if (encontrados.empty) {
    console.log('No hay nada guardado de ese correo.');
    return;
  }

  if (!confirmar) {
    console.log(
      `Se borrarían ${encontrados.size} registro(s). Vuelve a correrlo con --confirmar para hacerlo.`,
    );
    return;
  }

  for (const documento of encontrados.docs) {
    const eventos = await documento.ref.collection('eventos').get();
    for (const evento of eventos.docs) await evento.ref.delete();

    await documento.ref.delete();

    await db.collection('supresiones').add({
      huella: huella(correo),
      documento: documento.id,
      fecha: new Date().toISOString(),
      motivo: 'solicitud del titular (Ley 1581 de 2012, art. 15)',
    });
  }

  console.log(`Suprimidos ${encontrados.size} registro(s). Constancia guardada sin datos personales.`);
}

void principal().catch((error) => {
  console.error(error);
  process.exit(1);
});
