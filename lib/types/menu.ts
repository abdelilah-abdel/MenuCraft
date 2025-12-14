// Core menu data types

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  image?: string; // base64 or URL
  tags?: string[]; // e.g., "vegetarian", "spicy", "popular"
  available: boolean;
}

export interface MenuSection {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
  order: number;
}

export interface MenuCustomization {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  logoImage?: string; // base64 or URL
  showPrices: boolean;
  showDescriptions: boolean;
  showImages: boolean;
}

export interface Menu {
  id: string;
  restaurantName: string;
  description?: string;
  sections: MenuSection[];
  template: TemplateType;
  customization: MenuCustomization;
  createdAt: string;
  updatedAt: string;
}

export type TemplateType = 'classic' | 'modern' | 'minimal';

export interface MenuExport {
  version: string;
  menu: Menu;
}
