/**
 * Consulta de un titular (Ley 1581 de 2012, art. 14; B.10).
 *
 * Devuelve todo lo que hay guardado de una persona, para poder responder una
 * consulta en los diez días hábiles que exige la ley.
 *
 *   pnpm exec tsx scripts/prospectos-exportar.ts --correo alguien@ejemplo.com
 */
import { COLECCION } from '../src/lib/prospectos';
import { firestore } from '../src/lib/firebase-admin';

function argumento(nombre: string): string | undefined {
  const indice = process.argv.indexOf(`--${nombre}`);
  return indice === -1 ? undefined : process.argv[indice + 1];
}

async function principal(): Promise<void> {
  const correo = argumento('correo');
  if (!correo) {
    console.error('Falta --correo. Ejemplo: --correo alguien@ejemplo.com');
    process.exit(1);
  }

  const db = firestore();
  const encontrados = await db.collection(COLECCION).where('correo', '==', correo).get();

  if (encontrados.empty) {
    console.log(JSON.stringify({ correo, registros: [] }, null, 2));
    return;
  }

  const registros = [];
  for (const documento of encontrados.docs) {
    const eventos = await documento.ref.collection('eventos').orderBy('fecha').get();

    registros.push({
      id: documento.id,
      datos: documento.data(),
      eventos: eventos.docs.map((evento) => evento.data()),
    });
  }

  console.log(JSON.stringify({ correo, registros }, null, 2));
}

void principal().catch((error) => {
  console.error(error);
  process.exit(1);
});
