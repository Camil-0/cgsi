import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Adaptador de mensajería (B.10 y B.16), con `fetch` simulado.
 *
 * `entornoServidor()` memoriza lo que parsea —en producción el entorno no cambia
 * a mitad de ejecución—, así que cada prueba reinicia los módulos y los importa
 * de nuevo con el entorno que le interesa.
 */

const CONFIGURADO = {
  MENSAJERIA_PROVEEDOR: 'evolution',
  EVOLUTION_API_URL: 'https://evolution.example/',
  EVOLUTION_API_KEY: 'clave-larga',
  EVOLUTION_INSTANCIA: 'cgsi',
  NOTIFICACIONES_DESTINO: '573001112233',
};

let entornoPrevio: NodeJS.ProcessEnv;

beforeEach(() => {
  entornoPrevio = { ...process.env };
  vi.resetModules();
});

afterEach(() => {
  process.env = entornoPrevio;
  vi.unstubAllGlobals();
});

async function conEvolution(configurado: boolean) {
  if (configurado) Object.assign(process.env, CONFIGURADO);
  else for (const clave of Object.keys(CONFIGURADO)) delete process.env[clave];

  const { evolution } = await import('@/lib/mensajeria/evolution');

  return evolution();
}

describe('proveedor «ninguno»', () => {
  it('no envía nada y reporta éxito', async () => {
    vi.spyOn(console, 'info').mockImplementation(() => undefined);
    const peticion = vi.fn();
    vi.stubGlobal('fetch', peticion);

    const { ninguno } = await import('@/lib/mensajeria/ninguno');
    const resultado = await ninguno().enviarTexto('573001112233', 'hola');

    expect(resultado).toEqual({ ok: true, id: 'ninguno' });
    expect(peticion).not.toHaveBeenCalled();
  });
});

describe('proveedor Evolution', () => {
  it('llama a la ruta de la instancia con la apikey en el encabezado', async () => {
    const peticion = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ key: { id: 'MSG1' } }),
    });
    vi.stubGlobal('fetch', peticion);

    const resultado = await (await conEvolution(true)).enviarTexto('573001112233', 'Nueva cita');

    expect(resultado).toEqual({ ok: true, id: 'MSG1' });

    const [url, opciones] = peticion.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://evolution.example/message/sendText/cgsi');
    expect((opciones.headers as Record<string, string>).apikey).toBe('clave-larga');
    expect(JSON.parse(opciones.body as string)).toEqual({
      number: '573001112233',
      text: 'Nueva cita',
    });
  });

  it('informa el código cuando Evolution responde con error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 502 }));

    const resultado = await (await conEvolution(true)).enviarTexto('573001112233', 'hola');

    expect(resultado.ok).toBe(false);
    expect(resultado.error).toContain('502');
  });

  it('no revienta si la red falla', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('sin red')));

    const resultado = await (await conEvolution(true)).enviarTexto('573001112233', 'hola');

    expect(resultado).toEqual({ ok: false, error: 'sin red' });
  });

  it('se niega a enviar si falta configuración', async () => {
    const peticion = vi.fn();
    vi.stubGlobal('fetch', peticion);

    const resultado = await (await conEvolution(false)).enviarTexto('573001112233', 'hola');

    expect(resultado).toEqual({ ok: false, error: 'Evolution sin configurar' });
    expect(peticion).not.toHaveBeenCalled();
  });
});

describe('texto del aviso interno', () => {
  it('sigue el formato exacto de B.10', async () => {
    const { textoDeAviso } = await import('@/lib/mensajeria');

    expect(
      textoDeAviso({
        nombre: 'Ana Ruiz',
        empresa: 'Floristería',
        cuando: '01.10 10:00',
        presupuesto: 'En evaluación',
      }),
    ).toBe('Nueva cita · Ana Ruiz (Floristería) · 01.10 10:00 COT · Presupuesto: En evaluación');
  });
});
