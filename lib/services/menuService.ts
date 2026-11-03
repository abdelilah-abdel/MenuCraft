import { Menu, MenuExport } from '../types/menu';

const STORAGE_KEY = 'digital-menus';
const VERSION = '1.0.0';

export class MenuService {
  private static writeMenus(menus: Menu[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(menus));
  }

  // Save menu to localStorage (for now)
  static saveMenu(menu: Menu): Menu {
    if (!menu.ownerId) {
      throw new Error('An owner must be signed in to save a menu.');
    }

    try {
      const menus = this.getAllMenus();
      const ownedMenu = menus.find((existingMenu) => existingMenu.ownerId === menu.ownerId);
      if (ownedMenu && ownedMenu.id !== menu.id) {
        menu = { ...menu, id: ownedMenu.id, createdAt: ownedMenu.createdAt };
      }

      const menuWithId = menus.find((existingMenu) => existingMenu.id === menu.id);
      if (menuWithId?.ownerId && menuWithId.ownerId !== menu.ownerId) {
        throw new Error('This menu belongs to another owner.');
      }

      const existingIndex = menus.findIndex((existingMenu) => existingMenu.id === menu.id);

      menu.updatedAt = new Date().toISOString();

      if (existingIndex >= 0) {
        menus[existingIndex] = menu;
      } else {
        menu.createdAt = new Date().toISOString();
        menus.push(menu);
      }

      this.writeMenus(menus);
      return menu;
    } catch (error) {
      console.error('Failed to save menu:', error);
      throw error instanceof Error ? error : new Error('Failed to save menu');
    }
  }

  // Get all menus
  static getAllMenus(): Menu[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load menus:', error);
      return [];
    }
  }

  // Get menu by ID
  static getMenuById(id: string): Menu | null {
    const menus = this.getAllMenus();
    return menus.find(m => m.id === id) || null;
  }

  // Each owner maintains one menu. Claim one unowned legacy menu when they first sign in.
  static getMenusForOwner(ownerId: string): Menu[] {
    const menus = this.getAllMenus();
    const ownedMenu = menus.find((menu) => menu.ownerId === ownerId);
    if (ownedMenu) return [ownedMenu];

    const legacyMenu = menus.find((menu) => !menu.ownerId);
    if (!legacyMenu) return [];

    const claimedMenu = { ...legacyMenu, ownerId };
    this.writeMenus(menus.map((menu) => menu.id === legacyMenu.id ? claimedMenu : menu));
    return [claimedMenu];
  }

  static getMenuForOwner(ownerId: string, menuId: string): Menu | null {
    return this.getMenusForOwner(ownerId).find((menu) => menu.id === menuId) || null;
  }

  // Delete menu
  static deleteMenu(id: string): void {
    try {
      const menus = this.getAllMenus();
      const filtered = menus.filter(m => m.id !== id);
      this.writeMenus(filtered);
    } catch (error) {
      console.error('Failed to delete menu:', error);
      throw new Error('Failed to delete menu');
    }
  }

  // Export menu as JSON
  static exportMenu(menu: Menu): MenuExport {
    return {
      version: VERSION,
      menu,
    };
  }

  // Import menu from JSON
  static importMenu(data: MenuExport): Menu {
    if (data.version !== VERSION) {
      console.warn(`Version mismatch. Expected ${VERSION}, got ${data.version}`);
    }
    return data.menu;
  }

  // Export menu as JSON string
  static exportMenuAsJSON(menu: Menu): string {
    const exported = this.exportMenu(menu);
    return JSON.stringify(exported, null, 2);
  }

  // Import menu from JSON string
  static importMenuFromJSON(jsonString: string): Menu {
    const data: MenuExport = JSON.parse(jsonString);
    return this.importMenu(data);
  }

  // Generate unique ID
  static generateId(): string {
    return `menu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Create default menu
  static createDefaultMenu(ownerId?: string): Menu {
    return {
      id: this.generateId(),
      ownerId,
      restaurantName: 'My Restaurant',
      description: 'Welcome to our restaurant',
      sections: [],
      template: 'classic',
      customization: {
        primaryColor: '#2563eb',
        secondaryColor: '#1e40af',
        fontFamily: 'Inter, sans-serif',
        showPrices: true,
        showDescriptions: true,
        showImages: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}
