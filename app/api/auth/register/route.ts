import { createOwnerAccount } from '@/lib/server/ownerAuth';
import { handleOwnerAuthRequest } from '@/lib/server/ownerAuthRoute';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  return handleOwnerAuthRequest(request, createOwnerAccount, {
    successStatus: 201,
    invalidJsonMessage: 'Enter an email address and password.',
    fallbackMessage: 'Unable to create your account right now.',
  });
}
