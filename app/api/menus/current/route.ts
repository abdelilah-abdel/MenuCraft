import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getOwnerFromSessionToken, OWNER_SESSION_COOKIE } from '@/lib/server/ownerAuth';
import { getMenuForOwner, isMenuInput, saveMenuForOwner } from '@/lib/server/menuStore';

async function getSignedInOwner() {
  const cookieStore = await cookies();
  return getOwnerFromSessionToken(cookieStore.get(OWNER_SESSION_COOKIE)?.value);
}

export async function GET() {
  const owner = await getSignedInOwner();
  if (!owner) return NextResponse.json({ error: 'Sign in to access your menu.' }, { status: 401 });

  try {
    const menu = await getMenuForOwner(owner.id);
    return NextResponse.json({ menu }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Unable to load your menu right now.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const owner = await getSignedInOwner();
  if (!owner) return NextResponse.json({ error: 'Sign in to save your menu.' }, { status: 401 });

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: 'Send a valid menu to save.' }, { status: 400 });
  }
  if (!isMenuInput(input)) {
    return NextResponse.json({ error: 'The menu details are incomplete or invalid.' }, { status: 400 });
  }

  try {
    const menu = await saveMenuForOwner(owner.id, input);
    return NextResponse.json({ menu }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Unable to save your menu right now.' }, { status: 500 });
  }
}
