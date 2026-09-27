import { describe, expect, it } from 'vitest';
import { parsearEntornoPublico, parsearEntornoServidor } from '@/lib/env';

const publicoValido = {
  NEXT_PUBLIC_SITE_URL: 'https://cgsi.example',
  NEXT_PUBLIC_APP_VERSION: '0.1.0',
  NEXT_PUBLIC_BUILD_DATE: '2026-09-21T00:00:00.000Z',
};

describe('parsearEntornoPublico', () => {
  it('devuelve los valores cuando el entorno es válido', () => {
    const env = parsearEntornoPublico(publicoValido);

    expect(env.NEXT_PUBLIC_SITE_URL).toBe('https://cgsi.example');
    expect(env.NEXT_PUBLIC_APP_VERSION).toBe('0.1.0');
  });

  it('falla, nombrando la variable, si falta la URL del sitio', () => {
    expect(() =>
      parsearEntornoPublico({ ...publicoValido, NEXT_PUBLIC_SITE_URL: undefined }),
    ).toThrow(/NEXT_PUBLIC_SITE_URL/);
  });

  it('falla si la URL del sitio no es una URL', () => {
    expect(() => parsearEntornoPublico({ ...publicoValido, NEXT_PUBLIC_SITE_URL: 'cgsi' })).toThrow(
      /NEXT_PUBLIC_SITE_URL/,
    );
  });

  it('acepta el número de WhatsApp solo como dígitos, en formato wa.me', () => {
    const env = parsearEntornoPublico({
      ...publicoValido,
      NEXT_PUBLIC_WHATSAPP_NUMERO: '573238134588',
    });

    expect(env.NEXT_PUBLIC_WHATSAPP_NUMERO).toBe('573238134588');
  });

  it('rechaza un número de WhatsApp con símbolos', () => {
    expect(() =>
      parsearEntornoPublico({ ...publicoValido, NEXT_PUBLIC_WHATSAPP_NUMERO: '+57 323 813 4588' }),
    ).toThrow(/NEXT_PUBLIC_WHATSAPP_NUMERO/);
  });

  it('trata como ausentes las variables declaradas vacías', () => {
    const env = parsearEntornoPublico({
      ...publicoValido,
      NEXT_PUBLIC_WHATSAPP_NUMERO: '',
      NEXT_PUBLIC_CAL_LINK: '',
      NEXT_PUBLIC_POSTHOG_KEY: '',
      NEXT_PUBLIC_POSTHOG_HOST: '',
    });

    expect(env.NEXT_PUBLIC_WHATSAPP_NUMERO).toBeUndefined();
    expect(env.NEXT_PUBLIC_CAL_LINK).toBeUndefined();
    expect(env.NEXT_PUBLIC_POSTHOG_KEY).toBeUndefined();
    expect(env.NEXT_PUBLIC_POSTHOG_HOST).toBeUndefined();
  });

  it('sin URL del sitio, usa la URL de producción que expone Vercel', () => {
    const env = parsearEntornoPublico({
      ...publicoValido,
      NEXT_PUBLIC_SITE_URL: '',
      NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: 'cgsi.vercel.app',
    });

    expect(env.NEXT_PUBLIC_SITE_URL).toBe('https://cgsi.vercel.app');
  });

  it('la URL del sitio declarada manda sobre la de Vercel', () => {
    const env = parsearEntornoPublico({
      ...publicoValido,
      NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: 'cgsi.vercel.app',
    });

    expect(env.NEXT_PUBLIC_SITE_URL).toBe('https://cgsi.example');
  });
});

describe('parsearEntornoServidor', () => {
  it('usa el proveedor de mensajería «ninguno» por defecto', () => {
    const env = parsearEntornoServidor({});

    expect(env.MENSAJERIA_PROVEEDOR).toBe('ninguno');
  });

  it('exige las credenciales de Evolution cuando ese es el proveedor', () => {
    expect(() => parsearEntornoServidor({ MENSAJERIA_PROVEEDOR: 'evolution' })).toThrow(
      /EVOLUTION_API_URL/,
    );
  });

  it('acepta el proveedor Evolution con sus credenciales completas', () => {
    const env = parsearEntornoServidor({
      MENSAJERIA_PROVEEDOR: 'evolution',
      EVOLUTION_API_URL: 'https://evolution.example',
      EVOLUTION_API_KEY: 'clave',
      EVOLUTION_INSTANCIA: 'cgsi',
      NOTIFICACIONES_DESTINO: '573001112233',
    });

    expect(env.MENSAJERIA_PROVEEDOR).toBe('evolution');
    expect(env.EVOLUTION_INSTANCIA).toBe('cgsi');
  });

  it('rechaza un proveedor de mensajería desconocido', () => {
    expect(() => parsearEntornoServidor({ MENSAJERIA_PROVEEDOR: 'telegram' })).toThrow(
      /MENSAJERIA_PROVEEDOR/,
    );
  });

  it('usa 1.0 como versión de la política cuando no se declara', () => {
    expect(parsearEntornoServidor({}).POLITICA_VERSION).toBe('1.0');
  });

  it('trata como ausentes las variables declaradas vacías', () => {
    const env = parsearEntornoServidor({
      MENSAJERIA_PROVEEDOR: '',
      FIREBASE_CLIENT_EMAIL: '',
      POLITICA_VERSION: '',
    });

    expect(env.MENSAJERIA_PROVEEDOR).toBe('ninguno');
    expect(env.FIREBASE_CLIENT_EMAIL).toBeUndefined();
    expect(env.POLITICA_VERSION).toBe('1.0');
  });
});
