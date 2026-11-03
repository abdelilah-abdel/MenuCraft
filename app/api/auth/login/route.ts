import { authenticateOwner } from '@/lib/server/ownerAuth';
import { handleOwnerAuthRequest } from '@/lib/server/ownerAuthRoute';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  return handleOwnerAuthRequest(request, authenticateOwner, {
    invalidJsonMessage: 'Email or password is incorrect.',
    fallbackMessage: 'Unable to sign in right now.',
  });
}
