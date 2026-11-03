import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  getOwnerFromSessionToken,
  OWNER_SESSION_COOKIE,
} from '@/lib/server/ownerAuth';

export const dynamic = 'force-dynamic';

export default async function BuilderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const owner = await getOwnerFromSessionToken(cookieStore.get(OWNER_SESSION_COOKIE)?.value);

  if (!owner) {
    redirect('/sign-in?next=%2Fbuilder');
  }

  return children;
}
