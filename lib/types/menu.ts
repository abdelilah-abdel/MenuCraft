// Core menu data types

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  image?: string; // base64 or URL
  subsectionId?: string;
  tags?: string[]; // e.g., "vegetarian", "spicy", "popular"
  available: boolean;
}

export interface MenuSubsection {
  id: string;
  name: string;
  description?: string;
  order: number;
}

export interface MenuSection {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
  subsections?: MenuSubsection[];
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
  ownerId?: string;
  restaurantName: string;
  originalLanguage: MenuLanguage;
  description?: string;
  sections: MenuSection[];
  template: TemplateType;
  customization: MenuCustomization;
  createdAt: string;
  updatedAt: string;
}

export type MenuLanguage = 'ar' | 'fr' | 'en';

export type TemplateType =
  | 'classic'
  | 'modern'
  | 'minimal'
  | 'medina-cafe'
  | 'moroccan-fine-dining'
  | 'modern-moroccan-garden'
  | 'atlas-simple';

export interface MenuExport {
  version: string;
  menu: Menu;
}
