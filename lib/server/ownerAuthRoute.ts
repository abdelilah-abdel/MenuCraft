import { NextResponse } from 'next/server';
import {
  createOwnerSessionToken,
  OWNER_SESSION_COOKIE,
  ownerSessionCookieOptions,
  OwnerAuthError,
  type OwnerIdentity,
} from '@/lib/server/ownerAuth';

interface OwnerAuthRouteOptions {
  successStatus?: number;
  invalidJsonMessage: string;
  fallbackMessage: string;
}

/**
 * Run a registration or login operation and return its standard owner-session response.
 * The supplied operation keeps endpoint-specific account behavior separate from common
 * request parsing, cookie creation, cache headers, and error handling.
 */
export async function handleOwnerAuthRequest(
  request: Request,
  ownerOperation: (email: unknown, password: unknown) => Promise<OwnerIdentity>,
  options: OwnerAuthRouteOptions,
): Promise<NextResponse> {
  try {
    const body = await request.json();
    const owner = await ownerOperation(body?.email, body?.password);
    const token = await createOwnerSessionToken(owner.id);
    const response = NextResponse.json({ owner }, { status: options.successStatus ?? 200 });
    response.cookies.set(OWNER_SESSION_COOKIE, token, ownerSessionCookieOptions());
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (error) {
    if (error instanceof OwnerAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: options.invalidJsonMessage }, { status: 400 });
    }
    return NextResponse.json({ error: options.fallbackMessage }, { status: 500 });
  }
}
