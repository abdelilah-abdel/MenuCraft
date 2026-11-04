import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { mkdtemp, rm } from 'node:fs/promises';
import { createServer } from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { after, before, test } from 'node:test';

let appProcess;
let appUrl;
let temporaryDataDirectory;
let appOutput = '';

async function reservePort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Unable to reserve a test port.');
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  return address.port;
}

async function waitForApp() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (appProcess.exitCode !== null) {
      throw new Error(`MenuCraft exited before starting.\n${appOutput}`);
    }
    try {
      const response = await fetch(`${appUrl}/api/auth/session`);
      if (response.ok) return;
    } catch {
      // The development server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`MenuCraft did not start in time.\n${appOutput}`);
}

before(async () => {
  temporaryDataDirectory = await mkdtemp(path.join(os.tmpdir(), 'menucraft-owner-auth-'));
  const port = await reservePort();
  appUrl = `http://127.0.0.1:${port}`;
  appProcess = spawn(
    process.execPath,
    ['node_modules/next/dist/bin/next', 'dev', '--hostname', '127.0.0.1', '--port', String(port)],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        CI: '1',
        MENUCRAFT_DATA_DIR: temporaryDataDirectory,
        MENUCRAFT_SESSION_SECRET: randomBytes(32).toString('hex'),
        NEXT_TELEMETRY_DISABLED: '1',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  appProcess.stdout.setEncoding('utf8').on('data', (chunk) => { appOutput += chunk; });
  appProcess.stderr.setEncoding('utf8').on('data', (chunk) => { appOutput += chunk; });
  await waitForApp();
});

after(async () => {
  if (appProcess && appProcess.exitCode === null) {
    appProcess.kill('SIGTERM');
    await Promise.race([
      new Promise((resolve) => appProcess.once('exit', resolve)),
      new Promise((resolve) => setTimeout(resolve, 5000)),
    ]);
  }
  if (temporaryDataDirectory) {
    await rm(temporaryDataDirectory, { recursive: true, force: true });
  }
});

test('owner menu changes persist across sign-out, device sign-in, and the public link', async () => {
  const anonymousBuilder = await fetch(`${appUrl}/builder`, { redirect: 'manual' });
  assert.equal(anonymousBuilder.status, 307);
  assert.match(anonymousBuilder.headers.get('location') || '', /\/sign-in/);

  const publicMenu = await fetch(`${appUrl}/menu/shared-menu-id`);
  assert.equal(publicMenu.status, 200);
  assert.match(publicMenu.headers.get('content-type') || '', /text\/html/);
  const anonymousOwnerMenu = await fetch(`${appUrl}/api/menus/current`);
  assert.equal(anonymousOwnerMenu.status, 401);

  const signUp = await fetch(`${appUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'OWNER@example.com', password: 'menu-owner-password' }),
  });
  assert.equal(signUp.status, 201);
  const signedUp = await signUp.json();
  assert.equal(signedUp.owner.email, 'owner@example.com');
  assert.equal('passwordHash' in signedUp.owner, false);

  const sessionCookieHeader = signUp.headers.get('set-cookie') || '';
  assert.match(sessionCookieHeader, /HttpOnly/i);
  const sessionCookie = sessionCookieHeader.split(';')[0];
  const session = await fetch(`${appUrl}/api/auth/session`, {
    headers: { Cookie: sessionCookie },
  });
  assert.equal((await session.json()).owner.id, signedUp.owner.id);

  const ownerBuilder = await fetch(`${appUrl}/builder`, {
    headers: { Cookie: sessionCookie },
    redirect: 'manual',
  });
  assert.equal(ownerBuilder.status, 200);

  const duplicateAccount = await fetch(`${appUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'owner@example.com', password: 'another-owner-password' }),
  });
  assert.equal(duplicateAccount.status, 409);

  const menuSave = await fetch(`${appUrl}/api/menus/current`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: sessionCookie },
    body: JSON.stringify({
      id: 'menu-from-owner-device',
      restaurantName: 'Atlas Kitchen',
      description: 'Seasonal Moroccan plates',
      sections: [{
        id: 'section-lunch',
        name: 'Lunch',
        description: 'Served daily',
        order: 0,
        items: [{
          id: 'item-tagine',
          name: 'Vegetable tagine',
          description: 'Slow cooked with preserved lemon',
          price: 72,
          currency: 'MAD',
          tags: ['vegetarian', 'popular'],
          available: false,
        }],
      }],
      template: 'modern',
      customization: {
        primaryColor: '#123456',
        secondaryColor: '#654321',
        fontFamily: 'Georgia, serif',
        logoImage: 'data:image/png;base64,ZmFrZQ==',
        showPrices: true,
        showDescriptions: true,
        showImages: false,
      },
    }),
  });
  assert.equal(menuSave.status, 200);
  const firstSave = (await menuSave.json()).menu;
  assert.equal(firstSave.ownerId, signedUp.owner.id);
  assert.equal(firstSave.restaurantName, 'Atlas Kitchen');
  assert.equal(firstSave.description, 'Seasonal Moroccan plates');
  assert.equal(firstSave.sections[0].name, 'Lunch');
  assert.equal(firstSave.sections[0].description, 'Served daily');
  assert.equal(firstSave.sections[0].items[0].name, 'Vegetable tagine');
  assert.equal(firstSave.sections[0].items[0].currency, 'MAD');
  assert.equal(firstSave.sections[0].items[0].price, 72);
  assert.deepEqual(firstSave.sections[0].items[0].tags, ['vegetarian', 'popular']);
  assert.equal(firstSave.sections[0].items[0].available, false);
  assert.equal(firstSave.template, 'modern');
  assert.equal(firstSave.customization.primaryColor, '#123456');

  const dinerMenu = await fetch(`${appUrl}/api/menus/${firstSave.id}`);
  assert.equal(dinerMenu.status, 200);
  assert.match(dinerMenu.headers.get('cache-control') || '', /no-store/i);
  const publishedMenu = (await dinerMenu.json()).menu;
  assert.equal(publishedMenu.restaurantName, 'Atlas Kitchen');
  assert.equal('ownerId' in publishedMenu, false);
  const dinerPage = await fetch(`${appUrl}/menu/${firstSave.id}`);
  assert.equal(dinerPage.status, 200);

  const logout = await fetch(`${appUrl}/api/auth/logout`, {
    method: 'POST',
    headers: { Cookie: sessionCookie },
  });
  assert.equal(logout.status, 200);
  const signedOutSession = await fetch(`${appUrl}/api/auth/session`);
  assert.equal((await signedOutSession.json()).owner, null);
  const signedOutBuilder = await fetch(`${appUrl}/builder`, { redirect: 'manual' });
  assert.equal(signedOutBuilder.status, 307);

  const signIn = await fetch(`${appUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'owner@example.com', password: 'menu-owner-password' }),
  });
  assert.equal(signIn.status, 200);
  const signInCookie = (signIn.headers.get('set-cookie') || '').split(';')[0];
  const restoredSession = await fetch(`${appUrl}/api/auth/session`, {
    headers: { Cookie: signInCookie },
  });
  assert.equal((await restoredSession.json()).owner.id, signedUp.owner.id);

  const secondDeviceMenu = await fetch(`${appUrl}/api/menus/current`, {
    headers: { Cookie: signInCookie },
  });
  assert.equal(secondDeviceMenu.status, 200);
  const restoredMenu = (await secondDeviceMenu.json()).menu;
  assert.deepEqual(restoredMenu, firstSave);
  assert.equal(restoredMenu.id, firstSave.id);
  assert.equal(restoredMenu.restaurantName, 'Atlas Kitchen');
  assert.equal(restoredMenu.sections[0].items[0].available, false);
  assert.equal(restoredMenu.customization.logoImage, 'data:image/png;base64,ZmFrZQ==');

  const laterSave = await fetch(`${appUrl}/api/menus/current`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: signInCookie },
    body: JSON.stringify({
      ...restoredMenu,
      id: 'stale-menu-id-from-another-device',
      restaurantName: 'Atlas Kitchen Updated',
    }),
  });
  assert.equal(laterSave.status, 200);
  const updatedMenu = (await laterSave.json()).menu;
  assert.equal(updatedMenu.id, firstSave.id);
  assert.equal(updatedMenu.restaurantName, 'Atlas Kitchen Updated');

  const updatedPublicMenu = await fetch(`${appUrl}/api/menus/${firstSave.id}`);
  assert.equal(updatedPublicMenu.status, 200);
  assert.equal((await updatedPublicMenu.json()).menu.restaurantName, 'Atlas Kitchen Updated');

  const badPassword = await fetch(`${appUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'owner@example.com', password: 'wrong-password' }),
  });
  assert.equal(badPassword.status, 401);
});
