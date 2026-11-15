import React from 'react';
import { Menu, MenuItem as MenuItemType } from '../types/menu';
import { getMenuSectionGroups, getVisibleMenuSections, localizedMenuText, MenuItemPhoto, MenuItemTags, menuDirection, SoldOutLabel, formatMenuPrice } from './menuTemplateUtils';

interface TemplateProps { menu: Menu }

export const MinimalTemplate: React.FC<TemplateProps> = ({ menu }) => {
  const { customization, restaurantName, description } = menu;
  const sections = getVisibleMenuSections(menu);

  return (
    <main dir={menuDirection(menu)} lang={menu.originalLanguage} className="min-h-screen bg-white px-6 py-10 text-black sm:px-12 sm:py-16" style={{ fontFamily: customization.fontFamily }}>
      <header className="mx-auto mb-14 max-w-3xl">
        {customization.logoImage && <img src={customization.logoImage} alt={`${restaurantName} logo`} className="mb-8 h-16 max-w-40 object-contain" />}
        <h1 className="font-sans text-5xl font-light tracking-tight sm:text-6xl">{restaurantName}</h1>
        {description && <p className="mt-5 text-lg font-light leading-relaxed text-gray-500">{description}</p>}
      </header>
      <div className="mx-auto max-w-3xl space-y-16">
        {sections.length === 0 && <p className="py-12 text-center text-lg text-gray-500">{localizedMenuText(menu.originalLanguage, 'Menu coming soon', 'Menu bientôt disponible', 'قائمة الطعام قريباً')}</p>}
        {sections.map((section) => (
          <section key={section.id}>
            <header className="mb-7">
              <h2 className="text-xl font-medium uppercase tracking-[0.22em]" style={{ color: customization.primaryColor }}>{section.name}</h2>
              {section.description && <p className="mt-2 text-sm font-light text-gray-500">{section.description}</p>}
            </header>
            <div className="space-y-8">
              {getMenuSectionGroups(section).map((group) => (
                <div key={group.subsection?.id || 'section-items'}>
                  {group.subsection && <h3 className="mb-5 border-b border-gray-100 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">{group.subsection.name}</h3>}
                  {group.subsection?.description && <p className="mb-4 text-sm font-light text-gray-500">{group.subsection.description}</p>}
                  <div className="space-y-7">{group.items.map((item) => <MinimalMenuItem key={item.id} item={item} customization={customization} language={menu.originalLanguage} />)}</div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
};

const MinimalMenuItem: React.FC<{ item: MenuItemType; customization: Menu['customization']; language: Menu['originalLanguage'] }> = ({ item, customization, language }) => (
  <article className={`flex gap-5 border-b border-gray-100 pb-6 last:border-0 ${!item.available ? 'opacity-70' : ''}`}>
    <MenuItemPhoto item={item} showImages={customization.showImages} className="h-24 w-24 shrink-0 rounded-sm object-cover sm:h-28 sm:w-28" />
    <div className="min-w-0 flex-1">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-xl font-light text-black">{item.name || 'Untitled dish'}</h3>
        {customization.showPrices && <span className="shrink-0 text-lg font-light text-black">{formatMenuPrice(item)}</span>}
      </div>
      <MenuItemTags item={item} className="mt-2 text-gray-500" />
      {customization.showDescriptions && item.description && <p className="mt-3 font-light leading-relaxed text-gray-500">{item.description}</p>}
      {!item.available && <SoldOutLabel className="mt-2" language={language} />}
    </div>
  </article>
);
