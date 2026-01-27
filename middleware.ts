import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { updateSession } from './lib/supabase/middleware';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
    // Handle Admin Auth
    if (request.nextUrl.pathname.startsWith('/admin')) {
        return await updateSession(request);
    }

    // Handle i18n
    return intlMiddleware(request);
}

export const config = {
    // Match only internationalized pathnames, plus admin
    matcher: [
        '/',
        '/(fr|en|es)/:path*',
        '/admin/:path*'
    ]
};
