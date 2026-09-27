import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

/**
 * En Next 16 `middleware.ts` se llama `proxy.ts` (B.1). El contrato es el mismo,
 * así que se usa el manejador de next-intl tal cual.
 */
export default createMiddleware(routing);

export const config = {
  // Se excluyen api, _next, _vercel y cualquier archivo con punto (B.7).
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
