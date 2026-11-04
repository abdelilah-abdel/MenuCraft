import { mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type { Menu, MenuItem, MenuSection } from '@/lib/types/menu';

export type MenuInput = Omit<Menu, 'ownerId' | 'createdAt' | 'updatedAt'> &
  Partial<Pick<Menu, 'ownerId' | 'createdAt' | 'updatedAt'>>;

interface MenuStore {
  menus: Menu[];
}

const dataDirectory = process.env.MENUCRAFT_DATA_DIR || path.join(process.cwd(), '.menucraft-data');
const menuStorePath = path.join(dataDirectory, 'menus.json');
let menuWriteQueue: Promise<void> = Promise.resolve();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isMenuItem(value: unknown): value is MenuItem {
  if (!isRecord(value)) return false;
  return typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.price === 'number' && Number.isFinite(value.price) &&
    typeof value.currency === 'string' &&
    typeof value.available === 'boolean' &&
    (value.description === undefined || typeof value.description === 'string') &&
    (value.image === undefined || typeof value.image === 'string') &&
    (value.tags === undefined || (Array.isArray(value.tags) && value.tags.every((tag) => typeof tag === 'string')));
}

function isMenuSection(value: unknown): value is MenuSection {
  if (!isRecord(value)) return false;
  return typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.order === 'number' && Number.isFinite(value.order) &&
    Array.isArray(value.items) && value.items.every(isMenuItem) &&
    (value.description === undefined || typeof value.description === 'string');
}

export function isMenuInput(value: unknown): value is MenuInput {
  if (!isRecord(value) || !isRecord(value.customization)) return false;
  const customization = value.customization;
  return typeof value.id === 'string' && value.id.trim().length > 0 &&
    typeof value.restaurantName === 'string' &&
    (value.description === undefined || typeof value.description === 'string') &&
    Array.isArray(value.sections) && value.sections.every(isMenuSection) &&
    (value.template === 'classic' || value.template === 'modern' || value.template === 'minimal') &&
    typeof customization.primaryColor === 'string' &&
    typeof customization.secondaryColor === 'string' &&
    typeof customization.fontFamily === 'string' &&
    typeof customization.showPrices === 'boolean' &&
    typeof customization.showDescriptions === 'boolean' &&
    typeof customization.showImages === 'boolean' &&
    (customization.logoImage === undefined || typeof customization.logoImage === 'string') &&
    (value.createdAt === undefined || typeof value.createdAt === 'string') &&
    (value.updatedAt === undefined || typeof value.updatedAt === 'string');
}

function isStoredMenu(value: unknown): value is Menu {
  return isMenuInput(value) &&
    typeof value.ownerId === 'string' &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string';
}

async function readMenuStore(): Promise<MenuStore> {
  try {
    const contents = await readFile(menuStorePath, 'utf8');
    const parsed: unknown = JSON.parse(contents);
    if (!isRecord(parsed) || !Array.isArray(parsed.menus) || !parsed.menus.every(isStoredMenu)) {
      throw new Error('The saved menu store has an invalid format.');
    }
    return { menus: parsed.menus };
  } catch (error) {
    if (isRecord(error) && error.code === 'ENOENT') return { menus: [] };
    throw error;
  }
}

async function writeMenuStore(store: MenuStore): Promise<void> {
  await mkdir(dataDirectory, { recursive: true, mode: 0o700 });
  const temporaryPath = `${menuStorePath}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporaryPath, JSON.stringify(store, null, 2), { encoding: 'utf8', mode: 0o600 });
    await rename(temporaryPath, menuStorePath);
  } catch (error) {
    await unlink(temporaryPath).catch(() => undefined);
    throw error;
  }
}

/** Return the one saved menu belonging to an owner. */
export async function getMenuForOwner(ownerId: string): Promise<Menu | null> {
  const store = await readMenuStore();
  return store.menus.find((menu) => menu.ownerId === ownerId) || null;
}

/** Return a menu by its stable public ID. */
export async function getPublicMenuById(menuId: string): Promise<Menu | null> {
  const store = await readMenuStore();
  return store.menus.find((menu) => menu.id === menuId) || null;
}

/** Save the owner's menu, preserving its ID and creation time on later saves. */
export function saveMenuForOwner(ownerId: string, input: MenuInput): Promise<Menu> {
  if (!ownerId) return Promise.reject(new Error('An owner must be signed in to save a menu.'));

  const save = async (): Promise<Menu> => {
    const store = await readMenuStore();
    const existingMenu = store.menus.find((menu) => menu.ownerId === ownerId);
    let id = existingMenu?.id || input.id.trim();
    const idBelongsToAnotherOwner = store.menus.some((menu) => menu.id === id && menu.ownerId !== ownerId);
    if (!existingMenu && idBelongsToAnotherOwner) id = `menu-${randomUUID()}`;

    const now = new Date().toISOString();
    const savedMenu: Menu = {
      ...input,
      id,
      ownerId,
      createdAt: existingMenu?.createdAt || input.createdAt || now,
      updatedAt: now,
    };
    const menus = store.menus.filter((menu) => menu.ownerId !== ownerId && menu.id !== id);
    await writeMenuStore({ menus: [...menus, savedMenu] });
    return savedMenu;
  };

  const result = menuWriteQueue.then(save, save);
  menuWriteQueue = result.then(() => undefined, () => undefined);
  return result;
}
