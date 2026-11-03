import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  getOwnerFromSessionToken,
  OWNER_SESSION_COOKIE,
} from '@/lib/server/ownerAuth';

export const runtime = 'nodejs';

export async function GET() {
  const cookieStore = await cookies();
  const owner = await getOwnerFromSessionToken(cookieStore.get(OWNER_SESSION_COOKIE)?.value);
  return NextResponse.json({ owner }, { headers: { 'Cache-Control': 'no-store' } });
}
