import { spawn } from 'node:child_process';

/**
 * Desarrollo: Velite en modo watch en paralelo con `next dev` (B.8).
 * Se hace con este script para no agregar una dependencia fuera de B.1.
 */

const enWindows = process.platform === 'win32';

const procesos = [
  ['pnpm', ['exec', 'velite', 'dev']],
  ['pnpm', ['exec', 'next', 'dev']],
].map(([comando, argumentos]) =>
  spawn(comando, argumentos, { stdio: 'inherit', shell: enWindows }),
);

function terminar(codigo) {
  for (const proceso of procesos) {
    if (!proceso.killed) proceso.kill();
  }
  process.exit(codigo ?? 0);
}

for (const proceso of procesos) {
  proceso.on('exit', terminar);
}

for (const senal of ['SIGINT', 'SIGTERM']) {
  process.on(senal, () => terminar(0));
}
