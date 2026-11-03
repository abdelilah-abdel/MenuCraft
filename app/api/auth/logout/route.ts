import { NextResponse } from 'next/server';
import { OWNER_SESSION_COOKIE, ownerSessionCookieOptions } from '@/lib/server/ownerAuth';

export const runtime = 'nodejs';

export async function POST() {
  const response = NextResponse.json({ signedOut: true });
  response.cookies.set(OWNER_SESSION_COOKIE, '', {
    ...ownerSessionCookieOptions(),
    maxAge: 0,
  });
  response.headers.set('Cache-Control', 'no-store');
  return response;
}
