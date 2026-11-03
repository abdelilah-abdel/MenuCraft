import {
  createHmac,
  randomBytes,
  randomUUID,
  scrypt as scryptCallback,
  timingSafeEqual,
} from 'node:crypto';
import { open, readFile, rename, mkdir } from 'node:fs/promises';
import path from 'node:path';

export const OWNER_SESSION_COOKIE = 'menucraft_owner_session';
export const OWNER_SESSION_MAX_AGE = 60 * 60 * 24 * 14;

export interface OwnerIdentity {
  id: string;
  email: string;
}

interface StoredOwner extends OwnerIdentity {
  passwordSalt: string;
  passwordHash: string;
  createdAt: string;
}

interface OwnerStore {
  owners: StoredOwner[];
}

interface SessionPayload {
  ownerId: string;
  expiresAt: number;
}

export class OwnerAuthError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'OwnerAuthError';
    this.status = status;
  }
}

const dataDirectory = process.env.MENUCRAFT_DATA_DIR || path.join(process.cwd(), '.menucraft-data');
const ownerStorePath = path.join(dataDirectory, 'owners.json');
const sessionSecretPath = path.join(dataDirectory, 'session-secret');

let accountWriteQueue = Promise.resolve();

/** Derive a fixed-length password hash using scrypt and the account's random salt. */
function derivePassword(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, 64, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey);
    });
  });
}

/** Read the local account store, treating a missing file as a new installation. */
async function readOwnerStore(): Promise<OwnerStore> {
  try {
    const contents = await readFile(ownerStorePath, 'utf8');
    const store = JSON.parse(contents) as OwnerStore;
    return Array.isArray(store.owners) ? store : { owners: [] };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return { owners: [] };
    }
    throw error;
  }
}

/** Atomically replace the private local account store with the supplied accounts. */
async function writeOwnerStore(store: OwnerStore): Promise<void> {
  await mkdir(dataDirectory, { recursive: true, mode: 0o700 });
  const temporaryPath = `${ownerStorePath}.${randomUUID()}.tmp`;
  const file = await open(temporaryPath, 'wx', 0o600);

  try {
    await file.writeFile(JSON.stringify(store, null, 2), 'utf8');
  } finally {
    await file.close();
  }

  await rename(temporaryPath, ownerStorePath);
}

/** Load or create the session signing secret for local development. */
async function getSessionSecret(): Promise<Buffer> {
  const configuredSecret = process.env.MENUCRAFT_SESSION_SECRET;
  if (configuredSecret) {
    const secret = Buffer.from(configuredSecret, 'utf8');
    if (secret.length < 32) {
      throw new Error('MENUCRAFT_SESSION_SECRET must contain at least 32 characters.');
    }
    return secret;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('MENUCRAFT_SESSION_SECRET must be configured in production.');
  }

  await mkdir(dataDirectory, { recursive: true, mode: 0o700 });

  try {
    const file = await open(sessionSecretPath, 'wx', 0o600);
    const secret = randomBytes(32);
    try {
      await file.writeFile(secret);
    } finally {
      await file.close();
    }
    return secret;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error;
    }
    return readFile(sessionSecretPath);
  }
}

/** Sign an encoded session payload with the configured server secret. */
function signSessionPayload(payload: string, secret: Buffer): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

/**
 * Validate account inputs, hash the password, and persist a new owner account.
 * Email addresses are normalized to lowercase so duplicate accounts are detected consistently.
 */
export async function createOwnerAccount(
  emailInput: unknown,
  passwordInput: unknown,
): Promise<OwnerIdentity> {
  if (typeof emailInput !== 'string' || typeof passwordInput !== 'string') {
    throw new OwnerAuthError('Enter an email address and password.', 400);
  }

  const email = emailInput.trim().toLowerCase();
  const password = passwordInput;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    throw new OwnerAuthError('Enter a valid email address.', 400);
  }
  if (password.length < 10 || password.length > 128) {
    throw new OwnerAuthError('Use a password between 10 and 128 characters.', 400);
  }

  await getSessionSecret();

  const passwordSalt = randomBytes(16).toString('hex');
  const passwordHash = (await derivePassword(password, passwordSalt)).toString('hex');
  const owner: StoredOwner = {
    id: randomUUID(),
    email,
    passwordSalt,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  const addOwner = async () => {
    const store = await readOwnerStore();
    if (store.owners.some((existingOwner) => existingOwner.email === email)) {
      throw new OwnerAuthError('An account with this email already exists. Sign in instead.', 409);
    }
    await writeOwnerStore({ owners: [...store.owners, owner] });
    return { id: owner.id, email: owner.email };
  };

  const result = accountWriteQueue.then(addOwner, addOwner);
  accountWriteQueue = result.then(() => undefined, () => undefined);
  return result;
}

/** Authenticate an owner without exposing whether an email address exists. */
export async function authenticateOwner(
  emailInput: unknown,
  passwordInput: unknown,
): Promise<OwnerIdentity> {
  if (typeof emailInput !== 'string' || typeof passwordInput !== 'string') {
    throw new OwnerAuthError('Email or password is incorrect.', 401);
  }

  const email = emailInput.trim().toLowerCase();
  const store = await readOwnerStore();
  const owner = store.owners.find((existingOwner) => existingOwner.email === email);
  if (!owner) {
    throw new OwnerAuthError('Email or password is incorrect.', 401);
  }

  const candidateHash = await derivePassword(passwordInput, owner.passwordSalt);
  const storedHash = Buffer.from(owner.passwordHash, 'hex');
  if (candidateHash.length !== storedHash.length || !timingSafeEqual(candidateHash, storedHash)) {
    throw new OwnerAuthError('Email or password is incorrect.', 401);
  }

  return { id: owner.id, email: owner.email };
}

/** Create a signed, expiring token for the owner's HttpOnly session cookie. */
export async function createOwnerSessionToken(ownerId: string): Promise<string> {
  const payload: SessionPayload = {
    ownerId,
    expiresAt: Date.now() + OWNER_SESSION_MAX_AGE * 1000,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = signSessionPayload(encodedPayload, await getSessionSecret());
  return `${encodedPayload}.${signature}`;
}

/** Validate a session token and return its current owner, or null when it is invalid or expired. */
export async function getOwnerFromSessionToken(
  token: string | undefined,
): Promise<OwnerIdentity | null> {
  if (!token) return null;

  const [encodedPayload, signature, extra] = token.split('.');
  if (!encodedPayload || !signature || extra) return null;

  const expectedSignature = signSessionPayload(encodedPayload, await getSessionSecret());
  const actualSignatureBytes = Buffer.from(signature, 'base64url');
  const expectedSignatureBytes = Buffer.from(expectedSignature, 'base64url');
  if (
    actualSignatureBytes.length !== expectedSignatureBytes.length ||
    !timingSafeEqual(actualSignatureBytes, expectedSignatureBytes)
  ) {
    return null;
  }

  let payload: SessionPayload;
  try {
    payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as SessionPayload;
  } catch {
    return null;
  }
  if (
    typeof payload.ownerId !== 'string' ||
    typeof payload.expiresAt !== 'number' ||
    payload.expiresAt <= Date.now()
  ) {
    return null;
  }

  const store = await readOwnerStore();
  const owner = store.owners.find((existingOwner) => existingOwner.id === payload.ownerId);
  return owner ? { id: owner.id, email: owner.email } : null;
}

/** Return the security and lifetime options shared by owner session cookies. */
export function ownerSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: OWNER_SESSION_MAX_AGE,
  };
}
