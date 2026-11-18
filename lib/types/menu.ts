import type { MenuDesign } from '../menuDesign';
import type { TEMPLATE_CONFIGS } from '../templates/config';

export interface ImagePresentation {
  hidden?: boolean;
  fit?: 'cover' | 'contain';
  focalX?: number;
  focalY?: number;
  placement?: 'thumbnail' | 'card-top' | 'text-side' | 'banner' | 'heading-side' | 'above' | 'below';
}

// Core menu data types

export interface MenuItem {
  id: string;
  name: string;
  hidden?: boolean;
  description?: string;
  price: number;
  currency: string;
  image?: string; // base64 or URL
  imagePresentation?: ImagePresentation;
  subsectionId?: string;
  tags?: string[]; // e.g., "vegetarian", "spicy", "popular"
  available: boolean;
}

export interface MenuSubsection {
  id: string;
  name: string;
  hidden?: boolean;
  description?: string;
  order: number;
}

export interface MenuSection {
  image?: string;
  imagePresentation?: ImagePresentation;
  id: string;
  name: string;
  hidden?: boolean;
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
  logoPresentation?: ImagePresentation;
  logoSize?: number;
  bannerImage?: string;
  bannerPresentation?: ImagePresentation;
  showPrices: boolean;
  showDescriptions: boolean;
  showImages: boolean;
}

export interface Menu {
  design?: MenuDesign;
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

export type TemplateType = keyof typeof TEMPLATE_CONFIGS;

export interface MenuExport {
  version: string;
  menu: Menu;
}
