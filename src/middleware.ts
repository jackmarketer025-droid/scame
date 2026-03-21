
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - …/_next (Next.js internals)
  // - …/_vercel (Vercel internals)
  // - …/api (API routes)
  // - all root files inside `public` (e.g. /favicon.ico)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
