'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  CATEGORIAS,
  EVENTO_CONFIGURAR,
  guardar,
  OBLIGATORIAS,
  TODO_NO,
  TODO_SI,
} from '@/lib/consentimiento';
import { useConsentimiento } from './useConsentimiento';

import type { Categoria, Decision } from '@/lib/consentimiento';

type Props = {
  /** Versión de la política. Si cambia, se vuelve a preguntar. */
  version: string;
};

/**
 * Aviso de cookies con configuración por categoría (Parte A §7.5).
 *
 * El aviso es corto: aceptar todo, o entrar a configurar. Dentro de la
 * configuración, cada categoría se enciende y se apaga por separado, y está el
 * botón de rechazar todo. La decisión se guarda con la fecha y la versión de la
 * política, que es lo que la vuelve una prueba consultable.
 *
 * La configuración es un `<dialog>` nativo: el foco queda atrapado, Escape
 * cierra y el navegador se encarga, sin librerías.
 */
export function AvisoCookies({ version }: Props) {
  const consentimiento = useConsentimiento(version);
  const [montado, setMontado] = useState(false);
  const [seleccion, setSeleccion] = useState<Decision>(TODO_NO);
  const dialogo = useRef<HTMLDialogElement>(null);
  const t = useTranslations('cookies');

  // El aviso solo aparece después de hidratar: así no salta el layout ni se
  // muestra un instante a quien ya respondió.
  useEffect(() => {
    const id = setTimeout(() => setMontado(true), 0);

    return () => clearTimeout(id);
  }, []);

  function abrirConfiguracion() {
    setSeleccion(consentimiento?.decision ?? TODO_NO);
    dialogo.current?.showModal();
  }

  // Volver a abrir la configuración desde el pie, o desde donde sea.
  useEffect(() => {
    const alPedir = () => abrirConfiguracion();
    window.addEventListener(EVENTO_CONFIGURAR, alPedir);

    return () => window.removeEventListener(EVENTO_CONFIGURAR, alPedir);
  });

  function decidir(decision: Decision) {
    guardar(decision, version);
    dialogo.current?.close();
  }

  function alternar(categoria: Categoria, valor: boolean) {
    setSeleccion((previa) => ({ ...previa, [categoria]: valor }));
  }

  const yaRespondio = consentimiento !== null;

  return (
    <>
      {montado && !yaRespondio ? (
        <section className="aviso-cookies" aria-label={t('titulo')} data-sin-imprimir>
          <p className="aviso-cookies-texto">
            {t('resumen')} <Link href="/politica-de-datos">{t('verPolitica')}</Link>
          </p>

          <div className="aviso-cookies-acciones">
            <button type="button" className="cta cta-primario" onClick={() => decidir(TODO_SI)}>
              {t('aceptarTodo')}
            </button>
            <button type="button" className="cta cta-secundario" onClick={abrirConfiguracion}>
              {t('configurar')}
            </button>
          </div>
        </section>
      ) : null}

      <dialog ref={dialogo} className="dialogo-cookies" aria-labelledby="cookies-titulo">
        <form method="dialog" onSubmit={(evento) => evento.preventDefault()}>
          <h2 id="cookies-titulo" className="dialogo-cookies-titulo">
            {t('titulo')}
          </h2>
          <p className="dialogo-cookies-intro">
            {t('intro')} <Link href="/politica-de-datos">{t('verPolitica')}</Link>
          </p>

          <ul className="categorias">
            {CATEGORIAS.map((categoria) => {
              const obligatoria = OBLIGATORIAS.includes(categoria);

              return (
                <li key={categoria} className="categoria">
                  <div className="categoria-control">
                    <input
                      type="checkbox"
                      id={`cookies-${categoria}`}
                      checked={obligatoria ? true : seleccion[categoria]}
                      disabled={obligatoria}
                      onChange={(evento) => alternar(categoria, evento.target.checked)}
                    />
                    <label htmlFor={`cookies-${categoria}`} className="categoria-nombre">
                      {t(`categorias.${categoria}.nombre`)}
                    </label>
                  </div>
                  <p className="categoria-detalle">
                    {t(`categorias.${categoria}.detalle`)}
                    {obligatoria ? ` ${t('siempreActiva')}` : ''}
                  </p>
                </li>
              );
            })}
          </ul>

          <div className="dialogo-cookies-acciones">
            <button type="button" className="cta cta-secundario" onClick={() => decidir(TODO_NO)}>
              {t('rechazarTodo')}
            </button>
            <button
              type="button"
              className="cta cta-secundario"
              onClick={() => decidir(seleccion)}
            >
              {t('guardarSeleccion')}
            </button>
            <button type="button" className="cta cta-primario" onClick={() => decidir(TODO_SI)}>
              {t('aceptarTodo')}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
