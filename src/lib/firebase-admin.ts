import 'server-only';

import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { entornoServidor } from './env';

import type { Firestore } from 'firebase-admin/firestore';

/**
 * Admin SDK, solo en el servidor (B.1). Las reglas de Firestore son
 * `allow read, write: if false`, así que esta es la única vía de escritura.
 *
 * La inicialización es perezosa: importar este módulo no exige credenciales,
 * y así el build no depende de tener Firebase configurado.
 */

let cache: Firestore | undefined;

export function firestore(): Firestore {
  if (cache) return cache;

  const env = entornoServidor();
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = env;

  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    throw new Error(
      'Faltan las credenciales de Firebase: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL y FIREBASE_PRIVATE_KEY. Ver TODO.md, punto 4.',
    );
  }

  const app =
    getApps()[0] ??
    initializeApp({
      credential: cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        // En las variables de entorno los saltos de línea viajan escapados.
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });

  cache = getFirestore(app);
  cache.settings({ ignoreUndefinedProperties: true });

  return cache;
}

export function hayFirestore(): boolean {
  const env = entornoServidor();

  return Boolean(env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY);
}
