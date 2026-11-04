import { NextResponse } from 'next/server';
import { getPublicMenuById } from '@/lib/server/menuStore';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const menu = await getPublicMenuById(id);
    if (!menu) return NextResponse.json({ error: 'Menu not found.' }, { status: 404 });

    const { ownerId: _ownerId, ...publishedMenu } = menu;
    return NextResponse.json({ menu: publishedMenu }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Unable to load this menu right now.' }, { status: 500 });
  }
}
