import React from 'react';
import { Menu, MenuItem as MenuItemType } from '../types/menu';
import { getMenuSectionGroups, getVisibleMenuSections, localizedMenuText, MenuItemPhoto, MenuItemTags, menuDirection, SoldOutLabel, formatMenuPrice } from './menuTemplateUtils';

interface TemplateProps { menu: Menu }

export const ModernTemplate: React.FC<TemplateProps> = ({ menu }) => {
  const { customization, restaurantName, description } = menu;
  const sections = getVisibleMenuSections(menu);

  return (
    <main dir={menuDirection(menu)} lang={menu.originalLanguage} className="min-h-screen bg-[#0f0f0f] text-white" style={{ fontFamily: customization.fontFamily }}>
      <header className="px-6 py-16 sm:px-8 sm:py-20" style={{ background: `linear-gradient(135deg, ${customization.primaryColor} 0%, ${customization.secondaryColor} 100%)` }}>
        <div className="mx-auto max-w-6xl text-center">
          {customization.logoImage && <img src={customization.logoImage} alt={`${restaurantName} logo`} className="mx-auto mb-6 h-20 max-w-48 object-contain" />}
          <h1 className="font-sans text-5xl font-bold tracking-tight sm:text-6xl">{restaurantName}</h1>
          {description && <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">{description}</p>}
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        {sections.length === 0 && <p className="py-12 text-center text-lg text-gray-400">{localizedMenuText(menu.originalLanguage, 'Menu coming soon', 'Menu bientôt disponible', 'قائمة الطعام قريباً')}</p>}
        {sections.map((section) => (
          <section key={section.id} className="mb-14">
            <header className="mb-7">
              <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: customization.primaryColor }}>{section.name}</h2>
              {section.description && <p className="mt-2 text-gray-400">{section.description}</p>}
              <div className="mt-4 h-1 w-20" style={{ backgroundColor: customization.primaryColor }} />
            </header>
            <div className="space-y-8">
              {getMenuSectionGroups(section).map((group) => (
                <div key={group.subsection?.id || 'section-items'}>
                  {group.subsection && <h3 className="mb-4 text-lg font-bold uppercase tracking-widest text-white/75">{group.subsection.name}</h3>}
                  {group.subsection?.description && <p className="mb-4 text-gray-400">{group.subsection.description}</p>}
                  <div className="grid gap-5 md:grid-cols-2">{group.items.map((item) => <ModernMenuItem key={item.id} item={item} customization={customization} language={menu.originalLanguage} />)}</div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
};

const ModernMenuItem: React.FC<{ item: MenuItemType; customization: Menu['customization']; language: Menu['originalLanguage'] }> = ({ item, customization, language }) => (
  <article className={`overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 ${!item.available ? 'opacity-75' : ''}`}>
    <MenuItemPhoto item={item} showImages={customization.showImages} className="h-48 w-full object-cover" />
    <div className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0"><h3 className="text-xl font-bold text-white">{item.name || 'Untitled dish'}</h3><MenuItemTags item={item} className="mt-2 text-white" /></div>
        {customization.showPrices && <span className="shrink-0 text-xl font-bold" style={{ color: customization.primaryColor }}>{formatMenuPrice(item)}</span>}
      </div>
      {customization.showDescriptions && item.description && <p className="mt-3 leading-relaxed text-gray-400">{item.description}</p>}
      {!item.available && <SoldOutLabel className="mt-3" language={language} />}
    </div>
  </article>
);
