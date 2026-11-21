import { SectionPhoto } from './SectionPhoto';
import { RestaurantLogo, RestaurantBanner } from './RestaurantImages';
import React from 'react';
import { Menu, MenuItem as MenuItemType } from '../types/menu';
import { MenuEmptyState, getMenuSectionGroups, getVisibleMenuSections, localizedMenuText, MenuItemPhoto, MenuItemTags, menuDirection, SoldOutLabel, formatMenuPrice } from './menuTemplateUtils';
import { PreviewHeading, usePreviewTarget } from './previewSelection';

interface TemplateProps { menu: Menu }

export const ClassicTemplate: React.FC<TemplateProps> = ({ menu }) => {
  const { customization, restaurantName, description } = menu;
  const sections = getVisibleMenuSections(menu);
  const previewTarget = usePreviewTarget();

  return (
    <main dir={menuDirection(menu)} lang={menu.originalLanguage} className="min-h-screen bg-[#faf9f6] p-6 sm:p-8" style={{ fontFamily: customization.fontFamily }}>
      <header className="mx-auto mb-12 max-w-4xl text-center">
        <RestaurantBanner menu={menu} position="above" />
        <RestaurantLogo menu={menu} className="mx-auto mb-6 h-24 max-w-48 object-contain" />
        <PreviewHeading as="h1" target={{ kind: 'restaurant' }} editLabel={`Edit restaurant ${restaurantName} in preview`} className="mb-4 font-serif text-4xl font-bold sm:text-5xl" style={{ color: customization.primaryColor }}>{restaurantName}</PreviewHeading>
        {customization.showDescriptions && description && <p className="mx-auto max-w-2xl text-lg text-gray-600">{description}</p>}
        <div className="mx-auto mt-4 h-1 w-32" style={{ backgroundColor: customization.primaryColor }} />
      <RestaurantBanner menu={menu} position="below" />
      </header>

      <div className="mx-auto max-w-4xl space-y-12">
        {sections.length === 0 && <p className="py-12 text-center font-serif text-xl text-gray-500">{<MenuEmptyState language={menu.originalLanguage} />}</p>}
        {sections.map((section) => (
          <section key={section.id} className="border-b border-gray-200 pb-8 last:border-0">
            <div className="mb-8 text-center">
              <SectionPhoto menu={menu} section={section} /><PreviewHeading as="h2" target={{ kind: 'section', sectionId: section.id }} editLabel={`Edit section ${section.name} in preview`} className="mb-2 font-serif text-3xl font-semibold" style={{ color: customization.secondaryColor }}>{section.name}</PreviewHeading>
              {customization.showDescriptions && section.description && <p className="italic text-gray-600">{section.description}</p>}
            </div>
            <div className="space-y-7">
              {getMenuSectionGroups(section).map((group) => (
                <div key={group.subsection?.id || 'section-items'}>
                  {group.subsection && <PreviewHeading as="h3" target={{ kind: 'subsection', sectionId: section.id, subsectionId: group.subsection.id }} editLabel={`Edit subsection ${group.subsection.name} in preview`} className="mb-3 border-b border-gray-200 pb-2 text-sm font-bold uppercase tracking-[0.18em] text-gray-600">{group.subsection.name}</PreviewHeading>}
                  {customization.showDescriptions && group.subsection?.description && <p className="mb-3 text-sm italic text-gray-500">{group.subsection.description}</p>}
                  <div className="space-y-6">{group.items.map((item) => <ClassicMenuItem key={item.id} sectionId={section.id} item={item} customization={customization} language={menu.originalLanguage} />)}</div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
};

const ClassicMenuItem: React.FC<{ sectionId: string; item: MenuItemType; customization: Menu['customization']; language: Menu['originalLanguage'] }> = ({ sectionId, item, customization, language }) => {
  const previewTarget = usePreviewTarget();
  return <article {...previewTarget({ kind: 'item', sectionId, itemId: item.id }, `Edit dish ${item.name || 'Untitled dish'} in preview`)} className={`flex gap-4 ${!item.available ? 'opacity-75' : ''}`}>
    <MenuItemPhoto item={item} showImages={customization.showImages} className="h-24 w-24 shrink-0 rounded-lg object-cover shadow-sm" />
    <div className="min-w-0 flex-1">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 data-menu-role="dish-name" className="font-serif text-xl font-semibold text-gray-900">{item.name || 'Untitled dish'}</h3>
          <MenuItemTags item={item} className="mt-1" />
        </div>
        {customization.showPrices && <span data-menu-role="price" className="shrink-0 text-lg font-semibold" style={{ color: customization.primaryColor }}>{formatMenuPrice(item)}</span>}
      </div>
      {customization.showDescriptions && item.description && <p className="mt-1 leading-relaxed text-gray-600">{item.description}</p>}
      {!item.available && <SoldOutLabel className="mt-2" language={language} />}
    </div>
  </article>;
};
